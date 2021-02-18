import React from 'react';

const Creator = (): React.ReactElement<{
    children: React.ReactNodeArray;
    className: string;
}> => (
    <section className="creator px-2">
        <p>This was created by <a href="https://github.com/jsmon" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">James Simon</a>, you can view the source code <a href="https://github.com/jsmon/todite" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">on GitHub</a>.</p>
    </section>
);

export default Creator;
