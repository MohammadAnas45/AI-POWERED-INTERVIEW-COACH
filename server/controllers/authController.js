import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    try {
        const newUser = await query(
            'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email, role, professional_role, experience_level, skills, bio, phone, location, github_url, linkedin_url, website_url',
            [fullName, email, hashedPassword]
        );

        if (newUser.rows[0]) {
            res.status(201).json({
                id: newUser.rows[0].id,
                fullName: newUser.rows[0].full_name,
                email: newUser.rows[0].email,
                role: newUser.rows[0].role,
                professional_role: newUser.rows[0].professional_role,
                experience_level: newUser.rows[0].experience_level,
                skills: newUser.rows[0].skills,
                bio: newUser.rows[0].bio,
                phone: newUser.rows[0].phone,
                location: newUser.rows[0].location,
                github_url: newUser.rows[0].github_url,
                linkedin_url: newUser.rows[0].linkedin_url,
                website_url: newUser.rows[0].website_url,
                job_type: newUser.rows[0].job_type,
                streak_count: 0,
                daily_quest_count: 0,
                token: generateToken(newUser.rows[0].id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateStreak = async (user) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = user.last_login_date;
    let newStreak = user.streak_count || 0;

    if (!lastLogin) {
        newStreak = 1;
    } else {
        const lastDate = new Date(lastLogin);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newStreak += 1;
        } else if (diffDays > 1) {
            newStreak = 1;
        }
        // if diffDays === 0, keep same streak
    }

    await query('UPDATE users SET streak_count = $1, last_login_date = $2 WHERE id = $3', [newStreak, today, user.id]);
    return newStreak;
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
        const streak = await updateStreak(user);
        res.json({
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
            professional_role: user.professional_role,
            experience_level: user.experience_level,
            skills: user.skills,
            bio: user.bio,
            phone: user.phone,
            location: user.location,
            github_url: user.github_url,
            linkedin_url: user.linkedin_url,
            website_url: user.website_url,
            job_type: user.job_type,
            streak_count: streak,
            daily_quest_count: user.daily_quest_count || 0,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Social Login (Google/GitHub)
// @route   POST /api/auth/social-login
// @access  Public
export const socialLogin = async (req, res) => {
    const { email, fullName, provider, providerId } = req.body;

    if (!email || !provider || !providerId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if user exists by email or providerId
        let userResult = await query('SELECT * FROM users WHERE email = $1 OR (provider = $2 AND provider_id = $3)', [email, provider, providerId]);
        let user = userResult.rows[0];

        if (!user) {
            // Create new social user
            const newUser = await query(
                'INSERT INTO users (full_name, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role',
                [fullName || email.split('@')[0], email, provider, providerId]
            );
            user = newUser.rows[0];
        } else if (user.provider === 'local') {
            // Link existing local account to social provider
            await query('UPDATE users SET provider = $1, provider_id = $2 WHERE id = $3', [provider, providerId, user.id]);
        }

        const streak = await updateStreak(user);

        res.json({
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
            professional_role: user.professional_role,
            experience_level: user.experience_level,
            skills: user.skills,
            bio: user.bio,
            phone: user.phone,
            location: user.location,
            github_url: user.github_url,
            linkedin_url: user.linkedin_url,
            website_url: user.website_url,
            job_type: user.job_type,
            streak_count: streak,
            daily_quest_count: user.daily_quest_count || 0,
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error('Social login error:', error);
        res.status(500).json({ message: error.message });
    }
};
