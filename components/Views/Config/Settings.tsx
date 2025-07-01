"use client";

import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcons from "react-native-vector-icons/Ionicons";
import { FormattedMessage, useIntl } from "react-intl";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import Animated from "react-native-reanimated";
import styles from "./SettingsStyles";
import SettingCard from "@/hooks/settingsCards/SettingCard";
import * as Animatable from "react-native-animatable";
import { useUser } from "@/hooks/redux/useUser";
import { ID_TIPOSERVICIO_DELIVERY } from "@/services/api/tiposervicio/tiposervicio.type";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Settings = () => {
  const intl = useIntl();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const { user } = useUser();
  const isAdmin = user?.isAdmin;
  const isDelivery = user?.tipo_servicio === ID_TIPOSERVICIO_DELIVERY;

  const settingsPage = [
    ...(user?.isSuperAdmin
      ? [
          {
            title: intl.formatMessage({
              id: "companies",
              defaultMessage: "Companies",
            }),
            href: "/(tabs)/companies",
            description: intl.formatMessage({
              id: "companiesDesc",
              defaultMessage: "Manage companies and deploy its",
            }),
            icon: <Feather size={22} color={"white"} name="list" />,
          },
        ]
      : []),
    {
      title: intl.formatMessage({
        id: "helpSupport",
        defaultMessage: "Ayuda y Soporte",
      }),
      href: "/(tabs)/help",
      description: intl.formatMessage({
        id: "helpSupportDesc",
        defaultMessage: "Encuentra respuestas y aprende a usar la app",
      }),
      icon: <Entypo size={22} color={"white"} name="time-slot" />,
    },
    {
      title: intl.formatMessage({
        id: "generalSettings",
        defaultMessage: "General Settings",
      }),
      href: "/(tabs)/generalSettings",
      description: intl.formatMessage({
        id: "manageHours",
        defaultMessage: "Manage your working hours and preferences",
      }),
      icon: <Feather size={22} color={"white"} name="settings" />,
    },
    ...(isAdmin
      ? [
          {
            title: intl.formatMessage({
              id: "subscription ",
              defaultMessage: "Subscription",
            }),
            href: "/(tabs)/subscriptions",
            description: intl.formatMessage({
              id: "manageSubscription",
              defaultMessage: "Manage your working hours and preferences",
            }),
            icon: <Entypo size={22} color={"white"} name="wallet" />,
          },
          {
            title: intl.formatMessage({
              id: "schedules",
              defaultMessage: "Schedules",
            }),
            href: "/(tabs)/schedules",
            description: intl.formatMessage({
              id: "manageSchedules",
              defaultMessage: "Set your business hours and availability",
            }),
            icon: <Feather size={22} color={"white"} name="clock" />,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            title: intl.formatMessage({ id: "users", defaultMessage: "Users" }),
            href: "/(tabs)/usuarios",
            description: intl.formatMessage({
              id: "createUsers",
              defaultMessage: "Create and manage users",
            }),
            icon: <FontAwesome5 name="users" size={22} color={"white"} />,
          },
          {
            title: intl.formatMessage({
              id: "status",
              defaultMessage: "Status",
            }),
            href: "/(tabs)/status",
            description: intl.formatMessage({
              id: "statusDescription",
              defaultMessage: "View and manage statuses",
            }),
            icon: (
              <MaterialCommunityIcons
                name="list-status"
                size={22}
                color={"white"}
              />
            ),
          },
          {
            title: intl.formatMessage({
              id: "orderData",
              defaultMessage: "Order Data",
            }),
            href: "/(tabs)/datosPedido",
            description: intl.formatMessage({
              id: "orderDataDescription",
              defaultMessage: "Manage order-related data",
            }),
            icon: (
              <IonIcons size={22} color={"white"} name="newspaper-outline" />
            ),
          },
          ...(isAdmin
            ? [
                {
                  title: intl.formatMessage({
                    id: "priceAdjustment",
                    defaultMessage: "Price Adjustment",
                  }),
                  href: "/(tabs)/price-adjustment",
                  description: intl.formatMessage({
                    id: "priceAdjustmentDesc",
                    defaultMessage:
                      "Adjust product prices globally or by category",
                  }),
                  icon: (
                    <MaterialIcons
                      size={22}
                      color={"white"}
                      name="price-change"
                    />
                  ),
                },
              ]
            : []),
        ]
      : []),
    {
      title: intl.formatMessage({
        id: "privacySecurity",
        defaultMessage: "Privacy & Security",
      }),
      href: "/(tabs)/privacy",
      description: intl.formatMessage({
        id: "privacyDescription",
        defaultMessage: "View privacy and security policies",
      }),
      icon: <Feather size={22} color={"white"} name="shield" />,
    },
    {
      title: intl.formatMessage({
        id: "categories",
        defaultMessage: "Categories",
      }),
      href: "/(tabs)/categories",
      description: intl.formatMessage({
        id: "categoriesDesc",
        defaultMessage: "Organize and manage categories",
      }),
      icon: (
        <MaterialCommunityIcons
          size={22}
          color={"white"}
          name="format-list-bulleted-type"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: "cierreProvisorioTittleSettings",
        defaultMessage: "Cierre Provisorio",
      }),
      href: "/(tabs)/cierre_provisorio",
      description: intl.formatMessage({
        id: "cierreProvisorioDescriptionSettings",
        defaultMessage: "Organiza tus cierres",
      }),
      icon: <Entypo size={22} color={"white"} name="time-slot" />,
    },
    {
      title: intl.formatMessage({
        id: "languageSettings",
        defaultMessage: "Idioma",
      }),
      href: "/(tabs)/language-settings",
      description: intl.formatMessage({
        id: "languageSettingsDesc",
        defaultMessage: "Cambiar idioma de la aplicación",
      }),
      icon: <MaterialIcons size={22} color={"white"} name="language" />,
    },
    {
      title: intl.formatMessage({
        id: "trustedNumberSettingsTitle",
        defaultMessage: "Numeros de confianza",
      }),
      href: "/(tabs)/numbers_trusted",
      description: intl.formatMessage({
        id: "trustedNumberSettingsDesc",
        defaultMessage: "Activa numeros con los cuales no se activará el bot",
      }),
      icon: (
        <IonIcons size={22} color={"white"} name="phone-portrait-outline" />
      ),
    },
    ...(isDelivery && isAdmin
      ? [
          {
            title: intl.formatMessage({
              id: "paymentMethods",
              defaultMessage: "Payment Methods",
            }),
            href: "/(tabs)/paymentMethods",
            description: intl.formatMessage({
              id: "paymentMethodsDesc",
              defaultMessage: "Choose your payment methods, enable and edit it",
            }),
            icon: <IonIcons size={22} color={"white"} name="card-outline" />,
          },
        ]
      : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[styles.header, { backgroundColor: colors.primary }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            <FormattedMessage id="settings" />
          </Text>
        </View>
      </Animated.View>

      <FlatList
        data={settingsPage}
        keyExtractor={(item, index) => item.href || index.toString()}
        renderItem={({ item, index }) => (
          <SettingCard
            item={item}
            index={index}
            isDark={false}
            colors={colors}
            onNavigate={(href) => router.push(href as any)}
          />
        )}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Settings;
