//src/apollo.js
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { ApolloProvider } from '@vue/apollo-option';
import { createUploadLink } from 'apollo-upload-client'; // Import the upload link

const uploadLink = createUploadLink({
    uri: 'https://test-backend-development.onrender.com/graphql', // Your GraphQL endpoint
    credentials: 'include', // This sends cookies with the request
});



const apolloClient = new ApolloClient({
    link: uploadLink, // This is where we set the upload link for file handling
    cache: new InMemoryCache(),
});

export const apolloProvider = new ApolloProvider({
    defaultClient: apolloClient,
});

