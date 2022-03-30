import React from "react";
import { ReactComponent as CartIcon } from "../../../images/cart.svg";
import MiniCartItem from "./MiniCartItem";

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
    componentIsLoading: true,
    isDropdownCollapsed: true,
  };
  async componentDidMount() {
    try {
      const myCart = JSON.parse(localStorage.getItem("myCart"));
      console.log(myCart);
      this.setState({
        componentIsLoading: false,
        myCart,
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
  render() {
    const { componentIsLoading, myCart, isDropdownCollapsed } = this.state;
    // const { toggleDropdownBackDrop } = this.props;
    if (componentIsLoading) return <div>godamn</div>;
    return (
      <span className="mini-cart no-select">
        <div
          className={"dropdown" + (isDropdownCollapsed ? " collapsed" : "")}
          ref={this.dropdownRef}
        >
          <span className="mini-cart-button" onClick={this.handleDropdown}>
            <CartIcon />
          </span>
          <div className="dropdown-content right">
            <div className="header">
              <span>My Bag, </span>
              <span> X Items</span>
            </div>
            <div className="mini-cart-items">
              {myCart.map((cartItem) => (
                <MiniCartItem
                  cartItem={cartItem}
                  key={this.handleCreateKey(cartItem)}
                />
              ))}
            </div>
          </div>
        </div>
      </span>
    );
  }
}

export default MiniCart;
