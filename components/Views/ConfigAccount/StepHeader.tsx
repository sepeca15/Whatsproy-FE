// components/StepHeader.tsx
import React from "react";
import { View } from "native-base";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useIntl } from "react-intl";
import * as Animatable from "react-native-animatable";

type StepHeaderProps = {
  step: number;
  total: number;
};

const iconsByStep: { [key: number]: string } = {
  1: "account-cog",
  2: "credit-card-check",
  3: "api",
  4: "whatsapp",
};

const StepHeader: React.FC<StepHeaderProps> = ({ step, total }) => {
  const progress = Math.round((step / total) * 100);
  const iconName = iconsByStep[step] || "progress-clock";
  const intl = useIntl();

  // Obtención de los títulos y descripciones dinámicamente
  const stepTitle = intl.formatMessage({ id: `step${step}Title` });
  const stepDescription = intl.formatMessage({ id: `step${step}Description` });

  return (
    <View style={{ alignItems: "center", marginBottom: 24, width: "100%" }}>
      <Animatable.View duration={300} animation="zoomIn">
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#075e54",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Icon name={iconName} size={32} color="#ffffff" />
        </View>
      </Animatable.View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#075e54",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        {stepTitle}
      </Text>


      <Text style={{ fontSize: 14, color: "#555" }}>
        {intl.formatMessage({ id: "step" })} {step}/{total} — {progress}%
      </Text>
      

      <View
        style={{
          width: "80%",
          height: 8,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          overflow: "hidden",
          marginTop: 12,
        }}
      >
        <View
          style={{
            width: `${progress === 0 ? 10 : progress}%`,
            height: "100%",
            backgroundColor: "#075e54",
          }}
        />
      </View>
           <Text
        style={{
          fontSize: 14,
          color: "#555",
          textAlign: "center",
          marginTop: 12,
          paddingHorizontal: 20,
        }}
      >
        {stepDescription}
      </Text>
    </View>
  );
};

export default StepHeader;
