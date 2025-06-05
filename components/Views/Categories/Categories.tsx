import * as React from "react";
import { FlatList, Spinner, View } from "native-base";
import api from "@/services/api/admin";
import CardCategory from "./components/CardCategory";
import { ICategoryData } from "./components/CardCategory/CardCategory";
import Animated from "react-native-reanimated";
import { styles } from "../DateOrder/DateOrderStyles";
import CustomText from "@/components/CustomText";
import { FormattedMessage, useIntl } from "react-intl";
import CustomButton from "@/components/CustomButton";
import { globalStyles } from "@/components/globalStyles";
import { router } from "expo-router";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import ModalCreateOrEditCategory from "./components/ModalCreateOrEditCategory/ModalCreateOrEditCategory";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";


const Categories = () => {
  const [allCategories, setAllCategories] = React.useState<ICategoryData[]>([]);
  const [categorySelected, setCategorySelected] = React.useState<ICategoryData | null>(null);

  const [stateModal, setStateModal] = React.useState(false);
  const [modalDelete, setModalDelete] = React.useState(false);
  const [loadingApi, setLoadingApi] = React.useState(false);
  const lottieRef = React.useRef<LottieView>(null);
  const intl = useIntl()

  const toggleModal = () => setStateModal((prev) => !prev);
  const toggleModalDelete = () => setModalDelete((prev) => !prev);

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

  const handleEditCategory = (category: ICategoryData) => {
    setCategorySelected(category)
    toggleModal()
  }

  const handleDeleteCategory = (category: ICategoryData) => {
    setCategorySelected(category)
    setModalDelete(true)
  }

  const editCategorie = async (category: ICategoryData) => {
    try {      
      const resp = await api.category.update({ categoryId: category.id, dataUpdate: category })
      console.log('la resp es', resp);

      if (resp.ok) {
        setAllCategories((prev) => prev.map((item) => {
          if (item.id === resp.data.id) {
            return resp.data
          } else {
            return item;
          }
        }))
        toggleModal()
      }

    } catch (error: any) {
      console.log(error.response.data);
    }
  }

  const createCategory = async (data: any) => {
    try {
      const resp = await api.category.create({
        ...data,
      });

      if (resp.ok) {
        toggleModal()
        addCategory(resp.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false);
    }
  };

  const deleteCategory = async () => {
    if (!categorySelected) {
      return;
    }
    try {

      const resp = await api.category.delete({ categoryId: categorySelected.id })

      if (resp) {
        setAllCategories((prev) => prev.filter((cat) => cat.id !== categorySelected.id))
      }

    } catch (error: any) {
      console.log(error.response.data.message);
    }
  }

  React.useEffect(()=> {
    if(!stateModal && categorySelected) {
      setCategorySelected(null)
    }
  },[stateModal])

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={globalStyles.header2}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
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
              renderItem={({ item }) => <CardCategory handleDeleteCategory={(category: ICategoryData) => handleDeleteCategory(category)} onPress={() => handleEditCategory(item)} data={item} />}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: "center", gap: 10 }}
            />
          ) : (
            <Animatable.View
              animation="fadeIn"
              duration={600}
              style={styles.emptyStateContainer}
            >
              <LottieView
                ref={lottieRef}
                source={require("../../../constants/Animation-non-order.json")}
                autoPlay
                loop
                style={styles.emptyStateAnimation}
              />
              <CustomText style={styles.emptyStateTitle}>
                <FormattedMessage
                  id="noCategories"
                  defaultMessage="No hay productos"
                />
              </CustomText>
            </Animatable.View>

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
        {
          stateModal &&
          <ModalCreateOrEditCategory
            onClose={toggleModal}
            isOpen={stateModal}
            categorySelected={categorySelected}
            editCategorie={(item: ICategoryData) => editCategorie(item)}
            createCategory={(item: ICategoryData) => createCategory(item)}
          />
        }

        <ModalConfirmAction
          isOpen={!!modalDelete}
          onClose={toggleModalDelete}
          title={intl.formatMessage({ id: "modalDelete.title" })}
          message={intl.formatMessage({ id: "modalDelete.message" })}
          onContinue={() => {
            deleteCategory()
          }}
        />
      </View>
    </View>
  );
};

export default Categories;
