import React from "react";
import { Link } from "react-router-dom";
import { Currency } from "./../../contexts";
import { ReactComponent as CartIcon } from "../../images/cart.svg";
class SingleProduct extends React.Component {
  handleAddToCart = (product) => {
    if (product.attributes.length <= 0) {
      this.props.handleAddToCart(product, [], []);
    } else {
      this.props.handleOpenModal(product);
    }
  };
  render() {
    const { product } = this.props;
    const { currentCurrency } = this.context;
    return (
      <div className={"product" + (!product.inStock ? " out-of-stock" : "")}>
        {product.inStock && (
          <button
            className="add-to-cart-btn"
            onClick={() => {
              this.handleAddToCart(product);
            }}
          >
            <CartIcon />
          </button>
        )}
        <Link to={"/product/" + product.id}>
          <div className="product-img">
            <img src={product.gallery[0]} alt="Gallery_img" />
            {!product.inStock && (
              <div className="out-of-stock-overlay">OUT OF STOCK</div>
            )}
          </div>
          <div className="product-details">
            <span className="product-title">
              {product.brand + " " + product.name}
            </span>
            {product.prices.map(
              (price) =>
                price.currency.label === currentCurrency.label && (
                  <span className="product-price" key={"PRICE_" + product.id}>
                    {price.currency.symbol}
                    {price.amount}
                  </span>
                )
            )}
          </div>
        </Link>
      </div>
    );
  }
}
SingleProduct.contextType = Currency;

export default SingleProduct;
