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
        return sum + q[key].Ans.length;
    }, 0);

    $("#result").val(JSON.stringify(ObjItemSerie, null, 2));
    $(".Qnb").html("Nombre de questions trouvées : " + ObjItemSerie.length);
    $(".itemDescription").html("Nombre de bonnes réponses trouvées : " + totalCorrect);

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
        }
        // <p> and other tags between questions are ignored
    }

    return questions.map((q, i) => {
        const qKey = 'Q' + (i + 1);
        const entry = {};
        entry[qKey] = {};
        entry[qKey][q.text] = q.answers;
        entry[qKey]['Ans'] = q.correct;
        return entry;
    });
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
