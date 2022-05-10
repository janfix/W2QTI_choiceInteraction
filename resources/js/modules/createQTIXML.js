import $ from "jquery";
import createDirs from "./createDirs";
import createRootDir from "./createRootDir";
import FusionManifestElement from "./FusionManifestElement";

export default function createQTIXML(codeItem, pagesSet) {

    var shuffleChoice = $("#shuffleChoice").prop("checked");
    var timeDep = $("#timeDep").prop("checked");
    var orientation = $("#orientation").val();
    var totalQti;
    var ansSet;
  

    var ResponseDeclaration = "";

    //console.log(pagesSet.length)
    //console.log(pagesSet)
    var CumulIndex = 0;
    var AllQindex = "";
   

    //FOLDER STRUCTURE TO BUILD
    var rootDirActive = "rootPackage_" + Date.now();
    createRootDir(rootDirActive, pagesSet.length, pagesSet);
    createDirs(rootDirActive, pagesSet.length, pagesSet);


   


    for (let i = 0; i < pagesSet.length; i++) {
        
        itemSetInPage(pagesSet[i], (i+1)); // PAGE PER
       
        console.log("---------------------------")
        AllQindex = ""; // Reset after a pageset is done
        ResponseDeclaration = "";// Reset after a pageset is done
    }
   
    //console.log(totalQti)


    function itemSetInPage(itemSet, Posi) {
        //console.log(itemSet)
        //console.log(itemSet.length)
       
        var Qindex = "";
        var allSets = "";
        var itemNB = itemSet.length;
        //console.log(itemNB);
        for (let i = 0; i < itemSet.length; i++) {
            //Item Level
            CumulIndex = CumulIndex + 1;
            Qindex = "Q" + CumulIndex;
            //console.log(Qindex);
            //console.log(itemSet[i]);
            /* 
            console.log(CumulIndex)
           
            console.log(i);
            console.log(typeof itemSet[i])
            console.log(itemSet[i][Qindex]);
            console.log(itemSet[i][Qindex].Ans); */

            AllQindex = AllQindex + Qindex;
            var shortQ2 = itemSet[i].Q;
            var shortQ = JSON.stringify(shortQ2).substring(2, 25)
            var ans = itemSet[i].Ans;
            var maxChoices = 0;
            var RESPONSE = "RESPONSE_" + i;
            var QTIXML_Header =
                '<?xml version="1.0" encoding="UTF-8"?>' +
                '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2" xmlns:m="http://www.w3.org/1998/Math/MathML" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p2 http://www.imsglobal.org/xsd/qti/qtiv2p2/imsqti_v2p2.xsd" identifier="' + AllQindex + '"' +
                ' title="' + AllQindex + '" label="' + AllQindex + '" xml:lang="en-US" adaptive="false" timeDependent="' + timeDep + '" toolName="TAO" toolVersion="3.2.0-RC2">';


            function ResponseDeclarationBuilder(ans) {
                var ansLength = ans.length;
                var RespDec, corrRespValue = "";
                if (ansLength > 1) {
                    console.log("CK-MULTI")
                    for (let y = 0; y < ans.length; y++) {
                        ans[y];
                        corrRespValue = '<value><![CDATA[choice_' + ans[y] + ']]></value>' + corrRespValue

                    }
                    RespDec = '<responseDeclaration identifier="' + RESPONSE + '" cardinality="multiple" baseType="identifier"><correctResponse >' + corrRespValue + '</correctResponse>';
                    maxChoices = 0;


                } else {
                    console.log("Radio - Single")
                    RespDec =
                        '<responseDeclaration identifier="' + RESPONSE + '" cardinality="single" baseType="identifier">' +
                        '<correctResponse>' +
                        '<value><![CDATA[choice_' + itemSet[i].Ans + ']]></value>' +
                        '</correctResponse>';
                    maxChoices = 1;
                }
                return RespDec;
            }


            ResponseDeclaration = ResponseDeclarationBuilder(ans) + '</responseDeclaration>' + ResponseDeclaration;




            var outcomeDeclaration =
                '<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float" normalMaximum="' + itemSet.length + '"/>' +
                '<outcomeDeclaration identifier="MAXSCORE" cardinality="single" baseType="float">' +
                '<defaultValue>' +
                '<value>' + itemSet.length + '</value>' +
                '</defaultValue>' +
                '</outcomeDeclaration>';



            var Qset =
                '<div class="grid-row">' +
                '<div class="col-12">' +
                '<choiceInteraction responseIdentifier="' + RESPONSE + '" shuffle="' + shuffleChoice + '" maxChoices="' + maxChoices + '" minChoices="0" orientation="' + orientation + '">';

            var Intitulex = itemSet[i].Question; // Item intitulé
            var AnswerNb = itemSet[i].Response.length;


            function answerSet() {
                console.log("CALL ANSWERSET")
                var realQuestion = '<prompt><h1>' + Intitulex + '</h1></prompt>';
                var ansLine;
                ansSet = '';
                for (var y = 0; y < AnswerNb; y++) {
                    ansLine = '<simpleChoice identifier="choice_' + y + '" fixed="false" showHide="show">' + itemSet[i].Response[y] + '</simpleChoice>';
                    ansSet = ansSet + ansLine;
                }
                ansSet = realQuestion + ansSet + "</choiceInteraction></div></div>";
                //console.log(ansSet);
                return ansSet;
            }

            allSets = allSets + Qset + answerSet();

        }

        //LEVEL : itemSet
        /* console.log(QTIXML_Header)
        console.log(ResponseDeclaration);
        console.log(outcomeDeclaration) */
        var qtiFooter = '</itemBody><responseProcessing template="http://www.imsglobal.org/question/qti_v2p2/rptemplates/match_correct"/></assessmentItem>';
        var bodyQTI = '<itemBody>' + allSets + qtiFooter;

        // PERFECTLY FORMATED PAGE FOR 1 ITEM THAT CONTAINS MANY QUESTIONS
        totalQti = QTIXML_Header + ResponseDeclaration + outcomeDeclaration + bodyQTI;



        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            data: ({ content: totalQti, page: "Q" + Posi, dirname: rootDirActive }),
            url: 'writeQTIContent',
            success: function (data) {
                console.log(data);
                FusionManifestElement(pagesSet.length, rootDirActive, pagesSet.length)

            }
        });



    }// end of itemSetInPage
}


/* LEVELS DEFINITION

Package
    Page
     ITEMSet
        Question
            AnswerSet

*/