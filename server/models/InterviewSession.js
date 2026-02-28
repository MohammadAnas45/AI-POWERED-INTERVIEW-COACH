import mongoose from 'mongoose';

const answerSchema = mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    questionText: String,
    answerText: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const interviewSessionSchema = mongoose.Schema(
    {
        userId: {
            type: Number, // Matching PostgreSQL user ID type
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['started', 'completed'],
            default: 'started',
        },
        answers: [answerSchema],
        score: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;
