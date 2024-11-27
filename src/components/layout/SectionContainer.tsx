import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

export const SectionContainer: FC<{
  children?: ReactNode;
  className?: string;
  id?: string;
}> = (props) => {
  return (
    <section
      {...props}
      className={cn("mx-auto w-full py-[5.125rem]", props.className)}
    />
  );
};
