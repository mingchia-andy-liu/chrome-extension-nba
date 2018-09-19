import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getTeamNameById, getLogoColorById } from '../utils/teams'
import { mediaQuery } from '../styles'


const StyledSerieColumn = styled.div`
    width: 15%;
    text-align: center;
`

const StyledSerie = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
    height: 18vh;
    min-height: 100px;
    font-size: calc(18px + 0.1vw);
    border-radius: 5px;
    border: ${(props) => (props.live
        ? '2px solid red'
        : '2px solid transparent')};
    color: white;

    ${mediaQuery`
        font-size: calc(12px);
    `}

`

const StyledSerieTeamRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    min-height: 50px;
    width: 100%;
    height: 50%;
    opacity: ${(props) => (props.winning ? '1' : '0.3') };
    background-color: ${(props) => (props.color ? props.color : '' )};
    ${mediaQuery`
        flex-direction: column;
    `}
`

const StyledSeries = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 90%;
`

const SerieTeamRow = ({ teamId, seedNum, wins, isSeriesWinner }) => (
    <StyledSerieTeamRow
        winning={isSeriesWinner}
        color={getLogoColorById(teamId)}
    >
        <div>{getTeamNameById(teamId)}({seedNum})</div>
        <div>{wins}</div>
    </StyledSerieTeamRow>
)

SerieTeamRow.propTypes = {
    teamId: PropTypes.string.isRequired,
    seedNum: PropTypes.string.isRequired,
    wins: PropTypes.string.isRequired,
    isSeriesWinner: PropTypes.bool.isRequired,
}

const renderSerie = ({ isGameLive, seriesId, topRow, bottomRow}) => (
    <StyledSerie live={isGameLive} key={seriesId}>
        {SerieTeamRow(topRow)}
        {SerieTeamRow(bottomRow)}
    </StyledSerie>
)

renderSerie.propTypes = {
    isGameLive: PropTypes.bool.isRequired,
    seriesId: PropTypes.string.isRequired,
    topRow: PropTypes.object.isRequired,
    bottomRow: PropTypes.object.isRequired,
}

class PlayoffColumn extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        series: PropTypes.any,
    }

    static defaultProps = {
        series: [],
    }

    render() {
        const { title, series } = this.props
        return (
            <StyledSerieColumn>
                <h3>{title}</h3>
                <StyledSeries>
                    {series.map(serie => renderSerie(serie))}
                </StyledSeries>
            </StyledSerieColumn>
        )
    }
}

export default PlayoffColumn
