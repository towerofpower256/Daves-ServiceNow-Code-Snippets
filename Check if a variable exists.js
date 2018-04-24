// Pretty self explanitory, checks if a variable is present on a record
// Returns TRUE if it found one, FALSE if it didn't

function variableExists(gr, varName) {
	for (var m in gr.variables) {
		if (m == varName) {
			return true;
		}
	}
	return false;
}

//E.g.
var result = variableExists(current, 'appointment_record');
