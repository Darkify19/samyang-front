// src/apollo.js
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js'; // Updated import

// Endpoint comes from the environment so a redeploy is configuration rather than
// a code change. Falls back to the local API for development. See .env.example.
const graphqlUri = process.env.VUE_APP_GRAPHQL_URI || 'http://localhost:3000/graphql';

const uploadLink = createUploadLink({
    uri: graphqlUri,
    credentials: 'include', // Sends cookies with the request
});

const apolloClient = new ApolloClient({
    link: uploadLink,
    cache: new InMemoryCache(),
});

export default apolloClient;
