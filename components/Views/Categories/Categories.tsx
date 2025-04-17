import * as React from "react";
import { Button, Card, Image, Spinner, Text, View } from "native-base";
import api from "@/services/api/admin";
import IonIcons from 'react-native-vector-icons/Ionicons'
import ModalCreateCategory from "./components/ModalCreateCategory";
import SvgEmpty from "@/assets/svgComponents/Empty";
import CardCategory from "./components/CardCategory";
import { Row, Grid } from "react-native-easy-grid"; 
import { ICategoryData } from "./components/CardCategory/CardCategory";

const Categories = () => {
  const [allCategories, setAllCategories] = React.useState<ICategoryData[]>([])
  const [stateModal, setStateModal] = React.useState(false)
  const [loadingApi, setLoadingApi] = React.useState(false)

  const toggleModal = () => setStateModal((prev) => (!prev))

  const addCategory = (newCategory : any) => {
    setAllCategories((prev: any)=> {
      return [...prev, newCategory]
    } )
  }

  const loadAllCategories = async () => {
    setLoadingApi(true  )
    try {
      const resp = await api.category.getAll()

      if (resp.ok) {        
        setAllCategories(resp.data)
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false)
    }
  }

  React.useEffect(()=> {
    loadAllCategories()
  }, [])

  return <View pb={10} h={'full'} w={'full'} flex={1} display={'flex'} flexDir={'column'} alignItems={'center'} color={'black'}>
    <View w={'full'} display={'flex'} flexDir={'row'} justifyContent={'center'} alignItems={'center'} bg={'white'} paddingY={'16px'}>
      <Text fontSize={20} fontWeight={'bold'}>Categories</Text>
    </View>
    <View w={'full'} py={2} flex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
      {
        loadingApi ? 
        <Spinner color={"black"} size={40} />
        :
        allCategories.length > 0 ?
          <Grid>
            <Row style={{ flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>
              {
                allCategories.map((category : any, index : number)=> {
                  return <CardCategory key={index} data={category}/>
                })
              }
            </Row>
          </Grid>
          :
          <View>
            <SvgEmpty />
          </View>
      }
    </View>
    <Button shadow={'5'} background={'black'} display={'flex'} flexDir={'row'} alignItems={'center'} onPress={toggleModal}>
      Agregar categoria
    </Button>
    <ModalCreateCategory addCategory={addCategory} onClose={toggleModal} isOpen={stateModal} />
  </View>
};

export default Categories;
