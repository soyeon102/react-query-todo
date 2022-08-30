import React from 'react';
import NewTodo from './NewTodo';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  editTodo,
} from '../../api/todosApi';
import { useState } from 'react';

const TodoList = () => {
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: todos,
  } = useQuery('todos', getTodos, {
    select: (data) => data.sort((a, b) => b.id - a.id),
  });

  const [newTodo, setNewTodo] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [clickedId, setClickedId] = useState('');
  const [changeTodo, setChangeTodo] = useState('');

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: (data) => {
      console.log('addTodoMutation 의 성공 data', data);
      queryClient.invalidateQueries('todos');
      setNewTodo('');
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const editTodoMutation = useMutation(editTodo, {
    onSuccess: (data) => {
      setIsEdit(!isEdit);
      console.log('data!!!!!', data);
      queryClient.invalidateQueries('todos');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodoMutation.mutate({
      userId: 'userId',
      title: newTodo,
      completed: false,
    });
  };

  const handleEditTodo = (todo) => {
    setIsEdit(true);
    setClickedId(todo.id);

    console.log('edit!!!', { id: clickedId, title: todo.title });
    editTodoMutation.mutate({ id: clickedId, title: todo.title });
  };

  const handleEditMode = ({ id, title }) => {
    setIsEdit(true);
    setClickedId(id);
    setChangeTodo(title);
  };

  const handleNewTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else {
    content = todos.map((todo) => {
      return (
        <article key={todo.id}>
          <div>
            <input
              type='checkbox'
              checked={todo.completed}
              id={todo.id}
              onChange={() =>
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            />

            {isEdit && clickedId === todo.id ? (
              <input
                value={changeTodo}
                placeholder='수정할 내용을 입력해주세요'
                onChange={(e) => setChangeTodo(e.target.value)}
              />
            ) : (
              <label htmlFor={todo.id}>{todo.title}</label>
            )}
          </div>
          <div>
            {isEdit && clickedId === todo.id ? (
              <button
                onClick={() =>
                  handleEditTodo({ id: todo.id, title: changeTodo })
                }
              >
                제출하기
              </button>
            ) : (
              <button
                onClick={() =>
                  handleEditMode({ id: todo.id, title: todo.title })
                }
              >
                수정
              </button>
            )}

            <button onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>
              삭제
            </button>
          </div>
        </article>
      );
    });
  }

  return (
    <main>
      <h1>Todo List</h1>
      <NewTodo
        handleSubmit={handleSubmit}
        handleNewTodoChange={handleNewTodoChange}
        newTodo={newTodo}
      />
      {/* {newItemSection} */}
      {content}
    </main>
  );
};

export default TodoList;
