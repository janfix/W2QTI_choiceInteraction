<div class="main" style="margin-left:100px; margin-top:15px">
    <div class="row Wexample">
        <div class="col ">
            <h3>Example :</h3>
            <textarea name="wsource" id="wsource1" cols="80" rows="8" readonly>
    1. La formazione del cromosoma Philadelphia è il risultato:
    a. di una traslocazione reciproca bilanciata tra i cromosomi 9 e 22*
    b. di una duplicazione del cromosoma 22
    c. di una non disgiunzione
    d. di una inversione del cromosoma 9
    
    2. Quale delle seguenti forme leucemiche si associa più frequentemente a coagulazione intravascolare disseminata?:
    a. Leucemia monocitica acuta (M5)
    b. Leucemia mielomonocitica (M4)
    c. Leucemia promielocitica acuta (M3)*
    d. Leucemia mieloide acuta (M2)
    
    
    
                    </textarea>
        </div>
        <div class="col">
            <div class="closer">X</div>
            <h3>Rules</h3>
            <ol>
                <li>Question : Number + point + 1 space + CONTENT + END OF PARAGRAPH</li>
                <li>Answers : letter + point + 1 space + CONTENT + END OF PARAGRAPH</li>
                <li>Right answer : got a * before the END OF PARAGRAPH </li>
                <li>Question/answers set SEPARATOR : one empty line</li>
                <li>End of the document : just ONE LINE empty</li>
            </ol>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="formoption">
                <h3>Choose your options</h3>
                <!-- <p>Your choice can be modified in TAO editor for each item. As it is a batch treatment choose here the most frequent options.</p>  -->
                <div class="row mb-3">
                    <div class="col-3">
                        <div class="form-floating">
                            <select id="orientation" class="form-select form-select" aria-label=".form-select-sm example">
                                <option value="vertical">Vertical</option>
                                <option value="horizontal">Horizontal</option>
                            </select>
                            <label for="floatingSelect">Item orientation</label>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-check">
                            <input checked class="form-check-input" type="checkbox" id="shuffleChoice">
                            <label class="form-check-label" for="shuffleChoice">
                                Shuffle choices
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"  id="timeDep">
                            <label class="form-check-label" for="timeDep">
                                Time dependent
                            </label>
                        </div>
                    </div>
                </div>
                <div hidden class="row mb-2">
                    <div class="col-2">
                       <label for="itemGroup">Question(s) per page</label>
                        <input type="number" class="form-control" id="itemPerPage" placeholder="1" value="1">
                    </div>
                </div>
            </div>
            <div class="waitdiv"><img id="wait" src="img/wait.gif" alt="wait logo" width="50px" style="display:none">
            </div>
        </div>
        <div class="col">
            <p>Welcome to the Word -> QTI converter for Choice interaction (single or multichoice). This converter
                generates an item zip
                package for the <a target="_blank" href="https://www.taotesting.com/fr/">TAO platform</a>, or any
                platform that can import QTI format.</p>
            <p>
                Your word document must respect a simple format. <span title="click to expand Model"
                    class="checkFormat">Check the format</span>, modify your document and then paste your work in the
                text area. Please stay under 100 questions in a row.
                <a href="https://www.wiquid.fr/projects/w2qti/cmod.docx">You can download here a Word.docx modele to
                    help you.</a>
            </p>

            


        </div>
    </div>



    <div class="row">
        <div class="col">
            <textarea name="wsource" id="wsource" class="wsource" cols="80" rows="30"
                placeholder="Paste here your word document"></textarea>
        </div>
        <div class="col">
            <h3>Build your package step by step</h3>
            <ol>
                <li>Choose your options</li>
                <li>Copy/paste your item respecting the format</li>
                <li><button type="button" class="btn btn-primary launcher">Convert to QTI</button><span
                        id="convertDone">✔️</span></li>
                <li id="zipli"><button id="zipper" disabled="disabled" type="button"
                        class="btn btn-secondary packager">Create and Download your Package</button><span
                        id="downloadDone">✔️</span></li>
                <li hidden> <button id="zipDownloader" disabled="disabled" type="button"
                        class="btn btn-danger downloader">Download your Package</li>
                <li hidden> <button id="cleanAll" disabled="disabled" type="button"
                        class="btn btn-success cleaner">Clean temporary files</button></li>
            </ol>
            <hr>
            <button type="button" class="btn btn-info checkFormat">Display format rules</button>
            <hr>
            <p>In case of difficulties, enter in analytic mode : </p>
            <h4>Analytics mode</h4>
            <button onclick="location.reload();" type="button" class="btn btn-primary">Reload page</button>
            <button onclick="isolateSet()" type="button" class="btn btn-primary">Convert to JSON</button>
            <p></p>
            <p>You can check the JSON validity here :<a href="https://jsonlint.com/"
                    target="_blank">https://jsonlint.com/</a> </p>

            <div class="Qnb"></div>
            <div class="itemDescription"></div>
            <div class="errormessage"></div>


        </div>
    </div>
    <div class="row">
        <div class="col">
            <textarea name="result" id="result" cols="80" rows="10"
                placeholder="Here result's JSON conversion process"></textarea>
        </div>
        <div class="col">
            <h3>Results comments</h3>
            <p>text generated with Json Object stringify</p>
        </div>
    </div>

</div>