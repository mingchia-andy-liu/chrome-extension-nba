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


class BoxScores extends React.PureComponent {
    static propTypes = {
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

    constructor(props) {
        super(props)

        const {
            date: {date},
        } = this.props
        const dateStr = moment(date).format(DATE_FORMAT)
        const queryDate = getDateFromQuery(this.props)

        this.state = {
            isLoading: true,
            date: queryDate == null ? dateStr : queryDate,
        }

        document.title = 'Box Scores | Box-scores'
    }

    componentDidMount() {
        const { date } = this.state
        // TODO: when sync store, read the proper date from the localStorage
        this.props.dispatchChangeDate(moment(date, DATE_FORMAT).toDate()).then(() => {
            if (this.props.location.search !== '') {
                this.props.history.push({
                    search: '',
                })
            }
            this.setState({
                isLoading: false,
            })
        })
    }

    getIdFromProps = () => {
        return this.props.match.params.id || ''
    }

    render() {
        const id = this.getIdFromProps()
        const {date: {date}} = this.props
        const {isLoading} = this.state

        return (
            <Layout>
                <Layout.Header><Header index={0}/></Layout.Header>
                <Layout.Content>
                    {
                        isLoading
                            ? <Loader />
                            : (
                                <Wrapper>
                                    <Sidebar id={id} date={date}/>
                                    <BoxScoresDetails id={id} date={date}/>
                                </Wrapper>
                            )
                    }
                </Layout.Content>
            </Layout>
        )
    }
}

const mapStateToProps = ({ date }) => ({
    date,
})


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchChangeDate,
    }, dispatch)
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BoxScores))
