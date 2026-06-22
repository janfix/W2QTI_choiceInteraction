import { Tooltip, Toast, Popover } from 'bootstrap';
import $ from "jquery";
import parseDocx from './modules/docxParser';

// Format rules panel toggle
$(".checkFormat").on("click", function () {
    $(".Wexample").slideToggle(300);
});
$(".closer").on("click", function () {
    $(".Wexample").slideUp(300);
});

// Drag & drop on upload zone
$('#dropZone').on('dragover', function (e) {
    e.preventDefault();
    $(this).addClass('dragover');
}).on('dragleave drop', function (e) {
    e.preventDefault();
    $(this).removeClass('dragover');
    if (e.type === 'drop') {
        const file = e.originalEvent.dataTransfer.files[0];
        if (file && file.name.endsWith('.docx')) {
            handleFile(file);
        }
    }
});

// File input change
$('#docxFile').on('change', function (e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

// Clear file selection
$('#clearFile').on('click', function () {
    resetFileState();
});

function handleFile(file) {
    $('#fileName').text(file.name);
    $('#filebox').css('display', 'flex');
    $('#dropZone').hide();
    $(".errormessage").html("");
    $(".Qnb").html("");
    $(".itemDescription").html("");
    $("#downloadDone").hide();
    $("#zipper").prop("disabled", true);
    parseDocx(file);
}

function resetFileState() {
    $('#docxFile').val('');
    $('#filebox').hide();
    $('#dropZone').show();
    $(".errormessage").html("");
    $(".Qnb").html("");
    $(".itemDescription").html("");
    $("#downloadDone").hide();
    $("#zipper").prop("disabled", true);
    $("#result").val('');
    $("#wait").hide();
}
