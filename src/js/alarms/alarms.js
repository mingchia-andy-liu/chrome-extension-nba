// --- Alarms ---
chrome.alarms.create('minuteAlarm', {
    delayInMinutes : 1,
    periodInMinutes : 1
})

chrome.alarms.create('scheduleAlarm', {
    delayInMinutes : 60,
    periodInMinutes : 60
})

chrome.alarms.create('liveAlarm', {
    delayInMinutes : 30,
    periodInMinutes : 30
})
