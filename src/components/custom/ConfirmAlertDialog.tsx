import React from "react";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface ConfirmAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  isConfirmLoading?: boolean;
}

function ConfirmAlertDialog({
  isOpen,
  onClose,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onConfirm,
  isConfirmLoading = false,
}: ConfirmAlertDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <Heading size="md" className="text-foreground">
            {title}
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text className="text-muted-foreground">{description}</Text>
        </AlertDialogBody>
        <AlertDialogFooter className="pt-4">
          <Button
            variant="outline"
            onPress={onClose}
            disabled={isConfirmLoading}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
          >
            <ButtonText>{cancelLabel}</ButtonText>
          </Button>
          <Button
            variant="destructive"
            onPress={onConfirm}
            disabled={isConfirmLoading}
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            accessibilityHint={description}
          >
            {isConfirmLoading ? (
              <ButtonSpinner color="white" />
            ) : (
              <ButtonText>{confirmLabel}</ButtonText>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmAlertDialog };
