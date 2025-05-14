import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./DateOrderStyles";
import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import MaterialIconss from "react-native-vector-icons/MaterialCommunityIcons";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage

interface IDateOrder {
  es_defecto: boolean;
  id: number;
  id_tipo_servicio: number;
  nombre: string;
  requerido: boolean;
  tipo: string;
}

interface IProps {
  data: IDateOrder;
  onDeleteItem: () => void;
  isPar: boolean;
}

const DateOrderCard = ({ data, onDeleteItem, isPar }: IProps) => {

  return (
    <View
      style={[
        styles.tableContent,
        { backgroundColor: isPar ? Colors.light.background : "transparent" },
      ]}
    >
      <View style={styles.columnName}>
        <CustomText style={styles.text}>{data.nombre}</CustomText>
      </View>

      <View style={styles.column}>
        <CustomText style={styles.text}>
          {
            data.tipo === 'string' ?
              <FormattedMessage id="dateOrderTypeText" />
              :
              data.tipo === 'number' ?
                <FormattedMessage id="dateOrderTypeNumber" />
                :
                data.tipo === 'boolean' ?
                  <FormattedMessage id="dateOrderTypeBoolean" />
                  :
                  <FormattedMessage id="dateOrderTypeDate" />
          }
        </CustomText>
      </View>
      <View style={styles.column}>
        <CustomText style={styles.text}>
          {data.requerido ? (
            <FormattedMessage id="yes" />
          ) : (
            <FormattedMessage id="no" />
          )}
        </CustomText>
      </View>
      <View style={styles.column}>
        <CustomText style={styles.text}>
          {data.es_defecto ? (
            <FormattedMessage id="yes" />
          ) : (
            <FormattedMessage id="no" />
          )}
        </CustomText>
      </View>
      <View style={styles.columnDelete}>
        <Pressable
          disabled={data.es_defecto === true}
          onPress={onDeleteItem}
          role="button"
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}

        >
          <MaterialIconss
            name="delete"
            size={20}
            color={data.es_defecto ? "#b4b4b4" : "#FF6F6F"}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default DateOrderCard;
