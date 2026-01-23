import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import Column from './components/Column';
import './index.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: `task-${Date.now()}`,
      text: text,
      status: 'todo'
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    setDraggedTaskId(null);
    e.target.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(tasks.map(task =>
        task.id === draggedTaskId ? { ...task, status: status } : task
      ));
    }
  };

  return (
    <>
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <header>
        <div className="container">
          <h1 className="logo">Task<span>Flow</span></h1>
          <p className="subtitle">Organiza tus ideas con estilo</p>
        </div>
      </header>

      <main className="container">
        <TaskInput onAddTask={addTask} />

        <section className="board" id="board">
          <div className="column-wrapper">
            <Column
              title="Pendientes"
              status="todo"
              tasks={tasks.filter(t => t.status === 'todo')}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDeleteTask={deleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>

          <div className="column-wrapper">
            <Column
              title="En Proceso"
              status="in-progress"
              tasks={tasks.filter(t => t.status === 'in-progress')}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDeleteTask={deleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>

          <div className="column-wrapper">
            <Column
              title="Terminado"
              status="done"
              tasks={tasks.filter(t => t.status === 'done')}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDeleteTask={deleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 TaskFlow. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default App;
