import type { NextApiRequest, NextApiResponse } from 'next';

import * as mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

import userSchema, { IUser } from '../../models/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const userConnection = mongoose.createConnection(process.env.USER_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true });
    userConnection.set('useCreateIndex', true);
    const User: mongoose.Model<IUser> = userConnection.models.User || userConnection.model('User', userSchema);

    const method = req.method || 'GET';

    let hasApiKey = req.query.api_key != null || req.query.apikey != null || req.query.apiKey != null || req.query.ApiKey != null || req.query.APIkey != null || req.query.APIKey != null || req.query.APIKEY != null || req.query['api-key'] != null;
    let hasFirebaseId = req.query.firebase_id != null || req.query.firebase != null || req.query.id != null || req.query.firebaseid != null || req.query.firebaseId != null || req.query.firebaseID != null || req.query['firebase-id'] != null;
    if (!hasApiKey && !hasFirebaseId && method !== 'POST') {
        return res.status(400).json({ error: { status: 400, message: 'api_key query parameter must be defined.' } });
    }


    let apiKey = req.query.api_key || req.query.apikey || req.query.apiKey || req.query.ApiKey || req.query.APIkey || req.query.APIKey || req.query.APIKEY || req.query['api-key'];
    if (Array.isArray(apiKey)) apiKey = apiKey[0];

    let firebaseId = req.query.firebase_id || req.query.firebase || req.query.id || req.query.firebaseid || req.query.firebaseId || req.query.firebaseID || req.query['firebase-id'];
    if (Array.isArray(firebaseId)) firebaseId = firebaseId[0];

    if (method === 'GET') {
        try {
            const user = await User.findOne(hasApiKey ? { apiKey } : { firebaseId });
            if (user == null) throw new Error('User not found');

            const id = user.id;
            res.json({ id });
        } catch (err) {
            res.status(404).json({ error: { status: 404, message: 'The user could not be found' } });
        }
    } else if (['PUT', 'PATCH'].includes(method)) {
        const newApiKey = uuid();

        try {
            const user = await User.findOne(hasApiKey ? { apiKey } : { firebaseId });
            if (user == null) throw new Error('User not found');

            user.update({ apiKey: newApiKey });
        } catch (err) {
            res.status(404).json({ error: { status: 404, message: 'The user could not be found' } });
        }
    } else if (method === 'DELETE') {
        try {
            const user = await User.findOne(hasApiKey ? { apiKey } : { firebaseId });
            if (user == null) throw new Error('User not found');

            user.delete();
        } catch (err) {
            res.status(404).json({ error: { status: 404, message: 'The user could not be found' } });
        }
    } else if (method === 'POST') {
        const { firebaseId }: {
            firebaseId?: string;
        } = req.body;

        if (!firebaseId) {
            return res.status(400).json({ error: { status: 400, message: 'firebaseId must be defined' } });
        }

        const apiKey = uuid();

        const user = await User.create({ apiKey, firebaseId });
        res.json(user);
    } else {
        res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).json({ error: { status: 405, message: 'Please use either "GET", "POST", "PUT", "PATCH", or "DELETE"' } });
    }
};

export default handler;
