import browser from './browser'
import isSameMinute from 'date-fns/isSameMinute'

// const ding = new Audio('./assets/ding.wav')
const getOptions = (title, message) => ({
  type: 'basic',
  title: title,
  message: message,
  iconUrl: 'assets/png/icon-2-color-512.png',
})

const fireNotificationForGame = (options, gameId, dateStr, status) => {
  browser.notifications.getAll((notifications) => {
    // only fire if we have not send a notification
    if (!notifications[gameId]) {
      const id = `${gameId}?date=${dateStr}&st=${status}`
      browser.notifications.create(id, options)
      if (browser.isChrome) {
        // ding.play()
      }
    }
  })
}

/**
 * status should be number
 * 1: start of game
 * 10: 1st quarter
 * 20: 2nd quarter
 * 30: halftime
 * 40: 3rd quarter
 * 50: 4th quarter
 * 60: ot1
 * ...
 * 150: ot10
 * 1000: end of game
 */
const fireMap = {
  1: (game, favTeam, dateStr) => {
    if (
      game.startTimeUTC &&
      isSameMinute(new Date(), new Date(game.startTimeUTC))
    ) {
      const options = getOptions(
        `${game.visitor.nickname} @ ${game.home.nickname}`,
        'Your favorite team is about to play.'
      )
      fireNotificationForGame(options, game.id, dateStr, 1)
      return true
    }
    return false
  },
  10: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '1'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 1st Quarter.'
      )
      fireNotificationForGame(options, game.id, dateStr, 10)
      return true
    }
    return false
  },
  20: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '2'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 2nd Quarter.'
      )
      fireNotificationForGame(options, game.id, dateStr, 20)
      return true
    }
    return false
  },
  30: (game, favTeam, dateStr) => {
    if (game.periodTime.periodStatus === 'Halftime') {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is at halftime.'
      )
      fireNotificationForGame(options, game.id, dateStr, 30)
      return true
    }
    return false
  },
  40: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '3'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 3rd Quarter.'
      )
      fireNotificationForGame(options, game.id, dateStr, 40)
      return true
    }
    return false
  },
  50: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '4'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 4th Quarter.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  60: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '5'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 1st OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  70: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '6'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 2nd OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  80: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '7'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 3rd OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  90: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '8'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 4th OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  100: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '9'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 5th OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  110: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '10'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 6th OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  120: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '11'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 7th OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  130: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '12'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 8th OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  140: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '13'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 9th Quarter.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  150: (game, favTeam, dateStr) => {
    if (
      game.periodTime.gameStatus === '2' &&
      game.periodTime.periodValue === '14'
    ) {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        'Your favorite team is starting 10th OT.'
      )
      fireNotificationForGame(options, game.id, dateStr, 50)
      return true
    }
    return false
  },
  1000: (game, favTeam, dateStr) => {
    if (game.periodTime.gameStatus === '3') {
      const options = getOptions(
        `${game.visitor.nickname} ${game.visitor.score} @ ${game.home.nickname} ${game.home.score}`,
        "Your favorite team's game has ened."
      )
      fireNotificationForGame(options, game.id, dateStr, 1000)
      return true
    }
    return false
  },
}

const fullOrder = [
  1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 1000,
]
const simpleOrder = [1, 1000]

export const fireNotificationIfNeeded = (
  game,
  notification,
  favTeams,
  dateStr
) => {
  if (notification == null || !notification.enabled) {
    return
  }

  const status =
    notification && notification.games && notification.games[game.id] != null
      ? notification.games[game.id].status
      : undefined

  let didFire = false
  let notifiHandler = null

  const order = notification.quarters ? fullOrder : simpleOrder

  if (status == null) {
    // need to iterate through all from the back for a new game
    for (let i = order.length - 1; i >= 0; i--) {
      const o = order[i]

      didFire = fireMap[o](game, favTeams, dateStr)
      if (didFire) {
        notifiHandler = o
        break
      }
    }
  } else {
    notifiHandler = order.findIndex((value) => status < value)
    // all fired
    if (notifiHandler === -1) {
      return [false, -1]
    }

    for (let i = notifiHandler; i < order.length; i++) {
      const o = order[i]
      didFire = fireMap[o](game, favTeams, dateStr)
      if (didFire) {
        notifiHandler = o
        break
      }
    }
  }

  return [didFire, notifiHandler]
}
