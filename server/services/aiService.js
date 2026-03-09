// AI Service for Generation and Evaluation
// In a production app, you'd call OpenAI, Anthropic, Gemini, etc.

export const generateQuestions = async (role, level, count = 10) => {
    // Simulated AI Question Generator
    // It returns structured objects matching the DB schema but with fresh content.

    const pools = {
        "Developer": [
            {
                q: "Explain the concept of closure in JavaScript.",
                a: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.\n\nDetailed breakdown:\n1. Lexical Scoping: The outer function defines the scope for the inner function.\n2. Persistence: The inner function 'remembers' the variables from its birth scope even after the outer function has returned.\n3. Use Cases: Used for data privacy (private variables), function factories, and maintained state in asynchronous callbacks."
            },
            {
                q: "What is the Virtual DOM and why is it used?",
                a: "The Virtual DOM (VDOM) is a programming concept where an ideal, or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM by a library such as ReactDOM. This process is called reconciliation.\n\nWhy it's used:\n- Performance: Actual DOM manipulation is slow. VDOM allows React to perform computations on a lightweight JavaScript object first.\n- Batching: React can batch multiple changes together to update the real DOM only once.\n- Diffing Algorithm: React compares the new VDOM with the previous one to find exactly what changed and only updates those specific nodes, minimizing re-renders."
            },
            {
                q: "How do you optimize a slow API endpoint?",
                a: "Optimizing a slow API involves a multi-layered approach focus on efficiency and scalability:\n\n1. Database Optimization: Use indexing for faster lookups, optimize complex queries, and avoid N+1 query problems using eager loading.\n2. Caching: Implement caching layers (like Redis or Memcached) for frequently accessed, slow-changing data.\n3. Payload Reduction: Use pagination, filter out unnecessary fields, and use compression (Gzip/Brotli).\n4. Asynchronous Processing: Offload heavy tasks (emailing, image processing) to background workers or message queues like RabbitMQ.\n5. Infrastructure: Use a CDN for static assets and ensure proper load balancing."
            },
            {
                q: "What is the difference between let, const, and var?",
                a: "The evolution of variable declarations in JS introduced distinct scoping rules:\n\n- var: Function-scoped, can be re-declared, and is hoisted (initialized as undefined). It often leads to bugs due to global scope pollution.\n- let: Block-scoped, can be updated but not re-declared within the same block. Perfect for loop counters or variables that must change.\n- const: Block-scoped, cannot be updated or re-declared. It requires initialization. Note: While the binding is immutable, objects/arrays assigned to const can still have their properties modified."
            },
            {
                q: "Explain Event Looping in JavaScript.",
                a: "JavaScript is single-threaded, meaning it can only do one thing at a time. The Event Loop is what allows it to handle asynchronous operations smoothly.\n\nKey Concepts:\n- Call Stack: Where synchronous code is executed.\n- Web APIs/Node APIs: Handles async tasks like timers or fetch requests.\n- Task Queue (Macrotasks): Holds callbacks for things like setTimeout.\n- Microtask Queue: Holds high-priority tasks like Promise resolutions (.then).\n- The Loop: It constantly checks if the Call Stack is empty. If it is, it picks tasks from the Microtask queue first, then the Task queue, and pushes them onto the Stack for execution."
            }
        ],
        "Software Engineer": [
            {
                q: "Explain the SOLID principles of Object Oriented Design.",
                a: "SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable:\n\n1. Single Responsibility: A class should have only one reason to change.\n2. Open-Closed: Software entities should be open for extension but closed for modification.\n3. Liskov Substitution: Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.\n4. Interface Segregation: Clients should not be forced to depend on methods they do not use.\n5. Dependency Inversion: Depend on abstractions (interfaces), not concretions."
            },
            {
                q: "What is Dependency Injection?",
                a: "Dependency Injection (DI) is a technical design pattern in which an object or function receives other objects or functions that it depends on, instead of creating them internally.\n\nBenefits:\n- Decoupling: Components don't need to know how to construct their dependencies.\n- Testability: You can easily swap real services with mock objects during unit testing.\n- Configuration: Makes the application more modular and easier to configure based on the environment (e.g., using a mock database for dev and a real one for prod)."
            },
            {
                q: "Describe the architectural pattern 'Microservices'.",
                a: "Microservices is an architectural style that structures an application as a collection of services that are highly maintainable, testable, loosely coupled, and independently deployable.\n\nCharacteristics:\n- Decentralized Governance: Services can be written in different languages.\n- Scalability: Each service can be scaled horizontally independent of others.\n- Resilience: If one service fails, the entire system doesn't necessarily go down.\n- Communication: Typically communicate via lightweight protocols like REST/HTTP or message brokers (Event-Driven)."
            },
            {
                q: "What is the purpose of unit testing?",
                a: "Unit testing is the process of testing the smallest functional unit of code—usually a single function or class method—in isolation from the rest of the application.\n\nDetailed Goals:\n- Bug Detection: Catch logic errors early in the development cycle.\n- Refactoring Confidence: Ensure that changes to the code don't break existing functionality (regression testing).\n- Documentation: Tests often serve as live documentation of how the code is expected to behave.\n- Improved Design: Writing tests first (TDD) often leads to cleaner, more modular code."
            }
        ],
        "Data Analyst": [
            {
                q: "What is the difference between data cleaning and data profiling?",
                a: "Data Profiling and Data Cleaning are sequential steps in the data preparation pipeline:\n\n- Data Profiling: This is the 'discovery' phase. You analyze the data to understand its structure, distribution, and patterns. It involves identifying anomalies, missing values, and outliers to determine what needs fixing.\n- Data Cleaning: This is the 'execution' phase. Based on profiling results, you fix the issues. This includes handling missing values (imputation), removing duplicates, correcting data types, and normalizing formats (e.g., standardizing date strings)."
            },
            {
                q: "Explain the concept of 'p-value' in statistics.",
                a: "In statistical hypothesis testing, the p-value is the probability of obtaining test results at least as extreme as the observed results, assuming that the null hypothesis is correct.\n\nInterpretation:\n- Low p-value (typically ≤ 0.05): You reject the null hypothesis. It indicates strong evidence against the null; the observed effect is likely not due to random chance (statistically significant).\n- High p-value (> 0.05): You fail to reject the null hypothesis. It suggests that the observed changes could likely be explained by random variability alone."
            }
        ],
        "Cyber Security": [
            {
                q: "Explain the concept of 'Defense in Depth'.",
                a: "Defense in Depth is a cybersecurity strategy that uses multiple independent layers of security controls to protect an organization's assets. If one control fails, others are ready to stop the threat.\n\nCommon Layers:\n1. Physical: Locked server rooms, security cameras.\n2. Technical: Firewalls, Intrusion Detection Systems (IDS), Encryption.\n3. Administrative: Security policies, staff training, access controls (RBAC).\n4. Application: Secure coding practices (OWASP), sandboxing.\n5. End-user: Multi-factor authentication (MFA), phishing awareness."
            },
            {
                q: "What is the CIA triad in information security?",
                a: "The CIA triad is a foundational model used to guide information security policies within an organization:\n\n1. Confidentiality: Protecting sensitive information from unauthorized access. (Example: Encryption, MFA).\n2. Integrity: Ensuring that data is accurate and has not been tampered with or modified by unauthorized parties. (Example: Digital signatures, Hashing).\n3. Availability: Ensuring that information and systems are accessible to authorized users when needed. (Example: Redundancy, DDoS protection, regular maintenance)."
            },
            {
                q: "How do you mitigate a DDoS attack?",
                a: "Distributed Denial of Service (DDoS) mitigation requires a multi-pronged approach to maintain availability:\n\n- Traffic Scrubbing: Using specialized hardware or services (Cloudflare, Akamai) to filter out malicious 'junk' traffic while letting legitimate users through.\n- Rate Limiting: Restricting the number of requests high-volume IPs can make.\n- CDN (Content Delivery Network): Using globally distributed servers to absorb the volumetric impact of an attack.\n- Anycast Routing: Distributing incoming traffic across a network of nodes to prevent any single server from becoming overwhelmed."
            }
        ],
        "HR": [
            {
                q: "How do you handle conflicts between employees?",
                a: "Handling interpersonal conflict requires a balanced approach to emotional intelligence and policy management:\n\n1. Private Discussion: Meet with each party separately to understand their unique perspective without bias.\n2. Identifying the Root Cause: Distinguish between professional disagreements (tasks) and personal friction (personality).\n3. Mediated Session: Bring parties together to find common ground and establish clear expectations for future behavior.\n4. Documentation: Keep a record of the encounter and the agreed-upon resolution for HR compliance.\n5. Follow-up: Revisit the situation weeks later to ensure the conflict hasn't resurfaced."
            }
        ],
        "Project Manager": [
            {
                q: "Explain the differences between Agile and Waterfall.",
                a: "Agile and Waterfall are two distinct methodologies for managing projects used across different industries:\n\n- Waterfall: A linear, sequential approach where each phase (Requirements, Design, Implementation, Testing) must be completed before the next begins. It's best for projects with fixed requirements and strictly defined scopes.\n- Agile: An iterative and incremental approach that emphasizes flexibility, continuous feedback, and rapid delivery. It works in 'Sprints' (2-4 week cycles) and allows for frequent adjustments based on stakeholder input. It's ideal for complex, fast-changing environments where requirements evolve."
            },
            {
                q: "What is a 'Burn-down Chart' and how is it used?",
                a: "A Burn-down Chart is a graphical representation of work left to do vs. time. It is a critical tool in Agile Scrum methodology for tracking sprint progress.\n\nKey Components:\n- X-Axis: Represents time (usually days in a sprint).\n- Y-Axis: Represents the work remaining (usually in story points or hours).\n- Ideal Line: A straight line from the start to zero, showing the planned progress.\n- Actual Line: The real-time tracking of completed work. If it's above the ideal line, the team is behind schedule; if below, they are ahead."
            }
        ]
    };

    const rolePool = pools[role] || pools["Developer"];
    // Shuffle and pick
    const shuffled = [...rolePool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return selected.map((item, idx) => ({
        id: null,
        questionText: typeof item === 'string' ? item : item.q,
        answerText: typeof item === 'string' ? "Reference answer for " + item : item.a,
        category: role,
        role: role,
        level: level
    }));
};


export const evaluateInterview = async (sessionId, answers) => {
    if (!answers || answers.length === 0) {
        return {
            score: 0,
            aiFeedback: "No answers provided.",
            reasoning: "Evaluation not possible without answers.",
            analytics: { scorePercentage: 0, totalMarks: 0, correctAnswers: 0, weakAnswers: 0 },
            strengths: "N/A",
            weaknesses: "Everything",
            suggestions: "Please attempt the test again."
        };
    }

    let totalScore = 0;
    let correctAnswersCount = 0;
    let weakAnswersCount = 0;
    const maxScorePerQuestion = 10;
    let weakTopics = [];

    const evaluatedAnswers = answers.map(a => {
        const userText = (a.answer_text || "").trim().toLowerCase();
        const refText = (a.referenceAnswer || "").trim().toLowerCase();

        // Simple heuristic for evaluation criteria:
        // 1. Correctness & Relevance: keywords match
        // 2. Completeness: length and variety of terms
        // 3. Explanation Quality: presence of explanatory transition words

        const keywords = refText.split(/\W+/).filter(w => w.length > 4);
        const matchedKeywords = keywords.filter(k => userText.includes(k));
        const keywordRatio = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0;

        const length = userText.length;
        const qualityMarkers = ['because', 'therefore', 'example', 'instance', 'consequently', 'furthermore', 'however'].filter(m => userText.includes(m));

        let score = 0;
        if (length > 10) score += 2; // Basic effort
        if (keywordRatio > 0.3) score += 4; // Accuracy/Relevance
        if (length > 100) score += 2; // Completeness
        if (qualityMarkers.length > 0) score += 2; // Explanation quality

        totalScore += score;
        if (score >= 7) {
            correctAnswersCount++;
        } else {
            weakAnswersCount++;
            const missedKeywords = keywords.filter(k => !userText.includes(k));
            if (missedKeywords.length > 0) {
                weakTopics.push(...missedKeywords.slice(0, 2));
            }
        }

        return {
            questionId: a.question_id,
            userAnswer: a.answer_text,
            referenceAnswer: a.referenceAnswer,
            score: score,
            criteria: {
                correctness: keywordRatio > 0.5 ? "High" : "Medium",
                relevance: keywordRatio > 0.3 ? "Relevant" : "Partial",
                completeness: length > 100 ? "Full" : "Short",
                explanationQuality: qualityMarkers.length > 0 ? "Good" : "Needs Detail"
            },
            reasoning: score >= 7 ? "Well articulated with key concepts." : "Needs more technical depth and explanation."
        };

    });

    const totalPossibleScore = answers.length * maxScorePerQuestion;
    const averagePercentage = Math.round((totalScore / totalPossibleScore) * 100);

    const feedback = averagePercentage >= 90 ? "Excellent! You demonstrated deep technical understanding and clear communication. Ready for the real interview!" :
        averagePercentage >= 75 ? "Very Good! You have a solid grasp of core concepts. Fine-tune your examples for even better impact." :
            averagePercentage >= 50 ? "Good Effort. You understand the basics but need to provide more detailed explanations and use industry-standard terminology." :
                "Needs Significant Improvement. Focus on understanding the core concepts and practice articulating your thoughts more clearly.";

    const uniqueWeaknesses = [...new Set(weakTopics)].slice(0, 4).join(", ");
    const derivedWeaknesses = uniqueWeaknesses || (averagePercentage > 85 ? "Minor detail depth" : "Explanation structure, Keyword usage");

    return {
        score: averagePercentage,
        totalMarks: totalScore,
        maxPossible: totalPossibleScore,
        correctAnswers: correctAnswersCount,
        weakAnswers: weakAnswersCount,
        aiFeedback: feedback,
        reasoning: `Based on your responses, you covered approximately ${Math.round(correctAnswersCount / answers.length * 100)}% of the key technical points required for these questions.`,
        analytics: {
            performanceTrend: averagePercentage > 60 ? "Upward" : "Steady",
            scorePercentage: averagePercentage,
            totalMarks: totalScore,
            correctAnswers: correctAnswersCount,
            weakAnswers: weakAnswersCount,
            categoryPerformance: {
                correctness: Math.min(100, Math.round(averagePercentage * 1.05)),
                explanation: Math.min(100, Math.round(averagePercentage * 0.95))
            }
        },
        strengths: averagePercentage > 75 ? "Technical Accuracy, Communication" : "Concept awareness",
        weaknesses: derivedWeaknesses,
        suggestions: averagePercentage > 80 ? "Try 'Pro' level questions for more challenge." : "Focus on using more 'because' and 'for example' in your answers to improve explanation quality.",
        perAnswerEvaluation: evaluatedAnswers
    };
};

/**
 * Generate interview questions using Groq AI (LLaMA 3.3)
 * @param {string} role - The job role (e.g., "Developer", "HR")
 * @param {string} level - The difficulty level ("Beginner", "Intermediate", "Pro")
 * @param {number} count - Number of questions to generate (default: 5)
 * @param {string} laggingSkills - Optional skills to focus the questions on
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateInterviewQuestions(role, level, count = 5, laggingSkills = null) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error('GROQ_API_KEY not found in environment variables');
    }

    let prompt = `You are an expert interview coach. Generate exactly ${count} unique interview questions for a ${level} level ${role} position.`;

    if (laggingSkills) {
        prompt += `\n\nThe candidate specifically needs to improve on these topics/skills based on their last practice: ${laggingSkills}. Please focus the questions on these areas to help them practice their weak points.`;
    }

    prompt += `\n\nRequirements:
- Questions should be appropriate for ${level} level candidates
- Mix of technical and behavioral questions where applicable
- Questions should be practical and commonly asked in real interviews
- For technical roles, include coding concepts, problem-solving, and system design (based on level)
- For non-technical roles, focus on situational, behavioral, and role-specific questions

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks, just raw JSON):
[
  { "questionText": "Your question here?", "category": "Technical" },
  { "questionText": "Another question?", "category": "Behavioral" }
]

Categories should be one of: "Technical", "Behavioral", "Situational", "Problem-Solving", "Leadership"`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Groq API request failed');
        }

        const data = await response.json();
        let text = data.choices[0].message.content;

        // Clean up the response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const questions = JSON.parse(text);

        // Add unique IDs to each question
        return questions.map((q, index) => ({
            id: `ai-${Date.now()}-${index}`,
            questionText: q.questionText,
            category: q.category || 'General'
        }));
    } catch (error) {
        console.error('AI Question Generation Error:', error);
        throw new Error('Failed to generate questions with AI: ' + error.message);
    }
}
