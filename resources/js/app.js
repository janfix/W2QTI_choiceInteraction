import { Tooltip, Toast, Popover } from 'bootstrap';
import $ from "jquery";
import parseDocx from './modules/docxParser';

// Format rules panel toggle
$(".checkFormat").on("click", function () {
    $(".Wexample").slideToggle(400);
});
$(".closer").on("click", function () {
    $(".Wexample").slideToggle(400);
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

function handleFile(file) {
    $('#fileName').text(file.name);
    $(".errormessage").html("");
    parseDocx(file);
}
