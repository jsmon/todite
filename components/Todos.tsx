import React, { useState, useEffect } from 'react';

import TodoObj from '../types/todo';

import firebase from 'firebase';

import Todo from './Todo';

interface TodosProps {
    user?: firebase.User;
}

const Todos = ({ user }: TodosProps) => {
    const [todos, setTodos] = useState<TodoObj[]>([]);

    useEffect(() => {
        if (!user) return;
        console.log(user.uid);
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

    return (
        <div>
            { todos.map(todo => (
                <Todo key={todo._id} todo={todo} uid={user?.uid} />
            )) }
        </div>
    );
};

export default Todos;
