import type { NextApiRequest, NextApiResponse } from 'next';

import runMiddleware from '../../../../utils/run-middleware';
import admin from '../../../../utils/admin';

import * as mongoose from 'mongoose';
import cors from 'cors';

import todoSchema, { ITodo } from '../../../../models/todo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors());

    const todoConnection = await mongoose.createConnection(process.env.TODO_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const Todo: mongoose.Model<ITodo> = todoConnection.models.Todo || todoConnection.model('Todo', todoSchema);

    const method = req.method || 'GET';

    let { id } = req.query;
    if (Array.isArray(id)) id = id[0];

    let hasApiKey = req.query.api_key != null || req.query.apikey != null || req.query.apiKey != null || req.query.ApiKey != null || req.query.APIkey != null || req.query.APIKey != null || req.query.APIKEY != null || req.query['api-key'] != null;
    let hasToken = req.headers.authorization != null;
    if (!hasApiKey && !hasToken) {
        return res.status(400).json({ error: { status: 400, message: 'api_key query parameter must be defined.' } });
    }


    let apiKey = req.query.api_key || req.query.apikey || req.query.apiKey || req.query.ApiKey || req.query.APIkey || req.query.APIKey || req.query.APIKEY || <string | string[] | undefined>req.query['api-key'];
    if (Array.isArray(apiKey)) apiKey = apiKey[0];

    const token = req.headers.authorization;

    let uid: string;
    try {
        uid = hasToken
            ? await admin.auth().verifyIdToken(token!).then(decodedToken => decodedToken.uid)
            : await fetch(`${process.env.NODE_ENV === 'production' ? 'https://todite.now.sh' : 'http://localhost:3000'}/api/v1/user?api_key=${apiKey}`)
                .then(res => res.json())
                .then((user: {
                    uid: string;
                    error?: {
                        status: number;
                        message: string;
                    }
                }) => user.uid);
    } catch {
        return res.status(400).json({ error: { status: 400, message: 'Invalid Authorization token' } });
    }

    if (method === 'GET') {
        const todo = await Todo.findById(id);
        if (todo == null) {
            return res.status(404).json({ error: { status: 404, message: `A to-do with id "${id}" could not be found` } });
        }
        if (todo.user === uid) {
            res.json(todo);
        } else {
            res.status(403).json({ error: { status: 403, message: 'You can only access your own to-dos' } });
        }
    } else if (['PUT', 'PATCH'].includes(method)) {
        const todo = await Todo.findById(id);
        if (todo == null) {
            return res.status(404).json({ error: { status: 404, message: `A to-do with id "${id}" could not be found` } })
        }

        const { name = todo.name, completed = todo.completed, date = todo.date }: {
            name?: string;
            completed?: boolean;
            date?: Date;
        } = req.body;

        if (todo.user === uid) {
            if (name != null) todo.name = name;
            if (completed != null) todo.completed = completed;
            if (date != null) todo.date = date;

            const newTodo = await todo.save();
            res.json(newTodo);
        } else {
            res.status(403).json({ error: { status: 403, message: 'You can only access your own to-dos' } });
        }
    } else if (method === 'DELETE') {
        const todo = await Todo.findById(id);
        if (todo == null) {
            return res.status(404).json({ error: { status: 404, message: `A to-do with id "${id}" could not be found` } })
        }

        if (todo.user === uid) {
            todo.delete().then(() => res.status(200).json({ success: true }));
        } else {
            res.status(403).json({ error: { status: 403, message: 'You can only access your own to-dos' } });
        }
    } else {
        res.setHeader('Access-Control-Allow-Methods', ['GET', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).json({ error: { status: 405, message: 'Please use either "GET", "PUT", "PATCH", or "DELETE"' } });
    }
};

export default handler;
