// Date Time Format guide: https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html

/*
	Converts a date-time string from one format / timezone to another.
	At current, ServiceNow is not able to do this using ServiceNow functions,
		this function taps into the Java-native functionality.
*/
D3U.formatDateTimeString = function(inputValue, inputFormat, inputTzName, outputFormat, outputTzName) {
	var INTERNAL_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	
	if (JSUtil.nil(inputTzName)) inputTzName = INTERNAL_DATETIME_FORMAT; //Default to the system's timezone, if not specified
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

/*
	Returns the string value of a GlideDateTime object in the specified format and timezone
	Same as formateDateTimeString, but works with GlideDateTime objects and requires fewer para.meters.
*/
D3U.formatDateTimeGDT = function(gdt, outputFormat, tzName) {
	var INTERNAL_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	var INTERNAL_DATETIME_TIMEZONE = "GMT";
	return D3U.formatDateTimeString(gdt.getValue(), INTERNAL_DATETIME_FORMAT, INTERNAL_DATETIME_TIMEZONE, outputFormat, tzName);
};
