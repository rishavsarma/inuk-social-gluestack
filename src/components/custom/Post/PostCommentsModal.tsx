import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { FlashList } from "@shopify/flash-list";
import { SendHorizontal, XIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

function commentAuthorInfo(profile?: PostCommentAuthorProfile) {
  const displayName =
    profile?.givenName ||
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
    "User";
  const avatarUrl =
    profile?.avatar && profile.avatar !== "string"
      ? `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.avatar}/jpeg/720`
      : undefined;
  return { displayName, username: profile?.username ?? "user", avatarUrl };
}

function CommentRow({ comment }: { comment: PostComment }) {
  const { displayName, username, avatarUrl } = commentAuthorInfo(
    comment.profile,
  );
  const timeAgo = useTimeAgo(new Date(comment.dateCreated).toISOString());

  return (
    <HStack space="sm" className="items-start px-4 py-3">
      <Avatar className="mt-0.5 h-10 w-10">
        <AvatarFallbackText>{displayName}</AvatarFallbackText>
        {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
      </Avatar>
      <VStack className="flex-1" space="xs">
        <HStack space="xs" className="items-center flex-wrap">
          <Text size="sm" bold className="text-foreground">
            {displayName}
          </Text>
          <Text size="xs" className="text-muted-foreground">
            @{username}
          </Text>
          {!!timeAgo && (
            <Text size="xs" className="text-muted-foreground">
              · {timeAgo}
            </Text>
          )}
        </HStack>
        <Text size="sm" className="text-foreground/90">
          {comment.text}
        </Text>
      </VStack>
    </HStack>
  );
}

export interface PostCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: PostComment[];
  totalComments: number;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  isRefetching?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  commentText: string;
  onChangeCommentText: (text: string) => void;
  onSubmitComment: () => void;
  isSubmitting?: boolean;
}

export function PostCommentsModal({
  isOpen,
  onClose,
  comments,
  totalComments,
  isLoading = false,
  isFetchingNextPage = false,
  isRefetching = false,
  onEndReached,
  onRefresh,
  commentText,
  onChangeCommentText,
  onSubmitComment,
  isSubmitting = false,
}: PostCommentsModalProps) {
  const { t } = useTranslation();

  return (
    <Actionsheet snapPoints={[80]} isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="h-full w-full px-0 pb-0 pt-2">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-muted-foreground" />
        </ActionsheetDragIndicatorWrapper>

        <KeyboardAvoidingView className="w-full flex-1">
          <HStack className="w-full items-center justify-between border-b border-border px-4 pb-3 pt-1">
            <HStack space="sm" className="items-center">
              <Heading size="md" className="text-foreground">
                {t("post_detail.comments_modal.title")}
              </Heading>
              <Badge variant="outline" className="rounded-full">
                <BadgeText>{totalComments}</BadgeText>
              </Badge>
            </HStack>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t("post_detail.comments_modal.close")}
              className="h-8 w-8 items-center justify-center rounded-full bg-muted"
            >
              <Icon as={XIcon} size="sm" className="text-foreground" />
            </Pressable>
          </HStack>

          <Box className="flex-1 w-full">
            <FlashList
              data={comments}
              keyExtractor={(item) => item.id}
              estimatedItemSize={84}
              renderItem={({ item }) => <CommentRow comment={item} />}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              refreshing={isRefetching}
              onRefresh={onRefresh}
              contentContainerStyle={{ paddingBottom: 12 }}
              ListEmptyComponent={
                isLoading ? (
                  <Box className="flex-1 items-center justify-center py-16">
                    <Spinner />
                  </Box>
                ) : (
                  <Box className="flex-1 items-center justify-center px-6 py-16">
                    <Text
                      size="sm"
                      className="text-center text-muted-foreground"
                    >
                      {t("post_detail.comments_modal.empty")}
                    </Text>
                  </Box>
                )
              }
              ListFooterComponent={
                isFetchingNextPage ? (
                  <Box className="items-center py-4">
                    <Spinner />
                  </Box>
                ) : null
              }
            />
          </Box>

          <HStack
            space="sm"
            className="w-full items-center border-t border-border px-4 py-3"
          >
            <Input className="flex-1 rounded-full border-0 bg-muted px-4">
              <InputField
                placeholder={t("post_detail.comments_modal.placeholder")}
                value={commentText}
                onChangeText={onChangeCommentText}
                onSubmitEditing={onSubmitComment}
                returnKeyType="send"
                accessibilityLabel={t("post_detail.comments_modal.placeholder")}
              />
            </Input>
            <Button
              size="icon"
              onPress={onSubmitComment}
              disabled={!commentText.trim() || isSubmitting}
              accessibilityRole="button"
              accessibilityLabel={t("post_detail.comments_modal.send")}
              className="h-11 w-11 rounded-full bg-theme"
            >
              {isSubmitting ? (
                <Spinner size="small" className="text-white" />
              ) : (
                <ButtonIcon as={SendHorizontal} className="text-white" />
              )}
            </Button>
          </HStack>
        </KeyboardAvoidingView>
      </ActionsheetContent>
    </Actionsheet>
  );
}
