// **MOODMAP VARIABLES**

// enjoyment get item from local storage
var enjoyment = window.localStorage.getItem( "enjoyment" );
console.log( enjoyment );
// $ enjoyment.toHex();
$( "#enjoyment span" ).text( enjoyment );

// sadness get item from local storage
var sadness = window.localStorage.getItem( "sadness" );
console.log( sadness );
$( "#sadness span" ).text( sadness );

// disgust get item from local storage
var disgust = window.localStorage.getItem( "disgust" );
console.log( disgust );
$( "#disgust span" ).text( disgust );

// fear get item from local storage
var fear = window.localStorage.getItem( "fear" );
console.log( fear );
$( "#fear span" ).text( fear );

// anger get item from local storage
var anger = window.localStorage.getItem( "anger" );
console.log( anger );
$( "#anger span" ).text( anger );







