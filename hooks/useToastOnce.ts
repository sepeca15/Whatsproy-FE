// hooks/useToastOnce.ts
import Toast, { ToastShowParams } from "react-native-toast-message";

const activeToasts = new Set<string>();

export function useToastOnce() {
  const show = (params: ToastShowParams & { id: string }) => {
    if (activeToasts.has(params.id)) return;
    activeToasts.add(params.id);

    Toast.show({
      ...params,
      onHide: () => {
        activeToasts.delete(params.id);
        params.onHide?.();
      },
    });
  };

  return { show };
}
