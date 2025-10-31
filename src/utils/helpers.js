export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const due = new Date(dueDate).setHours(23, 59, 59, 999);
  return Date.now() > due;
};

export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString();
};
