import React from 'react';
import { Pressable, View, VStack, Button } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { ModalStyles as styles } from './ModalStyles';
import { Modal } from 'react-native';
import CustomText from './CustomText';

interface GlobalModalProps {
  isVisible: boolean;
  label: string;
  onClose: () => void;
  onAccept?: () => void;
  content: React.ReactNode;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  isVisible,
  label,
  content,
  onClose,
  onAccept,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={styles.container}>
        <View style={styles.containerContent} onStartShouldSetResponder={() => true}>
          <View style={styles.headerContent}>
            <View style={styles.decorateDiv}></View>
            <View style={styles.containerCreate}>
              <View style={styles.containerTitle}>
                <Pressable onPress={onClose}>
                  <EvilIcons name="close" size={25} color={'white'} />
                </Pressable>
                <CustomText style={{ color: 'white', fontSize: 20 }}>
                  {label}
                </CustomText>
              </View>
            </View>
          </View>
          <View style={styles.bodyContent}>
            {content}
            {onAccept && (
              <Button mt={4} colorScheme="teal" onPress={onAccept}>
                Aceptar
              </Button>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default GlobalModal;
