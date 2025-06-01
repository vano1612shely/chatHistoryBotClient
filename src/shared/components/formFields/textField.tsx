import { Input } from "@heroui/react";
import { useStore } from "@tanstack/react-form";
import { type ReactNode } from "react";

import { useFieldContext } from "@/shared/hooks/form-context.tsx";

type TextFieldProps = {
  label: string;
  hidden?: boolean;
  required?: boolean;
  disabled?: boolean;
  type?: "text" | "password" | "email" | "url";
  placeholder?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onChange?: (value: string) => void;
  value?: string;
};

export default function TextField({
  label,
  disabled,
  type,
  required,
  placeholder,
  startContent,
  onChange,
  hidden,
  endContent,
  value,
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  if (hidden) {
    return null;
  }
  return (
    <Input
      label={label}
      isRequired={required}
      isDisabled={disabled}
      placeholder={placeholder}
      startContent={startContent}
      endContent={endContent}
      type={type}
      variant="bordered"
      value={value ? value : field.state.value}
      id={field.name}
      name={field.name}
      onValueChange={(value) =>
        onChange ? onChange(value) : field.handleChange(value)
      }
      isInvalid={errors.length > 0}
      errorMessage={
        typeof errors[0] === "object" ? errors[0].message : errors[0]
      }
    />
  );
}
