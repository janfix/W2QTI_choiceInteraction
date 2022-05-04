// You can specify which plugins you need
import { Tooltip, Toast, Popover } from 'bootstrap';
import $ from "jquery";
import isolateSet from './modules/isolateSet';
import zipper from './modules/zipper';



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
