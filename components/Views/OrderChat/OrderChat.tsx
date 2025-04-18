"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useColorMode, 
  View,
  Text,
  ScrollView,
  VStack,
  Box,
  HStack,
  Avatar,
  Spinner,
  Divider,
  Icon,
  Pressable,
  StatusBar,
} from "native-base"
import { useLocalSearchParams } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import api from "@/services/api/admin"
import { styles } from "./OrderChatStyles"
import { Colors } from "@/constants/Colors"

interface Message {
  id: number
  mensaje: string
  isClient: boolean
  createdAt: string
}

interface ChatInfo {
  clientName: string
  orderNumber: string
  avatarUrl?: string
}

const OrderChat: React.FC = () => {
  const { chatId } = useLocalSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInfo, setChatInfo] = useState<ChatInfo>({
    clientName: "Cliente",
    orderNumber: "Orden #0000",
  })
  const [loading, setLoading] = useState(true)
  const { colorMode } = useColorMode()

  // Usar los colores según el modo actual
  const colors = colorMode === "dark" ? Colors.dark : Colors.light

  // Colores dinámicos basados en el modo de color
  const bgColor = colorMode === "dark" ? colors.background : colors.background
  const textColor = colorMode === "dark" ? colors.text : colors.text
  const subtextColor = colorMode === "dark" ? "coolGray.400" : "coolGray.500"
  const dividerColor = colorMode === "dark" ? "coolGray.700" : "coolGray.300"
  const footerBgColor = colorMode === "dark" ? "coolGray.900" : "coolGray.100"

  const getMensages = async () => {
    setLoading(true)
    try {
      const response = await api.chat.getChatMessages(Number(chatId))
      if (response.ok) {
        console.log("Mensajes recibidos =>", response.data)

        const fetchedMessages: Message[] = response.data.mensajes.map((msg: any) => ({
          id: msg.id,
          mensaje: msg.mensaje,
          isClient: msg.isClient,
          createdAt: msg.createdAt,
        }))

        setMessages(fetchedMessages)

        // Obtener información del cliente si está disponible en la respuesta
        if (response.data.clientInfo) {
          setChatInfo({
            clientName: response.data.clientInfo.name || `Cliente #${chatId}`,
            orderNumber: response.data.clientInfo.orderNumber || `Orden #${chatId}`,
            avatarUrl: response.data.clientInfo.avatarUrl,
          })
        } else {
          // Información por defecto si no hay datos del cliente
          setChatInfo({
            clientName: `Cliente #${chatId}`,
            orderNumber: `Orden #${chatId}`,
          })
        }
      }
    } catch (error) {
      console.error("Error al obtener los mensajes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMensages()
  }, [chatId])

  // Agrupar mensajes por fecha
  const groupMessagesByDate = () => {
    const groups: { [date: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate()

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Formatear hora
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={colorMode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header con avatar y nombre del cliente */}
      <HStack
        space={3}
        alignItems="center"
        bg={colors.primary}
        px={4}
        py={3}
        borderBottomWidth={1}
        borderBottomColor={colors.secondary}
        safeAreaTop
      >
        <Pressable onPress={() => console.log("Volver atrás")}>
          <Icon as={MaterialIcons} name="arrow-back" size="md" color="white" />
        </Pressable>

        <Avatar size="md" bg={colors.secondary} source={{ uri: "https://cdn-icons-png.freepik.com/512/3607/3607444.png" }}>
          {chatInfo.clientName.substring(0, 2).toUpperCase()}
        </Avatar>

        <VStack>
          <Text bold fontSize="md" color="white">
            {chatInfo.clientName}
          </Text>
          <Text fontSize="xs" color="white" opacity={0.8}>
            {chatInfo.orderNumber}
          </Text>
        </VStack>
      </HStack>

      {/* Contenido del chat */}
      {loading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color={colors.primary} />
          <Text mt={2} color={subtextColor}>
            Cargando historial...
          </Text>
        </View>
      ) : (
        <ScrollView flex={1} contentContainerStyle={{ padding: 10 }}>
          {Object.keys(messageGroups).length > 0 ? (
            Object.entries(messageGroups).map(([date, dateMessages]) => (
              <VStack key={date} space={3} mb={6}>
                {/* Separador de fecha */}
                <HStack space={2} justifyContent="center" alignItems="center" my={2}>
                  <Divider flex={1} bg={dividerColor} />
                  <Text fontSize="xs" color={subtextColor} bg={bgColor} px={2}>
                    {formatDate(dateMessages[0].createdAt)}
                  </Text>
                  <Divider flex={1} bg={dividerColor} />
                </HStack>

                {/* Mensajes del día */}
                {dateMessages.map((msg) => (
                  <Box
                    key={msg.id}
                    alignSelf={msg.isClient ? "flex-end" : "flex-start"}
                    bg={msg.isClient ? colors.secondary : footerBgColor}
                    px={4}
                    py={2}
                    borderRadius={12}
                    maxW="80%"
                    shadow={1}
                    borderTopRightRadius={msg.isClient ? 4 : 12}
                    borderTopLeftRadius={msg.isClient ? 12 : 4}
                  >
                    <Text color={msg.isClient ? "white" : textColor}>{msg.mensaje}</Text>
                    <Text
                      fontSize="2xs"
                      color={msg.isClient ? "white" : subtextColor}
                      opacity={msg.isClient ? 0.8 : 1}
                      alignSelf="flex-end"
                      mt={1}
                    >
                      {formatTime(msg.createdAt)}
                    </Text>
                  </Box>
                ))}
              </VStack>
            ))
          ) : (
            <Box flex={1} justifyContent="center" alignItems="center" mt={10}>
              <Text color={subtextColor}>No hay mensajes en este chat</Text>
            </Box>
          )}
        </ScrollView>
      )}

      {/* Nota informativa */}
      <Box bg={footerBgColor} p={3} borderTopWidth={1} borderTopColor={dividerColor}>
        <Text fontSize="xs" color={subtextColor} textAlign="center">
          Este es un historial de chat. La conversación está cerrada.
        </Text>
      </Box>
    </View>
  )
}

export default OrderChat
