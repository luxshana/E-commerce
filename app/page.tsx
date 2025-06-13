import AllCategories from "../components/AllCategories";
import CategoryMenu from "../components/CategoryMenu";
import Promos from "../components/Promos";
import CatSlider from "../components/CatSlider";

export default function Home() {
  return (
    <>
      <div>
        <Promos />
        <CatSlider />

        <AllCategories />
        <CategoryMenu />
      </div>
    </>
  );
}
