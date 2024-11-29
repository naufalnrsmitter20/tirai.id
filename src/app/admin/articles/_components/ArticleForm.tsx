"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Editor from "@/components/editor/advanced-editor";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { upsertArticle } from "@/actions/articles";
import { ArticlesWithUser } from "@/types/entityRelations";

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export default function ArticleForm({
  updateData,
}: {
  updateData?: ArticlesWithUser;
}) {
  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    tags: z
      .string()
      .transform((val) => val.split(",").map((tag) => tag.trim())),
    content: z.string().min(1, "Content is required"),
    image: updateData
      ? z
          .instanceof(File)
          .optional()
          .refine((file: File | undefined) => {
            return (
              file === undefined || ACCEPTED_IMAGE_TYPES.includes(file?.type)
            );
          }, "only .jpeg, .png. is valid")
          .refine((file: File | undefined) => {
            return file === undefined || file?.size <= MAX_FILE_SIZE;
          }, `Ukuran maksimal file adalah 5MB`)
      : z
          .instanceof(File)
          .refine((file: File) => {
            return ACCEPTED_IMAGE_TYPES.includes(file?.type);
          }, "only .jpeg, .png. is valid")
          .refine((file: File) => {
            return file?.size <= MAX_FILE_SIZE;
          }, `Ukuran maksimal file adalah 5MB`),
    is_published: z.boolean().default(false),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: updateData?.title || "",
      slug: updateData?.slug || "",
      // @ts-expect-error to display initial update data
      tags: updateData?.tags.join(", ") || [],
      content: updateData?.content || "",
      image: undefined,
      is_published: updateData?.is_published || false,
    },
  });

  console.log(form.watch("content"));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("tags", values.tags.join(","));
    formData.append("content", values.content);
    if (values.image) {
      formData.append("image", values.image);
    }
    formData.append("is_published", values.is_published.toString());
    formData.append("author_id", "1");

    const res = await upsertArticle({ data: formData, id: updateData?.id });
    console.log(values);
    console.log(res);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-lg space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter article title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Enter article slug" {...field} />
              </FormControl>
              <FormDescription>
                This will be used in the {`article's URL.`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tags, separated by commas"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter tags separated by commas
                {`(e.g., "tech, news, programming")`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Editor initialValue={updateData?.content} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("image") ? (
          <div className="mt-4">
            <Image
              src={URL.createObjectURL(form.watch("image") as Blob)}
              width={300}
              height={200}
              alt="Cover Preview"
              className="max-h-64"
            />
          </div>
        ) : updateData && updateData.cover_url ? (
          <div className="mt-4">
            <Image
              src={updateData.cover_url}
              width={300}
              height={200}
              alt="Cover Preview"
              className="max-h-64"
            />
          </div>
        ) : null}
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publish</FormLabel>
                <FormDescription>
                  Check this box to publish the article immediately.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
