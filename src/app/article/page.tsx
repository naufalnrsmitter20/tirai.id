import { PageContainer } from "@/components/layout/PageContainer";
import Hero from "./components/Hero";
import Recent from "./components/Recent-Post";
import MostRead from "./components/Most-Read";

export default function Article() {
  return (
    <PageContainer>
      <Hero />
      <Recent />
      <MostRead />
    </PageContainer>
  );
}