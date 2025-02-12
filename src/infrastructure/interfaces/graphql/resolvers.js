const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const TODO_CREATED = "TODO_CREATED";

module.exports = {
    Query: {
        todos: async (_, __, { getTodos }) => {
            const todos = await getTodos();

            return todos;
        },
        searchTodoByTitle: async (_, { title }, { searchTodoByTitle }) => {
            const todos = await searchTodoByTitle(title);

            return todos;
        },
    },
    Mutation: {
        createTodo: async (_, args, { createTodo }) => {
            const todo = await createTodo(args.input);
            pubsub.publish(TODO_CREATED, { todoCreated: todo });
            return todo;
        },
    },
};
