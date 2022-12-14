import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateTodo, editTodo, deleteTodo } from '../../api/todosApi';
import { useState } from 'react';

const Todo = ({ todo }) => {
  const queryClient = useQueryClient();

  const [isEdit, setIsEdit] = useState(false);
  const [clickedId, setClickedId] = useState('');
  const [changeTodo, setChangeTodo] = useState('');

  const { mutate: updateTodoMutation } = useMutation(updateTodo, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('todos');
    },
  });

  const { mutate: editTodoMutation } = useMutation(editTodo, {
    onSuccess: () => {
      setIsEdit(!isEdit);
      queryClient.invalidateQueries('todos');
    },
  });

  const { mutate: deleteTodoMutation } = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const handleEditTodo = (todo) => {
    setIsEdit(true);
    setClickedId(todo.id);
    editTodoMutation({ id: clickedId, title: todo.title });
  };

  const handleEditMode = ({ id, title }) => {
    setIsEdit(true);
    setClickedId(id);
    setChangeTodo(title);
  };

  return (
    <article key={todo.id}>
      <div>
        <input
          type='checkbox'
          checked={todo.completed}
          id={todo.id}
          onChange={() =>
            updateTodoMutation({
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
            onClick={() => handleEditTodo({ id: todo.id, title: changeTodo })}
          >
            제출하기
          </button>
        ) : (
          <button
            onClick={() => handleEditMode({ id: todo.id, title: todo.title })}
          >
            수정
          </button>
        )}

        <button onClick={() => deleteTodoMutation({ id: todo.id })}>
          삭제
        </button>
      </div>
    </article>
  );
};

export default Todo;
