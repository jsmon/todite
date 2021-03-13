export default interface Contributor {
    name: string;
    github: string;
    contributions: number;
    contributedTo: ['website', 'npm'] | ['npm', 'website'] | ['website'] | ['npm'];
}
