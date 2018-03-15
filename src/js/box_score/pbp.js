const PBP = {}
const headerRow = '<tr><th>Clock</th><th>Team</th><th>Score</th><th>Play</th></tr>'
let quarter = 0
/**
 * @param {object} play
 *   @param {object} content
 *   @param {string} cl
 */
const formatPBPRow = function(play) {
    const index = play.de.indexOf(']')
    const name = play.etype < 1 || play.etype > 9
        ? ''
        : play.de.substring(1,4)
    const color = LOGO_COLORS[name] || '#000000'
    const style = `"color: white;background-color:${color}"`
    const logo = `<div style=${style}>${name}</div>`
    if (index > 4) {
        return `<tr><td>${play.cl}</td><td>${logo}</td><td class="u-text-bold">${play.de.substring(5,index)}</td><td class="u-text-bold u-color-green">${play.de.substring(index + 1)}</td></tr>`
    }
    return `<tr><td>${play.cl}</td><td>${logo}</td><td></td><td>${play.de.substring(index + 1)}</td></tr>`
}

const showQuarter = function(gid, quarter) {
    const data = PBP[`${gid}`]
    // not started yet
    if (data === undefined) return
    if (quarter === undefined) {
        quarter = data.length - 1
    }
    const qtrData = data[quarter]
    const $table = $('#pbp')
    $table.empty().append(headerRow)
    if (!qtrData || qtrData.length === 0) {
        $table.append('<tr><td colspan="4">No Data Available</td></tr>')
    } else {
        for (let i = 0; i < qtrData.length; i++) {
            $table.append(formatPBPRow(qtrData[i]))
        }
    }
    for (let i = 0; i < 14; i++) {
        if (i === quarter){
            $(`.c-quarter-btn[data-qtr=${i + 1}]`).addClass('active')
        } else {
            $(`.c-quarter-btn[data-qtr=${i + 1}]`).removeClass('active')
        }
    }
    $('.c-quarter-btn').each(function(index, el) {
        if (index >= data.length) {
            $(el).addClass('u-hide')
        } else {
            $(el).removeClass('u-hide')
        }
    })
}

$('.c-quarter-btn').click(function(event) {
    showQuarter(window.location.hash.substring(1), parseInt(event.target.dataset.qtr) - 1)
})

const fetchPlayByPlay = function(gid) {
    const $table = $('#pbp')
    $table.empty().append(headerRow)
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage({request : 'pbp', gid: gid}, function (data) {
            if (data && data.g && data.g.pd) {
                for (let i = 0; i < data.g.pd.length; i++) {
                    let index = data.g.pd[i].p - 1      // convert to 0 base
                    if (!PBP[gid]) {
                        PBP[gid] = []
                    }
                    if (!PBP[gid][index] || PBP[gid][index].length < data.g.pd[i].pla.length) {
                        PBP[gid][index] = data.g.pd[i].pla.reverse()
                    }
                }
                showQuarter(gid)
            }
        })
    })
}
