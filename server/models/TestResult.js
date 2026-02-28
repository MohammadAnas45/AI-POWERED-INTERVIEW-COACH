import mongoose from 'mongoose';

const testResultSchema = mongoose.Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InterviewSession',
            required: true,
        },
        role: String,
        level: String,
        score: Number,
        totalQuestions: Number,
        attemptDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
