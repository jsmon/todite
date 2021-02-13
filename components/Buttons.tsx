import React from 'react';

import Link from 'next/link';

const Buttons = (): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => (
    <div>
        <Link href="/sign-in">
            <a>Sign In</a>
        </Link>

        <Link href="/sign-up">
            <a>Sign Up</a>
        </Link>
    </div>
);

export default Buttons;
