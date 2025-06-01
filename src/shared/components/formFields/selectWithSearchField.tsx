import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useStore } from "@tanstack/react-form";
import { type ReactNode } from "react";

import { useFieldContext } from "@/shared/hooks/form-context.tsx";

type SelectWithSearchFieldProps = {
  label: string;
  required?: boolean;
  hidden?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  items: { key: any; label: string }[];
  onChange?: (value: string | number | null) => void;
  value?: string | number | null;
};

export default function SelectWithSearchField({
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
}: SelectWithSearchFieldProps) {
  const field = useFieldContext<string | number | null>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  if (hidden) {
    return null;
  }
  return (
    <Autocomplete
      classNames={{
        clearButton: "text-default-900",
      }}
      label={label}
      isLoading={isLoading}
      isRequired={required}
      isDisabled={disabled}
      placeholder={placeholder}
      startContent={startContent}
      endContent={endContent}
      variant="bordered"
      selectedKey={value ? value : field.state.value}
      id={field.name}
      defaultItems={items}
      name={field.name}
      onSelectionChange={(key) =>
        onChange ? onChange(key) : field.handleChange(key)
      }
      isInvalid={errors.length > 0}
      errorMessage={
        typeof errors[0] === "object" ? errors[0].message : errors[0]
      }
    >
      {(item) => (
        <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
      )}
    </Autocomplete>
  );
}
