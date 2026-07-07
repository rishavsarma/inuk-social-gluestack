import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Box } from "@/components/ui/box";

const AwardScreen = () => {
  return (
    <KeyboardAvoidingScrollView>
      <Box className="h-96 bg-red-500"></Box>
      <Box className="h-96 bg-red-500"></Box>
      <Box className="h-96 bg-red-500"></Box>
      <Box className="h-96 bg-red-500"></Box>
    </KeyboardAvoidingScrollView>
  );
};

export default AwardScreen;
