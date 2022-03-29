import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useQuery, CATEGORIES } from "../../graphql/queries";

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

const Categories = () => {
  const { loading, error, data } = useQuery(CATEGORIES);
  if (loading)
    return (
      /* Change it to better thing maybe ? */
      <ul className="categories">
        <li className="placeholder"></li>
        <li className="placeholder"></li>
        <li className="placeholder"></li>
      </ul>
    );
  if (data)
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
  if (error) return <ul className="categories">{error}</ul>;
};

export default Categories;
