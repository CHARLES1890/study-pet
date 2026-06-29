import { useState } from 'react';
import type { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (todos: Todo[]) => void;
}

export default function TodoList({ todos, onUpdate }: TodoListProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const addTodo = () => {
    if (!title.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      deadline: deadline || today,
      completed: false,
      createdAt: today,
    };
    onUpdate([...todos, newTodo]);
    setTitle('');
    setDeadline('');
  };

  const toggleTodo = (id: string) => {
    onUpdate(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: string) => {
    onUpdate(todos.filter((t) => t.id !== id));
  };

  const sortedTodos = [...todos].sort(
    (a, b) => Number(a.completed) - Number(b.completed) || a.deadline.localeCompare(b.deadline)
  );

  return (
    <div>
      <h3>学习待办</h3>
      <div className="todo-form">
        <input
          type="text"
          placeholder="添加待办..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button className="primary" onClick={addTodo}>添加</button>
      </div>
      <div>
        {sortedTodos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            <span style={{ flex: 1 }}>{todo.title}</span>
            <small style={{ color: '#999' }}>{todo.deadline}</small>
            <button className="danger" onClick={() => deleteTodo(todo.id)}>删除</button>
          </div>
        ))}
        {todos.length === 0 && <p className="hint">暂无待办，添加一个学习目标吧~</p>}
      </div>
    </div>
  );
}
