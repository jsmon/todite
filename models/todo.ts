import * as mongoose from 'mongoose';

export interface ITodo extends mongoose.Document {
    name: string;
    completed: boolean;
    user: string;
}

const todoSchema = new mongoose.Schema<ITodo>({
    name: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

export default todoSchema;
