//XMLHttpRequest 객체

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

const fetchTodo = () => {
   // xhr 객체 생성
   const xhr = new XMLHttpRequest ();
   // 서버에 전송할 HTTP 요청을 초기화
   xhr.open('GET', '/todos');
   // HTTP 요청을 전송
   xhr.send();
   // xhr 객체의 readyState 가 Done이 됨 -> 응답이 정상적으로 처리되었음.
   // xhr onload 프로퍼티에 함수를 할당 
   xhr.onload = () => {

      if (xhr.status === 200) {
         const res = JSON.parse(xhr.response);
         todos = res;
         render();
      }
      else {
         console.error(xhr.status);
      }
   }
}
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
   if (e.key !== "Enter") return;

   const newTodo = { id: generateNextId(), content: `${$inputTodo.value}`, completed: false };
   //xhr 객체 생성
   const xhr = new XMLHttpRequest();
   //xhr HTTP 초기화
   xhr.open('POST', '/todos');

   // HTTP 요청 헤더 설정
   // 클라이언트가 서버로 전송할 데이터의 MIME 타입 지정: json
   xhr.setRequestHeader('content-type', 'application/json');
   
   //xhr 보내
   xhr.send(JSON.stringify(newTodo));
   //응답해보자 프로퍼티에 할당하자
   xhr.onload = () => {
      if (xhr.status ===200) {
         console.log(xhr.response);
         const res = JSON.parse(xhr.response);
         todos = res;
         render();
      }
      else {
         console.error(xhr.status);
         }
      }
   }


//개별 체크박스 이벤트

$todos.onchange = e => {

const newId = e.target.parentNode.id;

const xhr = new XMLHttpRequest();

xhr.open('PATCH', `/todos/${newId}`)

xhr.setRequestHeader('content-type', 'application/json');

xhr.send(JSON.stringify({completed: e.target.checked}));

xhr.onload = () => {
   
   if (xhr.status === 200) {

      const res = JSON.parse(xhr.response);

      todos = res;

      render();
   }
   else {
       console.error(xhr.status);
   }
}
}

// 전체선택 체크박스 이벤트

$completeAll.onclick = e => {
   // 객체를 생성
   const xhr = new XMLHttpRequest();
   
   // 초기화
   xhr.open('PATCH','/todos');

   // 페이로드 있으면 걍 써
   xhr.setRequestHeader('content-type', 'application/json');

   // 직렬화 해서 객체를 전송해 페이로드가 있을겨우만 인자가 필요하다.
   xhr.send(JSON.stringify({completed: e.target.checked}));
   // 응답 완료
   xhr.onload = () => {
      //정상적인 응답
      if (xhr.status === 200) {
      //받은 응답을 역직렬화
      const res = JSON.parse(xhr.response);
      // 객체를 갱신 한다.
      todos = res;
      // 갱신된 값을 할당
      render();
      }
      //비정상적인 응답
      else {
         console.error(xhr.status);
      }
   }
}

// 개별 삭제 이벤트

$todos.onclick = e => {
   // .remove-todo 를 갖지 않으면 반환
   if (!e.target.matches('.remove-todo')) return;
   // id를 통해 삭제하기 위해 id 변수 생성
   const id = e.target.parentNode.id;
   // xhr 객체 생성
   const xhr =  new XMLHttpRequest();
   // 초기화
   xhr.open('DELETE', `/todos/${id}`)
   // 요청 전송
   xhr.send()
   // 응답
   xhr.onload = () => {
      if (xhr.status === 200) {
         //반응 역직렬화
         const res = JSON.parse(xhr.response);
         //갱신
         todos = res;
         //갱신된 값 할당
         render();
      }
      else {
         console.error(xhr.status);
      }
   }
}

// completed 가 ture인 전체 요소 삭제 이벤트
$btn.onclick = e => {

   const xhr = new XMLHttpRequest();

   xhr.open('DELETE', '/todos/completed')

   xhr.send();

   xhr.onload = () => {
      if (xhr.status === 200) {
         console.log(xhr.response);
         console.log(todos);
         const res = JSON.parse(xhr.response);
         
         todos = res;
         
         render();
      }
      else {
         console.error(xhr.status);
      }
   }
}

$nav.onclick = e => {
  // active 클래스 모두 제거
  document.querySelector('.active').classList.remove('active');

  // 현재 누른 nav item만 active 클래스 추가
  e.target.classList.add('active');

  // nav item 에 따라 navState 값 재할당
  navState = e.target.id;
  render();
};
