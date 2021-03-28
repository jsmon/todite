import React, { useState, useEffect } from 'react';

import { Theme } from '../types/settings';

import getSettings from '../utils/get-settings';

import MetaData from '../components/MetaData';
import Header from '../components/Header';

const FallbackPage = (): React.ReactElement<{
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
            <MetaData page="fallback" />
            <Header page="fallback" />
            
            <main className="p-2">
                <p>It appears you're offline... Try checking your internet connection.</p>
            </main>
        </div>
    );
};

export default FallbackPage;
