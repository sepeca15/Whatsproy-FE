import { useState, useEffect } from "react"
import { TextInput, View } from "react-native"
import { Box, VStack, HStack, Text, Button, FlatList, IconButton, Spinner, Center, Badge } from "native-base"
import { Ionicons } from "@expo/vector-icons"
import type { Espacio } from "@/services/api/espacio/types"
import { useToastContext } from "@/contexts/ToastContext"
import api from "@/services/api/admin"
import GenericModal from "@/components/Views/ConfigAccount/components/GenericModal/GenericModal"
import AddButton from "@/hooks/add_Button/Add_button"
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction"

const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    primary: "#075e54",
    secondary: "#128c7e",
    warning: "#F39C12",
    border: "#e1e1e1",
    success: "#2ECC71",
    error: "#ef4444",
    textSecondary: "#000",
    danger: "#E74C3C",
    icon: "#687076",
  },
}

const EspaciosTab = () => {
  const [espacios, setEspacios] = useState<Espacio[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    capacidad: "",
  })

  const { showToast } = useToastContext()

  useEffect(() => {
    loadEspacios()
  }, [])

  const loadEspacios = async () => {
    try {
      setLoading(true)
      const data = await api.espacio.findAll()
      setEspacios(data)
    } catch (error) {
      showToast({
        title: "Error",
        description: "No se pudieron cargar los espacios",
        status: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedEspacio(null)
    setFormData({
      nombre: "",
      descripcion: "",
      ubicacion: "",
      capacidad: "",
    })
    setShowModal(true)
  }

  const handleEdit = (espacio: Espacio) => {
    setSelectedEspacio(espacio)
    setFormData({
      nombre: espacio.nombre,
      descripcion: espacio.descripcion,
      ubicacion: espacio.ubicacion,
      capacidad: espacio.capacidad?.toString() || "",
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      const espacioData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        ubicacion: formData.ubicacion,
        capacidad: formData.capacidad ? Number.parseInt(formData.capacidad) : null,
      }

      if (selectedEspacio) {
        await api.espacio.update(selectedEspacio.id, espacioData)
        showToast({
          title: "¡Espacio actualizado!",
          description: "El espacio fue actualizado exitosamente",
          status: "success",
        })
      } else {
        await api.espacio.create(espacioData)
        showToast({
          title: "¡Espacio creado!",
          description: "El espacio fue agregado exitosamente",
          status: "success",
        })
      }

      setShowModal(false)
      loadEspacios()
    } catch (error) {
      showToast({
        title: "Error",
        description: "No se pudo guardar el espacio",
        status: "error",
      })
    }
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setShowDeleteAlert(true)
  }

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await api.espacio.delete(deleteId)
        showToast({
          title: "¡Espacio eliminado!",
          description: "El espacio fue eliminado exitosamente",
          status: "success",
        })
        loadEspacios()
      } catch (error) {
        showToast({
          title: "Error",
          description: "No se pudo eliminar el espacio",
          status: "error",
        })
      }
    }
    setShowDeleteAlert(false)
    setDeleteId(null)
  }

  const renderEspacioItem = ({ item }: { item: Espacio }) => (
    <Box bg="white" rounded="lg" shadow={2} p={4} mb={3} borderWidth={1} borderColor={Colors.light.border}>
      <VStack space={2}>
        <HStack justifyContent="space-between" alignItems="flex-start">
          <VStack flex={1} space={1}>
            <Text fontSize="lg" fontWeight="bold" color={Colors.light.text}>
              {item.nombre}
            </Text>
            <Text fontSize="sm" color={Colors.light.icon}>
              📍 {item.ubicacion}
            </Text>
            {item.capacidad && (
              <Badge colorScheme="green" variant="subtle" alignSelf="flex-start">
                Capacidad: {item.capacidad}
              </Badge>
            )}
          </VStack>
          <HStack space={2}>
            <IconButton
              icon={<Ionicons name="pencil" size={18} color={Colors.light.primary} />}
              onPress={() => handleEdit(item)}
              bg={Colors.light.primary + "20"}
              rounded="full"
              size="sm"
            />
            <IconButton
              icon={<Ionicons name="trash" size={18} color={Colors.light.danger} />}
              onPress={() => handleDelete(item.id)}
              bg={Colors.light.danger + "20"}
              rounded="full"
              size="sm"
            />
          </HStack>
        </HStack>

        {item.descripcion && (
          <Text fontSize="sm" color={Colors.light.textSecondary} mt={2}>
            {item.descripcion}
          </Text>
        )}
      </VStack>
    </Box>
  )

  if (loading) {
    return (
      <Center flex={1} bg={Colors.light.background}>
        <Spinner size="lg" color={Colors.light.primary} />
        <Text mt={2} color={Colors.light.text}>
          Cargando espacios...
        </Text>
      </Center>
    )
  }

  return (
    <Box flex={1} bg={Colors.light.background}>
      <AddButton onPress={handleCreate} />

      <Box flex={1} px={4} pt={4}>
        {espacios.length === 0 ? (
          <Center flex={1}>
            <Ionicons name="business-outline" size={64} color={Colors.light.icon} />
            <Text fontSize="lg" color={Colors.light.icon} mt={4}>
              No hay espacios registrados
            </Text>
            <Button
              onPress={handleCreate}
              bg={Colors.light.primary}
              mt={4}
              leftIcon={<Ionicons name="add" size={16} color="white" />}
            >
              Crear primer espacio
            </Button>
          </Center>
        ) : (
          <FlatList
            data={espacios}
            renderItem={renderEspacioItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadEspacios}
          />
        )}
      </Box>

      {/* GenericModal para crear/editar */}
<GenericModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={selectedEspacio ? "Editar Espacio" : "Nuevo Espacio"}
        subtitle={selectedEspacio ? "Modifica los datos del espacio" : "Completa la información del nuevo espacio"}
        scrollable={true}
        actions={[
          {
            label: "Cancelar",
            onPress: () => setShowModal(false),
            style: "secondary",
          },
          {
            label: selectedEspacio ? "Actualizar" : "Crear",
            onPress: handleSave,
            style: "primary",
            icon: selectedEspacio ? "edit" : "plus",
            disabled: !formData.nombre || !formData.ubicacion,
          },
        ]}
      >
        <View
          style={{
            padding: 8,
            backgroundColor: "#f8fafc",
            minHeight: 400,
          }}
        >
          {/* Header Card */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              borderLeftWidth: 4,
              borderLeftColor: Colors.light.primary,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <View
                style={{
                  backgroundColor: Colors.light.primary + "20",
                  borderRadius: 20,
                  padding: 8,
                  marginRight: 12,
                }}
              >
                <Ionicons name={selectedEspacio ? "pencil" : "add-circle"} size={20} color={Colors.light.primary} />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: Colors.light.text,
                }}
              >
                {selectedEspacio ? "Editando espacio" : "Nuevo espacio"}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: Colors.light.icon,
                lineHeight: 20,
              }}
            >
              {selectedEspacio
                ? "Actualiza la información del espacio seleccionado"
                : "Completa todos los campos para crear un nuevo espacio"}
            </Text>
          </View>

          <VStack space={5}>
            {/* Campo Nombre */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#f1f5f9",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: Colors.light.primary + "15",
                    borderRadius: 16,
                    padding: 6,
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="business" size={16} color={Colors.light.primary} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: Colors.light.text,
                    flex: 1,
                  }}
                >
                  Nombre del espacio
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.light.danger,
                    fontWeight: "500",
                  }}
                >
                  *
                </Text>
              </View>
              <TextInput
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                placeholder="Ej: Sala de conferencias A"
                style={{
                  borderWidth: 1.5,
                  borderColor: formData.nombre ? Colors.light.primary + "40" : Colors.light.border,
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  backgroundColor: "#fafbfc",
                  color: Colors.light.text,
                }}
                placeholderTextColor={Colors.light.icon}
              />
            </View>

            {/* Campo Descripción */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#f1f5f9",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: Colors.light.secondary + "15",
                    borderRadius: 16,
                    padding: 6,
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="document-text" size={16} color={Colors.light.secondary} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: Colors.light.text,
                  }}
                >
                  Descripción
                </Text>
              </View>
              <TextInput
                value={formData.descripcion}
                onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                placeholder="Describe las características del espacio..."
                multiline={true}
                numberOfLines={4}
                style={{
                  borderWidth: 1.5,
                  borderColor: formData.descripcion ? Colors.light.secondary + "40" : Colors.light.border,
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  textAlignVertical: "top",
                  minHeight: 90,
                  backgroundColor: "#fafbfc",
                  color: Colors.light.text,
                }}
                placeholderTextColor={Colors.light.icon}
              />
            </View>

            {/* Campo Ubicación */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#f1f5f9",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: Colors.light.warning + "15",
                    borderRadius: 16,
                    padding: 6,
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="location" size={16} color={Colors.light.warning} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: Colors.light.text,
                    flex: 1,
                  }}
                >
                  Ubicación
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.light.danger,
                    fontWeight: "500",
                  }}
                >
                  *
                </Text>
              </View>
              <TextInput
                value={formData.ubicacion}
                onChangeText={(text) => setFormData({ ...formData, ubicacion: text })}
                placeholder="Ej: Piso 2, Edificio Principal"
                style={{
                  borderWidth: 1.5,
                  borderColor: formData.ubicacion ? Colors.light.warning + "40" : Colors.light.border,
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  backgroundColor: "#fafbfc",
                  color: Colors.light.text,
                }}
                placeholderTextColor={Colors.light.icon}
              />
            </View>

            {/* Campo Capacidad */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#f1f5f9",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: Colors.light.success + "15",
                    borderRadius: 16,
                    padding: 6,
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="people" size={16} color={Colors.light.success} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: Colors.light.text,
                  }}
                >
                  Capacidad máxima
                </Text>
              </View>
              <TextInput
                value={formData.capacidad}
                onChangeText={(text) => setFormData({ ...formData, capacidad: text })}
                placeholder="Ej: 25 personas"
                keyboardType="numeric"
                style={{
                  borderWidth: 1.5,
                  borderColor: formData.capacidad ? Colors.light.success + "40" : Colors.light.border,
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  backgroundColor: "#fafbfc",
                  color: Colors.light.text,
                }}
                placeholderTextColor={Colors.light.icon}
              />
            </View>
          </VStack>

          {/* Footer Info */}
          <View
            style={{
              backgroundColor: Colors.light.primary + "08",
              borderRadius: 10,
              padding: 12,
              marginTop: 20,
              borderLeftWidth: 3,
              borderLeftColor: Colors.light.primary,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="information-circle" size={16} color={Colors.light.primary} />
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.light.primary,
                  marginLeft: 8,
                  fontWeight: "500",
                }}
              >
                Los campos marcados con * son obligatorios
              </Text>
            </View>
          </View>
        </View>
      </GenericModal>
      {/* ModalConfirmAction para eliminar */}
      <ModalConfirmAction
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onContinue={confirmDelete}
        title="Eliminar Espacio"
        message="¿Estás seguro de que deseas eliminar este espacio? Esta acción no se puede deshacer."
      />
    </Box>
  )
}

export default EspaciosTab
