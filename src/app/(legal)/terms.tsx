import {
  AlertTriangle,
  Ban,
  FileCode,
  FileImage,
  Lock,
  Scale,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

interface SectionCardProps {
  title: string;
  text: string;
  icon: React.ComponentType<any>;
  bullets?: string[];
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  text,
  icon: IconComponent,
  bullets,
}) => (
  <Box className="p-4">
    <HStack space="md" className="items-center mb-3">
      <Box className="p-2.5 rounded-2xl bg-primary/10">
        <IconComponent className="w-5 h-5 text-primary" />
      </Box>
      <Heading size="xs" className="text-foreground font-bold flex-1">
        {title}
      </Heading>
    </HStack>
    <Text className="text-zinc-400 text-sm leading-relaxed mb-1">{text}</Text>
    {bullets && bullets.length > 0 && (
      <VStack space="xs" className="mt-3 pl-1">
        {bullets.map((bullet, idx) => (
          <HStack key={idx} space="sm" className="items-start">
            <Box className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
            <Text className="text-zinc-500 text-xs leading-normal flex-1">
              {bullet}
            </Text>
          </HStack>
        ))}
      </VStack>
    )}
  </Box>
);

const TermsScreen = () => {
  const { t } = useTranslation();

  const prohibitedBullets = [
    t("legal.terms.sec4_bullet1"),
    t("legal.terms.sec4_bullet2"),
    t("legal.terms.sec4_bullet3"),
    t("legal.terms.sec4_bullet4"),
    t("legal.terms.sec4_bullet5"),
  ];

  return (
    <KeyboardAvoidingScrollView
      title={t("legal.terms.title")}
      contentContainerStyle={{ paddingBottom: 100 }}
      showBackButton
      alwaysShowBar
    >
      <VStack space="md" className="pt-4">
        {/* Banner Section */}
        <Box className="p-4 relative overflow-hidden items-center text-center">
          <Box className=" rounded-full bg-primary/10 mb-4">
            <Scale className="w-8 h-8 text-primary" />
          </Box>
          <Heading size="md" className="text-foreground mb-1">
            {t("legal.terms.title")}
          </Heading>
          <Box className="bg-primary/20 px-3 py-1 rounded-full mb-4">
            <Text className="text-primary font-bold text-3xs uppercase tracking-wider">
              {t("legal.terms.last_updated")}
            </Text>
          </Box>
          <Text className="text-zinc-400 text-center text-sm leading-relaxed">
            {t("legal.terms.welcome")}
          </Text>
        </Box>

        {/* Section Cards */}
        <SectionCard
          title={t("legal.terms.sec1_title")}
          text={t("legal.terms.sec1_text")}
          icon={UserCheck}
        />

        <SectionCard
          title={t("legal.terms.sec2_title")}
          text={t("legal.terms.sec2_text")}
          icon={Lock}
        />

        <SectionCard
          title={t("legal.terms.sec3_title")}
          text={t("legal.terms.sec3_text")}
          icon={FileImage}
        />

        <SectionCard
          title={t("legal.terms.sec4_title")}
          text={t("legal.terms.sec4_text")}
          icon={Ban}
          bullets={prohibitedBullets}
        />

        <SectionCard
          title={t("legal.terms.sec5_title")}
          text={t("legal.terms.sec5_text")}
          icon={FileCode}
        />

        <SectionCard
          title={t("legal.terms.sec6_title")}
          text={t("legal.terms.sec6_text")}
          icon={UserX}
        />

        <SectionCard
          title={t("legal.terms.sec7_title")}
          text={t("legal.terms.sec7_text")}
          icon={Shield}
        />

        <SectionCard
          title={t("legal.terms.sec8_title")}
          text={t("legal.terms.sec8_text")}
          icon={AlertTriangle}
        />
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default TermsScreen;
