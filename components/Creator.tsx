import React from 'react';

const Creator = (): React.ReactElement<{
    children: React.ReactNodeArray;
    className: 'creator';
}> => (
    <section className="creator">
        <p>This was created by <a href="https://github.com/jsmon" target="_blank" rel="noopener noreferrer">James Simon</a>, you can view the source code <a href="https://github.com/jsmon/todolist" target="_blank" rel="noopener noreferrer">on GitHub</a>.</p>
    </section>
);

export default Creator;
