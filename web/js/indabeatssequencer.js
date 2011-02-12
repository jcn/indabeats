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