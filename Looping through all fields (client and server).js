// SERVER
// Assuming that you've got a GlideRecord in a variable called 'gr'
var fields = gr.getFields();
for (var i = 0; i < fields.size(); i++) {
    var field = fields.get(i);
    // Do whatever you want to do to the field in here
}



// CLIENT
var fields = g_form.getEditableFields();  
for (var x = 0; x < fields.length; x++) {  
    var field = fields[x];
    // Do whatever you want to do to the field in here 
}
