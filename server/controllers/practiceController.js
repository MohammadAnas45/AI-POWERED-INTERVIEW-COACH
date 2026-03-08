import { query } from '../config/db.js';
import { generateQuestions, evaluateInterview } from '../services/aiService.js';

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
    const { role, level } = req.body;
    const userId = req.user.id;

    try {
        console.log('Starting practice for:', { role, level, userId });

        // 1. Fetch random questions from the database
        const dbQuestions = await query(
            'SELECT id, role, level, question_text as questionText, answer_text as answerText, category FROM questions WHERE role = $1 ORDER BY RANDOM() LIMIT 10',
            [role]
        );

        let questions = dbQuestions.rows;

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
        await query(
            'INSERT INTO answers (session_id, question_id, question_text, answer_text) VALUES ($1, $2, $3, $4)',
            [sessionId, questionId, questionText, answerText]
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

        // Check readiness and provide targeted questions if needed
        // (Simulated as part of return object)
        const readinessCheck = {
            laggingSkills: evaluation.weaknesses,
            targetedQuestions: await generateQuestions(session.role, session.level, 3)
        };

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

