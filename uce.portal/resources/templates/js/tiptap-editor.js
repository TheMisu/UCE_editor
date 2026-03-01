import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { NlpModelTreeController } from './nlp-model-tree.js';

/**
 * Handles the text editing capabilities of the TipTap editor
 */
export class TipTapEditor {
    /**
     * Constructor for the text editor
     */
    constructor() {
        this.editorContainer = null;
        this.editor = null;
        this.currentDocumentID = null;
        this.nlpController = null;
        this.initContainer();
        this.initNlpMenu();
        this.initEventListeners();
    }

    /**
     * Creates the editor UI:
     *   - toolbar with Save and NLP buttons
     *   - text editing area
     *   - NLP Models menu
     */
    initContainer() {
        this.editorContainer = document.createElement('div');
        this.editorContainer.className = 'tiptap-editor-container';
        this.editorContainer.innerHTML =
            `<div class="tiptap-toolbar">
                <button data-action="toggle-nlp" class="btn btn-outline-secondary btn-sm" title="NLP Models">
                    <i class="fa fa-language"></i> NLP
                </button>
                <button data-action="save" class="ml-auto btn btn-primary">Save</button>
                <button data-action="close"><i class="fas fa-times"></i></button>
            </div>
            <div class="tiptap-editor-body">
                <div class="tiptap-nlp-panel"></div>
                <div class="tiptap-editor"></div>
            </div>`;
        document.body.appendChild(this.editorContainer);
    }

    /**
     * Moves the nlp-tools div from the ftl into the editor's NLP pane
     * and initializes the NlpModelTreeController
     */
    initNlpMenu() {
        // gets the panels to work with
        const sourcePanel = document.getElementById('nlp-tools');
        const targetPanel = this.editorContainer.querySelector('.tiptap-nlp-panel');

        if (sourcePanel && targetPanel) {
            // move source panel's children into the editor's panel then remove the source
            while (sourcePanel.firstChild) {
                targetPanel.appendChild(sourcePanel.firstChild);
            }
            sourcePanel.remove();

            // init the NlpModelTreeController
            const treeRoot = targetPanel.querySelector('.nlp-tools-tree');
            if (treeRoot) {
                this.nlpController = new NlpModelTreeController(treeRoot, {
                    factchecking: { wrapperId: 'editor-claim-field-wrapper', inputId: 'editor-claim-text' },
                    cohesion: { wrapperId: 'editor-text-field-wrapper', inputId: 'editor-coherence-text' },
                    stance: { wrapperId: 'editor-stance-field-wrapper', inputId: 'editor-stance-text' },
                    llm: { wrapperId: 'editor-llm-field-wrapper', inputId: 'editor-llm-text' }
                });
            }
        }
    }

    /**
     * Sets up event listeners for the text editor
     */
    initEventListeners() {
        // listener for the button that opens the editor
        document.querySelector('.edit-document-btn').addEventListener('click', () => {
            this.openEditor();
        });

        // listener for toolbar actions
        this.editorContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const action = button.dataset.action;
            if (action) {
                e.preventDefault();
                switch (action) {
                    case 'save':
                        this.saveContent();
                        break;
                    case 'close':
                        this.closeEditor();
                        break;
                    case 'toggle-nlp':
                        this.toggleNlpPanel();
                        break;
                }
            }
        });
    }

    /*
     * Toggles the visibility of the NLP model panel
     */
    toggleNlpPanel() {
        const panel = this.editorContainer.querySelector('.tiptap-nlp-panel');
        panel.classList.toggle('active');
        this.editorContainer.classList.toggle('nlp-expanded');
    }

    /**
    * Opens the editor and loads the document's fulltext (embedded in the page)
    */
    openEditor() {
        const readerContainer = document.querySelector('.reader-container');
        if (!readerContainer) {
            console.error("Can't find reader container to get document ID.");
            return;
        }
        this.currentDocumentID = parseInt(readerContainer.dataset.id, 10);
        if (isNaN(this.currentDocumentID)) {
            console.error("Can't get document ID from the page.");
            return;
        }

        let fullText = null;

        if (window.EMBEDDED_DOCUMENT_FULLTEXT !== undefined) {
            fullText = window.EMBEDDED_DOCUMENT_FULLTEXT;
        } else {
            console.log("Embedded document fulltext not found!");
        }

        console.log(fullText);
        let editorContent = '';

        // split the text into lines
        const rawLines = fullText.split('\n');

        // TipTap loads html elements as text
        const htmlFragments = [];
        let currentPara = [];       // lines that belong to the *current* paragraph

        // iterate through the raw text and format them to HTML
        for (let i = 0; i < rawLines.length; i++) {
            const line = rawLines[i];
            const trimmed = line.trim();

            if (trimmed === '') {
                let emptyCount = 1;
                while (i + emptyCount < rawLines.length && rawLines[i + emptyCount].trim() === '') {
                    emptyCount++;
                }
                i += emptyCount - 1;

                // 2 or more newlines will be rendered as empty <p>
                if (emptyCount >= 2) {
                    if (currentPara.length) {
                        htmlFragments.push(`<p>${currentPara.join('<br>')}</p>`);
                        currentPara = [];
                    }
                    htmlFragments.push('<p></p>');
                }

                // a single newline will be turned into a <br>
                else {
                    currentPara.push('');
                }
                continue;
            }

            currentPara.push(line);
        }

        if (currentPara.length) {
            // turn the empty-string placeholders that came from a single blank line into <br>
            const finalLines = currentPara.map(l => (l === '' ? '<br>' : l));
            htmlFragments.push(`<p>${finalLines.join('')}</p>`);
        }

        // join everything into the editorContent
        editorContent = htmlFragments.join('');

        // initialize the editor with the formatted text content
        if (this.editor) {
            this.editor.destroy();
        }

        this.editor = new Editor({
            element: this.editorContainer.querySelector('.tiptap-editor'),
            extensions: [
                StarterKit.configure({
                    heading: false,
                    codeBlock: false
                }),
            ],
            content: editorContent,
        });
        this.editorContainer.style.display = 'flex';
    }

    /**
     * Sends the edited text to the reanalysis pipeline and refreshes the page
     * after the document is updated in the database
     */
    async saveContent() {
        // get edited text content
        const editedText = this.editor.getText();

        // get corpus and document ID from page
        const readerContainer = document.querySelector('.reader-container');
        let corpusId = null;
        let documentId = null;
        if (readerContainer) {
            corpusId = parseInt(readerContainer.dataset.corpusId, 10);
            documentId = readerContainer.dataset.documentId;
        }

        // collect selected models and special inputs
        const selectedModels = this.nlpController.getSelectedModels();
        const specialInputs = this.nlpController.getSpecialInputs();

        // make sure the user enters prompts for the special models
        if (this.nlpController) {
            if (this.nlpController.hasModelType('factchecking') && !specialInputs.inputClaim) {
                alert('Please enter a claim for the fact checking model.');
                return;
            }
            if (this.nlpController.hasModelType('cohesion') && !specialInputs.inputCoherence) {
                alert('Please enter text for the cohesion model.');
                return;
            }
            if (this.nlpController.hasModelType('stance') && !specialInputs.inputStance) {
                alert('Please enter a hypothesis for the stance model.');
                return;
            }
            if (this.nlpController.hasModelType('llm') && !specialInputs.inputLLM) {
                alert('Please enter a system prompt for the LLM model.');
                return;
            }
        }

        // show spinning animation during processing
        const saveBtn = this.editorContainer.querySelector('[data-action="save"]');
        const originalBtnText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            // send to backend for reanalysis
            const response = await fetch('/api/document/reanalyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentId: documentId,
                    corpusId: corpusId,
                    editedText: editedText,
                    language: "de",
                    selectedModels: selectedModels,
                    updateXmi: true,
                    inputClaim: specialInputs.inputClaim || null,
                    inputCoherence: specialInputs.inputCoherence || null,
                    inputStance: specialInputs.inputStance || null,
                    inputLLM: specialInputs.inputLLM || null
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Reanalysis failed');
            }

            console.log('Document reanalyzed successfully:', result);
            alert('Document saved and reanalyzed successfully!');
            window.location.reload();

        } catch (error) {
            console.error('Error saving document:', error);
            alert('Failed to save document: ' + error.message);
        } finally {
            // restore button state
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
    }

    /**
     * Destroys the editor instance and hides the editor container.
     */
    closeEditor() {
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
        this.editorContainer.style.display = 'none';
    }
}
