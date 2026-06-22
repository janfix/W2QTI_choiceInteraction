import { Tooltip, Toast, Popover } from 'bootstrap';
import $ from "jquery";
import isolateSet from './modules/isolateSet';
import zipper from './modules/zipper';
import parseDocx from './modules/docxParser';

// Format rules panel toggle
$(".checkFormat").on("click", function () {
    $(".Wexample").slideToggle(400);
});
$(".closer").on("click", function () {
    $(".Wexample").slideToggle(400);
});

// Mode switching (Upload / Manuel)
$('.mode-tab').on('click', function () {
    $('.mode-tab').removeClass('active btn-primary').addClass('btn-outline-primary');
    $(this).addClass('active btn-primary').removeClass('btn-outline-primary');

    const target = $(this).data('target');
    $('.mode-pane').addClass('d-none');
    $(target).removeClass('d-none');

    // Show/hide the "Convert to QTI" button (only needed in manual mode)
    if (target === '#uploadMode') {
        $('#launcherLi').hide();
    } else {
        $('#launcherLi').show();
    }
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

// State for manual mode
var codeItem = 1;
var itemSerie = "";
var ObjItemSerie;
var rootDir;

$(".launcher").on("click", function () {
    isolateSet(codeItem, itemSerie, ObjItemSerie, rootDir);
});
