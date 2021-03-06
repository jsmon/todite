import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { Theme } from '../types/settings';
import Contributor from '../types/contributor';

import getSettings from '../utils/get-settings';

import MetaData from '../components/MetaData';
import Header from '../components/Header';

interface ContributorsPageProps {
    contributors: Contributor[];
}

const ContributorsPage = ({ contributors }: ContributorsPageProps) => {
    const [theme, setTheme] = useState<Theme>('system');

    useEffect(() => {
        (async () => {
            const settings = await getSettings();
            setTheme(settings.theme);
        })();
    }, []);
    useEffect(() => {
        document.querySelector('html')!.classList.remove('dark', 'light');

        if (theme === 'system') {
            const newTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
            document.querySelector('html')!.classList.add(newTheme);
        } else {
            document.querySelector('html')!.classList.add(theme);
        }
    }, [theme]);


    
    return (
        <div>
            <MetaData page="contributors" />
            <Header page="contributors" />
            <main className="p-2">
                <p>Thank you to all Todite contributors, without you, Todite would probably not have gone anywhere!</p>
                <ul className="py-2">
                    { contributors.map(contributor => (
                        <li key={contributor.github}>
                            <Link href={`https://github.com/${contributor.github}`}>
                                <a className="text-blue-600 hover:underline focus:underline">{ contributor.name }</a>
                            </Link>
                            { ' ' }
                            (<Link href={`https://github.com/jsmon/todite/commits?author=${contributor.github}`}>
                                <a className="text-blue-600 hover:underline focus:underline">{ new Intl.NumberFormat('en-GB').format(contributor.contributions) } contribution{ contributor.contributions === 1 ? '' : 's' }</a>
                            </Link>)
                        </li>
                    )) }
                </ul>
                <p>If you want to contribute to the project, feel free to <Link href="https://github.com/jsmon/todite"><a className="text-blue-600 hover:underline focus:underline">submit a pull request</a></Link>.</p>
                { contributors.length === 1 && <p>It looks like I'm still the only contributor (which is probably why it looks so bad)</p> }
            </main>
        </div>
    );
};

export const getServerSideProps = async () => {
    const contributors: Contributor[] = await fetch(process.env.NODE_ENV === 'production' ? 'https://todite.vercel.app/api/v1/contributors' : 'http://localhost:3000/api/v1/contributors')
        .then(res => res.json());

    return {
        props: {
            contributors
        }
    };
};

export default ContributorsPage;
