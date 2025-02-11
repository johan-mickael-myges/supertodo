require('dotenv').config();

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
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

const TodoRepository = require("../../repositories/TodoRepository");
const createTodoUseCaseFactory = require("../../usecases/createTodo");
const getTodosUseCaseFactory = require("../../usecases/getTodos");

const todoRepository = new TodoRepository();
const createTodo = createTodoUseCaseFactory({ todoRepository });
const getTodos = getTodosUseCaseFactory({ todoRepository });

const createdTodoEvents = new EventEmitter();

function createTodoHandler(call, callback) {
    try {
        const { title } = call.request;
        const todo = createTodo({ title });
        callback(null, {
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
        });

        createdTodoEvents.emit("todo-created", todo);
    } catch (err) {
        callback(err);
    }
}

function listTodosHandler(call, callback) {
    try {
        const todos = getTodos();
        const responseTodos = todos.map((todo) => ({
            id: todo.id || null,
            title: todo.title || null,
            completed: todo.completed || false,
        }));
        callback(null, { todos: responseTodos });
    } catch (err) {
        callback(err);
    }
}

function subscribeTodosHandler(call) {
    const listener = (newTodo) => {
        call.write(newTodo);
    };

    createdTodoEvents.on("todo-created", listener);

    call.on("cancelled", () => {
        createdTodoEvents.removeListener("todo-created", listener);
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
    const port = process.env.GRPC_PORT || "50051";
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
