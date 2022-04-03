import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { client, CATEGORIES } from "../../graphql/queries";

function CustomNavLink({ children, to, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <li className={match ? " active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
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
          <CustomNavLink
            key={"KEY_" + category.name}
            to={"category/" + category.name}
          >
            {category.name}
          </CustomNavLink>
        ))}
      </ul>
    );
  }
}
export default Categories;
