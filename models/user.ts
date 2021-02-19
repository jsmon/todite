import * as mongoose from 'mongoose';

import Settings from '../types/settings';

export interface IUser extends mongoose.Document {
    firebaseId: string;
    apiKey: string;
    settings?: Settings;
}

interface ISettings extends Settings, mongoose.Document {}

const settingsSchema = new mongoose.Schema<ISettings>({
    theme: {
        type: String,
        required: true
    },
    deleteTodoOnCompleted: {
        type: Boolean,
        required: true
    },
    syncSettings: {
        type: Boolean,
        required: true
    }
});

const userSchema = new mongoose.Schema<IUser>({
    firebaseId: {
        type: String,
        required: true,
        unique: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    settings: {
        type: settingsSchema
    }
});

export default userSchema;
