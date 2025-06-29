import { Button, Modal, View } from "native-base";
import React from "react";
import CustomText from "../CustomText";
import { styles } from "./ModalConfirmActionStyles";
import { FormattedMessage, useIntl } from "react-intl";
import InputField from "../InputField";

interface IModalConfirmAction {
  onContinue: () => void;
  onClose: () => void;
  isOpen: boolean;
  message?: any;
  title: any;
  loading?: boolean;
  withReason?: boolean;
  reason?: string;
  setReason?: any;
}
const ModalConfirmAction = ({
  isOpen,
  onClose,
  onContinue,
  message,
  title,
  loading,
  withReason,
  setReason,
  reason,
}: IModalConfirmAction) => {
  const submitAction = async () => {
    await onContinue();
    onClose();
  };
  const intl = useIntl();

  return (
    <Modal
      alignSelf={"center"}
      width={450}
      onClose={onClose}
      height={"auto"}
      isOpen={isOpen}
      style={styles.container}
    >
      <Modal.Content>
        <Modal.Body>
          <CustomText style={styles.title}>{title}</CustomText>
          <CustomText style={styles.message}>{message}</CustomText>

          {withReason && setReason && (
            <InputField
              placeholder={intl.formatMessage({ id: "reasonEj" })}
              isTextArea
              label={intl.formatMessage({ id: "reason" })}
              value={reason}
              isRequired={false}
              onChangeText={(text) => setReason(text)}
              style={styles.textArea}
            />
          )}
          <View style={styles.footer}>
            <Button onPress={onClose} style={styles.buttonCancel}>
              <CustomText
                style={{ color: "black", fontWeight: "bold", fontSize: 12 }}
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </CustomText>
            </Button>
            <Button
              background={"red.700"}
              isLoading={loading}
              onPress={submitAction}
              style={styles.buttonContinue}
            >
              <CustomText style={{ color: "white", fontSize: 12 }}>
                <FormattedMessage id="confirm" defaultMessage="Confirm" />
              </CustomText>
            </Button>
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ModalConfirmAction;
