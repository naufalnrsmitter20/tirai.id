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
      className={cn(
        "mx-auto w-full max-w-screen-xl px-6 py-[5.125rem] md:px-12",
        props.className,
      )}
    />
  );
};
