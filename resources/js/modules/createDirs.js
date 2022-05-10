import $ from "jquery";
import createQTIXML from "./createQTIXML";


export default function createDirs(rootDir, NBpages, pagesSet, codeItem) {
    NBpages = NBpages+1;
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        data: ({ data: NBpages, dirname: rootDir, pagesSet }),
        url: 'createDirs',
        success: function (data) {
            console.log(NBpages);
            console.log('Directory created')
            createQTIXML(codeItem, pagesSet, rootDir)
        }
    }); 
}