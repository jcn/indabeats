var IndaBeatsSettings = {
  gridSize: 16,
  source_id: $.urlParam('id')
};

var AUDIOPLAYER_READY = AUDIOPLAYER_READY && getFlashMovie('audioplayer').ready();

var audioplayer_swf_options = {
  flashvars:  {
    player_ready_callback:  'playerReady_handler'
  },
  params:     {},
  attributes: {}
};

swfobject.embedSWF('flash/audioplayer.swf', 'audioplayer', '1', '1', '10.0.0', false, audioplayer_swf_options.flashvars, audioplayer_swf_options.params, audioplayer_swf_options.attributes);
  
$(document).ready(function(){
  if (AUDIOPLAYER_READY && !IndaBeatsSequencer.initialized && $('#sequencer')) {
    IndaBeatsSequencer.init('#sequencer', IndaBeatsSettings);
  }
});

function playerReady_handler( response ){
  if(!AUDIOPLAYER_READY && !IndaBeatsSequencer.initialized && $('#sequencer')){
    AUDIOPLAYER_READY = true;
    IndaBeatsSequencer.init('#sequencer', IndaBeatsSettings);
  }
}
