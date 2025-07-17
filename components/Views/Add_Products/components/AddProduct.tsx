"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Text, TouchableOpacity, Image, ScrollView, Platform, ActivityIndicator, Switch } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { Colors } from "../../../../constants/Colors"
import { styles } from "./AddProductStyle"
import type ProductoTypes from "../../../../services/api/products/types"
import api from "@/services/api/admin"
import { FormattedMessage, useIntl } from "react-intl"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useUser } from "@/hooks/redux/useUser"
import useImagePicker from "../../../../utils/ImagePicker/useImagePicker"
import { View } from "native-base"
import MultiSelectInput from "@/components/MultiSelectInput"
import type { ICategoryData } from "../../Categories/components/CardCategory/CardCategory"
import InputField from "@/components/InputField"
import SelectField from "@/hooks/SelectField/SelectField"
import { useEditProductValidation } from "@/hooks/productValidation/useProductValidation"
import GenericModal from "../../ConfigAccount/components/GenericModal/GenericModal"
import { useToastContext } from "@/contexts/ToastContext"

interface AddProductModalProps {
  visible: boolean
  onClose: () => void
  onSuccess?: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({ visible, onClose, onSuccess }) => {
  const intl = useIntl()
  const { showToast } = useToastContext()

  const [formData, setFormData] = useState<ProductoTypes>({
    nombre: "",
    precio: 0,
    empresa_id: 0,
    imagen: "",
    descripcion: "",
    plazoDuracionEstimadoMinutos: 0,
    disponible: false,
    categoryIds: [],
    currency_id: null,
    envioADomicilio: false,
    retiroEnSucursal: false,
  })

  const { user } = useUser()
  const currencies = user?.currencies || []
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [allCategories, setAllCategories] = useState<ICategoryData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
  const { validateForm } = useEditProductValidation()

  const { pickImage, setImageUri, imageUri } = useImagePicker({
    toastErrorMessage: "Error al seleccionar la imagen",
    onImagePicked: ({ localUri }) => {
      if (localUri) {
        setSelectedImage(localUri)
      }
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      resetForm()
      loadAllCategories()
    }
  }, [visible])

  const resetForm = () => {
    setFormData({
      nombre: "",
      precio: 0,
      empresa_id: 0,
      imagen: "",
      descripcion: "",
      plazoDuracionEstimadoMinutos: 0,
      disponible: false,
      categoryIds: [],
      currency_id: null,
      envioADomicilio: false,
      retiroEnSucursal: false,
    })
    setSelectedImage(null)
    setErrors({})
    setImageUri(null)
  }

  const loadAllCategories = async () => {
    try {
      const resp = await api.category.getAll()
      if (resp.ok) {
        setAllCategories(resp.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleImagePick = async () => {
    pickImage(setFormData)
  }

  const handleSubmit = async () => {
    if (!validateForm(formData, selectedImage, setErrors)) return

    setLoading(true)
    try {
      const response = await api.products.create({
        ...formData,
        precio: Number.parseFloat(formData.precio.toString()),
        plazoDuracionEstimadoMinutos: Number.parseFloat(formData.plazoDuracionEstimadoMinutos.toString()),
      })

      showToast({
        status: "success",
        title: intl.formatMessage({
          id: "productCreatedSuccess",
          defaultMessage: "Producto creado exitosamente",
        }),
      })

      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error("Error al crear el producto:", error?.response?.data?.message || error)
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "errorCreatingProduct",
          defaultMessage: "Error al crear el producto",
        }),
        descripcion: error?.response?.data?.message || error?.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      resetForm()
      onClose()
    }
  }

  return (
    <GenericModal
      visible={visible}
      onClose={handleClose}
      title={intl.formatMessage({
        id: "addProduct",
        defaultMessage: "Agregar Producto",
      })}
    >
      <KeyboardAwareScrollView
        style={styles.modalContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 50}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
          {/* Image Upload Section */}
          <TouchableOpacity style={styles.imageUpload} onPress={handleImagePick} disabled={loading}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <AntDesign name="camera" size={40} color="gray" />
                <Text style={styles.uploadText}>
                  <FormattedMessage id="addImage" defaultMessage="Agregar imagen" />
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formContainer}>
            {/* Product Name */}
            <Text style={styles.label}>
              <FormattedMessage id="productName" defaultMessage="Nombre del producto" />
            </Text>
            <View style={styles.inputfile}>
              <InputField
                placeholder={intl.formatMessage({
                  id: "productNamePlaceholder",
                  defaultMessage: "Ej: Milanesa de pollo",
                })}
                value={formData.nombre}
                onChangeText={(text) => {
                  setFormData({ ...formData, nombre: text })
                  if (text.trim()) {
                    setErrors((prev) => ({ ...prev, nombre: null }))
                  }
                }}
                error={errors.nombre}
                style={styles.input}
                editable={!loading}
              />
            </View>

            {/* Price and Currency Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>
                  <FormattedMessage id="price" defaultMessage="Precio" />
                </Text>
                <View style={styles.inputfile}>
                  <InputField
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.precio ? formData.precio.toString() : ""}
                    onChangeText={(text) => {
                      const value = Number.parseFloat(text)
                      setFormData({
                        ...formData,
                        precio: isNaN(value) ? 0 : value,
                      })
                      if (!isNaN(value) && value > 0) {
                        setErrors((prev) => ({ ...prev, precio: null }))
                      }
                    }}
                    error={errors.precio}
                    style={styles.input}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>
                  <FormattedMessage id="currency" defaultMessage="Moneda" />
                </Text>
                <SelectField
                  selectedValue={formData.currency_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, currency_id: value })
                    setErrors((prev) => ({ ...prev, currency_id: null }))
                  }}
                  placeholder="Seleccione una moneda"
                  options={currencies.map((c: { codigo: string; simbolo: string; id: number }) => ({
                    label: `${c.codigo} (${c.simbolo})`,
                    value: c.id,
                  }))}
                  error={errors.currency_id ?? undefined}
                  disabled={loading}
                />
              </View>
            </View>

            {/* Estimated Duration */}
            <Text style={styles.label}>
              <FormattedMessage id="estimatedDuration" defaultMessage="Duración estimada (minutos)" />
            </Text>
            <View style={styles.inputfile}>
              <InputField
                placeholder="Ej: 45"
                keyboardType="numeric"
                value={formData.plazoDuracionEstimadoMinutos ? formData.plazoDuracionEstimadoMinutos.toString() : ""}
                onChangeText={(text) => {
                  const value = Number.parseInt(text)
                  setFormData({
                    ...formData,
                    plazoDuracionEstimadoMinutos: isNaN(value) ? 0 : value,
                  })
                  if (!isNaN(value) && value > 0) {
                    setErrors((prev) => ({
                      ...prev,
                      plazoDuracionEstimadoMinutos: null,
                    }))
                  }
                }}
                error={errors.plazoDuracionEstimadoMinutos}
                style={styles.input}
                editable={!loading}
              />
            </View>

            {/* Categories */}
            <View style={styles.column}>
              <Text style={styles.label}>
                <FormattedMessage id="category" defaultMessage="Categoría" />
              </Text>
              <View>
                <MultiSelectInput
                  sizeText={16}
                  label={intl.formatMessage({ id: "selectCategory" })}
                  height={50}
                  isMultiple
                  placeholder={intl.formatMessage({
                    id: "selectCategory",
                    defaultMessage: "Seleccionar categoría",
                  })}
                  options={allCategories.map((cat) => ({
                    label: cat.name,
                    value: cat.id.toString(),
                    placeholder: cat.name,
                  }))}
                  setItemsSelected={(selectedIds: number[]) => {
                    setFormData((prev) => ({
                      ...prev,
                      categoryIds: selectedIds,
                    }))

                    if (selectedIds.length > 0 && errors.categoryIds) {
                      setErrors((prev) => ({
                        ...prev,
                        categoryIds: null,
                      }))
                    }
                  }}
                  onSearch={() => {}}
                  error={errors.categoryIds ?? ""}
                />
              </View>
            </View>

            {/* Description */}
            <Text style={styles.label}>
              <FormattedMessage id="description" defaultMessage="Descripción" />
            </Text>
            <View style={styles.inputfile}>
              <InputField
                placeholder={intl.formatMessage({
                  id: "productDescriptionPlaceholder",
                  defaultMessage: "Ej: Plato clásico con papas fritas",
                })}
                isTextArea
                value={formData.descripcion}
                onChangeText={(text) => {
                  setFormData({ ...formData, descripcion: text })
                  if (text.trim()) {
                    setErrors((prev) => ({ ...prev, descripcion: null }))
                  }
                }}
                error={errors.descripcion}
                style={styles.inputarea}
                editable={!loading}
              />
            </View>

            {/* Delivery Options */}
            <Text style={styles.label}>
              <FormattedMessage id="deliveryOptions" defaultMessage="Opciones de entrega" />
            </Text>
            
            <View style={styles.switchContainer}>
              <Switch
                value={formData.envioADomicilio}
                onValueChange={(value) =>
                  setFormData({ ...formData, envioADomicilio: value })
                }
                trackColor={{ false: "#767577", true: Colors.light.primary }}
                thumbColor={formData.envioADomicilio ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                disabled={loading}
              />
              <View style={styles.switchIconContainer}>
                <AntDesign name="car" size={24} color={formData.envioADomicilio ? "#4CAF50" : "#999"} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.switchText,
                    { color: formData.envioADomicilio ? "#4CAF50" : "#999", marginLeft: 0 },
                  ]}
                >
                  <FormattedMessage id="homeDelivery" defaultMessage="Envío a domicilio" />
                </Text>
                <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                  <FormattedMessage 
                    id="homeDeliveryDescription" 
                    defaultMessage="El producto puede ser entregado en el domicilio del cliente"
                  />
                </Text>
              </View>
            </View>

            <View style={styles.switchContainer}>
              <Switch
                value={formData.retiroEnSucursal}
                onValueChange={(value) =>
                  setFormData({ ...formData, retiroEnSucursal: value })
                }
                trackColor={{ false: "#767577", true: Colors.light.primary }}
                thumbColor={formData.retiroEnSucursal ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                disabled={loading}
              />
              <View style={styles.switchIconContainer}>
                <AntDesign name="home" size={24} color={formData.retiroEnSucursal ? "#4CAF50" : "#999"} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.switchText,
                    { color: formData.retiroEnSucursal ? "#4CAF50" : "#999", marginLeft: 0 },
                  ]}
                >
                  <FormattedMessage id="storePickup" defaultMessage="Retiro en sucursal" />
                </Text>
                <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                  <FormattedMessage 
                    id="storePickupDescription" 
                    defaultMessage="El cliente puede retirar el producto directamente en tu local"
                  />
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose} disabled={loading}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  <FormattedMessage id="cancel" defaultMessage="Cancelar" />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.createButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    <FormattedMessage id="createProduct" defaultMessage="Crear Producto" />
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </GenericModal>
  )
}

export default AddProductModal
