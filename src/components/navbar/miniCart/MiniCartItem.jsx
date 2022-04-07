import React from "react";
import { Currency } from "../../../contexts";
import { ReactComponent as PlusIcon } from "../../../images/plus.svg";
import { ReactComponent as MinusIcon } from "../../../images/minus.svg";
class MiniCartItem extends React.Component {
  handleAttributeRender = (attribute, selectedAttributes) => {
    return (
      <div
        className={"product-attribute " + attribute.type + "-attribute"}
        key={attribute.id}
      >
        <span className="attribute-title">{attribute.name}:</span>
        <div className="attribute-items">
          {attribute.items.map((item) => (
            <span
              key={item.id}
              className={
                "attribute-item no-select" +
                this.checkIsAttributeSelected(
                  attribute.id,
                  item.value,
                  selectedAttributes
                )
              }
              style={
                attribute.type === "swatch"
                  ? {
                      backgroundColor:
                        item.value +
                        (this.checkIsAttributeSelected(
                          attribute.id,
                          item.value,
                          selectedAttributes
                        )
                          ? ""
                          : "90"),
                    }
                  : {}
              }
            >
              {attribute.type === "text" && item.value}
            </span>
          ))}
        </div>
      </div>
    );
  };
  checkIsAttributeSelected = (
    attributeId,
    attributeValue,
    selectedAttributes
  ) => {
    for (let i = 0; i < selectedAttributes.length; i++) {
      if (
        selectedAttributes[i]._id === attributeId &&
        selectedAttributes[i].value === attributeValue
      ) {
        return " selected";
      }
    }
    return "";
  };
  handleChangeItemAmount = (product, amount) => {
    let myCart = JSON.parse(localStorage.getItem("myCart"));
    let indexOfItemToRemove = -1;
    for (let i = 0; i < myCart.length; i++) {
      // find it by id
      if (product.productId === myCart[i].productId) {
        // find it by attributes
        let haveDifferentAttribute = false;
        for (let j = 0; j < myCart[i].attributes.length; j++) {
          let haveThisAttributeWithSameValue = false;
          for (let k = 0; k < product.attributes.length; k++) {
            if (
              myCart[i].attributes[j]._id === product.attributes[k]._id &&
              myCart[i].attributes[j].value === product.attributes[k].value
            ) {
              haveThisAttributeWithSameValue = true;
            }
          }
          if (!haveThisAttributeWithSameValue) haveDifferentAttribute = true;
        }
        if (!haveDifferentAttribute) {
          myCart[i].amount = myCart[i].amount + amount;
          if (myCart[i].amount < 1) indexOfItemToRemove = i;
        }
      }
    }
    if (indexOfItemToRemove >= 0) {
      myCart.splice(indexOfItemToRemove, 1);
    }
    localStorage.setItem("myCart", JSON.stringify(myCart));
    this.props.updateCart(myCart);
  };
  render() {
    const { currentCurrency } = this.context;
    const { cartItem, product: data } = this.props;
    return (
      <div className="item">
        <div className="product-details">
          <div>
            <div className="product-title">
              <span>{data.brand}</span>
              <span>{data.name}</span>
            </div>
            {data.prices.map(
              (price) =>
                price.currency.label === currentCurrency.label && (
                  <span className="product-price" key={"PRICE_" + data.id}>
                    {price.currency.symbol}
                    {price.amount}
                  </span>
                )
            )}
          </div>
          <div className="product-attributes">
            {data.attributes.map((attribute) =>
              this.handleAttributeRender(attribute, cartItem.attributes)
            )}
          </div>
        </div>
        <div className="control-buttons">
          <button onClick={() => this.handleChangeItemAmount(cartItem, 1)}>
            <PlusIcon />
          </button>
          {cartItem.amount}
          <button onClick={() => this.handleChangeItemAmount(cartItem, -1)}>
            <MinusIcon />
          </button>
        </div>
        <img src={data.gallery[0]} alt="IMG" />
      </div>
    );
  }
}
MiniCartItem.contextType = Currency;
export default MiniCartItem;
