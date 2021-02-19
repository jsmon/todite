import React, { useState, useEffect } from 'react';

import firebaseTypes from 'firebase/app';
import { Theme } from '../types/settings';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from '../utils/firebase';
import getSettings from '../utils/get-settings';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Buttons from '../components/Buttons';
import About from '../components/About';
import Creator from '../components/Creator';

const Home = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => {
    const isSSR = typeof window === 'undefined';

    const [theme, setTheme] = useState<Theme>('system');

    const auth = isSSR ? undefined : firebase.auth();
    const [user] = isSSR ? [] : useAuthState(auth) as [firebaseTypes.User | undefined, boolean, firebaseTypes.auth.Error | undefined];

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

    if (user) {
        window.location.replace('/todos');
    }

    return (
        <div>
            <MetaData page="about" />
            <Header page="about" />
            <Buttons />
            <About />
            <Creator />
        </div>
    );
};

export default Home;
