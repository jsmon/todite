import React from 'react';

import Header from '../components/Header';
import About from '../components/About';

const Home = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => (
    <div>
        <Header page="about" />
        <About />
    </div>
);

export default Home;
