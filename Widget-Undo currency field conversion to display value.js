// Process the data returned by widget-data-table
// and replace the existing currency field values and display values
// with their reference currency equivelents. 
// I used this because ServiceNow wanted to convert currency fields
// to their display value & display currency, instead of the currency
// that they were entered in.
// E.g. entered in USD, but displayed on the Service Portal in AUD.
// Parm: tableName	The name of the table
// Parm: dataList		The data list returned by widget-data-table
// Return: nothing, changes will be made directly into the list objects
// By David McDonald - Entrago 09/09/2019
function unDisplayCurrencyFields(tableName, dataList) {

	// Get a list of all of the record sys_id's
	_debug("dataList: "+typeof(dataList)+" - "+dataList);
	var sysIDs = [];
	for (var iRow=0; iRow<dataList.length; iRow++) {
		var id = dataList[iRow].sys_id;
		_debug("Next ID:"+id);
		if (JSUtil.notNil(id)) {
			sysIDs.push(""+id);
		}
	}

	// Query the target table for all of those records
	_debug("Table name: "+tableName);
	_debug("sys_ids: "+sysIDs);
	var gr = new GlideRecordSecure(tableName);
	gr.addQuery("sys_id", "IN", sysIDs);
	gr.query();

	// For each record, replace the currency fields with the desired
	// value and format
	while (gr.next()) {
		var grID = gr.getUniqueValue();
		_debug("Checking GR: "+grID);

		// Find the entry in the list data
		for (var iRow=0; iRow < dataList.length; iRow++) {
			var row = dataList[iRow];
			if (row.sys_id == grID) {
				// Update all of the currency fields

				for (var colName in row) {
					var col = row[colName];
					// Is this a data element?
					// Does it have a sub-element called "display_value"?
					if (JSUtil.notNil(col.type) && col.type == "currency") {
						_debug("Found currency field in data: "+colName);
						// This is a currency field
						var ge = gr.getElement(colName);
						if (ge != null) {
							col.value = ge.getCurrencyValue();
							col.display_value = ge.getCurrencyDisplayValue();
						}
					}
				}
			}
		}
	}
	
	function _debug(msg) {
		gs.log(msg, "DEBUG-unDisplayCurrencyFields");
	}
}
