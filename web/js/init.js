var IndaBeatsSettings = {
  gridSize: 16
};

var AUDIOPLAYER_READY = AUDIOPLAYER_READY && getFlashMovie('audioplayer').ready();

var audioplayer_swf_options = {
  flashvars:  {
    player_ready_callback:  'playerReady_handler',
    error_callback:         'songError_handler',
    complete_callback:      'songEnded_handler',
    progress_callback:      'songProgress_handler',
    started_callback:       'songStarted_handler',
    stopped_callback:       'songStopped_handler',
    paused_callback:        'songPaused_handler',
    resumed_callback:       'songResumed_handler'
  },
  params:     {},
  attributes: {}
};

swfobject.embedSWF('flash/audioplayer.swf', 'audioplayer', '1', '1', '10.0.0', false, audioplayer_swf_options.flashvars, audioplayer_swf_options.params, audioplayer_swf_options.attributes);


if ($('#sequencer')) {
  
  $(document).ready(function(){
    if (AUDIOPLAYER_READY) {
      IndaBeatsSequencer.init('#sequencer', IndaBeatsSettings);
    }
  });
  
}

function playerReady_handler( response ){
  if( !AUDIOPLAYER_READY ){
    AUDIOPLAYER_READY = true;
    IndaBeatsSequencer.init('#sequencer', IndaBeatsSettings);
  }
}