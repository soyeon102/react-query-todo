import React from 'react';
import NewTodo from './NewTodo';
import Todo from './Todo';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTodos, addTodo } from '../../api/todosApi';
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

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('todos');
      setNewTodo('');
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
