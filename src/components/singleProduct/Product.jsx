import React from "react";
import { useParams } from "react-router-dom";
import {
  //   useQuery,
  GetSpecificProduct,
  client,
  //   gql,
} from "../../graphql/queries";

class ProductComponent extends React.Component {
  state = {
    data: null,
    componentIsLoading: true,
    selectedImageUrl: "",
    selectedAttributes: [],
  };
  async componentDidMount() {
    try {
      const { data } = await client.query({
        query: GetSpecificProduct(this.props.productId),
      });
      //   console.log(data);
      this.setState({
        componentIsLoading: false,
        data: data.product,
        selectedImageUrl: data.product.gallery[0],
      });
      //   this.setState({ res });
    } catch (error) {
      console.log(error);
    }
  }
  handleSelectProductImage = (selectedImageUrl) => {
    this.setState({ selectedImageUrl });
  };
  handleAttributeRender = (attribute) => {
    // if (attribute.type === "text")
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
    } else {
      //remove tha betch
    }
    if (needRerender) this.setState({ selectedAttributes });
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
        price.currency.label === "USD" && (
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
  render() {
    const {
      componentIsloading,
      data,
      selectedImageUrl,
      selectedAttributes,
    } = this.state;
    if (componentIsloading) return <main>Loading bitch</main>;
    if (data === null) return <main>what tha Heil!?</main>;
    // console.table(selectedAttributes);
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
            <button className="btn add-to-cart">ADD TO CART</button>
            <div className="product-description" dangerouslySetInnerHTML={{ __html: data.description }} />
          </div>
        </div>
      </main>
    );
  }
}

const Product = (props) => {
  // let navigate = useNavigate(); navigate={navigate}
  const { productId } = useParams();
  return <ProductComponent {...props} productId={productId} />;
};
export default Product;
