import React from 'react'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import { SettingsConsumer } from '../../components/Context'

import { teams } from '../../utils/teams'


class Options extends React.Component {
    constructor(props) {
        super(props)
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
