// components/SchedulesView.tsx
import CustomText from "@/components/CustomText";
import { globalStyles } from "@/components/globalStyles";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text } from "native-base";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ScrollView, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import GlobalModal from "@/components/Modal";
import CustomButton from "@/components/CustomButton";
import { Colors } from "@/constants/Colors";
import { styles as generalSettingsStyles } from "../GeneralSettings/GeneralSettingsStyles";
import InputField from "@/components/InputField";

const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export type Schedule = {
    id: number;
    dayOfWeek: number;
    hora_inicio: string;
    hora_fin: string;
};

const SchedulesView = () => {
    const router = useRouter();
    const intl = useIntl();
    const { showToast } = useToastContext();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addClicked, setAddClicked] = useState<any>(null)
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

    const groupedSchedules = DAYS.map((_, idx) =>
        schedules.filter((s) => s.dayOfWeek === idx + 1)
    );

    const loadSchedules = async () => {
        try {
            setLoading(true);
            const response = await api.schedules.getAll();
            if (response) setSchedules(response);
        } catch (err: any) {
            showToast({
                status: "error",
                title: err?.response?.data?.message ?? intl.formatMessage({ id: "errorLoadingSchedules" })
            });
        } finally {
            setLoading(false);
        }
    };
    const validateSchedule = (
        start: string,
        end: string,
        selectedDay: number | null,
        intl: any
    ): { [key: string]: string | null } => {
        const newErrors: { [key: string]: string | null } = {};

        if (!start || !start.trim()) {
            newErrors.start = intl.formatMessage({ id: "startHourRequired", defaultMessage: "La hora de inicio es obligatoria" });
        }

        if (!end || !end.trim()) {
            newErrors.end = intl.formatMessage({ id: "endHourRequired", defaultMessage: "La hora de fin es obligatoria" });
        }

        if (selectedDay === null) {
            newErrors.day = intl.formatMessage({ id: "dayRequired", defaultMessage: "El día es obligatorio" });
        }

        return newErrors;
    };

    const handleAdd = async () => {
        const newErrors = validateSchedule(start, end, selectedDay, intl);
        if (start && end && start >= end) {
            newErrors.start = intl.formatMessage({ id: "startHourBeforeEnd", defaultMessage: "La hora de inicio debe ser antes de la hora de fin" });
            newErrors.end = intl.formatMessage({ id: "endHourAfterStart", defaultMessage: "La hora de fin debe ser después de la hora de inicio" });
      
    }
    
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;
        try {
            setLoadingCreate(true);
            const res = await api.schedules.create({
                dayOfWeek: selectedDay,
                hora_inicio: start,
                hora_fin: end
            });
            if (res?.id) {
                showToast({
                    status: "success",
                    title: intl.formatMessage({ id: "scheduleCreated" })
                });
                await loadSchedules();
                setModalVisible(false);
                setStart("");
                setEnd("");
            }
        } catch (e: any) {
            showToast({
                status: "error",
                title: e?.response?.data?.message ?? intl.formatMessage({ id: "errorCreatingSchedule" })
            });
        } finally {
            setLoadingCreate(false);
        }
    };

    const handleRemove = async (id: number) => {
        try {
            const ok = await api.schedules.remove(id);
            if (ok) {
                showToast({
                    status: "success",
                    title: intl.formatMessage({ id: "scheduleDeleted" })
                });
                await loadSchedules();
            }
        } catch (err: any) {
            showToast({
                status: "error",
                title: err?.response?.data?.message ?? intl.formatMessage({ id: "errorDeletingSchedule" })
            });
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);

    return (
        <View style={globalStyles.containerPage}>
            <Animated.View style={globalStyles.header2}>
                <TouchableOpacity
                    style={globalStyles.backButton}
                    onPress={() => router.back()}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <View style={globalStyles.headerContent}>
                    <View style={globalStyles.headerLeft}>
                        <CustomText style={globalStyles.businessName}>
                            <FormattedMessage id="schedules" />
                        </CustomText>
                    </View>
                </View>
            </Animated.View>

            <View style={{ paddingHorizontal: 16, paddingTop: 0, paddingBottom: 8 }}>
                <Text fontSize="xl" bold color="#111">
                    <FormattedMessage id="schedulesTitle" defaultMessage="Horarios de atención" />
                </Text>
                <Text fontSize="sm" color="gray.600" marginTop={2}>
                    <FormattedMessage
                        id="schedulesDescription"
                        defaultMessage="Aquí puedes configurar los horarios en los que el asistente estará disponible para recibir reservas o consultas."
                    />
                </Text>
            </View>
            <ScrollView style={{ padding: 16 }}>
                {
                    loading ? (
                        Array.from({ length: 7 }).map((_, idx) => (
                            <View key={idx} style={{
                                backgroundColor: "#f0f0f0",
                                height: 100,
                                borderRadius: 12,
                                marginBottom: 4,
                                padding: 16,
                                justifyContent: 'center'
                            }}>
                                <View style={{ backgroundColor: "#ddd", height: 20, width: "40%", borderRadius: 4, marginBottom: 12 }} />
                                <View style={{ backgroundColor: "#ddd", height: 16, width: "80%", borderRadius: 4 }} />
                            </View>
                        ))
                    ) : (
                        DAYS.map((day, idx) => {

                            return (
                                <View
                                    key={idx}
                                    style={{
                                        marginBottom: 20,
                                        padding: 16,
                                        backgroundColor: '#fff',
                                        borderRadius: 16,
                                        shadowColor: '#000',
                                        shadowOpacity: 0.05,
                                        shadowRadius: 8,
                                        elevation: 2
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <Feather name="calendar" size={18} color="#333" />
                                            <Text fontSize="md" bold color="#333">
                                                <FormattedMessage id={`day.${day}`} />
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => { setSelectedDay((idx + 1)); setModalVisible(true); setAddClicked(intl.formatMessage({ id: `day.${day}` })) }}>
                                            <Feather name="plus-circle" size={22} color={Colors.light.primary} />
                                        </TouchableOpacity>
                                    </View>

                                    {groupedSchedules[idx]?.length === 0 ? (
                                        <Text color="gray.500">
                                            <FormattedMessage id="noSchedulesForDay" />
                                        </Text>
                                    ) : (
                                        groupedSchedules[idx].map(s => (
                                            <View
                                                key={s.id}
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingVertical: 6,
                                                    paddingHorizontal: 8,
                                                    backgroundColor: '#F9FAFB',
                                                    borderRadius: 8,
                                                    marginBottom: 6
                                                }}
                                            >
                                                <CustomText style={{ fontSize: 14 }}>
                                                    {s.hora_inicio.slice(0, 5)} - {s.hora_fin.slice(0, 5)}
                                                </CustomText>
                                                <TouchableOpacity onPress={() => handleRemove(s.id)}>
                                                    <Feather name="trash-2" size={18} color="#DC143C" />
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    )}
                                </View>
                            )
                        }))}
                <View marginBottom={5}></View>
            </ScrollView>

            <GlobalModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                label={`${addClicked ? `${addClicked} - ` : ``}${intl.formatMessage({ id: `addSchedule` })}`}
                content={
                    <View style={generalSettingsStyles.container1}>
                        <View style={generalSettingsStyles.inputContainer}>
                            <CustomText style={generalSettingsStyles.textInput}>
                                <FormattedMessage
                                    id="startHour"
                                    defaultMessage={"Hora de inicio"}
                                />
                            </CustomText>
                            <InputField
                                icon={
                                    <SimpleLineIcons
                                        style={{ marginLeft: 12 }}
                                        color={"#b6b6b6"}
                                        name="clock"
                                        size={16}
                                    />
                                }
                                isTime
                                placeholder={intl.formatMessage({
                                    id: "enterClosingTime",
                                    defaultMessage: "Ingresa la hora de cierre",
                                })}
                                value={start}
                                onChangeText={(value: any) =>
                                    setStart(value)
                                }
                                error={errors.start}
                            />
                        </View>

                        <View style={generalSettingsStyles.inputContainer}>
                            <CustomText style={generalSettingsStyles.textInput}>
                                <FormattedMessage
                                    id="endHour"
                                    defaultMessage={"Hora de fin"}
                                />
                            </CustomText>
                            <InputField
                                icon={
                                    <SimpleLineIcons
                                        style={{ marginLeft: 12 }}
                                        color={"#b6b6b6"}
                                        name="clock"
                                        size={16}
                                    />
                                }
                                isTime
                                placeholder={intl.formatMessage({
                                    id: "enterClosingTime",
                                    defaultMessage: "Ingresa la hora de cierre",
                                })}
                                value={end}
                                onChangeText={(value: any) =>
                                    setEnd(value)
                                }
                                error={errors.end}
                            />
                        </View>
                    </View>
                }
                actions={[
                    <CustomButton
                        isLoading={loadingCreate}
                        onPress={() => handleAdd()}
                        size="sm"
                        isDisabled={loadingCreate}
                        marginLeft={2}
                        backgroundColor={"#2C2C2C"}
                        borderRadius={"6"}
                        fontWeight={700}
                    >
                        <Text fontWeight={500} color={"white"}>
                            {intl.formatMessage({ id: "save" })}
                        </Text>
                    </CustomButton>
                ]}
            />
        </View>
    );
};

export default SchedulesView;