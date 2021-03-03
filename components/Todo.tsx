import React, { useState, useRef } from 'react';

import Swal from 'sweetalert2';

import DatePicker from 'react-datepicker';

import TodoObj from '../types/todo';

interface TodoProps {
    todo: TodoObj;
    updateTodoName: (id: string, newName: string) => Promise<void>;
    updateTodoCompleted: (id: string, completed: boolean) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    updateDate: (id: string, date?: Date | undefined) => Promise<void>;
}

const Todo = ({ todo, updateTodoName, updateTodoCompleted, deleteTodo, updateDate }: TodoProps): React.ReactElement<{
    children: React.ReactNode;
    className: string;
}, 'div'> => {
    const [todoCompleted, setTodoCompleted] = useState(todo.completed);
    const [isEditing, setIsEditing] = useState(false);
    const [date, setDate] = useState(todo.date ? new Date(todo.date) : null);
    
    const todoNameElement = useRef<HTMLSpanElement>(null);
    const editButton = useRef<HTMLButtonElement>(null);

    const handleChange = () => {
        setTodoCompleted(prevTodoCompleted => {
            updateTodoCompleted(todo._id, !prevTodoCompleted);
            return !prevTodoCompleted;
        });
    };

    const editTodo = () => {
        if (isEditing) {
            const newTodoName = todoNameElement.current!.innerText;
            todoNameElement.current!.contentEditable = 'false';

            editButton.current!.innerText = 'Edit';

            setIsEditing(false);
 
            updateDate(todo._id, date ? new Date(date) : undefined);
            updateTodoName(todo._id, newTodoName);
        } else {
            todoNameElement.current!.contentEditable = 'true';
            todoNameElement.current!.focus();

            editButton.current!.innerText = 'Save';

            setIsEditing(true);
        }
    };

    const confirmDeleteTodo = async () => {
        const choice = await Swal.fire({
            showDenyButton: true,
            denyButtonText: 'Yes, delete the to-do.',
            denyButtonColor: '#dd6b55',
            confirmButtonText: 'No thanks.',
            confirmButtonColor: '#3085d6',
            icon: 'info',
            title: 'Are you sure you want to delete this to-do?',
            text: 'It will be gone forever.'
        });

        if (choice.isDenied) {
            deleteTodo(todo._id);
        }
    };

    const addDate = () => {
        setDate(new Date());
    };

    const removeDate = () => {
        setDate(null);
    };

    return (
        <div className="todo px-2 py-1">
            <input type="checkbox" onChange={handleChange} checked={todoCompleted} />

            <span
                ref={todoNameElement}
                className={`px-1 ${todo.completed ? 'line-through' : ''} ${(todo.date && !todo.completed) ? ((new Date(todo.date).getTime() - Date.now()) < 3600000 ? 'text-red-600' : ((new Date(todo.date).getTime() - Date.now()) < 86400000 ? 'text-yellow-600' : '')) : ''}`}
                title={`${(todo.date && !todo.completed) ? ((new Date(todo.date).getTime() - Date.now()) < 3600000 ? 'Less than an hour to complete' : ((new Date(todo.date).getTime() - Date.now()) < 86400000 ? 'Less than a day to complete' : '')) : ''}`}
            >{ todo.name }</span>

            { (isEditing && date) ? <DatePicker
                name="todo-date"
                id="todo-date"
                placeholderText="To-do date"
                selected={date}
                onChange={newDate => setDate(new Date(newDate as Date))}
                showTimeSelect
                dateFormat="d/MM/yyyy HH:mm"
                className="mt-1 dark:bg-gray-700"
            /> : null }

            { isEditing && (!date ? <button
                onClick={addDate}
                className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800" 
            >Add Date</button> : <button
                onClick={removeDate}
                className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-500 dark:hover:bg-red-800"
            >Remove Date</button>) }

            <button ref={editButton} onClick={editTodo} className="p-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-800">Edit</button>
            <button onClick={confirmDeleteTodo} className="py-1 px-2 mx-2 font-semibold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-500 dark:hover:bg-red-800">&times;</button>
        </div>
    );
};

export default Todo;
