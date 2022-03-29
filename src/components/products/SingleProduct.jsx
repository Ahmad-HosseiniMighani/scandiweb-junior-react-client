import { Link } from "react-router-dom";
import { Currency } from "./../../contexts";
import { ReactComponent as CartIcon } from "../../images/cart.svg";
const SingleProduct = ({ product }) => {
  return (
    <Currency.Consumer>
      {({ currentCurrency }) => (
        <div className={"product" + (!product.inStock ? " out-of-stock" : "")}>
          {product.inStock && (
            <span
              className="add-to-cart-btn"
              onClick={(e) => {
                e.preventDefault();
                console.log("add me to cart bitch");
              }}
            >
              <CartIcon />
            </span>
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
      )}
    </Currency.Consumer>
  );
};

export default SingleProduct;
