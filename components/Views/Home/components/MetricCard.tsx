import React from "react"
import { TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming } from "react-native-reanimated"
import { Colors } from "../../../../constants/Colors"
import CustomText from "./CustomText"
import styles from "../HomeStyles"
import { Shadow } from "react-native-shadow-2"
import { useUser } from "@/hooks/redux/useUser"
import { ID_TIPOSERVICIO_RESERVA } from "@/services/api/tiposervicio/tiposervicio.type"

type MetricCardProps = {
  icon: string
  title: string
  value: any
  subtitle?: any
  onPress?: () => void
  style?: any
  loading?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)
const AnimatedView = Animated.createAnimatedComponent(View)

// Componente Skeleton
const SkeletonLoader: React.FC = () => {
  const opacity = useSharedValue(0.3)

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
  }, [])

  const animatedSkeletonStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <View style={[styles.metricCard, skeletonStyles.skeletonCard]}>
      {/* Skeleton Icon */}
      <AnimatedView style={[skeletonStyles.skeletonIcon, animatedSkeletonStyle]} />

      {/* Skeleton Value */}
      <AnimatedView style={[skeletonStyles.skeletonValue, animatedSkeletonStyle]} />

      {/* Skeleton Title */}
      <AnimatedView style={[skeletonStyles.skeletonTitle, animatedSkeletonStyle]} />
    </View>
  )
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  onPress,
  style,
  loading = false, // Valor por defecto
}) => {
  const { user, isReserva } = useUser()

  const displayIcon = isReserva && icon === "cart-outline" ? "calendar-outline" : icon

  const displayTitle = isReserva ? title.replace(/Pedidos/g, "Reservas").replace(/Pedido/g, "Reserva") : title

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    if (!loading) {
      scale.value = withSpring(0.95)
    }
  }

  const handlePressOut = () => {
    if (!loading) {
      scale.value = withSpring(1)
    }
  }

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <Shadow
        distance={5}
        startColor={"rgba(0, 0, 0, 0.05)"}
        endColor={"rgba(0, 0, 0, 0.01)"}
        offset={[0, 2]}
        style={{ width: "100%", marginBottom: 12 }}
      >
        <SkeletonLoader />
      </Shadow>
    )
  }

  // Contenido normal
  return (
    <Shadow
      distance={5}
      startColor={"rgba(0, 0, 0, 0.05)"}
      endColor={"rgba(0, 0, 0, 0.01)"}
      offset={[0, 2]}
      style={{ width: "100%", marginBottom: 12 }}
    >
      <AnimatedTouchable
        style={[styles.metricCard, style, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}
      >
        <Icon name={displayIcon} size={24} color={Colors.light.primary} />
        <CustomText style={styles.metricValue}>{value}</CustomText>
        <CustomText style={styles.metricTitle}>{displayTitle}</CustomText>
        {subtitle && <CustomText style={styles.metricSubtitle}>{subtitle}</CustomText>}
      </AnimatedTouchable>
    </Shadow>
  )
}

// Estilos para el skeleton
const skeletonStyles = {
  skeletonCard: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  skeletonIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 8,
  },
  skeletonValue: {
    width: 60,
    height: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonTitle: {
    width: 80,
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
}

export default MetricCard
