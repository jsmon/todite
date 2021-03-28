import React from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;

    prompt(): Promise<void>;
}

interface Props {
    hideInstallButton: () => void;
    deferredPrompt: BeforeInstallPromptEvent | null;
    setDeferredPrompt: React.Dispatch<React.SetStateAction<BeforeInstallPromptEvent | null>>;
}

const Install = ({ hideInstallButton, deferredPrompt, setDeferredPrompt }: Props): React.ReactElement<{
    className: string;
    children: React.ReactNode;
}, 'div'> => {
    const installPwa = () => {
        hideInstallButton();

        if (!deferredPrompt) return;
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then(() => {
            setDeferredPrompt(null);
        });
    };

    return (
        <div className="install-button p-2">
            <button onClick={installPwa} className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Install</button>
        </div>
    );
};

export default Install;
