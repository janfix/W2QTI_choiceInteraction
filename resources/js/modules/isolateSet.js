import $ from "jquery";

import createRootDir from "./createRootDir";


export default function isolateSet(codeItem, itemSerie, ObjItemSerie, rootDir) {
    
    var wsource = $(".wsource").val();
    //Clean Double Quotes : 
    wsource = wsource.replace(/"/g, "'");
    
    var sourceLine = wsource.split("\n");
    var response = [];
    var question = [];
    var item = {};
    var itemAnswer = [];
    var goodAnswer = [];
    var itAnsChecker = [];

   


    Array.prototype.chunk = function (n) {
        if (!this.length) {
            return [];
        }
        return [this.slice(0, n)].concat(this.slice(n).chunk(n));
    };

    if (wsource.length == 0) {
        //$("#wait").hide();
        location.reload();
        return
    }


    for (var i = 0; i < (sourceLine.length); i++) {
        var lastLineLength = sourceLine[sourceLine.length - 1].length;
        var beforLastLineLenght = sourceLine[sourceLine.length - 2].length;
      

        if (lastLineLength > 0) {
            sourceLine[sourceLine.length - 1] = "";
        }

        if(beforLastLineLenght == 0){
            alert("It seems that you have 2 empty lines at the end off your items! Please keep just one !"); 
            return
        }

        // Début de Set
        if (sourceLine[i].charAt(0) > 0) {
            console.log("GetLine1");
            question = sourceLine[i].split("_ ");
            console.log(question[1])
            question[1] = question[1].replace("'", "\'");
            question[1] = question[1].replace('"', '\`');
            //console.log(question[1])
            //item = 'Q' + codeItem + '": {"Question" : ["' + question[1] + '"]}, "Response": [';
           
            item = '{"Q":[' + codeItem + '], "Question" : ["' + question[1] + '"], "Response": [';
            //item = 'Q' + codeItem + '": {"Question":[' + question[1];
            codeItem = codeItem + 1; 
            
        }

        function onlySpaces(str) {
            return str.trim().length === 0;
        }

        var onlySpaceInLine = onlySpaces(sourceLine[i]);
        if (onlySpaceInLine) {
            sourceLine[i] = "";
        }

        if (sourceLine[i] != '' && !(sourceLine[i].charAt(0) > 0)) {
            response = sourceLine[i].split("_ ");
            console.log(response)
            response[1] = response[1].replace("'", "\'");
            response[1] = response[1].replace('"', '\`');
            //Space Cleaner after *
            response[1] = response[1].trim();


            if (response[1].slice(-1) == "*") {
                response[1] = response[1].slice(0, -1);
                goodAnswer.push('"' + response[1] + '"');
                itAnsChecker.push(response[1]);
                console.log(goodAnswer)
            }
            itemAnswer.push('"' + response[1] + '"'); //Contains all Answers of all Questions
        }

        if (sourceLine[i].length == 0 || onlySpaceInLine) {
            for (var y = 0; y < itemAnswer.length; y++) {
                /* Comparaison of itemAnswer and goodAnswer if it match */
               /*  if (itemAnswer[y] == goodAnswer[0]) { 
                    goodAnswer[0] = (y + 1); //Write the good answer number in the set instead of Good Answer Text
                }
                console.log(goodAnswer) */

                //Solution  : LOOP in goodAnswer
                for (let z = 0; z < goodAnswer.length; z++) {
                    if (itemAnswer[y] == goodAnswer[z]) {
                        goodAnswer[z] = (y + 1); //Write the good answer number in the set instead of Good Answer Text
                    }
                } 
            }

            item = ',' + item + itemAnswer + '],"Ans" : [' + goodAnswer + ']}';
            //console.log(item);

            itemSerie = itemSerie + item;
            itemAnswer = [];
            goodAnswer = [];
        }

        // fin de set

        // ATTENTION IL FAUT UNE LIGNE ET UNE SEULE A LA FIN DU FICHIER
        /*  var content = wsource;
         var lastLine = content.substr(content.lastIndexOf("\n") + 1);
         console.log(lastLine.length); */

    }
    //Clean first comma
    //itemSerie[0] = itemSerie[0].substring(1);
    itemSerie = itemSerie.substring(1);
    
    itemSerie = "[" + itemSerie + "]";
    //console.log(itemSerie);

    try {
        ObjItemSerie = JSON.parse(itemSerie);
    } catch (error) {
        //console.log(error)
        $(".errormessage").html("<b><ul><li style='color:red'>ERROR</li><li>Check all your * : CTRL+F and search *+space(s) (one or more), the * must be the last character of your line.</li><li>Verify if you have just one empty line at the end of your text</li><li>After the Number/Letter you must have a point and 1 space</li></u></b>  1️⃣ Clean your text, 2️⃣ copy it, 3️⃣ reload the page and 4️⃣ paste! 5️⃣ Think to clean also your word file.");
    }

    $("#result").val(JSON.stringify(ObjItemSerie));
    $(".grouper").show();
    $(".Qnb").html("Number of questions found : " + (codeItem - 1));
    $(".itemDescription").html("Number of right answers found : " + itAnsChecker.length)

    
    var pageSet = ObjItemSerie; 
    
    $("#itemPerPage").on("change",function(){
        
        var pageNumb = (codeItem - 1)/ $(this).val();
        var resteQ = (codeItem - 1) % $(this).val();
        if ($(this).val() == 1){
            $("#RGroup").html("Each page will have one question.") 
            pageSet=ObjItemSerie.chunk($(this).val());
        }
        else if ($(this).val() == 0) { $("#RGroup").html("❌ No page is an impossible data!")  }
        else if ($(this).val() > codeItem - 1) { $("#RGroup").html("💥 Attention Empty screen(s) ! Too much pages for the number of questions")}
        else{
            if(resteQ == 0){
               $("#RGroup").html("📑 "+Math.trunc(pageNumb) + " page(s).");
               pageSet=ObjItemSerie.chunk($(this).val());
            }else{
               $("#RGroup").html(("📑 "+ (Math.trunc(pageNumb)+1)) + " pages with " + resteQ + " question(s) on the last page.")
                pageSet=ObjItemSerie.chunk($(this).val());
            }  
        }
    });

    //FOLDER STRUCTURE TO BUILD
    var rootDirActive = "rootPackage_" + Date.now();
    
    
    

    $(".tempoTest").on("click", function(e){
        e.preventDefault();

        console.log(pageSet)
       
        createRootDir(rootDirActive, pageSet.length, pageSet, codeItem);   
        //This is a new function attached to Array ->
       
    })

   

   
}