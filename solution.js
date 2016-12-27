(function(){
	function readJsonFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
	}

  var sampleData;
	readJsonFile("./data/sample.json", function(data){
			sampleData = JSON.parse(data);

      var dataSelector = document.querySelector('select');
      for(dataset of Object.keys(sampleData)){
        var option_ref = document.createElement('option')
        option_ref.setAttribute("value", dataset);
        option_ref.textContent = dataset;
        dataSelector.appendChild(option_ref);
      }
      dataSelector.onchange = function(){
        var selectedValue = dataSelector.value;
        populateTable(sampleData[selectedValue]);
      };

      var forAllTh = document.querySelectorAll('th');
      [].forEach.call(document.querySelectorAll('th'), function(x){return x.onclick = onHeaderClick });

      function onHeaderClick (evt){
        console.log("Hey", evt);
        var sortOrder = evt.target.getAttribute('data-sortorder');
        var sortedOn = evt.target.textContent;

        var selectedValue = dataSelector.value;
        var newRecords = sortRecords(sampleData[selectedValue], sortedOn, sortOrder);
        formRows(newRecords, columns, document.querySelector('tbody'));

        evt.target.setAttribute('data-sortorder', parseInt(sortOrder) * -1)
      };
	});

  

  var columns;
  function populateTable(records){
    var tablePlaceHolder = document.querySelector('.tableHolder');
    tablePlaceHolder.innerHTML = '';
    if(records.length > 0){
      var tableRef = document.createElement('table');
      var headerRef = document.createElement('thead');
      var tBodyRef = document.createElement('tbody');

      columns = getColumns(records);
      formHeader(columns, headerRef);
      formRows(records, columns, tBodyRef);

      tableRef.appendChild(headerRef);
      tableRef.appendChild(tBodyRef);
      tablePlaceHolder.appendChild(tableRef);
    } else {
      tablePlaceHolder.appendChild(document.createTextNode('No data to display'));
    }
  }

  function getColumns(records){
    var columns = [];
    for(record of records){
      Object.keys(record).forEach(function(x){
        if(columns.indexOf(x) == -1) {
          columns.push(x);
        }
      })
    }
    return columns;
  }

  function formHeader(column_names, header_ref){
    for(name of column_names){
      var th_ref = document.createElement('th');
      th_ref.setAttribute('data-sorted', false);
      th_ref.setAttribute('data-sortorder', 1); // 1 indicates descending
      var column_name = document.createTextNode(name);
      th_ref.appendChild(column_name);
      header_ref.appendChild(th_ref);
    }
  }

	function formRows(records, columns, tbody_ref){
    tbody_ref.innerHTML = '';
    for(record of records){
      var row_ref = document.createElement('tr') ;
      for(column of columns){
        var td_ref = document.createElement("td");
        var cell_value = record[column];
        td_ref.appendChild(document.createTextNode(cell_value ? cell_value : '-'));
        row_ref.appendChild(td_ref);
      }
      tbody_ref.appendChild(row_ref);
    }
  };

  function sortRecords(records, sortOn, sortOrder){
    return records.sort(function(x, y){
      return x[sortOn] > y[sortOn] ? sortOrder * 1 : sortOrder * -1; 
    }) 
  };
})();
