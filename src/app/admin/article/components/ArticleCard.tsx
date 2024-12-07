"use client";

import { deleteArticle } from "@/actions/articles";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "@prisma/client";
import {
  CalendarIcon,
  Eye,
  HashIcon,
  LinkIcon,
  Pencil,
  Trash,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ArticleCardProps {
  id: string;
  title: string;
  imageUrl: string;
  tags?: string[];
  createdAt: string;
  slug: string;
  author: string;
  author_role: Role;
  views: number;
}

export default function ArticleCard({
  id,
  title,
  imageUrl,
  tags,
  createdAt,
  slug,
  author,
  author_role,
  views,
}: ArticleCardProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="w-full max-w-full lg:max-w-[540px]">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={200}
          className="h-[150px] w-full rounded-md object-cover sm:h-[200px]"
          unoptimized
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
          <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Views: {views}
        </div>
        <div className="flex items-center text-xs text-muted-foreground sm:text-sm">
          <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Created on: {createdAt}
        </div>
        <div className="flex items-center text-xs text-muted-foreground sm:text-sm">
          <LinkIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Slug: {slug}
        </div>
        <div className="flex items-center text-xs text-muted-foreground sm:text-sm">
          <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Written By: {author} - {author_role}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-x-2">
        <Button
          size="icon"
          variant="destructive"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const loadingToast = toast.loading("Loading...");

            const deleteArticleResult = await deleteArticle(id);
            if (deleteArticleResult.error) {
              setLoading(false);
              return toast.error(deleteArticleResult.error.message, {
                id: loadingToast,
              });
            }

            setLoading(false);
            return toast.success("Berhasil menghapus artikel!", {
              id: loadingToast,
            });
          }}
        >
          <Trash />
        </Button>
        <Link
          href={`/admin/article/update/${id}`}
          className={buttonVariants({ variant: "default", size: "icon" })}
        >
          <Pencil />
        </Link>
        <Link
          href={`/article/view/${slug}`}
          className={buttonVariants({ variant: "default", size: "icon" })}
        >
          <Eye />
        </Link>
      </CardFooter>
    </Card>
  );
}
