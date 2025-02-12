const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const TODO_CREATED = "TODO_CREATED";

module.exports = {
    Query: {
        todos: async (_, __, { getTodos }) => {
            const todos = await getTodos();

            return todos;
        },
    },
    Mutation: {
        createTodo: async (_, args, { createTodo }) => {
            const todo = await createTodo(args);
            // Publish the newly created todo so that subscriptions get notified
            pubsub.publish(TODO_CREATED, { todoCreated: todo });
            return todo;
        },
    },
    Subscription: {
        todoCreated: {
            subscribe: () => pubsub.asyncIterator([TODO_CREATED]),
        },
    },
};
