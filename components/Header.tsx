import React from 'react';

interface HeaderProps {
    page: 'about' | 'todos';
}

const Header = ({ page }: HeaderProps): React.ReactElement<{
    children: React.ReactNode;
}, 'header'> => (
    <header>
        <h1>{ page === 'about' ? 'Todo List' : 'Todos' }</h1>
    </header>
);

export default Header;
