import * as React from "react";
import { FlatList, Spinner, View } from "native-base";
import api from "@/services/api/admin";
import ModalCreateCategory from "./components/ModalCreateCategory";
import SvgEmpty from "@/assets/svgComponents/Empty";
import CardCategory from "./components/CardCategory";
import { Row, Grid } from "react-native-easy-grid";
import { ICategoryData } from "./components/CardCategory/CardCategory";
import Animated from "react-native-reanimated";
import { styles } from "../DateOrder/DateOrderStyles";
import CustomText from "@/components/CustomText";
import { FormattedMessage } from "react-intl";
import CustomButton from "@/components/CustomButton";
import { globalStyles } from "@/components/globalStyles";
import { useUser } from "@/hooks/redux/useUser";

const Categories = () => {
  const [allCategories, setAllCategories] = React.useState<ICategoryData[]>([]);
  const [stateModal, setStateModal] = React.useState(false);
  const [loadingApi, setLoadingApi] = React.useState(false);
  const { user } = useUser();

  const toggleModal = () => setStateModal((prev) => !prev);

  const addCategory = (newCategory: any) => {
    setAllCategories((prev: any) => {
      return [...prev, newCategory];
    });
  };

  const loadAllCategories = async () => {
    setLoadingApi(true);
    try {
      const resp = await api.category.getAll();

      if (resp.ok) {
        setAllCategories(resp.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false);
    }
  };

  React.useEffect(() => {
    loadAllCategories();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={globalStyles.header}>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Pedidos"
            >
              <FormattedMessage id="categories" />
            </CustomText>
          </View>
        </View>
      </Animated.View>
      <View
        pb={10}
        h={"full"}
        w={"full"}
        flex={1}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        color={"black"}
      >
        <View
          w={"full"}
          py={2}
          flex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {loadingApi ? (
            <Spinner color={"black"} size={40} />
          ) : allCategories.length > 0 ? (
            <FlatList
              style={{ width: "100%", paddingHorizontal: 8 }}
              data={allCategories}
              renderItem={({ item }) => <CardCategory data={item} />}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: "center", gap: 10 }}
            />
          ) : (
            <View
              display="flex"
              flexDirection="column"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <SvgEmpty />
              <CustomText style={{ fontSize: 14, fontWeight: 400 }}>
                {<FormattedMessage id="noCategories" />}
              </CustomText>
            </View>
          )}
        </View>
        <CustomButton
          shadow={"5"}
          display={"flex"}
          flexDir={"row"}
          paddingLeft={5}
          paddingRight={5}
          borderRadius={10}
          paddingTop={2}
          paddingBottom={3}
          height={40}
          fontWeight={"semibold"}
          alignItems={"center"}
          onPress={toggleModal}
        >
          <FormattedMessage id="addCategorie" />
        </CustomButton>
        <ModalCreateCategory
          addCategory={addCategory}
          onClose={toggleModal}
          isOpen={stateModal}
        />
      </View>
    </View>
  );
};

export default Categories;
