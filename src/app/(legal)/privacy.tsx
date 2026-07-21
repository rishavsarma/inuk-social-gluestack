import {
  Database,
  Eye,
  Lock,
  Mail,
  Share2,
  ShieldCheck,
  Trash2,
  Users,
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
  text?: string;
  icon: React.ComponentType<any>;
  bullets?: string[];
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  text,
  icon: IconComponent,
  bullets,
  children,
}) => (
  <Box className=" p-4">
    <HStack space="md" className="items-center mb-3">
      <Box className="p-2.5 rounded-2xl bg-primary/10">
        <IconComponent className="w-5 h-5 text-primary" />
      </Box>
      <Heading size="xs" className="text-foreground font-bold flex-1">
        {title}
      </Heading>
    </HStack>
    {text && (
      <Text className="text-zinc-400 text-sm leading-relaxed mb-1">{text}</Text>
    )}
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
    {children}
  </Box>
);

const PrivacyScreen = () => {
  const { t } = useTranslation();

  const useBullets = [
    t("legal.privacy.sec2_bullet1"),
    t("legal.privacy.sec2_bullet2"),
    t("legal.privacy.sec2_bullet3"),
    t("legal.privacy.sec2_bullet4"),
  ];

  const shareBullets = [
    t("legal.privacy.sec3_bullet1"),
    t("legal.privacy.sec3_bullet2"),
    t("legal.privacy.sec3_bullet3"),
    t("legal.privacy.sec3_bullet4"),
  ];

  return (
    <KeyboardAvoidingScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      showBackButton
      alwaysShowBar
      title={t("legal.privacy.title")}
    >
      <VStack space="md" className="pt-4">
        {/* Banner Section */}
        <Box className="p-4 relative overflow-hidden items-center text-center">
          <Box className="p-4 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </Box>
          <Heading size="md" className="text-foreground mb-1">
            {t("legal.privacy.title")}
          </Heading>
          <Box className="bg-primary/20 px-3 py-1 rounded-full mb-4">
            <Text className="text-primary font-bold text-3xs uppercase tracking-wider">
              {t("legal.privacy.last_updated")}
            </Text>
          </Box>
          <Text className="text-zinc-400 text-center text-sm leading-relaxed">
            {t("legal.privacy.intro")}
          </Text>
        </Box>

        {/* Section Cards */}
        <SectionCard title={t("legal.privacy.sec1_title")} icon={Database}>
          <VStack space="md" className="mt-2 pl-1">
            <VStack space="2xs">
              <Heading
                size="xs"
                className="text-foreground font-semibold text-xs"
              >
                {t("legal.privacy.sec1_sub1")}
              </Heading>
              <Text className="text-zinc-400 text-sm leading-relaxed">
                {t("legal.privacy.sec1_text1")}
              </Text>
            </VStack>
            <VStack space="md" className="h-px bg-zinc-900 my-2" />
            <VStack space="2xs">
              <Heading
                size="xs"
                className="text-foreground font-semibold text-xs"
              >
                {t("legal.privacy.sec1_sub2")}
              </Heading>
              <Text className="text-zinc-400 text-sm leading-relaxed">
                {t("legal.privacy.sec1_text2")}
              </Text>
            </VStack>
          </VStack>
        </SectionCard>

        <SectionCard
          title={t("legal.privacy.sec2_title")}
          text={t("legal.privacy.sec2_intro")}
          icon={Eye}
          bullets={useBullets}
        />

        <SectionCard
          title={t("legal.privacy.sec3_title")}
          text={t("legal.privacy.sec3_intro")}
          icon={Share2}
          bullets={shareBullets}
        />

        <SectionCard
          title={t("legal.privacy.sec4_title")}
          text={t("legal.privacy.sec4_text")}
          icon={Trash2}
        />

        <SectionCard
          title={t("legal.privacy.sec5_title")}
          text={t("legal.privacy.sec5_text")}
          icon={Users}
        />

        <SectionCard
          title={t("legal.privacy.sec6_title")}
          text={t("legal.privacy.sec6_text")}
          icon={Lock}
        />

        <SectionCard
          title={t("legal.privacy.sec7_title")}
          text={t("legal.privacy.sec7_text")}
          icon={Mail}
        />
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default PrivacyScreen;
