import { useEffect, useState } from "react";

import { router } from "expo-router";
import { CheckCircle2, Flame, XCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { MOCK_ARENA_QUIZ_QUESTIONS, MOCK_ARENA_QUIZZES } from "@/constants/mock-data";
import { ROUTES } from "@/routes";
import { useWalletStore } from "@/stores/wallet.store";

const QUESTION_SECONDS = 30;
const OPTION_LETTERS = ["A", "B", "C", "D"];
const quiz = MOCK_ARENA_QUIZZES[0];
const questions = MOCK_ARENA_QUIZ_QUESTIONS;

function optionStyle(
  index: number,
  selectedOption: number | null,
  correctIndex: number,
) {
  if (selectedOption === null) {
    return "border-border bg-card";
  }
  if (index === correctIndex) {
    return "border-green-500 bg-green-500/10";
  }
  if (index === selectedOption) {
    return "border-red-500 bg-red-500/10";
  }
  return "border-border bg-card opacity-60";
}

const QuizScreen = () => {
  const { t } = useTranslation();
  const addPoints = useWalletStore((state) => state.addPoints);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [completed, setCompleted] = useState(false);

  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;
  const isLocked = selectedOption !== null || secondsLeft <= 0;

  useEffect(() => {
    if (isLocked || completed) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, completed]);

  const handleSelectOption = (index: number) => {
    if (isLocked) return;
    setSelectedOption(index);
    if (index === question.correctIndex) {
      setScore((prev) => prev + 1);
      addPoints(quiz.sparksPerCorrect, "sparks.txn_quiz");
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCompleted(true);
      return;
    }
    setQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);
    setSecondsLeft(QUESTION_SECONDS);
  };

  if (completed) {
    return (
      <KeyboardAvoidingScrollView
        showBackButton
        alwaysShowBar
        title={t("arena_quiz.title")}
      >
        <VStack space="lg" className="flex-1 items-center justify-center px-6">
          <Icon as={CheckCircle2} size="xl" className="text-theme" />
          <Heading size="lg" className="text-center text-foreground">
            {t("arena_quiz.quiz_complete_title")}
          </Heading>
          <Text className="text-center text-muted-foreground">
            {t("arena_quiz.quiz_complete_summary", {
              correct: score,
              total: questions.length,
              sparks: score * quiz.sparksPerCorrect,
            })}
          </Text>
          <Button
            variant="theme"
            onPress={() => router.replace(ROUTES.TABS.ARENA)}
            accessibilityRole="button"
            accessibilityLabel={t("arena_quiz.back_to_arena")}
            className="w-full rounded-full"
          >
            <ButtonText className="text-white">
              {t("arena_quiz.back_to_arena")}
            </ButtonText>
          </Button>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("arena_quiz.title")}
    >
      <VStack space="lg" className="px-4 pb-10">
        <VStack space="xs">
          <HStack className="items-center justify-between">
            <Text className="text-sm font-semibold text-muted-foreground">
              {t("arena_quiz.question_progress", {
                current: questionIndex + 1,
                total: questions.length,
              })}
            </Text>
            <Text className="text-sm font-semibold text-muted-foreground">
              0:{secondsLeft.toString().padStart(2, "0")}
            </Text>
          </HStack>
          <Progress value={((questionIndex + 1) / questions.length) * 100}>
            <ProgressFilledTrack />
          </Progress>
        </VStack>

        <Heading size="lg" className="text-foreground">
          {question.question}
        </Heading>

        <VStack space="sm">
          {question.options.map((option, index) => (
            <Pressable
              key={option}
              onPress={() => handleSelectOption(index)}
              disabled={isLocked}
              accessibilityRole="button"
              accessibilityLabel={option}
              className={`flex-row items-center gap-3 rounded-2xl border px-4 py-3.5 ${optionStyle(
                index,
                selectedOption,
                question.correctIndex,
              )}`}
            >
              <Box className="h-7 w-7 items-center justify-center rounded-full bg-muted">
                <Text className="text-xs font-bold text-foreground">
                  {OPTION_LETTERS[index]}
                </Text>
              </Box>
              <Text className="flex-1 text-base text-foreground">
                {option}
              </Text>
              {isLocked && index === question.correctIndex && (
                <Icon as={CheckCircle2} size="sm" className="text-green-500" />
              )}
              {isLocked &&
                index === selectedOption &&
                index !== question.correctIndex && (
                  <Icon as={XCircle} size="sm" className="text-red-500" />
                )}
            </Pressable>
          ))}
        </VStack>

        <HStack space="xs" className="items-center">
          <Icon as={Flame} size="sm" className="text-amber-500" />
          <Text className="text-xs text-muted-foreground">
            {t("arena_quiz.sparks_reward", { count: quiz.sparksPerCorrect })}
            {" · "}
            {t("arena_quiz.streak_days", { count: quiz.streakDays })}
          </Text>
        </HStack>

        <Button
          variant="theme"
          disabled={!isLocked}
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={t("arena_quiz.next_question")}
          className="rounded-full"
        >
          <ButtonText className="text-white">
            {isLastQuestion
              ? t("arena_quiz.finish_quiz")
              : t("arena_quiz.next_question")}
          </ButtonText>
        </Button>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default QuizScreen;
