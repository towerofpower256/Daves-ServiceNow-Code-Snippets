/*
	Attachment Stuff
	By David McDonald 2017
	
	See:
	https://docs.servicenow.com/bundle/istanbul-servicenow-platform/page/script/useful-scripts/reference/r_UsefulAttachmentScripts.html
	http://wiki.servicenow.com/index.php?title=Useful_Attachment_Scripts
	https://community.servicenow.com/docs/DOC-6091
*/

//Read an attachment, as Base64
// Good for transporting / exporting attachments, like via an API
function getAttachmentBase64(grAttachment /* GlideRecord of the attachment */) {
	var gsa = new GlideSysAttachment();
	var attBytes = gsa.getBytes(grAttachment); //Gets it as a Java Binary Array, not useable yet
	var attBase64 = GlideStringUtil.base64Encode(attBytes); //Converts it into a Javascript string, holding the contents as a Base6-encoded string
	
	return attBase64;
}

/*
	Read an attachment, as a string
	Only good for text-based documents, and will break if it's a binary file, like an EXE or a ZIP
*/
function getAttachmentString (grAttachment /* GlideRecord of the attachment */) {
	var gsa = new GlideSysAttachment();
	var attBytes = gsa.getBytes(grAttachment); //Gets it as a Java Binary Array, not useable yet
	var attJavaString = Packages.java.lang.String(fileBytes); //Convert the bytes array to a Java-Rhino string
	var attString = String(attJavaString); //We don't trust Rhino, convert it into a Javascript string
	
	return attString;
}

/*
	Create an attachment from a script
	Must contents must be a Base64 encoded string
*/
var base64contents = GlideStringUtil.base64Encode("something to save as an attachment");
GlideSysAttachment.write(grToAttachTo, 'filename', 'mime/type', base64contents);


// Copy attachments from one record to another
GlideSysAttachment.copy('sourcetable', 'sys_id', 'destinationtable', 'sys_id');
