import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const SUBQUERY_URL = import.meta.env.VITE_SUBQUERY_URL;

if (!SUBQUERY_URL) {
  console.warn(
    'VITE_SUBQUERY_URL is not defined. Apollo Client will not be initialized.',
  );
}

const httpLink = new HttpLink({
  uri: SUBQUERY_URL,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add custom field policies here if needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
