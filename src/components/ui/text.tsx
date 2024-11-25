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
      className={cn(
        "text-[20px] font-medium leading-[28px] md:text-[28px] md:font-semibold md:leading-[36px] lg:text-[36px] lg:font-medium lg:leading-[48px]",
        props.className,
      )}
    />
  );
};

export const H3: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <h3
      {...props}
      className={cn(
        "text-[18px] font-medium leading-[26px] md:text-[24px] md:font-semibold md:leading-[32px] lg:text-[32px] lg:font-medium lg:leading-[44px]",
        props.className,
      )}
    />
  );
};

export const Body1: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      className={cn(
        "font-regular text-[16px] leading-[24px] md:text-[18px] md:leading-[26px] lg:text-[20px] lg:leading-[28px]",
        props.className,
      )}
    />
  );
};

export const Body2: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      className={cn(
        "font-regular text-[14px] leading-[22px] md:text-[16px] md:leading-[24px] lg:text-[18px] lg:leading-[26px]",
        props.className,
      )}
    />
  );
};

export const Body3: FC<HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      className={cn(
        "font-regular text-[12px] leading-[20px] md:text-[14px] md:leading-[22px] lg:text-[16px] lg:leading-[24px]",
        props.className,
      )}
    />
  );
};
