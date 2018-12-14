// Add message to email log
// By David McDonald 2018
// The email log has it's own table that extends from syslog.
// As far as I've seen, there isn't an easy and nifty way to add a message
//	so you have to add it yourself the long way.

function emailLog(msg, emailSysId) {
	var src = "EMAIL."+emailSysId;
	
	var grELog = new GlideRecord("syslog_email");
	grELog.source = src;
	grELog.level = 0;
	grELog.message = msg;
	grELog.email = emailSysId;
	grELog.insert();
}
