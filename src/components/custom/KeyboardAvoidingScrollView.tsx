import React from "react";

import { ScrollViewProps, StyleProp, View, ViewStyle } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useAppBottomInset, useAppTopInset } from "@/hooks/use-app-insets";

import { useTabBar } from "./BottomTabs/TabBarContext";
import { UiHeader } from "./UiHeader";

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

export interface KeyboardAvoidingScrollViewProps extends Omit<
  ScrollViewProps,
  "contentContainerStyle"
> {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  disableTopInset?: boolean;
  keyboardMode?: "insets" | "layout";
  disableTabBarHide?: boolean;
  title?: string;
  showBackButton?: boolean;
  backAction?: "back" | "home" | (string & {});
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
              {children}
            </ScrollYContext.Provider>
          </AnimatedKeyboardAwareScrollView>
        </View>
      );
    },
  );

KeyboardAvoidingScrollView.displayName = "KeyboardAvoidingScrollView";
