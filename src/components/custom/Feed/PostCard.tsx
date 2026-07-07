import * as React from "react";
import { AudioPost } from "../Post/audio-post";
import { PhotoPost } from "../Post/photo-post";
import { QuizPost } from "../Post/quiz-post";
import { TextPost } from "../Post/text-post";
import { VideoPost } from "../Post/video-post";

interface PostCardProps {
  post: Post;
  isFocused?: boolean;
}

const PostCardComponent = ({ post, isFocused }: PostCardProps) => {
  const hasMedia = post.media && post.media.length > 0;
  const postType = post.type || (hasMedia ? "photo" : "text");

  if (
    postType === "photo" ||
    (hasMedia && postType !== "video" && postType !== "audio")
  ) {
    return <PhotoPost post={post} />;
  }

  if (postType === "video" && post.media[0]) {
    return <VideoPost post={post} />;
  }

  if (postType === "audio" && post.audio) {
    return <AudioPost post={post} />;
  }

  if (postType === "quiz" && post.quiz) {
    return <QuizPost post={post} />;
  }

  return <TextPost post={post} />;
};

export default React.memo(PostCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.is_liked === nextProps.post.is_liked &&
    prevProps.post.likes_count === nextProps.post.likes_count &&
    prevProps.post.comments_count === nextProps.post.comments_count
  );
});
