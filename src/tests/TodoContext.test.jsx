import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { TodoProvider, useTodos } from '../contexts/TodoContext';
import { render } from '@testing-library/react';

function wrapper({ children }) {
  return <TodoProvider>{children}</TodoProvider>;
}

test('adds, toggles and deletes a todo', () => {
  const { result } = renderHook(() => useTodos(), { wrapper });

  act(() => {
    const todo = result.current.addTodo({ title: 'Test', description: 'desc' });
    expect(result.current.todos.find((t) => t.id === todo.id)).toBeTruthy();
  });

  let id = result.current.todos[0].id;

  act(() => {
    result.current.toggleComplete(id);
  });

  expect(result.current.todos.find((t) => t.id === id).completed).toBe(true);

  act(() => {
    result.current.deleteTodo(id);
  });

  expect(result.current.todos.find((t) => t.id === id)).toBeUndefined();
});
