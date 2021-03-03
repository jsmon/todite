import React, { useState, useRef, useEffect } from 'react';

import TodoObj from '../types/todo';

import firebase from 'firebase/app';

import removeDuplicateDates from '../utils/remove-duplicate-dates';

import DatePicker from 'react-datepicker';
import Todo from './Todo';

interface TodosProps {
    user?: firebase.User;
    deleteTodoOnCompleted: boolean;
}

const Todos = ({ user, deleteTodoOnCompleted }: TodosProps): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => {
    const [todos, setTodos] = useState<TodoObj[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [newTodoHasDate, setNewTodoHasDate] = useState(true);
    const [newTodoDate, setNewTodoDate] = useState(new Date());
    const [todoDates, setTodoDates] = useState<Date[]>([]);
    const [completedTodoDates, setCompletedTodoDates] = useState<Date[]>([]);

    const newTodoElement = useRef<HTMLInputElement>(null);

    const sortFunc = (a: TodoObj, b: TodoObj) => {
        // Return `-1` to put `a` first, `1` to put `b` first, or `0` if they're the same
        if (!a.completed && b.completed) {
            return -1;
        } else if (a.completed && !b.completed) {
            return 1;
        } else if (a.date && !b.date) {
            return -1;
        } else if (!a.date && b.date) {
            return 1;
        } else if (a.date && b.date) {
            if (a.date < b.date) {
                return -1;
            } else if (a.date > b.date) {
                return 1;
            }
        }
        return 0;
    };

    useEffect(() => {
        if (!user) return;

        (async () => {
            let data: TodoObj[] = await fetch('/api/v1/todos', {
                method: 'GET',
                headers: { Authorization: await user.getIdToken(true) }
            }).then(res => res.json());

            if (!Array.isArray(data) && (data as {
                error?: {
                    status: number;
                    message: string;
                };
            }).error) {
                await fetch('/api/v1/user', {
                    method: 'POST',
                    headers: { Authorization: await user.getIdToken(true) }
                });

                data = await fetch('/api/v1/todos', {
                    method: 'GET',
                    headers: { Authorization: await user.getIdToken(true) }
                }).then(res => res.json());
            }
            data.sort(sortFunc);

            data.forEach(todo => {
                if (todo.completed && todo.date) {
                    setCompletedTodoDates(prevCompletedTodoDates => [...prevCompletedTodoDates, new Date(todo.date!)]);
                } else if (!todo.completed && todo.date) {
                    setTodoDates(prevTodoDates => [...prevTodoDates, new Date(todo.date!)]);
                }
            });

            setTodos(data);
        })();
    }, [user]);

    const updateNewTodo = () => {
        const newTodoText = newTodoElement.current!.value;
        setNewTodo(newTodoText);
    };

    const addNewTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) return;

        let date: Date | undefined;
        if (newTodoHasDate) {
            date = newTodoDate;
        }
        
        setNewTodo('');
        
        const newTodoObj: TodoObj = await fetch('/api/v1/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: await user.getIdToken(true)
            },
            body: JSON.stringify({ name: newTodo, date })
        }).then(res => res.json());

        newTodoObj.date && setTodoDates(prevTodoDates => [...prevTodoDates, new Date(newTodoObj.date!)]);
        setTodos(prevTodos => [...prevTodos, newTodoObj].sort(sortFunc));

    };

    const updateTodoName = async (id: string, newName: string) => {
        if (!user) return;

        setTodos(prevTodos => prevTodos.map(todo => {
            if (todo._id !== id) return todo;
            return { ...todo, name: newName };
        }));

        await fetch(`/api/v1/todo/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: await user.getIdToken(true)
            },
            body: JSON.stringify({ name: newName })
        });
    };

    const deleteTodo = async (id: string) => {
        if (!user) return;

        const todo = todos.find(todo => todo._id === id);
        if (!todo) return;

        if (todo.completed && todo.date) {
            let dateHasBeenDeleted = false;
            setCompletedTodoDates(prevCompletedTodoDates => prevCompletedTodoDates.filter(date => {
                if (dateHasBeenDeleted) return true;

                if (date.getTime() === new Date(todo.date!).getTime()) {
                    dateHasBeenDeleted = true;
                    return false;
                }
                return true;
            }));
        } else if (!todo.completed && todo.date) {
            let dateHasBeenDeleted = false;
            setTodoDates(prevTodoDates => prevTodoDates.filter(date => {
                if (dateHasBeenDeleted) return true;

                if (date.getTime() === new Date(todo.date!).getTime()) {
                    dateHasBeenDeleted = true;
                    return false;
                }
                return true;
            }));
        }

        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));

        await fetch(`/api/v1/todo/${id}`, {
            method: 'DELETE',
            headers: { Authorization: await user.getIdToken(true) }
        });
    };
    
    const updateTodoCompleted = async (id: string, completed: boolean) => {
        if (!user) return;

        const todo = todos.find(todo => todo._id === id);
        if (!todo) return;
        
        if (deleteTodoOnCompleted && completed) {
            deleteTodo(id);
            return;
        }

        if (completed && todo.date) {
            let dateHasBeenDeleted = false;
            setTodoDates(prevTodoDates => prevTodoDates.filter(date => {
                if (dateHasBeenDeleted) return true;

                if (date.getTime() === new Date(todo.date!).getTime()) {
                    dateHasBeenDeleted = true;
                    return false;
                }
                return true;
            }));

            setCompletedTodoDates(prevCompletedTodoDates => [...prevCompletedTodoDates, new Date(todo.date!)]);
        } else if (!completed && todo.date) {
            let dateHasBeenDeleted = false;
            setCompletedTodoDates(prevCompletedTodoDates => prevCompletedTodoDates.filter(date => {
                if (dateHasBeenDeleted) return true;

                if (date.getTime() === new Date(todo.date!).getTime()) {
                    dateHasBeenDeleted = true;
                    return false;
                }
                return true;
            }));

            setTodoDates(prevTodoDates => [...prevTodoDates, new Date(todo.date!)]);
        }

        setTodos(prevTodos => prevTodos.map(todo => todo._id === id ? { ...todo, completed } : todo).sort(sortFunc));
        
        await fetch(`/api/v1/todo/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: await user.getIdToken(true)
            },
            body: JSON.stringify({ completed })
        });
    };

    const updateNewTodoHasDate = () => setNewTodoHasDate(prevNewTodoHasDate => !prevNewTodoHasDate);

    const updateDate = async (id: string, date?: Date | undefined) => {
        const todo = todos.find(todo => todo._id === id);

        if (!todo || !user) return;

        if (todo.completed) {
            if (todo.date) {
                let dateHasBeenDeleted = false;
                setCompletedTodoDates(prevCompletedTodoDates => {
                    const newDates = prevCompletedTodoDates.filter(date => {
                        if (dateHasBeenDeleted) return true;
        
                        if (date.getTime() === new Date(todo.date!).getTime()) {
                            dateHasBeenDeleted = true;
                            return false;
                        }
                        return true;
                    });
                    if (date) newDates.push(date);

                    return newDates;
                });
            } else {
                if (date) setCompletedTodoDates(prevCompletedTodoDates => [...prevCompletedTodoDates, date]);
            }
        } else {
            if (todo.date) {
                let dateHasBeenDeleted = false;
                setTodoDates(prevTodoDates => {
                    const newDates = prevTodoDates.filter(date => {
                        if (dateHasBeenDeleted) return true;
        
                        if (date.getTime() === new Date(todo.date!).getTime()) {
                            dateHasBeenDeleted = true;
                            return false;
                        }
                        return true;
                    });
                    if (date) newDates.push(date);

                    return newDates;
                });
            } else {
                if (date) setTodoDates(prevTodoDates => [...prevTodoDates, date]);
            }
        }
        setTodos(prevTodos => prevTodos.map(todo => todo._id === id ? { ...todo, date } : todo));

        await fetch(`/api/v1/todo/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: await user.getIdToken(true)
            },
            body: JSON.stringify({ date: date ?? {} })
        });
    };

    return (
        <div>
            <form onSubmit={addNewTodo} className="p-2">
                <h2 className="font-bold text-2xl">New to-do</h2>
                <div>
                    <input
                        ref={newTodoElement}
                        type="text"
                        name="new-todo"
                        id="new-todo"
                        placeholder="New to-do"
                        value={newTodo}
                        onChange={updateNewTodo}
                        className="mt-1 dark:bg-gray-700"
                    />
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="todo-has-date"
                        id="todo-has-date"
                        checked={newTodoHasDate}
                        onChange={updateNewTodoHasDate}
                    /> <span onClick={updateNewTodoHasDate}>This to-do has a time it needs to be done by</span>
                </div>
                { newTodoHasDate && <p className="text-gray-700 dark:text-gray-300">To-do date</p> }
                { newTodoHasDate && <DatePicker
                    name="todo-date"
                    id="todo-date"
                    placeholderText="To-do date"
                    selected={newTodoDate}
                    onChange={date => setNewTodoDate(date as Date)}
                    showTimeSelect
                    dateFormat="d/MM/yyyy HH:mm" 
                    className="mt-1 dark:bg-gray-700"
                /> }
                <button type="submit" className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Submit</button>
            </form>
            <div className="todos p-2">
                <h2 className="font-bold text-2xl">To-dos</h2>
                { removeDuplicateDates(todoDates.map(date => new Date(date.getFullYear(), date.getMonth(), date.getDate()))).sort((a, b) => a.getTime() - b.getTime()).map(todoDate => (
                    <div key={todoDate.toISOString()}>
                        <h3 className="font-bold text-lg">{ todoDate.toLocaleDateString('en-GB') }</h3>
                        { todos.map(todo => (
                            (todo.date && !todo.completed) && new Date(new Date(todo.date).getFullYear(), new Date(todo.date).getMonth(), new Date(todo.date).getDate()).getTime() === todoDate.getTime() ? <Todo
                                key={todo._id}
                                todo={todo}
                                updateTodoName={updateTodoName}
                                updateTodoCompleted={updateTodoCompleted}
                                deleteTodo={deleteTodo}
                                updateDate={updateDate}
                            /> : null
                        )) }
                    </div>
                )) }
                { todos.find(todo => !todo.date && !todo.completed) && <h3 className="font-bold text-lg">No date</h3> }
                { todos.find(todo => !todo.date && !todo.completed) && todos.map(todo => (
                    (!todo.date && !todo.completed) && <Todo
                        key={todo._id}
                        todo={todo}
                        updateTodoName={updateTodoName}
                        updateTodoCompleted={updateTodoCompleted}
                        deleteTodo={deleteTodo}
                        updateDate={updateDate}
                    />
                )) }

                <h2 className="font-bold text-2xl">Completed to-dos</h2>
                { removeDuplicateDates(completedTodoDates.map(date => new Date(date.getFullYear(), date.getMonth(), date.getDate()))).sort((a, b) => b.getTime() - a.getTime()).map(todoDate => (
                    <div key={todoDate.toISOString()}>
                        <h3 className="font-bold text-lg">{ todoDate.toLocaleDateString('en-GB') }</h3>
                        { todos.map(todo => (
                            (todo.date && todo.completed) && new Date(new Date(todo.date).getFullYear(), new Date(todo.date).getMonth(), new Date(todo.date).getDate()).getTime() === todoDate.getTime() ? <Todo
                                key={todo._id}
                                todo={todo}
                                updateTodoName={updateTodoName}
                                updateTodoCompleted={updateTodoCompleted}
                                deleteTodo={deleteTodo}
                                updateDate={updateDate}
                            /> : null
                        )) }
                    </div>
                )) }
                { todos.find(todo => !todo.date && todo.completed) && <h3 className="font-bold text-lg">No date</h3> }
                { todos.find(todo => !todo.date && todo.completed) && todos.map(todo => (
                    (!todo.date && todo.completed) && <Todo
                        key={todo._id}
                        todo={todo}
                        updateTodoName={updateTodoName}
                        updateTodoCompleted={updateTodoCompleted}
                        deleteTodo={deleteTodo}
                        updateDate={updateDate}
                    />
                )) }
            </div>
        </div>
    );
};

export default Todos;
