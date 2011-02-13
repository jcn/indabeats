function getFlashMovie( movieName )
{
  return (navigator.appName.indexOf('Microsoft') != -1) ? window[movieName] : document[movieName];
}

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) { return ''; }
    return results[1] || '';
}