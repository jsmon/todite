import React from 'react';

interface HeaderProps {
    page: 'about' | 'todos' | 'sign-in' | 'sign-up';
}

const Header = ({ page }: HeaderProps): React.ReactElement<{
    children: React.ReactNode;
    className: string;
}, 'header'> => (
    <header className="text-5xl text-center font-bold p-3.5">
        <h1>{ page === 'about' ? 'Todo List' : (page === 'todos' ? 'Todos' : (page === 'sign-in' ? 'Sign In to Todo List' : 'Sign Up for Todo List')) }</h1>
    </header>
);

export default Header;
