import format from 'date-fns/format'
import addMinutes from 'date-fns/addMinutes'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import setSeconds from 'date-fns/setSeconds'
import browser, { checkLiveGame } from './utils/browser'
import getApiDate, { getLeagueYear, isOffseason } from './utils/getApiDate'
import { DATE_FORMAT } from './utils/constant'
import { sanitizeGames } from './utils/games'
import { fireNotificationIfNeeded } from './utils/notifications'

// tracks any live game in the background
browser.alarms.create('minute', {
  when: setSeconds(addMinutes(Date.now(), 1), 0).valueOf(),
  periodInMinutes: 1,
})

const onClickListener = (notifId) => {
  browser.notifications.clear(notifId)
  browser.tabs.create({ url: '/index.html#/boxscores/' + notifId })
}

const fireFavTeamNotificationIfNeeded = (games) => {
  browser.permissions.contains(
    {
      permissions: ['notifications'],
    },
    (hasNotificationPermission) => {
      if (!hasNotificationPermission) {
        return
      }
      const apiDate = getApiDate()
      const dateStr = format(apiDate, DATE_FORMAT)
      const hasListener =
        browser.notifications.onClicked.hasListener(onClickListener)
      if (!hasListener) {
        browser.notifications.onClicked.addListener(onClickListener)
      }

      browser.getItem(['favTeam', 'notification'], (data) => {
        if (data && data.favTeam) {
          const favTeamGame = games.find(
            ({ home, visitor }) =>
              home.abbreviation === data.favTeam ||
              visitor.abbreviation === data.favTeam
          )
          if (favTeamGame) {
            // check start time is somewhat close to the now() time.
            fireNotificationIfNeeded(
              favTeamGame,
              data.notification,
              data.favTeam,
              dateStr
            )
          }
        }
      })
    }
  )
}

/**
 *
 * @param {boolean} initCheck: if true, skip the notification because it's not from alarm source.
 */
const liveListener = (initCheck) => {
  if(isOffseason()) {
    return;
  }

  const apiDate = getApiDate()
  const dateStr = format(apiDate, DATE_FORMAT)
  const year = getLeagueYear(apiDate)

  // cdn
  fetch(
    'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json'
  )
    .then((res) => res.json())
    .then(({ scoreboard: { games } }) => {
      checkLiveGame(games, 3)
      if (!initCheck) {
        fireFavTeamNotificationIfNeeded(sanitizeGames(games, 3))
      }
    })
    // data
    .catch((e) => {
      // console.log(e);
      return (
        fetch(`http://data.nba.net/prod/v2/${dateStr}/scoreboard.json`)
          .then((res) => res.json())
          .then(({ games }) => {
            checkLiveGame(games, 2)
            if (!initCheck) {
              fireFavTeamNotificationIfNeeded(sanitizeGames(games, 2))
            }
          })
          // old
          .catch(() => {
            return fetch(
              `https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/${year}/scores/00_todays_scores.json`
            )
              .then((res) => res.json())
              .then(({ gs: { g } }) => {
                checkLiveGame(g, 1)
                // can't check with this endpoints because it does not have start time.
              })
          })
      )
    })
    // final catch
    .catch((error) => {
      console.error('something went wrong...', error)
    })
}

// immediately search for live game
liveListener(false)

browser.alarms.onAlarm.addListener((alarm) => {
  // console.log('alarm', new Date())
  // when the chrome is reopened, alarms get ran even though the time has passed
  if (differenceInSeconds(alarm.scheduledTime, Date.now()) < -10) {
    return
  }

  if (alarm.name === 'minute') {
    liveListener(false)
  }
})

// this will reload the background explicitly to trigger an update as soon as possible if available
browser.runtime.onUpdateAvailable.addListener(() => {
  browser.runtime.reload()
})

// Add a listener for loading up the changelog on Major/Minor update, not patches.
browser.runtime.onInstalled.addListener((details) => {
  const currentVersion = browser.runtime.getManifest().version
  const previousVersion = details.previousVersion
  if (details.reason === 'update') {
    // only open the options page iff it's major and minor updates
    const currentSplit = currentVersion.split('.')
    const previousSplit = previousVersion.split('.')
    if (
      currentSplit[0] !== previousSplit[0] ||
      currentSplit[1] !== previousSplit[1]
    ) {
      browser.tabs.create({ url: '/index.html#/changelog' })
    }

    // Get rid of the old data
    // TODO: remove this after few versions
    browser.getAll((data) => {
      const newOptions = {
        broadcast: data.broadcast,
        favTeam: data.favTeam,
        hideZeroRow: data.hideZeroRow,
        nightMode: data.nightMode,
        spoiler: data.spoiler,
        notification: data.notification,
      }
      browser.clear(() => {
        browser.setItem(newOptions)
      })
    })
  }
})
