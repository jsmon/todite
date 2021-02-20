import React, { useState, useRef, useEffect } from 'react';

import TodoObj from '../types/todo';

import firebase from 'firebase/app';

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
    const newTodoElement = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;

        (async () => {
            let data: TodoObj[] = await fetch('/api/todos', {
                method: 'GET',
                headers: { Authorization: await user.getIdToken(true) }
            }).then(res => res.json());

            if (!Array.isArray(data) && (data as {
                error?: {
                    status: number;
                    message: string;
                };
            }).error) {
                await fetch('/api/user', {
                    method: 'POST',
                    headers: { Authorization: await user.getIdToken(true) }
                });
                console.log('posted')

                data = await fetch('/api/todos', {
                    method: 'GET',
                    headers: { Authorization: await user.getIdToken(true) }
                }).then(res => res.json());
            }
            data.sort((a, b) => {
                if (!a.completed && b.completed) {
                    return -1;
                } else if (a.completed && !b.completed) {
                    return 1;
                }
                return 0;
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

        const newTodoObj: TodoObj = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: await user.getIdToken(true)
            },
            body: JSON.stringify({ name: newTodo })
        }).then(res => res.json());

        setNewTodo('');
        setTodos(prevTodos => [...prevTodos, newTodoObj].sort((a, b) => {
            if (!a.completed && b.completed) {
                return -1;
            } else if (a.completed && !b.completed) {
                return 1;
            }
            return 0;
        }));
    };

    const updateTodoName = async (id: string, newName: string) => {
        if (!user) return;

        setTodos(prevTodos => prevTodos.map(todo => {
            if (todo._id !== id) return todo;
            return { ...todo, name: newName };
        }));

        fetch(`/api/todo/${id}`, {
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

        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));

        fetch(`/api/todo/${id}`, {
            method: 'DELETE',
            headers: { Authorization: await user.getIdToken(true) }
        });
    };
    
    const updateTodoCompleted = async (id: string, completed: boolean) => {
        if (!user) return;
        
        if (deleteTodoOnCompleted && completed) {
            deleteTodo(id);
            return;
        }

        fetch(`/api/todo/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: await user.getIdToken(true)
            },
            body: JSON.stringify({ completed })
        });

        setTodos(prevTodos => prevTodos.map(todo => todo._id === id ? { ...todo, completed } : todo).sort((a, b) => {
            if (!a.completed && b.completed) {
                return -1;
            } else if (a.completed && !b.completed) {
                return 1;
            }
            return 0;
        }));
    };

    return (
        <div>
            <form onSubmit={addNewTodo} className="p-2">
                <input ref={newTodoElement} type="text" name="new-todo" id="new-todo" placeholder="New To-do" value={newTodo} onChange={updateNewTodo} className="mt-1 dark:bg-gray-700" />
                <button type="submit" className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Submit</button>
            </form>
            <div className="todos">
                { todos.map(todo => (
                    <Todo key={todo._id} todo={todo} updateTodoName={updateTodoName} updateTodoCompleted={updateTodoCompleted} deleteTodo={deleteTodo} />
                )) }
            </div>
        </div>
    );
};

export default Todos;
