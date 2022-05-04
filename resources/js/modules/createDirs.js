import $ from "jquery";
import createQTIXML from "./createQTIXML";

export default function createDirs(codeItem, rootDir, ObjItemSerie) {
    console.log(codeItem);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        data: ({ data: codeItem, dirname: rootDir, ObjItemSerie }),
        url: 'createDirs',
        success: function (data) {
            createQTIXML(codeItem, rootDir, ObjItemSerie)
            console.log('Directory created')
        }
    });
}