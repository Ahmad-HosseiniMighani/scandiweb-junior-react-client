import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const CATEGORIES = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;
const CURRENCIES = gql`
  query GetCurrencies {
    currencies {
      label
      symbol
    }
  }
`;
const GetSpecificCategoryProducts = (categoryName) => {
  return gql`
    query GetSpecificCategoryProducts {
      category(input: { title: "${categoryName}" }) {
        products {
          id
          name
          inStock
          gallery
          brand
          prices {
            amount
            currency {
              label
              symbol
            }
          }
        }
      }
    }
  `;
};
const GetSpecificProduct = (productId) => {
  return gql`
    query GetSpecificProduct {
      product(id: "${productId}") {
        id
        name
        inStock
        gallery
        description
        category
        brand
        prices {
          amount
          currency {
            label
            symbol
          }
        }
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
      }
    }
  `;
};
export {
  useQuery,
  gql,
  ApolloProvider,
  client,
  CATEGORIES,
  CURRENCIES,
  GetSpecificCategoryProducts,
  GetSpecificProduct,
};
