import $ from "jquery";
import FusionManifestElement from "./FusionManifestElement";

export default function createQTIXML(codeItem, rootDir, ObjItemSerie) {
    console.log(ObjItemSerie);

    for (var i = 0; i < ObjItemSerie.length; i++) {
        var Qindex = "Q" + (i + 1);
        var shortQ = Object.keys(ObjItemSerie[i][Qindex])[0].substring(0, 20);
        var ans =  ObjItemSerie[i][Qindex].Ans;
        var questionType = ObjItemSerie[i][Qindex]['type'] || 'choiceInteraction';
        var maxChoices=0;
        var QTIXML_Header =
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p2 http://www.imsglobal.org/xsd/qti/qtiv2p2/imsqti_v2p2.xsd" identifier="' + Qindex + '"' +
            ' title="' + Qindex + '-' + shortQ + '" label="' + Qindex + '" xml:lang="en-US" adaptive="false" timeDependent="false" toolName="TAO" toolVersion="3.2.0-RC2">';

        var Intitulex = Object.keys(ObjItemSerie[i][Qindex])[0]; // Item intitulé
        var totalQti;

        if (questionType === 'matchInteraction') {
            const matchData = ObjItemSerie[i][Qindex];
            const rows      = matchData.matchRows  || [];
            const cols      = matchData.matchCols  || [];
            const assoc     = matchData.matchAssoc || [];
            const maxAssoc  = assoc.length;

            let corrValues = '';
            for (const a of assoc) {
                corrValues += '<value><![CDATA[r_' + (a.rowIdx + 1) + ' c_' + (a.colIdx + 1) + ']]></value>';
            }
            // correctResponse requires at least one <value>; omit it entirely when no correct associations
            const correctResponseBlock = corrValues.length > 0
                ? '<correctResponse>' + corrValues + '</correctResponse>'
                : '';

            let rowChoices = '';
            rows.forEach(function (label, idx) {
                rowChoices += '<simpleAssociableChoice identifier="r_' + (idx + 1) + '" fixed="false" showHide="show" matchMax="0" matchMin="0">' + label + '</simpleAssociableChoice>';
            });

            let colChoices = '';
            cols.forEach(function (label, idx) {
                colChoices += '<simpleAssociableChoice identifier="c_' + (idx + 1) + '" fixed="false" showHide="show" matchMax="0" matchMin="0">' + label + '</simpleAssociableChoice>';
            });

            totalQti = QTIXML_Header +
                '<responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="directedPair">' +
                correctResponseBlock +
                '</responseDeclaration>' +
                '<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float" normalMaximum="1"/>' +
                '<outcomeDeclaration identifier="MAXSCORE" cardinality="single" baseType="float">' +
                '<defaultValue><value>1</value></defaultValue></outcomeDeclaration>' +
                '<itemBody><div class="grid-row"><div class="col-12">' +
                '<matchInteraction responseIdentifier="RESPONSE" shuffle="false" maxAssociations="' + maxAssoc + '" minAssociations="0">' +
                '<prompt>' + Intitulex + '</prompt>' +
                '<simpleMatchSet>' + rowChoices + '</simpleMatchSet>' +
                '<simpleMatchSet>' + colChoices + '</simpleMatchSet>' +
                '</matchInteraction></div></div></itemBody>' +
                '<responseProcessing template="http://www.imsglobal.org/question/qti_v2p2/rptemplates/match_correct"/>' +
                '</assessmentItem>';

        } else if (questionType === 'extendedTextInteraction') {
            console.log("ExtendedText - Open question");
            totalQti = QTIXML_Header +
                '<responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string"/>' +
                '<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float" normalMaximum="0"/>' +
                '<outcomeDeclaration identifier="MAXSCORE" cardinality="single" baseType="float">' +
                '<defaultValue><value>0</value></defaultValue>' +
                '</outcomeDeclaration>' +
                '<itemBody>' +
                '<div class="grid-row"><div class="col-12">' +
                '<extendedTextInteraction format="plain" responseIdentifier="RESPONSE">' +
                '<prompt>' + Intitulex + '</prompt>' +
                '</extendedTextInteraction>' +
                '</div></div></itemBody>' +
                '<responseProcessing template="http://www.imsglobal.org/question/qti_v2p2/rptemplates/match_correct"/>' +
                '</assessmentItem>';
        } else {

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
                    '<value><![CDATA[choice_' + ObjItemSerie[i][Qindex].Ans + ']]></value>' +
                    '</correctResponse>';
                maxChoices = 1;
            }

            return RespDec;
        }

        var ResponseDeclaration =  ResponseDeclarationBuilder(ans)

        var AnswerNb = ObjItemSerie[i][Qindex][Intitulex].length + 1;
        var mapline;
        var maplineSet = "";

        var bodyQTI = '</responseDeclaration>' +
            '<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float" normalMaximum="1"/>' +
            '<outcomeDeclaration identifier="MAXSCORE" cardinality="single" baseType="float">' +
            '<defaultValue>' +
            '<value>1</value>' +
            '</defaultValue>' +
            '</outcomeDeclaration>' +
            '<itemBody>' +
            '<div class="grid-row">' +
            '<div class="col-12">' +
            '<choiceInteraction responseIdentifier="RESPONSE" shuffle="true" maxChoices="' + maxChoices+'" minChoices="0" orientation="vertical">';
        var realQuestion = '<prompt><h1>' + Intitulex + '</h1></prompt>';
        var ansLine;
        var ansSet = '';
        for (var y = 1; y < AnswerNb; y++) {
            ansLine = '<simpleChoice identifier="choice_' + y + '" fixed="false" showHide="show">' + ObjItemSerie[i][Qindex][Intitulex][y - 1] + '</simpleChoice>';
            ansSet = ansSet + ansLine;
        }
        var qtiFooter = ' </choiceInteraction></div></div></itemBody><responseProcessing template="http://www.imsglobal.org/question/qti_v2p2/rptemplates/match_correct"/></assessmentItem>';
        totalQti = QTIXML_Header + ResponseDeclaration + maplineSet + bodyQTI + realQuestion + ansSet + qtiFooter;
        maplineSet = "";
        ansSet = "";

        } // end choiceInteraction branch

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
                console.log('QTI Content Written');
                FusionManifestElement(codeItem, rootDir, ObjItemSerie);
               
            }
        });


    }

}