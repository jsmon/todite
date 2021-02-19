import React from 'react';

import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const MyApp = ({ Component, pageProps }: AppProps) => (
    <Component {...pageProps} />
);

export default MyApp;
