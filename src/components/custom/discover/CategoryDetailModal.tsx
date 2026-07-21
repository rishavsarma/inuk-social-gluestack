import React from "react";

import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { ScrollView } from "@/components/ui/scroll-view";

import { CategoryBannerHeader } from "@/components/custom/discover/CategoryBannerHeader";
import { CategorySubcategoryList } from "@/components/custom/discover/CategorySubcategoryList";

interface CategoryDetailModalProps {
  category: TaxonomyCategory | null;
  onClose: () => void;
  onEntity: (name: string, cat: TaxonomyCategory, sub: string) => void;
}

function CategoryDetailModal({ category, onClose, onEntity }: CategoryDetailModalProps) {
  if (!category) return null;

  return (
    <Modal isOpen size="full" className="h-full" onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="h-full w-full rounded-none border-0 bg-background p-0">
        <CategoryBannerHeader category={category} onBack={onClose} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <CategorySubcategoryList category={category} onEntity={onEntity} />
        </ScrollView>
      </ModalContent>
    </Modal>
  );
}

export default CategoryDetailModal;
