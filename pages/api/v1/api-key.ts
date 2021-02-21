import type { NextApiRequest, NextApiResponse } from 'next';

import runMiddleware from '../../../utils/run-middleware';
import admin from '../../../utils/admin';

import * as mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import cors from 'cors';

import userSchema, { IUser } from '../../../models/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors());

    const userConnection = await mongoose.createConnection(process.env.USER_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const User: mongoose.Model<IUser> = userConnection.models.User || userConnection.model('User', userSchema);

    const method = req.method || 'GET';

    let hasApiKey = req.query.api_key != null || req.query.apikey != null || req.query.apiKey != null || req.query.ApiKey != null || req.query.APIkey != null || req.query.APIKey != null || req.query.APIKEY != null || req.query['api-key'] != null;
    let hasToken = req.headers.authorization != null;
    if (!hasApiKey && !hasToken) {
        return res.status(400).json({ error: { status: 400, message: 'api_key query parameter must be defined.' } });
    }


    let apiKey = req.query.api_key || req.query.apikey || req.query.apiKey || req.query.ApiKey || req.query.APIkey || req.query.APIKey || req.query.APIKEY || <string | string[] | undefined>req.query['api-key'];
    if (Array.isArray(apiKey)) apiKey = apiKey[0];

    const token = req.headers.authorization;

    let firebaseId: string | undefined;

    try {
        firebaseId = hasToken ? await admin.auth().verifyIdToken(token!).then(decodedToken => decodedToken.uid) : undefined;
    } catch {
        return res.status(400).json({ error: { status: 400, message: 'Invalid Authorization token' } });
    }

    if (method === 'GET') {
        if (hasApiKey) return res.json({ apiKey });

        try {
            const user = await User.findOne({ firebaseId });

            if (user == null) {
                throw new Error('User not found');
            }

            res.json({ apiKey: user.apiKey });
        } catch (err) {
            res.status(404).json({ error: { status: 404, message: 'The user could not be found' } });
        }
    } else if (['PUT', 'PATCH'].includes(method)) {
        const newApiKey = uuid();

        try {
            const user = await User.findOne(hasApiKey ? { apiKey } : { firebaseId });
            if (user == null) throw new Error('User not found');

            await user.updateOne({ apiKey: newApiKey });

            res.json({ apiKey: newApiKey });
        } catch (err) {
            res.status(404).json({ error: { status: 404, message: 'The user could not be found' } });
        }
    } else {
        res.setHeader('Access-Control-Allow-Methods', ['GET', 'PUT', 'PATCH']);
        res.status(405).json({ error: { status: 405, message: 'Please use either "GET", "PUT", or "PATCH"' } });
    }
};

export default handler;
