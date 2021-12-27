import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Cell, HeaderCell, RowHeaderCell, Table, Row } from '../../utils/format'
import { getOddRowColor } from '../../utils/common'
import { ThemeConsumer } from '../Context'

const renderTeamRow = (team, otherTeam, isDark, i = 0) => (
  <Row style={{ backgroundColor: getOddRowColor(i, isDark) }}>
    <RowHeaderCell>{team.abbreviation}</RowHeaderCell>
    {team.linescores &&
      team.linescores.period.map((period, index) => (
        <Cell
          dark={isDark ? 1 : undefined}
          key={`period-${period.peroid_value}-${index}`}
          winning={
            +period.score > +otherTeam.linescores.period[index].score
              ? 1
              : undefined
          }
        >
          {period.score}
        </Cell>
      ))}
    <Cell
      dark={isDark ? 1 : undefined}
      winning={+team.score > +otherTeam.score ? 1 : undefined}
    >
      {team.score}
    </Cell>
  </Row>
)

const Summary = ({ home, visitor, extra }) => {
  return (
    <ThemeConsumer>
      {({ state: { dark } }) => (
        <React.Fragment>
          <Table>
            <tbody>
              <Row>
                <RowHeaderCell> Team </RowHeaderCell>
                {home.linescores &&
                  home.linescores.period.map((period) => (
                    // TODO: hides the unstart peroid
                    <HeaderCell key={`period-${period.period_value}`}>
                      {' '}
                      {period.period_name}{' '}
                    </HeaderCell>
                  ))}
                <HeaderCell> Final </HeaderCell>
              </Row>
              {renderTeamRow(visitor, home, dark)}
              {renderTeamRow(home, visitor, dark, 1)}
              <Row>
                <RowHeaderCell>Lead Changes</RowHeaderCell>
                <Cell>{extra.leadChanges}</Cell>
              </Row>
              <Row>
                <RowHeaderCell>Times Tied</RowHeaderCell>
                <Cell>{extra.timesTied}</Cell>
              </Row>
            </tbody>
          </Table>
        </React.Fragment>
      )}
    </ThemeConsumer>
  )
}

Summary.propTypes = {
  home: PropTypes.object.isRequired,
  visitor: PropTypes.object.isRequired,
  extra: PropTypes.shape({
    leadChanges: PropTypes.number.isRequired,
    timesTied: PropTypes.number.isRequired,
  }),
}

export default Summary
