class Todo {
    constructor({
        id,
        title,
        description,
        completed = false,
        author = "anonymous",
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.author = author;
    }
}

module.exports = Todo;
