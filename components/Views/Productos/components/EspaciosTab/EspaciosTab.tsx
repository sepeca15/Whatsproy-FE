import React, { useState, useEffect } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FlatList,
  IconButton,
  Spinner,
  Center,
  Badge,
  Input,
  FormControl,
  Pressable,
  Avatar,
  Divider,
} from "native-base"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import type { Espacio } from "@/services/api/espacio/types"
import { useToastContext } from "@/contexts/ToastContext"
import api from "@/services/api/admin"
import GenericModal from "@/components/Views/ConfigAccount/components/GenericModal/GenericModal"
import AddButton from "@/hooks/add_Button/Add_button"
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction"
import MultiSelectInput from "@/components/MultiSelectInput"
import { FormattedMessage, useIntl } from "react-intl"
import useImagePicker from "@/utils/ImagePicker/useImagePicker"

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

const initialState = {
  nombre: "",
  image: "" as any,
  descripcion: "",
  ubicacion: "",
  capacidad: "",
  products: [] as any,
}

const EspaciosTab = () => {
  const intl = useIntl()
  const { showToast } = useToastContext()
  const [espacios, setEspacios] = useState<Espacio[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState(initialState)

  const { pickImage, imageUri, setImageUri, loadingUpload } = useImagePicker({
    toastErrorMessage: intl.formatMessage({
      id: "categories.modal.imagePickerError",
      defaultMessage: "Error al seleccionar la imagen",
    }),
    onImagePicked: (data) => {
      if (data.apiUrl) {
        setFormData((prev) => ({
          ...prev,
          image: data?.apiUrl,
        }))
      }
    },
  })  
  const currentImageUri = imageUri || formData.image

  const handleChangeProducts = (newProds: any[]) => {
    setFormData((prev) => ({
      ...prev,
      products: newProds,
    }))
  }

  const handleImagePick = () => {
    pickImage(setFormData)
  }

  const loadProductos = async () => {
    try {
      const { data } = await api.products.findProductsWithQuery("")
      if (data.length > 0) {
        setProducts(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadEspacios = async () => {
    try {
      setLoading(true)
      const data = await api.espacio.findAll()
      setEspacios(data)
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: "espacioTab.error",
          defaultMessage: "Error",
        }),
        description: intl.formatMessage({
          id: "espacioTab.loadSpacesError",
          defaultMessage: "No se pudieron cargar los espacios",
        }),
        status: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProductos()
    loadEspacios()
  }, [])

  const handleCreate = () => {
    setSelectedEspacio(null)
    setFormData({
      nombre: "",
      descripcion: "",
      ubicacion: "",
      capacidad: "",
      image: "",
      products: [],
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
      products: [],
      image: "",
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
        products: formData.products,
        image: formData.image
      }

      if (selectedEspacio) {
        await api.espacio.update(selectedEspacio.id, espacioData)
        showToast({
          title: intl.formatMessage({
            id: "espacioTab.spaceUpdated",
            defaultMessage: "¡Espacio actualizado!",
          }),
          description: intl.formatMessage({
            id: "espacioTab.spaceUpdatedSuccess",
            defaultMessage: "El espacio fue actualizado exitosamente",
          }),
          status: "success",
        })
      } else {
        await api.espacio.create(espacioData)
        showToast({
          title: intl.formatMessage({
            id: "espacioTab.spaceCreated",
            defaultMessage: "¡Espacio creado!",
          }),
          description: intl.formatMessage({
            id: "espacioTab.spaceCreatedSuccess",
            defaultMessage: "El espacio fue agregado exitosamente",
          }),
          status: "success",
        })
      }
      setShowModal(false)
      loadEspacios()
    } catch (error: any) {
      console.log(error.response.data.message)
      showToast({
        title: intl.formatMessage({
          id: "espacioTab.error",
          defaultMessage: "Error",
        }),
        description: intl.formatMessage({
          id: "espacioTab.saveSpaceError",
          defaultMessage: "No se pudo guardar el espacio",
        }),
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
          title: intl.formatMessage({
            id: "espacioTab.spaceDeleted",
            defaultMessage: "¡Espacio eliminado!",
          }),
          description: intl.formatMessage({
            id: "espacioTab.spaceDeletedSuccess",
            defaultMessage: "El espacio fue eliminado exitosamente",
          }),
          status: "success",
        })
        loadEspacios()
      } catch (error) {
        showToast({
          title: intl.formatMessage({
            id: "espacioTab.error",
            defaultMessage: "Error",
          }),
          description: intl.formatMessage({
            id: "espacioTab.deleteSpaceError",
            defaultMessage: "No se pudo eliminar el espacio",
          }),
          status: "error",
        })
      }
    }
    setShowDeleteAlert(false)
    setDeleteId(null)
  }

  React.useEffect(() => {
    if (showModal) {
      if (selectedEspacio) {
        setFormData({
          nombre: selectedEspacio.nombre || "",
          image: selectedEspacio.image || "",
          descripcion: selectedEspacio.descripcion || "",
          ubicacion: selectedEspacio.ubicacion || "",
          capacidad: selectedEspacio.capacidad?.toString() || "",
          products: selectedEspacio.productos?.map((p: any) => p.id) || [],
        })
        setImageUri(selectedEspacio.image || null)
      } else {
        setFormData(initialState)
      }
    }
  }, [showModal, selectedEspacio, setImageUri])

  const renderEspacioItem = ({ item, index }: { item: Espacio; index: number }) => (
    <Box
      display={"flex"}
      flexDir={"column"}
      bg="white"
      rounded="2xl"
      shadow={3}
      p={4}
      mb={4}
      mx={1}
      borderWidth={1}
      borderColor="coolGray.100"
      _light={{
        bg: "white",
        borderColor: "coolGray.200",
      }}
      _dark={{
        bg: "coolGray.800",
        borderColor: "coolGray.700",
      }}
    >
      {/* Header con gradiente */}
      <Box position="relative" rounded="xl" p={4} mb={4}>
        <HStack flex={1} flexDir={"row"} justifyContent="space-between" alignItems="center">
          <HStack space={3} alignItems="center" flex={1}>
            <Avatar bg={Colors.light.primary} size="md" source={item.image ? { uri: item.image } : undefined}>
              <Ionicons name="business" size={20} color="white" />
            </Avatar>
            <VStack flex={1}>
              <Text fontSize="lg" fontWeight="bold" color={Colors.light.text} numberOfLines={1}>
                {item.nombre}
              </Text>
              <HStack space={2} alignItems="center">
                <Ionicons name="location" size={14} color={Colors.light.warning} />
                <Text fontSize="sm" color={Colors.light.icon} numberOfLines={1} flex={1}>
                  {item.ubicacion}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <HStack space={2}>
            <IconButton
              icon={<Ionicons name="pencil" size={18} color={Colors.light.primary} />}
              onPress={() => handleEdit(item)}
              bg={Colors.light.primary + "20"}
              rounded="full"
              size="sm"
              _pressed={{ bg: Colors.light.primary + "30" }}
            />
            <IconButton
              icon={<Ionicons name="trash" size={18} color={Colors.light.danger} />}
              onPress={() => handleDelete(item.id)}
              bg={Colors.light.danger + "20"}
              rounded="full"
              size="sm"
              _pressed={{ bg: Colors.light.danger + "30" }}
            />
          </HStack>
        </HStack>
      </Box>

      {/* Contenido */}
      <VStack flex={1} space={3}>
        {item.descripcion && (
          <Box>
            <Text fontSize="sm" color={Colors.light.textSecondary}>
              {item.descripcion}
            </Text>
          </Box>
        )}

        <Divider />

        {/* Stats */}
        <HStack justifyContent="space-between" alignItems="center">
          {item.capacidad && (
            <Badge
              colorScheme="success"
              variant="subtle"
              rounded="full"
              px={3}
              py={1}
              _text={{ fontSize: "xs", fontWeight: "600" }}
            >
              <HStack space={1} alignItems="center">
                <Ionicons name="people" size={12} color={Colors.light.success} />
                <Text fontSize="xs" color={Colors.light.success} fontWeight="600">
                  {item.capacidad} <FormattedMessage id="espacioTab.people" defaultMessage="personas" />
                </Text>
              </HStack>
            </Badge>
          )}
        </HStack>
      </VStack>
    </Box>
  )

  if (loading) {
    return (
      <Box flex={1} bg={Colors.light.background}>
        <Center flex={1}>
          <VStack space={4} alignItems="center">
            <Box
              bg={{
                linearGradient: {
                  colors: [Colors.light.primary, Colors.light.secondary],
                  start: [0, 0],
                  end: [1, 1],
                },
              }}
              rounded="full"
              p={4}
            >
              <Spinner size="lg" color="white" />
            </Box>
            <VStack space={2} alignItems="center">
              <Text fontSize="lg" fontWeight="600" color={Colors.light.text}>
                <FormattedMessage id="espacioTab.loadingSpaces" defaultMessage="Cargando espacios..." />
              </Text>
              <Text fontSize="sm" color={Colors.light.icon}>
                <FormattedMessage id="espacioTab.pleaseWait" defaultMessage="Por favor espera un momento" />
              </Text>
            </VStack>
          </VStack>
        </Center>
      </Box>
    )
  }

  return (
    <Box flex={1} bg="coolGray.50">
      <AddButton onPress={handleCreate} />

      <Box flex={1} px={4} pt={4}>
        {espacios.length === 0 ? (
          <Center flex={1}>
            <VStack space={6} alignItems="center" maxW="300px">
              <Box rounded="full" p={8}>
                <Ionicons name="business-outline" size={64} color={Colors.light.primary} />
              </Box>

              <VStack space={3} alignItems="center">
                <Text fontSize="xl" fontWeight="bold" color={Colors.light.text} textAlign="center">
                  <FormattedMessage id="espacioTab.noSpacesRegistered" defaultMessage="No hay espacios registrados" />
                </Text>
                <Text fontSize="md" color={Colors.light.icon} textAlign="center">
                  <FormattedMessage
                    id="espacioTab.createFirstSpaceDescription"
                    defaultMessage="Comienza creando tu primer espacio para organizar mejor tus recursos"
                  />
                </Text>
              </VStack>

              <Button
                onPress={handleCreate}
                bg={Colors.light.primary}
                rounded="full"
                px={8}
                py={3}
                leftIcon={<Ionicons name="add" size={20} color="white" />}
                _pressed={{ opacity: 0.8 }}
                shadow={3}
              >
                <Text color="white" fontWeight="600" fontSize="md">
                  <FormattedMessage id="espacioTab.createFirstSpace" defaultMessage="Crear primer espacio" />
                </Text>
              </Button>
            </VStack>
          </Center>
        ) : (
          <FlatList
            data={espacios}
            renderItem={renderEspacioItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadEspacios}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </Box>

      {/* Modal mejorado */}
      <GenericModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={
          selectedEspacio
            ? intl.formatMessage({ id: "espacioTab.editSpace", defaultMessage: "Editar Espacio" })
            : intl.formatMessage({ id: "espacioTab.newSpace", defaultMessage: "Nuevo Espacio" })
        }
        subtitle={
          selectedEspacio
            ? intl.formatMessage({
              id: "espacioTab.editSpaceSubtitle",
              defaultMessage: "Modifica los datos del espacio",
            })
            : intl.formatMessage({
              id: "espacioTab.newSpaceSubtitle",
              defaultMessage: "Completa la información del nuevo espacio",
            })
        }
        scrollable={true}
        actions={[
          {
            label: intl.formatMessage({ id: "espacioTab.cancel", defaultMessage: "Cancelar" }),
            onPress: () => setShowModal(false),
            style: "secondary",
          },
          {
            label: selectedEspacio
              ? intl.formatMessage({ id: "espacioTab.update", defaultMessage: "Actualizar" })
              : intl.formatMessage({ id: "espacioTab.create", defaultMessage: "Crear" }),
            onPress: handleSave,
            style: "primary",
            loading: loadingUpload,
            icon: selectedEspacio ? "edit" : "plus",
            disabled: !formData.nombre || !formData.ubicacion,
          },
        ]}
      >
        <Box bg="coolGray.50" p={2} minH="400px">
          {/* Header Card mejorado */}
          <Box
            bg="white"
            rounded="2xl"
            p={4}
            mb={6}
            shadow={2}
            borderLeftWidth={4}
            borderLeftColor={Colors.light.primary}
          >
            <HStack space={4} alignItems="center" mb={3}>
              <Box
                bg={{
                  linearGradient: {
                    colors: [Colors.light.primary, Colors.light.secondary],
                    start: [0, 0],
                    end: [1, 1],
                  },
                }}
                rounded="full"
                p={3}
              >
                <Ionicons name={selectedEspacio ? "pencil" : "add-circle"} size={20} color="white" />
              </Box>
              <VStack flex={1}>
                <Text fontSize="lg" fontWeight="bold" color={Colors.light.text}>
                  {selectedEspacio ? (
                    <FormattedMessage id="espacioTab.editingSpace" defaultMessage="Editando espacio" />
                  ) : (
                    <FormattedMessage id="espacioTab.newSpaceTitle" defaultMessage="Nuevo espacio" />
                  )}
                </Text>
                <Text fontSize="sm" color={Colors.light.icon}>
                  {selectedEspacio ? (
                    <FormattedMessage
                      id="espacioTab.updateSpaceInfo"
                      defaultMessage="Actualiza la información del espacio seleccionado"
                    />
                  ) : (
                    <FormattedMessage
                      id="espacioTab.completeFieldsInfo"
                      defaultMessage="Completa todos los campos para crear un nuevo espacio"
                    />
                  )}
                </Text>
              </VStack>
            </HStack>
          </Box>

          <VStack space={6}>
            {/* Sección de imagen mejorada */}
            <Box bg="white" rounded="2xl" p={6} shadow={1}>
              <VStack space={4} alignItems="center">
                <Text fontSize="md" fontWeight="600" color={Colors.light.text}>
                  <FormattedMessage id="espacioTab.spaceImage" defaultMessage="Imagen del espacio" />
                </Text>

                <Box position="relative">
                  <Avatar
                    size="2xl"
                    source={currentImageUri ? { uri: currentImageUri } : undefined}
                    bg={'gray.100'}
                  >
                    <MaterialIcons name="image" size={40} color={Colors.light.primary} />
                  </Avatar>
                </Box>

                <Button
                  variant="outline"
                  borderColor={Colors.light.primary}
                  onPress={handleImagePick}
                  leftIcon={<MaterialIcons name="cloud-upload" size={20} color={Colors.light.primary} />}
                  _text={{ color: Colors.light.primary, fontWeight: "600" }}
                  rounded="full"
                  px={6}
                >
                  <FormattedMessage
                    id={currentImageUri ? "categories.modal.changeImage" : "categories.modal.uploadImage"}
                    defaultMessage={currentImageUri ? "Cambiar imagen" : "Subir imagen"}
                  />
                </Button>
              </VStack>
            </Box>

            {/* Campos del formulario mejorados */}
            <VStack space={4}>
              {/* Campo Nombre */}
              <FormControl isRequired>
                <Box bg="white" rounded="2xl" p={5} shadow={1}>
                  <FormControl.Label>
                    <HStack space={2} alignItems="center" mb={2}>
                      <Box bg={Colors.light.primary + "15"} rounded="lg" p={2}>
                        <Ionicons name="business" size={16} color={Colors.light.primary} />
                      </Box>
                      <Text fontSize="md" fontWeight="600" color={Colors.light.text}>
                        <FormattedMessage id="espacioTab.spaceName" defaultMessage="Nombre del espacio" />
                      </Text>
                      <Text fontSize="sm" color={Colors.light.danger} fontWeight="600">
                        <FormattedMessage id="espacioTab.required" defaultMessage="*" />
                      </Text>
                    </HStack>
                  </FormControl.Label>
                  <Input
                    value={formData.nombre}
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                    placeholder={intl.formatMessage({
                      id: "espacioTab.spaceNamePlaceholder",
                      defaultMessage: "Ej: Sala de conferencias A",
                    })}
                    variant="filled"
                    bg="coolGray.50"
                    borderWidth={2}
                    borderColor={formData.nombre ? Colors.light.primary + "40" : "coolGray.200"}
                    _focus={{
                      borderColor: Colors.light.primary,
                      bg: "white",
                    }}
                    fontSize="md"
                    py={3}
                  />
                </Box>
              </FormControl>

              {/* Campo Descripción */}
              <FormControl>
                <Box bg="white" rounded="2xl" p={5} shadow={1}>
                  <FormControl.Label>
                    <HStack space={2} alignItems="center" mb={2}>
                      <Box bg={Colors.light.secondary + "15"} rounded="lg" p={2}>
                        <Ionicons name="document-text" size={16} color={Colors.light.secondary} />
                      </Box>
                      <Text fontSize="md" fontWeight="600" color={Colors.light.text}>
                        <FormattedMessage id="espacioTab.description" defaultMessage="Descripción" />
                      </Text>
                    </HStack>
                  </FormControl.Label>
                  <Input
                    value={formData.descripcion}
                    onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                    placeholder={intl.formatMessage({
                      id: "espacioTab.descriptionPlaceholder",
                      defaultMessage: "Describe las características del espacio...",
                    })}
                    variant="filled"
                    bg="coolGray.50"
                    borderWidth={2}
                    borderColor={formData.descripcion ? Colors.light.secondary + "40" : "coolGray.200"}
                    _focus={{
                      borderColor: Colors.light.secondary,
                      bg: "white",
                    }}
                    fontSize="md"
                    py={3}
                  />
                </Box>
              </FormControl>

              {/* Campo Ubicación */}
              <FormControl isRequired>
                <Box bg="white" rounded="2xl" p={5} shadow={1}>
                  <FormControl.Label>
                    <HStack space={2} alignItems="center" mb={2}>
                      <Box bg={Colors.light.warning + "15"} rounded="lg" p={2}>
                        <Ionicons name="location" size={16} color={Colors.light.warning} />
                      </Box>
                      <Text fontSize="md" fontWeight="600" color={Colors.light.text}>
                        <FormattedMessage id="espacioTab.location" defaultMessage="Ubicación" />
                      </Text>
                      <Text fontSize="sm" color={Colors.light.danger} fontWeight="600">
                        <FormattedMessage id="espacioTab.required" defaultMessage="*" />
                      </Text>
                    </HStack>
                  </FormControl.Label>
                  <Input
                    value={formData.ubicacion}
                    onChangeText={(text) => setFormData({ ...formData, ubicacion: text })}
                    placeholder={intl.formatMessage({
                      id: "espacioTab.locationPlaceholder",
                      defaultMessage: "Ej: Piso 2, Edificio Principal",
                    })}
                    variant="filled"
                    bg="coolGray.50"
                    borderWidth={2}
                    borderColor={formData.ubicacion ? Colors.light.warning + "40" : "coolGray.200"}
                    _focus={{
                      borderColor: Colors.light.warning,
                      bg: "white",
                    }}
                    fontSize="md"
                    py={3}
                  />
                </Box>
              </FormControl>

              {/* Campo Capacidad */}
              <FormControl>
                <Box bg="white" rounded="2xl" p={5} shadow={1}>
                  <FormControl.Label>
                    <HStack space={2} alignItems="center" mb={2}>
                      <Box bg={Colors.light.success + "15"} rounded="lg" p={2}>
                        <Ionicons name="people" size={16} color={Colors.light.success} />
                      </Box>
                      <Text fontSize="md" fontWeight="600" color={Colors.light.text}>
                        <FormattedMessage id="espacioTab.maxCapacity" defaultMessage="Capacidad máxima" />
                      </Text>
                    </HStack>
                  </FormControl.Label>
                  <Input
                    value={formData.capacidad}
                    onChangeText={(text) => setFormData({ ...formData, capacidad: text })}
                    placeholder={intl.formatMessage({
                      id: "espacioTab.capacityPlaceholder",
                      defaultMessage: "Ej: 25 personas",
                    })}
                    keyboardType="numeric"
                    variant="filled"
                    bg="coolGray.50"
                    borderWidth={2}
                    borderColor={formData.capacidad ? Colors.light.success + "40" : "coolGray.200"}
                    _focus={{
                      borderColor: Colors.light.success,
                      bg: "white",
                    }}
                    fontSize="md"
                    py={3}
                  />
                </Box>
              </FormControl>

              {/* Campo Productos */}
              <FormControl>
                <Box bg="white" rounded="2xl" p={5} shadow={1}>
                  <FormControl.Label>
                    <HStack space={2} alignItems="center" mb={2}>
                      <Box bg={Colors.light.primary + "15"} rounded="lg" p={2}>
                        <Ionicons name="cube" size={16} color={Colors.light.primary} />
                      </Box>
                      <Text fontSize="md" fontWeight="600" color={Colors.light.text}>
                        <FormattedMessage id="espacioTab.associatedProducts" defaultMessage="Productos asociados" />
                      </Text>
                    </HStack>
                  </FormControl.Label>
                  <MultiSelectInput
                    options={products?.map((prod) => ({
                      label: prod?.nombre,
                      placeholder: prod?.nombre,
                      value: prod?.id ?? "",
                    }))}
                    itemsSelected={formData.products}
                    setItemsSelected={handleChangeProducts}
                    isMultiple
                  />
                </Box>
              </FormControl>
            </VStack>

            {/* Footer Info mejorado */}
            <Box
              bg={{
                linearGradient: {
                  colors: [Colors.light.primary + "08", Colors.light.secondary + "05"],
                  start: [0, 0],
                  end: [1, 1],
                },
              }}
              rounded="xl"
              p={4}
              borderLeftWidth={3}
              borderLeftColor={Colors.light.primary}
            >
              <HStack space={2} alignItems="center">
                <Ionicons name="information-circle" size={18} color={Colors.light.primary} />
                <Text fontSize="sm" color={Colors.light.primary} fontWeight="500" flex={1}>
                  <FormattedMessage
                    id="espacioTab.requiredFieldsInfo"
                    defaultMessage="Los campos marcados con * son obligatorios para crear el espacio"
                  />
                </Text>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </GenericModal>

      {/* ModalConfirmAction para eliminar */}
      <ModalConfirmAction
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onContinue={confirmDelete}
        title={intl.formatMessage({ id: "espacioTab.deleteSpace", defaultMessage: "Eliminar Espacio" })}
        message={intl.formatMessage({
          id: "espacioTab.deleteConfirmation",
          defaultMessage: "¿Estás seguro de que deseas eliminar este espacio? Esta acción no se puede deshacer.",
        })}
      />
    </Box>
  )
}

export default EspaciosTab
