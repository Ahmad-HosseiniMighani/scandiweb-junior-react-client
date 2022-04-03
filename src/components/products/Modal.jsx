import React from "react";
import { ReactComponent as CloseIcon } from "../../images/plus.svg";
class Modal extends React.Component {
  state = { selectedAttributes: [], errors: [] };
  constructor(props) {
    super(props);
    this.modalContentRef = React.createRef();
    this.handleClickOutsideModalContent = this.handleClickOutsideModalContent.bind(
      this
    );
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutsideModalContent);
  }
  componentWillUnmount() {
    document.removeEventListener(
      "mousedown",
      this.handleClickOutsideModalContent
    );
  }
  handleClickOutsideModalContent(event) {
    if (
      this.modalContentRef &&
      !this.modalContentRef.current.contains(event.target)
    ) {
      document.removeEventListener(
        "mousedown",
        this.handleClickOutsideModalContent
      );
      this.props.handleCloseModal();
    }
  }
  handleCloseModal = () => {
    document.removeEventListener(
      "mousedown",
      this.handleClickOutsideModalContent
    );
    this.props.handleCloseModal();
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
  handleAddToCart = () => {
    const { selectedAttributes, errors } = this.state;
    const { data } = this.props;
    const newErrors = this.props.handleAddToCart(
      data,
      selectedAttributes,
      errors
    );
    if (newErrors.length > 0) this.setState({ errors: newErrors });
  };
  render() {
    const { data } = this.props;
    return (
      <div className="modal">
        <div className="modal-content" ref={this.modalContentRef}>
          <span className="close-btn">
            <CloseIcon onClick={this.handleCloseModal} />
          </span>

          <div className="product-attributes">
            {data.attributes.map((attribute) =>
              this.handleAttributeRender(attribute)
            )}
          </div>
          <button className="add-to-cart" onClick={this.handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>
    );
  }
}

export default Modal;
