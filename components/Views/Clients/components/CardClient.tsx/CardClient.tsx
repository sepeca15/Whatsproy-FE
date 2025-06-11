import { getInitials } from "@/components/Views/TrustedNumbers/components/CardContact/CardContact";
import { Colors } from "@/constants/Colors"
import { useUser } from "@/hooks/redux/useUser";
import { Ionicons } from "@expo/vector-icons"
import moment from "moment-timezone";
import { Badge, Box, Button, HStack, Icon, Text, View, VStack } from "native-base"

interface ICardClient {
    item: any
    setClienteSeleccionado: () => void;
}

const CardClient = ({ item, setClienteSeleccionado }: ICardClient) => {
    const { user } = useUser()
    const initials = getInitials(item.nombre)
    return (
        <Box borderWidth={1} borderColor={Colors.light.secondary} borderRadius="lg" p={4} my={2}>
            <HStack display={'flex'} flexDirection={'row'} justifyContent="space-between">
                <VStack>
                    <View display={'flex'} flex={1} flexDir={'row'} alignItems={'center'} style={{ gap: 12 }}>
                        <View
                            w={35}
                            h={35}
                            bg={'teal.700'}
                            rounded={'full'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Text fontSize={14} fontWeight={'bold'} color={'white'}>
                                {initials}
                            </Text>
                        </View>
                        <View display={'flex'} flexDir={'column'}>
                            <Text fontWeight="bold" color="teal.800">{item.nombre}</Text>
                            <Text fontSize="sm" color="teal.700">{item.telefono}</Text>
                        </View>
                    </View>
                </VStack>
                <Badge colorScheme="teal">
                    <View style={{ gap: 4 }} display={'flex'} flexDir={'row'} alignItems={'center'} >
                        <Text color={'teal.700'}>{item?.pedido?.length}</Text>
                        <Text color={'teal.700'}>ventas</Text>
                    </View>
                </Badge>
            </HStack>

            <VStack mt={3}>
                <Text color="teal.700">Monto Total: <Text fontWeight="bold" color="teal.800">${item.totalGenerated.toFixed(2)}</Text></Text>
                <Text color="teal.700">
                    Última Compra:{" "}
                    <Text color="teal.800">
                        {moment.tz(item.pedido[item.pedido.length - 1].createdAt, user.timeZone).fromNow()}
                    </Text>
                </Text>
            </VStack>

            <Button
                mt={3}
                background={Colors.light.secondary}
                onPress={() => {
                    setClienteSeleccionado()
                }}
                leftIcon={<Icon as={Ionicons} name="eye-outline" size={4} />}
            >
                Ver Detalles
            </Button>
        </Box>
    )
}

export default CardClient