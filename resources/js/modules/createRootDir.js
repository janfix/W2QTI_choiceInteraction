import $ from "jquery";
import zipper from "./zipper";
import createDirs from "./createDirs";
//import cleanAll from "./cleanAll";

export default function createRootDir(rootDir, NBpages, pagesSet, codeItem) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        url: 'createRootDir',
        data: ({ dirname: rootDir }),
        success: function (data) {
            $("#wait").show();
            console.log(rootDir);
            createDirs(rootDir, NBpages, pagesSet, codeItem);
            
            $("#zipper").on("click", function () {
                zipper(rootDir);
            })
        }
    });
}