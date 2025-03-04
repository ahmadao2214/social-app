import React from 'react'
import {observer} from 'mobx-react-lite'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {PressableWithHover} from 'view/com/util/PressableWithHover'
import {
  useLinkProps,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native'
import {
  FontAwesomeIcon,
  FontAwesomeIconStyle,
} from '@fortawesome/react-native-fontawesome'
import {Text} from 'view/com/util/text/Text'
import {UserAvatar} from 'view/com/util/UserAvatar'
import {Link} from 'view/com/util/Link'
import {usePalette} from 'lib/hooks/usePalette'
import {useStores} from 'state/index'
import {s, colors} from 'lib/styles'
import {
  HomeIcon,
  HomeIconSolid,
  MagnifyingGlassIcon2,
  MagnifyingGlassIcon2Solid,
  BellIcon,
  BellIconSolid,
  UserIcon,
  UserIconSolid,
  CogIcon,
  CogIconSolid,
  ComposeIcon2,
  HandIcon,
} from 'lib/icons'
import {getCurrentRoute, isTab, isStateAtTabRoot} from 'lib/routes/helpers'
import {NavigationProp} from 'lib/routes/types'
import {router} from '../../../routes'

const ProfileCard = observer(() => {
  const store = useStores()
  return (
    <Link href={`/profile/${store.me.handle}`} style={styles.profileCard}>
      <UserAvatar avatar={store.me.avatar} size={64} />
    </Link>
  )
})

function BackBtn() {
  const pal = usePalette('default')
  const navigation = useNavigation<NavigationProp>()
  const shouldShow = useNavigationState(state => !isStateAtTabRoot(state))

  const onPressBack = React.useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('Home')
    }
  }, [navigation])

  if (!shouldShow) {
    return <></>
  }
  return (
    <TouchableOpacity
      testID="viewHeaderBackOrMenuBtn"
      onPress={onPressBack}
      style={styles.backBtn}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      accessibilityHint="">
      <FontAwesomeIcon
        size={24}
        icon="angle-left"
        style={pal.text as FontAwesomeIconStyle}
      />
    </TouchableOpacity>
  )
}

interface NavItemProps {
  count?: string
  href: string
  icon: JSX.Element
  iconFilled: JSX.Element
  label: string
}
const NavItem = observer(
  ({count, href, icon, iconFilled, label}: NavItemProps) => {
    const pal = usePalette('default')
    const store = useStores()
    const [pathName] = React.useMemo(() => router.matchPath(href), [href])
    const currentRouteName = useNavigationState(state => {
      if (!state) {
        return 'Home'
      }
      return getCurrentRoute(state).name
    })

    const isCurrent = isTab(currentRouteName, pathName)
    const {onPress} = useLinkProps({to: href})
    const onPressWrapped = React.useCallback(
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (e.ctrlKey || e.metaKey || e.altKey) {
          return
        }
        e.preventDefault()
        if (isCurrent) {
          store.emitScreenSoftReset()
        } else {
          onPress()
        }
      },
      [onPress, isCurrent, store],
    )

    return (
      <PressableWithHover
        style={styles.navItemWrapper}
        hoverStyle={pal.viewLight}
        onPress={onPressWrapped}
        // @ts-ignore web only -prf
        href={href}
        dataSet={{noUnderline: 1}}
        accessibilityRole="tab"
        accessibilityLabel={label}
        accessibilityHint="">
        <View style={[styles.navItemIconWrapper]}>
          {isCurrent ? iconFilled : icon}
          {typeof count === 'string' && count ? (
            <Text type="button" style={styles.navItemCount}>
              {count}
            </Text>
          ) : null}
        </View>
        <Text type="title" style={[isCurrent ? s.bold : s.normal, pal.text]}>
          {label}
        </Text>
      </PressableWithHover>
    )
  },
)

function ComposeBtn() {
  const store = useStores()
  const onPressCompose = () => store.shell.openComposer({})

  return (
    <TouchableOpacity
      style={[styles.newPostBtn]}
      onPress={onPressCompose}
      accessibilityRole="button"
      accessibilityLabel="Compose post"
      accessibilityHint="">
      <View style={styles.newPostBtnIconWrapper}>
        <ComposeIcon2
          size={19}
          strokeWidth={2}
          style={styles.newPostBtnLabel}
        />
      </View>
      <Text type="button" style={styles.newPostBtnLabel}>
        New Post
      </Text>
    </TouchableOpacity>
  )
}

export const DesktopLeftNav = observer(function DesktopLeftNav() {
  const store = useStores()
  const pal = usePalette('default')

  return (
    <View style={[styles.leftNav, pal.view]}>
      {store.session.hasSession && <ProfileCard />}
      <BackBtn />
      <NavItem
        href="/"
        icon={<HomeIcon size={24} style={pal.text} />}
        iconFilled={
          <HomeIconSolid strokeWidth={4} size={24} style={pal.text} />
        }
        label="Home"
      />
      <NavItem
        href="/search"
        icon={
          <MagnifyingGlassIcon2 strokeWidth={2} size={24} style={pal.text} />
        }
        iconFilled={
          <MagnifyingGlassIcon2Solid
            strokeWidth={2}
            size={24}
            style={pal.text}
          />
        }
        label="Search"
      />
      <NavItem
        href="/notifications"
        count={store.me.notifications.unreadCountLabel}
        icon={<BellIcon strokeWidth={2} size={24} style={pal.text} />}
        iconFilled={
          <BellIconSolid strokeWidth={1.5} size={24} style={pal.text} />
        }
        label="Notifications"
      />
      <NavItem
        href="/moderation"
        icon={
          <HandIcon
            strokeWidth={5.5}
            style={pal.text as FontAwesomeIconStyle}
            size={24}
          />
        }
        iconFilled={
          <FontAwesomeIcon
            icon="hand"
            style={pal.text as FontAwesomeIconStyle}
            size={20}
          />
        }
        label="Moderation"
      />
      {store.session.hasSession && (
        <NavItem
          href={`/profile/${store.me.handle}`}
          icon={<UserIcon strokeWidth={1.75} size={28} style={pal.text} />}
          iconFilled={
            <UserIconSolid strokeWidth={1.75} size={28} style={pal.text} />
          }
          label="Profile"
        />
      )}
      <NavItem
        href="/settings"
        icon={<CogIcon strokeWidth={1.75} size={28} style={pal.text} />}
        iconFilled={
          <CogIconSolid strokeWidth={1.5} size={28} style={pal.text} />
        }
        label="Settings"
      />
      {store.session.hasSession && <ComposeBtn />}
    </View>
  )
})

const styles = StyleSheet.create({
  leftNav: {
    position: 'absolute',
    top: 10,
    right: 'calc(50vw + 312px)',
    width: 220,
  },

  profileCard: {
    marginVertical: 10,
    width: 90,
    paddingLeft: 12,
  },

  backBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
  },

  navItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  navItemIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    marginTop: 2,
  },
  navItemCount: {
    position: 'absolute',
    top: 0,
    left: 15,
    backgroundColor: colors.blue3,
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    borderRadius: 6,
  },

  newPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.blue3,
    marginLeft: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  newPostBtnIconWrapper: {
    marginRight: 8,
  },
  newPostBtnLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
