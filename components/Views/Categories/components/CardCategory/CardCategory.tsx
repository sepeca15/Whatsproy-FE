import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Image, Text, View } from "native-base"

export interface ICategoryData {
    createdAt: Date;
    description: string;
    name: string;
    id: number;
    image : string;
}

interface ICardCategory {
    data : ICategoryData
}

const CardCategory = ({data} : ICardCategory ) => {    
    return (
        <View m={2} h={130} w={120} py={2} bg={'white'} rounded={'md'} alignItems={'center'}>
            {
                data.image? 
                <Image w={20} h={20} alt="img" source={{uri: data.image}}/>
                :
                <MaterialCommunityIcons name="food-outline" size={40}/>
            }
            <Text mt={2}>{data.name ?? "No Name"}</Text>
        </View>
    )
}

export default CardCategory