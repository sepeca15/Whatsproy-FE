import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Image, Pressable, Text, View } from "native-base"

export interface ICategoryData {
    createdAt: Date;
    description: string;
    name: string;
    id: number;
    productosCount?: number;
    producto?: any[];
    image: string;
}

interface ICardCategory {
    data: ICategoryData
    onPress: () => void;
    handleDeleteCategory: (category: ICategoryData) => void;
}

const CardCategory = ({ data, onPress, handleDeleteCategory }: ICardCategory) => {
    return (
        <Pressable zIndex={1} onPress={onPress} p={4} marginBottom={4} w={"31%"} bg={'white'} rounded={'md'} alignItems={'center'}>
            <Pressable onPress={() => handleDeleteCategory(data)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} position={'absolute'} zIndex={10} top={2} right={2}>
                <MaterialCommunityIcons color="#A80000" size={20} name="delete" />
            </Pressable>
            {
                data.image ?
                    <Image w={20} h={20} alt="img" source={{ uri: data.image }} style={{ borderRadius: 50 }} />
                    :
                    <MaterialCommunityIcons name="food-outline" size={40} />
            }
            <Text mt={2}>{data.name ?? "No Name"}</Text>
        </Pressable>
    )
}

export default CardCategory