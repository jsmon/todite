import React, { useState, useRef, useEffect } from 'react';

import Swal from 'sweetalert2';

import TodoObj from '../types/todo';

interface TodoProps {
    todo: TodoObj;
    updateTodoName: (id: string, newName: string) => void;
    updateTodoCompleted: (id: string, completed: boolean) => void;
    deleteTodo: (id: string) => void;
}

const Todo = ({ todo, updateTodoName, updateTodoCompleted, deleteTodo }: TodoProps): React.ReactElement<{
    children: React.ReactNode;
    className: string;
}, 'div'> => {
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

            updateTodoName(todo._id, newTodoName);
        } else {
            todoNameElement.current!.contentEditable = 'true';
            todoNameElement.current!.focus();

            editButton.current!.innerText = 'Save';
        }
    };

    const confirmDeleteTodo = async () => {
        const choice = await Swal.fire({
            showDenyButton: true,
            denyButtonText: 'Yes, delete the todo.',
            denyButtonColor: '#dd6b55',
            confirmButtonText: 'No thanks.',
            confirmButtonColor: '#3085d6',
            icon: 'info',
            title: 'Are you sure you want to delete this todo?',
            text: 'It will be gone forever.'
        });

        if (choice.isDenied) {
            deleteTodo(todo._id);
        }
    };

    useEffect(() => {
        updateTodoCompleted(todo._id, todoCompleted);
    }, [todoCompleted]);

    return (
        <div className="todo px-2 py-1">
            <input type="checkbox" onChange={handleChange} checked={todoCompleted} />
            <span ref={todoNameElement} className={`px-1${todo.completed ? ' line-through' : ''}`}>{ todo.name }</span>
            <button ref={editButton} onClick={editTodo} className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Edit</button>
            <button onClick={confirmDeleteTodo} className="py-1 px-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-500 dark:hover:bg-red-800">X</button>
        </div>
    );
};

export default Todo;
