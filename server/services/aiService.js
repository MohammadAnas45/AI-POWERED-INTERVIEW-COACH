/**
 * Generate interview questions using Groq AI (LLaMA 3.3)
 * @param {string} role - The job role (e.g., "Developer", "HR")
 * @param {string} level - The difficulty level ("Beginner", "Intermediate", "Pro")
 * @param {number} count - Number of questions to generate (default: 5)
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateInterviewQuestions(role, level, count = 5) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error('GROQ_API_KEY not found in environment variables');
    }

    const prompt = `You are an expert interview coach. Generate exactly ${count} unique interview questions for a ${level} level ${role} position.

Requirements:
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
