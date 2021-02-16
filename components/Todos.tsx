import React, { useState, useRef, useEffect } from 'react';

import TodoObj from '../types/todo';

import firebase from 'firebase/app';

import Todo from './Todo';

interface TodosProps {
    user?: firebase.User;
}

const Todos = ({ user }: TodosProps): React.ReactElement<{
    children: React.ReactNode;
}, 'div'> => {
    const [todos, setTodos] = useState<TodoObj[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const newTodoElement = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;

        (async () => {
            let data = await fetch(`/api/todos?firebase_id=${user.uid}`).then(res => res.json());
            if (!Array.isArray(data) && data.error) {
                await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firebaseId: user.uid })
                });
                data = [];
            }
            setTodos(data);
        })();
    }, [user]);

    const updateNewTodo = () => {
        const newTodoText = newTodoElement.current!.value;
        setNewTodo(newTodoText);
    };

    const addNewTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newTodoObj: TodoObj = await fetch(`/api/todos?firebase_id=${user!.uid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newTodo })
        }).then(res => res.json());

        setNewTodo('');
        setTodos(prevTodos => [...prevTodos, newTodoObj]);
    };

    const updateTodo = (id: string, newName: string) => {
        setTodos(prevTodos => prevTodos.map(todo => {
            if (todo._id !== id) return todo;
            return { ...todo, name: newName };
        }));

        fetch(`/api/todo/${id}?firebase_id=${user!.uid}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
    };

    const deleteTodo = (id: string) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));

        fetch(`/api/todo/${id}?firebase_id=${user!.uid}`, {
            method: 'DELETE'
        });
    };

    return (
        <div>
            <form onSubmit={addNewTodo}>
                <input ref={newTodoElement} type="text" name="new-todo" id="new-todo" placeholder="New Todo" value={newTodo} onChange={updateNewTodo} />
                <button type="submit">Submit</button>
            </form>
            { todos.map(todo => (
                <Todo key={todo._id} todo={todo} uid={user?.uid} updateTodo={updateTodo} deleteTodo={deleteTodo} />
            )) }
        </div>
    );
};

export default Todos;
