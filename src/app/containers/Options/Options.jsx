import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import {
    BroadcastCheckbox,
    NoSpoilerCheckbox,
    HideZeroRowCheckbox,
    DarkModeCheckbox
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

// const NotificationWrapper = styled.div`
//     padding: 5px 0;
// `

// const NotificationParagraph = styled.p`
//     padding: 5px 0;
//     margin: 0;
// `

class Options extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasNotificationPermission: false }
    }

    componentDidMount() {
        document.title = 'Box Scores | Options'
        browser.permissions.contains({
            permissions: ['notifications'],
        }, (hasNotificationPermission) => {
            this.setState({ hasNotificationPermission })
        })
    }

    renderHeader() {
        return (
            <ThemeConsumer>
                {({ state: {dark}}) => (
                    <React.Fragment>
                        <RouterLink
                            dark={dark ? 1 : undefined} to="changelog"
                        >
                        Changelog
                        </RouterLink>
                        <p>If you have any questions, please email to
                            <HrefLink
                                dark={dark ? 1 : undefined}
                                href={`mailto:box.scores.extension@gmail.com?subject=${encodeURIComponent('Feedback on the Basketball Box Scores extension')}`}
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

    requestNotification() {
        browser.permissions.request({
            permissions: ['notifications'],
        }, (granted) => {
            this.setState({ hasNotificationPermission: granted })
        })
    }

    removeNotification() {
        browser.permissions.remove({
            permissions: ['notifications'],
        }, (removed) => {
            this.setState({ hasNotificationPermission: !removed })
        })
    }

    renderTeams(favTeam, updateTeam) {
        return (
            <React.Fragment>
                <label>
                    Select your favorite team:
                    <select value={favTeam} onChange={(e) => updateTeam(e.currentTarget.value)}>
                        <option value="">-</option>
                        {Object.keys(teams).map(teamAbbr => (
                            <option
                                key={teamAbbr}
                                value={teamAbbr}
                            >
                                {teams[teamAbbr]}
                            </option>
                        ))}
                    </select>
                </label>
            </React.Fragment>
        )
    }

    renderContent(sidebarContext) {
        // const { hasNotificationPermission } = this.state
        const { team } = sidebarContext.state
        const {
            updateTeam,
        } = sidebarContext.actions

        return (
            <ButtonsWrapper>
                {this.renderHeader()}
                {this.renderTeams(team, updateTeam)}
                {/* {hasNotificationPermission
                    ? <NotificationWrapper>
                        <button onClick={this.removeNotification.bind(this)}>Remove permission</button>
                    </NotificationWrapper>
                    : <NotificationWrapper>
                        <NotificationParagraph>You can get notified when your favorite starts a game!</NotificationParagraph>
                        <button onClick={this.requestNotification.bind(this)}>Grant Permission</button>
                    </NotificationWrapper>
                } */}
                <DarkModeCheckbox />
                <HideZeroRowCheckbox />
                <BroadcastCheckbox />
                <NoSpoilerCheckbox />
            </ButtonsWrapper>
        )
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={3}/>}</Layout.Header>
                <Layout.Content>
                    <SidebarConsumer>
                        {sidebarContext => (
                            this.renderContent( sidebarContext)
                        )}
                    </SidebarConsumer>
                </Layout.Content>
            </Layout>
        )
    }
}

export default Options
