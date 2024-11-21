"use client";
import { CalendarIcon, HashIcon, LinkIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  title: string;
  imageUrl: string;
  tags?: string[];
  createdAt: string;
  slug: string;
}

export default function ArticleCard({
  title,
  imageUrl,
  tags,
  createdAt,
  slug,
}: ArticleCardProps) {
  return (
    <Card className="w-full max-w-[580px]">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={200}
          className="object-fit h-[150px] w-full rounded-md sm:h-[200px]"
        />
        <div className="flex flex-wrap gap-2">
          {tags &&
            tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs sm:text-sm"
              >
                <HashIcon className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
        </div>
        <div className="flex items-center text-xs text-muted-foreground sm:text-sm">
          <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Created on: {createdAt}
        </div>
        <div className="flex items-center text-xs text-muted-foreground sm:text-sm">
          <LinkIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Slug: {slug}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button size="sm" className="sm:px-4 sm:py-2 sm:text-base">
          Update Article
        </Button>
        <Button size="sm" className="sm:px-4 sm:py-2 sm:text-base">
          See Article
        </Button>
      </CardFooter>
    </Card>
  );
}
