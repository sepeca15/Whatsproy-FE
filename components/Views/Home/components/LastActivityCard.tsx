import React from "react";
import { View, TouchableOpacity } from "react-native";
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

type LastActivityCardProps = {
  title: string;
  time: string;
  id: string;
  amount?: string;
  address: string;
  icon: string;
  info?: string;
  onPress?: () => void;
};

const LastActivityCard: React.FC<LastActivityCardProps> = ({
  title,
  time,
  id,
  amount,
  address,
  icon,
  info,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
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
        style={[styles.lastActivityCard, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.lastActivityHeader}>
          <CustomText style={styles.lastActivityTitle}>{title}</CustomText>
          <CustomText style={styles.lastActivityTime}>{time}</CustomText>
        </View>
        <View style={styles.lastActivityContent}>
          <Icon name={icon} size={24} color={Colors.light.primary} />
          <View style={styles.lastActivityInfo}>
            <CustomText style={styles.lastActivityId}>#{address}</CustomText>
            {amount && (
              <CustomText style={styles.lastActivityAmount}>{amount}</CustomText>
            )}
            {info && (
              <CustomText style={styles.lastActivityExtra}>{info}</CustomText>
            )}
          </View>
        </View>
      </AnimatedTouchable>
    </Shadow>

  );
};

export default LastActivityCard;
