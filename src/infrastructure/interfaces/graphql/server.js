const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const createTodoUseCase = require("@supertodo/application/usecases/createTodo");
const getTodosUseCase = require("@supertodo/application/usecases/getTodos");

// Import your repository implementation from the database workspace.
const TodoRepository = require("@supertodo/database/InMemoryTodoRepository");

// Instantiate your dependencies.
const todoRepository = new TodoRepository();
const createTodo = createTodoUseCase({ todoRepository });
const getTodos = getTodosUseCase({ todoRepository });

// Create and start the Apollo Server.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
        createTodo,
        getTodos,
    }),
});

server.listen().then(({ url }) => {
    console.log(`GraphQL server ready at ${url}`);
});
