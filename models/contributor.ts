import * as mongoose from 'mongoose';

import Contributor from '../types/contributor';

export interface IContributor extends mongoose.Document, Contributor {}

const contributorSchema = new mongoose.Schema<IContributor>({
    name: {
        type: String,
        required: true
    },
    github: {
        type: String,
        required: true
    },
    contributions: {
        type: Number,
        required: true
    }
});

export default contributorSchema;
