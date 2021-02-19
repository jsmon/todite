export type Theme = 'dark' | 'light' | 'system';

export default interface Settings {
    theme: Theme;
    deleteTodoOnCompleted: boolean;
    syncSettings: boolean;
} 
