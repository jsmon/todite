import React, { useState, useRef, useEffect } from 'react';

import TodoObj from '../types/todo';

interface TodoProps {
    todo: TodoObj;
    uid?: string;
    updateTodo: (id: string, newName: string) => void;
    deleteTodo: (id: string) => void;
}

const Todo = ({ todo, uid, updateTodo, deleteTodo }: TodoProps) => {
    const [todoCompleted, setTodoCompleted] = useState(todo.completed);
    const todoNameElement = useRef<HTMLSpanElement>(null);
    const editButton = useRef<HTMLButtonElement>(null);

    const handleChange = () => {
        setTodoCompleted(!todoCompleted);
    };

    const editTodo = () => {
        if (todoNameElement.current!.contentEditable === 'true') {
            const newTodoName = todoNameElement.current!.innerText;
            todoNameElement.current!.contentEditable = 'false';

            editButton.current!.innerText = 'Edit';

            updateTodo(todo._id, newTodoName);
        } else {
            todoNameElement.current!.contentEditable = 'true';
            todoNameElement.current!.focus();

            editButton.current!.innerText = 'Save';
        }
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
            <span ref={todoNameElement}>{ todo.name }</span>
            <button ref={editButton} onClick={editTodo}>Edit</button>
            <button onClick={() => deleteTodo(todo._id)}>X</button>
        </div>
    );
};

export default Todo;
