import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Sidebar from '../Sidebar'
import BoxScoresDetails from '../BoxScoresDetails'
import { Wrapper } from './styles'

const BoxScores = ({ date: { date } }) => {
  const { id = '' } = useParams()
  React.useEffect(() => {
    document.title = 'Box Scores | Box-scores'
  }, [])

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
}

const mapStateToProps = ({ date }) => ({
  date,
})

export default connect(mapStateToProps)(BoxScores)
