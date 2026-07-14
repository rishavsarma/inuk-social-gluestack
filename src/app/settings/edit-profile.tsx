import React, { useEffect, useState } from "react";

import { router } from "expo-router";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  AlertCircle,
  AtSign,
  CalendarDays,
  Camera,
  Globe,
  IdCard,
  Lock,
  MapPin,
  MessageSquare,
  Sparkles,
  User,
  VenusAndMars,
  Save,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Platform } from "react-native";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonSpinner,
  ButtonText,
  ButtonIcon,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon, CircleIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Pressable } from "@/components/ui/pressable";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { useAuthStore } from "@/stores/auth.store";

import { useGetProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useSearchLocations } from "@/hooks/useLocation";
import { useUpload } from "@/hooks/useUpload";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

import { useAppBottomInset } from "@/hooks/useAppInsets";

const GENDERS = [
  { id: "MALE", labelKey: "edit_profile.male" },
  { id: "FEMALE", labelKey: "edit_profile.female" },
  { id: "OTHER", labelKey: "edit_profile.other" },
] as const;

const VISIBILITIES = [
  {
    id: "PUBLIC",
    labelKey: "edit_profile.public",
    subKey: "edit_profile.public_sub",
    icon: Globe,
  },
  {
    id: "PRIVATE",
    labelKey: "edit_profile.private",
    subKey: "edit_profile.private_sub",
    icon: Lock,
  },
] as const;

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ComponentType<any>;
  title: string;
}) {
  return (
    <HStack space="sm" className="items-center">
      <Box className="h-9 w-9 items-center justify-center rounded-xl bg-theme/12">
        <Icon as={icon} size="sm" className="text-theme" />
      </Box>
      <Heading size="sm" className="text-foreground">
        {title}
      </Heading>
    </HStack>
  );
}

function EditProfileSkeleton() {
  return (
    <VStack space="lg" className="px-4 pt-4">
      <VStack className="relative mb-12 -mx-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="absolute -bottom-12 left-5 h-28 w-28 rounded-full border-4 border-background" />
      </VStack>
      {[...Array(2)].map((_, cardIndex) => (
        <VStack
          key={cardIndex}
          space="lg"
          className="rounded-2xl border border-border bg-card p-4"
        >
          <Skeleton className="h-9 w-40 rounded-xl" />
          {[...Array(2)].map((__, index) => (
            <VStack key={index} space="xs">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </VStack>
          ))}
        </VStack>
      ))}
    </VStack>
  );
}

interface EditProfileFormProps {
  profile: ProfileResponse;
  profileId: string;
}

function EditProfileForm({ profile, profileId }: EditProfileFormProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { uploadMedia } = useUpload();

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(profileId);

  const [avatarUri, setAvatarUri] = useState(
    `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.avatar}/jpeg/720`,
  );
  const [coverUri, setCoverUri] = useState(
    `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.coverPhoto}/jpeg/720`,
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [name, setName] = useState(profile.givenName);
  const [username, setUsername] = useState(profile.username || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSearchResult | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [debouncedLocationQuery, setDebouncedLocationQuery] = useState("");
  const [gender, setGender] = useState<string>(profile.gender || "");
  const [dob, setDob] = useState<Date | undefined>(
    profile.dob ? new Date(profile.dob) : undefined,
  );
  const [visibility, setVisibility] = useState<string>(
    profile.visibility || "PUBLIC",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedLocationQuery(locationQuery),
      300,
    );
    return () => clearTimeout(timeout);
  }, [locationQuery]);

  const { data: locationSuggestions, isFetching: isLocationSearchLoading } =
    useSearchLocations(debouncedLocationQuery);

  const handleSelectLocation = (item: LocationSearchResult) => {
    const label = item.breadcrumb
      ? `${item.name}, ${item.breadcrumb}`
      : item.name;
    setSelectedLocation(item);
    setLocation(label);
    setLocationQuery("");
  };

  const handlePickImage = async (target: "avatar" | "cover") => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: target === "avatar" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];

    const setUploading =
      target === "avatar" ? setIsUploadingAvatar : setIsUploadingCover;
    const setUri = target === "avatar" ? setAvatarUri : setCoverUri;

    setUploading(true);
    try {
      const fileName = asset.fileName || `${target}-${Date.now()}.jpg`;
      const mediaId = await uploadMedia({
        fileUri: asset.uri,
        fileName,
        mediaType: target === "avatar" ? "AVATAR" : "ILLUSTRATION",
        visibility: "ALL",
      });

      await updateProfile(
        target === "avatar" ? { avatar: mediaId } : { coverPhoto: mediaId },
      );
      setUri(asset.uri);
    } catch {
      setSaveError(
        target === "avatar"
          ? t("edit_profile.avatar_upload_error")
          : t("edit_profile.cover_upload_error"),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setNameError(null);
    setUsernameError(null);
    setSaveError(null);

    const cleanedName = name.trim();
    const cleanedUsername = username.trim().toLowerCase();

    let hasError = false;

    if (!cleanedName) {
      setNameError(t("edit_profile.name_error_required"));
      hasError = true;
    }

    const usernameRegex = /^[a-z0-9_]{3,}$/;
    if (!usernameRegex.test(cleanedUsername)) {
      setUsernameError(t("auth.username_error_invalid"));
      hasError = true;
    }

    if (hasError) return;

    const [firstName, ...rest] = cleanedName.split(/\s+/);
    const lastName = rest.join(" ");

    try {
      await updateProfile({
        firstName,
        lastName,
        username: cleanedUsername,
        bio: bio.trim(),
        location: location.trim(),
        gender: gender || undefined,
        dob: dob ? dob.getTime() : undefined,
        visibility,
      });

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="success" variant="solid">
            <ToastDescription>
              {t("edit_profile.profile_saved")}
            </ToastDescription>
          </Toast>
        ),
      });
      router.back();
    } catch {
      setSaveError(t("edit_profile.error_generic"));
    }
  };

  const selectedGender = GENDERS.find((item) => item.id === gender);

  return (
    <VStack space="2xl" className="bg-background pb-2">
      {/* Cover + Avatar */}
      <VStack className="relative mb-10 -mx-4">
        <Pressable
          onPress={() => handlePickImage("cover")}
          accessibilityRole="button"
          accessibilityLabel={t("edit_profile.change_cover")}
        >
          <Box className="h-72 w-full overflow-hidden bg-muted">
            <Image
              source={{ uri: coverUri }}
              alt={t("profile.cover_photo_alt")}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.55)"]}
              className="absolute inset-x-0 bottom-0 h-24"
              pointerEvents="none"
            />
            {isUploadingCover && (
              <Box className="absolute inset-0 items-center justify-center bg-black/40">
                <Spinner color="white" />
              </Box>
            )}
          </Box>
          <HStack
            space="xs"
            className="absolute bottom-3 right-4 items-center rounded-full bg-black/55 px-3 py-1.5"
          >
            <Icon as={Camera} size="xs" className="text-white" />
            <Text className="text-xs font-semibold text-white">
              {t("edit_profile.change_cover")}
            </Text>
          </HStack>
        </Pressable>

        <Pressable
          onPress={() => handlePickImage("avatar")}
          accessibilityRole="button"
          accessibilityLabel={t("profile.edit_avatar")}
          className="absolute -bottom-12 left-8"
        >
          <Box className="h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-muted shadow-lg shadow-black/30">
            <Image
              source={{ uri: avatarUri }}
              alt={t("profile.edit_avatar")}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            {isUploadingAvatar && (
              <Box className="absolute inset-0 items-center justify-center bg-black/40">
                <Spinner color="white" />
              </Box>
            )}
          </Box>
          <Box className="absolute -right-0.5 -bottom-0.5 h-8 w-8 items-center justify-center rounded-full bg-theme ring-4 ring-background">
            <Icon as={Camera} size="xs" className="text-white" />
          </Box>
        </Pressable>
      </VStack>

      <VStack space="lg" className="px-0">
        {/* Basic Information */}
        <Card className="gap-4 rounded-md shadow-none border-0">
          <SectionHeader
            icon={IdCard}
            title={t("edit_profile.basic_information")}
          />

          {/* Name */}
          <FormControl isInvalid={!!nameError} isDisabled={isPending}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-semibold">
                  {t("edit_profile.name")}
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="">
                <InputSlot className="">
                  <InputIcon as={User} className="text-muted-foreground" />
                </InputSlot>
                <InputField
                  placeholder={t("edit_profile.name_placeholder")}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (nameError) setNameError(null);
                  }}
                  className="text-base text-foreground"
                />
              </Input>
              {nameError && (
                <FormControlError>
                  <FormControlErrorText>{nameError}</FormControlErrorText>
                </FormControlError>
              )}
            </VStack>
          </FormControl>

          {/* Username */}
          <FormControl isInvalid={!!usernameError} isDisabled={isPending}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-semibold">
                  {t("edit_profile.username")}
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="">
                <InputSlot className="">
                  <InputIcon as={AtSign} className="text-muted-foreground" />
                </InputSlot>
                <InputField
                  autoCorrect={false}
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={t("edit_profile.username_placeholder")}
                  value={username}
                  onChangeText={(val) => {
                    setUsername(val.replace(/\s/g, ""));
                    if (usernameError) setUsernameError(null);
                  }}
                  className="text-base text-foreground"
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  {t("auth.username_helper")}
                </FormControlHelperText>
              </FormControlHelper>
              {usernameError && (
                <FormControlError>
                  <FormControlErrorText>{usernameError}</FormControlErrorText>
                </FormControlError>
              )}
            </VStack>
          </FormControl>

          {/* Bio */}
          <FormControl isDisabled={isPending}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-semibold">
                  {t("edit_profile.bio")}
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="">
                <InputSlot className="">
                  <InputIcon
                    as={MessageSquare}
                    className="text-muted-foreground"
                  />
                </InputSlot>
                <InputField
                  placeholder={t("edit_profile.bio_placeholder")}
                  value={bio}
                  onChangeText={setBio}
                  className="text-base text-foreground"
                />
              </Input>
            </VStack>
          </FormControl>
        </Card>

        {/* Personal Details */}
        <Card className="gap-4 rounded-md shadow-none border-0">
          <SectionHeader
            icon={Sparkles}
            title={t("edit_profile.personal_details")}
          />

          {/* Gender */}
          <FormControl isDisabled={isPending}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-semibold">
                  {t("edit_profile.gender")}
                </FormControlLabelText>
              </FormControlLabel>
              <Select selectedValue={gender} onValueChange={setGender}>
                <SelectTrigger
                  variant="outline"
                  size="lg"
                  className="justify-between "
                >
                  <SelectIcon
                    as={VenusAndMars}
                    className="ml-2 text-muted-foreground"
                  />
                  <SelectInput
                    placeholder={t("edit_profile.select_gender")}
                    value={selectedGender ? t(selectedGender.labelKey) : ""}
                    className="flex-1 pl-2"
                  />
                  <SelectIcon as={ChevronDownIcon} className="mr-3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {GENDERS.map((item) => (
                      <SelectItem
                        key={item.id}
                        label={t(item.labelKey)}
                        value={item.id}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>
          </FormControl>

          {/* Date of Birth */}
          <FormControl isDisabled={isPending}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-semibold">
                  {t("edit_profile.dob")}
                </FormControlLabelText>
              </FormControlLabel>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel={t("edit_profile.select_dob")}
              >
                <Input className="" pointerEvents="none">
                  <InputSlot className="">
                    <InputIcon
                      as={CalendarDays}
                      className="text-muted-foreground"
                    />
                  </InputSlot>
                  <InputField
                    value={dob ? format(dob, "yyyy-MM-dd") : ""}
                    editable={false}
                    placeholder={t("edit_profile.select_date")}
                    className="text-base text-foreground py-2 leading-normal"
                  />
                </Input>
              </Pressable>
              {Platform.OS === "android" && showDatePicker && (
                <DateTimePicker
                  value={dob || new Date(2000, 0, 1)}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(_event: DateTimePickerEvent, date?: Date) => {
                    setShowDatePicker(false);
                    if (date) setDob(date);
                  }}
                />
              )}
              {Platform.OS === "ios" && (
                <Modal
                  visible={showDatePicker}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <VStack className="flex-1 justify-end bg-black/50">
                    <Pressable
                      className="absolute inset-0"
                      accessibilityRole="button"
                      accessibilityLabel={t("edit_profile.cancel")}
                      onPress={() => setShowDatePicker(false)}
                    />
                    <VStack className="rounded-t-2xl border-t border-border bg-card p-4 pb-8">
                      <HStack className="mb-4 items-center justify-between">
                        <Pressable
                          onPress={() => setShowDatePicker(false)}
                          accessibilityRole="button"
                          accessibilityLabel={t("edit_profile.cancel")}
                        >
                          <Text className="text-base font-semibold text-primary">
                            {t("edit_profile.cancel")}
                          </Text>
                        </Pressable>
                        <Text className="text-base font-bold text-foreground">
                          {t("edit_profile.dob")}
                        </Text>
                        <Pressable
                          onPress={() => setShowDatePicker(false)}
                          accessibilityRole="button"
                          accessibilityLabel={t("edit_profile.done")}
                        >
                          <Text className="text-base font-semibold text-primary">
                            {t("edit_profile.done")}
                          </Text>
                        </Pressable>
                      </HStack>
                      <DateTimePicker
                        value={dob || new Date(2000, 0, 1)}
                        mode="date"
                        display="spinner"
                        maximumDate={new Date()}
                        onChange={(_event: DateTimePickerEvent, date?: Date) => {
                          if (date) setDob(date);
                        }}
                      />
                    </VStack>
                  </VStack>
                </Modal>
              )}
            </VStack>
          </FormControl>

          {/* Location */}
          <FormControl isDisabled={isPending}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-semibold">
                  {t("edit_profile.location")}
                </FormControlLabelText>
              </FormControlLabel>
              <Select
                selectedValue={selectedLocation?.id ?? ""}
                onValueChange={(val) => {
                  const found = locationSuggestions?.find(
                    (item) => item.id === val,
                  );
                  if (found) handleSelectLocation(found);
                }}
              >
                <SelectTrigger variant="outline" size="lg">
                  <SelectIcon
                    as={MapPin}
                    className="ml-3 text-muted-foreground"
                  />
                  <SelectInput
                    value={location}
                    placeholder={t("edit_profile.location_placeholder")}
                    className="flex-1 text-base text-foreground pointer-events-none px-3"
                  />
                  <SelectIcon
                    as={ChevronDownIcon}
                    className="mr-3 text-muted-foreground"
                  />
                </SelectTrigger>
                <SelectPortal snapPoints={[80]}>
                  <SelectBackdrop />
                  <SelectContent className="h-full w-full bg-background">
                    <SelectDragIndicatorWrapper className="pt-4 pb-2">
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <KeyboardAvoidingView className="w-full flex-1">
                      <Box className="w-full px-1 pb-2">
                        <Input>
                          <InputField
                            autoFocus
                            placeholder={t("auth.location_search_placeholder")}
                            accessibilityLabel={t(
                              "auth.location_search_placeholder",
                            )}
                            value={locationQuery}
                            onChangeText={setLocationQuery}
                            className="text-base text-foreground"
                          />
                        </Input>
                      </Box>
                      {isLocationSearchLoading ? (
                        <HStack className="items-center justify-center py-6 w-full">
                          <Spinner size="small" />
                        </HStack>
                      ) : (
                        <SelectVirtualizedList
                          data={locationSuggestions ?? []}
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
                              <Box
                                key={suggestion.id}
                                className="relative w-full"
                              >
                                <SelectItem
                                  label=""
                                  value={suggestion.id}
                                  className="min-h-16 py-3"
                                />
                                <Box
                                  pointerEvents="none"
                                  className="absolute inset-0 flex-row items-center justify-between px-3"
                                >
                                  <VStack space="xs" className="flex-1 pr-2">
                                    <Text
                                      numberOfLines={1}
                                      className="text-sm font-medium text-foreground"
                                    >
                                      {suggestion.name}
                                    </Text>
                                    {!!suggestion.breadcrumb && (
                                      <Text
                                        numberOfLines={1}
                                        className="text-xs text-muted-foreground"
                                      >
                                        {suggestion.breadcrumb}
                                      </Text>
                                    )}
                                  </VStack>
                                  {!!suggestion.settlementClass && (
                                    <Badge
                                      variant="outline"
                                      className="rounded-full"
                                    >
                                      <BadgeText className="capitalize text-xs text-center">
                                        {suggestion.settlementClass}
                                      </BadgeText>
                                    </Badge>
                                  )}
                                </Box>
                              </Box>
                            );
                          }}
                          ListEmptyComponent={
                            <Text className="text-xs text-muted-foreground px-1 py-6 text-center w-full">
                              {debouncedLocationQuery.trim().length < 2
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
            </VStack>
          </FormControl>
        </Card>

        {/* Visibility */}
        <Card className="gap-4 rounded-md shadow-none border-0">
          <SectionHeader
            icon={Lock}
            title={t("edit_profile.profile_visibility")}
          />
          <FormControl isDisabled={isPending}>
            <RadioGroup value={visibility} onChange={setVisibility}>
              <VStack space="sm">
                {VISIBILITIES.map((item) => {
                  const isSelected = visibility === item.id;
                  return (
                    <Radio
                      key={item.id}
                      value={item.id}
                      size="md"
                      className={`w-full flex-row-reverse justify-between rounded-sm border px-4 py-3 ${
                        isSelected
                          ? "border-theme bg-theme/8"
                          : "border-border bg-transparent"
                      }`}
                    >
                      <RadioIndicator>
                        <RadioIcon
                          as={CircleIcon}
                          className="bg-theme fill-theme"
                        />
                      </RadioIndicator>
                      <HStack space="sm" className="flex-1 items-center">
                        <Box
                          className={`h-9 w-9 items-center justify-center rounded-full ${
                            isSelected ? "bg-theme/15" : "bg-muted"
                          }`}
                        >
                          <Icon
                            as={item.icon}
                            size="sm"
                            className={
                              isSelected
                                ? "text-theme"
                                : "text-muted-foreground"
                            }
                          />
                        </Box>
                        <RadioLabel className="flex-1">
                          <VStack>
                            <Text className="text-base font-medium text-foreground">
                              {t(item.labelKey)}
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                              {t(item.subKey)}
                            </Text>
                          </VStack>
                        </RadioLabel>
                      </HStack>
                    </Radio>
                  );
                })}
              </VStack>
            </RadioGroup>
          </FormControl>
        </Card>

        {saveError && (
          <HStack
            space="sm"
            className="items-center rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3"
          >
            <Icon as={AlertCircle} size="sm" className="text-destructive" />
            <Text className="flex-1 text-sm font-medium text-destructive">
              {saveError}
            </Text>
          </HStack>
        )}

        {/* Save */}
        <Button
          size="xl"
          variant="theme"
          onPress={handleSave}
          disabled={isPending}
          accessibilityLabel={t("edit_profile.save_profile")}
          className="gap-2 items-center justify-center mx-4"
        >
          {isPending ? (
            <ButtonSpinner color="white" />
          ) : (
            <ButtonIcon as={Save} size="lg" className="text-white" />
          )}
          <ButtonText>
            {isPending
              ? t("edit_profile.updating")
              : t("edit_profile.save_profile")}
          </ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const bottomInset = useAppBottomInset();

  const user = useAuthStore((state) => state.user);
  const profileId = user?.profileId || "";

  const { data: profileData, isLoading } = useGetProfile(profileId);

  return (
    <KeyboardAvoidingScrollView
      disableTopInset
      showBackButton
      title={t("edit_profile.title")}
      contentContainerStyle={{ paddingBottom: bottomInset + 40 }}
    >
      {isLoading || !profileData ? (
        <EditProfileSkeleton />
      ) : (
        <EditProfileForm profile={profileData.profile} profileId={profileId} />
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default EditProfileScreen;
