import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { ApolloProvider } from '@vue/apollo-option';

const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql', // Ensure this points to your backend GraphQL endpoint
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
});

export const apolloProvider = new ApolloProvider({
    defaultClient: apolloClient,
});
