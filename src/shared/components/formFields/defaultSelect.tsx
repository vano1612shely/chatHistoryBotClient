import { Select, SelectItem, Spinner } from '@heroui/react'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DefaultSelectProps {
	disabled: boolean
	value: any
	onChange: (value: string) => void
	options: { label: string; value: any }[]
	isLoading: boolean
	label?: string
	required?: boolean
	placeholder?: string
	className?: string
}

export const DefaultSelect = ({
	disabled,
	value,
	onChange,
	options,
	isLoading,
	label,
	required = false,
	placeholder,
	className = ''
}: DefaultSelectProps) => {
	const [selectedValue, setSelectedValue] = useState<string>('')

	useEffect(() => {
		if (options.some(option => String(option.value) === String(value))) {
			setSelectedValue(String(value))
		} else {
			setSelectedValue('')
		}
	}, [value, options])

	const handleSelectionChange = (keys: any) => {
		const selectedKey = Array.from(keys)[0] as string
		setSelectedValue(selectedKey)
		onChange(selectedKey)
	}

	const getSelectedLabel = () => {
		const selectedOption = options.find(
			option => String(option.value) === selectedValue
		)
		return selectedOption?.label || ''
	}

	return (
		<Select
			label={label ? `${label}${required ? ' *' : ''}` : undefined}
			placeholder={placeholder}
			selectedKeys={selectedValue ? new Set([selectedValue]) : new Set([])}
			onSelectionChange={handleSelectionChange}
			isDisabled={disabled}
			isLoading={isLoading}
			className={className}
			variant='bordered'
			labelPlacement='outside'
			classNames={{
				label: 'text-foreground font-medium',
				trigger: 'min-h-12',
				value: 'text-foreground',
				popoverContent: 'rounded-lg',
				listbox: 'p-0'
			}}
			startContent={isLoading ? <Spinner size='sm' /> : undefined}
			renderValue={() => {
				if (isLoading) {
					return (
						<div className='flex items-center gap-2'>
							<Loader2 className='animate-spin w-4 h-4' />
							<span className='text-default-500'>Loading...</span>
						</div>
					)
				}
				return getSelectedLabel()
			}}
		>
			{options.map(item => (
				<SelectItem
					key={String(item.value)}
					textValue={item.label}
					className='data-[hover=true]:bg-default-100'
				>
					{item.label}
				</SelectItem>
			))}
		</Select>
	)
}
