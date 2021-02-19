import React, { useState, useRef } from 'react';

import Link from 'next/link';

import firebase from '../utils/firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const isSSR = typeof window === 'undefined';

interface FormProps {
    type: 'sign-in' | 'sign-up';
}

const Form = ({ type }: FormProps): React.ReactElement<{
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    className: string;
}, 'form'> => {
    if (isSSR) {
        return (
            <form className="mt-8 max-w-md px-2 m-auto">
                <img className="sign-in-with-google min-w-10 m-auto cursor-pointer" src="/sign-in-with-google.png" alt="Sign in With Google" />
                <div className="grid grid-cols-1 gap-6">
                    <label className="block">
                        <span className="text-gray-700 dark:text-gray-300">Email Address</span>
                        <input className="mt-1 block w-full dark:bg-gray-700" type="email" name="email" id="email" autoComplete="email" placeholder="Email Address" />
                    </label>
                    <p id="email-message"></p>
                    <label className="block">
                        <span className="text-gray-700 block dark:text-gray-300">Password</span>
                        <div className="password-container flex">
                            <input className="mt-1 w-full flex-none dark:bg-gray-700" type="password" name="password" id="password" autoComplete={type === 'sign-in' ? 'current-password' : 'new-password'} placeholder="Password" />
                            <i className="flex-1 -ml-7 mt-3 text-xl cursor-pointer"><FontAwesomeIcon icon={faEye} /></i>
                        </div>
                    </label>
                    <p id="password-message"></p>
                    <button type="submit" className="block py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Submit</button>
                    <p>{type === 'sign-in' ? "Don't" : 'Already'} have an account? Click <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'}><a className="text-blue-600 hover:underline">here</a></Link> to sign {type === 'sign-in' ? 'up' : 'in'}</p>
                </div>
            </form>
        );
    }

    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [eyeType, setEyeType] = useState(faEye);
    const emailElement = useRef<HTMLInputElement>(null);
    const passwordElement = useRef<HTMLInputElement>(null);

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
            setEyeType(faEyeSlash);
        } else {
            passwordInput.type = 'password';
            setEyeType(faEye);
        }
    };

    return (
        <form onSubmit={formSubmit} className="mt-8 max-w-md px-2 m-auto">
            <img onClick={signInWithGoogle} className="sign-in-with-google min-w-10 m-auto cursor-pointer" src="/sign-in-with-google.png" alt="Sign in With Google" />
            <div className="grid grid-cols-1 gap-6">
                <label className="block">
                    <span className="text-gray-700 dark:text-gray-300">Email Address</span>
                    <input className="mt-1 block w-full dark:bg-gray-700" ref={emailElement} type="email" name="email" id="email" autoComplete="email" placeholder="Email Address" />
                </label>
                <p id="email-message">{emailMessage}</p>
                <label className="block">
                    <span className="text-gray-700 block dark:text-gray-300">Password</span>
                    <div className="password-container flex">
                        <input className="mt-1 w-full flex-none dark:bg-gray-700" ref={passwordElement} type="password" name="password" id="password" autoComplete={type === 'sign-in' ? 'current-password' : 'new-password'} placeholder="Password" />
                        <i className="flex-1 -ml-7 mt-3 text-xl cursor-pointer" onClick={setPasswordVisibilty}><FontAwesomeIcon icon={eyeType} /></i>
                    </div>
                </label>
                <p id="password-message">{passwordMessage}</p>
                <button type="submit" className="block py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Submit</button>
                <p>{type === 'sign-in' ? "Don't" : 'Already'} have an account? Click <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'}><a className="text-blue-600 hover:underline">here</a></Link> to sign {type === 'sign-in' ? 'up' : 'in'}</p>
            </div>
        </form>
    );
};

export default Form;
