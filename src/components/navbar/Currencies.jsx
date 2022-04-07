import React from "react";
import { Currency } from "./../../contexts";
import { CURRENCIES, client } from "../../graphql/queries";

class Currencies extends React.Component {
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
      const { data } = await client.query({
        query: CURRENCIES,
      });
      this.setState({
        componentIsLoading: false,
        data,
      });
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
    this.setState({ isDropdownCollapsed: !isDropdownCollapsed });
  };
  handleClickOutsideDropdown(event) {
    if (this.dropdownRef && !this.dropdownRef.current.contains(event.target)) {
      document.removeEventListener(
        "mousedown",
        this.handleClickOutsideDropdown
      );
      this.setState({ isDropdownCollapsed: true });
    }
  }
  render() {
    const { componentIsLoading, data, isDropdownCollapsed } = this.state;
    const { currentCurrency, setCurrency } = this.context;
    if (componentIsLoading) return <span></span>;
    return (
      <span className="change-currency no-select">
        <div
          className={"dropdown" + (isDropdownCollapsed ? " collapsed" : "")}
          ref={this.dropdownRef}
        >
          <span
            className="change-currency-button"
            onClick={this.handleDropdown}
          >
            {currentCurrency.symbol}
          </span>
          <div className="dropdown-content right">
            <ul>
              {data.currencies.map((currency) => (
                <li
                  key={"KEY_" + currency.label}
                  onClick={() => {
                    setCurrency(currency);
                    this.handleDropdown();
                  }}
                  className={
                    currentCurrency.label === currency.label
                      ? "active"
                      : undefined
                  }
                >
                  {currency.symbol + " " + currency.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </span>
    );
  }
}
Currencies.contextType = Currency;

export default Currencies;
