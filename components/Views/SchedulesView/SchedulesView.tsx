"use client"

import { useEffect, useState, useCallback } from "react"
import { ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { View, Text, Spinner } from "native-base"
import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { FormattedMessage, useIntl } from "react-intl"
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"

import CustomText from "@/components/CustomText"
import CustomButton from "@/components/CustomButton"
import InputField from "@/components/InputField"
import CustomHeader from "@/components/CustomHeader/CustomHeader"
import { useToastContext } from "@/contexts/ToastContext"
import { Colors } from "@/constants/Colors"
import api from "@/services/api/admin"
import { styles } from "./SchedulesViewStyles"
import GenericModal from "../ConfigAccount/components/GenericModal/GenericModal"

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

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedDayName, setSelectedDayName] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
  const [submitted, setSubmitted] = useState(false)
  const [infoModalVisible, setInfoModalVisible] = useState(false)

  const groupedSchedules = DAYS.map((_, idx) => schedules.filter((s) => s.dayOfWeek === idx + 1))
  const totalSchedules = schedules.length
  const activeDays = groupedSchedules.filter(daySchedules => daySchedules.length > 0).length

  const loadSchedules = useCallback(async () => {
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
  }, [intl, showToast])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadSchedules()
    setRefreshing(false)
  }, [loadSchedules])

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

  const getDayIcon = (dayIndex: number) => {
    const hasSchedules = groupedSchedules[dayIndex]?.length > 0
    return hasSchedules ? "check-circle" : "calendar"
  }

  const getDayColor = (dayIndex: number) => {
    const hasSchedules = groupedSchedules[dayIndex]?.length > 0
    return hasSchedules ? Colors.light.success : Colors.light.textSecondary
  }

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  const renderEmptyState = () => (
    <Animated.View entering={FadeIn.delay(300)} style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Feather name="calendar" size={48} color={Colors.light.textSecondary} />
      </View>
      <CustomText style={styles.emptyTitle}>
        <FormattedMessage id="noSchedulesYet" defaultMessage="Sin horarios configurados" />
      </CustomText>
      <CustomText style={styles.emptyDescription}>
        <FormattedMessage 
          id="noSchedulesDescription" 
          defaultMessage="Configura los horarios de disponibilidad para tu asistente" 
        />
      </CustomText>
    </Animated.View>
  )

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      {Array.from({ length: 7 }).map((_, idx) => (
        <Animated.View 
          key={idx} 
          entering={FadeInDown.delay(idx * 100)}
          style={styles.skeletonCard}
        >
          <View style={styles.skeletonHeader} />
          <View style={styles.skeletonContent} />
        </Animated.View>
      ))}
    </View>
  )

  return (
    <View style={styles.container}>
      <CustomHeader
        title={<FormattedMessage id="schedules" defaultMessage="Horarios" />}
        onBack={() => router.back()}
        showBackButton
        rightComponent={
          <TouchableOpacity 
            style={styles.headerInfoButton} 
            onPress={() => setInfoModalVisible(true)}
          >
            <Feather name="info" size={20} color="white" />
          </TouchableOpacity>
        }
      />

      <Animated.View entering={FadeIn.delay(200)} style={styles.bannerContainer}>
        <LinearGradient
          colors={[Colors.light.primary + '15', Colors.light.primary + '05']}
          style={styles.banner}
        >
          <View style={styles.bannerIconContainer}>
            <Feather name="info" size={16} color={Colors.light.primary} />
          </View>
          <View style={styles.bannerTextContainer}>
            <CustomText style={styles.bannerText}>
              <FormattedMessage 
                id="scheduleBannerText" 
                defaultMessage="Configura los horarios en los que tu asistente estará disponible"
              />
            </CustomText>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollContainer} 
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
        {loading ? renderLoadingState() : (
          <>
            {totalSchedules === 0 ? renderEmptyState() : (
              DAYS.map((day, idx) => (
                <Animated.View 
                  key={idx} 
                  entering={FadeInDown.delay(idx * 100)}
                  style={styles.dayCard}
                >
                  <LinearGradient
                    colors={['#ffffff', '#f8fafc']}
                    style={styles.dayCardGradient}
                  >
                    <View style={styles.dayHeader}>
                      <View style={styles.dayTitleContainer}>
                        <View style={[
                          styles.dayIconContainer,
                          { backgroundColor: getDayColor(idx) + '15' }
                        ]}>
                          <Feather 
                            name={getDayIcon(idx)} 
                            size={18} 
                            color={getDayColor(idx)} 
                          />
                        </View>
                        <View>
                          <CustomText style={styles.dayTitle}>
                            <FormattedMessage id={`day.${day}`} />
                          </CustomText>
                          <CustomText style={styles.daySubtitle}>
                            {groupedSchedules[idx]?.length || 0} {' '}
                            <FormattedMessage 
                              id="schedules" 
                              defaultMessage="horarios"
                            />
                          </CustomText>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.addButton} 
                        onPress={() => openModal(idx)}
                      >
                        <Feather name="plus" size={18} color={Colors.light.primary} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.schedulesContainer}>
                      {groupedSchedules[idx]?.length === 0 ? (
                        <View style={styles.noSchedulesContainer}>
                          <CustomText style={styles.noSchedulesText}>
                            <FormattedMessage 
                              id="noSchedulesForDay" 
                              defaultMessage="Sin horarios configurados" 
                            />
                          </CustomText>
                        </View>
                      ) : (
                        groupedSchedules[idx].map((schedule, scheduleIdx) => (
                          <Animated.View 
                            key={schedule.id}
                            entering={FadeInDown.delay(scheduleIdx * 50)}
                            style={styles.scheduleItem}
                          >
                            <View style={styles.scheduleContent}>
                              <View style={styles.timeIconContainer}>
                                <Feather name="clock" size={14} color={Colors.light.primary} />
                              </View>
                              <CustomText style={styles.timeText}>
                                {schedule.hora_inicio.slice(0, 5)} - {schedule.hora_fin.slice(0, 5)}
                              </CustomText>
                            </View>
                            <TouchableOpacity 
                              style={styles.deleteButton} 
                              onPress={() => handleRemoveSchedule(schedule.id)}
                            >
                              <Feather name="trash-2" size={14} color={Colors.light.error} />
                            </TouchableOpacity>
                          </Animated.View>
                        ))
                      )}
                    </View>
                  </LinearGradient>
                </Animated.View>
              ))
            )}
            <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>

      <GenericModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={intl.formatMessage({ id: "information", defaultMessage: "Información" })}
      >
        <View style={styles.infoModalContent}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Feather name="clock" size={20} color={Colors.light.primary} />
            </View>
            <CustomText style={styles.infoText}>
              <FormattedMessage
                id="scheduleInfo1"
                defaultMessage="Configura los horarios en los que tu asistente estará disponible para recibir reservas."
              />
            </CustomText>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Feather name="calendar" size={20} color={Colors.light.primary} />
            </View>
            <CustomText style={styles.infoText}>
              <FormattedMessage
                id="scheduleInfo2"
                defaultMessage="Puedes agregar múltiples horarios por día para mayor flexibilidad."
              />
            </CustomText>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Feather name="bell" size={20} color={Colors.light.primary} />
            </View>
            <CustomText style={styles.infoText}>
              <FormattedMessage
                id="scheduleInfo3"
                defaultMessage="Los clientes solo podrán hacer consultas durante estos horarios configurados."
              />
            </CustomText>
          </View>
        </View>
        
        <View style={styles.modalActions}>
          <CustomButton
            onPress={() => setInfoModalVisible(false)}
            size="medium"
            backgroundColor={Colors.light.primary}
            style={styles.modalButton}
          >
            <CustomText style={styles.modalButtonText}>
              {intl.formatMessage({ id: "understood", defaultMessage: "Entendido" })}
            </CustomText>
          </CustomButton>
        </View>
      </GenericModal>

      <GenericModal
        visible={modalVisible}
        onClose={closeModal}
        title={`${selectedDayName} - ${intl.formatMessage({ id: "addSchedule" })}`}
      >
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

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={closeModal}
          >
            <CustomText style={styles.cancelButtonText}>
              {intl.formatMessage({ id: "cancel" })}
            </CustomText>
          </TouchableOpacity>
          
          <CustomButton
            isLoading={loadingCreate}
            onPress={handleAddSchedule}
            size="medium"
            isDisabled={loadingCreate}
            backgroundColor={Colors.light.primary}
            style={styles.saveButton}
          >
            <CustomText style={styles.saveButtonText}>
              {intl.formatMessage({ id: "save" })}
            </CustomText>
          </CustomButton>
        </View>
      </GenericModal>
    </View>
  )
}

export default SchedulesView
