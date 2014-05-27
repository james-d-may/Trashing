// Grab the query string parameters. (the customer pack selected on index.html)
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

// Each pack's information to be loaded dynamically based on user choice
var packs = {
  commoner  : { paypal_full :"GSF95ETJ38UG6",
                price_full : 7,
                paypal_reduced : "MHVB9E9EYLGXL",
                price_reduced : 5,
                img_src:"./assets/img/packs/commoner2.jpg",
                inform: "<ul><li>1.75L of Conffetti</li><li>5 Party Poppers</li><li>1 Party Hat</li><li>1 Necklace</li><li>1 Party Blower</li></ul><br><br>"
              },
  commoner_test:
              { paypal_reduced : "ZBBGKJTFCXGMC",
                price_reduced : 5,
                img_src:"./assets/img/packs/commoner2.jpg"},
  scholar   : { paypal_full :"ECLP53ULF7JC4",
                price_full : 14,
                paypal_reduced : "MMDFB5943LCLA",
                price_reduced : 10,
                img_src:"./assets/img/packs/scholar.jpg",
                inform: "<ul><li>2 Silly String Cans</li><li>1.75L of Confetti</li><li>15 Party Poppers</li><li>1 Water Gun</li><li>3 Party Hats</li><li>3 Necklaces</li><li>3 Party Blowers</li></ul>"
              },
  don       : { paypal_full :"LG2HZ5N5VLY3W",
                price_full : 20,
                paypal_reduced : "24FSN4XCEZETL",
                price_reduced : 15,
                img_src:"./assets/img/packs/don.jpg",
                inform: "<ul><li>2 Silly String Cans</li><li>3.5L of Conffetti</li><li>2 Water Guns</li><li>25 Party Poppers</li><li>5 Party Hats</li><li>5 Necklaces</li><li>4 Party Blowers</li></ul>"
              }
}

// Load pack information on load
$(function() {
  var pack = packs[QueryString.pack];

  $("#photo").attr("src", pack.img_src);
  $("#paypal-code").attr("value", pack.paypal_reduced);
  document.getElementById('description').innerHTML = pack.inform;
});
