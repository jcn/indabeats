var IndaBeatsSequencer = {
  
  initialized: false,
  
  cells: [],
  row_samples:  [],
  
  active_column: -1,
  column_count: 16,
  row_count: null,
  
  interval_id: null,
  interval : 300,
  
  playing: false,
  
  key_pressed: { space: false, c: false, r: false },
  
  handlers_set: false,

  init: function( element, options ) {
    
    this.initialized = true;
    
    this.element = $(element);
    this.options = options;
    
    this.init_grid();
    
    this.audioplayer = getFlashMovie('audioplayer');
    
    this.set_meta_links();
    
    $.get('/request_samples?id=' + $.urlParam('id'), function(data) {
      IndaBeatsSequencer.source_id = data.source_id;
      IndaBeatsSequencer.poll_for_samples(data.poll_url);
      $.get(data.metadata_url, function(data) {
        IndaBeatsSequencer.set_meta_links(data);
      });
    });
  },
  
  set_meta_links: function(data) {
    if(!data) {
      data = {
        song: { 
          link: '#',
          name: 'Loading...',
          owner: { url: '#', name: 'Loading...' }
        }
      };
    }
    $('#song_link').attr('href', data.song.link).html(data.song.name);
    $('#person_link').attr('href', data.song.owner.url).html(data.song.owner.name);
  },

  poll_for_samples: function(url) {
    $.get(url)
      .success(function(data) { IndaBeatsSequencer.init_samples(data); })
      .error(function() {
        setTimeout(function() { IndaBeatsSequencer.poll_for_samples(url); }, 4000);
      });
  },

  init_grid: function(samples) {
    this.element.empty();
    
    this.row_count = (samples ? samples.length : 16);
    
    for (var i = 0; i < this.column_count; i++)
    {
      var column = $('<div></div>').addClass('column').attr({ id: 'column_'+i });
      this.cells[i] = [];
      for (var j = 0; j < this.row_count; j++)
      {
        column.append( $('<a>#</a>').addClass('cell').attr({ id: 'cell_'+i+'_'+j, 'data-channel': j }) );
        this.cells[i][j] = false;
        if (samples) {
          this.row_samples[j] = {
            'uuid':i+'_'+j,
            'name':i+'_'+j,
            'path':'samples/' + this.source_id + '/' + samples[j],
            'channel': j
          };
          this.audioplayer.load( this.row_samples[j] );
        }
      }
      this.element.append(column);
    }
   
    if(!this.handlers_set){
      this.handlers_set = true;
      this.element.click(this.clickHandler);
      $(document).keyup(this.keyUpHandler).keydown(this.keyDownHandler);
      $(window).resize(this.size_everything);
    }
    
    this.size_everything();
  },
  
  init_samples: function(samples) {
    IndaBeatsSequencer.init_grid(samples);
  },

  size_everything: function() {
    WINDOW_WIDTH = $(window).width() - 25;
    WINDOW_HEIGHT = $(window).height() - 135; //account for credit header
    PADDING = 5;
    
    cell_width = WINDOW_WIDTH / IndaBeatsSettings.gridSize - 1;
    cell_height = WINDOW_HEIGHT / IndaBeatsSettings.gridSize;

    $("#sequencer")[0].style.width = WINDOW_WIDTH + "px";
    $(".column").each(function(index, el) {
      // el.style.width = cell_width + "px";
    });
    $(".cell").each(function(index, el) {
      el.style.width = cell_width - (PADDING * 2) + "px";
      el.style.height = cell_height - PADDING + "px";
      el.style.margin = "0px "+PADDING+"px "+PADDING+"px 0px";
    });
  },
  
  
  
  start: function() {
    if (IndaBeatsSequencer.interval_id) {
      clearInterval(IndaBeatsSequencer.interval_id);
    }
    IndaBeatsSequencer.interval_id = setInterval(IndaBeatsSequencer.intervalHandler, IndaBeatsSequencer.interval);
    IndaBeatsSequencer.playing = true;
  },
  
  stop: function() {
    IndaBeatsSequencer.playing = false;
    if (IndaBeatsSequencer.interval_id) {
      clearInterval(IndaBeatsSequencer.interval_id);
    }
  },
  
  reset: function() {
    IndaBeatsSequencer.clear();
    IndaBeatsSequencer.active_column = -1;
  },
  
  clear: function() {
    $('.cell.active').removeClass('active');
  },
  
  randomize: function() {
    IndaBeatsSequencer.reset();
    $('.cell').each(function(index, el){
      if (Math.floor(Math.random()*5) == 1) {
        $(el).addClass('active');
      }
    });
  },
  
  
  clickHandler: function( evt ) {
    
    var cell = $(evt.target).is('.cell') ? $(evt.target) : ( $(evt.target).parents('.cell')[0] ? $(evt.target).parents('.cell')[0] : null );
    
    if (cell)
    {
      if (cell.is('.active')) {
        cell.removeClass('active');
      } else {
        cell.addClass('active');
      }
      console.log( cell.attr('id') +  ' ' + (cell.is('.active') ? 'active' : 'unactive') );
    }
    
  },
  
  keyUpHandler: function( evt ) {
    if (evt.keyCode == 32) {  // if space bar
      IndaBeatsSequencer.space = false;
      if (!IndaBeatsSequencer.playing) {
        IndaBeatsSequencer.start();
      } else {
        IndaBeatsSequencer.stop();
      }
    } else if (evt.keyCode == 82) { // if r button
      IndaBeatsSequencer.r = false;
      IndaBeatsSequencer.randomize();
    } else if (evt.keyCode == 67) { // if c button
      IndaBeatsSequencer.c = false;
      IndaBeatsSequencer.clear();
    } else if (evt.keyCode == 76) { // if l button
      IndaBeatsSequencer.init('#sequencer', IndaBeatsSettings);
    } else { console.log(evt.keyCode); }
    
  },
  
  keyDownHandler: function( evt ) {
    
    if (evt.keyCode == 32) {  // if space bar
      IndaBeatsSequencer.space = true;
    } else if (evt.keyCode == 82) { // if r button
      IndaBeatsSequencer.r = true;
    } else if (evt.keyCode == 67) { // if c button
      IndaBeatsSequencer.c = true;
    }
    
  },
  
  intervalHandler: function() {
    if( IndaBeatsSequencer.active_column >= IndaBeatsSequencer.column_count - 1 ) {
      IndaBeatsSequencer.active_column = 0;
    } else {
      IndaBeatsSequencer.active_column++;
    }
    
    $('.column.active').removeClass('active');
    $('#column_'+IndaBeatsSequencer.active_column).addClass('active');
    
    $('.column.active .cell.active').each(function(index, el){
      IndaBeatsSequencer.audioplayer.play( $(el).attr('data-channel') );
    });
  }
  
};
