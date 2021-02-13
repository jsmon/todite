import React from 'react';

const About = (): React.ReactElement<{
    children: React.ReactNode;
    className: 'about';
}, 'section'> => (
    <section className="about">
        <p>Todo List is a simple app that lets you keep track of what you need to do.</p>
    </section>
);

export default About;
