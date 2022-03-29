import { useParams } from "react-router-dom";
import { useQuery, GetSpecificCategoryProducts } from "../../graphql/queries";
import SingleProduct from "./SingleProduct";
const Products = () => {
  let { categoryName } = useParams();
  const { loading, error, data } = useQuery(
    GetSpecificCategoryProducts(categoryName)
  );
  console.log(loading);
  if (loading) return <main>Loading bitch</main>;
  return (
    <main>
      <h2 className="title">{categoryName}</h2>
      <div className="products-container">
        {data.category.products.map((product) => (
          <SingleProduct product={product} key={"product_" + product.id} />
        ))}
      </div>
    </main>
  );
};

export default Products;
