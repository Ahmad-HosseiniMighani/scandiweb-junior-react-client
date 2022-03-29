import React from "react";
import { Currency } from "../../../contexts";
import {
  //   useQuery,
  CURRENCIES,
  client,
  //   gql,
} from "../../../graphql/queries";
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
    data: {},
    componentIsLoading: true,
    isDropdownCollapsed: true,
  };
  async componentDidMount() {
    try {
      // put your fuhcking API here mate
      this.setState({
        componentIsLoading: false,
        // data,
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
  render() {
    const { componentIsLoading, data, isDropdownCollapsed } = this.state;
    const { toggleDropdownBackDrop } = this.props;
    const { currentCurrency } = this.context;
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
          </div>
        </div>
      </span>
    );
  }
}
MiniCart.contextType = Currency;

export default MiniCart;
