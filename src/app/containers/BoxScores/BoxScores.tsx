import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as PropTypes from 'prop-types'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import startOfDay from 'date-fns/startOfDay'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Sidebar from '../Sidebar'
import BoxScoresDetails from '../BoxScoresDetails'
import { Wrapper } from './styles'
import { getDateFromQuery } from '../../utils/common'
import { DATE_FORMAT } from '../../utils/constant'
import { dispatchChangeDate } from '../DatePicker/actions'

const BoxScores = ({
  date: { date },
  location,
  history,
  match,
  dispatchChangeDate,
}) => {
  const dateStr = format(date, DATE_FORMAT)
  const queryDate = getDateFromQuery(location)

  React.useEffect(() => {
    document.title = 'Box Scores | Box-scores'
    const gameDate = queryDate == null ? dateStr : queryDate
    const gameDateObj = parse(gameDate, DATE_FORMAT, startOfDay(new Date()))
    if (!isSameDay(date, gameDateObj)) {
      dispatchChangeDate(gameDateObj).then(() => {
        if (location.search !== '') {
          history.push({
            search: '',
          })
        }
      })
    }
  }, [])

  const id = React.useMemo(() => {
    return match.params.id || ''
  }, [match.params.id])

  return (
    <Layout>
      <Layout.Header>
        <Header index={0} />
      </Layout.Header>
      <Layout.Content>
        <Wrapper>
          <Sidebar id={id} date={date} />
          <BoxScoresDetails id={id} date={date} />
        </Wrapper>
      </Layout.Content>
    </Layout>
  )
}

BoxScores.propTypes = {
  date: PropTypes.shape({
    date: PropTypes.object.isRequired,
  }),
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  dispatchChangeDate: PropTypes.func.isRequired,
}

const mapStateToProps = ({ date }) => ({
  date,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      dispatchChangeDate,
    },
    dispatch
  )
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BoxScores)
)
