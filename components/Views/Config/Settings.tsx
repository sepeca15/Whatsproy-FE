import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import IonIcons from "react-native-vector-icons/Ionicons";
import CustomText from "@/components/CustomText";
import { Center } from "native-base";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import styles from "./SettingsStyles";
const settingsPage = [
  {
    title: "generalSettings",
    href: "/(tabs)/generalSettings",
    description: "manageHours",
    icon: <Feather size={20} color={"white"} name="settings" />,
  },
  {
    title: "user",
    href: "/(tabs)/usuarios",
    description: "createUsers",
    icon: <FontAwesome5 name="users" size={20} color={"white"} />,
  },
  {
    title: "notifications",
    href: "",
    description: "notificationsDescription",
    icon: <IonIcons name="notifications-outline" size={20} color={"white"} />,
  },
  {
    title: "privacySecurity",
    href: "",
    description: "privacyDescription",
    icon: <Feather size={20} color={"white"} name="shield" />,
  },
  {
    title: "membership",
    href: "",
    description: "membershipDescription",
    icon: <AntDesign name="creditcard" size={20} color={"white"} />,
  },
  {
    title: "orderData",
    href: "/(tabs)/datosPedido",
    description: "orderDataDescription",
    icon: <IonIcons size={20} color={"white"} name="newspaper-outline" />,
  },
  {
    title: "categories",
    href: "/(tabs)/categories",
    description: "categoriesDesc",
    icon: <MaterialCommunityIcons size={20} color={"white"} name="format-list-bulleted-type" />,
  },
];

const Settings = () => {
  const router = useRouter();
  return (
    <Center style={styles.father}>
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.title}>
          <CustomText
            style={{
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              color: "white",
            }}
          >
            <FormattedMessage id="settings" />
          </CustomText>
        </View>
        <View style={styles.containerItems}>
          {settingsPage.map((item: any, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => router.push(item.href)}

              >
                <View style={styles.row}>
                  <View style={styles.rounded}>{item.icon}</View>
                  <View style={styles.col}>
                    <Text style={styles.cardText}>
                      <FormattedMessage id={item.title} />
                    </Text>
                    <CustomText style={styles.textDesc}>
                      <FormattedMessage id={item.description} />
                    </CustomText>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      </ScrollView>
    </Center>
  );
};


export default Settings;
