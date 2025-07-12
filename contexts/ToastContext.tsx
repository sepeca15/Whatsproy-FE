"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useIntl } from "react-intl";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastRenderer } from "./ToastRenderer";

type ToastStatus = "success" | "error" | "info" | "warning";

interface ShowToastParams {
  title: string | React.ReactNode;
  status?: ToastStatus;
  description?: any;
  descripcion?: any;
  duration?: number;
}

interface ToastData {
  id: string;
  title: string;
  descripcion?: string;
  description?: string;
  status: ToastStatus;
  duration: number;
}

const ToastContext = createContext<{
  showToast: (args: ShowToastParams) => void;
} | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const intl = useIntl();
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const insets = useSafeAreaInsets();

  const resolveToString = (value: any): string => {
    if (typeof value === "string") return value;
    if (value?.props?.id && value?.props?.defaultMessage) {
      return intl.formatMessage({
        id: value.props.id,
        defaultMessage: value.props.defaultMessage,
      });
    }
    return "";
  };
  const isToastVisibleRef = React.useRef(false);


  const showToast = useCallback(
    ({
      title,
      descripcion,
      description,
      status = "info",
      duration = 2000,
    }: ShowToastParams) => {
      if (isToastVisibleRef.current) return;

      const id =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const newToast: ToastData = {
        id,
        title: resolveToString(title),
        descripcion:
          descripcion || description
            ? resolveToString(descripcion ?? description)
            : undefined,
        status,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);
      isToastVisibleRef.current = true;

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        isToastVisibleRef.current = false;
      }, duration);
    },
    [intl]
  );
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastRenderer
        toasts={toasts}
        removeToast={removeToast}
        insets={insets}
      />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext debe usarse dentro de ToastProvider");
  return ctx;
};
