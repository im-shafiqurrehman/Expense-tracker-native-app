import { AuthProvider } from '@/contexts/authContext'
import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const _layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name='(modals)/profileModal.tsx'
                options={{ presentation: "modal" }}
            /> <Stack.Screen
                name='(modals)/walletModal.tsx'
                options={{ presentation: "modal" }}
            /><Stack.Screen
                name='(modals)/transactionModal.tsx'
                options={{ presentation: "modal" }}
            />
        </Stack>
    )
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <_layout />
        </AuthProvider>
    )
}

const styles = StyleSheet.create({})