import type { NextApiRequest, NextApiResponse } from 'next';

import runMiddleware from '../../../utils/run-middleware';

import * as mongoose from 'mongoose';
import cors from 'cors';

import contributorSchema, { IContributor } from '../../../models/contributor';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors());

    const contributorConnection = await mongoose.createConnection(process.env.CONTRIBUTOR_DATABASE_URL!, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const Contributor: mongoose.Model<IContributor> = contributorConnection.models.Contributor || contributorConnection.model('Contributor', contributorSchema);

    const method = req.method || 'GET';

    if (method === 'GET') {
        const contributors = await Contributor.find();

        res.json(contributors.sort((a, b) => {
            // Return `-1` to put `a` first, `1` to put `b` first, or `0` if they're the same
            if (a.github === 'jsmon') {
                return -1;
            } else if (b.github === 'jsmon') {
                return 1;
            } else if (a.contributions > b.contributions) {
                return -1;
            } else if (b.contributions > a.contributions) {
                return 1;
            } else {
                return 0;
            }
        }));
    } else {
        res.setHeader('Access-Control-Allow-Methods', ['GET']);
        res.status(405).json({ error: { status: 405, message: 'Please use "GET"' } });
    }
};

export default handler;
