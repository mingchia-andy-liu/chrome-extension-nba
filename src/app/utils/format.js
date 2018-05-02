export const gamesAPI = JSON.parse(`{"gs":{"mid":1525233249537,"gdte":"2018-05-01","next":"http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores","g":[{"gid":"0041700232","gcode":"20180501/NOPGSW","p":2,"st":2,"stt":"Halftime","cl":"00:00.0","seq":0,"lm":{"gdte":"2018-04-28","gres":"GSW won 101-123","seri":"GSW leads series 1-0","gid":"0041700231"},"v":{"ta":"NOP","q1":29,"s":55,"q2":26,"q3":0,"q4":0,"ot1":0,"ot2":0,"ot3":0,"ot4":0,"ot5":0,"ot6":0,"ot7":0,"ot8":0,"ot9":0,"ot10":0,"tn":"Pelicans","tc":"New Orleans","tid":1610612740},"h":{"ta":"GSW","q1":27,"s":58,"q2":31,"q3":0,"q4":0,"ot1":0,"ot2":0,"ot3":0,"ot4":0,"ot5":0,"ot6":0,"ot7":0,"ot8":0,"ot9":0,"ot10":0,"tn":"Warriors","tc":"Golden State","tid":1610612744}},{"gid":"0041700201","gcode":"20180501/CLETOR","p":5,"st":3,"stt":"Final","cl":"00:00.0","seq":0,"lm":{"gdte":"","gres":"","seri":"","gid":""},"v":{"ta":"CLE","q1":19,"s":113,"q2":38,"q3":25,"q4":23,"ot1":8,"ot2":0,"ot3":0,"ot4":0,"ot5":0,"ot6":0,"ot7":0,"ot8":0,"ot9":0,"ot10":0,"tn":"Cavaliers","tc":"Cleveland","tid":1610612739},"h":{"ta":"TOR","q1":33,"s":112,"q2":27,"q3":27,"q4":18,"ot1":7,"ot2":0,"ot3":0,"ot4":0,"ot5":0,"ot6":0,"ot7":0,"ot8":0,"ot9":0,"ot10":0,"tn":"Raptors","tc":"Toronto","tid":1610612761}}]}}`)

export const formatGames = (games) => {
    return games.map(element => {

        return {
            ...element,
            series: element.lm.seri,
            hta: element.h.ta,
            htn: element.h.tn,
            hs: element.h.s,
            vta: element.v.ta,
            vtn: element.v.tn,
            vs: element.v.s,
        }
    })
}

export const formatClock = (clock, status) => {
    if (status.includes('Halftime') || status.includes('Tipoff') || status.includes('Final')) {
        // game started, clock stopped
        return status
    } else if (status === 'PPD') {
        //PPD mean postponed
        return 'Postponed'
    } else if (status.includes('Start') || status.includes('End')) {
        var statusArray = status.split(' ')
        if (status.includes('Qtr')) {
            return statusArray[0] + ' of Q' + statusArray[2].charAt(0)
        } else {
            return statusArray[0] + ' of OT' + statusArray[2].charAt(0)
        }
    } else if (status && status.includes('Qtr')) {
        // game started being played over regular time
        return 'Q' + status.charAt(0) + ' ' + clock
    } else if (status && status.includes('OT')) {
        // game start being played over over time
        return 'OT' + status.charAt(0) + ' ' + clock
    }
    return clock
}
