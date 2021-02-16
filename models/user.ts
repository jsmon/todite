import * as mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    firebaseId: string;
    apiKey: string;
}

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
    }
});

export default <mongoose.Model<IUser>>mongoose.models.User || mongoose.model<IUser>('User', userSchema);
