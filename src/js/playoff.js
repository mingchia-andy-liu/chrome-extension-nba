const generateTeamBlock = function(seed, name, score, color, losing) {
    const classes = losing
        ? 'c-playoff-serie-team u-loser'
        : 'c-playoff-serie-team'
    const inline = losing
        ? `background-color: ${color}; color: hsl(0, 0%, 60%);`
        : `background-color: ${color};`
    return `
        <div class="${classes}">
        <div class="c-playoff-serie-team__seed">[${seed}]</div>
        <div class="c-playoff-serie-team__team" style="${inline}">${name}</div>
        <div class="c-playoff-serie-team__score u-winner">${score}</div>
        </div>
    `
}

$(function() {
    if (CONFIG.nightMode) {
        $('body').toggleClass('u-dark-mode')
    }

    chrome.runtime.sendMessage({ request: 'playoff' }, function(data) {
        if (data && !data.failed) {
            const series = data.series
            console.log(series)
            series.forEach(element => {
                const bottom = element.bottomRow
                const top = element.topRow
                let content = ''
                if (bottom.teamId === '' && top.teamId === '') return
                if (top.teamId !== '') {
                    const topName = getTeamNameById(top.teamId)
                    const color = getLogoColor(topName)
                    const isLosing =
                        parseInt(bottom.wins) > parseInt(top.wins) &&
                        parseInt(bottom.wins) !== 0
                    content += generateTeamBlock(
                        top.seedNum,
                        topName,
                        top.wins,
                        color,
                        isLosing
                    )
                }
                if (bottom.teamId !== '') {
                    const bottomName = getTeamNameById(bottom.teamId)
                    const color = getLogoColor(bottomName)
                    const isLosing =
                        parseInt(bottom.wins) < parseInt(top.wins) &&
                        parseInt(top.wins) !== 0
                    content += generateTeamBlock(
                        bottom.seedNum,
                        bottomName,
                        bottom.wins,
                        color,
                        isLosing
                    )
                }

                const $serie = $(`#${element.seriesId}`).html(content)
                if (element.isGameLive) {
                    $serie.addClass('u-live').click(function() {
                        chrome.tabs.create({ url: '/box-score.html' })
                        window.close()
                    })
                }
            })
        }
    })
})
