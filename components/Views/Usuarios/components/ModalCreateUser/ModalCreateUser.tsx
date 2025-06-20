"use client"

import type React from "react"
import { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import type { IUser } from "../../UsuariosType"
import { Colors } from "@/constants/Coloresuser"
import { styles } from "./ModalCreateUserStyles"

interface CreateUserModalProps {
  visible: boolean
  onClose: () => void
  onCreateUser: (user: Omit<IUser, "id">) => Promise<void>
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ visible, onClose, onCreateUser }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    activo: true,
    isAdmin: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido"
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El email no es válido"
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true)
      try {
        // Crear el objeto con el nombre completo para la interfaz local
        const userForLocal = {
          nombre: `${formData.nombre} ${formData.apellido}`.trim(),
          correo: formData.correo,
          activo: formData.activo,
          isAdmin: formData.isAdmin,
        }

        await onCreateUser(userForLocal)

        setFormData({
          nombre: "",
          apellido: "",
          correo: "",
          password: "",
          activo: true,
          isAdmin: false,
        })
        setErrors({})
        onClose()
      } catch (error) {
        console.error("Error creating user:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        password: "",
        activo: true,
        isAdmin: false,
      })
      setErrors({})
      onClose()
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} disabled={isLoading}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nuevo Usuario</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <View style={[styles.inputContainer, errors.nombre && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa el nombre"
                  value={formData.nombre}
                  onChangeText={(text) => handleInputChange("nombre", text)}
                  placeholderTextColor={Colors.light.textSecondary}
                  editable={!isLoading}
                />
              </View>
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>

            {/* Last Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellido</Text>
              <View style={[styles.inputContainer, errors.apellido && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa el apellido"
                  value={formData.apellido}
                  onChangeText={(text) => handleInputChange("apellido", text)}
                  placeholderTextColor={Colors.light.textSecondary}
                  editable={!isLoading}
                />
              </View>
              {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputContainer, errors.correo && styles.inputError]}>
                <MaterialIcons name="email" size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="usuario@empresa.com"
                  value={formData.correo}
                  onChangeText={(text) => handleInputChange("correo", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.light.textSecondary}
                  editable={!isLoading}
                />
              </View>
              {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa la contraseña"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                  secureTextEntry
                  placeholderTextColor={Colors.light.textSecondary}
                  editable={!isLoading}
                />
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Status Switch */}
            <View style={styles.switchGroup}>
              <View style={styles.switchContainer}>
                <View style={styles.switchIcon}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.light.success} />
                </View>
                <View style={styles.switchContent}>
                  <Text style={styles.switchLabel}>Usuario activo</Text>
                  <Text style={styles.switchDescription}>El usuario puede acceder al sistema</Text>
                </View>
                <Switch
                  value={formData.activo}
                  onValueChange={(value) => handleInputChange("activo", value)}
                  trackColor={{
                    false: Colors.light.border,
                    true: Colors.light.success,
                  }}
                  thumbColor="white"
                  disabled={isLoading}
                />
              </View>
            </View>

            {/* Admin Switch */}
            <View style={styles.switchGroup}>
              <View style={styles.switchContainer}>
                <View style={styles.switchIcon}>
                  <Ionicons name="shield-checkmark" size={24} color={Colors.light.warning} />
                </View>
                <View style={styles.switchContent}>
                  <Text style={styles.switchLabel}>Permisos de administrador</Text>
                  <Text style={styles.switchDescription}>Puede gestionar otros usuarios</Text>
                </View>
                <Switch
                  value={formData.isAdmin}
                  onValueChange={(value) => handleInputChange("isAdmin", value)}
                  trackColor={{
                    false: Colors.light.border,
                    true: Colors.light.warning,
                  }}
                  thumbColor="white"
                  disabled={isLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.cancelButton, isLoading && { opacity: 0.5 }]}
            onPress={handleClose}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createButton, isLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <View style={styles.createButtonContent}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.createButtonText}>Crear Usuario</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default CreateUserModal
