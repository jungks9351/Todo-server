
// States
let todos = [];
let navState = 'all';

// Doms
const $nav = document.querySelector('.nav');
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.querySelector('.complete-all');
const $btn = document.querySelector('.btn');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');

// Promise
const request = {
  get(url) {
    return fetch(url)
      .then(res => res.json())
      .then(_todos => todos = _todos)
      .then(render)
      .catch(console.error)
  },

  post(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(_todos => todos = _todos)
      .then(render)
      .catch(console.error)
  },

  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(_todos => todos = _todos)
      .then(render)
      .catch(console.error)
  },

  delete(url) {
    return fetch(url, {method: 'DELETE'})
      .then(res => res.json())
      .then(_todos => todos = _todos)
      .then(render)
      .catch(console.error)
  }
};

// Dom 및 리소스 로딩 이벤트 핸들러
const fetchTodo = () => {
  request.get('/todos');
};

// checked 상태 카운팅 이벤트 핸들러
const itemCheck = () => {
  $completedTodos.textContent = todos.filter(({completed}) => completed).length;
  $activeTodos.textContent = todos.filter(({completed}) => !completed).length;
};

// render 이벤트 핸들러
const render = () => {
  let html = '';

  // navState에 따라 다르게 렌더링하기 위한 반복문
  const _todos = todos.filter(todo => navState === 'completed' ? todo.completed : navState === 'active' ? !todo.completed : true)

  _todos.forEach(({id, content, completed}) => {
    html += `<li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
    <label for="ck-${id}">${content}</label>
    <i class="remove-todo far fa-times-circle"></i>
  </li>`;
  });

  $todos.innerHTML = html;
  itemCheck();
};

// Id 이벤트 핸들러
const generateNextId = () => todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1

// 로딩 이벤트
window.onload = fetchTodo;

// 입력창 이벤트
$inputTodo.onkeyup = e => {
  if (e.key !== 'Enter') return;

  // 입력된 todo의 값을 할당하기 위한 변수
  const newTodo = { id: generateNextId(), content: `${$inputTodo.value}`, completed: false };

  // 입력된 todo의 값을 server에 반영
  request.post('/todos', newTodo);

  // 입력창 초기화
  $inputTodo.value = '';
};


// 개별 체크박스 이벤트
$todos.onchange = e => {
  // 현재 클릭한 체크박스의 id를 획득하기 위한 변수
  const newId = e.target.parentNode.id;
  //현재 클릭한 체크박스의 checked 상태를 server에 반영
  request.patch(`/todos/${newId}`, { completed: e.target.checked });
};

// 전체선택 체크박스 이벤트
$completeAll.onchange = e => {
  request.patch('/todos', { completed: e.target.checked });
};

// 개별 삭제 이벤트
$todos.onclick = e => {
  // 이벤트 타겟이 remove-todo 클래스를 갖지 않는다면 반환
  if (!e.target.matches('.remove-todo')) return;
  // 현재 클릭한 요소의 id를 획득하기 위한 변수
  const newId = e.target.parentNode.id;

  // 해당 id를 갖는 요소를 server에서 삭제
  request.delete(`/todos/${newId}`);
};


// // 전체 삭제 이벤트
$btn.onclick = e => {
  // completed가 true인 모든 요소 server에서 삭제
  request.delete('/todos/completed');
};


$nav.onclick = e => {
  // active 클래스 모두 제거
  document.querySelector('.active').classList.remove('active');

  // 현재 누른 nav item만 active 클래스 추가
  e.target.classList.add('active');

  // nav item 에 따라 navState 값 재할당
  navState = e.target.id;
  render();
};

