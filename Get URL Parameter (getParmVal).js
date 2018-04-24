//Parse a URL into it's query bits and get a single parameter out of it

function getParmVal(name){
    var url = document.URL.parseQuery();
    if (url[name]) {
        return decodeURI(url[name]);
    }
    else {
        return;
    }
}