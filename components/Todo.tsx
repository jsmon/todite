import React, { useState, useEffect } from 'react';

import TodoObj from '../types/todo';

interface TodoProps {
    todo: TodoObj;
    uid?: string;
}

const Todo = ({ todo, uid }: TodoProps) => {
    const [todoCompleted, setTodoCompleted] = useState(todo.completed);
    const handleChange = () => {
        setTodoCompleted(!todoCompleted);
    };

    useEffect(() => {
        fetch(`/api/todo/${todo._id}?firebase_id=${uid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: todoCompleted })
        });
    }, [todoCompleted]);

    return (
        <div>
            <input type="checkbox" onChange={handleChange} checked={todoCompleted} />
            <span>{ todo.name }</span>
        </div>
    );
};

export default Todo;
