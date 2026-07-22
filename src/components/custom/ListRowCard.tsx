import React from "react";

import { HStack } from "@/components/ui/hstack";

interface ListRowCardProps {
  leading?: React.ReactNode;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}

function ListRowCard({ leading, children, trailing }: ListRowCardProps) {
  return (
    <HStack
      space="md"
      className="mx-4 mb-2 items-center rounded-xl border border-border bg-card px-4 py-3"
    >
      {leading}
      {children}
      {trailing}
    </HStack>
  );
}

export { ListRowCard };
