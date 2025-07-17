// components/StepHeader.tsx
import React from "react";
import { View } from "native-base";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useIntl } from "react-intl";
import * as Animatable from "react-native-animatable";

type StepHeaderRegisterProps = {
  step: number;
  total: number;
  color?: "black" | "white",
  title?: any

};

const iconsByStep: { [key: number]: string } = {
  1: "google-my-business",
  2: "clockcircleo",
  3: "account"
};

const StepHeaderRegister: React.FC<StepHeaderRegisterProps> = ({ step, total, color, title }) => {
  const progress = Math.round((step / total) * 100);
  const iconName = iconsByStep[step] || "progress-clock";
  const intl = useIntl();

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

      <Text allowFontScaling={false}
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: color === 'white' ? "white" : "#075e54",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        {intl.formatMessage({ id: `stepsRegisterTitle${step}` })}
      </Text>


      <Text allowFontScaling={false} style={{ fontSize: 14, color: color === 'white' ? "white" : "#075e54" }}>
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
      <Text allowFontScaling={false}
        style={{
          fontSize: 14,
          color: color === 'white' ? "white" : "#075e54",
          textAlign: "center",
          marginTop: 12,
          paddingHorizontal: 20,
        }}
      >
        {intl.formatMessage({ id: `stepsRegisterDesc2` })}
      </Text>
    </View>
  );
};

export default StepHeaderRegister;
