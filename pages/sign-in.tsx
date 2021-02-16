import React from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebaseTypes from 'firebase/app';

import firebase from '../firebase';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Form from '../components/Form';

const SignIn = (): React.ReactElement<{
    children: React.ReactNode;
}, 'main'> => {
    const isSSR = typeof window === 'undefined';

    const auth = isSSR ? undefined : firebase.auth();
    const [user] = isSSR ? [] : useAuthState(auth) as [firebaseTypes.User | undefined, boolean, firebaseTypes.auth.Error | undefined];

    if (user) {
        window.location.replace('/todos');
    }

    return (
        <main>
            <MetaData page="sign-in" />
            <Header page="sign-in" />
            <Form type="sign-in" />
        </main>
    );
};

export default SignIn;
