
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, Modal, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from "react-native"
import { HStack, VStack, Avatar, IconButton, Icon } from "native-base"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { styles } from "./PerfilStyles"
import { FormattedMessage } from "react-intl"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { profileData as defaultProfileData } from "./components/profileData"
import SalesOverview from "./components/SaleOverview/SalesOverview"
import CategorySales from "./components/CategorySales"
import api from "@/services/api/admin"
import { Colors } from "../../../constants/Colors"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import SalesChart from "./components/SalesChart"
import QuickActions from "./components/QuickActions"


const Perfil: React.FC = () => {
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
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
  const [salesPeriod, setSalesPeriod] = useState("mensual")
  const [profileData, setProfileData] = useState(defaultProfileData)
  const [pedidos, setPedidos] = useState(0)
  const [resumenVentas, setResumenVentas] = useState<{
    weekly: number
    monthly: number
    quarterly: number
    yearly: number
  } | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const isFetching = useRef(false)
  const [loading, setLoading] = useState(true)

  const [valorPrueba, setValorPrueba] = useState<{
    labels: string[]
    sales: number[]
  }>({
    labels: [],
    sales: [],
  })

  // Datos de ventas simulados
  const resumenVentasData = {
    weeklySales: [1, 2, 3, 4, 5, 6, 7],
    weeklyLabels: ["week1", "week2", "week3", "week4", "wee5", "week6", "week7"],

    monthlySales: [12500, 14200, 13800, 15750, 16300, 15200, 16000, 17000, 18000, 19000, 20000, 21000],
    monthlyLabels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],

    quarterlySales: [11, 22, 33, 44],
    quarterlyLabels: ["Q1", "Q2", "Q3", "Q4"],

    yearlySales: [3333333, 14244400, 13444800, 155555750],
    yearlyLabels: ["2021", "2022", "2023", "2024"],
  }

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const res = await api.perfil.getResumenVentas()

      setResumenVentas(res)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching profile data:", error)
    }
  }

  const handleRefresh = async () => {
    if (isFetching.current) return
    setRefreshing(true)
    isFetching.current = true

    await Promise.all([fetchProfileData()])

    setRefreshing(false)
    isFetching.current = false
  }

  useEffect(() => {
    fetchProfileData()

    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error retrieving user data:", error)
        router.push("/login")
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {

    if (resumenVentas) {

      switch (salesPeriod) {
        case "semanal":
          setPedidos(resumenVentas.weekly)
          setValorPrueba({
            labels: resumenVentasData.weeklyLabels,
            sales: resumenVentasData.weeklySales,
          })
          break
        case "mensual":
          setPedidos(resumenVentas.monthly)
          setValorPrueba({
            labels: resumenVentasData.monthlyLabels,
            sales: resumenVentasData.monthlySales,
          })
          break
        case "trimestral":
          setPedidos(resumenVentas.quarterly)
          setValorPrueba({
            labels: resumenVentasData.quarterlyLabels,
            sales: resumenVentasData.quarterlySales,
          })
          break
        case "anual":
          setPedidos(resumenVentas.yearly)
          setValorPrueba({
            labels: resumenVentasData.yearlyLabels,
            sales: resumenVentasData.yearlySales,
          })

          break
        default:

          break


      }
    } else {
      setPedidos(0)
      setValorPrueba({
        labels: [],
        sales: [],
      })
    }

  }, [salesPeriod, resumenVentas])

  return (
    <View style={styles.container}>
      {/* Header simplificado pero mejorado */}
      <Animated.View style={styles.header}>
        <View style={styles.headerRow}>
          <HStack alignItems="center">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View style={styles.avatarContainer}>
                <Avatar
                  size="md"
                  source={{
                    uri: user?.image,
                  }}
                />
              </View>
            </TouchableOpacity>
            <VStack marginLeft={3}>
              <Text style={styles.name}>{user?.nombre || "Usuario"}</Text>
              <Text style={styles.plan}>
                <FormattedMessage id="plan" defaultMessage="Plan" />: {profileData?.plan || "Free"}
              </Text>
            </VStack>
          </HStack>
          <IconButton
            icon={<Icon as={Ionicons} name="settings-outline" size="md" color="white" />}
            onPress={() => {
              router.push("/(tabs)/config")
            }}
          />
        </View>
      </Animated.View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} style={styles.loader} />
      ) : (
        <>
          <ScrollView
            style={styles.content}
            contentContainerStyle={[styles.contentContainer, { paddingBottom: 20 }]} // no demasiado grande
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.light.primary} />
            }
          >

            <View style={styles.contentContainer}>


              <Animated.View
                entering={FadeInDown.delay(100)}
                style={{ minHeight: 200 }}
              >

                <SalesOverview
                  totalSales={pedidos ? pedidos : 0}
                  previousPeriodSales={12500}
                  averageSale={125}
                  currency="$"
                  period={salesPeriod}
                />


              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200)}>
                <SalesChart
                  monthlySales={valorPrueba.sales}
                  labels={valorPrueba.labels}
                  period={salesPeriod}
                  onPeriodChange={(value) => setSalesPeriod(value)}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300)}>
                <CategorySales
                  currency="$"
                  totalSales={15750}
                  categories={[
                    {
                      id: "1",
                      name: "Hamburguesas",
                      sales: 5250,
                      percentage: 33,
                      color: Colors.light.primary,
                      icon: "fast-food-outline",
                    },
                    {
                      id: "2",
                      name: "Choris",
                      sales: 4200,
                      percentage: 27,
                      color: Colors.light.secondary,
                      icon: "pizza-outline",
                    },

                    {
                      id: "3",
                      name: "Milas",
                      sales: 3150,
                      percentage: 20,
                      color: "#25d366",
                      icon: "restaurant-outline",
                    },

                    {
                      id: "4",
                      name: "Gramajos",
                      sales: 1575,
                      percentage: 10,
                      color: "#34b7f1",
                      icon: "fast-food-outline",
                    },

                    {
                      id: "5",
                      name: "Otros",
                      sales: 1575,
                      percentage: 10,
                      color: Colors.light.icon,
                      icon: "ellipsis-horizontal-outline",
                    },
                  ]}
                />
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(500)}>
                <QuickActions />
              </Animated.View>
            </View>
          </ScrollView>
        </>
      )
      }

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Avatar
                size="2xl"
                source={{
                  uri: user?.image,
                }}
                style={styles.largeAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View >
  )
}

export default Perfil
