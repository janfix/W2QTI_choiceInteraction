import $ from "jquery";
import createDirs from "./createDirs";
import zipper from "./zipper";
//import cleanAll from "./cleanAll";

export default function createRootDir(rootDir, codeItem, ObjItemSerie) {
   rootDir = "rootPackage_" + Date.now();
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
           createDirs(codeItem, rootDir, ObjItemSerie)
            $("#zipper").on("click", function () {
                zipper(rootDir);
            })
            $(".cleaner").on("click", function () {
                //cleanAll(codeItem, rootDir, ObjItemSerie);
                //cleanAll(rootDir,data);
            })
        }
    });
}