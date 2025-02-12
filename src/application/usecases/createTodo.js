module.exports = function createTodo({ todoRepository }) {
  console.log("todoRepository", todoRepository);
  return ({ title, description, completed, author }) => {
      return todoRepository.create({ title, description, completed, author });
  };
};