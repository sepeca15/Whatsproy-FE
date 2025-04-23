"use client"

import React, { useRef } from "react"
import { View, Text, Animated, TouchableOpacity } from "react-native"
import styles from "./UserCardStyles"
import FatherIcon from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { IUser } from "../../UsuariosType";
import api from "@/services/api/admin"
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction"
import { useUser } from "@/hooks/redux/useUser"
import { useToastContext } from "@/contexts/ToastContext"
import { useIntl } from "react-intl"
import { Image } from "native-base"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"

interface IUserCard {
  infoUser: IUser
  deleteUser: (id: number) => void
  selectEditUser: (user: any) => void
  allowManage: boolean
}

const UserCard = ({ infoUser, deleteUser, selectEditUser, allowManage }: IUserCard) => {
  const [stateModal, setStateModal] = React.useState<boolean>(false)
  const { user } = useUser()
  const { showToast } = useToastContext()
  const intl = useIntl()

  // Animation references
  const scaleAnim = useRef(new Animated.Value(1)).current
  const shadowAnim = useRef(new Animated.Value(2)).current

  const onDeleteUser = async () => {
    try {
      const resp = await api.user.delete(infoUser.id)
      if (resp.ok) {
        deleteUser(infoUser.id)
        showToast({
          title: intl.formatMessage({
            id: "userDeleted",
            defaultMessage: "User deleted successfully",
          }),
          status: "success",
        })
      }
    } catch (error: any) {
      console.log("error")
      showToast({
        title: error.response.data.message,
        status: "error",
      })
    }
  }

  const toggleModal = () => {
    setStateModal((prevState) => !prevState)
  }

  const handlePressIn = () => {
    // Scale animation can use native driver
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start()

    // Shadow animation must use JS driver
    Animated.timing(shadowAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start()
  }

  const handlePressOut = () => {
    // Scale animation can use native driver
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start()

    // Shadow animation must use JS driver
    Animated.timing(shadowAnim, {
      toValue: 2,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  // Dynamic shadow style based on animation
  const animatedShadowStyle = {
    shadowOffset: { width: 0, height: shadowAnim },
    shadowOpacity: shadowAnim.interpolate({
      inputRange: [1, 2],
      outputRange: [0.1, 0.2],
    }),
    shadowRadius: shadowAnim.interpolate({
      inputRange: [1, 2],
      outputRange: [2, 4],
    }),
  }

  const isActive = infoUser.activo
  const statusColor = isActive ? "#4CAF50" : "#FF5722"
  const isCurrentUser = user.id === infoUser.id

  return (
    <View style={styles.containerOuter}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: scaleAnim }],
            shadowOffset: {
              width: 0,
              height: shadowAnim,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
        ]}
      >
        {isCurrentUser && (
          <View style={styles.currentUserBadge}>
            <Text style={styles.currentUserText}>{intl.formatMessage({ id: "me", defaultMessage: "Me" })}</Text>
          </View>
        )}

        <View style={styles.data}>
          <View style={styles.row}>
            <View style={styles.avatarContainer}>
              {infoUser.photo ? (
                <Image alt="User avatar" source={{ uri: infoUser.photo }} style={styles.avatarImage} />
              ) : (
                <LinearGradient colors={[Colors.light.primary, Colors.light.secondary]} style={styles.avatarGradient}>
                  <Text style={styles.avatarText}>{infoUser.nombre.charAt(0).toUpperCase()}</Text>
                </LinearGradient>
              )}
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.textName}>
                {isCurrentUser ? intl.formatMessage({ id: "me", defaultMessage: "Me" }) : infoUser.nombre}
              </Text>
              <Text style={styles.textCorreo}>{infoUser.correo}</Text>

              <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {isActive
                    ? intl.formatMessage({ id: "active", defaultMessage: "Active" })
                    : intl.formatMessage({ id: "inactive", defaultMessage: "Inactive" })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {allowManage ? (
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => selectEditUser(infoUser)} style={styles.buttonEdit} activeOpacity={0.7}>
              <FatherIcon name="edit-2" size={14} color={"#000035"} />
              <Text style={styles.textEdit}>{intl.formatMessage({ id: "edit", defaultMessage: "Edit" })}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isCurrentUser}
              onPress={toggleModal}
              style={isCurrentUser ? styles.disabledDelete : styles.buttonDelete}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="delete-empty" size={16} color={"white"} />
              <Text style={styles.textDelete}>{intl.formatMessage({ id: "delete", defaultMessage: "Delete" })}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noPermissionText}>
            {intl.formatMessage({
              id: "noPermission",
              defaultMessage: "You do not have permission to manage users",
            })}
          </Text>
        )}
      </Animated.View>

      <ModalConfirmAction
        isOpen={stateModal}
        onContinue={onDeleteUser}
        onClose={toggleModal}
        message={intl.formatMessage({
          id: "confirmDeleteUser",
          defaultMessage: "Do you want to delete the selected user?",
        })}
        title={intl.formatMessage({
          id: "deleteUser",
          defaultMessage: "Delete User",
        })}
      />
    </View>
  )
}

export default UserCard
