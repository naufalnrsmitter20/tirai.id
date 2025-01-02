import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { H2 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";
import prisma from "@/lib/prisma";
import { findReviews } from "@/utils/database/review.query";
import { ReviewCard } from "../components/ReviewCard";
import { ReviewFilter } from "./ReviewFilter";

export default async function ReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string; rating?: string }>;
}) {
  const { slug } = await params;
  const { page: currPage, rating } = await searchParams;

  const filterRating = rating ? parseInt(rating) : undefined;

  const page = currPage ? parseInt(currPage) : 1;
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
  });
  const reviews = await findReviews({
    page: page,
    perPage: 6,
    args: {
      where: {
        rating: filterRating,
        product: {
          slug,
        },
      },
    },
  });

  return (
    <PageContainer className="text-black">
      <SectionContainer id="hero">
        <div className="mb-12 mt-12">
          <H2 className="mb-3">Ulasan {product?.name}</H2>
          <ReviewFilter
            searchData={{ rating: rating, page: page.toString() }}
          />
        </div>
        <div id="Reviews" className="mb-10 grid w-full grid-cols-2 gap-2">
          {reviews.data.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
        <PageSelector meta={reviews.meta} />
      </SectionContainer>
    </PageContainer>
  );
}
