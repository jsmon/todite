import React from 'react';

import firebaseTypes from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from '../utils/firebase';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Buttons from '../components/Buttons';
import About from '../components/About';
import Creator from '../components/Creator';

const Home = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => {
    const isSSR = typeof window === 'undefined';

    const auth = isSSR ? undefined : firebase.auth();
    const [user] = isSSR ? [] : useAuthState(auth) as [firebaseTypes.User | undefined, boolean, firebaseTypes.auth.Error | undefined];

    if (user) {
        window.location.replace('/todos');
    }

    return (
        <div>
            <MetaData page="about" />
            <Header page="about" />
            <Buttons />
            <About />
            <Creator />
        </div>
    );
};

export default Home;
