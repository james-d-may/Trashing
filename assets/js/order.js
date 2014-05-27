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
                paypal_reduced : "QT4U57ZZ8F8HY",
                price_reduced : 5,
                img_src:"./assets/img/packs/commoner2.jpg",
                inform: "<ul style='margin-left:20px'><li>1.75L of Conffetti</li><li>5 Party Poppers</li><li>1 Party Hat</li><li>1 Necklace</li><li>1 Party Blower</li></ul><br><br>"
              },
  commoner_test:
              { paypal_reduced : "ZBBGKJTFCXGMC",
                price_reduced : 5,
                img_src:"./assets/img/packs/commoner2.jpg"},
  scholar   : { paypal_full :"ECLP53ULF7JC4",
                price_full : 14,
                paypal_reduced : "MMDFB5943LCLA",
                price_reduced : 10,
                img_src:"./assets/img/packs/scholar2.jpg",
                inform: "<ul style='margin-left:20px'><li>2 Silly String Cans</li><li>1.75L of Confetti</li><li>15 Party Poppers</li><li>1 Water Gun</li><li>3 Party Hats</li><li>3 Necklaces</li><li>3 Party Blowers</li></ul>"
              },
  don       : { paypal_full :"LG2HZ5N5VLY3W",
                price_full : 20,
                paypal_reduced : "24FSN4XCEZETL",
                price_reduced : 15,
                img_src:"./assets/img/packs/don2.jpg",
                inform: "<ul style='margin-left:20px'><li>2 Silly String Cans</li><li>3.5L of Conffetti</li><li>2 Water Guns</li><li>25 Party Poppers</li><li>5 Party Hats</li><li>5 Necklaces</li><li>4 Party Blowers</li></ul>"
              }
}

function checkRef(r) {
  var pack = packs[QueryString.pack];
  var now = new Date();
  var deadline = new Date(2014, 5, 30, 0, 0, 0, 0);
  var reduced = now < deadline;

  if (isValid(r)) {
    reduced = true;
    $("#paypal-ref").attr("value", r);
    console.log("yes");
    $(".glyphicon-ok").attr("display", "inherit");
    $(".glyphicon-remove").attr("display", "none");

  } else {
    $("#paypal-ref").attr("value", "");
    console.log("no");
    $(".glyphicon-ok").attr("display", "none");
    $(".glyphicon-remove").attr("display", "inherit");
  }
    
  $("#paypal-code").attr("value", pack.paypal_reduced);
  document.getElementById('price').innerHTML +=
    "£" + (reduced ? pack.price_reduced : pack.price_full);
}

function isValid(r) {
  if (r == undefined) return false;

  var code = parseInt(r);
  if (code == NaN) return false;
  if (!((100000000 <= code) & (code <= 999999999))) return false;

  var cb, bb, tb, b, t;
  cb = code % 10;
  bb = Math.floor(code / 10) % 10;
  tb = Math.floor(code / 100) % 10;
  if (((tb + bb) % 10) != cb) return false;

  b = Math.floor(code / 1000) % 1000;
  t = Math.floor(code / 1000000);
  if (((b % 10) + (Math.floor(b / 10) % 10) + Math.floor(b / 100)) % 10 != bb) return false;
  if (((t % 10) + (Math.floor(t / 10) % 10) + Math.floor(t / 100)) % 10 != tb) return false;

  return true;
}


// Load pack information on load
$(function() {
  var pack = packs[QueryString.pack];
  $("#photo").attr("src", pack.img_src);
  document.getElementById('description').innerHTML += pack.inform;

  $('#refcode').bind('input', function() {
      checkRef($(this).val());
  });

  if (QueryString.ref != undefined) {
    $("#refcode").attr("value", QueryString.ref);
    checkRef(QueryString.ref);
  }
});
