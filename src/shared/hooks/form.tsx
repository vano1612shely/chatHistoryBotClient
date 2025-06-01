import { createFormHook } from '@tanstack/react-form'

import CheckboxField from '@/shared/components/formFields/checkboxField.tsx'
import DateField from '@/shared/components/formFields/dateField.tsx'
import InfinitySelectField from '@/shared/components/formFields/infinitySelectField.tsx'
import MultipleSelectField from '@/shared/components/formFields/multipleSelectField.tsx'
import NumberField from '@/shared/components/formFields/numberField.tsx'
import SelectField from '@/shared/components/formFields/selectField.tsx'
import SelectWithSearchField from '@/shared/components/formFields/selectWithSearchField.tsx'
import TextAreaField from '@/shared/components/formFields/textAreaField.tsx'
import TextField from '@/shared/components/formFields/textField.tsx'
import { fieldContext, formContext } from '@/shared/hooks/form-context.tsx'

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
		NumberField,
		CheckboxField,
		SelectField,
		DateField,
		SelectWithSearchField,
		InfinitySelectField,
		TextAreaField,
		MultipleSelectField
	},
	formComponents: {},
	fieldContext,
	formContext
})
