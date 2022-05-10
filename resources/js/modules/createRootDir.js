import $ from "jquery";
import zipper from "./zipper";
import createDirs from "./createDirs";
//import cleanAll from "./cleanAll";

export default function createRootDir(rootDir, pages, pagesSet) {
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
            createDirs(rootDir, pages, pagesSet);
            
            $("#zipper").on("click", function () {
                zipper(rootDir);
            })
        }
    });
}