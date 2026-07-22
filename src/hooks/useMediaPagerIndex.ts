import * as React from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import { POST_CONSTANTS } from "@/constants";

/**
 * Tracks which page of a horizontally paginated media `ScrollView` is
 * currently scrolled into view. Intended for use with a `ScrollView`
 * configured with `horizontal pagingEnabled showsHorizontalScrollIndicator={false}
 * scrollEventThrottle={16}`, where each page is `POST_CONSTANTS.SCREEN_WIDTH` wide.
 */
export function useMediaPagerIndex() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const onScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setCurrentIndex(
        Math.round(
          e.nativeEvent.contentOffset.x / POST_CONSTANTS.SCREEN_WIDTH,
        ),
      );
    },
    [],
  );

  return { currentIndex, onScroll };
}
