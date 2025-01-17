

import React from 'react';
import { Pressable, View, Text } from 'react-native';
import styles from './UserCardStyles';
import FatherIcon from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { IUser } from '../../UsuariosType';
import api from '@/services/api/admin';
import ModalConfirmAction from '@/components/ModalConfirmAction/ModalConfirmAction';
import { useUser } from '@/hooks/redux/useUser';
import { useToastContext } from '@/contexts/ToastContext';

interface IUserCard {
    infoUser: IUser,
    deleteUser: (id: number) => void;
    selectEditUser: (user: any) => void;
    allowManage : boolean
}

const UserCard = ({ infoUser, deleteUser, selectEditUser, allowManage}: IUserCard) => {
    const [stateModal, setStateModal] = React.useState<boolean>(false)
    const { user } = useUser()
    const {showToast} = useToastContext()

    const onDeleteUser = async () => {
        try {
            const resp = await api.user.delete(infoUser.id)
            if (resp.ok) {
                deleteUser(infoUser.id)
                showToast({
                    title:'Usuario eliminado exitosamente',
                    status:'success'
                })
            }
        } catch (error: any) {
            console.log('error');
            showToast({
                title:error.response.data.message,
                status:'error'
            })
        }
    }

    const toggleModal = () => {
        setStateModal((prevState) => (!prevState))
    }

    return (
        <View style={styles.container}>
            <View style={styles.data}>
                <View style={styles.row}>
                    <View style={styles.icon}>
                        <FatherIcon name='user' size={20} color={'gray'} />
                    </View>
                    <View style={styles.Column}>
                        <Text style={styles.textName}>{user.id === infoUser.id ? "Yo" : infoUser.nombre}</Text>
                        <Text style={styles.textCorreo}>{infoUser.correo}</Text>
                    </View>
                    <View style={styles.statusUser}>
                        <MaterialCommunityIcons size={18} name={infoUser.activo ? 'check' : 'close'} color={'#000035'} />
                        <Text style={{ color: '#8e8e95' }}>{infoUser.activo ? 'Activo' : 'Inactivo'}</Text>
                    </View>
                </View>

            </View>
            {
                allowManage ? 
                <View style={styles.buttons}>
                    <Pressable onPressIn={()=> selectEditUser(infoUser)} style={styles.buttonEdit} accessibilityRole='button' onPress={() => { }}>
                        <FatherIcon name='edit-2' size={12} color={'#000035'} />
                        <Text style={styles.textEdit} >Editar</Text>
                    </Pressable>
                    <Pressable disabled={user.id === infoUser.id} onPressIn={toggleModal} style={user.id === infoUser.id ? styles.disabledDelete : styles.buttonDelete} accessibilityRole='button' onPress={() => { }}>
                        <MaterialCommunityIcons name='delete-empty' size={14} color={'white'} />
                        <Text style={styles.textDelete}>Eliminar</Text>
                    </Pressable>
                </View> 
                :
                <Text style={{alignSelf:'flex-end'}}>No tienes permisos para manejar usuarios</Text>
            }
            <ModalConfirmAction isOpen={stateModal} onContinue={onDeleteUser} onClose={toggleModal} message='Desea eliminar el usuario seleccionado?' title='Eliminar Usuario' />
        </View>
    );
};

export default UserCard;

