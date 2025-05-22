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

type MetricCardProps = {
  icon: string;
  title: string;
  value: any;
  subtitle?: any;
  onPress?: () => void;
  style?: any;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  onPress,
  style,
}) => {
  // Obtener rol de usuario para condicionar iconos y títulos
  const { user } = useUser();
  const isReserva = user?.id_rol === 1;

  // Ajustar icono: si es rol reserva y el icono es de carrito, usar calendario
  const displayIcon = isReserva && icon === "cart-outline" ? "calendar-outline" : icon;

  // Ajustar título: reemplazar "Pedidos" por "Reservas" en reservas
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
        style={[styles.metricCard, style, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon name={displayIcon} size={24} color={Colors.light.primary} />
        <CustomText style={styles.metricValue}>{value}</CustomText>
        <CustomText style={styles.metricTitle}>{displayTitle}</CustomText>
        {subtitle && (
          <CustomText style={styles.metricSubtitle}>{subtitle}</CustomText>
        )}
      </AnimatedTouchable>
    </Shadow>
  );
};

export default MetricCard;
