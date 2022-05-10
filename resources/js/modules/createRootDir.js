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
<<<<<<< HEAD:resources/js/modules/createRootDir.js
            console.log(rootDir)
=======
            console.log(rootDir);
            createDirs(rootDir, pages, pagesSet);
>>>>>>> 74ff5d2b13e865c8c1e62726816075f311ee8446:resources/js/modules/ createRootDir.js
            
            $("#zipper").on("click", function () {
                zipper(rootDir);
            })
        }
    });
}