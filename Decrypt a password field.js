//NOTE: Only works for 2-way encrypted password fields. 1-way encrypted fields cannot be decrypted natively

// Takes in a GlideElement, decrypts its value and returns it as a string
// Also works with an encrypted string value, doesn't have to be a GlideElement
function DecryptPassword(glideElement) {
	var Encrypter = new GlideEncrypter();
	return Encrypter.decrypt(glideElement);
}

// Takes in a GlideElement in a scoped application, decrypts its value and retunrs it as a string
function DecryptPasswordScoped(scopedGlideElement) {
	return scopedGlideElement.getDecryptedValue();
}

// Sets a password field, gotta use setDisplayValue, ServiceNow will encrypt it for you
function SetPasswordFieldValue(glideElement, passwordValue) {
	glideElement.setDisplayValue(passwordValue);
}

// NOTE: if the DecryptPassword function returns just stars ('*' characters), it means that the decryption failed on a system level.
// Encountered ServiceNow problem PRB1290818, involving the encryption context not being updated as part of a system clone.
