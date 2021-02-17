import React from 'react';

const About = (): React.ReactElement<{
    children: React.ReactNode;
    className: string;
}, 'section'> => (
    <section className="about p-2">
        <p>Todo List is a simple app that lets you keep track of what you need to do.</p>
    </section>
);

export default About;
