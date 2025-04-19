import React from "react";
import { Pressable, View, ScrollView, Button, HStack } from "native-base";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { Modal } from "react-native";
import CustomText from "./CustomText";
import { ModalStyles as styles } from "./ModalStyles";

interface GlobalModalProps {
  isVisible: boolean;
  label: string;
  onClose: () => void;
  content: React.ReactNode;
  actions?: any[];
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  isVisible,
  label,
  content,
  onClose,
  actions,
}) => {

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      style={{ zIndex: 1 }}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View
          style={styles.containerContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.headerContent}>
            <View style={styles.decorateDiv}></View>
            <View style={styles.containerCreate}>
              <View style={styles.containerTitle}>
                <Pressable onPress={onClose}>
                  <EvilIcons name="close" size={25} color={"white"} />
                </Pressable>
                <CustomText style={{ color: "white", fontSize: 20 }}>
                  {label}
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.bodyContent}>
            <ScrollView
              flexDirection={"column"}
              display={"flex"}
              horizontal={false}
              width={"100%"}
              showsVerticalScrollIndicator
              contentContainerStyle={{
                margin: "auto",
                width: "100%",
                flexGrow: 1,
                gap: 8,
                paddingHorizontal: 20,
                paddingBottom: 60,
              }}
            >
              {content}
            </ScrollView>
          </View>

          {actions && actions.length > 0 && (
            <View style={styles.footerContent}>
              <HStack justifyContent="flex-end">{actions}</HStack>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default GlobalModal;
