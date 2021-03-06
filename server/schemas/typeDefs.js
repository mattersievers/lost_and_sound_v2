const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Donate {
        session: ID
    }
    
    input EquipmentInput{
        category: String 
        brand: String
        model: String
        description: String
        serialNumber: String
        image: [String]
        location: String
        lost: Boolean
    }

    input EquipmentUpdate{
        _id: String
        category: String 
        brand: String
        model: String
        description: String
        serialNumber: String
        image: [String]
        location: String
        lost: Boolean
    }

    type Equipment {
        _id: ID
        category: String 
        brand: String
        model: String
        description: String
        serialNumber: String
        image: [String]
        location: String
        lost: Boolean
    }

    type User {
        _id: ID
        firstName: String
        lastName: String
        email: String
        hasLost: Boolean
        savedEquipment: [Equipment]
    }

    type Query {
        me: User
        users: [User]
        donate(amount: Int!): Donate
    }

    type Auth {
        token: ID
        user: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(firstName: String!, lastName:String!, email: String!, password: String!): Auth
        saveEquipment(input: EquipmentInput): User
        removeEquipment(_id: ID!): User
        updateEquipment(input: EquipmentUpdate): User
    }
`;    

module.exports = typeDefs;