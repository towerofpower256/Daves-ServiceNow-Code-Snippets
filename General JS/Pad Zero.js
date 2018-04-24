/*
	Pad Zero
	By David McDonald - 2017
	
	Got a short number that should always be the same number of digits?
	Want that 12 to be 00012 ?
	Pad Zero will do that for you
	n = the number
	width = how many digits numbers there should be
	z = the character to pad the number with, '0' by default
*/

function padzero(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
