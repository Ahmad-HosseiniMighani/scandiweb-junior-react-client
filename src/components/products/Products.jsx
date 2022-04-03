import React from "react";
import { useParams } from "react-router-dom";
import { client, GetSpecificCategoryProducts } from "../../graphql/queries";
import SingleProduct from "./SingleProduct";
import Modal from "./Modal";

class ProductsComponent extends React.Component {
  state = {
    componentIsLoading: true,
    isModalOpen: false,
  };
  async componentDidMount() {
    const { categoryName } = this.props;
    try {
      const { data } = await client.query({
        query: GetSpecificCategoryProducts(categoryName),
      });
      this.setState({
        componentIsLoading: false,
        data: data.category.products,
      });
    } catch (error) {
      console.log(error);
    }
  }
  handleOpenModal = (product) => {
    this.setState({
      modalData: product,
      isModalOpen: true,
    });
  };
  handleCloseModal = () => {
    this.setState({
      modalData: {},
      isModalOpen: false,
    });
  };
  handleAddToCart = (product, selectedAttributes, errors) => {
    if (errors.length > 0) return errors;
    // let find where the error is
    if (product.attributes.length > selectedAttributes.length) {
      for (let i = 0; i < product.attributes.length; i++) {
        let attributeSelected = false;
        for (let j = 0; j < selectedAttributes.length; j++) {
          if (product.attributes[i].id === selectedAttributes[j]._id) {
            attributeSelected = true;
          }
        }
        if (!attributeSelected) {
          errors.push(product.attributes[i].id);
        }
      }
      return errors;
    }
    //get all cart items
    let myCart = JSON.parse(localStorage.getItem("myCart"));
    //lets check if we have an item with exatcly same id and attributes.
    let existingProductIndex = -1;
    if (myCart === null) {
      myCart = [];
    }
    for (let i = 0; i < myCart.length; i++) {
      // check if we have any product with same id
      if (myCart[i].productId === product.id) {
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
        productId: product.id,
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
    return []; // means no errors
  };
  render() {
    const { componentIsLoading, data, isModalOpen, modalData } = this.state;
    const { categoryName } = this.props;
    if (componentIsLoading) return <main></main>;
    return (
      <React.Fragment>
        <main>
          {isModalOpen && (
            <Modal
              data={modalData}
              handleCloseModal={this.handleCloseModal}
              handleAddToCart={this.handleAddToCart}
            />
          )}
          <h2 className="title">{categoryName}</h2>
          <div className="products-container">
            {data.map((product) => (
              <SingleProduct
                key={"product_" + product.id}
                product={product}
                handleAddToCart={this.handleAddToCart}
                handleOpenModal={this.handleOpenModal}
              />
            ))}
          </div>
        </main>
      </React.Fragment>
    );
  }
}

const Products = (props) => {
  const { categoryName } = useParams();
  return <ProductsComponent {...props} categoryName={categoryName} />;
};
export default Products;
