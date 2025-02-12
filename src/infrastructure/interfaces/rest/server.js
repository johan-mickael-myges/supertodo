require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const TodoRepository = require("@supertodo/database/InMemoryTodoRepository");
const createTodoUseCase = require("@supertodo/application/usecases/createTodo");
const listTodosUseCase = require("@supertodo/application/usecases/getTodos");
const searchTodoByTitleUseCase = require("@supertodo/application/usecases/searchTodoByTitle");

const todoRepository = new TodoRepository();
const createTodo = createTodoUseCase({ todoRepository });
const getTodos = listTodosUseCase({ todoRepository });
const searchTodoByTitle = searchTodoByTitleUseCase({ todoRepository });

const app = express();
const port = process.env.REST_PORT || 3001;

app.use(bodyParser.json());

app.get("/todos", (req, res) => {
    try {
        const todos = getTodos();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/todos/search", (req, res) => {
    try {
        const seachTitleQuery = req.query.title || "";
        const todos = searchTodoByTitle(seachTitleQuery);
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/todos", (req, res) => {
    try {
        const { title, description, completed, author } = req.body;
        const todo = createTodo({ title, description, completed, author });
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`REST API server listening on port ${port}`);
});
