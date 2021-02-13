import React from 'react';

import MetaData from '../components/MetaData';
import Header from '../components/Header';
import About from '../components/About';

const Home = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => (
    <div>
        <MetaData />
        <Header page="about" />
        <About />
    </div>
);

export default Home;
