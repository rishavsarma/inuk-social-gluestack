import React, { useCallback } from "react";

import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useAppBottomInset, useAppTopInset } from "@/hooks/useAppInsets";

import { useTabBar } from "./BottomTabs/TabBarContext";
import { UiHeader } from "./UiHeader";

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

/** Props a virtualized list (e.g. FlashList) should spread onto itself so its
 * scroll events drive the same header-fade / tab-bar-hide tracking that
 * `variant="scroll"` handles internally. Plain JS callbacks, not a
 * `useAnimatedScrollHandler` handler — FlashList v2 invokes `onScroll` as a
 * regular function internally rather than wiring it through Reanimated's
 * native-event system, so a worklet handler object isn't callable there. */
export interface KeyboardAvoidingListScrollProps {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onMomentumScrollEnd: (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => void;
  scrollEventThrottle: number;
}

/** Passed to `children` when `variant="list"`, so the caller can wire its own
 * virtualized list (e.g. FlashList) up to the same header-fade / tab-bar-hide
 * scroll tracking that `variant="scroll"` handles internally. */
export interface KeyboardAvoidingListRenderProps {
  scrollProps: KeyboardAvoidingListScrollProps;
  scrollY: SharedValue<number>;
  topInset: number;
}

export interface KeyboardAvoidingScrollViewProps extends Omit<
  ScrollViewProps,
  "contentContainerStyle" | "children"
> {
  children:
    | React.ReactNode
    | ((props: KeyboardAvoidingListRenderProps) => React.ReactNode);
  contentContainerStyle?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  disableTopInset?: boolean;
  keyboardMode?: "insets" | "layout";
  disableTabBarHide?: boolean;
  title?: string;
  showBackButton?: boolean;
  backAction?: "back" | "home" | (string & {});
  /**
   * "scroll" (default) renders a `KeyboardAwareScrollView` that owns scrolling itself.
   * "list" renders a non-scrolling, keyboard-avoiding container instead and hands
   * `{ scrollHandler, scrollY, topInset }` to `children` (which must then be a
   * render function) so a virtualized list can own scrolling/virtualization directly
   * — required for FlashList, since nesting it inside a ScrollView either disables
   * virtualization (`scrollEnabled={false}`) or produces unsupported nested scrollables.
   */
  variant?: "scroll" | "list";
}

export const ScrollYContext = React.createContext<SharedValue<number> | null>(
  null,
);

export const useKeyboardAvoidingScrollViewScrollY = () => {
  const context = React.useContext(ScrollYContext);
  return context;
};

export const KeyboardAvoidingScrollView: React.FC<KeyboardAvoidingScrollViewProps> =
  React.memo(
    ({
      children,
      contentContainerStyle,
      innerStyle,
      disableTopInset = false,
      keyboardMode = "layout",
      keyboardShouldPersistTaps = "handled",
      keyboardDismissMode = "interactive",
      showsVerticalScrollIndicator = false,
      disableTabBarHide = false,
      title = "",
      showBackButton = true,
      backAction = "back",
      refreshControl,
      variant = "scroll",
      ...rest
    }) => {
      const topInset = useAppTopInset();
      const bottomInset = useAppBottomInset();
      const { tabBarTranslateY, isInsideTabBar } = useTabBar();

      const scrollY = useSharedValue(0);
      const lastY = useSharedValue(0);

      const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
          const currentY = event.contentOffset.y;
          scrollY.value = currentY;

          if (isInsideTabBar && tabBarTranslateY && !disableTabBarHide) {
            const diff = currentY - lastY.value;
            const config = { duration: 250, easing: Easing.out(Easing.cubic) };
            if (currentY < 80) {
              tabBarTranslateY.set(withTiming(0, config));
            } else if (diff > 5) {
              tabBarTranslateY.set(withTiming(120, config));
            } else if (diff < -10) {
              tabBarTranslateY.set(withTiming(0, config));
            }
          }
          lastY.value = currentY;
        },
        onEndDrag: () => {
          if (isInsideTabBar && tabBarTranslateY && !disableTabBarHide) {
            tabBarTranslateY.set(
              withTiming(0, {
                duration: 250,
                easing: Easing.out(Easing.cubic),
              }),
            );
          }
        },
        onMomentumEnd: () => {
          if (isInsideTabBar && tabBarTranslateY && !disableTabBarHide) {
            tabBarTranslateY.set(
              withTiming(0, {
                duration: 250,
                easing: Easing.out(Easing.cubic),
              }),
            );
          }
        },
      });

      const clonedRefreshControl = refreshControl
        ? React.cloneElement(refreshControl as React.ReactElement<any>, {
            progressViewOffset:
              (refreshControl as React.ReactElement<any>).props
                .progressViewOffset ?? (disableTopInset ? 40 : topInset + 20),
          })
        : undefined;

      const settleTabBar = useCallback(() => {
        if (isInsideTabBar && tabBarTranslateY && !disableTabBarHide) {
          tabBarTranslateY.set(
            withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) }),
          );
        }
      }, [isInsideTabBar, tabBarTranslateY, disableTabBarHide]);

      const handleListScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          const currentY = event.nativeEvent.contentOffset.y;
          scrollY.value = currentY;

          if (isInsideTabBar && tabBarTranslateY && !disableTabBarHide) {
            const diff = currentY - lastY.value;
            const config = { duration: 250, easing: Easing.out(Easing.cubic) };
            if (currentY < 80) {
              tabBarTranslateY.set(withTiming(0, config));
            } else if (diff > 5) {
              tabBarTranslateY.set(withTiming(120, config));
            } else if (diff < -10) {
              tabBarTranslateY.set(withTiming(0, config));
            }
          }
          lastY.value = currentY;
        },
        [isInsideTabBar, tabBarTranslateY, disableTabBarHide, scrollY, lastY],
      );

      if (variant === "list") {
        const renderListChildren = children as (
          props: KeyboardAvoidingListRenderProps,
        ) => React.ReactNode;

        return (
          <View style={{ flex: 1 }} className="bg-background">
            <UiHeader
              scrollY={scrollY}
              topInset={topInset}
              title={title}
              showBackButton={showBackButton}
              backAction={backAction}
              hideBorder
            />
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={bottomInset}
              style={{ flex: 1 }}
            >
              <ScrollYContext.Provider value={scrollY}>
                {renderListChildren({
                  scrollProps: {
                    onScroll: handleListScroll,
                    onScrollEndDrag: settleTabBar,
                    onMomentumScrollEnd: settleTabBar,
                    scrollEventThrottle: 16,
                  },
                  scrollY,
                  topInset: disableTopInset ? 0 : topInset,
                })}
              </ScrollYContext.Provider>
            </KeyboardAvoidingView>
          </View>
        );
      }

      return (
        <View style={{ flex: 1 }} className="bg-background">
          <UiHeader
            scrollY={scrollY}
            topInset={topInset}
            title={title}
            showBackButton={showBackButton}
            backAction={backAction}
            hideBorder
          />
          <AnimatedKeyboardAwareScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            mode={keyboardMode}
            disableScrollOnKeyboardHide
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            keyboardDismissMode={keyboardDismissMode}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            bottomOffset={bottomInset}
            refreshControl={clonedRefreshControl}
            {...rest}
            contentContainerStyle={[
              {
                flexGrow: 1,
                paddingTop: disableTopInset ? 0 : topInset,
              },
              contentContainerStyle,
            ]}
          >
            <ScrollYContext.Provider value={scrollY}>
              {children as React.ReactNode}
            </ScrollYContext.Provider>
          </AnimatedKeyboardAwareScrollView>
        </View>
      );
    },
  );

KeyboardAvoidingScrollView.displayName = "KeyboardAvoidingScrollView";
