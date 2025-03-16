import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "../../../../constants/Colors";
import CustomText from "./CustomText";
import styles from "../HomeStyles";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type QuickActionButtonProps = {
  icon: string;
  title: string;
  onPress: () => void;
};

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  title,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[styles.quickAction, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Icon name={icon} size={24} color={Colors.light.primary} />
      <CustomText style={styles.quickActionText}>{title}</CustomText>
    </AnimatedTouchable>
  );
};

export default QuickActionButton;
