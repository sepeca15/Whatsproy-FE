"use client"

import type React from "react"
import { useRef } from "react"
import { View, Text, TouchableOpacity, Animated, Alert } from "react-native"
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons"
import { Image } from "react-native"
import type { IUser } from "../../UsuariosType"
import { Colors } from "@/constants/Coloresuser"
import { styles } from "./UserCardStyles"

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

  const handleDelete = () => {
    Alert.alert("Eliminar Usuario", `¿Estás seguro de que deseas eliminar a ${user.nombre}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => onDelete(user.id),
      },
    ])
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={animatePress} style={styles.cardContent}>
        {/* Current User Badge */}
        {isCurrentUser && (
          <View style={styles.currentUserBadge}>
            <Text style={styles.currentUserText}>Tú</Text>
          </View>
        )}

        {/* Header with Avatar and Info */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={styles.avatarBackground}>
                <Text style={styles.avatarText}>{getInitials(user.nombre)}</Text>
              </View>
            )}

            {/* Status Indicator */}
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
            <Text style={styles.userName} numberOfLines={1}>
              {user.nombre}
            </Text>
            <View style={styles.emailContainer}>
              <MaterialIcons name="email" size={14} color={Colors.light.textSecondary} />
              <Text style={styles.userEmail} numberOfLines={1}>
                {user.correo}
              </Text>
            </View>
          </View>
        </View>

        {/* Status and Role Badges */}
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
            <Text
              style={[
                styles.statusText,
                {
                  color: user.activo ? Colors.light.success : Colors.light.danger,
                },
              ]}
            >
              {user.activo ? "Activo" : "Inactivo"}
            </Text>
          </View>

          {user.isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={12} color={Colors.light.warning} />
              <Text style={styles.adminText}>Admin</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {allowManage && !isCurrentUser && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => onEdit(user)} activeOpacity={0.7}>
              <Feather name="edit-2" size={16} color={Colors.light.primary} />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
              <MaterialIcons name="delete-outline" size={16} color="white" />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}

        {isCurrentUser && (
          <View style={styles.currentUserIndicator}>
            <Ionicons name="person" size={16} color={Colors.light.primary} />
            <Text style={styles.currentUserIndicatorText}>Tu perfil</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

export default UserCard
