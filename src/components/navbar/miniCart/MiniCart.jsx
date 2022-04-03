import React from "react";
import MiniCartItem from "./MiniCartItem";
import { Link } from "react-router-dom";
import { Currency } from "../../../contexts";
import { ReactComponent as CartIcon } from "../../../images/cart.svg";

class MiniCart extends React.Component {
  constructor(props) {
    super(props);
    this.dropdownRef = React.createRef();
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(
      this
    );
  }
  state = {
    componentIsLoading: true,
    isDropdownCollapsed: true,
  };
  componentDidMount() {
    this.setState({
      componentIsLoading: false,
    });
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
  handleCloseDropdown = () => {
    document.removeEventListener("mousedown", this.handleClickOutsideDropdown);
    this.props.toggleDropdownBackDrop();
    this.setState({ isDropdownCollapsed: true });
  };
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
    const { componentIsLoading, isDropdownCollapsed } = this.state;
    const { myCart, totalItems, totalPrice } = this.props;
    if (componentIsLoading) return <div></div>;
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
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </span>
          <div className="dropdown-content right">
            {totalItems > 0 && (
              <React.Fragment>
                <div className="header">
                  <span>My Bag, </span>
                  <span>{totalItems} Items</span>
                </div>
                <div className="mini-cart-items">
                  {myCart.map((cartItem) => (
                    <MiniCartItem
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
                <div className="control-buttons">
                  <Link
                    to="/cart"
                    className="view-bag"
                    onClick={this.handleDropdown}
                  >
                    VIEW BAG
                  </Link>
                  <button
                    className="check-out"
                    onClick={() => alert("wheeee!")}
                  >
                    CHECK OUT
                  </button>
                </div>
              </React.Fragment>
            )}
            {totalItems <= 0 && (
              <div className="empty-cart">Your Cart is Empty!</div>
            )}
          </div>
        </div>
      </span>
    );
  }
}
MiniCart.contextType = Currency;
export default MiniCart;
