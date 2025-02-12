"use client";

import { useState } from "react";
import { TodoServiceClient } from "../../generated/todo_grpc_web_pb";
import { CreateTodoRequest } from "../../generated/todo_pb";

export default function CreateTodoPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [author, setAuthor] = useState("anonymous");
    const [result, setResult] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Instantiate the gRPC-Web client pointing to your proxy URL.
        const client = new TodoServiceClient(
            "http://localhost:8080",
            null,
            null
        );

        // Create a new CreateTodoRequest and set the fields.
        const request = new CreateTodoRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setCompleted(completed);
        request.setAuthor(author);

        // Call the unary RPC method 'createTodo'.
        client.createTodo(request, {}, (err, response) => {
            if (err) {
                console.error("Error:", err);
                setResult("Error: " + err.message);
            } else {
                console.log("Response:", response.toObject());
                setResult(
                    `Todo created with ID: ${response.getId()} and title: ${response.getTitle()}`
                );
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Create a New Todo
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            id="completed"
                            type="checkbox"
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="completed"
                            className="ml-2 block text-sm text-gray-700"
                        >
                            Completed
                        </label>
                    </div>
                    <div>
                        <label
                            htmlFor="author"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Author
                        </label>
                        <input
                            id="author"
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Create Todo
                    </button>
                </form>
                {result && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded text-center">
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
}
