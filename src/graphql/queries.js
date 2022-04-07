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
    }
  `;
};
const GetSpecificProducts = (productsId) => {
  let query = "query GetSpecificProduct {";
  for (let i = 0; i < productsId.length; i++) {
    query =
      query +
      `product_${i} : product(id: "${productsId[i]}") {
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
    `;
  }
  return gql(query + "}");
};
export {
  useQuery,
  gql,
  ApolloProvider,
  client,
  CATEGORIES,
  CURRENCIES,
  GetSpecificCategoryProducts,
  GetSpecificProducts,
};
