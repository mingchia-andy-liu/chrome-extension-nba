import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Checkbox, {
  BroadcastCheckbox,
  NoSpoilerCheckbox,
  HideZeroRowCheckbox,
  DarkModeCheckbox,
  ChronologicalCheckbox,
} from '../../components/Checkbox'
import { ThemeConsumer, SidebarConsumer } from '../../components/Context'
import browser from '../../utils/browser'

import { teams } from '../../utils/teams'

const RouterLink = styled(Link)`
  padding: 0 5px;
  text-decoration: none;
  border: 0;
  outline: none;
  color: ${(props) => (props.dark ? '#5188ff' : 'rgb(46, 46, 223)')};
  cursor: pointer;
`

const HrefLink = styled.a`
  padding-left: 5px;
  text-decoration: none;
  border: 0;
  outline: none;
  color: ${(props) => (props.dark ? '#5188ff' : 'rgb(46, 46, 223)')};
  cursor: pointer;
`

const ButtonsWrapper = styled.div`
  > * {
    padding: 10px 0;
  }
`

const NotificationWrapper = styled.div`
  padding: 5px 0;
`

const NotificationParagraph = styled.p`
  padding: 5px 0;
  margin: 0;
`

const renderHeader = () => {
  return (
    <ThemeConsumer>
      {({ state: { dark } }) => (
        <React.Fragment>
          <RouterLink dark={dark ? 1 : undefined} to="changelog">
            Changelog
          </RouterLink>
          <p>
            If you have any questions, please email to
            <HrefLink
              dark={dark ? 1 : undefined}
              href={`mailto:box.scores.extension@gmail.com?subject=${encodeURIComponent(
                'Feedback on the Basketball Box Scores extension'
              )}`}
            >
              here
            </HrefLink>
            .
          </p>
        </React.Fragment>
      )}
    </ThemeConsumer>
  )
}

const renderTeams = (favTeam, updateTeam) => {
  return (
    <React.Fragment>
      <label>
        Select your favorite team:
        <select
          value={favTeam}
          onChange={(e) => {
            updateTeam(e.currentTarget.value)
            browser.getItem(['notification'], (data) => {
              if (data.notification) {
                browser.setItem({
                  notification: {
                    ...data.notification,
                    gameId: undefined,
                    status: undefined,
                  },
                })
              }
            })
          }}
        >
          <option value="">-</option>
          {Object.keys(teams).map((teamAbbr) => (
            <option key={teamAbbr} value={teamAbbr}>
              {teams[teamAbbr]}
            </option>
          ))}
        </select>
      </label>
    </React.Fragment>
  )
}
// const ding = new Audio('./assets/ding.wav')
const NotificationSection = ({ permissionEnum, request, remove }) => {
  // null: loading, {enabled: false}: no notification, {enabled:true}: has notification
  const [notification, toggleNotification] = React.useState(null)
  React.useEffect(() => {
    browser.getItem(['notification'], (data) => {
      toggleNotification(
        data.notification
          ? data.notification
          : {
              enabled: false,
              quarters: false,
              gameId: undefined,
              status: undefined,
            }
      )
    })
  }, [])

  const quartersNotify = (
    <Checkbox
      checked={notification?.quarters}
      text="Send notifications when quarters starts"
      onChange={(e) => {
        const enabled = e.target.checked
        toggleNotification({
          ...notification,
          quarters: enabled,
        })
        browser.setItem({
          notification: {
            ...notification,
            quarters: enabled,
          },
        })
      }}
    />
  )

  const grantButton =
    permissionEnum === 1 && notification?.enabled ? (
      <NotificationWrapper>
        <label>notification permission: </label>
        <button onClick={remove}>Remove permission</button>
      </NotificationWrapper>
    ) : (
      <NotificationWrapper>
        <NotificationParagraph>
          You can get notified when your favorite team's game starts and ends!
        </NotificationParagraph>
        <label>notification permission: </label>
        <button onClick={request}>Grant Permission</button>
      </NotificationWrapper>
    )

  const exampleButton =
    permissionEnum === 1 && notification?.enabled ? (
      <button
        onClick={() => {
          browser.notifications.create({
            type: 'basic',
            title: `Suns vs Heat`,
            message: `Suns is about to play.`,
            iconUrl: 'assets/png/icon-2-color-512.png',
          })
          if (browser.isChrome) {
            // ding.play()
          }
        }}
      >
        Send an example
      </button>
    ) : null

  return (
    <NotificationWrapper>
      <Checkbox
        checked={notification?.enabled}
        text="Send notification"
        onChange={() => {
          const enabled = notification?.enabled ? false : true
          toggleNotification({ ...notification, enabled })
          browser.setItem({
            notification: {
              ...notification,
              enabled,
            },
          })
        }}
      />
      {notification?.enabled ? quartersNotify : null}
      {notification?.enabled ? grantButton : null}
      {notification?.enabled ? exampleButton : null}
    </NotificationWrapper>
  )
}

const Options = () => {
  // to enable, add "optional_permissions": [ "notifications" ], to manifest
  // -1: loading, 0: no permission, 1: has permission
  const [notificationPermissionEnum, togglePermission] = React.useState(-1)
  React.useEffect(() => {
    document.title = 'Box Scores | Options'
    browser.permissions.contains(
      {
        permissions: ['notifications'],
      },
      (hasNotificationPermission) => {
        togglePermission(hasNotificationPermission ? 1 : 0)
      }
    )
  }, [])

  const requestNotification = React.useCallback(() => {
    browser.permissions.request(
      {
        permissions: ['notifications'],
      },
      (granted) => {
        togglePermission(granted ? 1 : 0)
      }
    )
  }, [])

  const removeNotification = React.useCallback(() => {
    browser.permissions.remove(
      {
        permissions: ['notifications'],
      },
      (removed) => {
        togglePermission(removed ? 0 : 1)
      }
    )
  }, [])

  const renderContent = React.useCallback((sidebarContext) => {
    const { team } = sidebarContext.state
    const { updateTeam } = sidebarContext.actions

    return (
      <ButtonsWrapper>
        {renderHeader()}
        {renderTeams(team, updateTeam)}
        <NotificationSection
          permissionEnum={notificationPermissionEnum}
          request={requestNotification}
          remove={removeNotification}
        />
        <DarkModeCheckbox />
        <HideZeroRowCheckbox />
        <BroadcastCheckbox />
        <NoSpoilerCheckbox />
        <ChronologicalCheckbox />
      </ButtonsWrapper>
    )
  })

  return (
    <Layout>
      <Layout.Header>{<Header index={3} />}</Layout.Header>
      <Layout.Content>
        <SidebarConsumer>
          {(sidebarContext) => renderContent(sidebarContext)}
        </SidebarConsumer>
      </Layout.Content>
    </Layout>
  )
}

export default Options
