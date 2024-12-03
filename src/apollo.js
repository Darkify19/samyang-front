// src/apollo.js
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js'; // Updated import

// Dynamically determine the GraphQL endpoint
const graphqlUri = process.env.NODE_ENV === 'production'
    ? 'https://test-backend-development.onrender.com/graphql'
    : 'http://localhost:3000/graphql';

const uploadLink = createUploadLink({
    uri: graphqlUri,
    credentials: 'include', // Sends cookies with the request
});

const apolloClient = new ApolloClient({
    link: uploadLink,
    cache: new InMemoryCache(),
});

export default apolloClient;
