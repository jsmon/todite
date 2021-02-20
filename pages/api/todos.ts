import type { NextApiRequest, NextApiResponse } from 'next';

import runMiddleware from '../../utils/run-middleware';
import admin from '../../utils/admin';

import * as mongoose from 'mongoose';
import cors from 'cors';

import todoSchema, { ITodo } from '../../models/todo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors());

    const todoConnection = mongoose.createConnection(process.env.TODO_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true });
    todoConnection.set('useCreateIndex', true);
    const Todo: mongoose.Model<ITodo> = todoConnection.models.Todo || todoConnection.model('Todo', todoSchema);

    const method = req.method || 'GET';

    let hasApiKey = req.query.api_key != null || req.query.apikey != null || req.query.apiKey != null || req.query.ApiKey != null || req.query.APIkey != null || req.query.APIKey != null || req.query.APIKEY != null || req.query['api-key'] != null;
    let hasToken = req.headers.authorization != null;
    if (!hasApiKey && !hasToken) {
        return res.status(400).json({ error: { status: 400, message: 'api_key query parameter must be defined.' } });
    }


    let apiKey = req.query.api_key || req.query.apikey || req.query.apiKey || req.query.ApiKey || req.query.APIkey || req.query.APIKey || req.query.APIKEY || <string | string[] | undefined>req.query['api-key'];
    if (Array.isArray(apiKey)) apiKey = apiKey[0];

    const token = req.headers.authorization;

    let user: {
        uid: string;
        error?: {
            status: number;
            message: string;
        }
    };

    const userApiRoute = `${process.env.NODE_ENV === 'production' ? 'https://todite.now.sh' : 'http://localhost:3000'}/api/user`;

    const userExists = hasToken
        ? await fetch(userApiRoute, {
            method: 'GET',
            headers: { Authorization: token! }
        }).then(res => res.json()).then(user => !user.error)
        : await fetch(`${userApiRoute}?api_key=${apiKey}`)
            .then(res => res.json())
            .then(user => !user.error);

    try {
        user = hasToken
            ? await admin.auth().verifyIdToken(token!).then(decodedToken => ({ uid: decodedToken.uid }))
            : await fetch(`${process.env.NODE_ENV === 'production' ? 'https://todite.now.sh' : 'http://localhost:3000'}/api/user?api_key=${apiKey}`)
                .then(res => res.json())
                .then((user: {
                    uid: string;
                    error?: {
                        status: number;
                        message: string;
                    }
                }) => ({ uid: user.uid, error: user.error }));
    } catch {
        return res.status(400).json({ error: { status: 400, message: 'Invalid Authorization token' } });
    }

    if (user.error || !userExists) {
        return res.status(403).json({ error: { status: 403, message: 'Invalid API Key' } });
    }
    const { uid } = user;

    if (method === 'GET') {
        const todos = await Todo.find({ user: uid });

        res.json(todos);
    } else if (method === 'POST') {
        const { name }: {
            name?: string;
        } = req.body;

        if (name == null) {
            return res.status(400).json({ error: { status: 400, message: 'name must be defined' } })
        }

        const newTodo = await Todo.create({ name, completed: false, user: uid });
        res.status(201).json(newTodo);
    } else {
        res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST']);
        res.status(405).json({ error: { status: 405, message: 'Please use either "GET" or "POST"' } });
    }
};

export default handler;
