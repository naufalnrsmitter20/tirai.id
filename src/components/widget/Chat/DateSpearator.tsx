import { Body3, Body4 } from "@/components/ui/text";
import { formatRelativeDate } from "@/lib/utils";

export const DateSeparator = ({ messageDate }: { messageDate: string }) => {
  return (
    <figure className="my-2 flex w-full items-center justify-center gap-2">
      <div className="h-[1px] w-1/4 bg-slate-500 sm:w-1/3" />
      <Body3 className="hidden text-black sm:block">
        {formatRelativeDate(messageDate)}
      </Body3>
      <Body4 className="block text-black sm:hidden">
        {formatRelativeDate(messageDate)}
      </Body4>
      <div className="h-[1px] w-1/4 bg-slate-500 sm:w-1/3" />
    </figure>
  );
};
