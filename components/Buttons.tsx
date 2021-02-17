import React from 'react';

import Link from 'next/link';

const Buttons = (): React.ReactElement<{
    children: React.ReactNode;
    className: 'buttons';
}, 'div'> => (
    <div className="buttons">
        <Link href="/sign-in">
            <a className="py-2 px-4 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Sign In</a>
        </Link>

        <Link href="/sign-up">
            <a className="py-2 px-4 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Sign Up</a>
        </Link>
    </div>
);

export default Buttons;
