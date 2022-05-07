import $ from "jquery";

export default function zipDownloader() {
   window.open(document.URL + rootDir + "/qti.zip");
    //window.location = document.URL + rootDir + "/qti.zip";
    $("#zipDownloader").prop("disabled", true);
    setTimeout(() => {
        $("#cleanAll").prop("disabled", false);
    }, 3000);

}