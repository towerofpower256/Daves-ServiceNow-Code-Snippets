// Date Time Format guide: https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html

// ===== Vars
D3U.INTERNAL_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
D3U.INTERNAL_DATETIME_TIMEZONE = "GMT";

/*
	Outputs a GlideDateTime in the given arbitrary format
	Att current, ServiceNow is not able to do this using ServiceNow functions,
		and this function taps into the Java-native classes
*/
D3U.formatDateTimeString = function(inputValue, inputFormat, inputTzName, outputFormat, outputTzName) {
	if (JSUtil.nil(inputTzName)) inputTzName = D3U.INTERNAL_DATETIME_FORMAT; //Default to the system's timezone, if not specified
	if (JSUtil.nil(outputTzName)) outputTzName = gs.getSession().getTimeZoneName(); //Default to the user's timezone, if not specified
	
	//Configure input converter
	var sdfConverterInput = new Packages.java.text.SimpleDateFormat(inputFormat); 
	sdfConverterInput.setTimeZone(new Packages.java.util.TimeZone.getTimeZone(inputTzName));
	
	var iDate = sdfConverterInput.parse(inputValue); //Intermediary DT object
	
	//Configure output converter
	var sdfConverterOutput = new Packages.java.text.SimpleDateFormat(outputFormat);  
	sdfConverterOutput.setTimeZone(new Packages.java.util.TimeZone.getTimeZone(outputTzName));
	
	//Convert
	var r = sdfConverterOutput.format(iDate);
	return r;
};

D3U.formatDateTimeGDT = function(gdt, outputFormat, tzName) {
	return D3U.formatDateTimeString(gdt.getValue(), this.INTERNAL_DATETIME_FORMAT, D3U.INTERNAL_DATETIME_TIMEZONE, outputFormat, tzName);
};