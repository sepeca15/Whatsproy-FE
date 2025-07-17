"use client"

import type React from "react"
import { useRef } from "react"
import { View, Text, TouchableOpacity, Animated } from "react-native"
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons"
import { Image } from "react-native"
import type { IUser } from "../../UsuariosType"
import { Colors } from "@/constants/Coloresuser"
import { styles } from "./UserCardStyles"
import { useIntl, FormattedMessage } from "react-intl"

interface UserCardProps {
  user: IUser
  onEdit: (user: IUser) => void
  onDelete: (userId: number) => void
  currentUserId: number
  allowManage: boolean
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, currentUserId, allowManage }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const isCurrentUser = user.id === currentUserId
  const intl = useIntl()

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const imageKey = `${user.id}-${user.image || "no-image"}-${Date.now()}`

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
      key={imageKey}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={animatePress} style={styles.cardContent}>
        {isCurrentUser && (
          <View style={styles.currentUserBadge}>
            <Text allowFontScaling={false} style={styles.currentUserText}>
              <FormattedMessage id="users.you" defaultMessage="Tú" />
            </Text>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} resizeMode="cover" key={user.image} />
            ) : (
              <View style={styles.avatarBackground}>
                <Text allowFontScaling={false} style={styles.avatarText}>{getInitials(user.nombre)}</Text>
              </View>
            )}

            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: user.activo ? Colors.light.success : Colors.light.danger,
                },
              ]}
            />
          </View>

          <View style={styles.userInfo}>
            <Text allowFontScaling={false} style={styles.userName} numberOfLines={1}>
              {user.nombre}
            </Text>
            <View style={styles.emailContainer}>
              <MaterialIcons name="email" size={14} color={Colors.light.textSecondary} />
              <Text allowFontScaling={false} style={styles.userEmail} numberOfLines={1}>
                {user.correo}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.badgesContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: user.activo ? `${Colors.light.success}20` : `${Colors.light.danger}20`,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: user.activo ? Colors.light.success : Colors.light.danger,
                },
              ]}
            />
            <Text allowFontScaling={false}
              style={[
                styles.statusText,
                {
                  color: user.activo ? Colors.light.success : Colors.light.danger,
                },
              ]}
            >
              <FormattedMessage
                id={user.activo ? "users.status.active" : "users.status.inactive"}
                defaultMessage={user.activo ? "Activo" : "Inactivo"}
              />
            </Text>
          </View>

          {user.isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={12} color={Colors.light.warning} />
              <Text allowFontScaling={false} style={styles.adminText}>
                <FormattedMessage id="users.role.admin" defaultMessage="Admin" />
              </Text>
            </View>
          )}
        </View>

        {allowManage && !isCurrentUser && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => onEdit(user)} activeOpacity={0.7}>
              <Feather name="edit-2" size={16} color={Colors.light.primary} />
              <Text allowFontScaling={false} style={styles.editButtonText}>
                <FormattedMessage id="users.actions.edit" defaultMessage="Editar" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(user.id)} activeOpacity={0.7}>
              <MaterialIcons name="delete-outline" size={16} color="white" />
              <Text allowFontScaling={false} style={styles.deleteButtonText}>
                <FormattedMessage id="users.actions.delete" defaultMessage="Eliminar" />
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isCurrentUser && (
          <View style={styles.currentUserIndicator}>
            <Ionicons name="person" size={16} color={Colors.light.primary} />
            <Text allowFontScaling={false} style={styles.currentUserIndicatorText}>
              <FormattedMessage id="users.yourProfile" defaultMessage="Tu perfil" />
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

export default UserCard
