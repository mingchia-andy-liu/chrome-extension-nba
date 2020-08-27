import format from 'date-fns/format'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import browser, { checkLiveGame } from './utils/browser'
import getApiDate, { getLeagueYear } from './utils/getApiDate'
import { nextNearestMinutes } from './utils/time'
import { DATE_FORMAT } from './utils/constant'

// tracks any live game in the background
browser.alarms.create('live', {
  when: nextNearestMinutes(30, new Date()).valueOf(),
  periodInMinutes: 30,
})

// const fireFavTeamNotificationIfNeeded = (games) => {
//     browser.getItem(['favTeam'], (data) => {
//         if (data && data.favTeam) {
//             const favTeamGame = games.find(({home, visitor}) => home.team_key === data.favTeam || visitor.team_key === data.favTeam)
//             if (favTeamGame) {
//                 const format = 'HHmm'
//                 const roundedDate = nearestMinutes(30, moment()).format(format)
//                 const favTeamMoment = moment.tz(favTeamGame.time, format, EST_IANA_ZONE_ID).local()

//                 if (roundedDate === favTeamMoment.format(format)) {
//                     const options = {
//                         type: 'basic',
//                         title: 'You favourite team is about to play',
//                         message: `${favTeamGame.home.abbreviation} vs ${favTeamGame.visitor.abbreviation} @ ${favTeamMoment.format('hh:mm A')}`,
//                         iconUrl: 'assets/png/icon-2-color-512.png',
//                     }

//                     browser.notifications.create(options)
//                 }
//             }
//         }
//     })
// }

const liveListener = () => {
  const apiDate = getApiDate()
  const dateStr = format(apiDate, DATE_FORMAT)
  // fetch(
  //   `https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`
  // )
  //   .then((res) => res.json())
  //   .then((data) => {
  //     const {
  //       sports_content: {
  //         games: { game: live },
  //       },
  //     } = data

  //     // if (!initCheck) {
  //     //     fireFavTeamNotificationIfNeeded(live)
  //     // }

  //     checkLiveGame(live)
  //   })
  //   .catch(() => {
  //     return
  fetch(`http://data.nba.net/prod/v2/${dateStr}/scoreboard.json`)
    .then((res) => res.json())
    .then(({ games }) => checkLiveGame(games, 2))
    .catch(() => {
      const year = getLeagueYear(apiDate)
      return fetch(
        `https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/${year}/scores/00_todays_scores.json`
      )
        .then((res) => res.json())
        .then(({ gs: { g } }) => {
          checkLiveGame(g, 1)
        })
    })
  // })
  // .catch(() => browser.setBadgeText({ text: '' }))
}

// immediately search for live game
liveListener()

browser.alarms.onAlarm.addListener((alarm) => {
  // when the chrome is reopened, alarms get ran even though the time has passed
  // if (moment(alarm.scheduledTime).diff(new Date(), 'seconds') < -10) {
  if (differenceInSeconds(alarm.scheduledTime, Date.now()) < -10) {
    return
  }

  if (alarm.name === 'live') {
    liveListener()
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
