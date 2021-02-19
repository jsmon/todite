import React from 'react';

interface HeaderProps {
    page: 'about' | 'todos' | 'sign-in' | 'sign-up' | 'settings';
}

const Header = ({ page }: HeaderProps): React.ReactElement<{
    children: React.ReactNode;
    className: string;
}, 'header'> => (
    <header className="text-5xl text-center font-bold p-3.5">
        <h1>{ page === 'about' || page === 'todos' ? 'Todite' : (page === 'sign-in' ? 'Sign In to Todite' : (page === 'sign-up' ? 'Sign Up for Todite' : 'Settings')) }</h1>
    </header>
);

export default Header;
