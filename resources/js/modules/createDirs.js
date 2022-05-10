import $ from "jquery";


export default function createDirs(rootDir, codeItem, pagesSet) {
    codeItem = codeItem+1; // Avoid a Q0
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        data: ({ data: codeItem, dirname: rootDir, pagesSet }),
        url: 'createDirs',
        success: function (data) {
            console.log(codeItem);
            console.log('Directory created')
        }
    });
}