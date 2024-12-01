//src/apollo.js
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { ApolloProvider } from '@vue/apollo-option';
import { createUploadLink } from 'apollo-upload-client'; // Import the upload link

const uploadLink = createUploadLink({
    uri: 'http://localhost:3000/graphql', // Your GraphQL endpoint
    credentials: 'same-origin', // This sends cookies with the request
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
    link: uploadLink, // Use the upload link to handle file uploads
    cache,
});

export const apolloProvider = new ApolloProvider({
    defaultClient: apolloClient,
});

