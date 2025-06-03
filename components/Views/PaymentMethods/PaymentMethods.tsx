import { useEffect, useState } from "react";
import {
    Box,
    VStack,
    Text,
    ScrollView,
    Switch,
    IconButton,
    Spinner,
    View,
    HStack,
    Button,
} from "native-base";
import IonIcons from "react-native-vector-icons/Ionicons";
import api from "@/services/api/admin";
import CustomText from "@/components/CustomText";
import GlobalModal from "@/components/Modal";
import InputField from "@/components/InputField";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FormattedMessage, useIntl } from "react-intl";
import { globalStyles } from "@/components/globalStyles";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";
import CustomButton from "@/components/CustomButton";

const PaymentMethodsView = () => {
    const [loading, setLoading] = useState(false);
    const [methods, setMethods] = useState<any[]>([]);
    const [editModal, setEditModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<any>(null);
    const [viewText, setViewText] = useState<string | null>(null);
    const router = useRouter();
    const intl = useIntl();

    const { showToast } = useToastContext();

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            const resp = await api.paymentMethods.getPaymentMethods();
            setMethods(resp ?? []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id: string, data: any) => {
        try {
            setLoading(true);
            const resp = await api.paymentMethods.editPaymentMethod(id, data);
            console.log("edited", resp)
            fetchPaymentMethods();
            if (resp?.id) {
                showToast({
                    title: intl.formatMessage({ id: "methodUpdated" }),
                    status: "success",
                });
                setEditModal(false);
                setSelectedMethod(null);
            } else {
                throw new Error("Error")
            }
        } catch (e) {
            showToast({
                title: intl.formatMessage({ id: "methodUpdatedError" }),
                status: "error",
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id: string, key: "enabled", currentValue: boolean) => {
        const method = methods.find((m) => m.id === id);
        if (method) {
            await handleEdit(id, { ...method, [key]: !currentValue });
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Header */}
            <Animated.View entering={FadeIn.duration(500)} style={[globalStyles.header, { backgroundColor: Colors.light.primary }]}>
                <View style={globalStyles.headerContent}>
                    <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()}>
                        <AntDesign name="arrowleft" size={22} color="white" />
                    </TouchableOpacity>
                    <View style={globalStyles.headerLeft}>
                        <CustomText style={globalStyles.businessName}>
                            <FormattedMessage id="paymentMethods" />
                        </CustomText>
                    </View>
                </View>
            </Animated.View>

            {loading ? (
                <Spinner mt={6} />
            ) : (
                <ScrollView px={4} py={4}>
                    <VStack space={4}>
                        {methods.map((method) => (
                            <Box key={method.id} bg="white" p={4} borderRadius="2xl" shadow={2}>
                                <HStack flexDirection={"column"} justifyContent="space-between" alignItems="start">
                                    <VStack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
                                        <Text fontSize="lg" bold>
                                            {method.name}
                                        </Text>
                                        <Switch
                                            isChecked={method.enabled}
                                            onToggle={() => handleToggle(method.id, "enabled", method.enabled)}
                                        />

                                    </VStack>
                                    <Text fontSize="sm" color="gray.500">
                                        {method.description || (
                                            <FormattedMessage id="noDescription" defaultMessage="No description available" />
                                        )}
                                    </Text>
                                </HStack>

                                <HStack space={3} mt={3}>
                                    {method.specifications ? (
                                        <IconButton
                                            icon={<IonIcons name="list-outline" size={20} />}
                                            onPress={() => setViewText(method.specifications)}
                                            _icon={{ color: "gray.600" }}
                                            _pressed={{ bg: "gray.100" }}
                                            accessibilityLabel="View specifications"
                                        />
                                    ) : null}
                                    <IconButton
                                        icon={<IonIcons name="create-outline" size={20} />}
                                        onPress={() => {
                                            setSelectedMethod(method);
                                            setEditModal(true);
                                        }}
                                        _icon={{ color: "gray.600" }}
                                        _pressed={{ bg: "gray.100" }}
                                        accessibilityLabel="Edit method"
                                    />
                                </HStack>
                            </Box>
                        ))}
                    </VStack>
                </ScrollView>
            )}

            <GlobalModal
                isVisible={!!viewText}
                label={<FormattedMessage id="details" />}
                onClose={() => setViewText(null)}
                content={<Text>{viewText}</Text>}
                actions={[]}
            />

            <GlobalModal
                isVisible={editModal}
                label={<FormattedMessage id="editMethod" />}
                onClose={() => {
                    setEditModal(false);
                    setSelectedMethod(null);
                }}
                content={
                    selectedMethod ? (
                        <VStack space={4}>
                            <VStack space={1}>
                                <CustomText>
                                    <FormattedMessage id="name" />
                                </CustomText>
                                <InputField
                                    value={selectedMethod.name}
                                    onChangeText={(text) => setSelectedMethod({ ...selectedMethod, name: text })}
                                    placeholder="..."
                                />
                            </VStack>
                            <HStack alignItems="center" justifyContent="space-between">
                                <CustomText>
                                    <FormattedMessage id="enabled" />
                                </CustomText>
                                <Switch
                                    isChecked={selectedMethod.enabled}
                                    onToggle={(value) =>
                                        setSelectedMethod({ ...selectedMethod, enabled: value })
                                    }
                                />
                            </HStack>

                            <VStack space={1}>
                                <CustomText>
                                    <FormattedMessage id="description" />
                                </CustomText>
                                <InputField
                                    isTextArea
                                    keyboardType="text"
                                    value={selectedMethod.description}
                                    onChangeText={(text) =>
                                        setSelectedMethod({ ...selectedMethod, description: text })
                                    }
                                    placeholder="..."
                                    h={24}
                                />
                            </VStack>

                            <VStack space={1}>
                                <CustomText>
                                    <FormattedMessage id="specifications" />
                                </CustomText>
                                <InputField
                                    isTextArea
                                    keyboardType="text"
                                    value={selectedMethod.specifications}
                                    onChangeText={(text) =>
                                        setSelectedMethod({ ...selectedMethod, specifications: text })
                                    }
                                    placeholder="..."
                                    h={24}
                                />
                            </VStack>


                        </VStack>
                    ) : <Spinner mt={6} />
                }
                actions={[
                    <Button
                        onPress={() => {
                            setEditModal(false);
                            setSelectedMethod(null);
                        }}
                        size="sm"
                        variant={"ghost"}
                        borderRadius={"6"}
                        fontWeight={"bold"}
                    >
                        <Text fontWeight={500} color={"#2C2C2C"}>
                            {intl.formatMessage({ id: "cancel" })}
                        </Text>
                    </Button>
                    ,
                    <CustomButton
                        isLoading={loading}
                        onPress={() => {
                            handleEdit(selectedMethod.id, selectedMethod)
                        }}
                        size="sm"
                        isDisabled={loading}
                        marginLeft={2}
                        backgroundColor={"#2C2C2C"}
                        borderRadius={"6"}
                        fontWeight={700}
                    >
                        <Text color={"white"}><FormattedMessage id="save" /></Text>
                    </CustomButton>,

                ]}
            />
        </GestureHandlerRootView>
    );
};

export default PaymentMethodsView;
