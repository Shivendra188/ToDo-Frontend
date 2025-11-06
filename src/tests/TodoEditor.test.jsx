import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TodoEditor from "../components/TodoEditor/TodoEditor";
import { TodoProvider } from "../contexts/TodoContext";

// ✅ mock window.alert to prevent real popup
beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

afterAll(() => {
  window.alert.mockRestore();
});

test("shows create modal and requires title", async () => {
  const onSaved = jest.fn();

  render(
    <TodoProvider>
      <TodoEditor open={true} todo={null} onClose={() => {}} onSaved={onSaved} />
    </TodoProvider>
  );

  // Ensure modal and Create button are rendered
  const createBtn = screen.getByRole("button", { name: /create/i });
  expect(createBtn).toBeInTheDocument();

  // Click Create with empty title (should trigger alert)
  fireEvent.click(createBtn);

  expect(window.alert).toHaveBeenCalledWith("Title is required");
  expect(onSaved).not.toHaveBeenCalled();

  // ✅ Now fill a title
  const titleInput = screen.getByLabelText(/title/i);
  fireEvent.change(titleInput, { target: { value: "New Task" } });

  // Click again
  fireEvent.click(createBtn);

  // onSaved should be called now
  expect(onSaved).toHaveBeenCalled();
});
