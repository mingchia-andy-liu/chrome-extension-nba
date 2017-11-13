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
            console.log($(this).val())
            favTeamStatus[$(this).val()] = 1
        })
        const favTeamName = $('#favouriteTeam :selected').text()
        chrome.storage.local.set({
            favTeamStatus: favTeamStatus
        }, function(){
            $('#status').text(`Your favourite team is ${favTeamName}`)
        })
    })
})
