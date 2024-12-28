import * as React from "react"
import { Text, View } from "react-native";
import { styles } from "./ProductOrderCardStyles.";
import { IProductoInfo } from "../OrderDetailsTypes";

interface IProductOrderCard {
    data: IProductoInfo,
    cantidad: number
}

const ProductOrderCard = ({data, cantidad} : IProductOrderCard ) => {

    return (
        <View style={styles.container}>
            <View style={styles.photo}></View>
            <View style={styles.info}>
                <Text style={styles.nameProduct}>{data.nombre}</Text>
                <Text style={styles.cantidad}>Cantidad: {cantidad}</Text>
            </View>
            <Text style={styles.price}>$ {cantidad * data.precio}</Text>
        </View>
    );
}

export default ProductOrderCard

