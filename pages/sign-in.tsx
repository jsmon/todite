import React from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebaseTypes from 'firebase';

import MetaData from '../components/MetaData';

import firebase from '../firebase';

import Form from '../components/Form';

const SignIn = (): React.ReactElement<{
    type: 'sign-in';
}, typeof Form> => {
    const isSSR = typeof window === 'undefined';

    const auth = isSSR ? undefined : firebase.auth();
    const [user] = isSSR ? [] : useAuthState(auth) as [firebaseTypes.User | undefined, boolean, firebaseTypes.auth.Error | undefined];

    if (user) {
        window.location.replace('/todos');
    }

    return (
        <>
            <MetaData />
            <Form type="sign-in" />
        </>
    );
};

export default SignIn;
