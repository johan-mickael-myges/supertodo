"use client";

import { useEffect, useState } from "react";
import { TodoServiceClient } from "../../generated/todo_grpc_web_pb";
import { SubscribeTodoRequest } from "../../generated/todo_pb";

export default function HomePage() {
    const [todos, setTodos] = useState([]);
    const [streamError, setStreamError] = useState(null);

    useEffect(() => {
        let stream = null;
        let reconnectTimeout = null;
        let cancelled = false;

        const startSubscription = () => {
            setStreamError(null);
            console.log("Starting subscription...");

            const request = new SubscribeTodoRequest();

            const client = new TodoServiceClient(
                "http://localhost:8080",
                null,
                null
            );
            console.log("Client instance:", client);

            // Start the streaming RPC.
            stream = client.subscribeTodos(request, {});

            // When data arrives, update the todos state.
            stream.on("data", (response) => {
                const id = response.getId();
                const title = response.getTitle();
                const description = response.getDescription();
                const completed = response.getCompleted();
                const author = response.getAuthor();
                setTodos((prev) => [
                    ...prev,
                    { id, title, description, completed, author },
                ]);
            });

            // Handle stream errors.
            stream.on("error", (err) => {
                console.error("Stream error:", err);
                setStreamError(err);
                // If not cancelled, schedule a reconnection after 1 seconds.
                if (!cancelled) {
                    reconnectTimeout = setTimeout(() => {
                        console.log("Reconnecting subscription after error...");
                        startSubscription();
                    }, 1000);
                }
            });

            // Handle stream end.
            stream.on("end", () => {
                console.log("Stream ended gracefully.");
                if (!cancelled) {
                    reconnectTimeout = setTimeout(() => {
                        console.log(
                            "Reconnecting subscription after stream end..."
                        );
                        startSubscription();
                    }, 1000);
                }
            });
        };

        startSubscription();

        // Cleanup: cancel the stream and clear timeouts when the component unmounts.
        return () => {
            cancelled = true;
            if (stream && stream.cancel) {
                stream.cancel();
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Real-time data subscription with gRPC
                </h1>
                {streamError && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
                        A stream error occurred: {streamError.message}
                    </div>
                )}
                {/* Counter for total todos */}
                <div className="mb-4 text-center">
                    <span className="text-xl font-medium">
                        Total Todos: {todos.length}
                    </span>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Completed
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Author
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {todos.map((todo, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {todo.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {todo.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {todo.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {todo.completed ? "✔️" : "❌"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {todo.author}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
