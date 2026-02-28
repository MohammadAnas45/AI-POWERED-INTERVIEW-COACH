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
            'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email, role',
            [fullName, email, hashedPassword]
        );

        if (newUser.rows[0]) {
            res.status(201).json({
                id: newUser.rows[0].id,
                fullName: newUser.rows[0].full_name,
                email: newUser.rows[0].email,
                role: newUser.rows[0].role,
                token: generateToken(newUser.rows[0].id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
        res.json({
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
