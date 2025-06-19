
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
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import type { IUser } from "../../UsuariosType"
import { Colors } from "@/constants/Coloresuser"
import { styles } from "./ModalCreateUserStyles"

interface CreateUserModalProps {
  visible: boolean
  onClose: () => void
  onCreateUser: (user: Omit<IUser, "id">) => void
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ visible, onClose, onCreateUser }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    activo: true,
    isAdmin: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El email no es válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateUser(formData)
      setFormData({
        nombre: "",
        correo: "",
        activo: true,
        isAdmin: false,
      })
      setErrors({})
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <LinearGradient colors={Colors.gradients.primary as [string, string, ...string[]]} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nuevo Usuario</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={[styles.inputContainer, errors.nombre && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa el nombre completo"
                  value={formData.nombre}
                  onChangeText={(text) => handleInputChange("nombre", text)}
                  placeholderTextColor={Colors.light.textSecondary}
                />
              </View>
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
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
                />
              </View>
              {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
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
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createButton} onPress={handleSubmit} activeOpacity={0.8}>
            <LinearGradient colors={Colors.gradients.primary as [string, string, ...string[]]} style={styles.createButtonGradient}>
              <Text style={styles.createButtonText}>Crear Usuario</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default CreateUserModal
