// Useful function for searching for a sys_id and you don't know what table it's from.
// Searches through all of the base tables (tables that don't extend from other tables),
// avoids tables that don't have sys_id fields (eg. ts_ text search tables),
// and ablity to search in deleted audit records as well.
// Example and usage at the bottom of this file.

function findSysId(sysIdToFind, options) {
	sysIdToFind = ""+sysIdToFind;
	if (sysIdToFind == "") throw "sysIdToFind is empty or missing";
	
	options = options || {};
	
	var results = [];
	
    if (options.search_records !== false) {
        // Search through tables
        var grTable = new GlideRecord("sys_db_object");
        grTable.addNullQuery("extension_model"); // Only want tables that don't extend from anything
        grTable.query();
        while (grTable.next()) {
            var tableName = ""+grTable.name;
            var tu = new TableUtils(tableName);
            
            try {
                var gr = new GlideRecord(tableName);
                
                // Need to use TableUtils to check for sys_id,
                // because gr.isValidField is still TRUE on some tables that don't actually have one,
                // like the "ts_" text search tables.
                if (!tu.isValidField("sys_id")) { 
                    _log("Skipping table '"+tableName+"', no sys_id field");
                    continue;
                }
                
                // Skip DB views
                if (options.skip_db_views && tableName.indexOf("v_") == 0) {
                    _log("Skipping DB view table: "+tableName);
                    continue;
                }
                
                gr.addQuery("sys_id", sysIdToFind);
                gr.setLimit(1);
                
                _log("Searching table "+tableName);
                gr.query();
                
                if (gr.next()) {
                    _log("Found result!");
                    results.push({
                        type: "record",
                        table_name: ""+gr.getRecordClassName(),
                        table_label: ""+gr.getClassDisplayValue(),
                        table_searched: ""+tableName,
                        display_value: ""+gr.getDisplayValue(),
                        sys_id: ""+gr.getUniqueValue()
                    });
                    
                    if (options.single_result) {
                        _log("Single result mode, stopping search");
                        break;
                    }
                }
            }
            catch (ex) {
                _log("!!! Error searching "+tableName+": "+ex);
            }
        }
    }
    if (options.search_deleted_records) {
        _log("Searching deleted records");
        var grD = new GlideRecord("sys_audit_delete");
        grD.addQuery("documentkey", sysIdToFind);
        grD.query();
        _log("Deleted record results: "+grD.getRowCount());
        while (grD.next()) {
            results.push({
                type: "deleted_record",
                table_name: ""+grD.tablename,
                table_label: ""+grD.tablename.getDisplayValue(),
                table_searched: ""+grD.getRecordClassName(),
                display_value: ""+grD.display_value,
                sys_id: ""+grD.documentkey
            })
        }
    }
	
	return results;
	
	function _log(msg) {
		if (options.verbose) gs.log(msg);
	}
};
// ===
// === Usage example ===
// ===
var r = findSysId("b33d7380db8fe410360972f5f39619d1", {
    verbose: true, // Adds more logging
    single_result: false, // Don't keep seraching if you find a result
    skip_db_views: false, // Don't search in DB view tables
    search_records: true, // Search through tables, TRUE by default
    search_deleted_records: true // Search the sys_audit_delete table, in case the record with that sys_id was deleted
    });
gs.print(JSON.stringify(r, null, 2));
// OUTPUT
// [
//   {
//     "type": "record",
//     "table_name": "sys_script_include",
//     "table_label": "Script Include",
//     "table_searched": "v_metadata_descendant",
//     "display_value": "MyAwesomeScriptInclude",
//     "sys_id": "b33d7380db8fe410360972f5f39619d1"
//   }
// ]
