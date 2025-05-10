import DateTimeInputField from "@/components/DateTimePickerField";
import GlobalModal from "@/components/Modal"
import { Button, Input, Text, View } from "native-base";
import React from "react";
import { FormattedMessage } from "react-intl";


interface IModalCreateCierre {
    open: boolean;
    onClose: () => void;
    onCreate: (inicio: Date, fin: Date) => void;
    loading: boolean
}

const ModalCreateCierre = ({ open, onClose, onCreate, loading }: IModalCreateCierre) => {
    const [formValues, setFormValues] = React.useState({
        inicio: new Date(),
        fin: new Date()
    })

    const handleChange = (key: string, value: any) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <GlobalModal
            content={
                <View w={'full'} display={'flex'} flexDir={'column'} mb={8}>
                    <View flex={1} display={'flex'} mb={2} flexDir={'column'} alignItems={'flex-start'}>
                        <Text fontSize={18} color={'gray.500'}><FormattedMessage id="cierreProvisorioModalCreateText1" /></Text>
                        <DateTimeInputField
                            direction="row"
                            date={formValues.inicio}
                            display="default"
                            setDate={(val: any) => {
                                handleChange('inicio', val);
                            }} />
                    </View>
                    <View flex={1} display={'flex'} mb={2} flexDir={'column'} alignItems={'flex-start'}>
                        <Text fontSize={18} color={'gray.500'}><FormattedMessage id="cierreProvisorioModalCreateText2" /></Text>
                        <DateTimeInputField
                            direction="row"
                            date={formValues.fin}
                            display="default"
                            setDate={(val: any) => {
                                handleChange('fin', val);
                            }} />
                    </View>

                </View>
            }
            isVisible={open}
            label="Temporary closure"
            onClose={onClose}
            actions={[
                <Button
                    onPress={onClose}
                    key="Cancel"
                    size="md"
                    background={"gray.50"}
                    borderWidth={1}
                    borderColor={"gray.500"}
                    borderRadius="md"
                    marginRight={4}
                >
                    <Text color={"gray.500"}>
                        <FormattedMessage id="cierreProvisorioModalCreateButton2" />
                    </Text>
                </Button>,
                <Button
                    isLoading={loading}
                    onPress={() => onCreate(formValues.inicio, formValues.fin)}
                    key="Accept"
                    size="md"
                    backgroundColor={"#2C2C2C"}
                    borderRadius="md"
                >
                    <Text color={'white'}>
                        <FormattedMessage id="cierreProvisorioModalCreateButton1" />
                    </Text>
                </Button>,
            ]}
        />
    )
}

export default ModalCreateCierre