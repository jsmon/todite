import React, { useState, useEffect } from 'react';

import { Theme } from '../types/settings';

import getSettings from '../utils/get-settings';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Buttons from '../components/Buttons';
import About from '../components/About';
import Install from '../components/Install';
import ApiDocs from '../components/ApiDocs';
import Creator from '../components/Creator';

const Home = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => {
    interface BeforeInstallPromptEvent extends Event {
        readonly userChoice: Promise<{
            outcome: 'accepted' | 'dismissed';
            platform: string;
        }>;

        prompt(): Promise<void>;
    }

    const [theme, setTheme] = useState<Theme>('system');
    const [showInstallButton, setShowInstallButton] = useState(true);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent  | null>(null);

    useEffect(() => {
        (async () => {
            window.addEventListener('beforeinstallprompt', e => {
                const event = e as BeforeInstallPromptEvent;
                event.preventDefault();

                if (!deferredPrompt) return;

                setDeferredPrompt(event);
                deferredPrompt.prompt();
            });

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

    const hideInstallButton = () => setShowInstallButton(false);

    return (
        <div>
            <MetaData page="about" />
            <Header page="about" />
            <Buttons />
            <About />
            { showInstallButton && <Install deferredPrompt={deferredPrompt} hideInstallButton={hideInstallButton} setDeferredPrompt={setDeferredPrompt} /> }
            <ApiDocs />
            <Creator />
        </div>
    );
};

export default Home;
