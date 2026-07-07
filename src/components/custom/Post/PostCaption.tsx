import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const PostCaption = ({ post }: { post: PostDetail }) => {
  return (
    <Card className="border-0 rounded-none shadow-none">
      <VStack>
        <Heading>{post.post.title}</Heading>
        <Text>{post.post.caption}</Text>
      </VStack>
    </Card>
  );
};

export default PostCaption;
