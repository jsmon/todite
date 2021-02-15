import React from 'react';

import Head from 'next/head';

interface MetaDataProps {
    page: 'about' | 'sign-in' | 'sign-up' | 'todos';
}

const MetaData = ({ page }: MetaDataProps) => (
    <Head>
        <title>{ page === 'about' || page === 'todos' ? 'TodoList' : `TodoList | Sign ${page === 'sign-in' ? 'In' : 'Up'}` }</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="todo, todo list, todolist, todo-list, todo-app" />
        <meta name="description" content="TodoList is a simple app that lets you keep track of what you need to do." />
        <meta name="subject" content="Todolist App" />
        <meta name="language" content="en" />
        <meta name="author" content="James Simon, jsmon.dev@gmail.com" />
        <meta name="designer" content="James Simon, jsmon.dev@gmail.com" />
        <meta name="reply-to" content="jsmon.dev@gmail.com" />
        <meta name="owner" content="James Simon, jsmon.dev@gmail.com" />
        <meta name="url" content="https://todolist.jsmon.vercel.app/" />
        <meta name="identifier-URL" content="https://todolist.jsmon.vercel.app/" />

        <meta property="og:title" content="James Simon" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://todolist.jsmon.vercel.app/" />
        <meta property="og:site_name" content="James Simon" />
        <meta property="og:description" content="TodoList is a simple app that lets you keep track of what you need to do." />
        <meta property="og:email" content="jsmon.dev@gmail.com" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:country-name" content="United Kingdom" />
    </Head>
);

export default MetaData;
