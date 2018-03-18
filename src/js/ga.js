(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-114000944-1', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check @see https://stackoverflow.com/a/22152353
ga('require', 'displayfeatures');
ga('send', 'pageview',location.pathname);


function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}

window.uuid = window.uuid || s4() + '.' + s4()
$.ajax({
    type: 'POST',
    url: 'https://www.google-analytics.com/collect?v=1&cid=' + uuid + '&tid=UA-114000944-1&t=pageview&dp=' + location.pathname,
}).fail(function(xhr, textStatus, errorThrown) {
    console.log('Failed to send report to ga');
});
