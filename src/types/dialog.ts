import { Dispatch, SetStateAction } from "react";

export type DialogBaseProps = {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
