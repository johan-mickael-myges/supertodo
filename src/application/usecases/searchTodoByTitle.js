module.exports = function searchTodoByTitle({ todoRepository }) {
    return (title) => {
        return todoRepository.searchTodoByTitle(title);
    };
};
