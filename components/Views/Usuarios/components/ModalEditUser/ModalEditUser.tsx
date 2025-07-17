"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { Image } from "react-native"
import type { IUser } from "../../UsuariosType"
import { Colors } from "@/constants/Coloresuser"
import { styles } from "./ModalEditUserStyles"
import useImagePicker from "@/utils/ImagePicker/useImagePicker"
import { useIntl, FormattedMessage } from "react-intl"

interface EditProfileModalProps {
  visible: boolean
  onClose: () => void
  user: IUser
  onUpdateUser: (user: IUser) => Promise<void>
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    photo: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const intl = useIntl()

  const { pickImage, imageUri, setImageUri, loadingUpload } = useImagePicker({
    toastErrorMessage: intl.formatMessage({
      id: "profile.imagePickerError",
      defaultMessage: "Error al seleccionar la imagen",
    }),
    onImagePicked: (data) => {
      if (data.apiUrl) {
        setFormData((prev) => ({ ...prev, photo: data.apiUrl || "" }))
      }
    },
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        photo: user.image || "",
      })
      setImageUri(user.image || null)
    }
  }, [user, setImageUri])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = intl.formatMessage({
        id: "profile.validation.nameRequired",
        defaultMessage: "El nombre es requerido",
      })
    }

    if (!formData.correo.trim()) {
      newErrors.correo = intl.formatMessage({
        id: "profile.validation.emailRequired",
        defaultMessage: "El email es requerido",
      })
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = intl.formatMessage({
        id: "profile.validation.emailInvalid",
        defaultMessage: "El email no es válido",
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true)
      try {
        await onUpdateUser({
          ...user,
          ...formData,
          image: formData.photo,
        })
        setErrors({})
      } catch (error) {
        // Error handling is done in parent component
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const currentImageUri = imageUri || formData.photo || user.image

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} disabled={isLoading}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.headerTitle}>
              <FormattedMessage id="profile.title" defaultMessage="Mi Perfil" />
            </Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.profileBanner}>
              <Ionicons name="person-circle" size={24} color={Colors.light.primary} />
              <View style={styles.bannerContent}>
                <Text allowFontScaling={false} style={styles.bannerTitle}>
                  <FormattedMessage
                    id="profile.banner.title"
                    defaultMessage="Editar mi información personal"
                  />
                </Text>
                <Text allowFontScaling={false} style={styles.bannerSubtitle}>
                  <FormattedMessage id="profile.banner.subtitle" defaultMessage="Actualiza tu perfil y foto" />
                </Text>
              </View>
            </View>

            <View style={styles.photoSection}>
              <Text allowFontScaling={false} style={styles.label}>
                <FormattedMessage id="profile.photo.label" defaultMessage="Foto de perfil" />
              </Text>
              <View style={styles.photoContainer}>
                <View style={styles.photoWrapper}>
                  {currentImageUri ? (
                    <Image source={{ uri: currentImageUri }} style={styles.profilePhoto} resizeMode="cover" />
                  ) : (
                    <View style={styles.defaultAvatar}>
                      <Text allowFontScaling={false} style={styles.avatarText}>{getInitials(formData.nombre || user.nombre)}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={() => pickImage(setFormData)}
                    activeOpacity={0.7}
                    disabled={isLoading}
                  >
                    <Ionicons name="camera" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.photoActions}>
                  <TouchableOpacity
                    style={styles.changePhotoButton}
                    onPress={() => pickImage(setFormData)}
                    activeOpacity={0.7}
                    disabled={isLoading}
                  >
                    <Ionicons name="image-outline" size={16} color={Colors.light.primary} />
                    <Text allowFontScaling={false} style={styles.changePhotoText}>
                      <FormattedMessage id="profile.photo.change" defaultMessage="Cambiar foto" />
                    </Text>
                  </TouchableOpacity>
                  {currentImageUri && (
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => {
                        setImageUri(null)
                        setFormData((prev) => ({ ...prev, photo: "" }))
                      }}
                      activeOpacity={0.7}
                      disabled={isLoading}
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.light.danger} />
                      <Text allowFontScaling={false} style={styles.removePhotoText}>
                        <FormattedMessage id="profile.photo.remove" defaultMessage="Eliminar" />
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text allowFontScaling={false} style={styles.label}>
                <FormattedMessage id="profile.name.label" defaultMessage="Nombre completo" />
              </Text>
              <View style={[styles.inputContainer, errors.nombre && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color={Colors.light.textSecondary} />
                <Text allowFontScaling={false}Input
                  style={styles.input}
                  placeholder={intl.formatMessage({
                    id: "profile.name.placeholder",
                    defaultMessage: "Ingresa tu nombre completo",
                  })}
                  value={formData.nombre}
                  onChangeText={(text) => handleInputChange("nombre", text)}
                  placeholderTextColor={Colors.light.textSecondary}
                  editable={!isLoading}
                />
              </View>
              {errors.nombre && <Text allowFontScaling={false} style={styles.errorText}>{errors.nombre}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text allowFontScaling={false} style={styles.label}>
                <FormattedMessage id="profile.email.label" defaultMessage="Email" />
              </Text>
              <View style={[styles.inputContainer, errors.correo && styles.inputError]}>
                <MaterialIcons name="email" size={20} color={Colors.light.textSecondary} />
                <Text allowFontScaling={false}Input
                  style={styles.input}
                  placeholder={intl.formatMessage({
                    id: "profile.email.placeholder",
                    defaultMessage: "tu@empresa.com",
                  })}
                  value={formData.correo}
                  onChangeText={(text) => handleInputChange("correo", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.light.textSecondary}
                  editable={!isLoading}
                />
              </View>
              {errors.correo && <Text allowFontScaling={false} style={styles.errorText}>{errors.correo}</Text>}
            </View>

            <View style={styles.accountInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="business-outline" size={20} color={Colors.light.textSecondary} />
                </View>
                <View style={styles.infoContent}>
                  <Text allowFontScaling={false} style={styles.infoLabel}>
                    <FormattedMessage id="profile.account.status.label" defaultMessage="Estado de la cuenta" />
                  </Text>
                  <Text allowFontScaling={false}
                    style={[
                      styles.infoValue,
                      {
                        color: user.activo ? Colors.light.success : Colors.light.danger,
                      },
                    ]}
                  >
                    <FormattedMessage
                      id={user.activo ? "profile.account.status.active" : "profile.account.status.inactive"}
                      defaultMessage={user.activo ? "Activa" : "Inactiva"}
                    />
                  </Text>
                </View>
              </View>

              {user.isAdmin && (
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="shield-checkmark" size={20} color={Colors.light.warning} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text allowFontScaling={false} style={styles.infoLabel}>
                      <FormattedMessage id="profile.account.permissions.label" defaultMessage="Permisos" />
                    </Text>
                    <Text allowFontScaling={false} style={[styles.infoValue, { color: Colors.light.warning }]}>
                      <FormattedMessage id="profile.account.permissions.admin" defaultMessage="Administrador" />
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.cancelButton, isLoading && { opacity: 0.5 }]}
            onPress={handleClose}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text allowFontScaling={false} style={styles.cancelButtonText}>
              <FormattedMessage id="profile.actions.cancel" defaultMessage="Cancelar" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.updateButton, isLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <View style={styles.updateButtonContent}>
              {isLoading || loadingUpload ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text allowFontScaling={false} style={styles.updateButtonText}>
                  <FormattedMessage id="profile.actions.save" defaultMessage="Guardar Cambios" />
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default EditProfileModal
