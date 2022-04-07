import React from "react";
import DOMPurify from "dompurify";
import { GetSpecificProducts, client } from "../../graphql/queries";
import { Currency } from "../../contexts";
class Product extends React.Component {
  state = {
    data: null,
    componentIsLoading: true,
    selectedImageUrl: "",
    selectedAttributes: [],
    errors: [],
  };
  async componentDidMount() {
    const { productId } = this.props.match.params;
    try {
      const { data } = await client.query({
        query: GetSpecificProducts([productId]),
      });
      this.setState({
        componentIsLoading: false,
        data: data["product_0"],
        selectedImageUrl:
          data["product_0"] === null ? "" : data["product_0"].gallery[0],
      });
    } catch (error) {
      console.log(error);
    }
  }
  handleSelectProductImage = (selectedImageUrl) => {
    this.setState({ selectedImageUrl });
  };
  handleAttributeRender = (attribute) => {
    const { errors } = this.state;
    return (
      <div
        className={"product-attribute " + attribute.type + "-attribute"}
        key={attribute.id}
      >
        <span
          className={
            "attribute-title" +
            (errors.indexOf(attribute.id) >= 0 ? " warrning-blinking" : "")
          }
        >
          {attribute.name}:
        </span>
        <div className="attribute-items">
          {attribute.items.map((item) => (
            <span
              key={item.id}
              className={
                "attribute-item no-select" +
                this.checkIsAttributeSelected(attribute.id, item.value)
              }
              style={
                attribute.type === "swatch"
                  ? { backgroundColor: item.value }
                  : {}
              }
              onClick={() =>
                this.handleAttributeSelection(attribute.id, item.value)
              }
            >
              {attribute.type === "text" && item.value}
            </span>
          ))}
        </div>
      </div>
    );
  };
  handleAttributeSelection = (attributeId, attributeValue) => {
    const { errors } = this.state;
    let selectedAttributes = [...this.state.selectedAttributes];
    let indexOfSelectedAttribute = -1;
    let needRerender = true;
    for (let i = 0; i < selectedAttributes.length; i++) {
      if (selectedAttributes[i]._id === attributeId) {
        indexOfSelectedAttribute = i;
        if (selectedAttributes[i].value === attributeValue) {
          needRerender = false;
        } else {
          selectedAttributes[i].value = attributeValue;
        }
      }
    }
    if (indexOfSelectedAttribute < 0) {
      selectedAttributes.push({
        _id: attributeId,
        value: attributeValue,
      });
    }
    if (needRerender) {
      const attributeErrorIndex = errors.indexOf(attributeId);
      if (attributeErrorIndex >= 0) {
        errors.splice(attributeErrorIndex, 1);
      }
      this.setState({ selectedAttributes, errors });
    }
  };
  checkIsAttributeSelected = (attributeId, attributeValue) => {
    let selectedAttributes = [...this.state.selectedAttributes];
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
  renderPrice = (prices) => {
    return prices.map(
      (price) =>
        price.currency.label === this.context.currentCurrency.label && (
          <div className="product-price" key={"PRICE_" + price.currency.label}>
            <span className="title">PRICE:</span>
            <span className="amount">
              {price.currency.symbol}
              {price.amount}
            </span>
          </div>
        )
    );
  };
  handleAddToCart = () => {
    const { selectedAttributes, errors, data } = this.state;
    const { productId } = this.props.match.params;
    //get all cart items
    if (errors.length > 0) return;
    // let find where the error is
    if (data.attributes.length > selectedAttributes.length) {
      for (let i = 0; i < data.attributes.length; i++) {
        let attributeSelected = false;
        for (let j = 0; j < selectedAttributes.length; j++) {
          if (data.attributes[i].id === selectedAttributes[j]._id) {
            attributeSelected = true;
          }
        }
        if (!attributeSelected) {
          errors.push(data.attributes[i].id);
        }
      }
      this.setState({ errors });
      return;
    }
    let myCart = JSON.parse(localStorage.getItem("myCart"));
    //lets check if we have an item with exatcly same id and attributes.
    let existingProductIndex = -1;
    if (myCart === null) {
      myCart = [];
    }
    for (let i = 0; i < myCart.length; i++) {
      // check if we have any product with same id
      if (myCart[i].productId === productId) {
        // check if we have any product with exatctly same attributes
        let haveDifferentAttribute = false;
        if (selectedAttributes.length !== myCart[i].attributes.length) {
          haveDifferentAttribute = true;
        } else {
          for (let j = 0; j < myCart[i].attributes.length; j++) {
            let haveThisAttributeWithSameValue = false;
            for (let k = 0; k < selectedAttributes.length; k++) {
              if (
                myCart[i].attributes[j]._id === selectedAttributes[k]._id &&
                myCart[i].attributes[j].value === selectedAttributes[k].value
              ) {
                haveThisAttributeWithSameValue = true;
              }
            }
            if (!haveThisAttributeWithSameValue) haveDifferentAttribute = true;
          }
        }
        if (!haveDifferentAttribute) {
          existingProductIndex = i;
        }
      }
    }
    if (existingProductIndex < 0) {
      myCart.push({
        productId,
        attributes: selectedAttributes,
        amount: 1,
      });
      localStorage.setItem("myCart", JSON.stringify(myCart));
    } else {
      myCart[existingProductIndex].amount =
        myCart[existingProductIndex].amount + 1;
      localStorage.setItem("myCart", JSON.stringify(myCart));
    }
    this.props.updateCart(myCart);
  };
  render() {
    const { componentIsloading, data, selectedImageUrl, errors } = this.state;
    if (componentIsloading) return <main></main>;
    if (data === null)
      return (
        <main>
          Woops, something went wrong while trying to get your product
          information.
        </main>
      );
    return (
      <main>
        <div className="product-container">
          <div className="product-gallery">
            <div className="thumbnails">
              {data.gallery.map((url) => (
                <div
                  className="thumbnail"
                  key={"KEY_" + url}
                  onClick={() => this.handleSelectProductImage(url)}
                >
                  <img src={url} alt="thumbnail" />
                </div>
              ))}
            </div>
            <div className="product-img">
              <img src={selectedImageUrl} alt="" />
            </div>
          </div>
          <div className="product-content">
            <span className="product-brand">{data.brand}</span>
            <span className="product-name">{data.name}</span>
            <div className="product-attributes">
              {data.attributes.map((attribute) =>
                this.handleAttributeRender(attribute)
              )}
            </div>
            {this.renderPrice(data.prices)}
            {data.inStock && (
              <button
                className="btn add-to-cart"
                onClick={this.handleAddToCart}
              >
                ADD TO CART
              </button>
            )}
            {!data.inStock && (
              <button className="btn out-of-stock" disabled={true}>
                OUT OF STOCK
              </button>
            )}
            {errors.length > 0 && (
              <p className="errors">Please select all necessary attributes.</p>
            )}
            <div
              className="product-description"
              id="product-description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data.description),
              }}
            />
          </div>
        </div>
      </main>
    );
  }
}
Product.contextType = Currency;
export default Product;
