// You can specify which plugins you need
import $ from "jquery";
import isolateSet from './modules/isolateSet';




$(".checkFormat").on("click", function (event) {
    $(".Wexample").slideToggle(400);
});

$(".closer").on("click", function (event) {
    $(".Wexample").slideToggle(400);
});

//-------------------------------------------


var codeItem = 1;
var itemSerie = "";
var ObjItemSerie;
var rootDir;

$(".launcher").on("click", function(){
    launch();
})





function launch( ){
    isolateSet(codeItem, itemSerie, ObjItemSerie, rootDir);   
}




//------------------------------------------
