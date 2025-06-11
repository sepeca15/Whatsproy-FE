

import type React from "react"
import { useEffect, useState } from "react"
import {
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
  StatusBar,
} from "native-base"
import { useLocalSearchParams, router } from 'expo-router'
import { AntDesign } from "@expo/vector-icons"
import api from "@/services/api/admin"
import { styles } from "./OrderChatStyles"
import { Colors } from "@/constants/Colors"
import { TouchableOpacity } from "react-native"
import { FormattedMessage } from "react-intl"

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

  const { primary, secondary, background, text } = Colors.light
  const subtextColor = "coolGray.500"
  const dividerColor = "coolGray.300"
  const footerBgColor = "coolGray.100"

  const getMensages = async () => {
    setLoading(true)
    try {
      const response = await api.chat.getChatMessages(Number(chatId))
      if (response.ok) {
        const fetchedMessages: Message[] = response.data.mensajes.map((msg: any) => ({
          id: msg.id,
          mensaje: msg.mensaje,
          isClient: msg.isClient,
          createdAt: msg.createdAt,
        }))

        setMessages(fetchedMessages)

        if (response.data.clientInfo) {
          setChatInfo({
            clientName: response.data.clientInfo.name || `Cliente #${chatId}`,
            orderNumber: response.data.clientInfo.orderNumber || `Orden #${chatId}`,
            avatarUrl: response.data.clientInfo.avatarUrl,
          })
        } else {
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

  const groupMessagesByDate = () => {
    const groups: { [date: string]: Message[] } = {}

    // Ordenar mensajes cronológicamente (más antiguos primero)
    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    sortedMessages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Hoy"
    if (date.toDateString() === yesterday.toDateString()) return "Ayer"
    return date.toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar barStyle="light-content" backgroundColor={primary} />

      <HStack
        space={3}
        alignItems="center"
        bg={primary}
        px={4}
        py={3}
        borderBottomWidth={1}
        borderBottomColor={secondary}
        safeAreaTop
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={22} color="white" />
        </TouchableOpacity>

        <Avatar size="md" bg={secondary} source={{ uri: chatInfo.avatarUrl || undefined }}>
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

      {loading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color={primary} />
          <Text mt={2} color={subtextColor}>
            Cargando historial...
          </Text>
        </View>
      ) : (
        <ScrollView flex={1} contentContainerStyle={{ padding: 10 }}>
          {Object.keys(messageGroups).length > 0 ? (
            Object.entries(messageGroups)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()) // ordenar fechas
              .map(([date, dateMessages]) => (
                <VStack key={date} space={3} mb={6}>
                  <HStack space={2} justifyContent="center" alignItems="center" my={2}>
                    <Divider flex={1} bg={dividerColor} />
                    <Text fontSize="xs" color={subtextColor} bg={background} px={2}>
                      {formatDate(dateMessages[0].createdAt)}
                    </Text>
                    <Divider flex={1} bg={dividerColor} />
                  </HStack>

                  {dateMessages.map((msg) => (
                    <Box
                      key={msg.id}
                      alignSelf={msg.isClient ? "flex-end" : "flex-start"}
                      bg={msg.isClient ? secondary : footerBgColor}
                      px={4}
                      py={2}
                      borderRadius={12}
                      maxW="80%"
                      shadow={1}
                      borderTopRightRadius={msg.isClient ? 4 : 12}
                      borderTopLeftRadius={msg.isClient ? 12 : 4}
                    >
                      <Text color={msg.isClient ? "white" : text}>{msg.mensaje}</Text>
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

      <Box bg={footerBgColor} p={3} borderTopWidth={1} borderTopColor={dividerColor}>
        <Text fontSize="xs" color={subtextColor} textAlign="center">
          <FormattedMessage id="orderChat.footerText" defaultMessage="Powered by Your Company" />
        </Text>
      </Box>
    </View>
  )
}

export default OrderChat
