var IndaBeatsSequencer = {
  
  cells: [],
  row_samples:  [],
  
  active_column: -1,
  column_count: null,
  row_count: null,
  
  interval_id: null,
  interval : 300,
  
  init: function( element, options ) {
    
    this.element = $(element);
    this.options = options;
    
    this.audioplayer = getFlashMovie('audioplayer');
    
    this.column_count = this.row_count = this.options.gridSize;
    
    for (var i = 0; i < this.column_count; i++)
    {
      var column = $('<div></div>').addClass('column').attr({ id: 'column_'+i });
      this.cells[i] = [];
      for (var j = 0; j < this.row_count; j++)
      {
        column.append( $('<a>#</a>').addClass('cell').attr({ id: 'cell_'+i+'_'+j, 'data-col': i, 'data-row': j }) );
        this.cells[i][j] = false;
        if (!this.row_samples[j]) {
          this.row_samples[j] = {
            'uuid':i+'_'+j,
            'name':i+'_'+j,
            'path':'test/audio/output'+j+'.mp3',
            'channel': j
          };
          this.audioplayer.load( this.row_samples[j] );
        }
      }
      this.element.append(column);
    }
    
    this.element.click(this.clickHandler);
    
    this.size_everything();

    setTimeout(this.start, 1000);
  },
  
  size_everything: function() {
    WINDOW_WIDTH = $(window).width() - 25;
    WINDOW_HEIGHT = $(window).height() - 135; //account for credit header
    PADDING = 5;
    
    cell_width = WINDOW_WIDTH / IndaBeatsSettings.gridSize - 1;
    cell_height = WINDOW_HEIGHT / IndaBeatsSettings.gridSize;

    $("#sequencer")[0].style.width = WINDOW_WIDTH + "px";
    $(".column").each(function(index, el) {
      el.style.width = cell_width + "px";
    });
    $(".cell").each(function(index, el) {
      el.style.width = cell_width - PADDING + "px";
      el.style.height = cell_height - PADDING + "px";
      el.style.margin = "0px 0px "+PADDING+"px 0px";
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
      console.log( cell.attr('data-col') + ' x ' + cell.attr('data-row') +  ' ' + (cell.is('.active') ? 'active' : 'unactive') );
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
      IndaBeatsSequencer.audioplayer.play( $(el).attr('data-row') );
    });
  },
  
  start: function() {
    if (IndaBeatsSequencer.interval_id) {
      clearInterval(IndaBeatsSequencer.interval_id);
    }
    IndaBeatsSequencer.interval_id = setInterval(IndaBeatsSequencer.intervalHandler, IndaBeatsSequencer.interval);
  },
  
  stop: function() {
    if (IndaBeatsSequencer.interval_id) {
      clearInterval(IndaBeatsSequencer.interval_id);
    }
  }
  
  
  
};