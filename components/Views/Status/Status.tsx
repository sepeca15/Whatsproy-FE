"use client"

import { useEffect, useRef, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import DraggableFlatList, { type RenderItemParams } from "react-native-draggable-flatlist"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Progress from "react-native-progress"
import { Colors } from "@/constants/Colors"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { router } from "expo-router"
import { FormattedMessage } from "react-intl"
import CustomText from "@/components/CustomText"
import api from "@/services/api/admin"
import ModalCreateOrEditStatus from "./components/ModalCreateOrEditStatus"
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction"
import { useColorScheme } from "react-native"
import { styles } from "./StatusStyles"

export interface IEstado {
  id: number
  nombre: string
  es_defecto: boolean
  finalizador: boolean
  tipoServicioId: number
  order: number | null
  createdAt: string
  updatedAt: string
}

const StatusView = () => {
  const [status, setStatus] = useState<IEstado[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<IEstado | null>(null)
  const [modalDelete, setModalDelete] = useState<IEstado | null>(null)
  const originalOrderRef = useRef<IEstado[]>([])
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = isDark ? Colors.dark : Colors.light

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const resp = await api.status.findAll()
      if (resp.ok) setStatus(resp.data)
    } catch (error: any) {
      console.error(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (updated: IEstado) => {
    try {
      await api.status.update(updated.id, updated)
      fetchStatus()
    } catch (error: any) {
      console.error(error.response?.data?.message)
    }
  }

  const deleteStatus = async (id: number) => {
    try {
      const resp = await api.status.delete(id)
      if (resp.ok) fetchStatus()
    } catch (error: any) {
      console.error(error.response.data.message)
    }
  }

  const handleDragBegin = () => {
    originalOrderRef.current = [...status]
  }

  const handleDragEnd = async ({ data, from, to }: { data: IEstado[]; from: number; to: number }) => {
    if (from === to) return

    const movedItem = status[from]
    const newOrder = to + 1

    try {
      await updateStatus({ ...movedItem, order: newOrder })
    } catch (err) {
      console.error("Error al actualizar el orden", err)
    }
  }

  const toggleModal = () => setModalVisible((prev) => !prev)
  const toggleDeleteModal = () => setModalDelete(null)

  const handleEdit = (item: IEstado) => {
    setSelectedItem(item)
    toggleModal()
  }

  const addOrEditNewStatus = () => {
    fetchStatus()
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<IEstado>) => (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={[
        styles.itemContainer,
        {
          backgroundColor: isActive ? (isDark ? "#2A2D30" : "#E8EDF2") : isDark ? "#1E2022" : "white",
          borderColor: isActive ? colors.primary : isDark ? "#2A2D30" : "#E8EDF2",
        },
      ]}
    >
      <TouchableOpacity onLongPress={drag} delayLongPress={200} style={styles.itemContent} activeOpacity={0.7}>
        <View style={styles.orderColumn}>
          <View style={styles.dragHandle}>
            <FontAwesome name="bars" size={16} color={isDark ? "#9BA1A6" : "#687076"} />
          </View>
          <Text style={[styles.orderText, { color: colors.text }]}>{item.order}</Text>
        </View>

        <View style={styles.nameColumn}>
          <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
            {item.nombre}
          </Text>
        </View>

        <View style={styles.finalizerColumn}>
          <View
            style={[
              styles.finalizerBadge,
              {
                backgroundColor: item.finalizador
                  ? isDark
                    ? "rgba(18, 140, 126, 0.2)"
                    : "rgba(18, 140, 126, 0.1)"
                  : isDark
                    ? "rgba(150, 150, 150, 0.2)"
                    : "rgba(150, 150, 150, 0.1)",
              },
            ]}
          >
            <Text
              style={[
                styles.finalizerText,
                {
                  color: item.finalizador ? colors.secondary : isDark ? "#9BA1A6" : "#687076",
                },
              ]}
            >
              {item.finalizador ? "SI" : "NO"}
            </Text>
          </View>
        </View>

        <View style={styles.actionsColumn}>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => setModalDelete(item)}>
            <MaterialCommunityIcons name="delete-outline" size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.editButton, { borderColor: isDark ? "#2A2D30" : "#E8EDF2" }]}
            onPress={() => handleEdit(item)}
          >
            <FontAwesome name="edit" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(500)} style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={22} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <CustomText style={styles.headerTitle}>
              <FormattedMessage id="statusTitlePage" />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      <View style={styles.container}>
        {/* Info Banner */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={[
            styles.infoBanner,
            { backgroundColor: isDark ? "rgba(18, 140, 126, 0.15)" : "rgba(18, 140, 126, 0.08)" },
          ]}
        >
          <Ionicons name="information-circle-outline" size={20} color={colors.secondary} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: colors.secondary }]}>
            Drag and drop elements and create the status for the order you want!
          </Text>
        </Animated.View>

        {/* Table Content */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Progress.Circle color={colors.primary} indeterminate size={50} />
            </View>
          ) : status.length > 0 ? (
            <>
              {/* Table Header */}
              <Animated.View
                entering={FadeInDown.delay(100).duration(500)}
                style={[styles.tableHeader, { backgroundColor: isDark ? "#2A2D30" : "#F5F7FA" }]}
              >
                <Text style={[styles.headerCell, styles.orderColumn, { color: isDark ? "#9BA1A6" : "#687076" }]}>
                  Orden
                </Text>
                <Text style={[styles.headerCell, styles.nameColumn, { color: isDark ? "#9BA1A6" : "#687076" }]}>
                  Nombre
                </Text>
                <Text style={[styles.headerCell, styles.finalizerColumn, { color: isDark ? "#9BA1A6" : "#687076" }]}>
                  Finalizador
                </Text>
                <Text style={[styles.headerCell, styles.actionsColumn, { color: isDark ? "#9BA1A6" : "#687076" }]}>
                  Acciones
                </Text>
              </Animated.View>

              {/* Draggable List */}
              <DraggableFlatList
                contentContainerStyle={styles.listContent}
                data={status}
                keyExtractor={(item) => item.id.toString()}
                onDragEnd={handleDragEnd}
                onDragBegin={handleDragBegin}
                renderItem={renderItem}
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="format-list-text" size={60} color={isDark ? "#2A2D30" : "#E8EDF2"} />
              <Text style={[styles.emptyText, { color: isDark ? "#9BA1A6" : "#687076" }]}>
                No hay estados creados aún.
              </Text>
            </View>
          )}
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={toggleModal}
          style={[styles.fab, { backgroundColor: colors.secondary }]}
          activeOpacity={0.8}
        >
          <Ionicons name="add" color="white" size={26} />
        </TouchableOpacity>

        {/* Modals */}
        <ModalCreateOrEditStatus
          selectedItem={selectedItem}
          addOrEditNewStatus={addOrEditNewStatus}
          isOpen={modalVisible}
          onClose={() => {
            toggleModal()
            setSelectedItem(null)
          }}
        />

        <ModalConfirmAction
          isOpen={!!modalDelete}
          onClose={toggleDeleteModal}
          title="Borrar estado"
          message="¿Seguro que deseas eliminar este estado?"
          onContinue={() => {
            if (modalDelete) deleteStatus(modalDelete.id)
            toggleDeleteModal()
          }}
        />
      </View>
    </GestureHandlerRootView>
  )
}

export default StatusView
