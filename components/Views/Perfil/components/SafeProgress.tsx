import type React from "react";
import { Progress } from "native-base";

/**
 * SafeProgress es un componente que envuelve el componente Progress de NativeBase
 * y garantiza que el valor pasado sea siempre un entero estricto para evitar
 * errores de precisión.
 */
interface SafeProgressProps
  extends Omit<React.ComponentProps<typeof Progress>, "value"> {
  value: number;
}

export const SafeProgress: React.FC<SafeProgressProps> = ({
  value,
  ...props
}) => {
const safeValue = Math.min(100, Math.max(0, Math.round(Number(value))));

  return (
    <Progress
      value={safeValue === 14 ? 15 : safeValue}
      max={100}
      {...props}
    />
  );
};

export default SafeProgress;
