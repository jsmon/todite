import React from 'react';

import Link from 'next/link';

const ApiDocs = (): React.ReactElement<{
    id: 'for-developers';
    className: string;
    children: React.ReactNode;
}, 'div'> => (
    <div id="for-developers" className="p-2">
        <h2 className="font-bold text-2xl">For Developers</h2>
        <p>If you are a developer who would like to integrate Todite into your project, you can use these free official resources:</p>
        <ul>
            <li><Link href="/docs/api-key"><a className="text-blue-600 hover:underline focus:underline">Your API Key</a></Link></li>
            <li><Link href="/docs/api/v1"><a className="text-blue-600 hover:underline focus:underline">REST API</a></Link></li>
            <li><Link href="/docs/npm/v0.1"><a className="text-blue-600 hover:underline focus:underline">npm package</a></Link></li>
            <li><Link href="/docs/cli/v0.1"><a className="text-blue-600 hover:underline focus:underline">CLI</a></Link></li>
        </ul>
    </div>
);

export default ApiDocs;
