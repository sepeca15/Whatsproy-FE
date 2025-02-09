import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './DateOrderStyles';
import api from '@/services/api/admin';
import CustomText from '@/components/CustomText';
import DateOrderCard from './components/DateOrderCard';
import ModalCreateOrderDate from './components/ModalCreateOrderDate';
import IonIcons from 'react-native-vector-icons/Ionicons'
import MaterialIconss from 'react-native-vector-icons/MaterialIcons'
import * as Progress from 'react-native-progress';
import { Colors } from '@/constants/Colors';
import { useToastContext } from '@/contexts/ToastContext';


const ItemsTable = [
  'Name',
  'Type',
  'Required',
  'isDefect',
  ''
]

const DateOrder: React.FC = () => {
  const [orderDate, setOrderDate] = React.useState<any[]>([])
  const [selectedItem, setSelectedItem] = React.useState<any>({})
  const [stateModal, setStateModal] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const {showToast} = useToastContext()

  const updateOrderData = (newOrderData : any) => {
    setOrderDate((prevState)=> ([
      ...prevState,
      newOrderData
    ]))
  }

  const getAllOrderDate = async () => {
    setLoading(true)
    try {
      const data = await api.dataOrder.getAll()
      setOrderDate(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const onOpenModal = (item: any) => {
    item && setSelectedItem(item)
    setStateModal(true)
  }

  const onCloseModal = () => {
    setSelectedItem({})
    setStateModal(false)
  }

  const onDeleteItem = async (id : number) => {
    try {
      const data = await api.dataOrder.delete(id)
      if(data) {
        const allItems = orderDate.filter((item)=> item.id !== id)
        setOrderDate(allItems)
        showToast({
          title:'Orden borrada exitosamente',
          status:'success'
        })
      }
    } catch (error: any) {
      showToast({
        title:'Error',
        description:error.response.data.message,
        status:'error'
      })
      console.log(error);
    }
  }


  React.useEffect(() => {
    getAllOrderDate()
  }, [])
  
  return (
    loading? 
    <View  style={styles.progress}>
      <Progress.Circle color={Colors.light.primary} indeterminate={true} size={100} />

    </View>
    :
    <View style={styles.container}>
      <View style={styles.ContainerHeader}>
        <CustomText style={styles.title} >Datos de Pedido</CustomText>
      </View>
      <View style={styles.message}>
        <MaterialIconss style={{marginTop:3}} color={'gray'} size={16} name='error-outline'/>
        <CustomText style={{flex:1}}>Aquí podrás gestionar la información de tus pedidos. Cada dato que ingreses aquí será solicitado al cliente para concretar un pedido o reserva de manera efectiva.</CustomText>
      </View>
      <View style={styles.containerInfoLineTable}>
        <View style={styles.tableHeader}>
          {
            ItemsTable.map((item, index) => {
              return <View key={index} style={item === 'Name' ? styles.columnName : item === '' ? styles.columnDelete : styles.column}>
                <CustomText style={styles.text}>{item}</CustomText>
              </View>
            })
          }
        </View>
        <View style={styles.tableBody}>
          {
            orderDate?.map((item, index) => {
              const isPar = index%2 === 0
              return <DateOrderCard isPar={isPar} key={index} onDeleteItem={onDeleteItem} data={item} />
            })
          }
        </View>
      </View>
      <Pressable style={styles.button} onPress={onOpenModal}>
          <IonIcons color={'white'} size={25} name='add-sharp'/>
      </Pressable>
      {
        stateModal &&
        <ModalCreateOrderDate updateOrder={updateOrderData} onClose={onCloseModal} data={selectedItem} />
      }
    </View>
  );
};

export default DateOrder;