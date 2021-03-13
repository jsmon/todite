import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { Theme } from '../types/settings';

import getSettings from '../utils/get-settings';

import MetaData from '../components/MetaData';
import Header from '../components/Header';

const NotFoundPage = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => {
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
            <MetaData page="404" />
            <Header page="404" />

            <main>
                <p>The page you were looking for could not be found. Did you mean to go to one of these pages?</p>
                <section id="main-pages" className="main-pages p-2">
                    <h2 className="font-bold text-2xl">Main Pages</h2>
                    <ul>
                        <li>
                            <Link href="/todos"><a className="text-blue-600 hover:underline focus:underline">To-dos (main page)</a></Link>
                        </li>
                        <li>
                            <Link href="/settings"><a className="text-blue-600 hover:underline focus:underline">App settings</a></Link>
                        </li>
                        <li>
                            <Link href="/sign-in"><a className="text-blue-600 hover:underline focus:underline">Sign in</a></Link>
                        </li>
                        <li>
                            <Link href="/sign-up"><a className="text-blue-600 hover:underline focus:underline">Sign up</a></Link>
                        </li>
                        <li>
                            <Link href="/contributors"><a className="text-blue-600 hover:underline focus:underline">Contributors</a></Link>
                        </li>
                    </ul>
                </section>
                <section id="documentation" className="documentation p-2">
                    <h2 className="font-bold text-2xl">Documentation</h2>
                    <section className="api p-2">
                        <h3 className="font-bold text-lg">API</h3>
                        <ul>
                            <li>
                                <Link href="/docs/api/v1"><a className="text-blue-600 hover:underline focus:underline">v1</a></Link>
                            </li>
                        </ul>
                    </section>
                    <section className="npm p-2">
                        <h3 className="font-bold text-lg">npm</h3>
                        <ul>
                            <li>
                                <Link href="/docs/npm/v0.1"><a className="text-blue-600 hover:underline focus:underline">v0.1</a></Link>
                            </li>
                        </ul>
                    </section>
                    <section className="cli p-2">
                        <h3 className="font-bold text-lg">CLI</h3>
                        <ul>
                            <li>
                                <Link href="/docs/cli/v0.1"><a className="text-blue-600 hover:underline focus:underline">v0.1</a></Link>
                            </li>
                        </ul>
                    </section>
                </section>
            </main>
        </div>
    );
};

export default NotFoundPage;
