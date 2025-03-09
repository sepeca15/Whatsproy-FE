/**
 * Convierte cualquier número a un entero estricto para evitar problemas de precisión
 * en componentes visuales como Progress.
 *
 * @param value El valor numérico a convertir
 * @returns Un número entero
 */
export const toStrictInteger = (value: number): number => {
    // Primero redondeamos y luego usamos bitwise OR con 0 para forzar la conversión a entero
    return Math.round(value) | 0
  }
  
  