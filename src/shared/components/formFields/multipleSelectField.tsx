import { Select, SelectItem } from "@heroui/select";
import { useStore } from "@tanstack/react-form";
import { type ReactNode } from "react";

import { useFieldContext } from "@/shared/hooks/form-context.tsx";

type MultipleSelectFieldProps = {
  label: string;
  required?: boolean;
  hidden?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  items: { key: any; label: string }[];
  onChange?: (value: string[]) => void;
  value?: string[];
};

export default function MultipleSelectField({
  label,
  onChange,
  disabled,
  isLoading,
  required,
  placeholder,
  startContent,
  endContent,
  items,
  hidden,
  value,
}: MultipleSelectFieldProps) {
  const field = useFieldContext<string[]>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  if (hidden) {
    return null;
  }
  return (
    <Select
      label={label}
      isLoading={isLoading}
      isRequired={required}
      isDisabled={disabled}
      placeholder={placeholder}
      startContent={startContent}
      endContent={endContent}
      variant="bordered"
      selectionMode={"multiple"}
      selectedKeys={new Set(value ? value : field.state.value)}
      id={field.name}
      items={items}
      name={field.name}
      onChange={(e) =>
        onChange
          ? onChange(e.target.value.split(","))
          : field.handleChange(e.target.value.split(","))
      }
      isInvalid={errors.length > 0}
      errorMessage={
        typeof errors[0] === "object" ? errors[0].message : errors[0]
      }
    >
      {(item) => <SelectItem>{item.label}</SelectItem>}
    </Select>
  );
}
