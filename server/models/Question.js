import mongoose from 'mongoose';

const questionSchema = mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
            enum: ['Beginner', 'Intermediate', 'Pro'],
        },
        questionText: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;
