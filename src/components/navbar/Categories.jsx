import React from "react";
import { NavLink } from "react-router-dom";
import { client, CATEGORIES } from "../../graphql/queries";

class Categories extends React.Component {
  state = {
    componentIsLoading: true,
    data: [],
  };
  async componentDidMount() {
    try {
      const { data } = await client.query({
        query: CATEGORIES,
      });
      this.setState({
        componentIsLoading: false,
        data,
      });
    } catch (error) {
      console.log(error);
      this.setState({ componentIsLoading: false });
    }
  }
  render() {
    const { componentIsLoading, data } = this.state;
    if (componentIsLoading) return <ul></ul>;
    return (
      <ul className="categories">
        {data.categories.map((category) => (
          <li key={"KEY_" + category.name}>
            <NavLink to={"/category/" + category.name}>{category.name}</NavLink>
          </li>
        ))}
      </ul>
    );
  }
}
export default Categories;
