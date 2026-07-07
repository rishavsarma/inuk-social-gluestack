import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { ArrowUp, HeartIcon, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import { Keyboard, Pressable, Text, View, ActivityIndicator } from 'react-native';

export interface PostCommentsModalProps {
  showComments: boolean;
  setShowComments: (show: boolean) => void;
  comments: any[];
  totalComments: number;
  handleToggleCommentLike: (id: string) => void;
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isDark: boolean;
  insets?: any;
}

export function PostCommentsModal({
  showComments,
  setShowComments,
  comments,
  totalComments,
  handleToggleCommentLike,
  commentText,
  setCommentText,
  handleAddComment,
  onEndReached,
  isFetchingNextPage,
  isLoading,
  isDark,
  insets,
}: PostCommentsModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['85%'], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        Keyboard.dismiss();
        setShowComments(false);
      }
    },
    [setShowComments]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={showComments ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
      onChange={handleSheetChanges}
      handleIndicatorStyle={{ backgroundColor: isDark ? '#555' : '#ccc' }}
      backgroundStyle={{ backgroundColor: isDark ? '#18181B' : '#fff' }}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore">
      <View className="flex-1">
        <View className="items-center border-b border-neutral-100 pb-4 pt-1 dark:border-neutral-800">
          <View className="w-full flex-row items-center justify-between px-6">
            <View className="flex-row items-center gap-2.5">
              <Text className="text-lg font-black text-neutral-900 dark:text-white">Comments</Text>
              <View className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
                <Text className="text-xs font-bold text-neutral-500">{totalComments}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                setShowComments(false);
                bottomSheetRef.current?.close();
              }}
              hitSlop={12}
              className="rounded-full bg-neutral-100 p-2 active:opacity-70 dark:bg-neutral-800">
              <X size={16} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>
        </View>

        <BottomSheetFlatList
          data={comments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          className="px-6"
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            isLoading ? (
              <View className="flex-1 items-center justify-center py-10">
                <ActivityIndicator size="small" color={isDark ? '#fff' : '#000'} />
              </View>
            ) : (
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
                  No comments yet. Be the first to comment!
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4 items-center justify-center">
                <ActivityIndicator size="small" color={isDark ? '#fff' : '#000'} />
              </View>
            ) : null
          }
          renderItem={({ item: comment }) => (
            <View className="flex-row items-start gap-4 border-b border-neutral-100/50 py-5 dark:border-neutral-900/50">
              <Image
                source={{ uri: comment.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                contentFit="cover"
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[14px] font-bold text-neutral-900 dark:text-white">
                    {comment.username}
                  </Text>
                  <Text className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500">
                    {comment.time}
                  </Text>
                </View>
                <Text className="mt-1.5 text-[14px] leading-[20px] text-neutral-700 dark:text-neutral-300">
                  {comment.text}
                </Text>
                <View className="mt-3 flex-row items-center gap-5">
                  <Pressable
                    onPress={() => handleToggleCommentLike(comment.id)}
                    className="flex-row items-center gap-1.5 active:opacity-75">
                    <HeartIcon
                      size={14}
                      color={comment.isLiked ? '#E50914' : '#888'}
                      fill={comment.isLiked ? '#E50914' : 'transparent'}
                    />
                    <Text
                      className={`text-[12px] font-bold ${comment.isLiked ? 'text-[#E50914]' : 'text-neutral-400'}`}>
                      {comment.likesCount}
                    </Text>
                  </Pressable>
                  {comment.repliesCount !== undefined && comment.repliesCount > 0 && (
                    <Pressable className="active:opacity-75">
                      <Text className="text-[12px] font-bold text-neutral-400">
                        {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          )}
        />

        <View
          style={{ paddingBottom: Math.max(insets?.bottom || 0, 12) }}
          className="flex-row items-center gap-3 border-t border-neutral-100 bg-white px-5 pt-4 dark:border-neutral-900 dark:bg-[#18181B]">
          {/* <Image
            source="https://randomuser.me/api/portraits/men/32.jpg"
            style={{ width: 40, height: 40, borderRadius: 20 }}
            contentFit="cover"
          /> */}
          <View className="flex-1 flex-row items-center rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <BottomSheetTextInput
              placeholder="Add a comment..."
              placeholderTextColor={isDark ? '#666' : '#888'}
              value={commentText}
              onChangeText={setCommentText}
              style={{
                flex: 1,
                height: 36,
                fontSize: 14,
                color: isDark ? '#fff' : '#000',
                paddingVertical: 0,
              }}
            />
            <Pressable
              onPress={handleAddComment}
              disabled={!commentText.trim()}
              style={{ opacity: commentText.trim() ? 1 : 0.5 }}
              className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-[#E50914] active:opacity-80">
              <ArrowUp size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
