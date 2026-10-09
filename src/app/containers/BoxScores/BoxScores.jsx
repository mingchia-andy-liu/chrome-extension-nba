import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Sidebar from '../Sidebar'
import BoxScoresDetails from '../BoxScoresDetails'
import { Wrapper } from './styles'
import { selectDate } from '../DatePicker/dateSlice'

const BoxScores = () => {
  const { id = '' } = useParams()
  const date = useSelector(selectDate)
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

export default BoxScores
