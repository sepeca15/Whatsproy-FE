"use client"

import { useState } from "react"
import { Pressable } from "react-native"
import { Box, HStack, VStack, Progress, Text, Icon, Collapse } from "native-base"
import { MaterialIcons } from "@expo/vector-icons"
import { FormattedMessage, useIntl } from "react-intl"
import moment from "moment"
import { EMPRESA_PAYMENT_FREE_TIME_AFTER_CANCEL } from "@/constants/variables"
import * as Animatable from "react-native-animatable"
import { Colors } from "../constants/Colors"

interface SubscriptionInfoProps {
  currentPedidosMonthActual: number
  plan: string
  maxPedidos?: number
  expiryDate?: string
  isCancelled?: boolean
  benefits?: string[]
  onViewDetails?: () => void
}

const SubscriptionInfo = ({
  currentPedidosMonthActual = 0,
  plan = "-",
  maxPedidos = 100,
  expiryDate,
  isCancelled = false,
  benefits = [],
  onViewDetails,
}: SubscriptionInfoProps) => {
  const intl = useIntl()
  const [isExpanded, setIsExpanded] = useState(false)
  const percentage = Math.min(Math.round((currentPedidosMonthActual / maxPedidos) * 100), 100)
  const remaining = maxPedidos - currentPedidosMonthActual

  // Determinar el color de la barra de progreso basado en el porcentaje
  const getProgressColor = () => {
    if (percentage < 70) return Colors.light.secondary
    if (percentage < 90) return "orange.500"
    return "red.500"
  }

  const formattedExpiryDate = expiryDate
    ? moment(expiryDate).add(EMPRESA_PAYMENT_FREE_TIME_AFTER_CANCEL, "days").format("LL")
    : "-"

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Pressable onPress={toggleExpand}>
     
        <Box
          bg="white"
          borderRadius="md"
          px={4}
          py={3}
          mb={3}
         
          borderColor={isExpanded ? `rgba(7, 94, 84, 0.1)` : "transparent"}
          borderWidth={1}
        >
          {/* Vista Minimalista (Siempre visible) */}
          <HStack justifyContent="space-between" alignItems="center" mb={2}>
            <HStack space={2} alignItems="center">
              <Icon as={MaterialIcons} name="stars" size="sm" color={Colors.light.primary} />
              <Text fontSize="sm" color={Colors.light.text} fontWeight="medium">
                {plan}
              </Text>
            </HStack>
            <HStack space={2} alignItems="center">
              <Text fontSize="sm" color={getProgressColor()} fontWeight="medium">
                {currentPedidosMonthActual}/{maxPedidos}
              </Text>
              <Icon
                as={MaterialIcons}
                name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size="sm"
                color={Colors.light.icon}
              />
            </HStack>
          </HStack>

          <Progress
            value={percentage}
            size="sm"
            bg="gray.200"
            _filledTrack={{
              bg: getProgressColor(),
            }}
          />

          {/* Información de pedidos restantes (visible cuando no está expandido) */}
          {!isExpanded && (
            <HStack justifyContent="flex-end" mt={2} alignItems="center">
              <Icon as={MaterialIcons} name="info-outline" size="xs" color={Colors.light.icon} mr={1} />
              <Text fontSize="xs" color={Colors.light.icon}>
                <FormattedMessage
                  id="subscription.remaining"
                  defaultMessage="Te quedan {count} pedidos"
                  values={{ count: remaining }}
                />
              </Text>
            </HStack>
          )}

          {/* Información Expandida */}
          <Collapse isOpen={isExpanded}>
            <VStack space={2} mt={3} pt={2} borderTopWidth={1} borderTopColor="gray.100">
              {/* Información de pedidos restantes (visible cuando está expandido) */}
              <HStack space={2} alignItems="center">
                <Icon as={MaterialIcons} name="info-outline" size="xs" color={getProgressColor()} />
                <Text fontSize="xs" color={getProgressColor()} fontWeight="medium">
                  <FormattedMessage
                    id="subscription.remaining"
                    defaultMessage="Te quedan {count} pedidos disponibles"
                    values={{ count: remaining }}
                  />
                </Text>
              </HStack>

              {/* Fecha de expiración */}
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize="xs" color={Colors.light.icon}>
                  <FormattedMessage id="subscription.validUntil" defaultMessage="Válido hasta:" />
                </Text>
                <Text fontSize="xs" fontWeight="medium" color={Colors.light.text}>
                  {formattedExpiryDate}
                </Text>
              </HStack>

              {/* Estado de cancelación */}
              {isCancelled && (
                <Box bg="gray.100" borderRadius="sm" p={2} my={1}>
                  <Text fontSize="xs" color={Colors.light.icon} textAlign="center">
                    <FormattedMessage
                      id="subscriptionCancelledUntil"
                      defaultMessage="Cancelada, válida hasta {date}"
                      values={{ date: formattedExpiryDate }}
                    />
                  </Text>
                </Box>
              )}

              {/* Beneficios (si hay) */}
              {benefits && benefits.length > 0 && (
                <VStack space={1} mt={1}>
                  <Text fontSize="xs" fontWeight="medium" color={Colors.light.text}>
                    <FormattedMessage id="benefits" defaultMessage="Beneficios:" />
                  </Text>
                  {benefits.slice(0, 2).map((benefit, idx) => (
                    <HStack key={idx} space={1} alignItems="center">
                      <Icon as={MaterialIcons} name="check" size="xs" color={Colors.light.secondary} />
                      <Text fontSize="xs" color={Colors.light.icon}>
                        {benefit.trim()}
                      </Text>
                    </HStack>
                  ))}
                  {benefits.length > 2 && (
                    <Text fontSize="xs" color={Colors.light.primary} textAlign="right" onPress={onViewDetails}>
                      <FormattedMessage id="viewMore" defaultMessage="Ver más..." />
                    </Text>
                  )}
                </VStack>
              )}

              {/* Botón para ver detalles completos */}
              <Pressable onPress={onViewDetails}>
                <Box bg={`rgba(7, 94, 84, 0.05)`} borderRadius="sm" p={2} mt={2} alignItems="center">
                  <Text fontSize="xs" color={Colors.light.primary}>
                    <FormattedMessage id="viewSubscriptionDetails" defaultMessage="Ver detalles completos" />
                  </Text>
                </Box>
              </Pressable>
            </VStack>
          </Collapse>
        </Box>
     
    </Pressable>
  )
}

export default SubscriptionInfo
