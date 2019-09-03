// **APP SET UP**

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

// **COLOR PICKER**
// color picker script pulling from spectrum.js jquery 

$(".basic").spectrum({
    showPaletteOnly: true,
    hideAfterPaletteSelect:true,
    change: function(color) {
        printColor(color);
    },
    palette: [
        ["#000000", "#606060", "#ffffff"],
        ["#ff0000", "#ff9900", "#ffff00"], 
        ["#00ff00", "#00ffff", "#00a5ff"], 
        ["#0013f9", "#131a6b", "#6a00ff"], 
        ["#9d00ff", "#f700b8", "#f4a1df"]
    ]
});
// $(".override").spectrum({
//     color: "yellow";
// });



$("#showPaletteOnly").spectrum({
    showPaletteOnly: true,
    hideAfterPaletteSelect:true,
    change: function(color) {
        printColor(color);
    },
    palette: [
        ["#000000", "#606060", "#ffffff"],
        ["#ff0000", "#ff9900", "#ffff00"], 
        ["#00ff00", "#00ffff", "#00a5ff"], 
        ["#0013f9", "#131a6b", "#6a00ff"], 
        ["#9d00ff", "#f700b8", "#f4a1df"]
    ]
});

// report chosen color in span above colorpicker
function printColor(color) {
   
   var text = color.toHex();    
   $(".label").text(text);
  console.log(text);   
  localStorage.setItem("currentColor", text);

};

// **FORM PAGES**
// submit enjoyment form, run accountSetup
document.addEventListener( "DOMContentLoaded", function(){
    document.querySelector('a#submitEnjoyment').addEventListener('click', saveEnjoymentHandler);

});

function saveEnjoymentHandler(){
    
    accountSetup( 'enjoyment' );
    window.location = "two.html" ;

    return true;
};

// submit sadness form, run accountSetup
document.addEventListener( "DOMContentLoaded", function(){
    document.querySelector('a#submitSadness').addEventListener('click', saveSadnessHandler);

});
 
function saveSadnessHandler(){
    
    accountSetup( 'sadness' );
    window.location = "three.html" ;

    return true;
};

// submit disgust form, run accountSetup
document.addEventListener( "DOMContentLoaded", function(){
    document.querySelector('a#submitDisgust').addEventListener('click', saveDisgustHandler);

});

function saveDisgustHandler(){
    
    accountSetup( 'disgust' );
    window.location = "four.html" ;

    return true;
};

// submit fear form, run accountSetup
document.addEventListener( "DOMContentLoaded", function(){
    document.querySelector('a#submitFear').addEventListener('click', saveFearHandler);

});

function saveFearHandler(){
    
    accountSetup( 'fear' );
    window.location = "five.html" ;

    return true;
};

// submit anger form, run accountSetup
document.addEventListener( "DOMContentLoaded", function(){
    document.querySelector('a#submitAnger').addEventListener('click', saveAngerHandler);

});

function saveAngerHandler(){
    
    accountSetup( 'anger' );
    window.location = "moodMap.html" ;

    return true;
};

// **END FORM PAGES**

// **RETRIEVE DATA**
// accountSetup grab data from local storage

function accountSetup( cName ){
    console.log("Account Setup");
    var moodMap = document.getElementById('showPaletteOnly').value;
    console.log(moodMap);
    window.localStorage.setItem( cName , moodMap );
    return true;
}




// **DATABASE SCRIPTS**
// setting up a database but nothing is currently being stored 
// should replace with connection to Watson IoT IBM Cloud and remove this script

var mydb;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;

    //var enjoyment = window.localStorage.getItem( "enjoyment" ) ;
    //console.log( enjoyment );
    //$( "body#enjoyment #color1" ).text( enjoyment );
    //$( "body#enjoyment .showPaletteOnly" ).val( enjoyment );


// create database
mydb = window.openDatabase(shortName, version, displayName, maxSize);

// create table in database
mydb.transaction(function(tx){
  tx.executeSql('CREATE TABLE IF NOT EXISTS moodMap(enjoyment TEXT NOT NULL, sadness TEXT NOT NULL, disgust TEXT NOT NULL, fear TEXT NOT NULL, anger TEXT NOT NULL);');
});




