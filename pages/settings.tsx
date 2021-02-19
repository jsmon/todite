import React, { useState, useRef, useEffect } from 'react';

import firebaseTypes from 'firebase/app';
import { Theme } from '../types/settings';

import { useAuthState } from 'react-firebase-hooks/auth';
import Swal from 'sweetalert2';

import firebase from '../utils/firebase';
import getSettings from '../utils/get-settings';

import MetaData from '../components/MetaData';
import Header from '../components/Header';

const SettingsPage = (): React.ReactElement<{
    children: React.ReactNode;
}, 'main'> => {
    const isSSR = typeof window === 'undefined';
    const auth = isSSR ? undefined : firebase.auth();
    const [user, loading] = isSSR ? [] : useAuthState(auth) as [firebaseTypes.User | undefined, boolean, firebaseTypes.auth.Error | undefined];

    const [theme, setTheme] = useState<Theme>('system');
    const [deleteTodoOnCompleted, setDeleteTodoOnCompleted] = useState(false);
    const [syncSettings, setSyncSettings] = useState(true);

    const systemDefaultThemeInput = useRef<HTMLInputElement>(null);
    const darkThemeInput = useRef<HTMLInputElement>(null);
    const lightThemeInput = useRef<HTMLInputElement>(null);
    const savedMessage = useRef<HTMLParagraphElement>(null);

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
                if (localStorage.getItem('unsynced-syncSettings') && ['true', 'false'].includes(localStorage.getItem('unsynced-syncSettings')!)) {
                    setSyncSettings(localStorage.getItem('unsynced-syncSettings') === 'true');
                }
                return;
            }

            const settings = await getSettings(user.uid);

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

    const updateTheme = () => {
        let newTheme: Theme;

        if (systemDefaultThemeInput.current!.checked) {
            newTheme = 'system'
        } else if (darkThemeInput.current!.checked) {
            newTheme = 'dark';
        } else {
            newTheme = 'light';
        }

        setTheme(newTheme);
    };

    const check = (theme: Theme) => {
        if (theme === 'system') {
            systemDefaultThemeInput.current!.checked = true;
        } else if (theme === 'dark') {
            darkThemeInput.current!.checked = true;
        } else {
            lightThemeInput.current!.checked = true;
        }
        updateTheme();
    };

    const updateDeleteTodoOnCompleted = () => setDeleteTodoOnCompleted(prevDeleteTodoOnCompleted => !prevDeleteTodoOnCompleted);
    
    const updateSyncSettings = () => setSyncSettings(prevSyncSettings => !prevSyncSettings);

    const saveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!user) return;

        savedMessage.current!.innerText = 'Saving...';
        savedMessage.current!.classList.add('bg-yellow-600', 'm-4', 'rounded', 'text-center', 'text-black');

        if (syncSettings) {
            localStorage.removeItem('unsynced-theme');
            localStorage.removeItem('unsynced-deleteTodoOnCompleted');
            localStorage.removeItem('unsynced-syncSettings');

            localStorage.setItem('synced-theme', theme);
            localStorage.setItem('synced-deleteTodoOnCompleted', deleteTodoOnCompleted.toString());
            localStorage.setItem('synced-syncSettings', 'true');

            await fetch(`/api/user?firebase_id=${user.uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ settings: { theme, deleteTodoOnCompleted, syncSettings } })
            });
        } else {
            localStorage.removeItem('synced-theme');
            localStorage.removeItem('synced-deleteTodoOnCompleted');
            localStorage.removeItem('synced-syncSettings');

            localStorage.setItem('unsynced-theme', theme);
            localStorage.setItem('unsynced-deleteTodoOnCompleted', deleteTodoOnCompleted.toString());
            localStorage.setItem('unsynced-syncSettings', 'false');
        }

        savedMessage.current!.innerText = 'Saved!';
        savedMessage.current!.classList.remove('bg-yellow-600');
        savedMessage.current!.classList.add('bg-green-400', 'm-4', 'rounded', 'text-center', 'text-black');
        setTimeout(() => {
            savedMessage.current!.innerText = '';
            savedMessage.current!.classList.remove('bg-yellow-600', 'bg-green-400', 'm-4', 'rounded', 'text-center', 'text-black');
        }, 2000);
    };

    const signOut = () => {
        localStorage.removeItem('synced-theme');
        localStorage.removeItem('synced-deleteTodoOnCompleted');
        localStorage.removeItem('synced-syncSettings');

        localStorage.setItem('unsynced-theme', theme);
        localStorage.setItem('unsynced-deleteTodoOnCompleted', deleteTodoOnCompleted.toString());
        localStorage.setItem('unsynced-syncSettings', syncSettings.toString());

        auth!.signOut();
    };

    const deleteUser = async () => {
        if (!user) return;

        const choice = await Swal.fire({
            showDenyButton: true,
            denyButtonText: 'Yes, delete my account.',
            denyButtonColor: '#dd6b55',
            confirmButtonText: 'No thanks.',
            confirmButtonColor: '#3085d6',
            icon: 'warning',
            title: 'Are you sure you want to permanently delete your account?',
            text: 'It will be gone forever.'
        });

        if (choice.isDenied) {
            const lastChance = await Swal.fire({
                showDenyButton: true,
                denyButtonText: "Yes, I know what I'm doing.",
                denyButtonColor: '#dd6b55',
                confirmButtonText: "No, I've changed my mind.",
                confirmButtonColor: '#3085d6',
                icon: 'error',
                title: "Are you sure you know what you're doing?",
                text: "Do you really want to delete your account :("
            });

            if (lastChance.isDenied) {
                user!.delete().catch(async () => {
                    const provider = user.providerData[0]?.providerId!;

                    const password = provider === 'password' ? await Swal.fire({
                        icon: 'info',
                        input: 'password',
                        title: 'Please confirm your password',
                    }).then(password => password.value) : undefined;

                    fetch(`/api/user?firebase_id=${user.uid}`, { method: 'DELETE' });
                    user!.reauthenticateWithCredential(provider === 'password' ? firebase.auth.EmailAuthProvider.credential(user.email!, password) : firebase.auth.GoogleAuthProvider.credential(await user.getIdToken()));
                    window.location.replace('/sign-in');
                });
            }
        }
    };

    if (!user) {
        if (!loading) {
            !isSSR && window.location.replace('/sign-in');
        }
    }


    return (
        <main>
            <MetaData page="settings" />
            <Header page="settings" />

            <form className="settings" onSubmit={saveSettings}>
                <div id="theme" className="p-2">
                    <h2 className="font-bold text-2xl">Theme</h2>
                    <div>
                        <input ref={systemDefaultThemeInput} type="radio" name="theme" checked={theme === 'system'} onChange={updateTheme} /> <span onClick={() => check('system')}>System default</span>
                    </div>
                    <div>
                        <input ref={darkThemeInput} type="radio" name="theme" checked={theme === 'dark'} onChange={updateTheme} /> <span onClick={() => check('dark')}>Dark</span>
                    </div>
                    <div>
                        <input ref={lightThemeInput} type="radio" name="theme" checked={theme === 'light'} onChange={updateTheme} /> <span onClick={() => check('light')}>Light</span>
                    </div>
                </div>
                <div id="delete-todo-on-completed" className="p-2">
                    <h2 className="font-bold text-2xl">Delete to-do on completed</h2>
                    <input type="checkbox" name="delete-todo-on-completed" checked={deleteTodoOnCompleted} onChange={updateDeleteTodoOnCompleted} /> <span onClick={updateDeleteTodoOnCompleted}>When a to-do is marked as completed, automatically delete it.</span>
                </div>
                <div id="sync-settings" className="p-2">
                    <h2 className="font-bold text-2xl">Sync Settings</h2>
                    <input type="checkbox" name="sync-settings" checked={syncSettings} onChange={updateSyncSettings} /> <span onClick={updateSyncSettings}>Sync these settings across all devices you log in to</span>
                </div>
                <button type="submit" className="m-2 px-3 py-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Save</button>
                <button type="button" onClick={signOut} className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-500 dark:hover:bg-red-800">Sign Out</button>
                <button type="button" onClick={deleteUser} className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-500 dark:hover:bg-red-800">Delete User</button>
                <p ref={savedMessage} className="saved-message"></p>
            </form>
        </main>
    );
};

export default SettingsPage;
