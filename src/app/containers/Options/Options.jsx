import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import {
  BroadcastCheckbox,
  NoSpoilerCheckbox,
  HideZeroRowCheckbox,
  DarkModeCheckbox,
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
          onChange={(e) => updateTeam(e.currentTarget.value)}
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
const ding = new Audio('./assets/ding.wav')
const renderNotification = (permissionEnum, request, remove) => {
  /* only show the notification once it's loaded */
  if (permissionEnum === -1) {
    return null;
  }

  const button = (permissionEnum === 1
    ? <NotificationWrapper>
      <label>(BETA) notification permission: </label>
      <button onClick={remove}>Remove permission</button>
    </NotificationWrapper>
    : <NotificationWrapper>
      <NotificationParagraph>(BETA) You can get notified when your favorite team starts a game!</NotificationParagraph>
      <label>(BETA) notification permission: </label>
      <button onClick={request}>Grant Permission</button>
    </NotificationWrapper>
  )

  const exampleButton = permissionEnum === 1
    ? <button onClick={() => {
      browser.notifications.create({
        type: 'basic',
        title: `Suns vs Heat`,
        message: `Suns is about to play.`,
        iconUrl: 'assets/png/icon-2-color-512.png',
      })
      if (browser.isChrome) {
        ding.play();
      }
    }}>Send an example</button>
    : null;

  return (
    <NotificationWrapper>
      {button}
      {exampleButton}      
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
        togglePermission(1)
      }
    )
  }, [])

  const removeNotification = React.useCallback(() => {
    browser.permissions.remove(
      {
        permissions: ['notifications'],
      },
      (removed) => {
        togglePermission(removed ? 0 : 1);
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
        {renderNotification(notificationPermissionEnum, requestNotification, removeNotification)}
        <DarkModeCheckbox />
        <HideZeroRowCheckbox />
        <BroadcastCheckbox />
        <NoSpoilerCheckbox />
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
