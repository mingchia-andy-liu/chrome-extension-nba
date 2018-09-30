import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Checkbox from '../../components/Checkbox'
import { SettingsConsumer } from '../../components/Context'

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

class Options extends React.Component {
    constructor(props) {
        super(props)
    }

    renderHeader(isDark) {
        return (
            <React.Fragment>
                <RouterLink dark={isDark ? 1 : 0} to="changelog">Changelog</RouterLink>
                <p>If you have any questions, please email to
                    <HrefLink
                        dark={isDark ? 1 : 0}
                        href={`mailto:box.scores.extension@gmail.com?subject=${encodeURIComponent('Feedback on the Basketball Box Scores extension')}`}
                    >
                        here
                    </HrefLink>
                    .
                </p>
            </React.Fragment>
        )
    }

    // getOptionalPermission() {
    //     // for getting the optional permission for the highlight videos in the future
    //     document.querySelector('#my-button').addEventListener('click', () => {
    //         chrome.permissions.request({
    //             permissions: ['webRequest'],
    //             origins: ['https://boxscoresORsomething.net'],
    //         }, function(granted) {
    //             if (granted) {
    //                 // granted
    //             } else {
    //                 // not granted
    //             }
    //         })
    //     })
    // }

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

    renderContent(context) {
        const { team, dark, hideZeroRow, broadcast, spoiler } = context.state
        const {
            updateBroadcast,
            updateHideZeroRow,
            updateNoSpoiler,
            updateTeam,
            updateTheme,
        } = context.actions

        return (
            <React.Fragment>
                {this.renderHeader(dark)}
                {this.renderTeams(team, updateTeam)}
                <Checkbox checked={dark === true} text="Dark Theme" onChange={updateTheme} />
                <Checkbox checked={hideZeroRow === true} text="Hide Player Who Has Not Played" onChange={updateHideZeroRow} />
                <Checkbox checked={broadcast === true} text="Show US Broadcaster" onChange={updateBroadcast} />
                <Checkbox checked={spoiler === true} text="No Spoiler" onChange={updateNoSpoiler} />
            </React.Fragment>
        )
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={3}/>}</Layout.Header>
                <Layout.Content>
                    <SettingsConsumer>
                        {context => this.renderContent(context)}
                    </SettingsConsumer>
                </Layout.Content>
            </Layout>
        )
    }
}

export default Options
