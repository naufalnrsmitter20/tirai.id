import { PageContainer } from "@/components/layout/PageContainer";
import { Testimonies } from "../(landing-page)/components/Testimonies";
import { Clients } from "./components/Clients";
import { Hero } from "./components/Hero";
import { Keunggulan } from "./components/Keunggulan";
import { VisiMisi } from "./components/VisiMisi";

export default function AboutUs() {
  return (
    <PageContainer>
      <Hero />
      <VisiMisi />
      <Clients />
      <Keunggulan />
      <Testimonies />
    </PageContainer>
  );
}
