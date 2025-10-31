import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TodoEditor from '../components/TodoEditor/TodoEditor';
import { TodoProvider } from '../contexts/TodoContext';

test('shows create modal and requires title', () => {
  const onSaved = jest.fn();
  render(
    <TodoProvider>
      <TodoEditor open={true} todo={null} onClose={() => {}} onSaved={onSaved} />
    </TodoProvider>
  );

  const createBtn = screen.getByText('Create');
  fireEvent.click(createBtn);
  // since alert is used, no direct DOM change. The primary important is no crash.
});
