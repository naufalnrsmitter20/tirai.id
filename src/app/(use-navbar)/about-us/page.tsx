import { PageContainer } from "@/components/layout/PageContainer";
import Hero from "./components/Hero";
import { Client } from "./components/Client";
import { Keunggulan } from "./components/Keunggulan";
import { Testimony } from "./components/Testimony";
import VisiMisi from "./components/VisiMisi";

export default function AboutUs() {
  return (
    <PageContainer>
      <Hero />
      <VisiMisi />
      <Client />
      <Keunggulan />
      <Testimony />
    </PageContainer>
  );
}
