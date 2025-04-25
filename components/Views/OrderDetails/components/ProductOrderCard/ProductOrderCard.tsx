import * as React from "react";
import { Text } from "react-native";
import { styles } from "./ProductOrderCardStyles.";
import { IProductoInfo } from "../../OrderDetailsTypes";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import { Image, View } from "native-base";

interface IProductOrderCard {
  data: IProductoInfo;
  cantidad: number;
}

const ProductOrderCard = ({ data, cantidad }: IProductOrderCard) => {
  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        {
          data?.imagen &&
          <Image alt="image product" borderWidth={1} borderColor={'gray.200'} shadow={'3'} width={'100%'} height={'100%'} rounded={12} source={{ uri: data.imagen }} />
        }
      </View>
      <View style={styles.info}>
        <Text style={styles.nameProduct}>{data.nombre + `(x1 ${data.precio})`}</Text>
        <Text style={styles.cantidad}>
          <FormattedMessage id="quantity" defaultMessage="Quantity" />:{" "}
          {cantidad}
        </Text>
      </View>
      <Text style={styles.price}>$ {cantidad * data.precio}</Text>
    </View>
  );
};

export default ProductOrderCard;
