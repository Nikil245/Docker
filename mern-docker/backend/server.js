const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// "mongo" = the Docker container name, Docker resolves it automatically
// This is NOT localhost — each container is its own machine in Docker
const MONGO_URL = 'mongodb://mongo:27017/mernapp';

const connectWithRetry = () => {
  console.log('Trying to connect to MongoDB at:', MONGO_URL);
  mongoose.connect(MONGO_URL)
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch((err) => {
      console.log('❌ MongoDB failed, retrying in 5s...', err.message);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// Health check — open localhost:8000/api/health to verify backend is alive
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ Backend running!',
    mongo: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Not connected'
  });
});

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new todo
app.post('/api/todos', async (req, res) => {
  try {
    const todo = await Todo.create({ text: req.body.text });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle done
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { done: req.body.done },
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('🚀 Backend running on port 5000'));
