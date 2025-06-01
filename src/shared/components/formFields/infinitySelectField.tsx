import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useStore } from "@tanstack/react-form";
import { type ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useFieldContext } from "@/shared/hooks/form-context.tsx";

type InfinitySelectFieldProps = {
  label: string;
  required?: boolean;
  hidden?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingNextPage?: boolean;
  disabled?: boolean;
  placeholder?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  items: { key: any; label: string }[];
  onChange?: (value: string | number | null) => void;
  onSearch?: (value: string) => void;
  value?: string | number | null;
};

export default function InfinitySelectField({
  label,
  onChange,
  disabled,
  isLoading,
  required,
  placeholder,
  startContent,
  endContent,
  items,
  hasMore,
  isLoadingNextPage,
  onLoadMore,
  onSearch,
  value,
  hidden,
}: InfinitySelectFieldProps) {
  const field = useFieldContext<string | number | null>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore?.();
    }
  }, [inView]);
  if (hidden) {
    return null;
  }
  return (
    <Autocomplete
      classNames={{
        clearButton: "text-default-900",
      }}
      isVirtualized
      label={label}
      isLoading={isLoading || isLoadingNextPage}
      isRequired={required}
      isDisabled={disabled}
      placeholder={placeholder}
      onInputChange={onSearch}
      startContent={startContent}
      endContent={endContent}
      variant="bordered"
      selectedKey={value ? value : field.state.value}
      id={field.name}
      items={items}
      name={field.name}
      onSelectionChange={(key) =>
        onChange ? onChange(key) : field.handleChange(key)
      }
      isInvalid={errors.length > 0}
      errorMessage={
        typeof errors[0] === "object" ? errors[0].message : errors[0]
      }
    >
      {items.map((item, index) => (
        <AutocompleteItem
          key={item.key}
          classNames={{ title: "flex w-full" }}
          textValue={item.label}
        >
          <p
            className="flex-1 text-small font-normal truncate break-all"
            ref={index === items.length - 1 ? ref : null}
          >
            {item.label}
          </p>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
