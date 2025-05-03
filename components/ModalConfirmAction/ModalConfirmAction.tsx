import { Button, Modal, View } from "native-base";
import React from "react";
import CustomText from "../CustomText";
import { styles } from "./ModalConfirmActionStyles";
import { FormattedMessage, useIntl } from "react-intl"; 


interface IModalConfirmAction {
  onContinue: () => void;
  onClose: () => void;
  isOpen: boolean;
  message: string;
  title: string;
  loading?: boolean;
}
const ModalConfirmAction = ({
  isOpen,
  onClose,
  onContinue,
  message,
  title,
  loading
}: IModalConfirmAction) => {
  const submitAction = async () => {
    await onContinue();
    onClose();
  };    

  return (
    <Modal
      alignSelf={"center"}
      width={450}
      onClose={onClose}
      isOpen={isOpen}
      style={styles.container}
    >
      <Modal.Content>
        <Modal.Body>
          <CustomText style={styles.title}>{title}</CustomText>
          <CustomText style={styles.message}>{message}</CustomText>
          <View style={styles.footer}>
            <Button onPress={onClose} style={styles.buttonCancel}>
              <CustomText
                style={{ color: "black", fontWeight: "bold", fontSize: 12 }}
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </CustomText>
            </Button>
            <Button background={'red.600'} isLoading={loading} onPress={submitAction} style={styles.buttonContinue}>
              <CustomText style={{ color: "white", fontSize: 12 }}>
                <FormattedMessage id="continue" defaultMessage="Continue" />
              </CustomText>
            </Button>
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ModalConfirmAction;
