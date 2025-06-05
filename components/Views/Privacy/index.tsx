import React from "react";
import { ScrollView, View, VStack, Text, Box } from "native-base";
import Animated from "react-native-reanimated";
import CustomText from "@/components/CustomText";
import { globalStyles } from "@/components/globalStyles";
import { FormattedMessage } from "react-intl";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const PrivacyView = () => {
  const router = useRouter();

  return (
    <View flex={1}>
      <Animated.View style={globalStyles.header2}>
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Privacy Policy"
            >
              <FormattedMessage id="privacyPolicy.title" />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      <ScrollView p={3}>
        <VStack shadow={1} mb={8} pb={12} bg={'white'} p={8} borderRadius={12} space={5}>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              <FormattedMessage id="privacyPolicy.introTitle" />
            </Text>
            <Text mt={2} fontSize="sm" color="gray.600">
              <FormattedMessage id="privacyPolicy.intro" />
            </Text>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold">
              <FormattedMessage id="privacyPolicy.dataTitle" />
            </Text>
            <Text mt={2} fontSize="sm" color="gray.600">
              <FormattedMessage id="privacyPolicy.data" />
            </Text>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold">
              <FormattedMessage id="privacyPolicy.thirdPartyTitle" />
            </Text>
            <Text mt={2} fontSize="sm" color="gray.600">
              <FormattedMessage id="privacyPolicy.thirdParty" />
            </Text>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold">
              <FormattedMessage id="privacyPolicy.usageTitle" />
            </Text>
            <Text mt={2} fontSize="sm" color="gray.600">
              <FormattedMessage id="privacyPolicy.usage" />
            </Text>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold">
              <FormattedMessage id="privacyPolicy.rightsTitle" />
            </Text>
            <Text mt={2} fontSize="sm" color="gray.600">
              <FormattedMessage id="privacyPolicy.rights" />
            </Text>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold">
              <FormattedMessage id="privacyPolicy.contactTitle" />
            </Text>
            <Text mt={2} fontSize="sm" color="gray.600">
              <FormattedMessage id="privacyPolicy.contact" />
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default PrivacyView;
