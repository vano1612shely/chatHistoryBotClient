import { type ToastProps, addToast as heroAddToast } from "@heroui/react";

type ToastColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "foreground"
  | "primary"
  | "secondary";

interface ToastOptions {
  title?: string;
  description?: string;
  color?: ToastColor;
}

interface ToastInstance {
  success(options: ToastOptions | string): void;
  error(options: ToastOptions | string): void;
  warning(options: ToastOptions | string): void;
  info(options: ToastOptions | string): void;
  show(options: ToastOptions | string): void;
}

function createToast(options: ToastOptions | string): void {
  if (typeof options === "string") {
    heroAddToast({
      description: options,
    } as unknown as ToastProps);
    return;
  }

  const { title, description, color } = options;

  heroAddToast({
    title,
    description,
    color,
  } as unknown as ToastProps);
}

const toast: ToastInstance = {
  success: (options) =>
    createToast({
      ...(typeof options === "string" ? { description: options } : options),
      color: "success",
    }),
  error: (options) =>
    createToast({
      ...(typeof options === "string" ? { description: options } : options),
      color: "danger",
    }),
  warning: (options) =>
    createToast({
      ...(typeof options === "string" ? { description: options } : options),
      color: "warning",
    }),
  info: (options) =>
    createToast({
      ...(typeof options === "string" ? { description: options } : options),
      color: "primary",
    }),

  show: (options) => createToast(options),
};

export default toast;
