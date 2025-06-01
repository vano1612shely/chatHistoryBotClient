import { Checkbox } from '@heroui/react'

import { useFieldContext } from '@/shared/hooks/form-context.tsx'

type CheckboxFieldProps = {
	label: string
	disabled?: boolean
	required?: boolean
	value?: boolean
	onChange?: (value: boolean) => void
	hidden?: boolean
}

export default function CheckboxField({
	label,
	disabled,
	value,
	required,
	onChange,
	hidden
}: CheckboxFieldProps) {
	const field = useFieldContext<boolean>()
	if (hidden) return null
	return (
		<Checkbox
			isRequired={required}
			isDisabled={disabled}
			isSelected={value ? value : field.state.value}
			onValueChange={v => (onChange ? onChange(v) : field.handleChange(v))}
		>
			{label}
		</Checkbox>
	)
}
