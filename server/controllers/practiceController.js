import { query } from '../config/db.js';
import { generateQuestions, evaluateInterview, generateInterviewQuestions, analyzeResume, generateDailyQuest } from '../services/aiService.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import fs from 'fs';

// ... (other functions)

// @desc    Analyze user resume
// @route   POST /api/practice/analyze-resume
export const analyzeUserResume = async (req, res) => {
    const { role, level } = req.body;
    let resumeText = req.body.resumeText;

    try {
        if (req.file) {
            // PDF file uploaded
            const dataBuffer = fs.readFileSync(req.file.path);
            
            // Handle modern pdf-parse v2 (esm-first with PDFParse class)
            const PDFParseClass = typeof pdf === 'function' ? pdf : pdf.PDFParse;
            if (PDFParseClass) {
                const parser = new PDFParseClass({ data: dataBuffer });
                const textResult = await parser.getText();
                resumeText = textResult.text;
                await parser.destroy();
            } else if (typeof pdf === 'function') {
                // Fallback for older pdf-parse version
                const data = await pdf(dataBuffer);
                resumeText = data.text;
            } else {
                throw new Error('PDF parsing library not loaded correctly');
            }
        }

        if (!resumeText) {
            return res.status(400).json({ message: 'Resume text or PDF file is required' });
        }

        const analysis = await analyzeResume(resumeText, role, level);
        res.json(analysis);
    } catch (error) {
        console.error('Resume Analysis Controller Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get available roles
// @route   GET /api/practice/roles
export const getRoles = async (req, res) => {
    const roles = {
        technical: ['Developer', 'Software Engineer', 'Data Analyst', 'Cyber Security'],
        nonTechnical: ['HR', 'Customer Support', 'Project Manager']
    };
    res.json(roles);
};

// @desc    Start practice session and generate questions
// @route   POST /api/practice/start
export const startPractice = async (req, res) => {
    const { role, level, customQuestions } = req.body;
    const userId = req.user.id;

    try {
        console.log('Starting practice for:', { role, level, userId, isCustom: !!customQuestions });

        let questions = [];

        if (customQuestions && Array.isArray(customQuestions)) {
            // Use custom questions (e.g. from Resume Analysis)
            for (let q of customQuestions) {
                const questionText = q.question || q.questionText;
                const answerText = q.answerText || "Prepare an answer highlighting your relevant experience.";
                const category = q.type || q.category || "General";

                const check = await query('SELECT id FROM questions WHERE role = $1 AND question_text = $2', [role, questionText]);
                
                let qId;
                if (check.rows.length === 0) {
                    const inserted = await query(
                        'INSERT INTO questions (role, level, question_text, answer_text, category) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                        [role, level, questionText, answerText, category]
                    );
                    qId = inserted.rows[0].id;
                } else {
                    qId = check.rows[0].id;
                }
                
                questions.push({
                    id: qId,
                    questionText: questionText,
                    answerText: answerText,
                    category: category
                });
            }
        } else {
            // 1. Fetch random questions from the database
            const dbQuestions = await query(
                'SELECT id, role, level, question_text as questionText, answer_text as answerText, category FROM questions WHERE role = $1 ORDER BY RANDOM() LIMIT 10',
                [role]
            );

            questions = dbQuestions.rows;

            // 2. If we don't have 10, fill the rest with AI generation
            if (questions.length < 10) {
                const needed = 10 - questions.length;
                const aiQuestions = await generateQuestions(role, level, needed);

                for (let q of aiQuestions) {
                    const check = await query('SELECT id FROM questions WHERE role = $1 AND question_text = $2', [role, q.questionText]);
                    if (check.rows.length === 0) {
                        const inserted = await query(
                            'INSERT INTO questions (role, level, question_text, answer_text, category) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                            [role, level, q.questionText, q.answerText, q.category]
                        );
                        q.id = inserted.rows[0].id;
                    } else {
                        q.id = check.rows[0].id;
                    }
                    questions.push(q);
                }
            }
        }

        const sessionResult = await query(
            'INSERT INTO interview_sessions (user_id, role, level) VALUES ($1, $2, $3) RETURNING id',
            [userId, role, level]
        );

        res.status(201).json({
            sessionId: sessionResult.rows[0].id,
            questions: questions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit an answer for a question
// @route   POST /api/practice/submit-answer
export const submitAnswer = async (req, res) => {
    const { sessionId, questionId, questionText, answerText } = req.body;

    try {
        // For AI-generated questions, question_id is a string like "ai-123456-0"
        // We store NULL for question_id and keep the full question text
        const isAIQuestion = typeof questionId === 'string' && questionId.startsWith('ai-');

        await query(
            'INSERT INTO answers (session_id, question_id, question_text, answer_text) VALUES ($1, $2, $3, $4)',
            [sessionId, isAIQuestion ? null : questionId, questionText, answerText]
        );
        res.json({ message: 'Answer saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete the test and generate result
// @route   POST /api/practice/submit-test
export const submitTest = async (req, res) => {
    const { sessionId } = req.body;

    try {
        // Get session info
        const sResult = await query('SELECT * FROM interview_sessions WHERE id = $1', [sessionId]);
        const session = sResult.rows[0];

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Get answers joined with reference answers from questions table
        const aResult = await query(`
            SELECT a.*, q.answer_text as "referenceAnswer"
            FROM answers a
            LEFT JOIN questions q ON a.question_id = q.id
            WHERE a.session_id = $1
        `, [sessionId]);
        const answers = aResult.rows;

        // Perform AI Evaluation
        const evaluation = await evaluateInterview(sessionId, answers);

        // Update session with score and feedback
        await query(
            'UPDATE interview_sessions SET status = $1, score = $2, ai_feedback = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
            ['completed', evaluation.score, evaluation.aiFeedback, sessionId]
        );

        // Check readiness and provide targeted questions if needed
        let targetedQuestions;
        try {
            targetedQuestions = await generateInterviewQuestions(session.role, session.level, 3, evaluation.weaknesses);
        } catch (err) {
            console.warn('Fallback to static questions for readiness check:', err.message);
            targetedQuestions = await generateQuestions(session.role, session.level, 3);
        }

        const readinessCheck = {
            laggingSkills: evaluation.weaknesses,
            targetedQuestions
        };

        // Add readinessCheck to analytics object to store it in history
        evaluation.analytics.readinessCheck = readinessCheck;

        // Create test result with full analytics
        const resultInsert = await query(
            `INSERT INTO test_results (
                user_id, session_id, role, level, score, total_questions, reasoning, 
                analytics, strengths, weaknesses, suggestions
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                session.user_id,
                sessionId,
                session.role,
                session.level,
                evaluation.score,
                answers.length,
                evaluation.reasoning,
                JSON.stringify(evaluation.analytics),
                evaluation.strengths,
                evaluation.weaknesses,
                evaluation.suggestions
            ]
        );

        const finalResult = resultInsert.rows[0];
        try {
            finalResult.analytics = typeof finalResult.analytics === 'string' ? JSON.parse(finalResult.analytics) : finalResult.analytics;
        } catch (e) {
            finalResult.analytics = {};
        }

        res.json({
            ...finalResult,
            attemptDate: finalResult.attempt_date,
            readinessCheck
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload interview video
// @route   POST /api/practice/upload-video
export const uploadVideo = async (req, res) => {
    const { sessionId } = req.body;
    const videoUrl = req.file?.path;

    if (!videoUrl) {
        return res.status(400).json({ message: 'No video file provided' });
    }

    try {
        await query(
            'UPDATE interview_sessions SET video_path = $1 WHERE id = $2',
            [videoUrl, sessionId]
        );
        res.json({ message: 'Video uploaded successfully', videoUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's progress/history
// @route   GET /api/practice/progress
export const getProgress = async (req, res) => {
    const userId = req.user.id;

    try {
        const history = await query(
            `SELECT id as "_id", role, level, score, total_questions as "totalQuestions", 
            attempt_date as "attemptDate", reasoning, strengths, weaknesses, suggestions, analytics 
            FROM test_results WHERE user_id = $1 ORDER BY attempt_date DESC`,
            [userId]
        );

        // Parse analytics JSON
        const parsedHistory = history.rows.map(h => {
            try {
                h.analytics = typeof h.analytics === 'string' ? JSON.parse(h.analytics) : h.analytics;

                // Extract readinessCheck for the frontend route format
                if (h.analytics && h.analytics.readinessCheck) {
                    h.readinessCheck = h.analytics.readinessCheck;
                }
            } catch (e) {
                h.analytics = {};
            }
            return h;
        });

        res.json(parsedHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get daily quest questions
// @route   GET /api/practice/daily-quest
export const getDailyQuest = async (req, res) => {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    try {
        const userResult = await query('SELECT last_quest_date, daily_quest_count, professional_role, experience_level FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (user && user.last_quest_date === today) {
            return res.json({ completed: true, message: 'You have already completed today\'s quest!' });
        }

        const role = user.professional_role || 'Developer';
        const level = user.experience_level || 'Intermediate';

        // Get previously asked questions to ensure uniqueness
        const historyResult = await query(
            `SELECT DISTINCT question_text FROM answers a 
             JOIN interview_sessions s ON a.session_id = s.id 
             WHERE s.user_id = $1`,
            [userId]
        );
        const historyText = historyResult.rows.map(r => r.question_text);

        let questQuestions = await generateDailyQuest(role, level, 1);
        
        // Filter out duplicates from history
        questQuestions = questQuestions.filter(q => !historyText.includes(q.questionText));

        // If we filtered it out, generate more until we have at least one unique question
        if (questQuestions.length === 0) {
            const moreQuestions = await generateDailyQuest(role, level, 3);
            questQuestions = [moreQuestions.find(q => !historyText.includes(q.questionText))].filter(Boolean);
        }

        res.json({ 
            questions: questQuestions, 
            completed: false, 
            dayCount: (user.daily_quest_count || 0) + 1 
        });
    } catch (error) {
        console.error("Batch Quest Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete daily quest
// @route   POST /api/practice/complete-quest
export const completeDailyQuest = async (req, res) => {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    try {
        const userResult = await query('SELECT last_quest_date, daily_quest_count FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0] || {};

        if (user.last_quest_date === today) {
            return res.status(400).json({ message: 'Quest already completed for today' });
        }

        const newCount = (user.daily_quest_count || 0) + 1;
        await query('UPDATE users SET daily_quest_count = $1, last_quest_date = $2 WHERE id = $3', [newCount, today, userId]);

        res.json({ message: 'Quest completed successfully!', dailyQuestCount: newCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Log a proctoring violation
 */
export const logProctoringViolation = async (req, res) => {
    const { sessionId, violationType, description } = req.body;
    try {
        await query(
            'INSERT INTO proctoring_logs (session_id, violation_type, description) VALUES ($1, $2, $3)',
            [sessionId, violationType, description]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Terminate interview due to violation
 */
export const terminateInterview = async (req, res) => {
    const { sessionId, reason } = req.body;
    try {
        // Update session status to 'cancelled' or similar, but keep data
        await query(
            'UPDATE interview_sessions SET status = $1, violation_reason = $2 WHERE id = $3',
            ['terminated', reason, sessionId]
        );
        res.json({ success: true, message: 'Interview terminated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
