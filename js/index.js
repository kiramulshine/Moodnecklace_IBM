
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
// submit mood form, run accountSetup
document.addEventListener( "DOMContentLoaded", function(){
    document.querySelector('a#submitEnjoyment').addEventListener('click', saveEnjoymentHandler);

});

function saveEnjoymentHandler(){
    
    accountSetup( 'enjoyment' );
    window.location = "two.html" ;

    return true;
};


// **END FORM PAGE**

// **RETRIEVE DATA**
// accountSetup grab data from local storage

function accountSetup( cName ){
    console.log("Account Setup");
    var moodMap = document.getElementById('showPaletteOnly').value;
    console.log(moodMap);
    window.localStorage.setItem( cName , moodMap );
    return true;
}




