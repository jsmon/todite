import React from 'react';

import Header from '../components/Header';

const Home = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => (
    <div>
        <Header page="about" />
    </div>
);

export default Home;
