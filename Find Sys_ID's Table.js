//For use when you've been given a sys_id, but have no idea what table it's from

FindRecordTable("record_sysid"); //Sys_id to find table for

function FindRecordTable(targetID) {
	//Get tables
	var tgr = new GlideRecord("sys_db_object");
	tgr.addNotNullQuery("sys_update_name");
	tgr.addNotNullQuery("name");
	tgr.query();

	while (tgr.next()) {
		var tableName = tgr.name.toString();
		gs.print("========================");
		gs.print(tableName);
		if (/(\d){4}$/.test(tableName) || /^ts_/.test(tableName) || /^v_/.test(tableName)) {
			//Table name ends with 4 numbers, is part of a table rotation, or starts with "v_"
			//Skip
			gs.print("Skipping table");
		} else {
			try {
				var gr = new GlideRecord(tableName);
				if (!gr.isValidField("sys_id")) {
					/*
					Had a scare here with things like pa_favorites and v_private_cache, where the viewed from ServiceNow is:
						__ENC__YTg0OGQ5NTM0ZjY1MTI4MGY5ZjhhNDBmMDMxMGM3Nzg=
					*/
					gs.print("Table doesn't have a sys_id field, skipping"); //This record must be REALLY messed up!
				} else {
					gr.addQuery("sys_id", targetID);
					gr.queryNoDomain();
					if (gr.next()) {
						gs.print("FOUND TARGET in table: "+tableName);
						//break;
					}
				}
				
			} catch (err) {
				gs.print("ERROR:\n"+err);
			}
		}
	}
}