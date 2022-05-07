import $ from "jquery";
import cleanAll from "./cleanAll";

export default function zipper(rootDir) {
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
            window.open(document.URL + data);
            setTimeout(() => {
                $("#wait").hide();
                $("#zipper").prop("disabled", true);
                $(".cleaner").prop("disabled", false);
                $("#downloadDone").show();
                cleanAll(rootDir, data);
            }, 5000);
        }
    });

}