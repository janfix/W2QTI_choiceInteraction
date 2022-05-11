import $ from "jquery";
import zipper from "./zipper";

export default function FusionManifestElement(codeItem, rootDir, itemNB) {
    console.log("Fusion");
    var manifestHeader = '<?xml version="1.0"?><manifest xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 http://www.imsglobal.org/xsd/qti/qtiv2p2/qtiv2p2_imscpv1p2_v1p0.xsd" identifier="MANIFEST-tao5a50bb4d8d03b0-35882734"><metadata><schema>QTIv2.2 Package</schema><schemaversion>1.0.0</schemaversion></metadata><organizations/><resources>';
    var manifestRessource
    var manifestAllRessources = '';
    var manifestFooter = ' </resources></manifest>';
    var manifest;

    for (var i = 0; i < itemNB; i++) {
        var Qindex = "Q" + (i + 1);
        if (i == itemNB) {
            console.log("last Set");
            manifestRessource =
                '<resource identifier="' + Qindex + '" type="imsqti_item_xmlv2p2" href="' + Qindex + '/qti.xml">' +
                '<file href="' + Qindex + '/qti.xml" />' +
                /* '<file href="' + Qindex + '/style/custom/tao-user-styles.css" />'+*/
                '</resource>';
            manifestAllRessources = manifestAllRessources + '\n' + manifestRessource;
        } else {
            manifestRessource =
                '<resource identifier="' + Qindex + '" type="imsqti_item_xmlv2p2" href="' + Qindex + '/qti.xml">' +
                '<file href="' + Qindex + '/qti.xml" />' +
                '</resource>';
            manifestAllRessources = manifestAllRessources + '\n' + manifestRessource;
        }
    }
    manifest = manifestHeader + manifestAllRessources + manifestFooter;


    //Send To Php create Manifest File

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        data: ({ data: manifest, dirname: rootDir }),
        url: 'createManifest',
        success: function (data) {
            $(".launcher").prop("disabled", true);
            $("#zipper").prop("disabled", false);
            $("#wait").hide();
            $("#convertDone").show();
            console.log('Manifest xml Written');
        }
    });
}