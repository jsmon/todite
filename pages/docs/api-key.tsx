import React, { useState, useRef, useEffect } from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';

import { Theme } from '../../types/settings';

import firebase from '../../utils/firebase';
import getSettings from '../../utils/get-settings';

import MetaData from '../../components/MetaData';
import Header from '../../components/Header';

const ApiKey = () => {
    const isSSR = typeof window === 'undefined';
    const auth = isSSR ? undefined : firebase.auth();
    const [user, loading] = isSSR ? [] : useAuthState(auth) as [firebase.User | undefined, boolean, firebase.auth.Error | undefined];

    const [theme, setTheme] = useState<Theme>('system');
    const [apiKey, setApiKey] = useState<string | null>(null);

    const showApiKeyButton = useRef<HTMLButtonElement>(null);
    const apiKeyText = useRef<HTMLElement>(null);
    const savedMessage = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!user) return;

        (async () => {
            const apiKeyData = await fetch('/api/v1/api-key', {
                method: 'GET',
                headers: { Authorization: await user.getIdToken(true) }
            }).then(res => res.json());

            setApiKey(apiKeyData.apiKey);

            const settings = await getSettings();
            setTheme(settings.theme);
        })();
    }, [user]);
    useEffect(() => {
        document.querySelector('html')!.classList.remove('dark', 'light');

        if (theme === 'system') {
            const newTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
            document.querySelector('html')!.classList.add(newTheme);
        } else {
            document.querySelector('html')!.classList.add(theme);
        }
    }, [theme]);

    const showApiKey = () => {
        if (showApiKeyButton.current!.innerText === 'Show API Key') {
            showApiKeyButton.current!.innerText = 'Hide API Key';
            apiKeyText.current!.innerText = apiKey ?? 'Loading...';
        } else {
            showApiKeyButton.current!.innerText = 'Show API Key';
            apiKeyText.current!.innerText = '';
        }
    };

    const regenerateApiKey = async () => {
        if (!user) return;

        savedMessage.current!.innerText = 'Regenerating...';
        savedMessage.current!.classList.add('bg-yellow-600', 'm-4', 'rounded', 'text-center', 'text-black');

        const newApiKeyData = await fetch('/api/v1/api-key', {
            method: 'PUT',
            headers: { Authorization: await user.getIdToken(true) }
        }).then(res => res.json());

        setApiKey(newApiKeyData.apiKey);

        if (showApiKeyButton.current!.innerText === 'Hide API Key') {
            apiKeyText.current!.innerText = newApiKeyData.apiKey;
        }

        savedMessage.current!.innerText = 'Regenerated!';
        savedMessage.current!.classList.remove('bg-yellow-600');
        savedMessage.current!.classList.add('bg-green-400', 'm-4', 'rounded', 'text-center', 'text-black');
        setTimeout(() => {
            savedMessage.current!.innerText = '';
            savedMessage.current!.classList.remove('bg-yellow-600', 'bg-green-400', 'm-4', 'rounded', 'text-center', 'text-black');
        }, 2000);
    };

    if (!user && !isSSR) {
        if (!loading) {
            window.location.replace('/sign-in');
            return null;
        }
    }

    return (
        <div>
            <MetaData page="api-key" />
            <Header page="api-key" />
            <main>
                <section id="what-is-an-api-key" className="p-2">
                    <h2 className="font-bold text-2xl">What is an API Key?</h2>
                    <p>If you're not a developer, you don't need to worry about API keys. If you want to know anyway, read the paragraph below. If you are a developer, you should know what API keys are.</p>
                    <p>Basically, an API key is a unique random string of letters and numbers that the server can identify you with, that are almost impossible to guess, so if someone gets your API key they can trick the server into thinking they're someone else. (so don't let anyone get your API key!)</p>
                    <p>If you want to test the API without using your own account, you can use the API key "<code>00000000-0000-0000-0000-000000000000</code>"</p>
                </section>
                <section id="show-api-key" className="p-2">
                    <h2 className="font-bold text-2xl">Show API Key</h2>
                    <p>Click here to see your API key</p>
                    <button ref={showApiKeyButton} onClick={showApiKey} className="p-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Show API Key</button>
                    <p className="api-key" id="api-key"><code ref={apiKeyText}></code></p>
                </section>
                <section id="regenerate-api-key" className="p-2">
                    <h2 className="font-bold text-2xl">Regenerate API Key</h2>
                    <p>If you think someone might've found your API key, you should probably try and keep your API key safer next time, and also get a new one.</p>
                    <button onClick={regenerateApiKey} className="p-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Regenerate API Key</button>
                    <p ref={savedMessage}></p>
                </section>
            </main>
        </div>
    );
};

export default ApiKey;
