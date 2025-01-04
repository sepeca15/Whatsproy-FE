

import React, { useState, useEffect } from 'react';
import { Pressable, View , Text} from 'react-native';
import styles from './UserCardStyles';
import FatherIcon from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { IUser } from '../../UsuariosType';

interface IUserCard {
    infoUser: IUser
}

const UserCard = ({infoUser} : IUserCard) => {
    
  return (
    <View style={styles.container}>
        <View style={styles.data}>
            <View  style={styles.row}>
                <View style={styles.icon}>
                    <FatherIcon name='user' size={20} color={'gray'}/>
                </View>
                <View style={styles.Column}>
                    <Text style={styles.textName}>{infoUser.nombre}</Text>
                    <Text style={styles.textCorreo}>{infoUser.correo}</Text>
                </View>
                <View style={styles.statusUser}>
                    <MaterialCommunityIcons size={18} name={infoUser.activo ? 'check' : 'close'} color={'#000035'}/>
                    <Text style={{color:'#8e8e95'}}>{infoUser.activo ? 'Activo' : 'Inactivo'}</Text>
                </View>
            </View>

        </View>
        <View style={styles.buttons}>
            <Pressable style={styles.buttonEdit} accessibilityRole='button' onPress={()=> {}}>
                <FatherIcon name='edit-2' size={12} color={'#000035'}/>
                <Text style={styles.textEdit} >Editar</Text>
            </Pressable>
            <Pressable style={styles.buttonDelete} accessibilityRole='button' onPress={()=> {}}>
                <MaterialCommunityIcons name='delete-empty' size={14} color={'white'}/>
                <Text style={styles.textDelete}>Eliminar</Text>
            </Pressable>
        </View>
    </View>
  );
};

export default UserCard;

