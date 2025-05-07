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
  // Obtener rol de usuario para condicionar iconos y títulos
  const { user } = useUser();
  const isReserva = user?.id_rol === 1;

  // Ajustar icono: si es reserva y el icono es 'calendar', usar 'calendar-check' o similar
  const displayIcon = isReserva
    ? icon === "calendar" || icon === "calendar-outline"
      ? "calendar-check-outline"
      : icon
    : icon;

  // Ajustar título: traducir 'Pedidos' a 'Reservas'
  const displayTitle = isReserva
    ? title.replace(/Pedidos/g, "Reservas").replace(/Pedido/g, "Reserva")
    : title;

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
