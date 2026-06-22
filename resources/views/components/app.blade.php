<main class="card">

    {{-- Barre guide --}}
    <div class="guide">
        <span class="tmpl">📄 <a href="{{ asset('cmod.docx') }}">Télécharger le modèle Word</a></span>
        <span class="checkFormat link">Voir les règles de format ▾</span>
    </div>

    {{-- Panneau règles de format (repliable) --}}
    <div class="Wexample">
        <button class="closer" title="Fermer">✕</button>

        <div class="wex-cols">
            {{-- QCM / Extended Text --}}
            <div>
                <h4>QCM &amp; Texte libre</h4>
                <p>Dans votre document Word, utilisez :</p>
                <ul>
                    <li><b>Liste numérotée</b> pour les questions</li>
                    <li><b>Liste à puces</b> (indentée) pour les réponses</li>
                    <li><b>Gras</b> sur la bonne réponse</li>
                    <li>Pas de liste → question ouverte (Extended Text)</li>
                </ul>
                <pre>1. Quelle est la capitale de la France ?
   • Londres
   • <b>Paris</b>   ← en gras dans Word
   • Berlin

2. Quel est le symbole de l'eau ?
   • CO₂
   • <b>H₂O</b>   ← en gras dans Word
   • NaCl</pre>
            </div>

            {{-- Match Interaction --}}
            <div>
                <h4>Match (tableau)</h4>
                <p>Pour un tableau de correspondance :</p>
                <ul>
                    <li><b>Liste numérotée</b> pour la question</li>
                    <li><b>Tableau Word</b> immédiatement après</li>
                    <li>1ère ligne = en-têtes de colonnes (1ère cellule vide)</li>
                    <li>1ère colonne = labels des lignes</li>
                    <li>Cellule correcte : mettre <b>X</b> (ou autre texte) <b>en gras</b></li>
                </ul>
                <pre>1. Associez chaque pays à sa capitale :

┌──────────┬──────────┬──────────┐
│          │ Paris    │ Berlin   │
├──────────┼──────────┼──────────┤
│ France   │  <b>X</b>        │          │
│ Allemagne│          │  <b>X</b>        │
└──────────┴──────────┴──────────┘

Le nombre de cases en gras fixe
le maxAssociations global.</pre>
            </div>

            {{-- Règles générales --}}
            <div>
                <h4>Règles communes</h4>
                <ol>
                    <li>Questions : liste numérotée Word (style « List Number »)</li>
                    <li>QCM : liste à puces (style « List Bullet ») sous la question</li>
                    <li>Bonne réponse QCM : texte en <b>gras</b></li>
                    <li>Plusieurs bonnes réponses : mettre plusieurs réponses en gras</li>
                    <li>Match : tableau Word juste après la question numérotée</li>
                    <li>Association correcte : cellule intérieure en <b>gras</b></li>
                </ol>
            </div>
        </div>
    </div>

    {{-- Zone de dépôt --}}
    <div id="dropZone" class="drop" onclick="document.getElementById('docxFile').click()">
        <div class="ico">📂</div>
        <p class="big">Glissez votre fichier <b>.docx</b> ici</p>
        <p class="sub">ou cliquez pour parcourir</p>
        <input type="file" id="docxFile" accept=".docx" hidden>
    </div>

    {{-- Fichier sélectionné --}}
    <div class="filebox" id="filebox">
        <span class="check">✓</span>
        <span id="fileName">document.docx</span>
        <button class="x" id="clearFile" title="Retirer">✕</button>
    </div>

    {{-- Bouton principal --}}
    <button class="btn-action" id="zipper" disabled>Créer le package ZIP</button>
    <a id="downloadLink" class="btn-action btn-download" href="#" style="display:none">Télécharger le ZIP</a>

    {{-- Chargement --}}
    <div id="wait" class="loading-status">
        <span class="spinner"></span> Conversion en cours…
    </div>

    {{-- Infos résultat --}}
    <div class="info-row">
        <span class="Qnb"></span>
        <span class="itemDescription"></span>
        <span id="downloadDone">✔️ Package téléchargé</span>
        <span id="convertDone"></span>
    </div>

    {{-- Messages d'erreur --}}
    <div class="errormessage"></div>

    {{-- JSON généré (repliable) --}}
    <details>
        <summary>Voir le JSON généré (avancé)</summary>
        <textarea name="result" id="result" placeholder="Le JSON de conversion apparaîtra ici" readonly></textarea>
    </details>

</main>
