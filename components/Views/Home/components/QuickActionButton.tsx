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
import { useUser } from "@/hooks/redux/useUser";
import { ID_TIPOSERVICIO_RESERVA } from "@/services/api/tiposervicio/tiposervicio.type";

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
  const { user } = useUser();
  const isReserva = user?.tipo_servicio === ID_TIPOSERVICIO_RESERVA;

  const displayIcon = isReserva
    ? icon === "calendar" || icon === "calendar-outline"
      ? "calendar-check-outline"
      : icon
    : icon;

  const displayTitle = isReserva
    ? title.replace(/Pedidos/g, "Reservas").replace(/Pedido/g, "Reserva")
    : title;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
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
        style={[styles.quickAction, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon name={displayIcon} size={24} color={Colors.light.primary} />
        <CustomText style={styles.quickActionText}>{displayTitle}</CustomText>
      </AnimatedTouchable>
    </Shadow>
  );
};

export default QuickActionButton;
