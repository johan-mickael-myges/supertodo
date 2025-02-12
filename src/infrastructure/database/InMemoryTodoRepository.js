const Todo = require("@supertodo/domain/entities/Todo");

class TodoRepository {
    constructor() {
        this.todos = [];
        this.currentId = 1;
    }

    create({ title, description, completed, author }) {
        const todo = new Todo({
            id: this.currentId++,
            title: title || "Untitled",
            description: description || "",
            completed: completed || false,
            author: author || "anonymous",
        });
        this.todos.push(todo);
        return todo;
    }

    getAll() {
        return this.todos;
    }
}

module.exports = TodoRepository;
