'use strict'

$(function(){
    chrome.storage.local.get(['favTeamStatus'], function(data) {
        if (data && data.favTeamStatus) {
            Object.keys(data.favTeamStatus).forEach(function(teamAbbr) {
                $(`#favTeams div input[value=${teamAbbr}]`).prop('checked', true)
            })
        }
    })
    $('#submit').click(function() {
        let favTeamStatus = {}
        $('.team:checkbox:checked').each(function() {
            favTeamStatus[$(this).val()] = 1
        })
        chrome.storage.local.set({
            favTeamStatus: favTeamStatus
        })
    })
})
