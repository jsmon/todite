import React from 'react';

import firebaseTypes from 'firebase/app';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from '../firebase';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Todos from '../components/Todos';

const TodosPage = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => {
    const isSSR = typeof window === 'undefined';
    const auth = isSSR ? undefined : firebase.auth();
    const [user, loading] = isSSR ? [] : useAuthState(auth) as [firebaseTypes.User | undefined, boolean, firebaseTypes.auth.Error | undefined];

    if (!user) {
        if (!loading) {
            !isSSR && window.location.replace('/sign-in');
        }
        return (
            <div>
                <MetaData page="todos" />
                <Header page="todos" />
                <Todos />
                <button className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Sign Out</button>
            </div>
        );
    }

    const signOut = () => {
        auth!.signOut();
    };

    return (
        <div>
            <MetaData page="todos" />
            <Header page="todos" />
            <Todos user={user} />
            <button onClick={signOut} className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Sign Out</button>
        </div>
    ); 
};

export default TodosPage;
