import { About } from "./components/About";
import { Custom } from "./components/Custom";
import { Fabric } from "./components/Fabric";
import { Hero } from "./components/Hero";
import { ProductTypes } from "./components/ProductTypes";
import { Products } from "./components/Products";
import { Testimonies } from "./components/Testimonies";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductTypes />
      <Products />
      <Custom />
      <About />
      <Fabric />
      <Testimonies />
    </>
  );
}
