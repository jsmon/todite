/** Something to do */
export default interface Todo {
    /** The todos `id` */
    _id: string;
    /** What to do */
    name: string;
    /** Whether it has been done */
    completed: boolean;
    /** When the todo needs to be done by */
    date?: Date;
}
