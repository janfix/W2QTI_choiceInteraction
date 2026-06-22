import mammoth from 'mammoth';
import $ from 'jquery';
import createRootDir from './ createRootDir';

export default function parseDocx(file) {
    $(".errormessage").html("");
    $(".Qnb").html("");
    $(".itemDescription").html("");
    $("#wait").show();

    const reader = new FileReader();
    reader.onload = function (e) {
        mammoth.convertToHtml({ arrayBuffer: e.target.result })
            .then(function (result) {
                try {
                    const ObjItemSerie = htmlToQtiJson(result.value);
                    onParsed(ObjItemSerie);
                } catch (err) {
                    $("#wait").hide();
                    $(".errormessage").html(
                        `<b style='color:red'>Erreur de parsing : ${err.message}</b>`
                    );
                }
            })
            .catch(function (err) {
                $("#wait").hide();
                $(".errormessage").html(
                    `<b style='color:red'>Impossible de lire le fichier : ${err.message}</b>`
                );
            });
    };
    reader.readAsArrayBuffer(file);
}

function onParsed(ObjItemSerie) {
    if (ObjItemSerie.length === 0) {
        $("#wait").hide();
        $(".errormessage").html(
            "<b style='color:red'>Aucune question détectée.</b><br>" +
            "Vérifiez que votre document utilise une <b>liste numérotée</b> " +
            "pour les questions et des <b>puces</b> pour les réponses, " +
            "avec la bonne réponse en <b>gras</b>."
        );
        return;
    }

    const totalCorrect = ObjItemSerie.reduce((sum, q) => {
        const key = Object.keys(q)[0];
        if (q[key].type === 'matchInteraction') {
            return sum + (q[key].matchAssoc ? q[key].matchAssoc.length : 0);
        }
        return sum + q[key].Ans.length;
    }, 0);

    const extendedCount = ObjItemSerie.filter(q => {
        const key = Object.keys(q)[0];
        return q[key].type === 'extendedTextInteraction';
    }).length;
    const matchCount = ObjItemSerie.filter(q => {
        const key = Object.keys(q)[0];
        return q[key].type === 'matchInteraction';
    }).length;
    const choiceCount = ObjItemSerie.length - extendedCount - matchCount;

    $("#result").val(JSON.stringify(ObjItemSerie, null, 2));
    $(".Qnb").html("Nombre de questions trouvées : " + ObjItemSerie.length);

    const typeParts = [];
    if (choiceCount > 0)   typeParts.push(choiceCount + " QCM");
    if (matchCount > 0)    typeParts.push(matchCount + " Match");
    if (extendedCount > 0) typeParts.push(extendedCount + " question(s) ouverte(s)");

    $(".itemDescription").html(
        "Nombre de bonnes associations/réponses : " + totalCorrect +
        (typeParts.length > 1
            ? "<br><small>" + typeParts.join(" — ") + "</small>"
            : "")
    );

    // codeItem = nb questions + 1, same convention as isolateSet.js
    createRootDir(null, ObjItemSerie.length + 1, ObjItemSerie);
}

function htmlToQtiJson(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const questions = [];
    const nodes = Array.from(doc.body.children);

    let currentQuestion = null;

    for (const node of nodes) {
        if (node.tagName === 'OL') {
            for (const li of node.querySelectorAll(':scope > li')) {
                const nestedList = li.querySelector(':scope > ul, :scope > ol');

                // Question text = text of <li> minus any nested sub-list
                let questionText = '';
                for (const child of li.childNodes) {
                    if (child !== nestedList) {
                        questionText += child.textContent;
                    }
                }
                questionText = questionText.trim();

                if (questionText) {
                    currentQuestion = { text: questionText, answers: [], correct: [] };
                    questions.push(currentQuestion);
                }

                // Nested answers (sub-list directly inside the <li>)
                if (nestedList && currentQuestion) {
                    extractAnswers(nestedList, currentQuestion);
                    currentQuestion = null;
                }
            }
        } else if (node.tagName === 'UL' && currentQuestion) {
            // Flat structure: bullet list following a numbered question
            extractAnswers(node, currentQuestion);
            currentQuestion = null;
        } else if (node.tagName === 'TABLE' && currentQuestion) {
            // Table following a numbered question → matchInteraction
            extractMatchTable(node, currentQuestion);
            currentQuestion = null;
        }
        // <p> and other tags between questions are ignored
    }

    return questions.map((q, i) => {
        const qKey = 'Q' + (i + 1);
        const entry = {};
        entry[qKey] = {};
        entry[qKey][q.text] = q.answers;
        entry[qKey]['Ans'] = q.correct;
        if (q.type === 'matchInteraction') {
            entry[qKey]['type']       = 'matchInteraction';
            entry[qKey]['matchRows']  = q.matchRows;
            entry[qKey]['matchCols']  = q.matchCols;
            entry[qKey]['matchAssoc'] = q.matchAssoc;
        } else {
            entry[qKey]['type'] = q.answers.length === 0 ? 'extendedTextInteraction' : 'choiceInteraction';
        }
        return entry;
    });
}

function extractMatchTable(tableNode, question) {
    const rows = Array.from(
        tableNode.querySelectorAll(':scope > tbody > tr, :scope > tr')
    );
    if (rows.length < 2) return;

    const headerCells = Array.from(rows[0].querySelectorAll(':scope > td, :scope > th'));
    const columnLabels = headerCells.slice(1).map(c => c.textContent.trim());

    const rowLabels = [];
    const associations = [];
    for (let r = 1; r < rows.length; r++) {
        const cells = Array.from(rows[r].querySelectorAll(':scope > td, :scope > th'));
        rowLabels.push(cells[0] ? cells[0].textContent.trim() : '');
        for (let c = 1; c < cells.length; c++) {
            if (cells[c].querySelector('strong') !== null) {
                associations.push({ rowIdx: r - 1, colIdx: c - 1 });
            }
        }
    }

    question.type       = 'matchInteraction';
    question.matchRows  = rowLabels;
    question.matchCols  = columnLabels;
    question.matchAssoc = associations;
}

function extractAnswers(listNode, question) {
    listNode.querySelectorAll(':scope > li').forEach(li => {
        const isBold = li.querySelector('strong') !== null;
        const text = li.textContent.trim();
        if (text) {
            question.answers.push(text);
            if (isBold) {
                question.correct.push(question.answers.length);
            }
        }
    });
}
