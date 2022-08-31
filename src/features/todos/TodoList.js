import React from 'react';
import NewTodo from './NewTodo';
import Todo from './Todo';
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
      // console.log('edit data!!!!!', data);
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
        <React.Fragment key={todo.id}>
          <Todo todo={todo} />
        </React.Fragment>
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
      {content}
    </main>
  );
};

export default TodoList;
