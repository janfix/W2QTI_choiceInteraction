import $ from "jquery";


export default function cleanAll(rootDir, zipFile){
$.ajax({
    type: "post",
    url: "cleaner",
    data: { dirname: rootDir, zipname: zipFile
},
    success: function (response) {
        console.log("cleaning all temporary files")
    }
});
}