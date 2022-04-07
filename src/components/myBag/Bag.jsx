import React from "react";
import { Currency } from "../../contexts";
import BagItem from "./BagItem";

class Bag extends React.Component {
  state = {
    componentIsLoading: true,
  };
  componentDidMount() {
    this.setState({
      componentIsLoading: false,
    });
  }
  handleCreateKey = (cartItem) => {
    let key = cartItem.productId + "";
    for (let i = 0; i < cartItem.attributes.length; i++)
      key = key + "_" + cartItem.attributes[i].value;
    return key;
  };
  getProductInfo = (productId) => {
    const { products } = this.props;
    for (let i = 0; i < products.length; i++)
      if (products[i].id === productId) return products[i];
    return null;
  };
  render() {
    const { currentCurrency } = this.context;
    const { componentIsLoading } = this.state;
    const { myCart, totalItems, totalPrice } = this.props;
    if (componentIsLoading) return <div>s</div>;
    return (
      <main>
        <div className="cart">
          {totalItems > 0 && (
            <React.Fragment>
              <div className="header">
                <span>CART, </span>
                <span>{totalItems} Items</span>
              </div>
              <div className="cart-items">
                {myCart.map((cartItem) => (
                  <BagItem
                    cartItem={cartItem}
                    updateCart={this.props.updateCart}
                    product={this.getProductInfo(cartItem.productId)}
                    key={this.handleCreateKey(cartItem)}
                  />
                ))}
              </div>
              <div className="total-price">
                <span className="label">Total</span>
                <span className="price">
                  {currentCurrency.symbol}
                  {totalPrice.toFixed(2)}
                </span>
              </div>
            </React.Fragment>
          )}
          {totalItems <= 0 && (
            <div className="empty-cart">Your Cart is Empty!</div>
          )}
        </div>
      </main>
    );
  }
}
Bag.contextType = Currency;

export default Bag;
