import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // Fetch todos from backend (goes through Nginx → Express)
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText('');
  };

  const toggleTodo = async (todo) => {
    const res = await fetch(`/api/todos/${todo._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done }),
    });
    const updated = await res.json();
    setTodos(todos.map(t => t._id === updated._id ? updated : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>MERN Todo App</h1>
      <p style={{ color: '#666' }}>Running inside Docker with Nginx + React + Express + MongoDB</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a todo..."
          style={{ flex: 1, padding: '8px 12px', fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button
          onClick={addTodo}
          style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}
        >
          Add
        </button>
      </div>

      {todos.length === 0 && <p style={{ color: '#999' }}>No todos yet. Add one above!</p>}

      {todos.map(todo => (
        <div key={todo._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#aaa' : '#000' }}>
            {todo.text}
          </span>
          <button
            onClick={() => deleteTodo(todo._id)}
            style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', fontSize: 18 }}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
