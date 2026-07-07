import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import React from "react";

type ILinearGradientProps = React.ComponentProps<typeof ExpoLinearGradient>;

const LinearGradient = React.forwardRef<
  React.ComponentRef<typeof ExpoLinearGradient>,
  ILinearGradientProps
>(function LinearGradient({ className, ...props }, ref) {
  return <ExpoLinearGradient ref={ref} {...props} className={className} />;
});

LinearGradient.displayName = "LinearGradient";
export { LinearGradient };
