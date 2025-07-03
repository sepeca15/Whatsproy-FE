import { Platform } from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker" 

interface DatePickerModalProps {
  isVisible: boolean
  onConfirm: (date: Date) => void
  onCancel: () => void
  currentDate: Date
}

export default function DatePickerModal({ isVisible, onConfirm, onCancel, currentDate }: DatePickerModalProps) {
  return (
    <DateTimePickerModal
      date={currentDate}
      isVisible={isVisible}
      mode="date"
      onConfirm={onConfirm}
      onCancel={onCancel}
      display={Platform.OS === "ios" ? "inline" : "default"}
    />
  )
}