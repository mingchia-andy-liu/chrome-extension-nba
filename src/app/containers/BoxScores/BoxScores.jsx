import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
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
  const dateStr = moment(date).format(DATE_FORMAT)
  const queryDate = getDateFromQuery(location)
  const [isLoading, toggleLoading] = React.useState(true)

  React.useEffect(() => {
    document.title = 'Box Scores | Box-scores'
    const gameDate = queryDate == null ? dateStr : queryDate
    dispatchChangeDate(moment(gameDate, DATE_FORMAT).toDate()).then(() => {
      if (location.search !== '') {
        history.push({
          search: '',
        })
      }
      toggleLoading(false)
    })
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
        {isLoading ? (
          <Loader />
        ) : (
          <Wrapper>
            <Sidebar id={id} date={date} />
            <BoxScoresDetails id={id} date={date} />
          </Wrapper>
        )}
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
