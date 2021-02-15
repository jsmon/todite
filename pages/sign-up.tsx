import React from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebaseTypes from 'firebase';

import MetaData from '../components/MetaData';

import firebase from '../firebase';

import Form from '../components/Form';

const SignUp = (): React.ReactElement<{
    type: 'sign-up';
}, typeof Form> => {
    const isSSR = typeof window === 'undefined';

    const auth = isSSR ? undefined : firebase.auth();
    const [user] = isSSR ? [] : useAuthState(auth) as [firebaseTypes.User | undefined, boolean, firebaseTypes.auth.Error | undefined];

    if (user) {
        window.location.replace('/todos');
    }

    return (
        <>
            <MetaData page="sign-up" />
            <Form type="sign-up" />
        </>
    );
};

export default SignUp;
