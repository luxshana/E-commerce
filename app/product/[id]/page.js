import { fetchSingleProduct } from "../../../lib/api";
import ProductPage from "./ProductPage";

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { id } = params;
  const product = await fetchSingleProduct(id);
console.log("test");
  return {
    title: product?.product?.product_name
      ? `${product.product.product_name} | Your Store Name`
      : "Product Not Found",
    description: product?.product?.description
      ? product.product.description.slice(0, 160)
      : "Explore our products at Your Store Name.",
  };
}

export default async function Page({ params }) {
  const { id } = params;
  const product = await fetchSingleProduct(id);
  console.log(product);
  return <ProductPage initialProduct={product} />;
}
