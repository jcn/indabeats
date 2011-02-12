var IndaBeatsSequencer = {
  
  cells: [],
  
  interval : null,
  
  init: function( element, options ) {
    
    this.element = $(element);
    this.options = options;
    
    for (var i = 0; i < this.options.gridSize; i++)
    {
      var column = $('<div></div>').addClass('column').attr({ id: 'column_'+i });
      this.cells[i] = [];
      for (var j = 0; j < this.options.gridSize; j++)
      {
        column.append( $('<a>#</a>').addClass('cell').attr({ id: 'cell_'+i+'_'+j }) );
        this.cells[i][j] = false;
      }
      this.element.append(column);
    }
    
    this.element.click(this.clickHandler);
    
    this.size_everything();
  },
  
  size_everything: function() {
    WINDOW_WIDTH = $(window).width() - 25;
    WINDOW_HEIGHT = $(window).height() - 25 - $("header").height();
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
    }
    
  },
  
  
  start: function() {
    
  },
  
  stop: function() {
    
  }
  
  
  
  
  
};