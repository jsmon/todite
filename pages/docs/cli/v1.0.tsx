import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import getSettings from '../../../utils/get-settings';

import { Theme } from '../../../types/settings';

import Header from '../../../components/Header';
import MetaData from '../../../components/MetaData';

const CliDocsV10 = (): React.ReactElement<{
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
            <MetaData page="api-docs" apiPage="cli" apiVersion="v1.0" />
            <Header page="api-docs" apiPage="cli" apiVersion="v1.0" />
            <main>
                <section id="other-versions" className="other-versions p-2">
                    <h2 className="font-bold text-2xl">Other versions</h2>
                    <ul>
                        <li>
                            <Link href="/docs/cli/v0.1"><a className="text-blue-600 hover:underline focus:underline">v0.1</a></Link>
                        </li>
                    </ul>
                </section>
                <section id="description" className="description p-2">
                    <p>This is a CLI that you can use to access the <Link href="/docs/api/v1"><a className="text-blue-600 hover:underline focus:underline">Todite API</a></Link> through the command line.</p>
                </section>
                <section id="requirements" className="requirements p-2">
                    <h2 className="font-bold text-2xl">Requirements</h2>
                    <p>To use this CLI you must have at least <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline focus:underline">Node.js</a> v10.13 or later, and <a href="https://www.npmjs.com/package/npm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline focus:underline">npm</a> v5.2 or later. (npm comes built in with Node.js, so you don't need to worry about installing it yourself)</p>
                </section>
                <section id="installation" className="installation p-2">
                    <h2 className="font-bold text-2xl">Installation</h2>
                    <p>You can install the CLI through npm:</p>
                    <pre><code>$ npm install -g todite@latest</code></pre>
                    <p>and then use the global <code>todite</code> command anywhere on your computer, or you could use <code>npx</code> if you don't want to install <code>todite</code> on your computer:</p>
                    <pre><code>$ npx todite some-command</code></pre>
                    <p>(same as running <code>todite some-command</code> if you installed it with npm)</p>
                </section>
                <section id="get-all" className="get-all p-2">
                    <h2 className="font-bold text-2xl"><code>$ todite get-all</code></h2>
                    <section className="description p-2">
                        <p>The <code>get-all</code> command gets all of a user's to-dos.</p>
                    </section>
                    <section className="options p-2">
                        <h2 className="font-bold text-2xl">Options</h2>
                        Required options:
                        <ul>
                            <li>
                                <code>-a</code> or <code>--api-key</code> - <code>string</code> - Your API Key
                            </li>
                        </ul>
                    </section>
                </section>
                <section id="get" className="get p-2">
                    <h2 className="font-bold text-2xl"><code>$ todite get</code></h2>
                    <section className="description p-2">
                        <p>The <code>get</code> command gets one of a user's to-dos.</p>
                    </section>
                    <section className="options p-2">
                        <h2 className="font-bold text-2xl">Options</h2>
                        Required options:
                        <ul>
                            <li>
                                <code>-a</code> or <code>--api-key</code> - <code>string</code> - Your API Key
                            </li>
                            <li>
                                <code>-id</code> or <code>--todo-id</code> - <code>string</code> - The to-dos ID
                            </li>
                        </ul>
                    </section>
                </section>
                <section id="update" className="update p-2">
                    <h2 className="font-bold text-2xl"><code>$ todite update</code></h2>
                    <section className="description p-2">
                        <p>The <code>update</code> command updates one of a user's to-dos.</p>
                    </section>
                    <section className="options p-2">
                        <h2 className="font-bold text-2xl">Options</h2>
                        Required options:
                        <ul>
                            <li>
                                <code>-a</code> or <code>--api-key</code> - <code>string</code> - Your API Key
                            </li>
                            <li>
                                <code>-id</code> or <code>--todo-id</code> - <code>string</code> - The to-dos ID
                            </li>
                        </ul>
                        Optional options:
                        <ul>
                            <li>
                                <code>-n</code> or <code>--name</code> - <code>string</code> - The to-dos new name
                            </li>
                            <li>
                                <code>-c</code> or <code>--completed</code> - <code>boolean</code> - Whether the updated to-do has been completed
                            </li>
                            <li>
                                <code>-d</code> or <code>--date</code> - ISO formatted date string - The to-dos updated date
                            </li>
                        </ul>
                    </section>
                </section>
                <section id="delete" className="delete p-2">
                    <h2 className="font-bold text-2xl"><code>$ todite delete</code></h2>
                    <section className="description p-2">
                        <p>The <code>delete</code> command deletes one of a user's to-dos.</p>
                    </section>
                    <section className="options p-2">
                        <h2 className="font-bold text-2xl">Options</h2>
                        Required options:
                        <ul>
                            <li>
                                <code>-a</code> or <code>--api-key</code> - <code>string</code> - Your API Key
                            </li>
                            <li>
                                <code>-id</code> or <code>--todo-id</code> - <code>string</code> - The to-dos ID
                            </li>
                        </ul>
                    </section>
                </section>
                <section id="create" className="create p-2">
                    <h2 className="font-bold text-2xl"><code>$ todite create</code></h2>
                    <section className="description p-2">
                        <p>The <code>create</code> command creates a new to-do.</p>
                    </section>
                    <section className="options p-2">
                        <h2 className="font-bold text-2xl">Options</h2>
                        Required options:
                        <ul>
                            <li>
                                <code>-a</code> or <code>--api-key</code> - <code>string</code> - Your API Key
                            </li>
                            <li>
                                <code>-n</code> or <code>--name</code> - <code>string</code> - The to-dos name
                            </li>
                        </ul>
                        Optional options:
                        <ul>
                            <li>
                                <code>-c</code> or <code>--completed</code> - <code>boolean</code> - Whether the updated to-do has been completed
                            </li>
                            <li>
                                <code>-d</code> or <code>--date</code> - ISO formatted date string - The to-dos updated date
                            </li>
                        </ul>
                    </section>
                </section>
            </main>
        </div>
    );
};

export default CliDocsV10;
