import browser from './browser'

export const nearestMinutes = (interval, momentDate) => {
    const roundedMinutes = Math.round(momentDate.minute() / interval) * interval
    return momentDate.clone().minute(roundedMinutes).second(0)
}

export const nextNearestMinutes = (interval, momentDate) => {
    const roundedMinutes = Math.ceil(momentDate.minute() / interval) * interval
    return momentDate.clone().minute(roundedMinutes).second(0)
}

export const checkLiveGame = (games) => {
    const hasLiveGame = games.find(game =>
        game && game.period_time && game.period_time.game_status === '2'
    )
    if (hasLiveGame) {
        browser.setBadgeText({ text: 'live' })
        browser.setBadgeBackgroundColor({ color: '#FC0D1B' })
    } else {
        browser.setBadgeText({ text: '' })
    }
}
