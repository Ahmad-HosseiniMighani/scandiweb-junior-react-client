import React from "react";
import { ReactComponent as BrandIcon } from "../../images/brand.svg";
import Categories from "./Categories";
import Currencies from "./Currencies";
import MiniCart from "./miniCart/MiniCart";

class Navbar extends React.Component {
  state = {
    isBackDropVisible: false,
  };
  toggleDropdownBackDrop = () => {
    // we can change CSS and apply display block and none there or we can just render and not render div. i do both just to show
    const { isBackDropVisible } = this.state;
    this.setState({ isBackDropVisible: !isBackDropVisible });
  };
  render() {
    const { isBackDropVisible } = this.state;
    return (
      <React.Fragment>
        <header>
          <nav className="navbar">
            <div className="container">
              <Categories />
              <div className="nav-brand">
                <BrandIcon />
              </div>
              <div className="nav-actions">
                <Currencies />
                <MiniCart
                  toggleDropdownBackDrop={this.toggleDropdownBackDrop}
                  myCart={this.props.myCart}
                  products={this.props.products}
                  totalItems={this.props.totalItems}
                  totalPrice={this.props.totalPrice}
                  updateCart={this.props.updateCart}
                />
              </div>
            </div>
          </nav>
        </header>
        {isBackDropVisible && (
          <div
            className={
              "dropdown-back-drop" + (isBackDropVisible ? " show" : "")
            }
          ></div>
        )}
      </React.Fragment>
    );
  }
}

export default Navbar;
