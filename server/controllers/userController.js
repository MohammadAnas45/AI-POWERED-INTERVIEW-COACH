import { query } from '../config/db.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const userResult = await query('SELECT id, full_name, email, role, resume_path FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    const { fullName, email } = req.body;

    const userResult = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    if (user) {
        const updatedUser = await query(
            'UPDATE users SET full_name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, full_name, email, role',
            [fullName || user.full_name, email || user.email, req.user.id]
        );
        res.json(updatedUser.rows[0]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Upload resume
// @route   POST /api/users/resume
// @access  Private
export const uploadResume = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    const filePath = req.file.path;

    try {
        await query('UPDATE users SET resume_path = $1 WHERE id = $2', [filePath, req.user.id]);
        res.json({ message: 'Resume uploaded successfully', filePath });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users
// @access  Private
export const deleteUser = async (req, res) => {
    try {
        await query('DELETE FROM users WHERE id = $1', [req.user.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
