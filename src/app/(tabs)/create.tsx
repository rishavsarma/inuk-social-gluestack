import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter, useIsFocused, type Href } from "expo-router";

import { ArrowLeft, Camera, Type, Video, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View, useWindowDimensions } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Box } from "@/components/ui/box";
import {
    Button,
    ButtonIcon,
    ButtonSpinner,
    ButtonText,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import GlassPillBar from "@/components/custom/GlassPillBar";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/stores/auth.store";
import { useSettingStore } from "@/stores/setting.store";

import { CreateDetailsForm } from "@/components/custom/create/CreateDetailsForm";
import { CreateLocationForm } from "@/components/custom/create/CreateLocationForm";
import { CreateModeStage } from "@/components/custom/create/CreateModeStage";
import { CreatePreview } from "@/components/custom/create/CreatePreview";
import { CreateStepProgress } from "@/components/custom/create/CreateStepProgress";
import { useTabBar } from "@/components/custom/bottom-tabs/TabBarContext";

import { useAppInsets } from "@/hooks/useAppInsets";
import { useCreatePostMutation } from "@/hooks/usePosts";
import { ROUTES } from "@/routes";
import {
    POST_CATEGORIES,
    POST_THEME_SWATCHES,
    type CreatePostMode,
} from "@/constants/create-post";

const TOTAL_STEPS = 4;

const MODES: { id: CreatePostMode; labelKey: string; icon: typeof Camera }[] = [
    { id: "photo", labelKey: "create_post.mode_photo", icon: Camera },
    { id: "video", labelKey: "create_post.mode_video", icon: Video },
    { id: "text", labelKey: "create_post.mode_text", icon: Type },
];

function SwitcherItem({
    item,
    isActive,
    isDark,
    onPress,
}: {
    item: typeof MODES[0];
    isActive: boolean;
    isDark: boolean;
    onPress: () => void;
}) {
    const scale = useSharedValue(1);
    const { t } = useTranslation();

    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withTiming(0.92, { duration: 100 });
    };

    const onPressOut = () => {
        scale.value = withTiming(1, { duration: 100 });
    };

    return (
        <Pressable
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress();
            }}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className="h-14 flex-1 items-center justify-center"
        >
            <Animated.View
                style={pressStyle}
                className="items-center justify-center"
            >
                <Icon
                    as={item.icon}
                    className={cn(
                        "h-6 w-6",
                        isActive ? "text-theme" : "text-foreground/60"
                    )}
                />
                <Text
                    size="xs"
                    className={cn(
                        "pt-1 leading-3 tracking-wide",
                        isActive ? "font-bold text-theme" : "font-medium text-foreground/60"
                    )}
                >
                    {t(item.labelKey)}
                </Text>
            </Animated.View>
        </Pressable>
    );
}

const CreateScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const insets = useAppInsets();
    const toast = useToast();
    const { previousTab } = useTabBar();
    const { mutateAsync: createPostWithMedia } = useCreatePostMutation();
    const authUser = useAuthStore((state) => state.user);

    const settingsTheme = useSettingStore((state) => state.theme);
    const isDark = settingsTheme === "dark";
    const { width } = useWindowDimensions();
    const isFocused = useIsFocused();

    const [currentStep, setCurrentStep] = useState(1);
    const [isPosting, setIsPosting] = useState(false);

    const [mode, setMode] = useState<CreatePostMode>("photo");
    const [photos, setPhotos] = useState<string[]>([]);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [videoUris, setVideoUris] = useState<string[]>([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [text, setText] = useState("");

    useEffect(() => {
        setPhotos([]);
        setVideoUri(null);
        setVideoUris([]);
        setMultiSelect(false);
    }, [mode]);

    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [categoryId, setCategoryId] = useState(POST_CATEGORIES[0].id);
    const [subcategoryKey, setSubcategoryKey] = useState<string | null>(
        POST_CATEGORIES[0].subcategoryLabelKeys[0],
    );
    const [theme, setTheme] = useState<(typeof POST_THEME_SWATCHES)[number]["name"]>(
        "blue",
    );
    const [tags, setTags] = useState<string[]>([]);

    const [location, setLocation] = useState("");
    const [selectedLocation, setSelectedLocation] =
        useState<LocationSearchResult | null>(null);

    const [visibility, setVisibility] = useState<PostVisibility>("ALL");

    const STEP_META = useMemo(
        () => ({
            1: {
                title: t("create_post.step_1_title"),
                caption: t("create_post.step_1_caption"),
            },
            2: {
                title: t("create_post.step_2_title"),
                caption: t("create_post.step_2_caption"),
            },
            3: {
                title: t("create_post.step_3_title"),
                caption: t("create_post.step_3_caption"),
            },
            4: {
                title: t("create_post.step_4_title"),
                caption: t("create_post.step_4_caption"),
            },
        }),
        [t],
    );

    const resetForm = useCallback(() => {
        setCurrentStep(1);
        setMode("photo");
        setPhotos([]);
        setVideoUri(null);
        setVideoUris([]);
        setMultiSelect(false);
        setText("");
        setTitle("");
        setCaption("");
        setCategoryId(POST_CATEGORIES[0].id);
        setSubcategoryKey(POST_CATEGORIES[0].subcategoryLabelKeys[0]);
        setTheme("blue");
        setTags([]);
        setLocation("");
        setSelectedLocation(null);
        setVisibility("ALL");
    }, []);

    useEffect(() => {
        if (!isFocused) {
            resetForm();
        }
    }, [isFocused, resetForm]);

    const handleSelectLocation = useCallback((item: LocationSearchResult) => {
        const label = item.breadcrumb ? `${item.name}, ${item.breadcrumb}` : item.name;
        setSelectedLocation(item);
        setLocation(label);
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        router.push((previousTab ?? ROUTES.TABS.FEED) as never);
    }, [router, previousTab]);

    const handleBack = useCallback(() => {
        if (currentStep === 1) {
            handleClose();
            return;
        }
        setCurrentStep((s) => s - 1);
    }, [currentStep, handleClose]);

    const handlePrimary = useCallback(async () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((s) => s + 1);
            return;
        }

        const postType =
            mode === "photo"
                ? photos.length > 1
                    ? "CAROUSEL"
                    : "PHOTO"
                : mode === "video"
                    ? "VIDEO"
                    : "TEXT";

        setIsPosting(true);
        try {
            const { postId, mediaId } = await createPostWithMedia({
                title,
                description: caption,
                categoryId,
                subCategoryId: subcategoryKey,
                locationId: selectedLocation?.id,
                tags,
                visibility,
                postType,
                photos: mode === "photo" ? photos : undefined,
                videoUris:
                    mode === "video"
                        ? videoUris.length > 0
                            ? videoUris
                            : videoUri
                                ? [videoUri]
                                : []
                        : undefined,
            });

            const profileId = authUser?.profileId ?? "";

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <Toast nativeID={`toast-${id}`} action="success" variant="solid">
                        <ToastDescription>{t("create_post.post_success")}</ToastDescription>
                    </Toast>
                ),
            });

            resetForm();
            router.replace(
                `${ROUTES.CONTENT.POST_DETAILS(
                    mediaId,
                    postId,
                )}?id=${mediaId}&profile_id=${profileId}&type=${mode}` as Href,
            );
        } catch (error) {
            if (__DEV__) {
                console.error("Failed to publish post:", error);
            }
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <Toast nativeID={`toast-${id}`} action="error" variant="solid">
                        <ToastDescription>{t("create_post.post_error")}</ToastDescription>
                    </Toast>
                ),
            });
        } finally {
            setIsPosting(false);
        }
    }, [
        currentStep,
        toast,
        t,
        resetForm,
        router,
        mode,
        photos,
        videoUri,
        videoUris,
        title,
        caption,
        categoryId,
        subcategoryKey,
        tags,
        selectedLocation,
        visibility,
        createPostWithMedia,
        authUser,
    ]);

    const selectedThemeSwatch = useMemo(
        () =>
            POST_THEME_SWATCHES.find((sw) => sw.name === theme) ?? POST_THEME_SWATCHES[0],
        [theme],
    );

    const isNextDisabled = useMemo(() => {
        if (currentStep === 1) {
            if (mode === "photo") {
                return photos.length === 0;
            }
            if (mode === "video") {
                return !videoUri && videoUris.length === 0;
            }
            if (mode === "text") {
                const cleanText = text.replace(/<[^>]*>/g, "").trim();
                return cleanText.length === 0;
            }
        }
        if (currentStep === 2) {
            return (
                title.trim().length === 0 ||
                caption.trim().length === 0 ||
                tags.length === 0
            );
        }
        if (currentStep === 3) {
            return !selectedLocation;
        }
        return false;
    }, [currentStep, mode, photos, videoUri, videoUris, text, title, caption, tags, selectedLocation]);

    // Sliding Indicator Logic
    const TAB_BAR_WIDTH = width - 32; // left: 16, right: 16
    const CONTENT_WIDTH = TAB_BAR_WIDTH - 16; // px-2 is 8px padding on each side
    const TAB_WIDTH = CONTENT_WIDTH / 3;

    const indicatorPosition = useSharedValue(0);

    const activeIndex = MODES.findIndex((m) => m.id === mode);
    const safeIndex = activeIndex === -1 ? 0 : activeIndex;

    useEffect(() => {
        indicatorPosition.value = withTiming(safeIndex * TAB_WIDTH, {
            duration: 250,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
    }, [safeIndex, TAB_WIDTH]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorPosition.value }],
    }));

    const meta = STEP_META[currentStep as 1 | 2 | 3 | 4];

    return (
        <VStack
            className="flex-1"
            style={{ paddingTop: insets.top }}
        >
            <HStack className="items-center justify-between px-4 pb-1">
                <Button
                    variant="outline"
                    size="icon"
                    onPress={handleBack}
                    accessibilityRole="button"
                    accessibilityLabel={
                        currentStep === 1
                            ? t("create_post.close_a11y")
                            : t("create_post.back_a11y")

                    }
                    className="rounded-full bg-background h-10 w-10"
                >
                    <ButtonIcon
                        as={currentStep === 1 ? X : ArrowLeft}
                        size="lg"
                        className="text-foreground"
                    />
                </Button>
                <Heading size="lg" className="font-baloo-bold text-foreground">
                    {meta.title}
                </Heading>
                <Button
                    variant="theme"
                    size="lg"
                    className="rounded-full px-4 disabled:bg-theme/40"
                    onPress={handlePrimary}
                    disabled={isPosting || isNextDisabled}
                    accessibilityLabel={
                        currentStep < TOTAL_STEPS
                            ? t("create_post.next")
                            : t("create_post.post")
                    }
                >
                    {isPosting ? <ButtonSpinner /> : null}
                    <ButtonText className="font-baloo-semibold">
                        {isPosting
                            ? t("create_post.posting")
                            : currentStep < TOTAL_STEPS
                                ? t("create_post.next")
                                : t("create_post.post")}
                    </ButtonText>
                </Button>
            </HStack>

            <CreateStepProgress
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                caption={t("create_post.step_of", {
                    current: currentStep,
                    total: TOTAL_STEPS,
                }).concat(` — ${meta.caption}`)}
            />

            {currentStep === 2 ? (
                <CreateDetailsForm
                    title={title}
                    onTitleChange={setTitle}
                    caption={caption}
                    onCaptionChange={setCaption}
                    categoryId={categoryId}
                    onCategoryChange={setCategoryId}
                    subcategoryKey={subcategoryKey}
                    onSubcategoryChange={setSubcategoryKey}
                    theme={theme}
                    onThemeChange={setTheme}
                    tags={tags}
                    onTagsChange={setTags}
                />
            ) : (
                <ScrollView
                    className="flex-1"
                    contentContainerClassName={currentStep === 1 ? "pb-28" : "pb-10"}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {currentStep === 1 ? (
                        <CreateModeStage
                            mode={mode}
                            onModeChange={setMode}
                            photos={photos}
                            onPhotosChange={setPhotos}
                            videoUri={videoUri}
                            onVideoChange={setVideoUri}
                            videoUris={videoUris}
                            onVideoUrisChange={setVideoUris}
                            text={text}
                            onTextChange={setText}
                            multiSelect={multiSelect}
                            onMultiSelectChange={setMultiSelect}
                        />
                    ) : null}

                    {currentStep === 3 ? (
                        <CreateLocationForm
                            location={location}
                            selectedLocation={selectedLocation}
                            onSelectLocation={handleSelectLocation}
                        />
                    ) : null}

                    {currentStep === 4 ? (
                        <CreatePreview
                            mode={mode}
                            photos={photos}
                            videoUri={videoUri}
                            videoUris={videoUris}
                            text={text}
                            caption={caption}
                            categoryId={categoryId}
                            themeDotClassName={selectedThemeSwatch.dotColorClassName}
                            location={location}
                            tags={tags}
                            visibility={visibility}
                            onVisibilityChange={setVisibility}
                        />
                    ) : null}
                </ScrollView>
            )}

            {currentStep === 1 ? (
                <Animated.View
                    pointerEvents="box-none"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    <GlassPillBar isDark={isDark} bottomInset={insets.bottom || 16}>
                        <View className="relative flex-row px-2 py-1">
                            <Animated.View
                                style={[
                                    {
                                        position: "absolute",
                                        top: 4,
                                        bottom: 4,
                                        left: 8,
                                        width: TAB_WIDTH,
                                        borderRadius: 9999,
                                        backgroundColor: isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : "rgba(0,0,0,0.05)",
                                    },
                                    indicatorStyle,
                                ]}
                            />
                            {MODES.map((m, i) => (
                                <SwitcherItem
                                    key={m.id}
                                    item={m}
                                    isActive={i === safeIndex}
                                    isDark={isDark}
                                    onPress={() => setMode(m.id)}
                                />
                            ))}
                        </View>
                    </GlassPillBar>
                </Animated.View>
            ) : null}
        </VStack>
    );
};

export default CreateScreen;
