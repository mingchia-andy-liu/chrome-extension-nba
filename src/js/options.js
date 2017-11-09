'use strict';

$(function(){
    chrome.storage.local.get(['favTeam'], function(data) {
        if (data && data.favTeam) {
            const favTeamName = $(`#favouriteTeam option[value=${data.favTeam}]`).attr("selected", "selected").text()
            $('#status').text(`Your favourite team is ${favTeamName}`)
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
