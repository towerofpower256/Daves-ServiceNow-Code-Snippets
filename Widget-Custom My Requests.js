// Widget that I made as a custom "My Requests" type widget.
// It had tabs (that would hide if there were no results on that tab) and 
// included support for little sub-filters such as "Open" or "Closed" for each tab.
// It worked like a list with tabs along the top. Imagine the "My requests" widget,
// but each list was on a different tab instead of all of the rows in a combined list.

// === SERVER SCRIPT
(function() {
  /*  "use strict"; - linter issues */
	// populate the 'data' object
	var sp_page = $sp.getValue('sp_page');
	var pageGR = new GlideRecord('sp_page');
	pageGR.get(sp_page);
	data.page_id = pageGR.getValue("id");
	$sp.getValues(data);
	
	// Read the list definitions
	// Defined by the widget option "list_defs"
	// Each definition is a semicolon-separated value
	// with 1 on each line
	// E.g. a list on the incident table with a query
	// incident;My incidents;incident;opened_byDYNAMIC90d1921e5f510100a9ad2572f2b477fe
	data.show_all_lists = options.show_all_lists || false;
	if (input) {
		data.selected_list_def_name = input.selected_list_def_name;
		data.list_defs = input.list_defs;
		data.selected_filter = input.selected_filter;
	}
	
	//$sp.log("data.selected_list_def_name: "+data.selected_list_def_name)
	var selected_list_def;
	
	if (!data.list_defs) {
		//$sp.log("Building list defs");
		//$sp.log("options.list_definitions: "+options.list_definitions)
		data.list_defs = [];
		var listDefsSplit = (""+options.list_definitions).split("|");
		for (var i=0; i < listDefsSplit.length; i++) {
			var defLine = (""+listDefsSplit[i]).trim();
			if (defLine == "") continue; // Skip empty lines
			var defLineSplit = defLine.split(";");

			if (defLineSplit.length < 5) {
				$sp.log("Invalid list line, missing segments: "+defLine);
				continue; // Skip lines that are too short
			}

			var def = {
				name: defLineSplit[0],
				label: defLineSplit[1],
				table: defLineSplit[2],
				columns: defLineSplit[3],
				query: defLineSplit[4],
				filters: [],
				visible: true
			};

			// Go over the trailing segments, in chunks of 2, 
			for (var iFilter = 5; iFilter < defLineSplit.length; iFilter = iFilter+2) {
				def.filters.push({
					name: defLineSplit[iFilter],
					query: defLineSplit[iFilter+1] || ""
				})
			}

			// If there's no filters, create the "All" filter
			if (def.filters.length < 1) def.filters.push({name: "All", query: ""});

			// Perform a count. Skip lists that don't have any results

			if (data.show_all_lists!==true) {
				var gaCount = new GlideAggregate(def.table);
				if (def.query) gaCount.addEncodedQuery(def.query);
				gaCount.addAggregate("COUNT");
				gaCount.query();
				if (gaCount.next()) {
					var count = gaCount.getAggregate("COUNT");
					if (count <= 0) {
						//$sp.log("Skipping list '"+def.name+"', no results");
						def.visible = false;
					}
				}
			}

			//$sp.log("Adding list def: "+JSON.stringify(def));
			data.list_defs.push(def);

			// Get the selected list definition, by name
			// or just select the first one
			if (selected_list_def == undefined) {
				//$sp.log("Selecting def, by default: "+def.name);
				selected_list_def = def;
			}
			else if (def.name == data.selected_list_def_name) {
				//$sp.log("Selected def: "+def.name);
				selected_list_def = def;
			}
		}
	}
	
	// Search for the selected def
	if (selected_list_def == undefined) {
		for (var i=0; i < data.list_defs.length; i++) {
			if (data.selected_list_def_name == data.list_defs[i].name) {
				selected_list_def = data.list_defs[i];
				break;
			}
		}
	}
	
	// Get the selected list definition, by name
	// or just select the first one
	if (selected_list_def == undefined && data.list_defs.length > 0) {
		selected_list_def = data.list_defs[0];
		//$sp.log("Selecting def, by default: "+selected_list_def.name);
	}
	
	if (selected_list_def && data.selected_filter == undefined) {
		data.selected_filter = selected_list_def.filters[0];
		//$sp.log("Selecting filter, by default: "+JSON.stringify(data.selected_filter));
	}
	
	// If there's no list definitions, go no further
	if (selected_list_def) {
		
		if (!data.selected_list_def_name)
			data.selected_list_def_name = selected_list_def.name;

		//$sp.log("Loading list: "+JSON.stringify(selected_list_def));
		
		//$sp.log("Selected filter: "+JSON.stringify(data.selected_filter));
		
		// Read some options
		data.table = selected_list_def.table;
		if (""+selected_list_def.columns == "") selected_list_def.columns = undefined;
		data.field_list = selected_list_def.columns || options.field_list || "number,state,short_description,u_requestor,sys_created_on,sys_updated_on";

		if (data.field_list) {
			data.fields_array = data.field_list.split(',');
		} else {
			data.field_list = $sp.getListColumns(data.table);
		}

		if (input) {
			data.p = input.p;
			data.o = input.o;
			data.d = input.d;
			data.q = input.q;
		}
		data.p = data.p || 1;
		data.o = data.o || $sp.getValue('order_by') || "sys_created_on";
		data.d = data.d || $sp.getValue('order_direction') || "desc";

		data.page_index = (data.p - 1);
		data.window_size = $sp.getValue('maximum_entries') || 10;
		data.window_start  = (data.page_index * data.window_size);
		data.window_end = (((data.page_index + 1) * data.window_size));
		data.filter = $sp.getValue("filter");

		// My options
		data.show_new = input.show_new || false;
		data.show_keywords = true;
		data.show_breadcrumbs = input.show_breadcrumbs || false;

		// Build the query
		var query = [];
		query.push(selected_list_def.query);
		
		if (data.selected_filter != undefined) {
			//$sp.log("Adding selected filter: "+JSON.stringify(selected_filter));
			query.push(""+data.selected_filter.query);
		}

		var queryStr = query.join("^");
		if (data.filter) {
			data.filter = queryStr+"^"+data.filter;
		} else {
			data.filter = queryStr;
		}
		if (data.filter == "") {
			data.filter = "^";
		}
		//$sp.log("Final query: "+data.filter);

		var gr = new GlideRecordSecure(data.table);
		if (!gr.isValid()) {
			data.invalid_table = true;
			data.table_label = data.table;
			return;
		}
		data.table_label = gr.getLabel();

		
		
		options.table = data.table;
		options.fields = data.field_list;
		options.o=data.o;
		options.d= data.d;
		options.filter = data.filter;
		options.window_size=data.window_size;
		options.view = 'sp';
		options.headerTitle = " ";
		options.show_breadcrumbs = data.show_breadcrumbs;
		options.show_keywords = data.show_keywords;
		//options.title = selected_list_def.label;
		options.title = " ";
		
		//$sp.log(JSON.stringify(options));
		
		data.dataTableWidget = $sp.getWidget('widget-data-table', options);
	} else {
		data.no_results = true;
	}
})();


// === CLIENT CONTROLLER

function ($scope, spUtil, $location, spAriaFocusManager) {
	var c = this;
	c.selected_list = {};
	
	c.findSelectedList = function() {
		if (c.selected_list.name != c.data.selected_list_def_name) {
			// The selected list has changed
			// Update some stuff
			for (var i=0; i < c.data.list_defs.length; i++) {
				var def = c.data.list_defs[i];
				if (def.name == c.data.selected_list_def_name) {
					c.selected_list = def; // Found the selected list def
				}
			}
		}
		
		//console.log("Selected list: ", c.selected_list);
	}
	
	c.findSelectedList();
	
	//console.log("Selected filter: ", c.data.selected_filter);
	
	$scope.$on('data_table.click', function(e, parms){
		var p = $scope.data.page_id || 'my_requests_info';
		var s = {id: p, table: parms.table, sys_id: parms.sys_id, view: 'sp'};
		var newURL = $location.search(s);
		spAriaFocusManager.navigateToLink(newURL.url());
	});
	
	c.changeList = function(listDefName) {
		console.log("Changing list to: ", listDefName);
		c.data.selected_list_def_name = listDefName;
		c.refresh();
	}
	
	c.refresh = function() {
		c.data.dataTableWidget = false;
		c.server.update().then(function() {
			c.findSelectedList();
		});
	}
	
	c.changeFilter = function() {
		var selectedFilter = c.data.selected_filter;
		c.refresh();
	}
}  

// === HTML TEMPLATE
<div class="panel">
  <div class="panel-heading">
    <div class="alert alert-danger" ng-if="data.invalid_table">
      ${Table not defined} '{{data.table_label}}'
    </div>
    
    <div class="alert alert-info" ng-if="data.no_results">
      ${No results}
    </div>

    <div class="btn-group btn-group-list-defs">
      <div ng-repeat="t in data.list_defs"
           ng-if="t.visible===true"
              ng-class="{'active': c.data.selected_list_def_name == t.name}" 
              class="my_requests_btn"
              ng-click="c.changeList(t.name);"
              >
        {{t.label}}
      </div>
    </div>
    
    <div class="my-filters-group">
      <select class="my-filters custom-select" 
              ng-model="c.data.selected_filter"
              ng-change="c.changeFilter()"
              ng-options="option.name for option in c.selected_list.filters track by option.name"
              >
      </select>
    </div>
    
  </div>
  <div class="panel-body my_requests_panel_list">
    <div ng-if="c.data.dataTableWidget">
      <sp-widget  widget="c.data.dataTableWidget"></sp-widget>
    </div>
  </div>
  
</div>

// === CSS

.my_requests_panel_list {
  padding: 0;
}

.my_requests_btn {
  cursor: pointer;
  color: white;
  padding-bottom: 2px;
  padding-right: 6px;
 	margin: 10px;
}

.my_requests_btn.active {
  border-bottom: solid 1px red;
  border-right: solid 1px red;
}

.btn-group-list-defs {
 	display: flex;
  flex-flow: row wrap;
}

select.my-filters {
  color: black !important;
}

/* Make the page number text at the bottom 
of the data-table-widget white */
.panel-footer .panel-title {
  color: black !important;
}

/* Remove the rounded edges from the data-table-widget */
.v5001b062d7101200b0b044580e6103eb .panel .panel-heading {
  border-top-right-radius: 0 !important;
  border-top-left-radius: 0 !important;
}

/* Fix large short_description from making the list overflow */
.v5001b062d7101200b0b044580e6103eb .sp-list-cell {
  white-space: normal;
}

/* Make the export menu options black, instead of white */
ul.dropdown-menu li a {
 color: black !important; 
}

/* Make the data table headers text black */
.v5001b062d7101200b0b044580e6103eb .th-title {
  color: black !important;
}
