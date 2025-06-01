import { FC, ReactNode, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store.ts'

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [loading, setLoading] = useState(true)
	const login = useAuthStore(state => state.login)
	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			login(token)
		}
		setLoading(false)
	}, [])

	if (loading) {
		return null
	}

	return <>{children}</>
}
