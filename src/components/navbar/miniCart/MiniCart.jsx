import React from "react";
import MiniCartItem from "./MiniCartItem";
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
    products: [],
    componentIsLoading: true,
    isDropdownCollapsed: true,
  };
  async componentDidMount() {
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
        }
      }
      console.log("yeeeeeeeeeeeet");
      this.setState({
        componentIsLoading: false,
        myCart,
        products,
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
    console.log(products);
    for (let i = 0; i < products.length; i++)
      if (products[i].id === productId) return products[i];
    return {};
  };
  render() {
    const { componentIsLoading, myCart, isDropdownCollapsed } = this.state;
    // const { toggleDropdownBackDrop } = this.props;
    if (componentIsLoading) return <div>godamn</div>;
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
                  product={this.getProductInfo(cartItem.productId)}
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
