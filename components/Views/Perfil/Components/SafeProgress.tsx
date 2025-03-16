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
  // Convertir el valor a un entero estricto usando doble bitwise NOT (~~)
  // Esta es una forma más rápida y segura que Math.floor() o parseInt()
  const safeValue = ~~value; // Equivalente a Math.floor(value)

  return (
    <Progress
      value={safeValue}
      max={100} // Siempre establecer un valor máximo explícito
      {...props}
    />
  );
};

export default SafeProgress;
