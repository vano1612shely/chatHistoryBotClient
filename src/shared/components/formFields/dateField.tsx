import { DatePicker } from "@heroui/react";
import {
  ZonedDateTime,
  fromDate,
  getLocalTimeZone,
} from "@internationalized/date";
import { useStore } from "@tanstack/react-form";
import dayjs from "dayjs";
import type { ReactNode } from "react";

import { useFieldContext } from "@/shared/hooks/form-context.tsx";

type DateFieldProps = {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  withTime?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onChange?: (value: Date) => void;
  hidden?: boolean;
  value?: Date | undefined;
  size?: "sm" | "md" | "lg";
};

function dateToZoned(value: Date): ZonedDateTime {
  return fromDate(value, getLocalTimeZone());
}

function zonedToDate(value: ZonedDateTime): Date {
  return value.toDate();
}

export default function DateField({
  label,
  required,
  disabled,
  startContent,
  endContent,
  onChange,
  withTime,
  hidden,
  value,
  size = "md",
}: DateFieldProps) {
  const field = useFieldContext<Date>();
  const errors = useStore(field.store, (s) => s.meta.errors);

  if (hidden) return null;
  let v: any = value ? value : field.state.value;
  v = v ? dateToZoned(dayjs(v).toDate()) : undefined;

  return (
    <DatePicker
      size={size}
      showMonthAndYearPickers
      hideTimeZone
      granularity={withTime ? "minute" : "day"}
      label={label}
      isRequired={required}
      isDisabled={disabled}
      startContent={startContent}
      endContent={endContent}
      variant="bordered"
      value={v}
      id={field.name}
      name={field.name}
      onChange={(val) => {
        const result = val ? zonedToDate(val as ZonedDateTime) : undefined;
        if (result) {
          if (onChange) {
            onChange(result);
          } else {
            field.handleChange(result);
          }
        }
      }}
      isInvalid={errors.length > 0}
      errorMessage={
        typeof errors[0] === "object" ? errors[0].message : errors[0]
      }
    />
  );
}
