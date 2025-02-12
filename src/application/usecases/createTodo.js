module.exports = function createTodo({ todoRepository }) {
  return ({ title, description, completed, author }) => {
      return todoRepository.create({ title, description, completed, author });
  };
};