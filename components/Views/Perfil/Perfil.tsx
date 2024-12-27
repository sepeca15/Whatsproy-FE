import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { HStack, VStack, Avatar, IconButton, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { styles } from './PerfilStyles';
import Graficas from './components/Graficas';
import { profileData } from './components/profileData';

const Perfil: React.FC = () => {
  const router = useRouter(); 
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <HStack style={styles.header} alignItems="center" justifyContent="space-between">
        <HStack alignItems="center">
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Avatar
              size="md"
              source={{
                uri: profileData.avatarUrl,
              }}
            />
          </TouchableOpacity>
          <VStack marginLeft={3}>
            <Text style={styles.name}>{profileData.name}</Text> 
            <Text style={styles.plan}>Plan: {profileData.plan}</Text> 
          </VStack>
        </HStack>
        <IconButton
          icon={<Icon as={Ionicons} name="settings-outline" size="md" />}
          onPress={() => {
            router.push("/(tabs)/config")
          }}
        />
      </HStack>
      <View style={styles.content}>
        <Graficas />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Avatar
                size="2xl"
                source={{
                  uri: profileData.avatarUrl, 
                }}
                style={styles.largeAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Perfil;