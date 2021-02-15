import React from 'react';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import Buttons from '../components/Buttons';
import About from '../components/About';
import Creator from '../components/Creator';

const Home = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => (
    <div>
        <MetaData page="about" />
        <Header page="about" />
        <Buttons />
        <About />
        <Creator />
    </div>
);

export default Home;
