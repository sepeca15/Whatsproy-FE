"use client"

import CustomText from "@/components/CustomText"
import { getInitials } from "@/components/Views/TrustedNumbers/components/CardContact/CardContact"
import { Colors } from "@/constants/Colors"
import { useUser } from "@/hooks/redux/useUser"
import { Feather } from "@expo/vector-icons"
import moment from "moment-timezone"
import { Pressable, View, StyleSheet } from "react-native"
import { FormattedMessage } from "react-intl"
import { cardClientStyles } from "./CardClientStyles"

interface ICardClient {
  item: any
  setClienteSeleccionado: () => void
}

const CardClient = ({ item, setClienteSeleccionado }: ICardClient) => {
  const { user } = useUser()
  const initials = getInitials(item.nombre)
  const lastPurchase = item.pedido[item.pedido.length - 1]
  const lastPurchaseDate = lastPurchase ? moment.tz(lastPurchase?.createdAt, user.timeZone).fromNow() : "-"

  return (
    <View style={[cardClientStyles.cardContainer]}>
      <View style={cardClientStyles.cardHeader}>
        <View style={cardClientStyles.clientSection}>
          <View style={cardClientStyles.avatarContainer}>
            <CustomText style={cardClientStyles.avatarText}>{initials}</CustomText>
          </View>
          <View style={cardClientStyles.clientInfo}>
            <CustomText numberOfLines={1} style={cardClientStyles.clientName}>
              {item.nombre}
            </CustomText>
            <View style={cardClientStyles.phoneContainer}>
              <Feather name="phone" size={12} color={Colors.light.icon} />
              <CustomText style={cardClientStyles.phoneText}>{item.telefono}</CustomText>
            </View>
          </View>
        </View>

        <View style={cardClientStyles.salesSection}>
          <View style={cardClientStyles.salesBadge}>
            <Feather name="shopping-bag" size={14} color={Colors.light.secondary} />
            <CustomText style={cardClientStyles.salesCount}>{item?.pedido?.length}</CustomText>
            <CustomText style={cardClientStyles.salesLabel}>
              <FormattedMessage id="cardClient.sales" defaultMessage="ventas" />
            </CustomText>
          </View>
        </View>
      </View>

      <View style={cardClientStyles.statsSection}>
        <View style={cardClientStyles.statItem}>
          <View style={cardClientStyles.statIconContainer}>
            <Feather name="dollar-sign" size={14} color={Colors.light.primary} />
          </View>
          <View style={cardClientStyles.statTextContainer}>
            <CustomText style={cardClientStyles.statLabel}>
              <FormattedMessage id="cardClient.totalAmount" defaultMessage="Monto Total" />
            </CustomText>
            <CustomText style={cardClientStyles.statValue}>${item.totalGenerated.toFixed(2)}</CustomText>
          </View>
        </View>

        <View style={cardClientStyles.statItem}>
          <View style={cardClientStyles.statIconContainer}>
            <Feather name="clock" size={14} color={Colors.light.warning} />
          </View>
          <View style={cardClientStyles.statTextContainer}>
            <CustomText style={cardClientStyles.statLabel}>
              <FormattedMessage id="cardClient.lastPurchase" defaultMessage="Última Compra" />
            </CustomText>
            <CustomText style={cardClientStyles.statValue}>{lastPurchaseDate}</CustomText>
          </View>
        </View>
      </View>

      <View style={cardClientStyles.divider} />

      <View style={cardClientStyles.actionsSection}>
        <Pressable
          accessibilityRole={"button"}
          onPress={setClienteSeleccionado}
          style={cardClientStyles.detailsButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="eye" size={16} color="white" />
          <CustomText style={cardClientStyles.detailsButtonText}>
            <FormattedMessage id="cardClient.viewDetails" defaultMessage="Ver Detalles" />
          </CustomText>
        </Pressable>
      </View>
    </View>
  )
}

export default CardClient
