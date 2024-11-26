import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";

export const Display: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <h1
      {...props}
      className={cn(
        "text-[32px] font-medium leading-[43px] sm:text-[36px] sm:leading-[49px] md:font-semibold lg:text-[60px] lg:font-medium lg:leading-[81px]",
        props.className,
      )}
    />
  );
};

export const H1: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <h1
      {...props}
      className={cn(
        "text-[22px] font-medium leading-[30px] md:text-[36px] md:font-semibold md:leading-[44px] lg:text-[48px] lg:font-medium lg:leading-[65px]",
        props.className,
      )}
    />
  );
};

export const H2: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <h2
      {...props}
      className={cn("text-[40px] font-medium leading-[54px]", props.className)}
    />
  );
};

export const H3: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <h3
      {...props}
      className={cn("text-[32px] font-medium leading-[43px]", props.className)}
    />
  );
};

export const H4: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <h3
      {...props}
      className={cn("text-[26px] font-medium leading-[35px]", props.className)}
    />
  );
};

export const H5: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <h3
      {...props}
      className={cn("text-[24px] font-medium leading-[32px]", props.className)}
    />
  );
};

export const H6: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <h3
      {...props}
      className={cn("text-[18px] font-medium leading-[24px]", props.className)}
    />
  );
};

export const Body1: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      className={cn("font-regular text-[24px] leading-[32px]", props.className)}
    />
  );
};

export const Body2: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      className={cn("font-regular text-[18px] leading-[24px]", props.className)}
    />
  );
};

export const Body3: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      className={cn("font-regular text-[16px] leading-[22px]", props.className)}
    />
  );
};

export const Body4: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      className={cn("font-regular text-[14px] leading-[19px]", props.className)}
    />
  );
};

export const Body5: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      className={cn("font-regular text-[12px] leading-[20px]", props.className)}
    />
  );
};
