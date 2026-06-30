import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTranslation } from "react-i18next";
import { useAppTopInset } from "@/hooks/use-app-insets";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/custom/ThemeSwitcher";
import { LangSwitcher } from "@/components/custom/LangSwitcher";
import { Card } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Image } from "@/components/ui/image";

const AuthHome = () => {
  const topInset = useAppTopInset();
  const { t } = useTranslation();

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: topInset, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      bottomOffset={24}
    >
      <VStack className="p-4" space="lg">
        <VStack space="lg" className="mt-8 border-t border-border/40 pt-6">
          <ThemeSwitcher />
          <LangSwitcher />
          <Card>
            <Box className="flex-row">
              <Avatar className="mr-4">
                <AvatarFallbackText>JD</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: "https://gluestack.github.io/public-blog-video-assets/camera.png",
                  }}
                />
              </Avatar>
              <VStack>
                <Heading size="md" className="mb-1">
                  Jane Doe
                </Heading>
                <Text size="sm">janedoe@sample.com</Text>
              </VStack>
            </Box>
            <Box className="flex-row">
              <VStack className="items-center flex-1 pb-0 border-r border-border/70">
                <Heading size="xs">81</Heading>
                <Text size="xs">posts</Text>
              </VStack>
              <VStack className="items-center flex-1 py-0 border-r border-border/70">
                <Heading size="xs">5,281</Heading>
                <Text size="xs">followers</Text>
              </VStack>
              <VStack className="items-center flex-1 pt-0">
                <Heading size="xs">281</Heading>
                <Text size="xs">following</Text>
              </VStack>
            </Box>
            <Box className="flex-row">
              <Image
                source={{
                  uri: "https://gluestack.github.io/public-blog-video-assets/parrot.png",
                }}
                className="rounded-md w-[45%] h-[140px] mb-0 mr-3 sm:w-[150px] sm:h-[154px]"
                alt="image"
              />
              <Image
                source={{
                  uri: "https://gluestack.github.io/public-blog-video-assets/dear.png",
                }}
                className="rounded-md w-[45%] h-[140px] sm:w-[150px] sm:h-[154px]"
                alt="image"
              />
            </Box>
            <Button className="py-2 px-4">
              <ButtonText size="sm">Follow</ButtonText>
            </Button>
          </Card>
        </VStack>
        <Input>
          <InputField placeholder="Enter" />
        </Input>
        <Button size="xl">
          <ButtonText>{t("auth.verify")}</ButtonText>
        </Button>
        <Input>
          <InputField placeholder="Enter" />
        </Input>
      </VStack>
    </KeyboardAwareScrollView>
  );
};

export default AuthHome;
