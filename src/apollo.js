import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { ApolloProvider } from '@vue/apollo-option';

const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql',
    credentials: 'same-origin', // This sends cookies with the request
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
    link: httpLink,
    cache, // Reusing the cache instance here
});

export const apolloProvider = new ApolloProvider({
    defaultClient: apolloClient,
});
