import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { FormattedMessage, useIntl } from "react-intl";
import { Colors } from "@/constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import { styles } from "./MenusUploadStyles";
import * as Animatable from "react-native-animatable";
import useImagePicker from "@/utils/ImagePicker/useImagePicker";
import ProductPreviewCard from "../ProductConfirm";
import { DetectedProductData } from "../ProductConfirm/ProductPreviewCard";
import { useUser } from "@/hooks/redux/useUser";
import InformativeText from "@/components/InformativeText";
import ImagePreviewModal from "@/components/ImagePreviewModal/ImagePreviewModal";

interface MenuData {
  id: number;
  url: string;
  processed: string;
  createdAt: any;
  nombre: any;
}

const MenusUpload: React.FC = () => {
  const { uploadImage } = useImagePicker({});
  const { user } = useUser();
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [detectedProducts, setDetectedProducts] = useState<
    DetectedProductData[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [menuName, setMenuName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showToast } = useToastContext();
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [previewImageTitle, setPreviewImageTitle] = useState<string>("");

  const intl = useIntl();

  useEffect(() => {
    loadMenus();
  }, []);

  const openImagePreview = (imageUri: string, title: string) => {
    setPreviewImageUri(imageUri);
    setPreviewImageTitle(title);
    setImagePreviewVisible(true);
  };

  const closeImagePreview = () => {
    setImagePreviewVisible(false);
    setPreviewImageUri(null);
    setPreviewImageTitle("");
  };

  const loadMenus = async () => {
    try {
      setLoading(true);
      const resp = await api.menu.find();
      if (resp) {
        setMenus(resp);
      }
    } catch (error) {
      console.log("Error loading menus:", error);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        intl.formatMessage({
          id: "permissionRequired",
          defaultMessage: "Permiso Requerido",
        }),
        intl.formatMessage({
          id: "cameraPermissionMessage",
          defaultMessage: "Necesitamos permisos para acceder a tus fotos.",
        })
      );
      return false;
    }
    return true;
  };

  const pickMenuImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const resImg = result.assets[0];
      await handleImageUpload(resImg);
    }
  };

  const takeMenuPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showToast({
        title: intl.formatMessage({
          id: "permissionRequired",
          defaultMessage: "Permiso Requerido",
        }),
        description: "Necesitamos permisos para usar la cámara.",
        status: "error",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const resImg = result.assets[0];
      await handleImageUpload(resImg);
    }
  };

  const handleImageUpload = async (imageAsset: any) => {
    setUploadingImage(true);
    try {
      const uploadedImageUrl = await uploadImage(imageAsset);
      setUploadedImageUrl(uploadedImageUrl);

      await processImageToText(uploadedImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast({
        title: intl.formatMessage({
          id: "imageUploadError",
          defaultMessage: "Error al subir la imagen",
        }),
        status: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const processImageToText = async (imageUrl: string) => {
    setProcessingImage(true);
    try {
      console.log("Procesando imagen URL:", imageUrl);
      const resp = await api.menu.parseImageToText(imageUrl);

      if (resp.ok && resp.data) {
        const mappedProducts: DetectedProductData[] = resp.data.map(
          (product: any, index: number) => ({
            categoryIds: product.categoryIds || null,
            currency_id: product.currency_id || 1,
            descripcion: product.descripcion || "",
            diaSemana: product.diaSemana || 0,
            disponible:
              product.disponible !== undefined ? product.disponible : true,
            imagen: product.imagen || "",
            isMenuDiario: product.isMenuDiario || false,
            nombre: product.nombre || `Producto ${index + 1}`,
            orderMenuDiario: product.orderMenuDiario || false,
            plazoDuracionEstimadoMinutos:
              product.plazoDuracionEstimadoMinutos || 20,
            precio: product.precio || 0,
            confidence: product.confidence || 0.8,
          })
        );

        setDetectedProducts(mappedProducts);
        setSelectedProducts(new Set(mappedProducts.map((_, index) => index)));
        setMenuName(`Menú ${new Date().toLocaleDateString()}`);
        setShowConfirmation(true);

        showToast({
          title: intl.formatMessage({
            id: "productsDetected",
            defaultMessage: `${mappedProducts.length} productos detectados`,
          }),
          status: "success",
        });
      } else {
        throw new Error("No se pudieron detectar productos en la imagen");
      }
    } catch (error: any) {
      console.error("Error processing image:", error);
      showToast({
        title: intl.formatMessage({
          id: "imageProcessingError",
          defaultMessage: "Error al procesar la imagen",
        }),
        status: "error",
      });
      // Limpiar estados en caso de error
      setUploadedImageUrl(null);
      setDetectedProducts([]);
    } finally {
      setProcessingImage(false);
    }
  };

  const toggleProductSelection = (index: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedProducts(newSelected);
  };

  const updateProduct = (
    index: number,
    field: keyof DetectedProductData,
    value: any
  ) => {
    setDetectedProducts((prev) =>
      prev.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      )
    );
  };

  const handleConfirmProducts = async () => {
    const confirmedProducts = detectedProducts.filter((_, index) =>
      selectedProducts.has(index)
    );

    if (confirmedProducts.length === 0) {
      showToast({
        title: intl.formatMessage({
          id: "noProductsSelected",
          defaultMessage: "Selecciona al menos un producto",
        }),
        status: "warning",
      });
      return;
    }

    try {
      if (!uploadedImageUrl) {
        return;
      }

      setUploadingImage(true);

      const response = await api.menu.create(
        uploadedImageUrl,
        `menu-${menus.length + 1}`
      );

      if (response) {
        const confirmedProducts = detectedProducts.filter((_, index) =>
          selectedProducts.has(index)
        );

        const promises = confirmedProducts.map((product) =>
          api.products.create({
            descripcion: product.descripcion,
            disponible: product.disponible,
            empresa_id: user.empresa_id,
            imagen: "",
            nombre: product.nombre,
            plazoDuracionEstimadoMinutos: product.plazoDuracionEstimadoMinutos,
            precio: product.precio,
            categoryIds: product.categoryIds ?? [],
            currency_id: 1,
          })
        );

        setMenus((prev) => [response, ...prev]);
        resetConfirmationState();

        await Promise.all(promises);

        showToast({
          title: intl.formatMessage({
            id: "menuCreatedSuccessfully",
            defaultMessage: "Menú creado correctamente",
          }),
          status: "success",
        });
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: "menuCreationError",
          defaultMessage: "Error al crear el menú",
        }),
        status: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancelConfirmation = () => {
    resetConfirmationState();
  };

  const resetConfirmationState = () => {
    setShowConfirmation(false);
    setUploadedImageUrl(null);
    setDetectedProducts([]);
    setSelectedProducts(new Set());
    setMenuName("");
  };

  const selectAllProducts = () => {
    setSelectedProducts(new Set(detectedProducts.map((_, index) => index)));
  };

  const selectNoProducts = () => {
    setSelectedProducts(new Set());
  };

  const deleteMenu = async (menuId: number) => {
    try {
      const resp = await api.menu.delete(menuId);
      setMenus((prev) => prev.filter((p) => p.id !== menuId));
      showToast({
        title: "Menú eliminado correctamente",
        status: "success",
      });
      loadMenus();
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error al eliminar el menú",
        status: "error",
      });
    }
  };

  const renderEmptyState = () => (
    <Animatable.View animation="fadeIn" style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>
        <FormattedMessage
          id="noMenusYet"
          defaultMessage="No tienes menús aún"
        />
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        <FormattedMessage
          id="addFirstMenuDescription"
          defaultMessage="Agrega tu primer menú tomando una foto o seleccionando una imagen"
        />
      </Text>

      <View style={styles.addMenuButtonsContainer}>
        <TouchableOpacity
          style={[styles.addMenuButton, styles.cameraButton]}
          onPress={takeMenuPhoto}
          disabled={uploadingImage || processingImage}
        >
          <Icon name="camera" size={20} color="#fff" />
          <Text style={styles.addMenuButtonText}>
            <FormattedMessage id="takePhoto" defaultMessage="Tomar Foto" />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addMenuButton, styles.galleryButton]}
          onPress={pickMenuImage}
          disabled={uploadingImage || processingImage}
        >
          <Icon name="photo" size={20} color="#fff" />
          <Text style={styles.addMenuButtonText}>
            <FormattedMessage id="selectFromGallery" defaultMessage="Galería" />
          </Text>
        </TouchableOpacity>
      </View>

      {(uploadingImage || processingImage) && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.uploadingText}>
            {uploadingImage ? (
              <FormattedMessage
                id="uploadingImage"
                defaultMessage="Subiendo imagen..."
              />
            ) : (
              <FormattedMessage
                id="processingMenuImage"
                defaultMessage="Procesando imagen del menú..."
              />
            )}
          </Text>
        </View>
      )}
    </Animatable.View>
  );

  const renderMenuCard = (menu: MenuData) => (
    <Animatable.View key={menu.id} animation="fadeInUp" style={styles.menuCard}>
      <View style={styles.menuImageContainer}>
        <TouchableOpacity
          onPress={() => openImagePreview(menu.url, menu.nombre)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: menu.url }} style={styles.menuImage} />
          <View style={styles.imageOverlayHint}>
            <Icon
              name="search-plus"
              size={16}
              color="rgba(255, 255, 255, 0.8)"
            />
          </View>
        </TouchableOpacity>
        <Image source={{ uri: menu.url }} style={styles.menuImage} />
        <View style={styles.menuStatusBadge}></View>
      </View>

      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{menu.nombre}</Text>
        <Text style={styles.menuDate}>
          {new Date(menu.createdAt).toLocaleDateString(intl.locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <View style={styles.menuActions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteMenu(menu.id)}
          >
            <Icon name="trash" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </Animatable.View>
  );

  const renderProductConfirmation = () => (
    <ScrollView style={styles.productsList}>
      <View style={styles.confirmationHeader}>
        <TouchableOpacity
          onPress={handleCancelConfirmation}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.confirmationTitle}>
          <FormattedMessage
            id="confirmDetectedProducts"
            defaultMessage="Confirmar Productos"
          />
        </Text>
        <View style={styles.headerRight} />
      </View>

      {uploadedImageUrl && (
        <View style={styles.uploadedImageContainer}>
          <Image
            source={{ uri: uploadedImageUrl }}
            style={styles.uploadedImage}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.detectionSummary}>
              <FormattedMessage
                id="productsDetectedSummary"
                defaultMessage="{detected} productos detectados"
                values={{ detected: detectedProducts.length }}
              />
            </Text>
          </View>
        </View>
      )}

      <View style={styles.menuNameContainer}>
        <Text style={styles.menuNameLabel}>
          <FormattedMessage id="menuName" defaultMessage="Nombre del menú" />
        </Text>
        <TextInput
          style={styles.menuNameInput}
          value={menuName}
          onChangeText={setMenuName}
          placeholder={intl.formatMessage({
            id: "menuNamePlaceholder",
            defaultMessage: "Ej: Menú del día, Almuerzo especial...",
          })}
        />
      </View>

      <View style={styles.bulkActionsContainer}>
        <Text style={styles.sectionTitle}>
          <FormattedMessage
            id="detectedProducts"
            defaultMessage="Productos Detectados"
          />
        </Text>
        <View style={styles.bulkActions}>
          <TouchableOpacity
            style={styles.bulkActionButton}
            onPress={selectAllProducts}
          >
            <Text style={styles.bulkActionText}>
              <FormattedMessage
                id="selectAll"
                defaultMessage="Seleccionar todos"
              />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bulkActionButton}
            onPress={selectNoProducts}
          >
            <Text style={styles.bulkActionText}>
              <FormattedMessage
                id="selectNone"
                defaultMessage="Deseleccionar todos"
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {detectedProducts.map((product, index) => (
        <ProductPreviewCard
          key={index}
          product={product}
          isSelected={selectedProducts.has(index)}
          onToggleSelection={() => toggleProductSelection(index)}
          onChange={(field, value) => updateProduct(index, field, value)}
        />
      ))}

      <View style={styles.bottomActions}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            <FormattedMessage
              id="confirmedProductsCount"
              defaultMessage="{confirmed} de {total} productos confirmados"
              values={{
                confirmed: selectedProducts.size,
                total: detectedProducts.length,
              }}
            />
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelConfirmation}
            disabled={uploadingImage}
          >
            <Text style={styles.cancelButtonText}>
              <FormattedMessage id="cancel" defaultMessage="Cancelar" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              (selectedProducts.size === 0 || uploadingImage) &&
                styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirmProducts}
            disabled={selectedProducts.size === 0 || uploadingImage}
          >
            <Text style={styles.confirmButtonText}>
              {uploadingImage ? (
                <FormattedMessage
                  id="processing"
                  defaultMessage="Procesando..."
                />
              ) : (
                <FormattedMessage id="createMenu" defaultMessage="Crear Menú" />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>
          <FormattedMessage
            id="loadingMenus"
            defaultMessage="Cargando menús..."
          />
        </Text>
      </View>
    );
  }

  if (showConfirmation && detectedProducts.length > 0) {
    return renderProductConfirmation();
  }

  return (
    <View style={styles.container}>
      {menus.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
            <InformativeText
              text={<FormattedMessage id="informativeMenuData" />}
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              <FormattedMessage
                id="dailyMenus"
                defaultMessage="Menús Diarios"
              />
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={pickMenuImage}
              disabled={uploadingImage || processingImage}
            >
              <Icon name="plus" size={16} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.menusList}
            showsVerticalScrollIndicator={false}
          >
            {menus.map(renderMenuCard)}
          </ScrollView>

          {(uploadingImage || processingImage) && (
            <View style={styles.uploadingOverlay}>
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.uploadingText}>
                  {uploadingImage ? (
                    <FormattedMessage
                      id="uploadingImage"
                      defaultMessage="Subiendo imagen..."
                    />
                  ) : (
                    <FormattedMessage
                      id="processingMenuImage"
                      defaultMessage="Procesando imagen del menú..."
                    />
                  )}
                </Text>
                <Text style={styles.uploadingText}>
                  <FormattedMessage id="puedeTardar" />
                </Text>
              </View>
            </View>
          )}
        </>
      )}

      <ImagePreviewModal
        visible={imagePreviewVisible}
        imageUri={previewImageUri}
        title={previewImageTitle}
        onClose={closeImagePreview}
      />
    </View>
  );
};

export default MenusUpload;
