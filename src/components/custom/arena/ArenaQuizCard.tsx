import React from "react";

import { Flame, HelpCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface ArenaQuizCardProps {
  quiz: ArenaQuiz;
  onStart: (quiz: ArenaQuiz) => void;
}

function ArenaQuizCard({ quiz, onStart }: ArenaQuizCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="gap-3 rounded-2xl">
      <HStack className="items-start justify-between">
        <VStack className="flex-1 gap-1 pr-2">
          <Heading size="sm" className="text-foreground">
            {quiz.title}
          </Heading>
          <HStack space="xs" className="items-center">
            <Icon as={HelpCircle} size="xs" className="text-muted-foreground" />
            <Text size="xs" className="text-muted-foreground">
              {t("arena.questions_count", { count: quiz.questionsCount })}
            </Text>
          </HStack>
        </VStack>
        {quiz.streakDays > 0 && (
          <HStack space="xs" className="items-center">
            <Icon
              as={Flame}
              size="sm"
              className={POST_METADATA_TINTS.amber.iconColor}
            />
            <Text
              size="xs"
              className={`font-semibold ${POST_METADATA_TINTS.amber.iconColor}`}
            >
              {t("arena.streak_days", { count: quiz.streakDays })}
            </Text>
          </HStack>
        )}
      </HStack>

      <Button
        variant="theme"
        onPress={() => onStart(quiz)}
        accessibilityRole="button"
        accessibilityLabel={t("arena.start_quiz")}
        className="rounded-full"
      >
        <ButtonText className="text-white">{t("arena.start_quiz")}</ButtonText>
      </Button>
    </Card>
  );
}

export default React.memo(ArenaQuizCard);
