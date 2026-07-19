import { useTranslation } from "react-i18next";

import ArenaQuizPanel from "@/components/custom/arena/ArenaQuizPanel";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { VStack } from "@/components/ui/vstack";

const QuizScreen = () => {
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingScrollView showBackButton alwaysShowBar title={t("arena.tab_quizzes")}>
      <VStack className="px-4 pb-10">
        <ArenaQuizPanel />
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default QuizScreen;
