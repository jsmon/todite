import React from 'react';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import About from '../components/About';
import Creator from '../components/Creator';

const Home = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => (
    <div>
        <MetaData />
        <Header page="about" />
        <About />
        <Creator />
    </div>
);

export default Home;
