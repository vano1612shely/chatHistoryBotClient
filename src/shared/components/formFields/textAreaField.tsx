import { Textarea } from '@heroui/react'
import { useStore } from '@tanstack/react-form'

import { useFieldContext } from '@/shared/hooks/form-context.tsx'

type TextAreaFieldProps = {
	label: string
	hidden?: boolean
	required?: boolean
	disabled?: boolean
	placeholder?: string
	onChange?: (value: string) => void
	value?: string
	isClearable?: boolean
}

export default function TextAreaField({
	label,
	disabled,
	required,
	placeholder,
	onChange,
	hidden,
	value,
	isClearable
}: TextAreaFieldProps) {
	const field = useFieldContext<string>()
	const errors = useStore(field.store, state => state.meta.errors)
	if (hidden) {
		return null
	}
	return (
		<Textarea
			isClearable={isClearable}
			className='w-full'
			minRows={4}
			value={value ? value : field.state.value}
			label={label}
			placeholder={placeholder}
			variant='bordered'
			onValueChange={value =>
				onChange ? onChange(value) : field.handleChange(value)
			}
			isInvalid={errors.length > 0}
			errorMessage={
				typeof errors[0] === 'object' ? errors[0].message : errors[0]
			}
			id={field.name}
			name={field.name}
			isRequired={required}
			isDisabled={disabled}
		/>
	)
}
