import React from 'react';
import { useState } from 'react';

const NewTodo = ({ handleSubmit, handleNewTodoChange, newTodo }) => {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor=''>Enter a new todo item</label>
      <div>
        <input
          type='text'
          value={newTodo}
          id='new-todo'
          onChange={handleNewTodoChange}
        />
      </div>
      <button>추가</button>
    </form>
  );
};

export default NewTodo;
