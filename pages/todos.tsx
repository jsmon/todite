import React, { useState, useEffect } from 'react';

import { Theme } from '../types/settings';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from '../utils/firebase';
import getSettings from '../utils/get-settings';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Todos from '../components/Todos';

const TodosPage = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => {
    const isSSR = typeof window === 'undefined';

    const [theme, setTheme] = useState<Theme>('system');
    const [deleteTodoOnCompleted, setDeleteTodoOnCompleted] = useState(false);

    const auth = isSSR ? undefined : firebase.auth();
    const [user, loading] = isSSR ? [] : useAuthState(auth!);

    useEffect(() => {
        if (!user) return;

        (async () => {
            if (localStorage.getItem('unsynced-syncSettings') === 'false') {
                if (localStorage.getItem('unsynced-theme') && ['dark', 'light', 'system'].includes(localStorage.getItem('synced-theme')!)) {
                    setTheme(localStorage.getItem('theme') as Theme);
                }
                if (localStorage.getItem('unsynced-deleteTodoOnCompleted') && ['true', 'false'].includes(localStorage.getItem('unsynced-deleteTodoOnCompleted')!)) {
                    setDeleteTodoOnCompleted(localStorage.getItem('unsynced-deleteTodoOnCompleted') === 'true');
                }
                return;
            }

            const settings = await getSettings(user);

            if (settings.syncSettings) {
                localStorage.removeItem('unsynced-theme');
                localStorage.removeItem('unsynced-deleteTodoOnCompleted');
                localStorage.removeItem('unsynced-syncSettings');

                localStorage.setItem('synced-theme', settings.theme);
                localStorage.setItem('synced-deleteTodoOnCompleted', settings.deleteTodoOnCompleted.toString());
                localStorage.setItem('synced-syncSettings', 'true');
            } else {
                localStorage.removeItem('synced-theme');
                localStorage.removeItem('synced-deleteTodoOnCompleted');
                localStorage.removeItem('synced-syncSettings');

                localStorage.setItem('unsynced-theme', settings.theme);
                localStorage.setItem('unsynced-deleteTodoOnCompleted', settings.deleteTodoOnCompleted.toString());
                localStorage.setItem('unsynced-syncSettings', 'false');
            }

            setTheme(settings.theme);
            setDeleteTodoOnCompleted(settings.deleteTodoOnCompleted);
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

    if (!user) {
        if (!loading) {
            !isSSR && window.location.replace('/sign-in');
        }
    }


    return (
        <div>
            <MetaData page="todos" />
            <Header page="todos" />
            <Link href="/settings"><a><i className="absolute top-2 left-2"><FontAwesomeIcon icon={faCog} /></i></a></Link>
            <Todos user={user ?? undefined} deleteTodoOnCompleted={deleteTodoOnCompleted} />
        </div>
    ); 
};

export default TodosPage;
