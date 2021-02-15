import type { NextApiRequest, NextApiResponse } from 'next';

import * as mongoose from 'mongoose';

import Todo from '../../../models/todo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    mongoose.connect(process.env.TODO_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.set('useCreateIndex', true);

    const method = req.method || 'GET';

    let { id } = req.query;
    if (Array.isArray(id)) id = id[0];

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
        const todo = await Todo.findById(id);
        if (todo == null) {
            return res.status(404).json({ error: { status: 404, message: `A todo with id "${id}" could not be found` } });
        }
        if (todo.user === uid) {
            res.json(todo);
        } else {
            res.setHeader('WWW-Authenticate', ['Basic', 'realm="Access to a users todo"', 'charset="UTF-8"']);
            res.status(401).json({ error: { status: 401, message: 'You can only access your own todos' } });
        }
    } else if (['PUT', 'PATCH'].includes(method)) {
        const todo = await Todo.findById(id);
        if (todo == null) {
            return res.status(404).json({ error: { status: 404, message: `A todo with id "${id}" could not be found` } })
        }

        const { name = todo.name, completed = todo.completed }: {
            name?: string;
            completed?: boolean;
        } = req.body;

        if (todo.user === uid) {
            const newTodo = await todo.update({ name, completed });
            res.json(newTodo);
        } else {
            res.setHeader('WWW-Authenticate', ['Basic', 'realm="Access to a users todo"', 'charset="UTF-8"']);
            res.status(401).json({ error: { status: 401, message: 'You can only access your own todos' } });
        }
    } else if (method === 'DELETE') {
        const todo = await Todo.findById(id);
        if (todo == null) {
            return res.status(404).json({ error: { status: 404, message: `A todo with id "${id}" could not be found` } })
        }

        if (todo.user === uid) {
            todo.delete().then(() => res.status(200).end());
        } else {
            res.setHeader('WWW-Authenticate', ['Basic', 'realm="Access to a users todo"', 'charset="UTF-8"']);
            res.status(401).json({ error: { status: 401, message: 'You can only access your own todos' } });
        }
    } else {
        res.setHeader('Access-Control-Allow-Methods', ['GET', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).json({ error: { status: 405, message: 'Please use either "GET", "PUT", "PATCH", or "DELETE"' } });
    }
};

export default handler;
