import { NumberInput } from "@heroui/react";
import { useStore } from "@tanstack/react-form";
import { type ReactNode } from "react";

import { useFieldContext } from "@/shared/hooks/form-context.tsx";

type NumberFieldProps = {
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  hidden?: boolean;
  value?: number;
};

export default function NumberField({
  label,
  disabled,
  placeholder,
  startContent,
  endContent,
  required,
  onChange,
  min,
  max,
  hidden,
  value,
}: NumberFieldProps) {
  const field = useFieldContext<number>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  if (hidden) return null;
  return (
    <NumberInput
      classNames={{ inputWrapper: "shadow-xs" }}
      minValue={min}
      maxValue={max}
      hideStepper
      isRequired={required}
      label={label}
      isDisabled={disabled}
      placeholder={placeholder}
      startContent={startContent}
      endContent={endContent}
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
