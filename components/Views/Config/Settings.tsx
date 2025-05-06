
import { View, Text, StatusBar, FlatList } from "react-native"
import { useRouter } from "expo-router"
import Feather from "react-native-vector-icons/Feather"
import Entypo from "react-native-vector-icons/Entypo"

import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import IonIcons from "react-native-vector-icons/Ionicons"
import { FormattedMessage, useIntl } from "react-intl"
import { useColorScheme } from "react-native"
import { Colors } from "@/constants/Colors"
import Animated from "react-native-reanimated"
import styles from "./SettingsStyles"
import SettingCard from "@/hooks/settingsCards/SettingCard"
import * as Animatable from "react-native-animatable";


const Settings = () => {
  const intl = useIntl()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = isDark ? Colors.dark : Colors.light

  const settingsPage = [
    {
      title: intl.formatMessage({ id: "generalSettings", defaultMessage: "General Settings" }),
      href: "/(tabs)/generalSettings",
      description: intl.formatMessage({
        id: "manageHours",
        defaultMessage: "Manage your working hours and preferences",
      }),
      icon: <Feather size={22} color={"white"} name="settings" />,
    },
    {
      title: intl.formatMessage({ id: "subscription ", defaultMessage: "Subscription" }),
      href: "/(tabs)/subscriptions",
      description: intl.formatMessage({ id: "manageSubscription", defaultMessage: "Manage your working hours and preferences" }),
      icon: <Entypo size={22} color={"white"} name="wallet" />,
    },
    {
      title: intl.formatMessage({ id: "users", defaultMessage: "Users" }),
      href: "/(tabs)/usuarios",
      description: intl.formatMessage({ id: "createUsers", defaultMessage: "Create and manage users" }),
      icon: <FontAwesome5 name="users" size={22} color={"white"} />,
    },
    {
      title: intl.formatMessage({ id: "status", defaultMessage: "Status" }),
      href: "/(tabs)/status",
      description: intl.formatMessage({ id: "statusDescription", defaultMessage: "View and manage statuses" }),
      icon: <MaterialCommunityIcons name="list-status" size={22} color={"white"} />,
    },
    // {
    //   title: intl.formatMessage({ id: "notifications", defaultMessage: "Notifications" }),
    //   href: "",
    //   description: intl.formatMessage({ id: "notificationsDescription", defaultMessage: "Manage notification preferences" }),
    //   icon: <IonIcons name="notifications-outline" size={22} color={"white"} />,
    // },
    {
      title: intl.formatMessage({ id: "privacySecurity", defaultMessage: "Privacy & Security" }),
      href: "/(tabs)/privacy",
      description: intl.formatMessage({ id: "privacyDescription", defaultMessage: "View privacy and security policies" }),
      icon: <Feather size={22} color={"white"} name="shield" />,
    },
    {
      title: intl.formatMessage({ id: "orderData", defaultMessage: "Order Data" }),
      href: "/(tabs)/datosPedido",
      description: intl.formatMessage({ id: "orderDataDescription", defaultMessage: "Manage order-related data" }),
      icon: <IonIcons size={22} color={"white"} name="newspaper-outline" />,
    },
    {
      title: intl.formatMessage({ id: "categories", defaultMessage: "Categories" }),
      href: "/(tabs)/categories",
      description: intl.formatMessage({ id: "categoriesDesc", defaultMessage: "Organize and manage categories" }),
      icon: <MaterialCommunityIcons size={22} color={"white"} name="format-list-bulleted-type" />,
    },
  ]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />

      {/* Header */}
      <Animated.View style={[styles.header, { backgroundColor: colors.primary }]}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>
        <FormattedMessage id="settings" />
        </Text>
      </View>
      </Animated.View>

      {/* Lista de Ajustes */}
      <FlatList
      data={settingsPage}
      keyExtractor={(item, index) => item.href || index.toString()}
      renderItem={({ item, index }) => (
        <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={100 + index * 50}
        style={styles.metricsContainer}
        >
        <SettingCard
          item={item}
          index={index}
          isDark={isDark}
          colors={colors}
          onNavigate={(href) => router.push(href as any)}
        />
        </Animatable.View>
      )}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default Settings
