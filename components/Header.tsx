import React from 'react';

interface HeaderProps {
    page: 'about' | 'todos' | 'sign-in' | 'sign-up' | 'settings' | 'api-key' | 'api-docs' | 'contributors' | '404';
    apiPage?: 'rest' | 'npm' | 'cli';
    apiVersion?: 'v1' | 'v0.1' | 'v1.0';
}

const Header = ({ page, apiPage, apiVersion }: HeaderProps): React.ReactElement<{
    children: React.ReactNode;
    className: string;
}, 'header'> => {
    let title: string;
    if (page === 'about' || page === 'todos') {
        title = 'Todite';
    } else if (page === 'sign-in' || page === 'sign-up') {
        title = `Sign ${page === 'sign-in' ? 'In to' : 'Up for'} Todite`;
    } else if (page === 'api-docs') {
        if (apiPage === 'rest') {
            title = `REST API ${apiVersion}`;
        } else if (apiPage === 'npm') {
            title = `npm package ${apiVersion}`;
        } else {
            title = `CLI ${apiVersion}`;
        }
    } else if (page === 'api-key') {
        title = 'Your API Key';
    } else if (page === 'contributors') {
        title = 'Todite Contributors';
    } else if (page === 'settings') {
        title = 'Settings';
    } else {
        title = '404 Not Found';
    }

    return (
        <header className="text-5xl text-center font-bold p-3.5">
            <h1>{ title }</h1>
        </header>
    );
};

export default Header;
