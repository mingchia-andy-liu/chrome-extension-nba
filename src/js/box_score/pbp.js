const PBP = {}
/**
 * @param {object} play
 *   @field {object} content
 *   @field {object} cl
 */
const formatPBPRow = function(play) {
    const index = play.de.indexOf(']')
    const name = play.etype < 1 || play.etype > 9
        ? ''
        : play.de.substring(1,4)
    const color = getLogoColor(name)
    const style = `"color: white;background-color:${color}"`
    const logo = `<div style=${style}>${name}</div>`
    if (index > 4) {
        // score
        return `<tr><td>${play.cl}</td><td>${logo}</td><td class="u-text-bold">${play.de.substring(5,index)}</td><td class="u-text-bold u-color-green">${play.de.substring(index + 1)}</td></tr>`
    } else if (!play.de.includes('[')){
        // no team info
        return `<tr><td>${play.cl}</td><td></td><td></td><td>${play.de}</td></tr>`
    }
    return `<tr><td>${play.cl}</td><td>${logo}</td><td></td><td>${play.de.substring(index + 1)}</td></tr>`
}

const removePBP = function(showError) {
    $('#pbp').empty().append(HEADER_ROW).removeData('gid')
    $(`.c-quarter-btn`).each(function(index, el) {
        $(el).removeClass('active').removeClass('u-hide')
    })
    if (showError) {
        $('#pbp').append('<tr><td colspan="4">No Data Available</td></tr>')
    }
}

const showQuarter = function(gid, quarter) {
    const data = PBP[`${gid}`]
    // not started yet
    if (data === undefined || data.length === 0) {
        return
    }
    if (quarter === undefined) {
        quarter = data.length - 1
    }

    const qtrData = data[quarter]
    const $table = $('#pbp')
    // nothing to update
    if ($table.data('gid') === gid && qtrData.length === $table.children().length) {
        return
    }

    if (!qtrData || qtrData.length === 0) {
        removePBP()
        $table.append('<tr><td colspan="4">No Data Available</td></tr>')
    } else {
        let html = HEADER_ROW
        for (let i = 0; i < qtrData.length; i++) {
            html += formatPBPRow(qtrData[i])
        }
        $table.html(html)   // batch insert
    }

    $('.c-quarter-btn').each(function(i, el) {
        const $btn = $(el)
        if (i === quarter) {
            $btn.addClass('active').removeClass('u-hide')
        } else if (i > data.length - 1) {
            $btn.removeClass('active').addClass('u-hide')
        } else {
            $btn.removeClass('active').removeClass('u-hide')
        }
    })
    $table.data('gid', gid)
}

$('.c-quarter-btn').click(function(event) {
    showQuarter(window.location.hash.substring(1), parseInt(event.target.dataset.qtr) - 1)
})

const fetchPlayByPlay = function(gid) {
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage({request : 'pbp', gid: gid}, function (data) {
            if (data && data.g && data.g.pd.length !== 0) {
                let latest = 0;
                for (let i = 0; i < data.g.pd.length; i++) {
                    latest = data.g.pd[i].p > latest ? data.g.pd[i].p : latest
                    let index = data.g.pd[i].p - 1      // convert to 0 base
                    if (!PBP[gid]) {
                        PBP[gid] = []
                    }
                    if (!PBP[gid][index] || PBP[gid][index].length < data.g.pd[i].pla.length) {
                        PBP[gid][index] = data.g.pd[i].pla.reverse()
                    }
                }
                resolve(latest - 1)
            } else {
                reject()
            }
        })
    })
}
