require("dotenv").config();

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const EventEmitter = require("events");

const grpcServerReflection = require("grpc-server-reflection");

const PROTO_PATH = path.join(__dirname, "proto", "todo.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

const TodoRepository = require("@supertodo/database/InMemoryTodoRepository");
const createTodoUseCaseFactory = require("@supertodo/application/usecases/createTodo");
const getTodosUseCaseFactory = require("@supertodo/application/usecases/getTodos");

const todoRepository = new TodoRepository();
const createTodo = createTodoUseCaseFactory({ todoRepository });
const getTodos = getTodosUseCaseFactory({ todoRepository });

const createdTodoEvents = new EventEmitter();

function createTodoHandler(call, callback) {
    try {
        const { title, description, completed, author } = call.request;

        const todo = createTodo({ title, description, completed, author });
        callback(null, {
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            author: todo.author,
        });

        createdTodoEvents.emit("todo-created", todo);
    } catch (err) {
        callback(err);
    }
}

function listTodosHandler(call, callback) {
    try {
        const todos = getTodos();
        const todosArray = todos.map((todo) => ({
            id: todo.id || null,
            title: todo.title || null,
            description: todo.description || null,
            completed: todo.completed || null,
            author: todo.author || null,
        }));

        callback(null, { todos: todosArray });
    } catch (err) {
        callback(err);
    }
}

function subscribeTodosHandler(call) {
    const listener = (newTodo) => {
        try {
            call.write({
                id: newTodo.id || null,
                title: newTodo.title || null,
                description: newTodo.description || null,
                completed: newTodo.completed || null,
                author: newTodo.author || null,
            });
        } catch (error) {
            console.error("Error while writing to stream:", error);
        }
    };

    createdTodoEvents.on("todo-created", listener);

    call.on("error", (err) => {
        console.error("Stream error occurred:", err);
    });

    call.on("cancelled", () => {
        createdTodoEvents.removeListener("todo-created", listener);
        console.log("Stream cancelled by client.");
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(todoProto.TodoService.service, {
        CreateTodo: createTodoHandler,
        ListTodos: listTodosHandler,
        SubscribeTodos: subscribeTodosHandler,
    });

    const descriptorPath = path.join(
        __dirname,
        "proto",
        "todo_descriptor_set.bin"
    );
    grpcServerReflection.addReflection(server, descriptorPath);

    const host = process.env.SERVER_HOST || "0.0.0.0";
    const port = process.env.GRPC_PORT || "9090";

    const bindAddress = `${host}:${port}`;
    server.bindAsync(
        bindAddress,
        grpc.ServerCredentials.createInsecure(),
        (err, boundPort) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`gRPC server is running on ${bindAddress}`);
            server.start();
        }
    );
}

main();
