import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import { SettingsConsumer } from '../../components/Context'

import { RowCSS, AlignCenter } from '../../styles'
import { teams } from '../../utils/teams'

const Link = styled(RouterLink)`
    ${RowCSS}
    ${AlignCenter}
    padding: 0 5px;
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

    renderHeader() {
        return (
            <React.Fragment>
                <Link to="changelog">Changelog</Link>
                <p>If you have any questions, please email to
                    <i>box.scores.extension@gmail.com</i>
                </p>
            </React.Fragment>
        )
    }

    getOptionalPermission() {
        document.querySelector('#my-button').addEventListener('click', () => {
            chrome.permissions.request({
                permissions: ['webRequest'],
                origins: ['https://boxscoresORsomething.net'],
            }, function(granted) {
                if (granted) {
                    console.log('granted')
                } else {
                    console.log('no granted')
                }
            })
        })
    }

    renderTeams(favTeam, updateTeam) {
        return (
            <React.Fragment>
                <label className="u-margin-none">
                    Select your favorite team:
                </label>
                <select value={favTeam} onChange={(e) => updateTeam(e.currentTarget.value)}>
                    <option value="">Choose here</option>
                    {Object.keys(teams).map(teamAbbr => (
                        <option
                            key={teamAbbr}
                            value={teamAbbr}
                        >
                            {teams[teamAbbr]}
                        </option>
                    ))}
                </select>
            </React.Fragment>
        )
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={1}/>}</Layout.Header>
                <Layout.Content>
                    <SettingsConsumer>
                        {context => {
                            const { team, dark } = context.state
                            const { updateTeam, updateTheme } = context.actions

                            return (
                                <React.Fragment>
                                    {this.renderHeader()}
                                    <p>Current team: {team}</p>
                                    {this.renderTeams(team, updateTeam)}
                                    <p>Dark: {`${dark === true}`}</p>
                                    <button onClick={updateTheme}>update theme</button>
                                </React.Fragment>
                            )
                        }}
                    </SettingsConsumer>
                </Layout.Content>
            </Layout>
        )
    }
}

export default Options
