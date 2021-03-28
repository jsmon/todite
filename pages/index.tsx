import React, { useState, useEffect } from 'react';

import { Theme } from '../types/settings';

import getSettings from '../utils/get-settings';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Buttons from '../components/Buttons';
import About from '../components/About';
import ApiDocs from '../components/ApiDocs';
import Creator from '../components/Creator';

const Home = (): React.ReactElement<{
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
            <MetaData page="about" />
            <Header page="about" />
            <Buttons />
            <About />
            <ApiDocs />
            <Creator />
        </div>
    );
};

export default Home;
