import React from "react";
import { Currency } from "../../../contexts";
import { GetSpecificProduct, client } from "../../../graphql/queries";
import { ReactComponent as PlusIcon } from "../../../images/plus.svg";
import { ReactComponent as MinusIcon } from "../../../images/minus.svg";
class MiniCartItem extends React.Component {
  state = { data: {}, componentIsLoading: true };
  async componentDidMount() {
    try {
      const { data } = await client.query({
        query: GetSpecificProduct(this.props.cartItem.productId),
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
  render() {
    const { currentCurrency } = this.context;
    const { data, componentIsLoading } = this.state;
    // console.log(data);
    const { cartItem } = this.props;
    if (componentIsLoading) return <div>geh</div>;
    return (
      <div className="item">
        <div className="product-title">
          <span>{data.brand}</span>
          <span>{data.name}</span>
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
