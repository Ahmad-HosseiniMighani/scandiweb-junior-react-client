import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Products from "./components/products/Products";
import Product from "./components/singleProduct/Product";
import Bag from "./components/myBag/Bag";
import { Currency } from "./contexts";
import { GetSpecificProduct, client } from "./graphql/queries";

class App extends React.Component {
  state = {
    componentIsLoading: true,
    currentCurrency: {
      label: "USD",
      symbol: "$",
    },
    setCurrency: () => {},
    myCart: [],
    products: [],
    calledProductsId: [],
    totalItems: 0,
  };
  async componentDidMount() {
    // get the context from local stroage or initialize it
    const currentCurrency =
      JSON.parse(localStorage.getItem("selectedCurrency")) === null
        ? { label: "USD", symbol: "$" } // lets say default value is USD
        : JSON.parse(localStorage.getItem("selectedCurrency"));
    // end
    let totalItems = 0;
    try {
      let myCart = JSON.parse(localStorage.getItem("myCart"));
      let products = [];
      let calledProductsId = [];
      if (myCart === null) {
        myCart = [];
      } else {
        for await (const item of myCart) {
          if (calledProductsId.indexOf(item.productId) < 0) {
            const { data } = await client.query({
              query: GetSpecificProduct(item.productId),
            });
            calledProductsId.push(item.productId);
            products.push(data.product);
          }
          totalItems = totalItems + item.amount;
        }
      }
      this.setState({
        componentIsLoading: false,
        myCart,
        products,
        calledProductsId,
        totalItems,
        totalPrice: this.getCartItemsTotalPrice(
          myCart,
          products,
          currentCurrency
        ),
        currentCurrency,
        setCurrency: (newCurrency) => {
          localStorage.setItem("selectedCurrency", JSON.stringify(newCurrency));
          this.setState({
            currentCurrency: newCurrency,
          });
        },
      });
      //   this.setState({ res });
    } catch (error) {
      console.log(error);
      this.setState({ componentIsLoading: false });
    }
  }
  getPriceBasedOnCurrentCurrency(prices, currentCurrency) {
    for (let i = 0; i < prices.length; i++) {
      if (prices[i].currency.label === currentCurrency.label)
        return prices[i].amount;
    }
    return 0;
  }
  updateCart = async (myCart) => {
    const { products, currentCurrency, calledProductsId } = this.state;
    let totalItems = 0;
    try {
      if (myCart === null) {
        myCart = [];
      } else {
        for await (const item of myCart) {
          if (calledProductsId.indexOf(item.productId) < 0) {
            const { data } = await client.query({
              query: GetSpecificProduct(item.productId),
            });
            calledProductsId.push(item.productId);
            products.push(data.product);
          }
          totalItems = totalItems + item.amount;
        }
      }
      this.setState({
        myCart,
        products,
        calledProductsId,
        totalItems,
        totalPrice: this.getCartItemsTotalPrice(
          myCart,
          products,
          currentCurrency
        ),
      });
      //   this.setState({ res });
    } catch (error) {
      console.log(error);
    }
  };
  getCartItemsTotalPrice(myCart, products, currentCurrency) {
    let totalPrice = 0;
    for (let i = 0; i < myCart.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (myCart[i].productId === products[j].id) {
          // we fount the product we looking for.
          totalPrice =
            totalPrice +
            myCart[i].amount *
              this.getPriceBasedOnCurrentCurrency(
                products[j].prices,
                currentCurrency
              );
        }
      }
    }
    return totalPrice;
  }
  render() {
    const {
      componentIsLoading,
      myCart,
      products,
      totalItems,
      currentCurrency,
      setCurrency,
    } = this.state;
    if (componentIsLoading) return <div></div>;
    return (
      // <React.Fragment>
      <Currency.Provider
        value={{
          currentCurrency: currentCurrency,
          setCurrency: setCurrency,
        }}
      >
        <Navbar
          myCart={myCart}
          products={products}
          totalItems={totalItems}
          totalPrice={this.getCartItemsTotalPrice(
            myCart,
            products,
            currentCurrency
          )}
          updateCart={this.updateCart}
        />
        <Routes>
          {/* 
              Replacing might not be ideal here, but we have no homepage and i dont know if we're going to have or not, so for now i redirect it to category page (all) 
              Also, i assuming that category "all" will be there (always) so with these ideas we can do:
              */}
          <Route path="/" element={<Navigate to="category/all" replace />} />
          <Route
            path="/cart"
            element={
              <Bag
                myCart={myCart}
                products={products}
                totalItems={totalItems}
                totalPrice={this.getCartItemsTotalPrice(
                  myCart,
                  products,
                  currentCurrency
                )}
                updateCart={this.updateCart}
              />
            }
          />
          <Route
            path="/category"
            element={<Products updateCart={this.updateCart} />}
          >
            <Route
              path=":categoryName"
              element={<Products updateCart={this.updateCart} />}
            />
            <Route index element={<Navigate to="*" replace />} />
          </Route>
          <Route
            path="/product"
            element={<Product updateCart={this.updateCart} />}
          >
            <Route
              path=":productId"
              element={<Product updateCart={this.updateCart} />}
            />
            <Route index element={<Navigate to="*" replace />} />
          </Route>
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!...sorry i have to say... BITCH!</p>
              </main>
            }
          />
        </Routes>
        {/* </React.Fragment> */}
      </Currency.Provider>
    );
  }
}

export default App;
