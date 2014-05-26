var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
    return query_string;
} ();

var packs = {
  commoner  : { paypal_full :"GSF95ETJ38UG6",
                price_full : 7,
                paypal_reduced : "MHVB9E9EYLGXL",
                price_reduced : 5,
                img_src:"./assets/img/packs/commoner2.jpg"},
  scholar   : { paypal_full :"ECLP53ULF7JC4",
                price_full : 14,
                paypal_reduced : "MMDFB5943LCLA",
                price_reduced : 10,
                img_src:"./assets/img/packs/scholar.jpg"},
  don       : { paypal_full :"9GFQKF6W4LEC6",
                price_full : 20,
                paypal_reduced : "24FSN4XCEZETL",
                price_reduced : 15,
                img_src:"./assets/img/packs/don.jpg"}
}

$(function() {
  var pack = packs[QueryString.pack];

  $("#photo").attr("src", pack.img_src);
  $("#paypal-code").attr("value", pack.paypal_reduced);
});
