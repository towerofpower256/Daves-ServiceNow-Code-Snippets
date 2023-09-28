// Duplicate checker
// By David McDonald 2023
// Run a GlideAggregate to find duplicate values in a table.

// Change these 2 variables for the table and field to check for duplicates
var tableName = "core_company";
var fieldName = "name";

var r = [];
r.push([]); // Blank first line

var ga = new GlideAggregate(tableName);
ga.addAggregate("COUNT", fieldName);
ga.query();
while (ga.next()) {
    var c = ga.getAggregate("COUNT", fieldName);
    if (c > 1) {
        r.push([c, ""+ga[fieldName]].join("\t"));
    }
}

gs.print("Duplicates: "+r.length);
gs.print(r.join("\n"));
