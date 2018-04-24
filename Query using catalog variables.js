/*
	Here's how you do a query, filtering by a variable's value
*/
var gr = new GlideRecord("sc_item_option_mtom"); //This is the table where variable instances are associated to request items

gr.addQuery("sc_item_option.value", "some value"); //Query the value
gr.addQuery("sc_item_option_item_option_new.name", "some_variable_name"); //Query the variable name
gr.addQuery("request_item.cat_item.name", "Some kind of request"); //Query by the requested item type

gr.query(); //and so on...