"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const ProgressBarProvider = () => {
  return (
    <ProgressBar
      height="4px"
      color="#133E87"
      options={{ showSpinner: true }}
      shallowRouting
    />
  );
};

export default ProgressBarProvider;
