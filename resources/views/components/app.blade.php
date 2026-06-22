<div class="main" style="margin-left:100px; margin-top:15px">

    {{-- Format rules panel (collapsible) --}}
    <div class="row Wexample">
        <div class="col">
            <h3>Exemple :</h3>
            <p>Dans votre document Word, utilisez :</p>
            <ul>
                <li><b>Liste numérotée</b> pour les questions</li>
                <li><b>Liste à puces</b> (indentée) pour les réponses</li>
                <li><b>Gras</b> sur la bonne réponse</li>
            </ul>
            <pre style="background:#f8f9fa; border:1px solid #dee2e6; border-radius:4px; padding:12px; margin-top:10px;">
1. Quelle est la capitale de la France ?
   • Londres
   • <b>Paris</b>   ← en gras dans Word
   • Berlin
   • Madrid

2. Quel est le symbole chimique de l'eau ?
   • CO₂
   • <b>H₂O</b>   ← en gras dans Word
   • NaCl
            </pre>
        </div>
        <div class="col">
            <div class="closer">X</div>
            <h3>Règles</h3>
            <ol>
                <li>Questions : liste numérotée Word (style « List Number »)</li>
                <li>Réponses : liste à puces Word (style « List Bullet ») sous chaque question</li>
                <li>Bonne réponse : texte en <b>gras</b> dans Word</li>
                <li>Plusieurs bonnes réponses possibles : mettre plusieurs réponses en gras</li>
            </ol>
        </div>
    </div>

    {{-- Header row --}}
    <div class="row">
        <div class="col">
            <a target="_blank" href="https://www.wiquid.fr"><img src="img/logow2QTI.png" alt="logo w2qti"
                    style="margin-bottom: 10px;"></a>
            <div class="waitdiv"><img id="wait" src="img/wait.gif" alt="wait logo" width="50px"
                    style="display:none"></div>
        </div>
        <div class="col">
            <p>Bienvenue dans le convertisseur Word → QTI. Cet outil génère un package ZIP compatible
                <a target="_blank" href="https://www.taotesting.com/fr/">TAO</a> et tout autre
                logiciel supportant le format QTI.</p>
            <p>
                <span title="Cliquer pour voir le format" class="checkFormat">Voir les règles de format</span>
                &nbsp;|&nbsp;
                <a href="{{ asset('cmod.docx') }}">Télécharger le modèle Word (.docx)</a>
            </p>
        </div>
    </div>

    {{-- Main row --}}
    <div class="row">
        <div class="col">
            <div id="dropZone" class="upload-zone p-4 text-center"
                 onclick="document.getElementById('docxFile').click()">
                <p class="mb-2" style="font-size:2rem;">🗂️</p>
                <p class="mb-2">Glissez votre fichier <b>.docx</b> ici, ou</p>
                <label for="docxFile" class="btn btn-outline-primary mb-2"
                       onclick="event.stopPropagation()">Choisir un fichier</label>
                <input type="file" id="docxFile" accept=".docx" class="d-none">
                <p class="text-muted mb-0" id="fileName">Aucun fichier sélectionné</p>
            </div>
        </div>

        <div class="col">
            <ol>
                <li id="zipli">
                    <button id="zipper" disabled="disabled" type="button"
                        class="btn btn-secondary packager">Créer et télécharger le package</button>
                    <span id="downloadDone">✔️</span>
                </li>
            </ol>
            <hr>
            <button type="button" class="btn btn-info checkFormat">Voir les règles de format</button>

            <div class="Qnb mt-3"></div>
            <div class="itemDescription"></div>
            <div class="errormessage mt-2"></div>
        </div>
    </div>

    {{-- JSON output row --}}
    <div class="row mt-3">
        <div class="col">
            <textarea name="result" id="result" cols="80" rows="10"
                placeholder="Le JSON de conversion apparaîtra ici"></textarea>
        </div>
        <div class="col">
            <h3>Résultat JSON</h3>
            <p class="text-muted">Généré par JSON.stringify — peut être validé sur <a href="https://jsonlint.com/" target="_blank">jsonlint.com</a></p>
        </div>
    </div>

</div>
