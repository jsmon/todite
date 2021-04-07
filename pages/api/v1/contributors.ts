import type { NextApiRequest, NextApiResponse } from 'next';

import Contributor from '../../../types/contributor';

import runMiddleware from '../../../utils/run-middleware';

import cors from 'cors';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors());

    interface GithubContributor {
        login: string;
        id: number;
        node_id: string;
        avatar_url: `https://avatars.githubusercontent.com/u/${string}`;
        gravatar_id: string;
        url: `https://api.github.com/users/${string}`;
        html_url: `https://github.com/${string}`;
        followers_url: `https://api.github.com/users/${string}/followers`;
        following_url: `https://api.github.com/users/${string}/following{/other_user}`;
        gists_url: `https://api.github.com/users/${string}/gists{/gist_id}`;
        starred_url: `https://api.github.com/users/${string}/starred{/owner}{/repo}`;
        subscriptions_url: `https://api.github.com/users/${string}/subscriptions`;
        organizations_url: `https://api.github.com/users/${string}/orgs`;
        repos_ur: `https://api.github.com/users/${string}/repos`;
        events_url: `https://api.github.com/users/${string}/events{/privacy}`;
        received_events_url: `https://api.github.com/users/${string}/received_events`;
        type: string;
        site_admin: boolean;
        contributions: number;
    }

    const method = req.method || 'GET';

    if (method === 'GET') {
        const websiteContributors: GithubContributor[] = await fetch('https://api.github.com/repos/jsmon/todite/contributors', {
            method: 'GET',
            headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        })
            .then(res => res.json());

        const npmContributors: GithubContributor[] = await fetch('https://api.github.com/repos/jsmon/todite-npm/contributors', {
            method: 'GET',
            headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        })
            .then(res => res.json());

        const contributorsMap: {
            [githubProfile: string]: [string, number];
        } = {};

        const contributors: Contributor[] = [];

        for (const contributor of websiteContributors) {
            const name: string = (await fetch(contributor.url, {
                method: 'GET',
                headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
            })
                .then(res => res.json())).name ?? contributor.login;

            contributorsMap[contributor.login] = [name, contributor.contributions];
        }
        for (const contributor of npmContributors) {
            if (contributor.login in contributorsMap) {
                contributorsMap[contributor.login][1] += contributor.contributions;
            } else {
                contributorsMap[contributor.login][1] = contributor.contributions;
            }
        }

        for (const profile of Object.keys(contributorsMap)) {
            const contributedTo: ('website' | 'npm')[] = [];
            if (websiteContributors.find(websiteContributor => websiteContributor.login === profile)) {
                contributedTo.push('website');
            }
            if (npmContributors.find(npmContributor => npmContributor.login === profile)) {
                contributedTo.push('npm');
            }

            contributors.push({
                name: contributorsMap[profile][0],
                github: profile,
                contributions: contributorsMap[profile][1],
                contributedTo: <['website', 'npm'] | ['npm', 'website'] | ['website'] | ['npm']>contributedTo
            });
        }

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
