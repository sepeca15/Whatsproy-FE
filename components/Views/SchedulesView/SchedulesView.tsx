"use client"

import { useEffect, useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { View, Text } from "native-base"
import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { FormattedMessage, useIntl } from "react-intl"
import Animated from "react-native-reanimated"

import CustomText from "@/components/CustomText"
import CustomButton from "@/components/CustomButton"
import GlobalModal from "@/components/Modal"
import InputField from "@/components/InputField"
import { globalStyles } from "@/components/globalStyles"
import { useToastContext } from "@/contexts/ToastContext"
import { Colors } from "@/constants/Colors"
import api from "@/services/api/admin"
import { styles } from "./SchedulesViewStyles"

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export type Schedule = {
  id: number
  dayOfWeek: number
  hora_inicio: string
  hora_fin: string
}

const SchedulesView = () => {
  const router = useRouter()
  const intl = useIntl()
  const { showToast } = useToastContext()

  // State management
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedDayName, setSelectedDayName] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
  const [submitted, setSubmitted] = useState(false)
  const [infoModalVisible, setInfoModalVisible] = useState(false)

  const groupedSchedules = DAYS.map((_, idx) => schedules.filter((s) => s.dayOfWeek === idx + 1))

  // API Functions
  const loadSchedules = async () => {
    try {
      setLoading(true)
      const response = await api.schedules.getAll()
      if (response) setSchedules(response)
    } catch (err: any) {
      showToast({
        status: "error",
        title: err?.response?.data?.message ?? intl.formatMessage({ id: "errorLoadingSchedules" }),
      })
    } finally {
      setLoading(false)
    }
  }

  const validateSchedule = (start: string, end: string, selectedDay: number | null) => {
    const newErrors: { [key: string]: string | null } = {}

    if (!start?.trim()) {
      newErrors.start = intl.formatMessage({
        id: "startHourRequired",
        defaultMessage: "La hora de inicio es obligatoria",
      })
    }

    if (!end?.trim()) {
      newErrors.end = intl.formatMessage({
        id: "endHourRequired",
        defaultMessage: "La hora de fin es obligatoria",
      })
    }

    if (selectedDay === null) {
      newErrors.day = intl.formatMessage({
        id: "dayRequired",
        defaultMessage: "El día es obligatorio",
      })
    }

    if (start && end && start >= end) {
      newErrors.start = intl.formatMessage({
        id: "startHourBeforeEnd",
        defaultMessage: "La hora de inicio debe ser antes de la hora de fin",
      })
      newErrors.end = intl.formatMessage({
        id: "endHourAfterStart",
        defaultMessage: "La hora de fin debe ser después de la hora de inicio",
      })
    }

    return newErrors
  }

  const handleAddSchedule = async () => {
    setSubmitted(true)
    const newErrors = validateSchedule(startTime, endTime, selectedDay)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    try {
      setLoadingCreate(true)
      const response = await api.schedules.create({
        dayOfWeek: selectedDay,
        hora_inicio: startTime,
        hora_fin: endTime,
      })

      if (response?.id) {
        showToast({
          status: "success",
          title: intl.formatMessage({ id: "scheduleCreated" }),
        })
        await loadSchedules()
        closeModal()
      }
    } catch (error: any) {
      showToast({
        status: "error",
        title: error?.response?.data?.message ?? intl.formatMessage({ id: "errorCreatingSchedule" }),
      })
    } finally {
      setLoadingCreate(false)
    }
  }

  const handleRemoveSchedule = async (id: number) => {
    try {
      const success = await api.schedules.remove(id)
      if (success) {
        showToast({
          status: "success",
          title: intl.formatMessage({ id: "scheduleDeleted" }),
        })
        await loadSchedules()
      }
    } catch (error: any) {
      showToast({
        status: "error",
        title: error?.response?.data?.message ?? intl.formatMessage({ id: "errorDeletingSchedule" }),
      })
    }
  }

  // Modal functions
  const openModal = (dayIndex: number) => {
    const dayName = intl.formatMessage({ id: `day.${DAYS[dayIndex]}` })
    setSelectedDay(dayIndex + 1)
    setSelectedDayName(dayName)
    setModalVisible(true)
    resetForm()
  }

  const closeModal = () => {
    setModalVisible(false)
    resetForm()
  }

  const resetForm = () => {
    setStartTime("")
    setEndTime("")
    setErrors({})
    setSubmitted(false)
  }

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  useEffect(() => {
    loadSchedules()
  }, [])

  return (
    <View style={globalStyles.containerPage}>
      {/* Header */}
      <Animated.View style={globalStyles.header2}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText style={globalStyles.businessName}>
              <FormattedMessage id="schedules" />
            </CustomText>
          </View>
          {/* Info button in header */}
          <TouchableOpacity style={styles.headerInfoButton} onPress={() => setInfoModalVisible(true)}>
            <Feather name="info" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Schedule List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {loading
          ? // Loading Skeleton
            Array.from({ length: 7 }).map((_, idx) => (
              <View key={idx} style={styles.skeletonCard}>
                <View style={styles.skeletonHeader} />
                <View style={styles.skeletonContent} />
              </View>
            ))
          : // Schedule Cards
            DAYS.map((day, idx) => (
              <View key={idx} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayTitleContainer}>
                    <Feather name="calendar" size={20} color={Colors.light.primary} />
                    <Text style={styles.dayTitle}>
                      <FormattedMessage id={`day.${day}`} />
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.addButton} onPress={() => openModal(idx)}>
                    <Feather name="plus" size={20} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.schedulesContainer}>
                  {groupedSchedules[idx]?.length === 0 ? (
                    <Text style={styles.noSchedulesText}>
                      <FormattedMessage id="noSchedulesForDay" defaultMessage="Sin horarios configurados" />
                    </Text>
                  ) : (
                    groupedSchedules[idx].map((schedule) => (
                      <View key={schedule.id} style={styles.scheduleItem}>
                        <View style={styles.timeContainer}>
                          <Feather name="clock" size={16} color="#666" />
                          <CustomText style={styles.timeText}>
                            {schedule.hora_inicio.slice(0, 5)} - {schedule.hora_fin.slice(0, 5)}
                          </CustomText>
                        </View>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveSchedule(schedule.id)}>
                          <Feather name="trash-2" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>
            ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Info Modal */}
      <GlobalModal
        isVisible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        label={intl.formatMessage({ id: "information", defaultMessage: "Información" })}
        content={
          <View style={styles.infoModalContent}>
            <View style={styles.infoItem}>
              <Feather name="clock" size={20} color={Colors.light.primary} />
              <Text style={styles.infoText}>
                <FormattedMessage
                  id="scheduleInfo1"
                  defaultMessage="Configura los horarios en los que tu asistente estará disponible para recibir reservas."
                />
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Feather name="calendar" size={20} color={Colors.light.primary} />
              <Text style={styles.infoText}>
                <FormattedMessage
                  id="scheduleInfo2"
                  defaultMessage="Puedes agregar múltiples horarios por día para mayor flexibilidad."
                />
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Feather name="bell" size={20} color={Colors.light.primary} />
              <Text style={styles.infoText}>
                <FormattedMessage
                  id="scheduleInfo3"
                  defaultMessage="Los clientes solo podrán hacer consultas durante estos horarios configurados."
                />
              </Text>
            </View>
          </View>
        }
        actions={[
          <CustomButton
            key="understood"
            onPress={() => setInfoModalVisible(false)}
            size="sm"
            backgroundColor={Colors.light.primary}
            borderRadius="6"
          >
            <Text fontWeight={500} color="white">
              {intl.formatMessage({ id: "understood", defaultMessage: "Entendido" })}
            </Text>
          </CustomButton>,
        ]}
      />

      {/* Add Schedule Modal */}
      <GlobalModal
        isVisible={modalVisible}
        onClose={closeModal}
        label={`${selectedDayName} - ${intl.formatMessage({ id: "addSchedule" })}`}
        content={
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <CustomText style={styles.inputLabel}>
                <FormattedMessage id="startHour" defaultMessage="Hora de inicio" />
              </CustomText>
              <InputField
                icon={<SimpleLineIcons style={styles.inputIcon} color="#b6b6b6" name="clock" size={16} />}
                isTime
                placeholder={intl.formatMessage({
                  id: "enterStartTime",
                  defaultMessage: "Ingresa la hora de inicio",
                })}
                value={startTime}
                onChangeText={(value: string) => {
                  setStartTime(value)
                  clearFieldError("start")
                }}
                error={submitted ? errors.start : null}
              />
            </View>

            <View style={styles.inputGroup}>
              <CustomText style={styles.inputLabel}>
                <FormattedMessage id="endHour" defaultMessage="Hora de fin" />
              </CustomText>
              <InputField
                icon={<SimpleLineIcons style={styles.inputIcon} color="#b6b6b6" name="clock" size={16} />}
                isTime
                placeholder={intl.formatMessage({
                  id: "enterEndTime",
                  defaultMessage: "Ingresa la hora de fin",
                })}
                value={endTime}
                onChangeText={(value: string) => {
                  setEndTime(value)
                  clearFieldError("end")
                }}
                error={submitted ? errors.end : null}
              />
            </View>
          </View>
        }
        actions={[
          <CustomButton
            key="save"
            isLoading={loadingCreate}
            onPress={handleAddSchedule}
            size="sm"
            isDisabled={loadingCreate}
            marginLeft={2}
            backgroundColor="#2C2C2C"
            borderRadius="6"
            fontWeight={700}
          >
            <Text fontWeight={500} color="white">
              {intl.formatMessage({ id: "save" })}
            </Text>
          </CustomButton>,
        ]}
      />
    </View>
  )
}

export default SchedulesView
