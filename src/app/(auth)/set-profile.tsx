import { PhotoEditor } from "@/components/custom/PhotoEditor";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Platform, Pressable, useColorScheme, View } from "react-native";
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
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import DateTimePicker from "@react-native-community/datetimepicker";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import {
  ChevronRightIcon,
  CloseIcon,
  EditIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { useSettingStore } from "@/stores/setting.store";

const FILTER_OVERLAYS: Record<string, string> = {
  none: "",
  sepia: "bg-[#e3a857]/20",
  cool: "bg-[#00e1ff]/15",
  warm: "bg-[#ffaa00]/15",
  vintage: "bg-[#ff009d]/10",
};

const FILTERS = [
  { id: "none", nameKey: "auth.filter_none" },
  { id: "sepia", nameKey: "auth.filter_sepia" },
  { id: "cool", nameKey: "auth.filter_cool" },
  { id: "warm", nameKey: "auth.filter_warm" },
  { id: "vintage", nameKey: "auth.filter_vintage" },
];

const SetProfile = () => {
  const bottomInset = useAppBottomInset();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
    countryCode?: string;
    token?: string;
  }>();

  const phone = params.phone || "";
  const countryCode = params.countryCode || "+91";
  const token = params.token || "";

  const { setAuth } = useAuthStore();

  // Core fields
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState<Date | undefined>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // Avatar fields
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFilter, setAvatarFilter] = useState("none");

  // Image Editor state
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editorUri, setEditorUri] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarSheet, setShowAvatarSheet] = useState(false);

  // Field validation states
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { theme, setTheme } = useSettingStore();
  const systemColorScheme = useColorScheme();
  const activeTheme = theme === "system" ? systemColorScheme : theme;
  const isDark = activeTheme === "dark";

  const toggleTheme = () => {
    switchTheme({
      switchThemeFunction: () => {
        setTheme(isDark ? "light" : "dark");
      },
      animationConfig: {
        type: "circular",
        duration: 800,
        startingPoint: {
          cxRatio: 0.9,
          cyRatio: 0.05,
        },
      },
    });
  };

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
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: Platform.OS !== "web",
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(pickerOptions)
        : await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Open Editor Modal with picked image (use local file URI for manipulations)
        setEditorUri(asset.uri);
        setShowEditorModal(true);
      }
    } catch (error) {
      console.warn("Error picking image:", error);
    }
  };

  // Save Callback from custom PhotoEditor
  const handleSaveEditedImage = (editedUri: string, filterId: string) => {
    setAvatarUrl(editedUri);
    setAvatarFilter(filterId);
    setShowEditorModal(false);
  };

  const handleCompleteProfile = async () => {
    setUsernameError(null);
    setEmailError(null);
    setDobError(null);
    setLocationError(null);

    const cleanedUsername = username.trim().toLowerCase();
    const cleanedEmail = email.trim();
    const cleanedName = name.trim();
    const cleanedBio = bio.trim();
    const cleanedLocation = location.trim();
    const cleanedReferral = referralCode.trim();

    let hasError = false;

    // Validate Username
    const usernameRegex = /^[a-z0-9_]{3,}$/;
    if (!cleanedUsername) {
      setUsernameError(t("auth.username_error_invalid"));
      hasError = true;
    } else if (!usernameRegex.test(cleanedUsername)) {
      setUsernameError(t("auth.username_error_invalid"));
      hasError = true;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanedEmail) {
      setEmailError(t("auth.email_error_invalid"));
      hasError = true;
    } else if (!emailRegex.test(cleanedEmail)) {
      setEmailError(t("auth.email_error_invalid"));
      hasError = true;
    }

    // Validate DOB
    if (!dob) {
      setDobError(t("auth.dob_error_required"));
      hasError = true;
    }

    // Validate Location
    if (!cleanedLocation) {
      setLocationError(t("auth.location_error_required"));
      hasError = true;
    }

    // if (hasError) return;

    setIsLoading(true);
    setTimeout(() => {
      router.push({
        pathname: ROUTES.AUTH.PASSWORD_LOGIN,
        params: { phone, countryCode },
      });
      setIsLoading(false);
    }, 2000);

    // setIsLoading(true);
    // try {
    //   const response = await authService.setProfile(
    //     {
    //       username: cleanedUsername,
    //       email: cleanedEmail,
    //       name: cleanedName || undefined,
    //       bio: cleanedBio || undefined,
    //       avatarUrl: avatarUrl || undefined,
    //       dob: dob ? dob.toISOString().split("T")[0] : undefined,
    //       location: cleanedLocation,
    //       referralCode: cleanedReferral || undefined,
    //       avatarFilter: avatarFilter !== "none" ? avatarFilter : undefined,
    //     },
    //     token,
    //   );

    //   // Save details to auth store
    //   setAuth(response.user, token);

    // Redirect to Tabs Flow
    // router.replace(ROUTES.TABS.FEED);
    // } catch (err: any) {
    //   setUsernameError(err.message || t("auth.username_error_invalid"));
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <KeyboardAvoidingScrollView>
      <VStack className="flex-1 justify-end bg-background relative">
        {/* Form Card */}
        <Card
          className="px-4 bg-card pt-8 shadow-none border-0 rounded-none"
          style={{ paddingBottom: bottomInset + 20 }}
        >
          {/* Title Section */}
          {/* <VStack className="items-center justify-center px-6 pb-4" space="xs">
            <Heading
              size="2xl"
              className="font-extrabold tracking-wider text-foreground"
            >
              {t("auth.set_profile_title")}
            </Heading>
            <Text className="text-sm text-muted-foreground text-center">
              {t("auth.set_profile_subtitle")}
            </Text>
          </VStack> */}
          <VStack space="lg">
            {/* Avatar Picker Section */}
            {/* <VStack className="items-center justify-center py-2">
              <Pressable
                onPress={() => setShowAvatarSheet(true)}
                className="relative"
              >
                <Avatar className="w-24 h-24 rounded-full bg-secondary justify-center items-center border border-border overflow-hidden relative">
                  {avatarUrl ? (
                    <>
                      <Image
                        source={{ uri: avatarUrl }}
                        className="w-full h-full rounded-full"
                      />
                      {avatarFilter !== "none" && (
                        <Box
                          className={`absolute inset-0 ${FILTER_OVERLAYS[avatarFilter]} pointer-events-none rounded-full`}
                        />
                      )}
                    </>
                  ) : (
                    <VStack className="items-center justify-center w-full h-full">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </VStack>
                  )}
                </Avatar>
                <Box className="absolute right-0 bottom-0 bg-primary p-2 rounded-full border-2 border-background shadow-lg">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </Box>
              </Pressable>
              <Text className="text-xs text-muted-foreground mt-2 font-medium">
                {t("auth.avatar_picker_label")}
              </Text>
            </VStack> */}

            {/* Username Input */}
            <FormControl
              isInvalid={!!usernameError}
              isDisabled={isLoading}
              className="w-full"
            >
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.username_label")}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={t("auth.username_placeholder")}
                    value={username}
                    onChangeText={(val) => {
                      setUsername(val);
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

            {/* Full Name Input */}
            <FormControl isDisabled={isLoading} className="w-full">
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.name_label")}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder={t("auth.name_placeholder")}
                    value={name}
                    onChangeText={setName}
                    className="text-base text-foreground"
                  />
                </Input>
              </VStack>
            </FormControl>

            {/* Date of Birth Input */}
            <FormControl
              isInvalid={!!dobError}
              isDisabled={isLoading}
              className="w-full"
            >
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.dob_label")}
                  </FormControlLabelText>
                </FormControlLabel>
                <Pressable onPress={() => setShowDatePicker(true)}>
                  <Input pointerEvents="none">
                    <InputField
                      value={dob ? dob.toISOString().split("T")[0] : ""}
                      editable={false}
                      placeholder={t("auth.dob_placeholder")}
                      className="text-base text-foreground py-2 leading-normal"
                    />
                  </Input>
                </Pressable>
                {Platform.OS === "android" && showDatePicker && (
                  <DateTimePicker
                    value={dob || new Date()}
                    mode="date"
                    display="default"
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
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <Pressable
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                        onPress={() => setShowDatePicker(false)}
                      />
                      <View className="bg-zinc-900 rounded-t-2xl p-4 pb-8 border-t border-zinc-800">
                        <HStack className="justify-between items-center mb-4">
                          <Pressable onPress={() => setShowDatePicker(false)}>
                            <Text className="text-indigo-500 font-semibold text-base">
                              {t("auth.cancel")}
                            </Text>
                          </Pressable>
                          <Text className="text-white font-bold text-base">
                            {t("auth.dob_label")}
                          </Text>
                          <Pressable
                            onPress={() => {
                              setShowDatePicker(false);
                            }}
                          >
                            <Text className="text-indigo-500 font-semibold text-base">
                              {t("auth.save")}
                            </Text>
                          </Pressable>
                        </HStack>
                        <DateTimePicker
                          value={dob || new Date()}
                          mode="date"
                          display="spinner"
                          themeVariant="dark"
                          textColor="#ffffff"
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

            {/* Location Input */}
            <FormControl
              isInvalid={!!locationError}
              isDisabled={isLoading}
              className="w-full"
            >
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.location_label")}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder={t("auth.location_placeholder")}
                    value={location}
                    onChangeText={(val) => {
                      setLocation(val);
                      if (locationError) setLocationError(null);
                    }}
                    className="text-base text-foreground"
                  />
                </Input>
                {locationError && (
                  <FormControlError>
                    <FormControlErrorText>{locationError}</FormControlErrorText>
                  </FormControlError>
                )}
              </VStack>
            </FormControl>

            {/* Referral Code Input */}
            <FormControl isDisabled={isLoading} className="w-full">
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.referral_code_label")}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    autoCapitalize="characters"
                    placeholder={t("auth.referral_code_placeholder")}
                    value={referralCode}
                    onChangeText={setReferralCode}
                    className="text-base text-foreground"
                  />
                </Input>
              </VStack>
            </FormControl>

            {/* Complete Profile Button */}
            <Button
              size="xl"
              variant="theme"
              onPress={handleCompleteProfile}
              disabled={isLoading}
              className="gap-1"
            >
              <ButtonText>{t("auth.complete_profile_button")}</ButtonText>
              {isPending ? (
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
              >
                <ButtonIcon as={ArrowLeft} />
                <ButtonText className="">{t("auth.back_to_login")}</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>

      {/* Avatar Picker Actionsheet */}
      <Actionsheet
        isOpen={showAvatarSheet}
        onClose={() => setShowAvatarSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-card">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onPress={() => setShowAvatarSheet(false)}
          >
            <ButtonIcon
              as={CloseIcon}
              size="lg"
              className="stroke-background-500"
            />
          </Button>

          <VStack className="w-full pb-20" space="sm">
            <ActionsheetItem>
              <ActionsheetIcon
                className="stroke-background-700"
                as={EditIcon}
              />
              <ActionsheetItemText>
                {" "}
                {t("auth.avatar_picker_camera")}
              </ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem>
              <ActionsheetIcon
                className="stroke-background-700"
                as={EyeOffIcon}
              />
              <ActionsheetItemText>
                {" "}
                {t("auth.avatar_picker_gallery")}
              </ActionsheetItemText>
            </ActionsheetItem>
            {/* <ActionsheetItem onPress={() => handleImagePickerResponse(true)}>
              <ActionsheetItemText>
                {t("auth.avatar_picker_camera")}
              </ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={() => handleImagePickerResponse(false)}>
              <ActionsheetItemText>
                {t("auth.avatar_picker_gallery")}
              </ActionsheetItemText>
            </ActionsheetItem> */}
          </VStack>
        </ActionsheetContent>
      </Actionsheet>

      {/* Feature-Rich Custom Photo Editor */}
      <PhotoEditor
        visible={showEditorModal}
        imageUri={editorUri}
        initialFilter="none"
        onClose={() => setShowEditorModal(false)}
        onSave={handleSaveEditedImage}
      />
    </KeyboardAvoidingScrollView>
  );
};

export default SetProfile;
