/*
	Import the Profile Photo from Active Directory and apply it to a ServiceNow user
	inputPayload: the Base64 payload of the image
	target: the GlideRecord of the sys_user to apply the photo to
*/
{
	ImportPhoto : function (inputPayload, target) {
		function _log(msg, type) {
			msg = "ImportPhoto: "+msg;
			if (JSUtil.nil(type)) type = "info";
			gs.print(msg);
			switch (type) {
				case "warn":
					log.info(msg);
					break;
				case "error":
					log.error(msg);
					break;
				default:
					log.info(msg);
					break;
			}
		}
		
		if (JSUtil.nil(inputPayload)) {
			_log("Called without a payload, skipping", "warn");
			return;
		}
		if (!target.isValidRecord()) {
			_log("Target is invalid, skipping", "warn");
			return;
		}
		
		//Try to get the user's current avatar
		var ga = new GlideSysAttachment();
		var updatePhoto = false;
		var grAttachment = new GlideRecord("sys_attachment");
		grAttachment.addQuery("table_sys_id", target.sys_id);
		grAttachment.addQuery("file_name", "photo");
		grAttachment.setLimit(1); //Should only ever be 1
		grAttachment.queryNoDomain();
		if (!grAttachment.next()) {
			updatePhoto = true;
			_log("User doesn't have an avatar, updating");
		} else {
			var currentPayloadBinary = ga.getBytes(grAttachment); //ga.getContent didn't work!
			var currentPayloadBase64 = GlideStringUtil.base64Encode(currentPayloadBinary);
			if (inputPayload == currentPayloadBase64) {
				_log("Existing photo is the same as what's in Active Directory, skipping");
				return;
			} else {
				_log("Existing photo is different to what's in Active Directory, updating");
				updatePhoto = true;
			}
		}
		
		if (updatePhoto) {
			this.UpdatePhoto(target, grAttachment, inputPayload);
		}
	},
	
	UpdatePhoto : function (grTarget, grExistingAttachment, payloadBase64) {
		var ga = new GlideSysAttachment();
		if (!JSUtil.nil(grExistingAttachment) && grAttachment.isValidRecord()) {
			_log("Deleting old photo");
			ga.deleteAttachment(grAttachment.getValue("sys_id"));
		}
		
		//Create new attachment
		//WARNING: Table name must start with "ZZ_YY", but to create the attachment, 
		//	you must have the correct table name on creation. Which means you gotta create the attachment, then update it after!
		this.trlog("Creating photo attachment");
		var payloadBinary = GlideStringUtil.base64DecodeAsBytes(payloadBase64);
		var attachResult = gaNewAttachment.write(
			grTarget,
			"photo", //Filename
			"image/jpeg", //MIME type, hopefully doesn't have to be entirely accurate as AD can hold JPEG and BMP images
			payloadBinary //Binary payload
		);
		_log("Importing profile picture result: "+attachResult);
		
		//Update that attachment
		var grNewAtt = new GlideRecord("sys_attachment");
		if (!grNewAtt.get(attachResult)) {
			_log("Failed to re-find the attachment, cannot correct table name", "error");
		} else {
			grNewAtt.table_name = "ZZ_YY"+grNewAtt.getValue("table_name");
			grNewAtt.update();
		}
	},
}