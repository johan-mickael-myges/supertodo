module.exports = function getTodos({ todoRepository }) {
  return () => {
    return todoRepository.getAll();
  };
};