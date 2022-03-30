import React from "react";
import { Currency } from "../../../contexts";
import { ReactComponent as PlusIcon } from "../../../images/plus.svg";
import { ReactComponent as MinusIcon } from "../../../images/minus.svg";
class MiniCartItem extends React.Component {
  state = { data: {} };

  handleAttributeRender = (attribute, selectedAttributes) => {
    return (
      <div
        className={"product-attribute " + attribute.type + "-attribute"}
        key={attribute.id}
      >
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
  render() {
    console.log(this.props);
    const { currentCurrency } = this.context;
    const { cartItem, product: data } = this.props;
    console.log(data);
    return (
      <div className="item">
        <div className="product-details">
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
          <div className="product-attributes">
            {data.attributes.map((attribute) =>
              this.handleAttributeRender(attribute, cartItem.attributes)
            )}
          </div>
        </div>
        <div className="control-buttons">
          <button>
            <PlusIcon />
          </button>
          {cartItem.amount}
          <button>
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
