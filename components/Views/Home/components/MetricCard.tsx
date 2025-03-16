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

type MetricCardProps = {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  onPress?: () => void;
};

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtitle,
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
      style={[styles.metricCard, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Icon name={icon} size={24} color={Colors.light.primary} />
      <CustomText style={styles.metricValue}>{value}</CustomText>
      <CustomText style={styles.metricTitle}>{title}</CustomText>
      {subtitle && (
        <CustomText style={styles.metricSubtitle}>{subtitle}</CustomText>
      )}
    </AnimatedTouchable>
  );
};

export default MetricCard;
