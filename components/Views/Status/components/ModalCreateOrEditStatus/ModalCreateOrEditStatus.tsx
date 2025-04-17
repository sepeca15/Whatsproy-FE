import * as React from 'react'
import GlobalModal from "@/components/Modal";
import { View, Input, Switch, Text, Button } from "native-base"
import api from '@/services/api/admin';
import { useUser } from '@/hooks/redux/useUser';

interface IModalCreateOrEditStatus {
    isOpen: boolean,
    onClose: () => void;
    addNewStatus: (status: any) => void;
}

interface ICreateStatus {
    nombre: string;
    es_defecto: boolean
    finalizador: boolean
    order: number;
}

const initialState: ICreateStatus = {
    nombre: '',
    es_defecto: false,
    finalizador: false,
    order: 0
}

export const ModalCreateOrEditStatus = ({ isOpen, onClose, addNewStatus }: IModalCreateOrEditStatus) => {
    const [status, setStatus] = React.useState<ICreateStatus>(initialState)
    const [error, setError] = React.useState<any>({})

    const handleChange = (key: keyof ICreateStatus, value: any) => {
        setStatus(prev => ({ ...prev, [key]: value }))
    }
    const { user } = useUser()

    const createNewStatus = async () => {
        const newErrors: any = {}

        if (!status.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio'
        }

        if (isNaN(status.order) || status.order <= 0) {
            newErrors.order = 'El orden debe ser un número válido'
        }

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors)
            return
        }

        try {
            console.log('mandare', { ...status });
            const resp = await api.status.create({ ...status, tipoServicioId: user.tipo_servicio })

            if (resp.ok) {
                onClose()
                addNewStatus(resp.data)
                setStatus(initialState)
                setError({})
            }

        } catch (error: any) {
            console.log(error.response.data.message)
        }
    }

    return (
        <GlobalModal
            isVisible={isOpen}
            onClose={onClose}
            label="Create status"
            content={
                <View w="full" pb={4}>
                    <View w={'full'} display={'flex'} style={{ gap: 12 }} flexDir={'row'} alignItems={'center'}>
                        <View flex={1} display={'flex'} mb={2} flexDir={'column'} alignItems={'flex-start'}>
                            <Text>Name</Text>
                            <Input
                                mt={1}
                                placeholder="Nombre"
                                value={status.nombre}
                                onChangeText={(text) => handleChange('nombre', text)}
                                w={'full'}
                            />
                        </View>

                        <View w={'1/3'} mb={2} display={'flex'} flexDir={'column'} alignItems={'flex-start'}>
                            <Text>Number order</Text>
                            <Input
                                mt={1}
                                placeholder="Orden"
                                keyboardType="numeric"
                                value={status.order.toString()}
                                onChangeText={(text) => handleChange('order', parseInt(text) || 0)}
                                w={'full'}
                            />
                        </View>
                    </View>
                    <View w={'full'} display={'flex'} flexDir={'column'} style={{ gap: 4 }}>
                        {error.nombre && (
                            <Text color="red.500" fontSize="xs">{error.nombre}</Text>
                        )}
                        {error.order && (
                            <Text color="red.500" fontSize="xs">{error.order}</Text>
                        )}
                    </View>

                    <View flexDir="row" alignItems="center" justifyContent="space-between">
                        <Text>Es finalizador</Text>
                        <Switch
                            isChecked={status.finalizador}
                            onToggle={() => handleChange('finalizador', !status.finalizador)}
                        />
                    </View>
                </View>
            }
            actions={[
                [
                    <Button
                        onPress={onClose}
                        key="Cancel"
                        size="md"
                        background={'gray.50'}
                        borderWidth={1}
                        borderColor={"gray.500"}
                        borderRadius="md"
                        marginRight={4}
                    >
                        <Text color={'gray.500'}>
                            Cancel
                        </Text>
                    </Button>,
                    <Button
                        key="Accept"
                        size="md"
                        backgroundColor={"#2C2C2C"}
                        borderRadius="md"
                        onPress={createNewStatus}
                    >
                        Crear
                    </Button>
                ]
            ]}
        />
    )
}
