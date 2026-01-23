import React from 'react';

const Task = ({ task, onDelete, onDragStart, onDragEnd }) => {
    return (
        <div
            className="task"
            draggable="true"
            onDragStart={(e) => onDragStart(e, task.id)}
            onDragEnd={onDragEnd}
        >
            <span className="task-text">{task.text}</span>
            <button
                className="delete-btn"
                onClick={() => onDelete(task.id)}
                aria-label="Eliminar tarea"
            >
                ×
            </button>
        </div>
    );
};

export default Task;
