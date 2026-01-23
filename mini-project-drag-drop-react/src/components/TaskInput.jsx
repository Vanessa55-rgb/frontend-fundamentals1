import React, { useState } from 'react';

const TaskInput = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onAddTask(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <section className="task-input-section">
            <div className="glass-card input-group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="¿Qué tienes en mente hoy?"
                    aria-label="Nueva tarea"
                />
                <button onClick={handleSubmit} className="btn-primary">
                    Añadir Tarea
                </button>
            </div>
        </section>
    );
};

export default TaskInput;
