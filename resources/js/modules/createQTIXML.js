import $ from "jquery";
import FusionManifestElement from "./FusionManifestElement";

export default function createQTIXML(codeItem, pagesSet, rootDirActive) {

    var shuffleChoice = $("#shuffleChoice").prop("checked");
    var timeDep = $("#timeDep").prop("checked");
    var orientation = $("#orientation").val();
    var totalQti;
    var ansSet;
  

    var ResponseDeclaration = "";
    var CumulIndex = 0;
    var AllQindex = "";

    for (let i = 0; i < pagesSet.length; i++) {
        
        itemSetInPage(pagesSet[i], (i+1)); // PAGE PER
       
        console.log("---------------------------")
        AllQindex = ""; // Reset after a pageset is done
        ResponseDeclaration = "";// Reset after a pageset is done
    }
   
    function itemSetInPage(itemSet, Posi) {
        //console.log(itemSet)
        //console.log(itemSet.length)
       
        var Qindex = "";
        var allSets = "";
        var ans;
        var itemNB = itemSet.length;
        if(typeof itemNB === "undefined"){
            itemNB = 1;
        }
        for (let i = 1; i < (itemNB+1); i++) {
            //Item Level
            CumulIndex = CumulIndex + 1;
            Qindex = "Q" + CumulIndex;

            AllQindex = AllQindex + Qindex;
            
            if (Array.isArray(itemSet)){
              ans = itemSet[i].Ans;
            } else{
              ans = itemSet.Ans  
            }
           
            console.log(ans)
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
                        console.log(ans[y]);
                        corrRespValue = '<value><![CDATA[choice_' + (ans[y]-1) + ']]></value>' + corrRespValue

                    }
                    RespDec = '<responseDeclaration identifier="' + RESPONSE + '" cardinality="multiple" baseType="identifier"><correctResponse >' + corrRespValue + '</correctResponse>';
                    maxChoices = 0;


                } else {
                    console.log("Radio - Single")

                    if (Array.isArray(itemSet)){
                        RespDec =
                            '<responseDeclaration identifier="' + RESPONSE + '" cardinality="single" baseType="identifier">' +
                            '<correctResponse>' +
                            '<value><![CDATA[choice_' + (itemSet[i].Ans - 1) + ']]></value>' +
                            '</correctResponse>';
                        maxChoices = 1;
                    }else{
                        RespDec =
                            '<responseDeclaration identifier="' + RESPONSE + '" cardinality="single" baseType="identifier">' +
                            '<correctResponse>' +
                            '<value><![CDATA[choice_' + (itemSet.Ans -1) + ']]></value>' +
                            '</correctResponse>';
                        maxChoices = 1;

                    }

                   
                }
                return RespDec;
            }


            ResponseDeclaration = ResponseDeclarationBuilder(ans) + '</responseDeclaration>' + ResponseDeclaration;




            var outcomeDeclaration =
                '<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float" normalMaximum="' + itemNB + '"/>' +
                '<outcomeDeclaration identifier="MAXSCORE" cardinality="single" baseType="float">' +
                '<defaultValue>' +
                '<value>' + itemNB + '</value>' +
                '</defaultValue>' +
                '</outcomeDeclaration>';



            var Qset =
                '<div class="grid-row">' +
                '<div class="col-12">' +
                '<choiceInteraction responseIdentifier="' + RESPONSE + '" shuffle="' + shuffleChoice + '" maxChoices="' + maxChoices + '" minChoices="0" orientation="' + orientation + '">';

            var Intitulex,AnswerNb;
            if (Array.isArray(itemSet)) {
            Intitulex = itemSet[i].Question; // Item intitulé
            AnswerNb = itemSet[i].Response.length;
            }
            else{
                Intitulex = itemSet.Question; // Item intitulé
                AnswerNb = itemSet.Response.length;
            }


            function answerSet() {
                //console.log("CALL ANSWERSET")
                var realQuestion = '<prompt>' + Intitulex + '</prompt>';
                var ansLine;
                ansSet = '';
                if (Array.isArray(itemSet)) {
                    for (var y = 0; y < AnswerNb; y++) {
                        ansLine = '<simpleChoice identifier="choice_' + y + '" fixed="false" showHide="show">' + itemSet[i].Response[y] + '</simpleChoice>';
                        ansSet = ansSet + ansLine;
                    }
                } else {
                    for (var y = 0; y < AnswerNb; y++) {
                        ansLine = '<simpleChoice identifier="choice_' + y + '" fixed="false" showHide="show">' + itemSet.Response[y] + '</simpleChoice>';
                        ansSet = ansSet + ansLine;
                    }
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
                //console.log(data);
                FusionManifestElement(pagesSet.length, rootDirActive, pagesSet.length);
                $("#createPack").show();

            }
        });



    }// end of itemSetInPage
}

