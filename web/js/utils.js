function getFlashMovie( movieName )
{
  return (navigator.appName.indexOf('Microsoft') != -1) ? window[movieName] : document[movieName];
}