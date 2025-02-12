const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const createTodoUseCase = require("@supertodo/application/usecases/createTodo");
const getTodosUseCase = require("@supertodo/application/usecases/getTodos");

const TodoRepository = require("@supertodo/database/InMemoryTodoRepository");

const todoRepository = new TodoRepository();
const createTodo = createTodoUseCase({ todoRepository });
const getTodos = getTodosUseCase({ todoRepository });

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
