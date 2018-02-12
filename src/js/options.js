'use strict'

$(function(){
    chrome.storage.local.get(['favTeam', 'nightMode'], function(data) {
        if (data) {
            $('#favTeams').val(data.favTeam)
            $('#night-mode-switch').prop('checked', data.nightMode)
        }
    })
    $('#submit').click(function() {
        const favTeam = $('#favTeams').val()
        const isNight = $('#night-mode-switch').is(":checked")
        chrome.storage.local.set({
            favTeam: favTeam,
            nightMode: isNight
        }, function() {
            $('#submit').text('Saved')
        })
    })
})
