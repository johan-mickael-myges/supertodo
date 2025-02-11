module.exports = function createTodo({ todoRepository }) {
  return ({ title }) => {
    if (!title) {
      throw new Error("Le titre est obligatoire");
    }
    return todoRepository.create({ title });
  };
};