import React from "react";
import MiniCartItem from "./MiniCartItem";
import { Currency } from "../../../contexts";
import { ReactComponent as CartIcon } from "../../../images/cart.svg";
import { GetSpecificProduct, client } from "../../../graphql/queries";

class MiniCart extends React.Component {
  constructor(props) {
    super(props);
    this.dropdownRef = React.createRef();
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(
      this
    );
  }
  state = {
    myCart: [],
    totalItems: 0,
    totalPrice: 0,
    products: [],
    calledProductsId: [],
    componentIsLoading: true,
    isDropdownCollapsed: true,
  };
  async componentDidMount() {
    const { currentCurrency } = this.context;

    let totalItems = 0;
    let totalPrice = 0;
    try {
      const myCart = JSON.parse(localStorage.getItem("myCart"));
      let products = [];
      let calledProductsId = [];
      for await (const item of myCart) {
        if (calledProductsId.indexOf(item.productId) < 0) {
          const { data } = await client.query({
            query: GetSpecificProduct(item.productId),
          });
          calledProductsId.push(item.productId);
          products.push(data.product);
          totalPrice =
            totalPrice +
            this.getPriceBasedOnCurrentCurrency(data.product.prices);
        }
        totalItems = totalItems + item.amount;
      }
      this.setState({
        componentIsLoading: false,
        myCart,
        products,
        calledProductsId,
        totalItems,
      });
      //   this.setState({ res });
    } catch (error) {
      console.log(error);
      this.setState({ componentIsLoading: false });
    }
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutsideDropdown);
  }
  handleDropdown = () => {
    const { isDropdownCollapsed } = this.state;
    if (isDropdownCollapsed) {
      document.addEventListener("mousedown", this.handleClickOutsideDropdown);
    } else {
      document.removeEventListener(
        "mousedown",
        this.handleClickOutsideDropdown
      );
    }
    this.props.toggleDropdownBackDrop();
    this.setState({ isDropdownCollapsed: !isDropdownCollapsed });
  };
  handleClickOutsideDropdown(event) {
    if (this.dropdownRef && !this.dropdownRef.current.contains(event.target)) {
      document.removeEventListener(
        "mousedown",
        this.handleClickOutsideDropdown
      );
      this.props.toggleDropdownBackDrop();
      this.setState({ isDropdownCollapsed: true });
    }
  }
  handleCreateKey = (cartItem) => {
    let key = cartItem.productId + "";
    for (let i = 0; i < cartItem.attributes.length; i++)
      key = key + "_" + cartItem.attributes[i].value;
    // console.log(key);
    return key;
  };
  getProductInfo = (productId) => {
    const { products } = this.state;
    for (let i = 0; i < products.length; i++)
      if (products[i].id === productId) return products[i];
    return null;
  };
  getPriceBasedOnCurrentCurrency(prices) {
    const { currentCurrency } = this.context;
    for (let i = 0; i < prices.length; i++)
      if (prices[i].currency.label === currentCurrency.label)
        return prices[i].amount;
    return 0;
  }
  render() {
    const { currentCurrency } = this.context;
    const {
      componentIsLoading,
      myCart,
      isDropdownCollapsed,
      totalItems,
      totalPrice,
    } = this.state;
    // const { toggleDropdownBackDrop } = this.props;
    if (componentIsLoading) return <div>godamn</div>;
    console.log(this.props.myCart);
    return (
      <span className="mini-cart">
        <div
          className={"dropdown" + (isDropdownCollapsed ? " collapsed" : "")}
          ref={this.dropdownRef}
        >
          <span
            className="mini-cart-button no-select"
            onClick={this.handleDropdown}
          >
            <CartIcon />
            {this.props.totalItems !== 0 &&
              (totalItems > 0 || this.props.totalItems !== -1) && (
                <span className="badge">
                  {this.props.totalItems !== -1
                    ? this.props.totalItems
                    : totalItems}
                </span>
              )}
          </span>
          <div className="dropdown-content right">
            {this.props.totalItems !== 0 &&
              (totalItems > 0 || this.props.totalItems !== -1) && (
                <React.Fragment>
                  <div className="header">
                    <span>My Bag, </span>
                    <span>
                      {(this.props.totalItems != 0
                        ? this.props.totalItems
                        : totalItems) + " "}
                      Items
                    </span>
                  </div>
                  <div className="mini-cart-items">
                    {this.props.myCart !== null &&
                      this.props.myCart.map((cartItem) => (
                        <MiniCartItem
                          cartItem={cartItem}
                          updateMiniCart={this.props.updateMiniCart}
                          product={this.getProductInfo(cartItem.productId)}
                          key={this.handleCreateKey(cartItem)}
                        />
                      ))}
                    {this.props.myCart == null &&
                      this.state.myCart.map((cartItem) => (
                        <MiniCartItem
                          cartItem={cartItem}
                          updateMiniCart={this.props.updateMiniCart}
                          product={this.getProductInfo(cartItem.productId)}
                          key={this.handleCreateKey(cartItem)}
                        />
                      ))}
                  </div>
                  <div className="total-price">
                    <span className="label">Total</span>
                    <span className="price">
                      {currentCurrency.label}
                      {totalPrice}
                    </span>
                  </div>
                  <div className="control-buttons">
                    <button className="view-bag">VIEW BAG</button>
                    <button className="check-out">CHECK OUT</button>
                  </div>
                </React.Fragment>
              )}
            {!(
              this.props.totalItems !== 0 &&
              (totalItems > 0 || this.props.totalItems !== -1)
            ) && <div>Your Cart is Empty Mother fucker!</div>}
          </div>
        </div>
      </span>
    );
  }
}
MiniCartItem.contextType = Currency;
export default MiniCart;
