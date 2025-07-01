"use client"

import { useEffect, useState, useCallback } from "react"
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native"
import { Spinner } from "native-base"
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { FormattedMessage, useIntl } from "react-intl"
import moment from "moment-timezone"
import { router } from "expo-router"

import ModalCreateCierre from "./ModalCreateCierre"
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction"
import { useUser } from "@/hooks/redux/useUser"
import { useToastContext } from "@/contexts/ToastContext"
import api from "@/services/api/admin"
import { Colors } from "@/constants/Colors"
import { styles } from "./CierreProvisorioStyles"
import CustomHeader from "@/components/CustomHeader/CustomHeader"

type Cierre = {
  id: number
  inicio: string
  final: string
  estado: string
}

type Status = "Active" | "Pending" | "Finished"

export const CierreProvisorio = () => {
  const { user } = useUser()
  const { showToast } = useToastContext()
  const intl = useIntl()
  const now = moment().tz(user.timeZone)

  const [cierres, setCierres] = useState<Cierre[]>([])
  const [modalState, setModalState] = useState(false)
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false)
  const [loadingApi, setLoadingApi] = useState(false)
  const [loadingCierres, setLoadingCierres] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCierreId, setSelectedCierreId] = useState<number | null>(null)

  const fetchCierres = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoadingCierres(true)
      }

      try {
        const resp = await api.cierreProvisorio.getAll(user.id_empresa)
        if (resp.ok) setCierres(resp.data)
      } catch (error) {
        console.error(error)
        showToast({
          title: intl.formatMessage({
            id: "cierre.error.loading",
            defaultMessage: "Error al cargar cierres",
          }),
          status: "error",
        })
      } finally {
        setLoadingCierres(false)
        setRefreshing(false)
      }
    },
    [user.id_empresa, intl, showToast],
  )

  useEffect(() => {
    fetchCierres()
  }, [fetchCierres])

  const toggleModal = () => setModalState((prev) => !prev)
  const toggleModalConfirmDelete = () => setModalConfirmDelete((prev) => !prev)

  const createNewCierre = async (inicio: Date, fin: Date) => {
    if (inicio >= fin) {
      showToast({
        title: intl.formatMessage({
          id: "cierre.error.invalidDates",
          defaultMessage: "Fechas inválidas",
        }),
        description: intl.formatMessage({
          id: "cierre.error.invalidDatesDesc",
          defaultMessage: "La fecha de inicio debe ser anterior a la fecha de fin",
        }),
        status: "error",
      })
      return
    }

    setLoadingApi(true)
    try {
      const resp = await api.cierreProvisorio.create({
        fecha_inicio: inicio,
        fecha_fin: fin,
        empresaId: user.id_empresa,
      })

      if (resp.ok) {
        showToast({
          title: intl.formatMessage({
            id: "cierre.success.created",
            defaultMessage: "Cierre creado exitosamente",
          }),
          status: "success",
        })
        toggleModal()
        setCierres((prev) => [...prev, resp.data])
      }
    } catch (error) {
      console.error(error)
      showToast({
        title: intl.formatMessage({
          id: "cierre.error.creating",
          defaultMessage: "Error al crear cierre",
        }),
        status: "error",
      })
    } finally {
      setLoadingApi(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setSelectedCierreId(id)
    toggleModalConfirmDelete()
  }

  const confirmDelete = async () => {
    if (!selectedCierreId) return

    setLoadingApi(true)
    try {
      const resp = await api.cierreProvisorio.delete(selectedCierreId)
      if (resp.ok) {
        setCierres((prev) => prev.filter((c) => c.id !== selectedCierreId))
        showToast({
          title: intl.formatMessage({
            id: "cierre.success.deleted",
            defaultMessage: "Cierre eliminado correctamente",
          }),
          status: "success",
        })
        setSelectedCierreId(null)
      }
    } catch (error) {
      console.error(error)
      showToast({
        title: intl.formatMessage({
          id: "cierre.error.deleting",
          defaultMessage: "Error al eliminar cierre",
        }),
        status: "error",
      })
    } finally {
      setLoadingApi(false)
    }
  }

  const onRefresh = useCallback(() => {
    fetchCierres(true)
  }, [fetchCierres])

  const getStatusInfo = (status: Status) => {
    switch (status) {
      case "Pending":
        return {
          color: Colors.light.warning,
          bgColor: Colors.light.warning + "20",
          icon: "schedule",
          label: intl.formatMessage({ id: "cierre.status.pending", defaultMessage: "Pendiente" }),
        }
      case "Active":
        return {
          color: Colors.light.success,
          bgColor: Colors.light.success + "20",
          icon: "play-circle",
          label: intl.formatMessage({ id: "cierre.status.active", defaultMessage: "Activo" }),
        }
      case "Finished":
        return {
          color: Colors.light.textSecondary,
          bgColor: Colors.light.textSecondary + "20",
          icon: "check-circle",
          label: intl.formatMessage({ id: "cierre.status.finished", defaultMessage: "Finalizado" }),
        }
    }
  }

  const renderCierreCard = (cierre: Cierre, index: number) => {
    const inicio = moment.tz(cierre.inicio, user.timeZone)
    const final = moment.tz(cierre.final, user.timeZone)
    const currentStatus: Status = now.isBefore(inicio)
      ? "Pending"
      : now.isBetween(inicio, final, undefined, "[)")
        ? "Active"
        : "Finished"

    const statusInfo = getStatusInfo(currentStatus)

    return (
      <Animated.View key={cierre.id} entering={FadeInDown.duration(600).delay(index * 100)} style={styles.cierreCard}>
        <LinearGradient colors={["#ffffff", "#f8fafc"]} style={styles.cardGradient}>
          <View style={styles.statusBadgeContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
              <MaterialIcons name={statusInfo.icon as any} size={12} color={statusInfo.color} />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.dateRow}>
              <View style={styles.dateIconContainer}>
                <LinearGradient
                  colors={[Colors.light.success + "25", Colors.light.success + "15"]}
                  style={styles.dateIcon}
                >
                  <MaterialIcons name="event" size={18} color={Colors.light.success} />
                </LinearGradient>
              </View>
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>
                  <FormattedMessage id="cierre.startDate" defaultMessage="Fecha de inicio" />
                </Text>
                <Text style={styles.dateValue}>{inicio.format("D [de] MMMM, HH:mm")}</Text>
              </View>
            </View>

            <View style={styles.dateRow}>
              <View style={styles.dateIconContainer}>
                <LinearGradient
                  colors={[Colors.light.danger + "25", Colors.light.danger + "15"]}
                  style={styles.dateIcon}
                >
                  <MaterialIcons name="event-busy" size={18} color={Colors.light.danger} />
                </LinearGradient>
              </View>
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>
                  <FormattedMessage id="cierre.endDate" defaultMessage="Fecha de fin" />
                </Text>
                <Text style={styles.dateValue}>{final.format("D [de] MMMM, HH:mm")}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteClick(cierre.id)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[Colors.light.danger, Colors.light.danger + "DD"]}
                style={styles.deleteButtonGradient}
              >
                <MaterialCommunityIcons name="delete-outline" size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    )
  }

  const renderHeader = () => (
    <CustomHeader
      title={<FormattedMessage id="cierre.title" defaultMessage="Cierres Provisorios" />}
      subtitle={<FormattedMessage id="cierre.subtitle" defaultMessage="Gestiona los horarios de cierre" />}
      onBack={() => router.back()}
    />
  )

  const renderEmptyState = () => (
    <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={[Colors.light.primary + "25", Colors.light.primary + "15"]}
          style={styles.emptyIconBackground}
        >
          <MaterialIcons name="event-busy" size={64} color={Colors.light.primary} />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>
        <FormattedMessage id="cierre.empty.title" defaultMessage="No hay cierres programados" />
      </Text>
      <Text style={styles.emptySubtitle}>
        <FormattedMessage
          id="cierre.empty.subtitle"
          defaultMessage="Programa cierres temporales para gestionar los horarios de tu negocio"
        />
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={toggleModal} activeOpacity={0.8}>
        <LinearGradient colors={[Colors.light.primary, Colors.light.primary + "DD"]} style={styles.emptyButtonGradient}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.emptyButtonText}>
            <FormattedMessage id="cierre.empty.button" defaultMessage="Crear primer cierre" />
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )

  return (
    <View style={styles.container}>
      {renderHeader()}

      {loadingCierres ? (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.loadingContainer}>
            <Spinner size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>
              <FormattedMessage id="cierre.loading" defaultMessage="Cargando cierres..." />
            </Text>
        </Animated.View>
      ) : (
        <View style={styles.content}>
          {cierres.length > 0 ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.light.primary]}
                  tintColor={Colors.light.primary}
                />
              }
            >
              {cierres.map((cierre, index) => renderCierreCard(cierre, index))}
            </ScrollView>
          ) : (
            renderEmptyState()
          )}
        </View>
      )}

      {!loadingCierres && cierres.length > 0 && (
        <Animated.View entering={FadeInUp.duration(600).delay(800)} style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={toggleModal} activeOpacity={0.8}>
            <LinearGradient colors={[Colors.light.primary, Colors.light.primary + "CC"]} style={styles.fabGradient}>
              <Ionicons name="add" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {modalState && (
        <ModalCreateCierre onCreate={createNewCierre} open={modalState} onClose={toggleModal} loading={loadingApi} />
      )}

      {modalConfirmDelete && (
        <ModalConfirmAction
          isOpen={modalConfirmDelete}
          onClose={toggleModalConfirmDelete}
          onContinue={confirmDelete}
          loading={loadingApi}
          title={intl.formatMessage({
            id: "cierre.deleteModal.title",
            defaultMessage: "Eliminar cierre",
          })}
          message={intl.formatMessage({
            id: "cierre.deleteModal.message",
            defaultMessage: "¿Estás seguro de que deseas eliminar este cierre programado?",
          })}
        />
      )}
    </View>
  )
}
