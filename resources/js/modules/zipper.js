import $ from "jquery";
import cleanAll from "./cleanAll";

export default function zipper(codeItem, rootDir, ObjItemSerie) {
    console.log("From Zipper")
    $("#wait").show();
    
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        data: ({ dirname: rootDir }),
        url: 'qtizipper',
        success: function (data) {
            const downloadUrl = window.location.origin + '/' + data;
            $('#downloadLink')
                .attr('href', downloadUrl)
                .show();
            $('#downloadLink').one('click', function () {
                setTimeout(() => {
                    cleanAll(rootDir, data);
                    $('#downloadLink').hide();
                }, 8000);
            });
            setTimeout(() => {
                $("#wait").hide();
                $("#zipper").prop("disabled", true);
                $("#downloadDone").show();
            }, 500);
        }
    });

}