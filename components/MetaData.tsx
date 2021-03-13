import React from 'react';

import Head from 'next/head';

interface MetaDataProps {
    page: 'about' | 'sign-in' | 'sign-up' | 'todos' | 'settings' | 'api-key' | 'api-docs' | 'contributors';
    apiPage?: 'rest' | 'npm' | 'cli';
    apiVersion?: 'v1' | 'v0.1';
}

const MetaData = ({ page, apiPage, apiVersion }: MetaDataProps) => {
    let title: string;
    if (page === 'about' || page === 'todos') {
        title = 'Todite | Organize your day';
    } else if (page === 'sign-in' || page === 'sign-up') {
        title = `Todite | Sign ${page === 'sign-in' ? 'In' : 'Up'}`;
    } else if (page === 'api-docs') {
        if (apiPage === 'rest') {
            title = `Todite Dev | REST API ${apiVersion}`;
        } else if (apiPage === 'npm') {
            title = `Todite Dev | npm package ${apiVersion}`;
        } else {
            title = `Todite Dev | CLI ${apiVersion}`;
        }
    } else if (page === 'api-key') {
        title = 'Todite Dev | Your API Key';
    } else if (page === 'contributors') {
        title = 'Todite | Contributors';
    } else {
        title = 'Todite | Settings';
    }

    let description: string;
    if (page === 'about' || page === 'todos') {
        description = 'Todite is a simple free to-do list app that helps you organise your day';
    } else if (page === 'sign-in' || page === 'sign-up') {
        description = `Sign ${page === 'sign-in' ? 'In' : 'Up'} to Todite - a simple free to-do list app that helps you organise your day`;
    } else if (page === 'api-docs') {
        description = `Documentation for the Todite ${apiPage === 'rest' ? 'REST API' : 'npm package'} ${apiVersion}`;
    } else if (page === 'api-key') {
        description = 'See or regenerate your API key for the Todite REST API / npm package';
    } else if (page === 'contributors') {
        description = 'See a list of all of the people who made Todite possible';
    } else {
        description = 'Update your settings for the Todite app';
    }

    return (
        <Head>
            <title>{ title }</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="keywords" content="todite, todo, to-do, todo list, to-do list, todolist, todo-list, todo-app" />
            <meta name="description" content={description} />
            <meta name="subject" content="To-do list App" />
            <meta name="language" content="en" />
            <meta name="author" content="James Simon, jsmon.dev@gmail.com" />
            <meta name="designer" content="James Simon, jsmon.dev@gmail.com" />
            <meta name="reply-to" content="jsmon.dev@gmail.com" />
            <meta name="owner" content="James Simon, jsmon.dev@gmail.com" />
            <meta name="url" content="https://todite.vercel.app/" />
            <meta name="identifier-URL" content="https://todite.vercel.app/" />

            <meta property="og:title" content="Todite" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://todite.vercel.app/" />
            <meta property="og:image" content="https://todite.vercel.app/icons/manifest-icon-192.png" />
            <meta property="og:image:url" content="https://todite.vercel.app/icons/manifest-icon-192.png" />
            <meta property="og:image:secure_url" content="https://todite.vercel.app/icons/manifest-icon-192.png" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="192" />
            <meta property="og:image:height" content="192" />
            <meta property="og:image:alt" content="Three lines with ticks and crosses next to each other, representing a to-do list." />
            <meta property="og:site_name" content="Todite" />
            <meta property="og:description" content={description} />
            <meta property="og:email" content="jsmon.dev@gmail.com" />
            <meta property="og:locale" content="en_GB" />
            <meta property="og:country-name" content="United Kingdom" />

            <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />

            <link rel="manifest" href="/manifest.json" />

            <meta name="apple-mobile-web-app-capable" content="yes" />

            <link rel="icon" href="/icons/manifest-icon-192.png" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2732-2048.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2388.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2388-1668.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-1536.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2224.jpg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2224-1668.jpg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1620-2160.jpg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2160-1620.jpg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1284-2778.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2778-1284.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1170-2532.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2532-1170.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2436-1125.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2688.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2688-1242.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-828-1792.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1792-828.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2208.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-2208-1242.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1334-750.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-640-1136.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
            <link rel="apple-touch-startup-image" href="/icons/apple-splash-1136-640.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
        </Head>
    );
};

export default MetaData;
