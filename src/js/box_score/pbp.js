const PBP_OBJ = {
    d: 0,
    gid: '',
    play: []
}

/**
 * @param {object} content
 * @param {string} cl
 * @param {number} etype
 *  @example 1
 */
const formatPBPRow = function(play) {
    const index = play.de.indexOf(']')
    if (index > 4) {
        return `<tr><td>${play.cl}</td><td class="u-text-bold">${play.de.substring(5,index)}</td><td class="u-color-green">${play.de.substring(index + 1)}</td></tr>`
    }
return `<tr><td>${play.cl}</td><td></td><td>${play.de.substring(index + 1)}</td></tr>`
}
const fetchPlayByPlay = function(gid) {
    const $table = $('#pbp')
    $table.empty().append('<tr><th>Clock</th><th>Score</th><th>Event Detail</th></tr>')
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage({request : 'pbp', gid: gid}, function (data) {
            console.log(data)
            if (data && data.g && data.g.pd) {

                for (let i = 0; i < data.g.pd.length; i++) {
                    for (let j = 0; j < data.g.pd[i].pla.length; j++) {
                        $table.append(formatPBPRow(data.g.pd[i].pla[j]));
                    }
                }
            }
        })
    })
}
