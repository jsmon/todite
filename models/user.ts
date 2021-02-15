import * as mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    apiKey: string;
}

const userSchema = new mongoose.Schema<IUser>({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    }
}, { _id: false });

export default <mongoose.Model<IUser>>mongoose.models.User || mongoose.model<IUser>('User', userSchema);
