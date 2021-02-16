import React, { useState, useRef } from 'react';

import Link from 'next/link';

import firebase from '../firebase';

const isSSR = typeof window === 'undefined';

const Form = ({ type }: {
    type: 'sign-in' | 'sign-up';
}): React.ReactElement<{
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}, 'form'> => {
    if (isSSR) {
        return (
            <form>
                <br />
                <input type="email" name="email" id="email" autoComplete="email" placeholder="Email" />
                <br />
                <p id="email-message"></p>
                <br />
                <input type="password" name="password" id="password" autoComplete={type === 'sign-in' ? 'current-password' : 'new-password'} placeholder="Password" />
                <button id="show-password-button" type="button">Show</button>
                <br />
                <p id="password-message"></p>
                <br />
                <button type="submit">Submit</button>
                <br /><br />
                <button type="button">
                    Sign {type === 'sign-in' ? 'in' : 'up'} with Google
                </button>
                <br /><br />
                <p>
                    {type === 'sign-in' ? "Don't" : 'Already'} have an account? Click <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'}><a>here</a></Link> to sign {type === 'sign-in' ? 'up' : 'in'}
                </p>
            </form>
        );
    }

    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const emailElement = useRef<HTMLInputElement>(null);
    const passwordElement = useRef<HTMLInputElement>(null);
    const showPasswordElement = useRef<HTMLButtonElement>(null);

    const signInWithGoogle = () => {
        auth.signInWithPopup(provider);
    };

    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailMessage('');
        setPasswordMessage('');
        const email = emailElement.current!.value;
        const password = passwordElement.current!.value;
        if (type === 'sign-in') {
            auth.signInWithEmailAndPassword(email, password).catch((err: {
                a: null;
                code: string;
                message: string;
            }) => {
                if (err.code === 'auth/user-not-found') {
                    setEmailMessage('Account with that email does not exist');
                } else if (err.code === 'auth/wrong-password') {
                    setPasswordMessage('Incorrect Password');
                }
            });
        } else {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            const lowercaseRegex = /.*[a-z].*/;
            const uppercaseRegex = /.*[A-Z].*/;
            const numberRegex = /.*[0-9].*/;
            if (!emailRegex.test(email)) {
                setEmailMessage('Invalid email');
                if (passwordRegex.test(password)) return;
            }
            if (password.length < 8) {
                setPasswordMessage('Password must be at least eight characters');
                return;
            } else if (!lowercaseRegex.test(password)) {
                setPasswordMessage('Password must include at least one lowercase letter');
                return;
            } else if (!uppercaseRegex.test(password)) {
                setPasswordMessage('Password must include at least one uppercase letter');
                return;
            } else if (!numberRegex.test(password)) {
                setPasswordMessage('Password must include at least one number');
                return;
            }
            auth.createUserWithEmailAndPassword(email, password).catch((err: {
                a: null;
                code: string;
                message: string;
            }) => {
                if (err.code === 'auth/email-already-in-use') {
                    auth.signInWithEmailAndPassword(email, password).catch(() => {
                        setEmailMessage('User with this email already exists');
                    });
                }
            });
        }
    };
    const setPasswordVisibilty = () => {
        const passwordInput = passwordElement.current!;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            showPasswordElement.current!.innerText = 'Hide';
        } else {
            passwordInput.type = 'password';
            showPasswordElement.current!.innerText = 'Show';
        }
    };

    return (
        <form onSubmit={formSubmit}>
            <br />
            <input ref={emailElement} type="email" name="email" id="email" autoComplete="email" placeholder="Email" />
            <br />
            <p id="email-message">{emailMessage}</p>
            <br />
            <input ref={passwordElement} type="password" name="password" id="password" autoComplete={type === 'sign-in' ? 'current-password' : 'new-password'} placeholder="Password" />
            <button ref={showPasswordElement} id="show-password-button" type="button" onClick={setPasswordVisibilty}>Show</button>
            <br />
            <p id="password-message">{passwordMessage}</p>
            <br />
            <button type="submit">Submit</button>
            <br /><br />
            <button type="button" onClick={signInWithGoogle}>Sign {type === 'sign-in' ? 'in' : 'up'} with Google</button>
            <br /><br />
            <p>{type === 'sign-in' ? "Don't" : 'Already'} have an account? Click <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'}><a>here</a></Link> to sign {type === 'sign-in' ? 'up' : 'in'}</p>
        </form>
    );
};

export default Form;
