"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import api from "@/services/api/admin";
import { FormattedMessage, useIntl } from "react-intl";
import LottieView from "lottie-react-native";
import type {
  Product,
  ProductBDD,
  DayslySalesData,
  MonthlySalesData,
} from "../../../../../hooks/dataProduct";
import { useUser } from "@/hooks/redux/useUser";
import AlertConfirmationModal from "../../../../../hooks/AlertModalConfirmation/alertConfirmation";
import { useToastContext } from "@/contexts/ToastContext";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";

interface ProductCardProps {
  product: Product;
  productBDD: ProductBDD;
  monthlySalesData: MonthlySalesData;
  dayslySalesData: DayslySalesData;
  onUpdateProduct: (newProduct: any) => void;
  onDeleteRequest: (productId: number) => void;
  isBeingDeleted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  productBDD,
  monthlySalesData,
  dayslySalesData,
  onUpdateProduct,
  onDeleteRequest,
  isBeingDeleted,
}) => {
  const router = useRouter();
  const intl = useIntl();
  const [modalVisible, setModalVisible] = useState(false);
  const [localDisponible, setLocalDisponible] = useState(productBDD.disponible);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showDisableAlert, setShowDisableAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { user } = useUser();

  const currencies = user?.currencies ?? [];
  const currenctCurrency = currencies.find(
    (itm: any) => itm?.id === productBDD?.currency_id
  ) ?? {
    simbolo: "$",
    codigo: "USD",
  };

  const slideOutAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isBeingDeleted) {
      Animated.parallel([
        Animated.timing(slideOutAnim, {
          toValue: 500,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isBeingDeleted, slideOutAnim, opacityAnim]);

  const handleImageLoad = () => setLoading(false);
  const { showToast } = useToastContext();

  const toast = (msgKey: string, type: "success" | "error", action: string) => {
    showToast({
      title: intl.formatMessage({ id: msgKey }),
      status: type,
    });
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(tabs)/editprod",
      params: {
        id: productBDD.id.toString(),
        title: productBDD.nombre,
        price: productBDD.precio?.toString(),
        currency: currenctCurrency.simbolo,
        description: productBDD.descripcion,
        imageUrl: productBDD.imagen || "../errorimage.png",
        duration: productBDD.plazoDuracionEstimadoMinutos.toString(),
        currency_id: productBDD.currency_id,
        disponible: productBDD?.disponible?.toString(),
        category: productBDD?.category?.map((cat) => cat.id).join(","),
      },
    });
  };

  const handleView = () => {
    router.push({
      pathname: "/(tabs)/graficprod",
      params: {
        id: productBDD.id.toString(),
        title: productBDD.nombre,
        price: productBDD.precio?.toString(),
        currency: currenctCurrency.simbolo,
        duration: productBDD.plazoDuracionEstimadoMinutos.toString(),
        description: productBDD.descripcion,
        imageUrl: productBDD.imagen || "../errorimage.png",
        rating: product.rating,
        currency_id: productBDD.currency_id,
        reviews: product.reviews,
        tags: product.tags,
        daydata: JSON.stringify(dayslySalesData),
        monthdata: JSON.stringify(monthlySalesData),
        disponible: productBDD.disponible.toString(),
        empresa_id: productBDD.empresa_id.toString(),
        category: productBDD.category,
      },
    });
  };

  const confirmDisable = async () => {
    setShowDisableAlert(false);
    setProcessing(true);
    const newDisponible = false;
    setLocalDisponible(newDisponible);

    try {
      const res = await api.products.update(productBDD.id, {
        ...productBDD,
        disponible: newDisponible,
      });

      if (res.data?.ok) {
        toast(
          intl.formatMessage({ id: "disableSuccess" }),
          "success",
          "disable"
        );
        onUpdateProduct(res.data.data);
      }
    } catch {
      toast(intl.formatMessage({ id: "disableError" }), "error", "disable");
      setLocalDisponible(true);
    } finally {
      setProcessing(false);
    }
  };

  const toggleAvailability = () => {
    if (processing) return;

    if (localDisponible) {
      setShowDisableAlert(true);
    } else {
      setProcessing(true);
      const newDisponible = true;
      setLocalDisponible(newDisponible);

      api.products
        .update(productBDD.id, { ...productBDD, disponible: newDisponible })
        .then(({ data }) => {
          if (data.ok) {
            toast("enableSuccess", "success", "enable");
            onUpdateProduct(data.data);
          }
        })
        .catch(() => {
          toast("enableError", "error", "enable");
          setLocalDisponible(false);
        })
        .finally(() => setProcessing(false));
    }
    setModalVisible(false);
  };

  const handleDelete = () => {
    setShowDeleteAlert(true);
    setModalVisible(false);
  };

  const confirmDelete = () => {
    setShowDeleteAlert(false);
    onDeleteRequest(productBDD.id);
    toast("productDeleted", "success", "delete");
  };

  return (
    <>
      <Animated.View
        style={[
          enhancedStyles.container,
          { transform: [{ translateX: slideOutAnim }], opacity: opacityAnim },
        ]}
      >
        {!localDisponible && (
          <View style={enhancedStyles.disabledBadge}>
            <Text style={enhancedStyles.disabledText}>
              <FormattedMessage
                id="notAvailable"
                defaultMessage="No disponible"
              />
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleView}
          style={enhancedStyles.cardTouchable}
          disabled={processing}
        >
          <View style={enhancedStyles.card as any}>
            <View style={enhancedStyles.imageContainer}>
              {loading && (
                <View style={enhancedStyles.loadingContainer}>
                  <LottieView
                    source={require("../../../../../constants/Animation-1742586349562.json")}
                    autoPlay
                    loop
                    style={enhancedStyles.loadingAnimation}
                  />
                </View>
              )}
              <Image
                source={{ uri: productBDD.imagen ?? "https://ebschool.net/images/default-image.jpg" }}
                style={enhancedStyles.image as any}
                onLoad={handleImageLoad}
              />

              <View
                style={[
                  enhancedStyles.statusIndicator,
                  { backgroundColor: localDisponible ? "#10b981" : "#ef4444" },
                ]}
              />
            </View>

            <View style={enhancedStyles.content}>
              <View style={enhancedStyles.header}>
                <Text style={enhancedStyles.title} numberOfLines={2}>
                  {productBDD.nombre}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={enhancedStyles.moreButton}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                  disabled={processing}
                >
                  <Icon name="more-vertical" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View style={enhancedStyles.priceContainer}>
                <Text style={enhancedStyles.price}>
                  {currenctCurrency.simbolo}
                  {Number(productBDD.precio).toFixed(2)}
                </Text>
                <Text style={enhancedStyles.currency}>
                  {currenctCurrency.codigo}
                </Text>
              </View>

              <Text style={enhancedStyles.description} numberOfLines={2}>
                {productBDD.descripcion}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={enhancedStyles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={enhancedStyles.modalContainer as any}>
              <View style={enhancedStyles.modalHeader}>
                <Text style={enhancedStyles.modalTitle}>
                  Opciones del producto
                </Text>
              </View>

              <View style={enhancedStyles.modalContent}>
                <TouchableOpacity
                  style={enhancedStyles.modalOption}
                  onPress={handleView}
                  disabled={processing}
                >
                  <View
                    style={[
                      enhancedStyles.modalIconContainer,
                      { backgroundColor: "#f0f9ff" },
                    ]}
                  >
                    <Icon name="eye" size={18} color="#0ea5e9" />
                  </View>
                  <Text style={enhancedStyles.modalOptionText}>
                    <FormattedMessage
                      id="viewModal"
                      defaultMessage="Ver detalles"
                    />
                  </Text>
                  <Icon name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={enhancedStyles.modalOption}
                  onPress={handleEdit}
                  disabled={processing}
                >
                  <View
                    style={[
                      enhancedStyles.modalIconContainer,
                      { backgroundColor: "#f0fdf4" },
                    ]}
                  >
                    <Icon name="edit" size={18} color="#22c55e" />
                  </View>
                  <Text style={enhancedStyles.modalOptionText}>
                    <FormattedMessage id="edit" defaultMessage="Editar" />
                  </Text>
                  <Icon name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={enhancedStyles.modalOption}
                  onPress={toggleAvailability}
                  disabled={processing}
                >
                  <View
                    style={[
                      enhancedStyles.modalIconContainer,
                      { backgroundColor: "#fef3c7" },
                    ]}
                  >
                    <Icon name="archive" size={18} color="#f59e0b" />
                  </View>
                  <Text style={enhancedStyles.modalOptionText}>
                    {localDisponible ? (
                      <FormattedMessage
                        id="disable"
                        defaultMessage="Deshabilitar"
                      />
                    ) : (
                      <FormattedMessage
                        id="enable"
                        defaultMessage="Habilitar"
                      />
                    )}
                  </Text>
                  <Icon name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={enhancedStyles.modalOption}
                  onPress={handleDelete}
                  disabled={processing}
                >
                  <View
                    style={[
                      enhancedStyles.modalIconContainer,
                      { backgroundColor: "#fef2f2" },
                    ]}
                  >
                    <Icon name="trash-2" size={18} color="#ef4444" />
                  </View>
                  <Text style={enhancedStyles.modalOptionText}>
                    <FormattedMessage id="delete" defaultMessage="Eliminar" />
                  </Text>
                  <Icon name="chevron-right" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </Animated.View>

      <AlertConfirmationModal
        show={showDisableAlert}
        processing={processing}
        title={intl.formatMessage({
          id: "confirmDisable",
          defaultMessage: "Confirmar deshabilitación",
        })}
        message={intl.formatMessage({
          id: "confirmDisableMessage",
          defaultMessage:
            "¿Estás seguro de que quieres deshabilitar este producto?",
        })}
        cancelText={intl.formatMessage({
          id: "cancel",
          defaultMessage: "Cancelar",
        })}
        confirmText={intl.formatMessage({
          id: "disable",
          defaultMessage: "Deshabilitar",
        })}
        onCancel={() => setShowDisableAlert(false)}
        onConfirm={confirmDisable}
      />

      <ModalConfirmAction
        isOpen={showDeleteAlert}
        loading={processing}
        title={intl.formatMessage({
          id: "confirmDelete",
          defaultMessage: "Confirmar eliminación",
        })}
        message={intl.formatMessage({
          id: "confirmDeleteMessage",
          defaultMessage:
            "¿Estás seguro de que quieres eliminar este producto?",
        })}
        withReason={false}
        onClose={() => setShowDeleteAlert(false)}
        onContinue={confirmDelete}
      />
    </>
  );
};

const enhancedStyles = {
  container: {
    marginBottom: 12,
    marginHorizontal: 0,
  },
  cardTouchable: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    flexDirection: "row" as const,
    minHeight: 120,
  },
  imageContainer: {
    position: "relative" as const,
    width: 120,
    height: 120,
    backgroundColor: "#f9fafb",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover" as const,
  },
  loadingContainer: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: "#f9fafb",
  },
  loadingAnimation: {
    width: 40,
    height: 40,
  },
  statusIndicator: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  disabledBadge: {
    position: "absolute" as const,
    top: 6,
    left: 6,
    backgroundColor: "#ef4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  disabledText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600" as const,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between" as const,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#111827",
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  moreButton: {
    padding: 3,
    borderRadius: 6,
    backgroundColor: "#f9fafb",
  },
  priceContainer: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#075e54",
    marginRight: 3,
  },
  currency: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: "#6b7280",
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#111827",
    textAlign: "center" as const,
  },
  modalContent: {
    padding: 8,
  },
  modalOption: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  modalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: "#374151",
    flex: 1,
  },
};

export default ProductCard;
