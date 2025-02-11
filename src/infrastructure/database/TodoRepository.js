const Todo = require("@supertodo/domain/entities/Todo");

class TodoRepository {
    constructor() {
        this.todos = [];
        this.currentId = 1;
    }

    create({ title }) {
        const todo = new Todo({
            id: this.currentId++,
            title,
            completed: false,
        });
        this.todos.push(todo);
        return todo;
    }

    getAll() {
        return this.todos;
    }
}

module.exports = TodoRepository;
