import firebase from 'firebase/app';
import Settings, { Theme } from '../types/settings';

const getSettings = async (user?: firebase.User): Promise<Settings> => {
    let theme: Theme = 'system';
    let deleteTodoOnCompleted = false;
    let syncSettings = true;

    let settings: Settings | undefined;

    if (user) {
        settings = await fetch('/api/v1/user', {
            method: 'GET',
            headers: { Authorization: await user.getIdToken(true) }
        }).then(res => res.json()).then(user => user.settings);
        if (settings) {
            theme = settings.theme;
            deleteTodoOnCompleted = settings.deleteTodoOnCompleted;
            syncSettings = settings.syncSettings;

            return { theme, deleteTodoOnCompleted, syncSettings };
        }
    }

    if (localStorage.getItem('synced-theme')) {
        if (['dark', 'light', 'system'].includes(localStorage.getItem('synced-theme')!)) {
            theme = <Theme>localStorage.getItem('synced-theme')!;
        }
    } else if (localStorage.getItem('unsynced-theme')) {
        if (['dark', 'light', 'system'].includes(localStorage.getItem('unsynced-theme')!)) {
            theme = <Theme>localStorage.getItem('unsynced-theme')!;
        }
    }

    if (localStorage.getItem('synced-deleteTodoOnCompleted')) {
        if (['true', 'false'].includes(localStorage.getItem('synced-deleteTodoOnCompleted')!)) {
            deleteTodoOnCompleted = localStorage.getItem('synced-deleteTodoOnCompleted') === 'true';
        }
    } else if (localStorage.getItem('unsynced-deleteTodoOnCompleted')) {
        if (['true', 'false'].includes(localStorage.getItem('unsynced-deleteTodoOnCompleted')!)) {
            deleteTodoOnCompleted = localStorage.getItem('unsynced-deleteTodoOnCompleted') === 'true';
        }
    }

    if (localStorage.getItem('synced-syncSettings')) {
        if (['true', 'false'].includes(localStorage.getItem('synced-syncSettings')!)) {
            syncSettings = localStorage.getItem('synced-syncSettings') === 'true';
        }
    } else if (localStorage.getItem('unsynced-syncSettings')) {
        if (['true', 'false'].includes(localStorage.getItem('unsynced-syncSettings')!)) {
            syncSettings = localStorage.getItem('unsynced-syncSettings') === 'true';
        }
    }

    return { theme, deleteTodoOnCompleted, syncSettings };
};

export default getSettings;
