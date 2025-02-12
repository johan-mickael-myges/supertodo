const { gql } = require("apollo-server");

const typeDefs = gql`
    type Todo {
        id: Int!
        title: String!
        description: String
        completed: Boolean!
        author: String!
    }

    type Query {
        todos: [Todo!]!
        searchTodoByTitle(title: String!): [Todo!]!
    }

    input CreateTodoInput {
        title: String!
        description: String
        completed: Boolean
        author: String
    }

    type Mutation {
        createTodo(input: CreateTodoInput!): Todo!
    }
`;

module.exports = typeDefs;
