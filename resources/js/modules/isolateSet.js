import $ from "jquery";
import createRootDir from "./ createRootDir";
import createDirs from "./createDirs";

export default function isolateSet(codeItem, itemSerie, ObjItemSerie, rootDir) {
    var wsource = $(".wsource").val();
    var sourceLine = wsource.split("\n");
    var response = [];
    var question = [];
    var item = {};
    var itemAnswer = [];
    var goodAnswer = [];
    var rootDir;
    var itAnsChecker = [];
    var itemType;

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
            question = sourceLine[i].split(". ");
            console.log(question[1])
            question[1] = question[1].replace("'", "\'");
            question[1] = question[1].replace('"', '\`');
            //console.log(question[1])
            item = 'Q' + codeItem + '": {"' + question[1] + '":[';
            codeItem = codeItem + 1;
            //console.log(item);
        }

        function onlySpaces(str) {
            return str.trim().length === 0;
        }

        var onlySpaceInLine = onlySpaces(sourceLine[i]);
        if (onlySpaceInLine) {
            sourceLine[i] = "";
        }

        if (sourceLine[i] != '' && !(sourceLine[i].charAt(0) > 0)) {
            response = sourceLine[i].split(". ");
            console.log(response)
            response[1] = response[1].replace("'", "\'");
            response[1] = response[1].replace('"', '\`');
            //Space Cleaner after *
            response[1] = response[1].trim();


            if (response[1].slice(-1) == "*") {
                response[1] = response[1].slice(0, -1);
                goodAnswer.push('"' + response[1] + '"');
                itAnsChecker.push(response[1]);
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

            item = ',{"' + item + itemAnswer + '],"Ans" : [' + goodAnswer + ']}}';
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
    console.log(itemSerie);

    try {
        ObjItemSerie = JSON.parse(itemSerie);
    } catch (error) {
        //console.log(error)
        $(".errormessage").html("<b><ul><li style='color:red'>ERROR</li><li>Check all your * : CTRL+F and search *+space(s) (one or more), the * must be the last character of your line.</li><li>Verify if you have just one empty line at the end of your text</li><li>After the Number/Letter you must have a point and 1 space</li></u></b>  1️⃣ Clean your text, 2️⃣ copy it, 3️⃣ reload the page and 4️⃣ paste! 5️⃣ Think to clean also your word file.");
    }

console.log(ObjItemSerie);

    $("#result").val(JSON.stringify(ObjItemSerie));
    $(".Qnb").html("Number of questions found : " + (codeItem - 1));
    $(".itemDescription").html("Number of right answers found : " + itAnsChecker.length)

    return createRootDir(rootDir, codeItem, ObjItemSerie)
}