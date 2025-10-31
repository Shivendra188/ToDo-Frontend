import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../components/TodoList/TodoList';

const sample = [
  { id: '1', title: 'A', description: '', createdAt: Date.now(), priority: 'low', tags: [], subtasks: [], completed: false },
  { id: '2', title: 'B', description: '', createdAt: Date.now(), priority: 'high', tags: [], subtasks: [], completed: true }
];

test('renders todos', () => {
  render(<TodoList todos={sample} onEdit={() => {}} selected={[]} setSelected={() => {}} />);
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.getByText('B')).toBeInTheDocument();
});
