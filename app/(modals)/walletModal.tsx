import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import Input from '@/components/Input'
import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { WalletType } from '@/types'
import { showAlert, showWalletAlert } from '@/utils/alerts'
import { scale, verticalScale } from '@/utils/styling'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { createOrUpdateWallet, deleteWallet } from '../services/walletService'


const walletModal = () => {
    const [walletData, setWalletData] = useState<WalletType>({
        name: "",
        image: null
    });
    const [loading, setLoading] = useState(false);

    const { user, updateUserData } = useAuth();
    const router = useRouter()

    const oldWallet: { id: string, name: string, image: string } = useLocalSearchParams();

    useEffect(() => {
        if (oldWallet.id) {
            setWalletData({
                name: oldWallet.name,
                image: oldWallet.image
            })
        }
    }, [])

    const onDelete = async () => {
        if (!oldWallet.id) return;
        setLoading(true);
        const res = await deleteWallet(oldWallet.id);
        setLoading(false);
        if (!res.success) {
            showAlert.error("Error", res.msg);
        }
    }

    const showDeleteAlert = () => {
        showWalletAlert.deleteConfirmation(() => {
            onDelete();
            router.back();
        });
    }


    const onsubmit = async () => {
        let { name, image } = walletData;
        if (!name) return showWalletAlert.validation.name();
        if (!image) return showWalletAlert.validation.icon();

        const data: WalletType = {
            name,
            image,
            uid: user?.uid as string
        }
        if (oldWallet.id) {
            data.id = oldWallet.id;
        }
        setLoading(true);
        const res = await createOrUpdateWallet(data);
        setLoading(false);

        if (!res.success) {
            showAlert.error("Error", res.msg);
        } else {
            updateUserData(user?.uid as string);
            router.back();
        }
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header title={oldWallet.id ? "Edit Wallet" : "Add Wallet"} leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />

                {/* form */}
                <ScrollView style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} >Wallet Name</Typo>
                        <Input
                            placeholder='Enter your wallet name'
                            onChangeText={(text) => setWalletData({ ...walletData, name: text })}
                            value={walletData.name}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} >Wallet Icon</Typo>
                        {/* imageInput */}
                        <ImageUpload
                            file={walletData.image}
                            onSelect={(file) => setWalletData({ ...walletData, image: file })}
                            onClear={() => setWalletData({ ...walletData, image: null })}
                            placeholder='Select your wallet icon' />
                    </View>
                </ScrollView>
            </View>
            <View style={styles.footer}>
                {oldWallet.id && !loading && (
                    <Button
                        onPress={showDeleteAlert}
                        style={{
                            backgroundColor: colors.rose,
                            paddingHorizontal: spacingX._15
                        }}
                    >
                        <Icons.Trash
                            color={colors.white}
                            size={verticalScale(20)}
                            weight="bold" />
                    </Button>

                )}

                <Button onPress={onsubmit} style={{ flex: 1 }} loading={loading}>
                    <Typo color={colors.black} fontWeight="700">
                        {oldWallet.id ? "Update" : "Add Wallet"}  </Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default walletModal

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