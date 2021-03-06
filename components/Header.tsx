import React from 'react';

interface HeaderProps {
    page: 'about' | 'todos' | 'sign-in' | 'sign-up' | 'settings' | 'api-key' | 'api-docs';
    apiPage?: 'rest' | 'npm';
    apiVersion?: 'v1' | 'v0.1';
}

const Header = ({ page, apiPage, apiVersion }: HeaderProps): React.ReactElement<{
    children: React.ReactNode;
    className: string;
}, 'header'> => (
    <header className="text-5xl text-center font-bold p-3.5">
        <h1>{ page === 'about' || page === 'todos' ? 'Todite' : (page === 'sign-in' ? 'Sign In to Todite' : (page === 'sign-up' ? 'Sign Up for Todite' : (page === 'api-docs' ? `${apiPage === 'rest' ? 'REST API' : 'npm package'} ${apiVersion}` : (page === 'api-key' ? 'Your API Key' : 'Settings')))) }</h1>
    </header>
);

export default Header;
