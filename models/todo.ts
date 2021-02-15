import * as mongoose from 'mongoose';

import Todo from '../types/todo';

interface ITodo extends Todo, mongoose.Document {
    user: string;
}

export const todoSchema = new mongoose.Schema<ITodo>({
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

export default <mongoose.Model<ITodo>>mongoose.models.Todo || mongoose.model<ITodo>('Todo', todoSchema);
