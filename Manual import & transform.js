/*
	Running an import & transform manually
	Inspired by: 
	https://community.servicenow.com/thread/145203
	ScriptInclude.DataSourceLoader
	ScriptInclude.BillingRollup
	
	1. Create the Data Source (sys_data_source) record
	2. Add the attachment to the data source record
	3. Run the Import
	4. Run a Transform
	
*/

//1 - Create the Data Source record
// Note: if using an inbound email action, like in that forum link, this will look a little different
var grDS = new GlideRecord("sys_data_source");
grDS.name = "SomeName_"+gs.nowDateTime(); //Some name, with the current time on the end
grDS.import_set_table_Name = "u_some_import_staging_table";
grDS.import_set_table_label = "Some import staging table";
grDS.type = "File";
grDS.format = "CSV";
grDS.file_retrieval_method = "Attachment";

var newDS_ID = grDS.insert();

// 2 - Add the attachment
// If using the inbound email attachment method, then the attachment will automatically come across
// Via script, this can be done a variety of ways,

// a. copy
function copyAttachment(grSource, grTarget) {
	GlideSysAttachment.copy(
		grSource.getRecordClassName(),
		grSource.sys_id, 
		grTarget.getRecordClassName(),
		grTarget.sys_id
	);
}

// b. move
function moveAttachment(grAttachment, grTarget) {
	var targetTable = grTarget.getRecordClassName();
	if (/^ZZ_YY/.test(grAttachment.table_name)) targetTable = "ZZ_YY"+targetTable; //Prefix with the hidden prefix, if the attachment's current table has it
	grAttachment.table_name = targetTable;
	grAttachment.table_sys_id = grTarget.sys_id;
	grAttachment.update();
}


// 3 - Run the import
// Thanks to https://community.servicenow.com/thread/158812
function processDataSource(source_id) {
	var grDataSource = new GlideRecord("sys_data_source");
	if (!grDataSource.get(source_id)) {
		throw ("Failed to find data source for source ID: "+source_id);
	}
	
	var loader = new GlideImportSetLoader();
	var grImportSet = loader.getImportSetGr(grDataSource);
	loader.loadImportSetTable(grImportSet, grDataSource);
	//Now loaded
}

// 4 - Run a transform map
function doTransform(grImportSet) {
	var importSetRun = new GlideImportSetRun(grImportSet.getUniqueValue());
	var importLog = new GlideImportLog(importSetRun, grImportSet.data_source.name);
	
	// The GlideImportSetTransformer mangles the GlideRecord import set that you feed it.
	// If you need to use grImportSet for something else (e.g. iterating over a list of import sets),
	// create an internal version of that import set here. Otherwise, weird things might happen.
	var _grImportSet = new GlideRecord("sys_import_set");
	if (!_grImportSet.get(grImportSet.getUniqueValue())) throw "Couldn't create internal GlideRecord of import set before transforming";
	
	//Transformin' time
	var importTransformer = new GlideImportSetTransformer();
	//importTransformer.setMapID(transformMapSysId); // Use this function to specify the transform map(s) by comma separated sys_id's, if you want to
	importTransformer.setLogger(importLog);
	importTransformer.setImportSetRun(importSetRun);
	importTransformer.transformAllMaps(_grImportSet); // <-- The goods happen right here
	
	grImportSet.state = 'processed';
	grImportSet.update();
}
