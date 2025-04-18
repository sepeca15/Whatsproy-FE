import * as React from 'react'
import GlobalModal from "@/components/Modal";
import { View, Input, Switch, Text, Button } from "native-base"
import api from '@/services/api/admin';
import { useUser } from '@/hooks/redux/useUser';
import { IEstado } from '../../Status';

interface IModalCreateOrEditStatus {
    isOpen: boolean,
    onClose: () => void;
    addOrEditNewStatus: (status: any, shouldEdit: boolean) => void;
    selectedItem: IEstado | null;
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

export const ModalCreateOrEditStatus = ({ isOpen, onClose, addOrEditNewStatus, selectedItem }: IModalCreateOrEditStatus) => {
    const [status, setStatus] = React.useState<ICreateStatus>(initialState)
    const [error, setError] = React.useState<any>({})
    const [loadingApi, setLoadingApi] = React.useState<any>(false)

    const { user } = useUser()

    React.useEffect(() => {
        if (isOpen && selectedItem) {
            setStatus({
                nombre: selectedItem.nombre,
                es_defecto: selectedItem.es_defecto,
                finalizador: selectedItem.finalizador,
                order: selectedItem.order ?? 0,
            })
        } else if (isOpen && !selectedItem) {
            setStatus(initialState)
            setError({})
        }
    }, [isOpen, selectedItem])

    const handleChange = (key: keyof ICreateStatus, value: any) => {
        setStatus(prev => ({ ...prev, [key]: value }))
    }

    const createOrUpdateStatus = async () => {
        const newErrors: any = {}

        if (!status.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio'
        }

        if (isNaN(status.order) || status.order <= 0) {
            newErrors.order = 'El orden debe ser un número válido'
        }

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors)
            return;
        }

        try {
            setLoadingApi(true)
            const payload = { ...status, tipoServicioId: user.tipo_servicio }

            const resp = selectedItem
                ? await api.status.update(selectedItem.id, payload)
                : await api.status.create(payload)

            if (resp) {
                onClose()
                addOrEditNewStatus(resp.data, !!selectedItem)
                setStatus(initialState)
                setError({})
            }

        } catch (error: any) {
            console.log(error);
            let newError: any = {};
            newError.generalError = error.response.data.message
            setError(newError)
            setLoadingApi(false)
        }
    }

    return (
        <GlobalModal
            isVisible={isOpen}
            onClose={onClose}
            label={selectedItem ? "Editar estado" : "Crear estado"}
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
                        {error.generalError && (
                            <Text color="red.500" fontSize="xs">{error.generalError}</Text>
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
                        onPress={createOrUpdateStatus}
                        isLoading={loadingApi}
                        >
                        {selectedItem ? 'Guardar' : 'Crear'}
                    </Button>
                ]
            ]}
        />
    )
}

