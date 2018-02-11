// --- Alarms ---
chrome.alarms.create('minuteAlarm', {
    delayInMinutes : 1,
    periodInMinutes : 1
});

chrome.alarms.create('scheduleAlarm', {
    delayInMinutes : 60,
    periodInMinutes : 60   // periodical time
});

chrome.alarms.create('liveAlarm', {
    delayInMinutes : 1,
    periodInMinutes : 30   // periodical time
});

chrome.alarms.create('notificationSetUpAlarm', {
    /**
     * At every 00:00 am in the morning, refresh the notification alarms
     */
    when : moment().hour(0).minute(35).second(0).valueOf(),
    periodInMinutes : 60 * 24 // 24 hr in minutes
    // periodInMinutes : 5 // 24 hr in minutes
})
