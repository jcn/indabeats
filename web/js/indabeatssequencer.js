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
  
  mouse_down: false,
  click_target: null,
  
  spinning: false,
  spin_column: 0,
  spinner_timeout: null,

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
  
  spin: function() {

    // build "load"
    if (this.spinning == false) {
      this.clear();
      $("#cell_1_5, #cell_1_6, #cell_1_7, #cell_1_8, #cell_1_9, #cell_2_9, #cell_4_5, #cell_4_6, #cell_4_7, #cell_4_8, #cell_4_9, #cell_5_5, #cell_5_9, #cell_6_5, #cell_6_6, #cell_6_7, #cell_6_8, #cell_6_9, #cell_8_5, #cell_8_6, #cell_8_7, #cell_8_8, #cell_8_9, #cell_9_5, #cell_9_7, #cell_10_5, #cell_10_6, #cell_10_7, #cell_10_8, #cell_10_9, #cell_12_5, #cell_12_6, #cell_12_7, #cell_12_8, #cell_12_9, #cell_13_5, #cell_13_9, #cell_14_6, #cell_14_7, #cell_14_8").addClass("active");  
      this.spinning = true;
    }

    // flip this column
    $("#column_"+this.spin_column).children().each(function(index, el) {
      if ( $(el).hasClass("active") ) {
        $(el).removeClass("active");
      }
      else {
        $(el).addClass("active");
      }
    });
    
    // wrap
    this.spin_column += 1;
    if (this.spin_column > 15){ this.spin_column = 0; }
    
    if (this.spinning == true) {
      this.spinner_timeout = setTimeout(function(){IndaBeatsSequencer.spin();}, 50);
    };
  },
  
  stop_spin: function(){
    clearTimeout(this.spinner_timeout);
    this.spinning = false;
    this.clear();
  },
  
  show_active: function() {
    s = ""
    $(".active").each(function(index, el) {
      s += ", \"#"+el.id+"\"";
    });
    console.log(s);
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
      $(document).keyup(this.keyUpHandler).keydown(this.keyDownHandler);
      $(window).resize(this.size_everything);
      $(document).mousedown(this.mouseDownHandler).mouseover(this.mouseOverHandler).mouseup(this.mouseUpHandler);
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
    
    if (IndaBeatsSequencer.click_target != evt.currentTarget) {
      IndaBeatsSequencer.click_target = null;
      return;
    }
    
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
  
  setTargetHandler: function(evt) {
    IndaBeatsSequencer.click_target = evt.target;
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
  },
  
  mouseDownHandler: function(evt) {
    IndaBeatsSequencer.mouse_down = true;
    if ($(evt.target).is('.cell')) {
      IndaBeatsSequencer.click_target = $(evt.target);
    }
  },
  
  mouseOverHandler: function(evt) {
    if (IndaBeatsSequencer.mouse_down) {
      if ($(evt.target).is('.cell')) {
        var cell = $(evt.target);
        if (cell.is('.active')) {
          cell.removeClass('active');
        } else {
          cell.addClass('active');
        }
        cell = null;
      }
    }
  },
  
  mouseUpHandler: function(evt) {
    IndaBeatsSequencer.mouse_down = false;
    if ($(evt.target).is('.cell')) {
      var cell = $(evt.target);
      if (cell.is('.active')) {
        cell.removeClass('active');
      } else {
        cell.addClass('active');
      }
      cell = null;
      IndaBeatsSequencer.click_target = null;
    }
  }
  
};
