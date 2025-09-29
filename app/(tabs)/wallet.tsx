import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import WalletListItem from '@/components/WalletListItem'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { WalletType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { orderBy, where } from '@firebase/firestore'
import { useRouter } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import useFetchData from '../hooks/useFetchData'

const wallet = () => {
    const router = useRouter();
    const { user } = useAuth();

    const {
        data: wallets,
        loading,
        error,
    } = useFetchData<WalletType>("wallets", [
        where("uid", "==", user?.uid as string),
        orderBy("created", "desc"),
    ]);

    const getTotalBalance = () =>
        wallets?.reduce((total, item) => {
            total = total + (item.amount || 0);
            return total
        }, 0)

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.balanceView}>
                    <View style={{ alignItems: "center" }}  >
                        <Typo size={30} fontWeight={"500"}>
                            ${getTotalBalance()?.toFixed(2)}
                        </Typo>
                        <Typo size={16} color={colors.neutral300}>
                            Total Balance
                        </Typo>
                    </View>
                </View>
                {/* wallets */}
                <View style={styles.wallets}>
                    <View style={styles.flexRow}>
                        <Typo size={20} fontWeight={"500"}>
                            My Wallets
                        </Typo>
                        <TouchableOpacity onPress={() => router.push("/(modals)/walletModal")} >
                            <Icons.Plus size={verticalScale(verticalScale(33))} color={colors.primary} weight='fill' />
                        </TouchableOpacity>
                    </View>
                    {/* wallet list */}
                    {
                        loading && <Loading />
                    }

                    <FlatList
                        data={wallets}
                        renderItem={({ item, index }) => (
                            <WalletListItem item={item} index={index}
                                router={router}
                            />
                        )}
                        contentContainerStyle={styles.listStyle}
                    />
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default wallet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    balanceView: {
        height: verticalScale(160),
        backgroundColor: colors.black,
        justifyContent: "center",
        alignItems: "center"
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacingY._10
    },
    wallets: {
        flex: 1,
        backgroundColor: colors.neutral900,
        borderTopRightRadius: radius._30,
        borderTopLeftRadius: radius._30,
        padding: spacingX._20,
        paddingTop: spacingX._25
    },
    listStyle: {
        paddingVertical: spacingY._25,
        paddingTop: spacingY._15,
    }
})