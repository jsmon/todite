import type { NextApiRequest, NextApiResponse } from 'next';

import runMiddleware from '../../utils/run-middleware';
import admin from '../../utils/admin';

import * as mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import cors from 'cors';

import Settings from '../../types/settings';

import userSchema, { IUser } from '../../models/user';
import { ITodo } from '../../models/todo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors());
    
    const userConnection = mongoose.createConnection(process.env.USER_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true });
    userConnection.set('useCreateIndex', true);
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
        try {
            const user = await User.findOne(hasApiKey ? { apiKey } : { firebaseId });
            if (user == null) throw new Error('User not found');

            const { _id, firebaseId: uid, settings } = user;
            res.json({ _id, uid, settings });
        } catch (err) {
            res.status(404).json({ error: { status: 404, message: 'The user could not be found' } });
        }
    } else if (['PUT', 'PATCH'].includes(method)) {
        let { settings }: {
            settings?: Settings;
        } = req.body;

        if (!settings) {
            return res.status(400).json({ error: { status: 400, message: 'settings must be defined' } });
        }
        if (!settings.syncSettings) settings = undefined;

        try {
            const user = await User.findOne(hasApiKey ? { apiKey } : { firebaseId });
            if (user == null) throw new Error('User not found');
            
            user.settings = settings;
            const updatedUser = await user.save();

            res.json(updatedUser);
        } catch (err) {
            res.status(404).json({ error: { status: 404, message: 'The user could not be found' } });
        }
    } else if (method === 'DELETE') {
        try {
            const user = await User.findOne(hasApiKey ? { apiKey } : { firebaseId });
            if (user == null) throw new Error('User not found');

            const url = `${process.env.NODE_ENV === 'production' ? 'https://todite.now.sh' : 'http://localhost:3000'}/api/todo`;

            const todos: ITodo[] = hasApiKey
                ? await fetch(`${url}s?api_key=${apiKey}`).then(res => res.json())
                : await fetch(`${url}s`, {
                    method: 'GET',
                    headers: { Authorization: token! }
                }).then(res => res.json());

            for (const todo of todos) {
                if (hasApiKey) {
                    await fetch(`${url}/${todo._id}?api_key=${apiKey}`, { method: 'DELETE' });
                } else {
                    await fetch(`${url}/${todo._id}`, {
                        method: 'DELETE',
                        headers: { Authorization: token! }
                    });
                }
            }

            user.delete().then(() => res.json({ success: true }));
        } catch (err) {
            res.status(404).json({ error: { status: 404, message: 'The user could not be found' } });
        }
    } else if (method === 'POST') {
        console.log('here in post')
        let settings: Settings | undefined = req.body.settings;

        if (settings && !settings.syncSettings) settings = undefined;

        const apiKey = uuid();

        const user = await User.create({ apiKey, firebaseId, settings });
        console.log(user);

        const firstTodo: ITodo = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://todite.now.sh' : 'http://localhost:3000'}/api/todos?api_key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Create an account on Todite' })
        }).then(res => res.json());

        await fetch(`${process.env.NODE_ENV === 'production' ? 'https://todite.now.sh' : 'http://localhost:3000'}/api/todo/${firstTodo._id}?api_key=${apiKey}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true })
        });

        await fetch(`${process.env.NODE_ENV === 'production' ? 'https://todite.now.sh' : 'http://localhost:3000'}/api/todos?api_key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Create your first to-do' })
        });

        res.json(user);
    } else {
        res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).json({ error: { status: 405, message: 'Please use either "GET", "POST", "PUT", "PATCH", or "DELETE"' } });
    }
};

export default handler;
