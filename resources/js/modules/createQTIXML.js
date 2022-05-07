import $ from "jquery";
import FusionManifestElement from "./FusionManifestElement";

export default function createQTIXML(codeItem, rootDir, pageSet) {
    
    var shuffleChoice = $("#shuffleChoice").prop("checked");
    var timeDep = $("#timeDep").prop("checked");
    var orientation = $("#orientation").val();

    var ResponseDeclaration="";
    

    console.log(pageSet)
    for (let i = 0; i < pageSet.length; i++) {
        itemSetInPage(pageSet[i]);
        break
        
    }
    

function itemSetInPage(itemSet){
    console.log(itemSet)

    for (let i = 0; i < itemSet.length; i++) {
        console.log(i)
        var Qindex = "Q" + (i + 1);
        console.log(itemSet[i]);
        var shortQ = Object.keys(itemSet[i][Qindex])[0].substring(0, 20);
        var ans =  itemSet[i][Qindex].Ans;
        var maxChoices=0;
        var QTIXML_Header =
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2" xmlns:m="http://www.w3.org/1998/Math/MathML" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p2 http://www.imsglobal.org/xsd/qti/qtiv2p2/imsqti_v2p2.xsd" identifier="' + Qindex + '"' +
            ' title="' + Qindex + '-' + shortQ + '" label="' + Qindex + '" xml:lang="en-US" adaptive="false" timeDependent="' + timeDep +'" toolName="TAO" toolVersion="3.2.0-RC2">';
       
        
        function ResponseDeclarationBuilder(ans){
            var ansLength = ans.length;
            var RespDec, corrRespValue="";
            if (ansLength >1){
                console.log("CK-MULTI")
                for (let y = 0; y < ans.length; y++) {
                    ans[y];
                    corrRespValue = '<value><![CDATA[choice_' + ans[y] + ']]></value>' + corrRespValue
                    
                }
                RespDec = '<responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier"><correctResponse >' +corrRespValue + '</correctResponse>';
                maxChoices = 0;


            } else{
                console.log("Radio - Single")
                RespDec =
                    '<responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">' +
                    '<correctResponse>' +
                    '<value><![CDATA[choice_' + itemSet[i][Qindex].Ans + ']]></value>' +
                    '</correctResponse>';
                maxChoices = 1;
            }

            return RespDec;
        }    

        ResponseDeclaration = ResponseDeclarationBuilder(ans) +'</responseDeclaration>' + ResponseDeclaration;

        var Intitulex = Object.keys(itemSet[i][Qindex])[0]; // Item intitulé
        var AnswerNb = itemSet[i][Qindex][Intitulex].length + 1;
        var mapline;
        var maplineSet = "";

        var bodyQTI = 
            '<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float" normalMaximum="1"/>' +
            '<outcomeDeclaration identifier="MAXSCORE" cardinality="single" baseType="float">' +
            '<defaultValue>' +
            '<value>1</value>' +
            '</defaultValue>' +
            '</outcomeDeclaration>' +
            '<itemBody>' +
            '<div class="grid-row">' +
            '<div class="col-12">' +
            '<choiceInteraction responseIdentifier="RESPONSE" shuffle="' + shuffleChoice + '" maxChoices="' + maxChoices + '" minChoices="0" orientation="' + orientation +'">';
        var realQuestion = '<prompt><h1>' + Intitulex + '</h1></prompt>';
        var ansLine;
        var ansSet = '';
        for (var y = 1; y < AnswerNb; y++) {
            ansLine = '<simpleChoice identifier="choice_' + y + '" fixed="false" showHide="show">' + itemSet[i][Qindex][Intitulex][y - 1] + '</simpleChoice>';
            ansSet = ansSet + ansLine;
        }
        var qtiFooter = ' </choiceInteraction></div></div></itemBody><responseProcessing template="http://www.imsglobal.org/question/qti_v2p2/rptemplates/match_correct"/></assessmentItem>';
        var totalQti = QTIXML_Header + ResponseDeclaration + maplineSet + bodyQTI + realQuestion + ansSet + qtiFooter;
        maplineSet = "";
        ansSet = "";

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            data: ({ name: Qindex, data: totalQti, dirname: rootDir }),
            url: 'writeQTIContent',
            success: function (data) {
                FusionManifestElement(codeItem, rootDir, itemSet);
               
            }
        });


    }}

}