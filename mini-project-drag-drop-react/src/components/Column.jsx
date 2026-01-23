import React from 'react';
import Task from './Task';

const Column = ({ title, status, tasks, onDrop, onDragOver, onDeleteTask, onDragStart, onDragEnd }) => {
    return (
        <div
            className="column glass-card"
            id={status}
            onDrop={(e) => onDrop(e, status)}
            onDragOver={onDragOver}
        >
            <div className="column-header">
                <h2>{title}</h2>
                <span className="count">{tasks.length}</span>
            </div>
            <div className="tasks-container">
                {tasks.map(task => (
                    <Task
                        key={task.id}
                        task={task}
                        onDelete={onDeleteTask}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    />
                ))}
            </div>
        </div>
    );
};

export default Column;
