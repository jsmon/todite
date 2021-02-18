import type { NextApiRequest, NextApiResponse } from 'next';

import * as mongoose from 'mongoose';

import todoSchema, { ITodo } from '../../models/todo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const todoConnection = mongoose.createConnection(process.env.TODO_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true });
    todoConnection.set('useCreateIndex', true);
    const Todo: mongoose.Model<ITodo> = todoConnection.models.Todo || todoConnection.model('Todo', todoSchema);

    const method = req.method || 'GET';

    let hasApiKey = req.query.api_key != null || req.query.apikey != null || req.query.apiKey != null || req.query.ApiKey != null || req.query.APIkey != null || req.query.APIKey != null || req.query.APIKEY != null || req.query['api-key'] != null;
    let hasFirebaseId = req.query.firebase_id != null || req.query.firebase != null || req.query.id != null || req.query.firebaseid != null || req.query.firebaseId != null || req.query.firebaseID != null || req.query['firebase-id'] != null;
    if (!hasApiKey && !hasFirebaseId) {
        return res.status(400).json({ error: { status: 400, message: 'api_key query parameter must be defined.' } });
    }


    let apiKey = req.query.api_key || req.query.apikey || req.query.apiKey || req.query.ApiKey || req.query.APIkey || req.query.APIKey || req.query.APIKEY || req.query['api-key'];
    if (Array.isArray(apiKey)) apiKey = apiKey[0];

    let firebaseId = req.query.firebase_id || req.query.firebase || req.query.id || req.query.firebaseid || req.query.firebaseId || req.query.firebaseID || req.query['firebase-id'];
    if (Array.isArray(firebaseId)) firebaseId = firebaseId[0];

    const queryString = hasApiKey ? `?api_key=${apiKey}` : `?firebase_id=${firebaseId}`;

    const user: {
        id: string;
        error?: {
            status: number;
            message: string;
        };
    } = await fetch(process.env.NODE_ENV === 'production' ? `https://todite.now.sh/api/user${queryString}` : `http://localhost:3000/api/user${queryString}`).then(res => res.json());
    if (user.error) {
        return res.status(403).json({ error: { status: 403, message: 'Invalid API Key' } });
    }
    const uid = user.id;

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
