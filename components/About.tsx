import React from 'react';

const About = (): React.ReactElement<{
    children: React.ReactNode;
    className: string;
}, 'section'> => (
    <section className="about p-2">
        <p>Todite is a simple free to-do list app that helps you organise your day.</p>
    </section>
);

export default About;
