import { query } from '../config/db.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const userResult = await query('SELECT id, full_name, email, role, resume_path, professional_role, experience_level, skills, bio, phone, location, github_url, linkedin_url, website_url, job_type FROM users WHERE id = $1', [req.user.id]);
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
    try {
        const { fullName, email, professionalRole, experienceLevel, skills, bio, phone, location, github_url, linkedin_url, website_url, job_type } = req.body;

        const userResult = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await query(
            'UPDATE users SET full_name = $1, email = $2, professional_role = $3, experience_level = $4, skills = $5, bio = $6, phone = $7, location = $8, github_url = $9, linkedin_url = $10, website_url = $11, job_type = $12, updated_at = CURRENT_TIMESTAMP WHERE id = $13 RETURNING id, full_name, email, role, professional_role, experience_level, skills, bio, phone, location, github_url, linkedin_url, website_url, job_type',
            [
                fullName || user.full_name,
                email || user.email,
                professionalRole !== undefined ? professionalRole : user.professional_role,
                experienceLevel !== undefined ? experienceLevel : user.experience_level,
                skills !== undefined ? skills : user.skills,
                bio !== undefined ? bio : user.bio,
                phone !== undefined ? phone : user.phone,
                location !== undefined ? location : user.location,
                github_url !== undefined ? github_url : user.github_url,
                linkedin_url !== undefined ? linkedin_url : user.linkedin_url,
                website_url !== undefined ? website_url : user.website_url,
                job_type !== undefined ? job_type : user.job_type,
                req.user.id
            ]
        );

        if (updatedUser && updatedUser.rows && updatedUser.rows.length > 0) {
            res.json(updatedUser.rows[0]);
        } else {
            // Fallback if RETURNING is not supported by this SQLite version
            const finalUser = await query('SELECT id, full_name, email, role, professional_role, experience_level, skills, bio, phone, location, github_url, linkedin_url, website_url, job_type FROM users WHERE id = $1', [req.user.id]);
            res.json(finalUser.rows[0]);
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error while updating profile', error: error.message });
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
