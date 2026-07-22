import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";

import Logo from "@/components/custom/Logo";
import { useAppBottomInset } from "@/hooks/useAppInsets";

/** Shared scaffold for the `(auth)` screens: a centered logo above a bottom
 * sheet-style card that hosts the screen's form content. */
function AuthScreenLayout({ children }: { children: ReactNode }) {
  const bottomInset = useAppBottomInset();

  return (
    <VStack className="flex-1 justify-between bg-background">
      <VStack
        className="flex-1 items-center justify-center px-6 py-12"
        space="md"
      >
        <Logo size={40} />
      </VStack>

      <Card
        className="px-4 bg-card pt-8 shadow-none border-0 rounded-none rounded-t-4xl"
        style={{ paddingBottom: bottomInset + 20 }}
      >
        {children}
      </Card>
    </VStack>
  );
}

export default AuthScreenLayout;
