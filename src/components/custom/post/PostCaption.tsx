import { Text } from "@/components/ui/text";

function PostCaption({ post }: { post: PostDetail }) {
  const caption = post.post.title || post.post.caption;
  if (!caption) return null;

  return (
    <Text numberOfLines={3} className="px-4 pb-2.5 font-inter text-sm text-foreground">
      {caption}
    </Text>
  );
}

export default PostCaption;
