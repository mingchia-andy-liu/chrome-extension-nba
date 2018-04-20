$(function(){
    if (CONFIG.nightMode) {
        $('body').toggleClass('u-dark-mode')
    }

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'https://stats.nba.com/stats/leaguestandingsv3?LeagueID=00&Season=2017-18&SeasonType=Regular+Season'
    }).done(function(data){
        const resultSet = data.resultSets[0]
        const headers = resultSet.headers
        const teams = resultSet.rowSet
        const east = teams.filter(function(team){
            return team[5] === 'East'
        })
        const west = teams.filter(function(team){
            return team[5] !== 'East'
        })
        const $eastern = $('#eastern')[0]
        const $western = $('#western')[0]
        $($eastern.rows[8]).find('td').addClass('u-8th-seed')
        $($western.rows[8]).find('td').addClass('u-8th-seed')
        for (let i = 1; i <= 15;i++) {
            if (east[i-1][8]) {
                $($eastern.rows[i].cells[0]).text(east[i-1][8].substring(east[i-1][8].indexOf('-')+2))
            } else {
                $($eastern.rows[i].cells[0]).text(i)
            }
            $($eastern.rows[i].cells[1]).text(east[i-1][4])
            $($eastern.rows[i].cells[2]).text(east[i-1][12])
            $($eastern.rows[i].cells[3]).text(east[i-1][13])
            $($eastern.rows[i].cells[4]).text(east[i-1][14])
            $($eastern.rows[i].cells[5]).text(east[i-1][37])
            $($eastern.rows[i].cells[6]).text(east[i-1][17])
            $($eastern.rows[i].cells[7]).text(east[i-1][18])
            $($eastern.rows[i].cells[8]).text(east[i-1][19])
            if (east[i-1][35] > 0) {
                $($eastern.rows[i].cells[9]).text(`W ${east[i-1][35]}`)
            } else {
                $($eastern.rows[i].cells[9]).text(`L ${Math.abs(east[i-1][35])}`)
            }
            $($eastern.rows[i].cells[10]).text(east[i-1][56])
            $($eastern.rows[i].cells[11]).text(east[i-1][57])
            $($eastern.rows[i].cells[12]).text(east[i-1][58])

            if (west[i-1][8]) {
                $($western.rows[i].cells[0]).text(west[i-1][8].substring(west[i-1][8].indexOf('-')+2))
            } else {
                $($western.rows[i].cells[0]).text(i)
            }
            $($western.rows[i].cells[1]).text(west[i-1][4])
            $($western.rows[i].cells[2]).text(west[i-1][12])
            $($western.rows[i].cells[3]).text(west[i-1][13])
            $($western.rows[i].cells[4]).text(west[i-1][14])
            $($western.rows[i].cells[5]).text(west[i-1][37])
            $($western.rows[i].cells[6]).text(west[i-1][17])
            $($western.rows[i].cells[7]).text(west[i-1][18])
            $($western.rows[i].cells[8]).text(west[i-1][19])
            if (west[i-1][35] > 0) {
                $($western.rows[i].cells[9]).text(`W ${west[i-1][35]}`)
            } else {
                $($western.rows[i].cells[9]).text(`L ${Math.abs(west[i-1][35])}`)
            }
            $($western.rows[i].cells[10]).text(west[i-1][56])
            $($western.rows[i].cells[11]).text(west[i-1][57])
            $($western.rows[i].cells[12]).text(west[i-1][58])
        }

        let min = Infinity
        let max = -Infinity
        let minIndex = -1
        let maxIndex = -1
        const resetMinMax = function() {
            min = Infinity
            max = -Infinity
            minIndex = -1
            maxIndex = -1
        }
        const findMinMax = function(index, el) {
            const val = parseFloat(el.textContent)
            if (val > max) {
                max = val
                maxIndex = index
            } else if (val < min) {
                min = val
                minIndex = index
            }
        }
        const greenColor = '#00bb00'
        const redColor = 'red'

        $('#eastern tr > td:nth-child(11)').each(findMinMax)
        $(`#eastern tr:nth-child(${maxIndex+1}) > td:nth-child(11)`).css('color',greenColor)
        $(`#eastern tr:nth-child(${minIndex+1}) > td:nth-child(11)`).css('color',redColor)
        resetMinMax()
        $('#eastern tr > td:nth-child(12)').each(findMinMax)
        $(`#eastern tr:nth-child(${maxIndex+1}) > td:nth-child(12)`).css('color',redColor)
        $(`#eastern tr:nth-child(${minIndex+1}) > td:nth-child(12)`).css('color',greenColor)
        resetMinMax()
        $('#eastern tr > td:nth-child(13)').each(findMinMax)
        $(`#eastern tr:nth-child(${maxIndex+1}) > td:nth-child(13)`).css('color',greenColor)
        $(`#eastern tr:nth-child(${minIndex+1}) > td:nth-child(13)`).css('color',redColor)
        resetMinMax()

        $('#western tr > td:nth-child(11)').each(findMinMax)
        $(`#western tr:nth-child(${maxIndex+1}) > td:nth-child(11)`).css('color',greenColor)
        $(`#western tr:nth-child(${minIndex+1}) > td:nth-child(11)`).css('color',redColor)
        resetMinMax()
        $('#western tr > td:nth-child(12)').each(findMinMax)
        $(`#western tr:nth-child(${maxIndex+1}) > td:nth-child(12)`).css('color',redColor)
        $(`#western tr:nth-child(${minIndex+1}) > td:nth-child(12)`).css('color',greenColor)
        resetMinMax()
        $('#western tr > td:nth-child(13)').each(findMinMax)
        $(`#western tr:nth-child(${maxIndex+1}) > td:nth-child(13)`).css('color',greenColor)
        $(`#western tr:nth-child(${minIndex+1}) > td:nth-child(13)`).css('color',redColor)
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log('Failed to fetch data.');
    });
});
