import format from 'date-fns/format'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import isSameMinute from 'date-fns/isSameMinute'
import browser, { checkLiveGame } from './utils/browser'
import getApiDate, { getLeagueYear } from './utils/getApiDate'
import { nearestMinutes, nextNearestMinutes } from './utils/time'
import { DATE_FORMAT } from './utils/constant'
import { sanitizeGames } from './utils/games'

// tracks any live game in the background
browser.alarms.create('live', {
  when: nextNearestMinutes(30, new Date()).valueOf(),
  periodInMinutes: 30,
})


const onClickListener = (notifId) => {
  browser.notifications.clear(notifId)
  browser.tabs.create({ url: '/index.html#/boxscores' })
}

const fireFavTeamNotificationIfNeeded = (games) => {
  console.log('fireFavTeamNotificationIfNeeded', games)
  browser.permissions.contains(
    {
      permissions: ['notifications'],
    },
    (hasNotificationPermission) => {
      if (!hasNotificationPermission) {
        return
      }
      const hasListener = browser.notifications.onClicked.hasListener(onClickListener)
      if (!hasListener) {
        browser.notifications.onClicked.addListener(onClickListener)
      }

      browser.getItem(['favTeam'], (data) => {
        if (data && data.favTeam) {
          const favTeamGame = games.find(({ home, visitor }) => home.abbreviation === data.favTeam || visitor.abbreviation === data.favTeam)
          console.log('fireFavTeamNotificationIfNeeded/favTeamGame', favTeamGame);
          if (favTeamGame) {
            // check start time is somewhat close to the now() time.
            const roundedDate = nearestMinutes(30, new Date())
            console.log('roundedDate', roundedDate)
            if (favTeamGame.startTimeUtc && isSameMinute(roundedDate, favTeamGame.startTimeUtc)) {
              const options = {
                type: 'basic',
                title: `${favTeamGame.home.nickname} vs ${favTeamGame.visitor.nickname}`,
                message: 'You favorite team is about to play.',
                iconUrl: 'assets/png/icon-2-color-512.png',
              }
              console.log('fireFavTeamNotificationIfNeeded/creating notification', options);

              browser.notifications.create(options)
            }
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
  const apiDate = getApiDate()
  const dateStr = format(apiDate, DATE_FORMAT)
  fetch(`http://data.nba.net/prod/v2/${dateStr}/scoreboard.json`)
    .then((res) => res.json())
    .then(({ games }) => {
      checkLiveGame(games, 2)
      if (!initCheck) {
        fireFavTeamNotificationIfNeeded(sanitizeGames(games, 2))
      }
    })
    .catch(() => {
      const year = getLeagueYear(apiDate)
      return fetch(`https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/${year}/scores/00_todays_scores.json`)
        .then((res) => res.json())
        .then(({ gs: { g } }) => {
          checkLiveGame(g, 1)
          // can't check with this endpoints because it does not have start time.
        })
    })
    .catch((error) => {
      console.error('something went wrong...', error)
    })
}

// immediately search for live game
liveListener(true)

browser.alarms.onAlarm.addListener((alarm) => {
  console.log('alarm', new Date())
  // when the chrome is reopened, alarms get ran even though the time has passed
  // if (moment(alarm.scheduledTime).diff(new Date(), 'seconds') < -10) {
  if (differenceInSeconds(alarm.scheduledTime, Date.now()) < -10) {
    return
  }

  if (alarm.name === 'live') {
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
      }
      browser.clear(() => {
        browser.setItem(newOptions)
      })
    })
  }
})
