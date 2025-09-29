import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Header from '@/components/Header'
import Input from '@/components/Input'
import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { UserDataType } from '@/types'
import { showAlert, showProfileAlert } from '@/utils/alerts'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { getProfileImage } from '../services/imageService'
import { updateUserProfile } from '../services/userService'


const profileModal = () => {
    const [userData, setUserData] = useState<UserDataType>({
        name: "",
        image: null
    });
    const [loading, setLoading] = useState(false);

    const { user, updateUserData } = useAuth();
    const router = useRouter()


    useEffect(() => {
        setUserData(user as UserDataType);
    }, [user])

    const onsubmit = async () => {
        let { name, image } = userData;
        if (!name) return showProfileAlert.validation();
        setLoading(true);
        const res = await updateUserProfile(user?.uid as string, userData);
        setLoading(false);
        if (!res.success) {
            showAlert.error("Error", res.msg);
        } else {
            updateUserData(user?.uid as string);
            router.back();
        }
    }

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.cancelled) {
            setUserData({ ...userData, image: result.assets[0] });
        }
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header title="Edit Profile" leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />


                {/* form */}
                <ScrollView style={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={getProfileImage(userData.image)}
                            style={styles.avatar}
                            contentFit="cover"
                            transition={100}
                        />
                        <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
                            <Icons.Pencil size={verticalScale(20)} color={colors.neutral900} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} >Name</Typo>
                        <Input
                            placeholder='Enter your name'
                            onChangeText={(text) => setUserData({ ...userData, name: text })}
                            value={userData.name}
                        />
                    </View>
                </ScrollView>
            </View>
            <View style={styles.footer}>
                <Button onPress={onsubmit} style={{ flex: 1 }} loading={loading}>
                    <Typo color={colors.black} fontWeight="700">
                        Save</Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default profileModal

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        justifyContent: "space-between",
    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center"
    },
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
    },
    editIcon: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7
    },
    inputContainer: {
        gap: spacingY._10,
    }
})