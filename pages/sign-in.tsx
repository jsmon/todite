import React, { useState, useEffect } from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';

import { Theme } from '../types/settings';

import firebase from '../utils/firebase';
import getSettings from '../utils/get-settings';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Form from '../components/Form';

const SignIn = (): React.ReactElement<{
    children: React.ReactNode;
}, 'main'> => {
    const isSSR = typeof window === 'undefined';

    const [theme, setTheme] = useState<Theme>('system');

    const auth = isSSR ? undefined : firebase.auth();
    const [user] = isSSR ? [] : useAuthState(auth!);

    if (user) {
        window.location.replace('/todos');
    }

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
        <main>
            <MetaData page="sign-in" />
            <Header page="sign-in" />
            <Form type="sign-in" />
        </main>
    );
};

export default SignIn;
