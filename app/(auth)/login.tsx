import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { showAlert } from '@/utils/alerts'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React, { useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'


const login = () => {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { login: userLogin } = useAuth();

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) return showAlert.validation("Please fill all the fields");
        setIsLoading(true);
        const res = await userLogin(emailRef.current, passwordRef.current);
        setIsLoading(false);
        if (!res.success) {
            showAlert.error("Login Failed", res.msg);
        }
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton />

                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={24} fontWeight="800">
                        Hey,
                    </Typo>
                    <Typo size={24} fontWeight="800">
                        Welcome Back
                    </Typo>
                </View>

                {/* form */}
                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter}>
                        Login now to track all your expenses.
                    </Typo>
                    <Input
                        placeholder='Enter your email'
                        onChangeText={(text) => emailRef.current = text}
                        icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
                    />
                    <Input
                        placeholder='Enter your password'
                        secureTextEntry
                        onChangeText={(text) => passwordRef.current = text}
                        icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
                    />
                    <Typo style={{ alignSelf: "flex-end" }} size={14} color={colors.text}>
                        Forget Password?
                    </Typo>

                    <Button loading={isLoading} onPress={handleSubmit} >
                        <Typo fontWeight={"700"} size={21} color={colors.black}>
                            Login
                        </Typo>
                    </Button>
                </View>
                {/* footer */}
                <View style={styles.footer}>
                    <Typo size={15}>
                        Don't have an account?
                    </Typo>
                    <Pressable onPress={() => { router.navigate("/(auth)/register") }}>
                        <Typo size={15} fontWeight={"700"} color={colors.primary}>
                            Register
                        </Typo>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text
    },
    form: {
        gap: spacingY._20
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
        color: colors.text
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    footerText: {
        textAlign: "center",
        color: colors.text,
        fontSize: verticalScale(15)
    }
})