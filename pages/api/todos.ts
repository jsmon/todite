import type { NextApiRequest, NextApiResponse } from 'next';

import * as mongoose from 'mongoose';

import Todo from '../../models/todo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    mongoose.connect(process.env.TODO_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.set('useCreateIndex', true);

    const method = req.method || 'GET';

    if (req.query.api_key == null && req.query.apikey == null && req.query.apiKey == null && req.query.ApiKey == null && req.query.APIkey == null && req.query.APIKey == null && req.query.APIKEY == null && req.query['api-key'] == null) {
        return res.status(400).json({ error: { status: 400, message: 'api_key query parameter must be defined.' } });
    }
    let apiKey = req.query.api_key || req.query.apikey || req.query.apiKey || req.query.ApiKey || req.query.APIkey || req.query.APIKey || req.query.APIKEY || req.query['api-key'];
    if (Array.isArray(apiKey)) apiKey = apiKey[0];

    const user: {
        id: string;
        error?: {
            status: number;
            message: string;
        };
    } = await fetch(process.env.NODE_ENV === 'production' ? `https://todolist.jsmon.vercel.app/api/user?api_key=${apiKey}` : `http://localhost:3000/api/user?api_key=${apiKey}`).then(res => res.json());
    if (user.error) {
        return res.status(403).json({ error: { status: 403, message: 'Invalid API Key' } });
    }
    const uid = user.id;

    if (method === 'GET') {
        const todos = await Todo.find({ user: uid });
        if (todos.length === 0) throw new Error('No todos found');

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
