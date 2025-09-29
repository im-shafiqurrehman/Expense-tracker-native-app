import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { auth } from '@/config/firebase'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { accountOptionType } from '@/types'
import { showAuthAlert } from '@/utils/alerts'
import { verticalScale } from '@/utils/styling'
import { Image } from "expo-image"
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import * as Icons from "phosphor-react-native"
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { getProfileImage } from '../services/imageService'


const profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions: accountOptionType = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={26} color={colors.white} weight='fill' />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1"
    }, {
      title: "Settings",
      icon: <Icons.GearSix size={26} color={colors.white} weight='fill' />,
      bgColor: "#059669"
    }, {
      title: "Privacy Policy",
      icon: <Icons.Lock size={26} color={colors.white} weight='fill' />,
      bgColor: colors.neutral100
    }, {
      title: "Logout",
      icon: <Icons.User size={26} color={colors.white} weight='fill' />,
      bgColor: "#e11d48"
    },
  ]


  const showLogoutAlert = () => {
    showAuthAlert.logoutConfirmation(async () => {
      // handle logout
      await signOut(auth);
    });
  }

  const handlePress = (option: accountOptionType) => () => {
    if (option.title === "Logout") {
      showLogoutAlert();
    }

    if (option.routeName) {
      router.push(option.routeName);
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />
        {/* user info */}
        <View style={styles.userInfo}>
          {/* avatar */}
          <View style={styles.avatarContainer}>
            {/* image */}
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* name & email */}
          <View style={styles.nameContainer}>
            <Typo size={20} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* account options */}
        <View style={styles.accountOptions}>

          {accountOptions.map((option, index) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50).springify().damping(14)}
              key={index.toString()}
              style={styles.listItem}>
              <TouchableOpacity style={styles.flexRow}
                onPress={handlePress(option)}
              >
                {/* icon */}
                <View style={[styles.ListIcon,
                { backgroundColor: option.bgColor }]
                } >
                  {option.icon}

                </View>
                <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                  {option.title}
                </Typo>
                <Icons.CaretRight size={verticalScale(20)} color={colors.white} weight='bold' />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15
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
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },


  ListIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous"
  },
  listItem: {
    marginBottom: verticalScale(17)
  },
  accountOptions: {
    marginTop: spacingY._35
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  }
})
