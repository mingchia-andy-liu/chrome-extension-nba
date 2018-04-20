$(function() {
    'use strict'
    chrome.storage.local.get(['favTeam', 'nightMode', 'broadcast'], function(data) {
        if (data) {
            $('#favTeams').val(data.favTeam)
            $('#night-mode-switch').prop('checked', data.nightMode)
            $('#us-broadcast').prop('checked', data.broadcast)
            if (data.nightMode) {
                $('body').addClass('u-dark-mode')
            }
        }
    })

    $('#night-mode-switch').change(function() {
        $('body').toggleClass('u-dark-mode')
    })

    $('#submit').click(function() {
        const favTeam = $('#favTeams').val()
        const isNight = $('#night-mode-switch').is(':checked')
        const broadcast = $('#us-broadcast').is(':checked')
        chrome.storage.local.set(
            {
                favTeam: favTeam,
                nightMode: isNight,
                broadcast: broadcast
            },
            function() {
                $('#submit').text('Saved')
            }
        )
    })
})
