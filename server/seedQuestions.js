import { query } from './config/db.js';

const questions = [
    // --- DEVELOPER (30 Questions) ---
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'What is the difference between "==" and "===" in JavaScript?' },
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'Explain the concept of "Hoisting" in JavaScript.' },
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'What are semantic HTML elements and why are they important?' },
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'Describe the CSS Box Model.' },
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'What is a "Promise" in JavaScript?' },
    { role: 'Developer', level: 'Beginner', category: 'Behavioral', question_text: 'Why do you want to be a Developer?' },
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'What is the difference between "let", "const", and "var"?' },
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'Explain the purpose of Git and some basic commands.' },
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'What is an API and how does it work?' },
    { role: 'Developer', level: 'Beginner', category: 'Technical', question_text: 'What is the difference between client-side and server-side rendering?' },

    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'Explain how closures work in JavaScript and provide a practical use case.' },
    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'What are React Hooks, and why were they introduced?' },
    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'Describe the difference between Flexbox and CSS Grid.' },
    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'How does the Event Loop work in Node.js?' },
    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'What is Middleware in Express.js?' },
    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'Explain Prop Drilling and how to avoid it.' },
    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'What is the difference between SQL and NoSQL databases?' },
    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'How do you optimize a website\'s performance?' },
    { role: 'Developer', level: 'Intermediate', category: 'Technical', question_text: 'Describe your process for debugging a complex issue.' },
    { role: 'Developer', level: 'Intermediate', category: 'Behavioral', question_text: 'Tell me about a time you had a conflict with a teammate and how you resolved it.' },

    { role: 'Developer', level: 'Pro', category: 'Architecture', question_text: 'Describe a microservices architecture. What are the pros and cons?' },
    { role: 'Developer', level: 'Pro', category: 'Scalability', question_text: 'How would you design a system to handle 1 million concurrent users?' },
    { role: 'Developer', level: 'Pro', category: 'Technical', question_text: 'Explain the SOLID principles of object-oriented design.' },
    { role: 'Developer', level: 'Pro', category: 'Security', question_text: 'What are the security risks of JWT-based auth and how do you mitigate them?' },
    { role: 'Developer', level: 'Pro', category: 'DevOps', question_text: 'Describe your ideal CI/CD pipeline for a large-scale application.' },
    { role: 'Developer', level: 'Pro', category: 'Technical', question_text: 'How do you handle state management in a massive React application?' },
    { role: 'Developer', level: 'Pro', category: 'Architecture', question_text: 'How would you architect a real-time, globally distributed chat application?' },
    { role: 'Developer', level: 'Pro', category: 'Leadership', question_text: 'How do you approach mentoring junior developers?' },
    { role: 'Developer', level: 'Pro', category: 'Technical', question_text: 'What is "Test-Driven Development" (TDD) and why is it useful?' },
    { role: 'Developer', level: 'Pro', category: 'Strategy', question_text: 'How do you decide when to refactor code vs rewriting it from scratch?' },

    // --- SOFTWARE ENGINEER (10 Beginner) ---
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'What is the difference between a compiler and an interpreter?' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'Explain the concept of Recursion.' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'What is a Linked List?' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'Describe the "DRY" principle (Don\'t Repeat Yourself).' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'What are the main differences between an Array and a Set?' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'What is Object-Oriented Programming (OOP)?' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'Explain Basic Git workflow (add, commit, push).' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'What is the difference between Stack and Queue data structures?' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Technical', question_text: 'What is a Hash Map/Hash Table?' },
    { role: 'Software Engineer', level: 'Beginner', category: 'Behavioral', question_text: 'Why are you interested in Software Engineering?' },

    // --- DATA ANALYST (10 Beginner) ---
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'What is the difference between Mean, Median, and Mode?' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'What is "Data Cleaning" and why is it important?' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'Explain the difference between JOIN and UNION in SQL.' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'Describe what a "P-value" represents in statistics.' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'What is the difference between qualitative and quantitative data?' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'How do you handle missing values in a dataset?' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'What is a "Correlation" and does it imply causation?' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'Explain the purpose of a "Pivot Table" in Excel or SQL.' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Technical', question_text: 'What tools would you use for data visualization and why?' },
    { role: 'Data Analyst', level: 'Beginner', category: 'Behavioral', question_text: 'How do you explain complex data findings to a non-technical audience?' },

    // --- CYBER SECURITY (10 Beginner) ---
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'What is the "CIA Triad" in cybersecurity?' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'Explain the difference between Symmetric and Asymmetric encryption.' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'What is a "Phishing" attack and how can it be prevented?' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'What is a Firewall and how does it work?' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'What is "Two-Factor Authentication" (2FA)?' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'Describe the difference between a Vulnerability, a Threat, and a Risk.' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'What is Malware and what are some common types?' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'Explain the purpose of a VPN.' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Technical', question_text: 'What is an IDS (Intrusion Detection System)?' },
    { role: 'Cyber Security', level: 'Beginner', category: 'Behavioral', question_text: 'Why is ethics important in the field of cybersecurity?' },

    // --- HR (10 Beginner) ---
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'What do you think is the most important skill for an HR professional?' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'How do you handle confidential employee information?' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'Describe the standard recruitment process from job posting to hiring.' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'How would you handle a situation where two employees are in conflict?' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'What is employee "onboarding" and why is it important?' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'Explain the importance of diversity and inclusion in the workplace.' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'What are some common ways to measure employee engagement?' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'How do you stay up-to-date with labor laws and regulations?' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'Describe your approach to conducting a job interview.' },
    { role: 'HR', level: 'Beginner', category: 'Behavioral', question_text: 'What is the role of HR in company culture?' },

    // --- CUSTOMER SUPPORT (10 Beginner) ---
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'What does "excellent customer service" mean to you?' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'How do you handle an angry or frustrated customer?' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'Describe a time you went above and beyond for a customer.' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'How do you stay calm under pressure during a busy shift?' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'What is the most important part of a customer support interaction?' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'How do you handle a situation where you don\'t know the answer to a customer\'s question?' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'What tools are you familiar with for managing customer support tickets?' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'How do you prioritize multiple customer requests?' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'Why do you want to work in customer support?' },
    { role: 'Customer Support', level: 'Beginner', category: 'Behavioral', question_text: 'How do you deal with repetitive questions from customers?' },

    // --- PROJECT MANAGER (10 Beginner) ---
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'What are the main responsibilities of a Project Manager?' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'Explain the difference between Agile and Waterfall methodologies.' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'How do you define a project\'s success?' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'What is a "Gantt Chart" and what is it used for?' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'How do you handle a project that is falling behind schedule?' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'Describe the "Project Life Cycle".' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'What is a "Stakeholder" and how do you manage them?' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'Explain the importance of risk management in projects.' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'How do you prioritize tasks within a project?' },
    { role: 'Project Manager', level: 'Beginner', category: 'Behavioral', question_text: 'What is "Scope Creep" and how can it be avoided?' },
];

const seed = async () => {
    try {
        console.log('Cleaning existing questions...');
        await query('DELETE FROM questions');

        console.log(`Seeding ${questions.length} professional questions...`);
        for (const q of questions) {
            await query(
                'INSERT INTO questions (role, level, question_text, category) VALUES ($1, $2, $3, $4)',
                [q.role, q.level, q.question_text, q.category]
            );
        }

        console.log('✅ DATABASE LOADED WITH 90 QUESTIONS!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
