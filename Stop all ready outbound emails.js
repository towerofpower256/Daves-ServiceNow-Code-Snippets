// Use this script to ignore any emails that are ready to be sent
// Useful when activating email sending from a sub-production instance,
//	and there's like a bazillion emails waiting to be sent.
// Also useful after a clone and you want to clear out all of the emails
//	in the queue that are waiting to be sent.

var grEmail = new GlideRecord("sys_email");
grEmail.addQuery("type", "send-ready");
grEmail.queryNoDomain();

gs.print("Count: "+grEmail.getRowCount());
while (grEmail.next()) {
	grEmail.type = "send-ignored";
	grEmail.update();
}
