import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Sidebar from '../Sidebar'
import BoxScoresDetails from '../BoxScoresDetails'
import { Wrapper } from './styles'

const BoxScores = ({ date: { date }, match }) => {
  React.useEffect(() => {
    document.title = 'Box Scores | Box-scores'
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
}

const mapStateToProps = ({ date }) => ({
  date,
})

export default withRouter(connect(mapStateToProps)(BoxScores))
