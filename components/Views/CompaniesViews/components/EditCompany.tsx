import React, { useState } from "react";
import { VStack, Switch, Row } from "native-base";
import { Button } from "native-base";
import { useIntl } from "react-intl";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import InputField from "@/components/InputField";
import CustomText from "@/components/CustomText";
import GlobalModal from "@/components/Modal";
import CustomButton from "@/components/CustomButton";

interface EditCompanyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<any>) => void;
  company: any;
  loading?: boolean;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  company,
  loading,
}) => {
  const { formatMessage } = useIntl();

  const [form, setForm] = useState({
    nombre: company.nombre || "",
    db_name: company.db_name || "",
    descripcion: company.descripcion || "",
    direccion: company.direccion || "",
    hora_apertura: company.hora_apertura || "",
    hora_cierre: company.hora_cierre || "",
    notificarReservaHoras: company.notificarReservaHoras || false,
    remaindersHorsRemainder: company.remaindersHorsRemainder || 0,
    abierto: company.abierto || false,
    assistentEnabled: company.assistentEnabled || false,
    intervaloTiempoCalendario: company.intervaloTiempoCalendario || 30,
    timeZone: company.timeZone || "America/Montevideo",
    greenApiInstance: company?.greenApiInstance,
    greenApiInstanceToken: company?.greenApiInstanceToken,
  });

  const handleInputChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSubmit(form);
  };

  const content = (
    <VStack space={4}>
      <InputField
        label={formatMessage({ id: "company.name" })}
        placeholder={formatMessage({ id: "company.name" })}
        value={form.nombre}
        onChangeText={(val: any) => handleInputChange("nombre", val)}
      />
      <InputField
        label={formatMessage({ id: "company.dbName" })}
        placeholder={formatMessage({ id: "company.dbName" })}
        value={form.db_name}
        onChangeText={(val: any) => handleInputChange("db_name", val)}
      />
      <InputField
        label={formatMessage({ id: "company.description" })}
        placeholder={formatMessage({ id: "company.description" })}
        value={form.descripcion}
        onChangeText={(val: any) => handleInputChange("descripcion", val)}
      />
      <InputField
        label={formatMessage({ id: "company.address" })}
        placeholder={formatMessage({ id: "company.address" })}
        value={form.direccion}
        onChangeText={(val: any) => handleInputChange("direccion", val)}
      />
      <InputField
        label={formatMessage({ id: "company.openingHour" })}
        placeholder={formatMessage({ id: "company.openingHour" })}
        value={form.hora_apertura}
        onChangeText={(val: any) => handleInputChange("hora_apertura", val)}
        icon={
          <SimpleLineIcons
            name="clock"
            size={20}
            color="#b6b6b6"
            style={{ marginLeft: 12 }}
          />
        }
      />
      <InputField
        label={formatMessage({ id: "company.closingHour" })}
        placeholder={formatMessage({ id: "company.closingHour" })}
        value={form.hora_cierre}
        onChangeText={(val: any) => handleInputChange("hora_cierre", val)}
        icon={
          <SimpleLineIcons
            name="clock"
            size={20}
            color="#b6b6b6"
            style={{ marginLeft: 12 }}
          />
        }
      />
      <InputField
        label={formatMessage({ id: "company.reminderInterval" })}
        placeholder={formatMessage({ id: "company.reminderInterval" })}
        value={form.remaindersHorsRemainder.toString()}
        onChangeText={(val: any) =>
          handleInputChange("remaindersHorsRemainder", parseInt(val) || 0)
        }
      />
      <InputField
        label={formatMessage({ id: "company.calendarInterval" })}
        placeholder={formatMessage({ id: "company.calendarInterval" })}
        value={form.intervaloTiempoCalendario.toString()}
        onChangeText={(val: any) =>
          handleInputChange("intervaloTiempoCalendario", parseInt(val) || 0)
        }
      />
      <InputField
        label={formatMessage({ id: "company.greenApiInstance" })}
        placeholder={formatMessage({ id: "company.greenApiInstance" })}
        value={form.greenApiInstance.toString()}
        onChangeText={(val: any) => handleInputChange("greenApiInstance", val)}
      />
      <InputField
        label={formatMessage({ id: "company.greenApiInstanceToken" })}
        placeholder={formatMessage({ id: "company.greenApiInstanceToken" })}
        value={form.greenApiInstanceToken.toString()}
        onChangeText={(val: any) =>
          handleInputChange("greenApiInstanceToken", val)
        }
      />
      <Row
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <CustomText>{formatMessage({ id: "company.notifyByHour" })}</CustomText>
        <Switch
          isChecked={form.notificarReservaHoras}
          onToggle={() =>
            handleInputChange(
              "notificarReservaHoras",
              !form.notificarReservaHoras
            )
          }
          size="lg"
          colorScheme="primary"
        />
      </Row>

      <Row
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <CustomText>{formatMessage({ id: "company.isOpen" })}</CustomText>
        <Switch
          isChecked={form.abierto}
          onToggle={() => handleInputChange("abierto", !form.abierto)}
          size="lg"
          colorScheme="primary"
        />
      </Row>

      <Row
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <CustomText>
          {formatMessage({ id: "company.assistantEnabled" })}
        </CustomText>
        <Switch
          isChecked={form.assistentEnabled}
          onToggle={() =>
            handleInputChange("assistentEnabled", !form.assistentEnabled)
          }
          size="lg"
          colorScheme="primary"
        />
      </Row>
    </VStack>
  );

  return (
    <GlobalModal
      isVisible={isVisible}
      label={formatMessage({ id: "company.editTitle" })}
      onClose={onClose}
      content={content}
      actions={[
        <Row>
          <CustomButton loading={loading} key="save" onPress={handleSave} colorScheme="primary">
            {formatMessage({ id: "company.saveChanges" })}
          </CustomButton>
        </Row>,
      ]}
    />
  );
};

export default EditCompanyModal;
