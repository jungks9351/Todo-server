const express = require('express');
const cors = require('cors');

let { todos } = require('./data/todos');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/todos', (req, res) => {
  res.send(todos);
});

app.get('/todos/:id', (req, res) => {
  res.send(todos.filter(todo => todo.id === +req.params.id));
});

app.post('/todos', (req, res) => {
  const newTodo = req.body;

  if (!Object.keys(newTodo).length) {
    return res.send({
      error: true,
      reason: '페이로드가 없습니다. 새롭게 생성할 할일 데이터를 전달해 주세요.',
    });
  }

  if (todos.map(todo => todo.id).includes(newTodo.id)) {
    return res.send({
      error: true,
      reason: `${newTodo.id}는 이미 존재하는 id입니다.`,
    });
  }

  todos = [newTodo, ...todos];
  res.send(todos);
});

app.patch('/todos/:id', (req, res) => {
  const id = +req.params.id;
  const completed = req.body;
  if (!todos.map(todo => todo.id).includes(id)) {
    return res.send({
      error: true,
      reason: `id가 ${id}인 할일 데이터가 존재하지 않습니다.`,
    });
  }

  todos = todos.map(todo => (todo.id === id ? { ...todo, ...completed } : todo));
  res.send(todos);
});

// 모든 할일의 completed를 일괄 변경
app.patch('/todos', (req, res) => {
  const completed = req.body;

  todos = todos.map(todo => ({ ...todo, ...completed }));
  res.send(todos);
});

// completed가 true인 모든 할일 데이터 삭제
app.delete('/todos/completed', (req, res) => {
  todos = todos.filter(todo => !todo.completed);
  res.send(todos);
});

// 아래 라우터를 DELETE '/todos/completed'보다 앞에 위치시키려면 url을 '/todos/:id([0-9]+)'로 변경한다.
app.delete('/todos/:id', (req, res) => {
  const id = +req.params.id;

  if (!todos.map(todo => todo.id).includes(id)) {
    return res.send({
      error: true,
      reason: `id가 ${id}인 할일 데이터가 존재하지 않습니다.`,
    });
  }

  todos = todos.filter(todo => todo.id !== id);
  res.send(todos);
});

app.listen('7000', () => {
  console.log('Server is listening on http://localhost:7000');
});
