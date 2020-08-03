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
// import browser from '../../utils/browser'

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

// const NotificationWrapper = styled.div`
//     padding: 5px 0;
// `

// const NotificationParagraph = styled.p`
//     padding: 5px 0;
//     margin: 0;
// `

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

const Options = () => {
  // to enable, add "optional_permissions": [ "notifications" ], to manifest
  // const [hasNotificationPermission, togglePermission] = React.useState(false)
  React.useEffect(() => {
    document.title = 'Box Scores | Options'
    // browser.permissions.contains(
    //   {
    //     permissions: ['notifications'],
    //   },
    //   (hasNotificationPermission) => {
    //     console.log('has', hasNotificationPermission)
    //     togglePermission(hasNotificationPermission)
    //   }
    // )
  }, [])

  // const requestNotification = React.useCallback(() => {
  //   console.log('requesting')
  //   browser.permissions.request(
  //     {
  //       permissions: ['notifications'],
  //     },
  //     (granted) => {
  //       console.log('graned', granted)
  //       togglePermission(granted)
  //     }
  //   )
  // }, [])

  // const removeNotification = React.useCallback(() => {
  //   console.log('removing')
  //   browser.permissions.remove(
  //     {
  //       permissions: ['notifications'],
  //     },
  //     (removed) => {
  //       console.log('removed', removed)
  //       togglePermission(!removed)
  //     }
  //   )
  // }, [])

  const renderContent = React.useCallback((sidebarContext) => {
    const { team } = sidebarContext.state
    const { updateTeam } = sidebarContext.actions

    return (
      <ButtonsWrapper>
        {renderHeader()}
        {renderTeams(team, updateTeam)}
        {/* {hasNotificationPermission
          ? <NotificationWrapper>
            <button onClick={removeNotification}>Remove permission</button>
          </NotificationWrapper>
          : <NotificationWrapper>
            <NotificationParagraph>You can get notified when your favorite starts a game!</NotificationParagraph>
            <button onClick={requestNotification}>Grant Permission</button>
          </NotificationWrapper>
        } */}
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
