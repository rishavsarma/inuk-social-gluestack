import { useEffect, useState } from "react";

import { MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Box } from "@/components/ui/box";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectVirtualizedList,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useSearchLocations } from "@/hooks/useLocation";

interface CreateLocationFormProps {
  location: string;
  selectedLocation: LocationSearchResult | null;
  onSelectLocation: (item: LocationSearchResult) => void;
}

export function CreateLocationForm({
  location,
  selectedLocation,
  onSelectLocation,
}: CreateLocationFormProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data: suggestions, isFetching: isSearchLoading } =
    useSearchLocations(debouncedQuery);

  return (
    <VStack space="sm" className="pb-6 bg-background">
      <FormControl className="w-full py-2 px-4 bg-card" isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText className="font-baloo-semibold text-foreground/80">
            {t("create_post.location_label")}
          </FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={selectedLocation?.id ?? ""}
          onValueChange={(val) => {
            const found = suggestions?.find((item) => item.id === val);
            if (found) onSelectLocation(found);
          }}
        >
          <SelectTrigger variant="outline" size="lg">
            <SelectIcon as={MapPin} className="ml-3 text-theme" />
            <SelectInput
              value={location}
              placeholder={t("create_post.location_placeholder")}
              className="flex-1 px-3 text-base text-foreground pointer-events-none"
            />
            <SelectIcon as={ChevronDownIcon} className="mr-3 text-muted-foreground" />
          </SelectTrigger>
          <SelectPortal snapPoints={[80]}>
            <SelectBackdrop />
            <SelectContent className="h-full w-full bg-background">
              <SelectDragIndicatorWrapper className="pb-2 pt-4">
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <KeyboardAvoidingView className="w-full flex-1">
                <Box className="w-full px-1 pb-2">
                  <Input>
                    <InputField
                      autoFocus
                      placeholder={t("create_post.location_placeholder")}
                      accessibilityLabel={t("create_post.location_placeholder")}
                      value={query}
                      onChangeText={setQuery}
                      className="text-base text-foreground"
                    />
                  </Input>
                </Box>
                {isSearchLoading ? (
                  <HStack className="w-full items-center justify-center py-6">
                    <Spinner size="small" />
                  </HStack>
                ) : (
                  <SelectVirtualizedList
                    data={suggestions ?? []}
                    keyExtractor={(item: unknown) =>
                      (item as LocationSearchResult).id
                    }
                    getItemCount={(data: unknown) =>
                      (data as LocationSearchResult[]).length
                    }
                    getItem={(data: unknown, index: number) =>
                      (data as LocationSearchResult[])[index]
                    }
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }: { item: unknown }) => {
                      const suggestion = item as LocationSearchResult;
                      return (
                        <Box key={suggestion.id} className="relative w-full">
                          <SelectItem
                            label=""
                            value={suggestion.id}
                            className="min-h-16 py-3"
                          />
                          <Box
                            pointerEvents="none"
                            className="absolute inset-0 flex-row items-center px-3"
                          >
                            <VStack space="xs" className="flex-1 pr-2">
                              <Text
                                numberOfLines={1}
                                className="text-sm font-medium text-foreground"
                              >
                                {suggestion.name}
                              </Text>
                              {suggestion.breadcrumb ? (
                                <Text
                                  numberOfLines={1}
                                  className="text-xs text-muted-foreground"
                                >
                                  {suggestion.breadcrumb}
                                </Text>
                              ) : null}
                            </VStack>
                          </Box>
                        </Box>
                      );
                    }}
                    ListEmptyComponent={
                      <Text className="w-full px-1 py-6 text-center text-xs text-muted-foreground">
                        {debouncedQuery.trim().length < 2
                          ? t("auth.location_search_hint")
                          : t("auth.location_no_results")}
                      </Text>
                    }
                    className="w-full flex-1"
                  />
                )}
              </KeyboardAvoidingView>
            </SelectContent>
          </SelectPortal>
        </Select>
      </FormControl>
    </VStack>
  );
}
