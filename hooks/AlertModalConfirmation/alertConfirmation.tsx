import React from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import {Colors} from "@/constants/Colors";
import { secondaryColor } from '../../components/Views/Perfil/components/theme';
interface DisableProductAlertProps {
  show: boolean;
  processing: boolean;
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const AlerConfirmationModal: React.FC<DisableProductAlertProps> = ({
    show,
    processing,
    title,
    message,
    cancelText,
    confirmText,
    onCancel,
    onConfirm,
}) => (
    <AwesomeAlert
        show={show}
        showCancelButton
        showConfirmButton
        title={title}
        message={message}
        cancelText={cancelText}
        confirmText={confirmText}
        closeOnTouchOutside={!processing}
        onCancelPressed={onCancel}
        onConfirmPressed={onConfirm}
        confirmButtonColor={secondaryColor} 
        cancelButtonColor="#B0B0B0" 
        titleStyle={{ color: secondaryColor, fontWeight: "bold" }}
        messageStyle={{ color: "#333" }}
    />
);

export default AlerConfirmationModal;