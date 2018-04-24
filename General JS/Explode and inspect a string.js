/*
	Function for exploding & inspecting a string
	Useful with checking a string for crazy or unexpected characters
	which can cause issues
*/
function inspectString(a) {
	if (typeof(a) != 'string') a = a.toString();
	
	gs.print("Inspecting string: "+a);
	for (var i=0; i < filter.length; i++) {
		gs.print(filter[i] + " : " + filter.charCodeAt(i));
	}
}
