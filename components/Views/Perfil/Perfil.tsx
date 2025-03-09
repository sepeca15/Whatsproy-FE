"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { HStack, VStack, Avatar, IconButton, Icon } from "native-base"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { styles } from "./PerfilStyles"
import { FormattedMessage } from "react-intl"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { profileData as defaultProfileData } from "./components/profileData"

const Perfil: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<{
    id: number
    nombre: string
    apellido: string
    correo: string
    image: string
    hora_apertura: string
    hora_cierre: string
    id_empresa: number
    id_rol: number
  } | null>(null)
  const [profileData, setProfileData] = useState(defaultProfileData)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Error retrieving user data:", error)
      }
    }
    fetchUser()
  }, [])

  return (
    <View style={styles.container}>
      <HStack style={styles.header} alignItems="center" justifyContent="space-between">
        <HStack alignItems="center">
          <TouchableOpacity>
            <Avatar
              size="md"
              source={{ uri: user?.image }}
            />
          </TouchableOpacity>
          <VStack marginLeft={3}>
            <Text style={styles.name}>{user?.nombre || "Usuario"}</Text>
            <Text style={styles.plan}>
              <FormattedMessage id="plan" defaultMessage="Plan" />: {profileData?.plan || "Free"}
            </Text>
          </VStack>
        </HStack>
        <IconButton
          icon={<Icon as={Ionicons} name="settings-outline" size="md" />}
          onPress={() => router.push("/(tabs)/config")}
        />
      </HStack>
      <View style={styles.content}>
        <Text style={styles.inProgress}>En progreso skrrr brr, anasheee </Text>
      </View>
    </View>
  )
}

export default Perfil