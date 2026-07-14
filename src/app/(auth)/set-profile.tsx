import ExpoImageCropTool from "@bsky.app/expo-image-crop-tool";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Calendar,
  Camera,
  MapPin,
  User,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Platform, Pressable, View } from "react-native";
import switchTheme from "react-native-theme-switch-animation";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
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
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import DateTimePicker from "@react-native-community/datetimepicker";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  CloseIcon,
  EditIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { useSearchLocations } from "@/hooks/useLocation";
import { useValidateUsername, useSetProfileDetails } from "@/hooks/useAuth";
import { ROUTES } from "@/routes";
import { THEME_RGB } from "@/constants";
import { useSettingStore } from "@/stores/setting.store";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useUpload } from "@/hooks/useUpload";
import Logo from "@/components/custom/Logo";
import { buildUsernameSuggestions } from "@/utils/username";
import { Badge, BadgeText } from "@/components/ui/badge";
import { differenceInYears, format, subYears } from "date-fns";

const AVATAR_SIZE = 512;
const MIN_AGE_YEARS = 13;

const SetProfile = () => {
  const bottomInset = useAppBottomInset();
  const { t } = useTranslation();
  const router = useRouter();
  const { referredBy } = useLocalSearchParams<{ referredBy?: string }>();
  const { uploadMedia } = useUpload();
  const isDark = useSettingStore((state) => state.theme === "dark");

  useEffect(() => {
    if (!referredBy) {
      router.replace(ROUTES.AUTH.SET_REFERRAL);
    }
  }, [referredBy]);

  // Core fields
  const [username, setUsername] = useState("");
  const [usernameManuallyEdited, setUsernameManuallyEdited] = useState(false);
  const [name, setName] = useState("");
  const maxDob = useMemo(() => subYears(new Date(), MIN_AGE_YEARS), []);
  const [dob, setDob] = useState<Date>(maxDob);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSearchResult | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [debouncedLocationQuery, setDebouncedLocationQuery] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const usernameSuggestions = useMemo(
    () => buildUsernameSuggestions(name),
    [name],
  );

  const handleNameChange = (val: string) => {
    setName(val);
    if (!usernameManuallyEdited) {
      const [firstSuggestion] = buildUsernameSuggestions(val);
      setUsername(firstSuggestion ?? "");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedUsername(username.trim().toLowerCase()),
      400,
    );
    return () => clearTimeout(timeout);
  }, [username]);

  const { data: usernameValidation, isFetching: isCheckingUsername } =
    useValidateUsername(debouncedUsername);

  const isUsernameAvailable = usernameValidation?.status === "AVAILABLE";
  const isUsernameUnavailable = usernameValidation?.status === "UNAVAILABLE";

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedLocationQuery(locationQuery),
      300,
    );
    return () => clearTimeout(timeout);
  }, [locationQuery]);

  const { data: locationSuggestions, isFetching: isLocationSearchLoading } =
    useSearchLocations(debouncedLocationQuery);

  const locationLabel = selectedLocation
    ? selectedLocation.breadcrumb
      ? `${selectedLocation.name}, ${selectedLocation.breadcrumb}`
      : selectedLocation.name
    : "";

  const handleSelectLocation = (item: LocationSearchResult) => {
    setSelectedLocation(item);
    setLocationQuery("");
    if (locationError) setLocationError(null);
  };

  // Avatar fields
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [showAvatarSheet, setShowAvatarSheet] = useState(false);

  // Field validation states
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleImagePickerResponse = async (useCamera: boolean) => {
    setShowAvatarSheet(false);

    // Brief delay to allow the Actionsheet to fully dismiss
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        return;
      }

      const pickerOptions: ImagePicker.ImagePickerOptions = {
        quality: 1,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(pickerOptions)
        : await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];

      setIsProcessingAvatar(true);
      try {
        const cropped = await ExpoImageCropTool.openCropperAsync({
          imageUri: asset.uri,
          shape: "rectangle",
          aspectRatio: 1,
          rotationEnabled: true,
          format: "jpeg",
          compressImageQuality: 0.9,
        });

        const final = await manipulateAsync(
          cropped.path,
          [{ resize: { width: AVATAR_SIZE, height: AVATAR_SIZE } }],
          { compress: 0.85, format: SaveFormat.JPEG },
        );
        setAvatarUrl(final.uri);
        if (avatarError) setAvatarError(null);
      } catch (error) {
        // User cancelled the native cropper — nothing to do.
        console.warn("Avatar crop cancelled or failed:", error);
      } finally {
        setIsProcessingAvatar(false);
      }
    } catch (error) {
      console.warn("Error picking image:", error);
    }
  };

  const { isPending, mutateAsync: setProfileDetails } = useSetProfileDetails();

  const handleCompleteProfile = async () => {
    setAvatarError(null);
    setNameError(null);
    setUsernameError(null);
    setDobError(null);
    setLocationError(null);

    const cleanedUsername = username.trim().toLowerCase();
    const cleanedName = name.trim();
    const cleanedLocation = selectedLocation?.id;

    let hasError = false;

    // Validate Avatar
    if (!avatarUrl) {
      setAvatarError(t("auth.avatar_error_required"));
      hasError = true;
    }

    // Validate Name
    if (!cleanedName) {
      setNameError(t("auth.name_error_required"));
      hasError = true;
    }

    // Validate Username
    const usernameRegex = /^[a-z0-9_]{3,}$/;
    if (!cleanedUsername) {
      setUsernameError(t("auth.username_error_invalid"));
      hasError = true;
    } else if (!usernameRegex.test(cleanedUsername)) {
      setUsernameError(t("auth.username_error_invalid"));
      hasError = true;
    }

    // Validate DOB
    if (!dob) {
      setDobError(t("auth.dob_error_required"));
      hasError = true;
    } else if (differenceInYears(new Date(), dob) < MIN_AGE_YEARS) {
      setDobError(t("auth.dob_error_min_age", { age: MIN_AGE_YEARS }));
      hasError = true;
    }

    // Validate Location
    if (!cleanedLocation) {
      setLocationError(t("auth.location_error_required"));
      hasError = true;
    }

    if (hasError) return;
    if (!avatarUrl || !cleanedLocation) return;

    setIsUploadingAvatar(true);
    let avatarMediaId: string;
    try {
      const fileName = `avatar-${Date.now()}.jpg`;
      avatarMediaId = await uploadMedia({
        fileUri: avatarUrl,
        fileName,
        mediaType: "AVATAR",
        visibility: "ALL",
      });
    } catch (error) {
      console.warn("Avatar upload failed:", error);
      setAvatarError(t("auth.avatar_upload_error"));
      setIsUploadingAvatar(false);
      return;
    }
    setIsUploadingAvatar(false);

    const payload = {
      avatar: avatarMediaId,
      givenName: cleanedName,
      username: cleanedUsername,
      dob: dob.toISOString().split("T")[0],
      location: cleanedLocation,
      referredBy: referredBy ?? "",
    };

    setProfileDetails(payload, {
      onSuccess: () => {
        router.replace(ROUTES.AUTH.HOME);
      },
    });
  };

  return (
    <>
      <KeyboardAvoidingScrollView>
        <VStack className="flex-1 justify-end">
          {/* Form Card */}
          {/* <VStack
          className="flex-1 items-center justify-center px-6 py-12"
          space="md"
        >
          <Logo size={40} />
        </VStack> */}
          <Card
            className="px-4 bg-card pt-8 shadow-none border-0 rounded-none rounded-t-4xl"
            style={{ paddingBottom: bottomInset + 20 }}
          >
            {/* Title Section */}
            <VStack space="lg">
              {/* Avatar Picker Section */}
              <VStack className="items-center justify-center py-2" space="xs">
                <Pressable
                  onPress={() => setShowAvatarSheet(true)}
                  disabled={isProcessingAvatar}
                  accessibilityRole="button"
                  accessibilityLabel={t("auth.avatar_picker_label")}
                  className="relative"
                >
                  <Avatar
                    className={`w-32 h-32 rounded-full bg-secondary border ${
                      avatarError ? "border-destructive" : "border-border"
                    }`}
                  >
                    {avatarUrl ? (
                      <AvatarImage source={{ uri: avatarUrl }} />
                    ) : (
                      <Icon
                        as={User}
                        className="w-10 h-10 text-muted-foreground"
                      />
                    )}
                  </Avatar>
                  <Box className="absolute right-0 bottom-0 bg-primary p-2 rounded-full border-2 border-background shadow-lg">
                    {isProcessingAvatar ? (
                      <Spinner
                        size="small"
                        className="text-primary-foreground"
                      />
                    ) : (
                      <Icon
                        as={Camera}
                        className="w-4 h-4 text-primary-foreground"
                      />
                    )}
                  </Box>
                </Pressable>
                <Text className="text-xs text-muted-foreground font-medium">
                  {t("auth.avatar_picker_label")}
                </Text>
                {avatarError && (
                  <Text className="text-xs text-destructive">
                    {avatarError}
                  </Text>
                )}
              </VStack>

              {/* Full Name Input */}
              <FormControl
                isInvalid={!!nameError}
                isDisabled={isPending}
                className="w-full"
              >
                <VStack space="xs">
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm font-semibold">
                      {t("auth.name_label")}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputSlot className="">
                      <InputIcon as={User} className="text-muted-foreground" />
                    </InputSlot>
                    <InputField
                      placeholder={t("auth.name_placeholder")}
                      value={name}
                      onChangeText={(val) => {
                        handleNameChange(val);
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

              {/* Username Input */}
              <FormControl
                isInvalid={!!usernameError}
                isDisabled={isPending}
                className="w-full"
              >
                <VStack space="xs">
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm font-semibold">
                      {t("auth.username_label")}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputSlot className="">
                      <InputIcon
                        as={AtSign}
                        className="text-muted-foreground"
                      />
                    </InputSlot>
                    <InputField
                      autoCorrect={false}
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder={t("auth.username_placeholder")}
                      value={username}
                      onChangeText={(val) => {
                        setUsername(val.replace(/\s/g, ""));
                        setUsernameManuallyEdited(true);
                        if (usernameError) setUsernameError(null);
                      }}
                      className="text-base text-foreground leading-none"
                    />
                    {isCheckingUsername ? (
                      <InputSlot className="pr-3">
                        <Spinner size="small" />
                      </InputSlot>
                    ) : isUsernameAvailable ? (
                      <InputSlot className="pr-3">
                        <InputIcon
                          as={CheckCircleIcon}
                          className="text-green-600"
                        />
                      </InputSlot>
                    ) : isUsernameUnavailable ? (
                      <InputSlot className="pr-3">
                        <InputIcon
                          as={CloseCircleIcon}
                          className="text-destructive"
                        />
                      </InputSlot>
                    ) : null}
                  </Input>
                  {usernameSuggestions.length > 0 && (
                    <HStack space="xs" className="flex-wrap items-center">
                      {/* <Text className="text-xs text-muted-foreground">
                      {t("auth.username_suggestions_label")}
                    </Text> */}
                      {usernameSuggestions.map((suggestion) => (
                        <Pressable
                          key={suggestion}
                          accessibilityRole="button"
                          accessibilityLabel={suggestion}
                          onPress={() => {
                            setUsername(suggestion);
                            setUsernameManuallyEdited(true);
                            if (usernameError) setUsernameError(null);
                          }}
                          className={`px-2.5 py-1 rounded-full border ${
                            username === suggestion
                              ? "bg-primary border-primary"
                              : "bg-secondary border-border"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              username === suggestion
                                ? "text-primary-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {suggestion}
                          </Text>
                        </Pressable>
                      ))}
                    </HStack>
                  )}
                  {debouncedUsername.length >= 3 &&
                    debouncedUsername === username.trim().toLowerCase() && (
                      <>
                        {isUsernameUnavailable && (
                          <Text className="text-xs text-destructive">
                            {usernameValidation?.message ??
                              t("auth.username_unavailable")}
                          </Text>
                        )}
                      </>
                    )}
                  <FormControlHelper>
                    <FormControlHelperText>
                      {t("auth.username_helper")}
                    </FormControlHelperText>
                  </FormControlHelper>
                  {usernameError && (
                    <FormControlError>
                      <FormControlErrorText>
                        {usernameError}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </VStack>
              </FormControl>

              {/* Location Input */}
              <FormControl
                isInvalid={!!locationError}
                isDisabled={isPending}
                className="w-full"
              >
                <VStack space="xs">
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm font-semibold">
                      {t("auth.location_label")}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    selectedValue={selectedLocation?.id ?? ""}
                    onValueChange={(val) => {
                      const location = locationSuggestions?.find(
                        (item) => item.id === val,
                      );

                      if (location) handleSelectLocation(location);
                    }}
                  >
                    <SelectTrigger
                      variant="outline"
                      size="xl"
                      className="gap-0"
                    >
                      <SelectIcon
                        as={MapPin}
                        size="md"
                        className="ml-3 text-muted-foreground"
                      />
                      <SelectInput
                        value={locationLabel}
                        placeholder={t("auth.location_placeholder")}
                        className="flex-1 pl-3 text-base text-foreground pointer-events-none"
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
                                placeholder={t(
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
                                const location = item as LocationSearchResult;
                                return (
                                  <Box
                                    key={location.id}
                                    className="relative w-full bg-card mb-1"
                                  >
                                    <SelectItem
                                      label=""
                                      value={location.id}
                                      className="min-h-16 py-3"
                                    />
                                    <Box
                                      pointerEvents="none"
                                      className="absolute inset-0 flex-row items-center justify-between px-3"
                                    >
                                      <VStack
                                        space="xs"
                                        className="flex-1 pr-2"
                                      >
                                        <Text
                                          numberOfLines={1}
                                          className="text-sm font-medium text-foreground"
                                        >
                                          {location.name}
                                        </Text>
                                        {!!location.breadcrumb && (
                                          <Text
                                            numberOfLines={1}
                                            className="text-xs text-muted-foreground"
                                          >
                                            {location.breadcrumb}
                                          </Text>
                                        )}
                                      </VStack>
                                      {!!location.settlementClass && (
                                        <Badge
                                          variant="outline"
                                          className="rounded-full"
                                        >
                                          <BadgeText className="capitalize text-xs text-center">
                                            {location.settlementClass}
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
                  {locationError && (
                    <FormControlError>
                      <FormControlErrorText>
                        {locationError}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </VStack>
              </FormControl>

              {/* Date of Birth Input */}
              <FormControl
                isInvalid={!!dobError}
                isDisabled={isPending}
                className="w-full"
              >
                <VStack space="xs">
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm font-semibold">
                      {t("auth.dob_label")}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    accessibilityRole="button"
                    accessibilityLabel={t("auth.dob_label")}
                  >
                    <Input pointerEvents="none">
                      <InputSlot className="">
                        <InputIcon
                          as={Calendar}
                          className="text-muted-foreground"
                        />
                      </InputSlot>
                      <InputField
                        value={dob ? format(dob, "dd-MM-yyyy") : ""}
                        editable={false}
                        placeholder={t("auth.dob_placeholder")}
                        className="text-base text-foreground py-2 leading-normal"
                      />
                    </Input>
                  </Pressable>
                  {Platform.OS === "android" && showDatePicker && (
                    <DateTimePicker
                      value={dob || maxDob}
                      mode="date"
                      display="default"
                      maximumDate={maxDob}
                      onChange={(event: any, date?: Date) => {
                        setShowDatePicker(false);
                        if (date) {
                          setDob(date);
                          if (dobError) setDobError(null);
                        }
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
                      <View className="flex-1 justify-end bg-black/50">
                        <Pressable
                          className="absolute inset-0"
                          onPress={() => setShowDatePicker(false)}
                          accessibilityRole="button"
                          accessibilityLabel={t("auth.cancel")}
                        />
                        <View className="bg-card rounded-t-2xl p-4 pb-8 border-t border-border">
                          <HStack className="justify-between items-center mb-4">
                            <Pressable
                              onPress={() => setShowDatePicker(false)}
                              accessibilityRole="button"
                              accessibilityLabel={t("auth.cancel")}
                            >
                              <Text className="text-theme font-semibold text-base">
                                {t("auth.cancel")}
                              </Text>
                            </Pressable>
                            <Text className="text-foreground font-bold text-base">
                              {t("auth.dob_label")}
                            </Text>
                            <Pressable
                              onPress={() => {
                                setShowDatePicker(false);
                              }}
                              accessibilityRole="button"
                              accessibilityLabel={t("auth.save")}
                            >
                              <Text className="text-theme font-semibold text-base">
                                {t("auth.save")}
                              </Text>
                            </Pressable>
                          </HStack>
                          <DateTimePicker
                            value={dob || maxDob}
                            mode="date"
                            display="spinner"
                            themeVariant={isDark ? "dark" : "light"}
                            textColor={
                              isDark
                                ? THEME_RGB.dark.foreground
                                : THEME_RGB.light.foreground
                            }
                            maximumDate={maxDob}
                            style={{ height: 216 }}
                            onChange={(event: any, date?: Date) => {
                              if (date) {
                                setDob(date);
                                if (dobError) setDobError(null);
                              }
                            }}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}
                  {dobError && (
                    <FormControlError>
                      <FormControlErrorText>{dobError}</FormControlErrorText>
                    </FormControlError>
                  )}
                </VStack>
              </FormControl>

              {/* Complete Profile Button */}
              <Button
                size="xl"
                variant="theme"
                onPress={handleCompleteProfile}
                disabled={isPending || isProcessingAvatar || isUploadingAvatar}
                className="gap-1"
                accessibilityRole="button"
                accessibilityLabel={t("auth.complete_profile_button")}
              >
                <ButtonText>{t("auth.complete_profile_button")}</ButtonText>
                {isPending || isUploadingAvatar ? (
                  <ButtonSpinner color={"white"} />
                ) : (
                  <Icon as={ChevronRightIcon} className="text-white stroke-2" />
                )}
              </Button>
              {/* Timer and Resend Actions */}
              <HStack space="xs" className="justify-between items-center">
                <Button
                  variant="link"
                  size="default"
                  onPress={() => router.replace(ROUTES.AUTH.HOME)}
                  className="p-0"
                  accessibilityRole="button"
                  accessibilityLabel={t("auth.back_to_login")}
                >
                  <ButtonIcon as={ArrowLeft} />
                  <ButtonText className="">
                    {t("auth.back_to_login")}
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Card>
        </VStack>

        {/* Avatar Picker Actionsheet */}
        <Actionsheet
          snapPoints={[25]}
          isOpen={showAvatarSheet}
          onClose={() => setShowAvatarSheet(false)}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent className="bg-card">
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator className="bg-primary mb-2" />
            </ActionsheetDragIndicatorWrapper>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onPress={() => setShowAvatarSheet(false)}
              accessibilityRole="button"
              accessibilityLabel={t("auth.cancel")}
            >
              <ButtonIcon
                as={CloseIcon}
                size="lg"
                className="stroke-background-500"
              />
            </Button>

            <VStack className="w-full" space="sm">
              <ActionsheetItem onPress={() => handleImagePickerResponse(true)}>
                <ActionsheetIcon
                  className="stroke-background-700"
                  as={EditIcon}
                />
                <ActionsheetItemText>
                  {" "}
                  {t("auth.avatar_picker_camera")}
                </ActionsheetItemText>
              </ActionsheetItem>
              <ActionsheetItem onPress={() => handleImagePickerResponse(false)}>
                <ActionsheetIcon
                  className="stroke-background-700"
                  as={EyeOffIcon}
                />
                <ActionsheetItemText>
                  {" "}
                  {t("auth.avatar_picker_gallery")}
                </ActionsheetItemText>
              </ActionsheetItem>
            </VStack>
          </ActionsheetContent>
        </Actionsheet>
      </KeyboardAvoidingScrollView>
    </>
  );
};

export default SetProfile;
