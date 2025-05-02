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
import { Shadow } from 'react-native-shadow-2';



const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);



type MetricCardProps = {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  onPress?: () => void;
  style?: any; // podés tiparlo mejor con `StyleProp<ViewStyle>` si querés
};

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  onPress,
  style,
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
    <Shadow
      distance={5}
      startColor={'rgba(0, 0, 0, 0.05)'}
      endColor={'rgba(0, 0, 0, 0.01)'}
      offset={[0, 2]}
      style={{ width: '100%', marginBottom: 12 }}
    >
      <AnimatedTouchable
        style={[styles.metricCard, style, animatedStyle]} // <- aplicás el estilo externo
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
    </Shadow>

  );
};

export default MetricCard;
