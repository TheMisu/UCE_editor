import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

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
        this.initContainer();
        this.initEventListeners();
    }

    /**
     * Creates the editor UI
     *
     * The editor contains:
     *   - toolbar with Bold/Italic (prob not needed) and Save buttons
     *   - text editing area
     */
    initContainer() {
        this.editorContainer = document.createElement('div');
        this.editorContainer.className = 'tiptap-editor-container';
        this.editorContainer.innerHTML =
            `<div class="tiptap-toolbar">
                <button data-action="bold"><i class="fas fa-bold"></i></button>
                <button data-action="italic"><i class="fas fa-italic"></i></button>
                <button data-action="save" class="ml-auto btn btn-primary">Save</button>
                <button data-action="close"><i class="fas fa-times"></i></button>
            </div>
            <div class="tiptap-editor"></div>`;
        document.body.appendChild(this.editorContainer);
    }

    /**
     * Sets up event listeners for the text editor
     *
     * Supports:
     *   - opening the editor using the Edit Document button
     *   - performing certain actions using buttons on the editor's toolbar
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
                    case 'bold':
                        this.editor.chain().focus().toggleBold().run();
                        break;
                    case 'italic':
                        this.editor.chain().focus().toggleItalic().run();
                        break;
                    case 'save':
                        this.saveContent();
                        break;
                    case 'close':
                        this.closeEditor();
                        break;
                }
            }
        });
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
                    // for (let e = 0; e < emptyCount; e++) {
                    //     htmlFragments.push('<p></p>');
                    // }
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
            // content: fullText,
        });
        this.editorContainer.style.display = 'block';
    }

    /* Saves the content from the editor back into the original document structure.
    * It intelligently updates, adds, or removes paragraphs as needed.
    */
    saveContent() {
        const documentContent = document.querySelector('.document-content');
        if (documentContent && this.editor) {
            const newContentHTML = this.editor.getHTML();
            const temp = document.createElement('div');
            temp.innerHTML = newContentHTML;
            const newParagraphs = Array.from(temp.querySelectorAll('p'));

            const oldParagraphs = Array.from(documentContent.querySelectorAll('.page-content .paragraph'));
            const pageContents = documentContent.querySelectorAll('.page-content');

            const oldParagraphsCount = oldParagraphs.length;
            const newParagraphsCount = newParagraphs.length;

            // Update existing paragraphs with the new content.
            const minCount = Math.min(oldParagraphsCount, newParagraphsCount);
            for (let i = 0; i < minCount; i++) {
                oldParagraphs[i].innerHTML = newParagraphs[i].innerHTML;
            }

            if (newParagraphsCount > oldParagraphsCount) {
                // If there are new paragraphs, add them to the last page.
                const lastPage = pageContents.length > 0 ? pageContents[pageContents.length - 1] : null;
                if (lastPage) {
                    for (let i = oldParagraphsCount; i < newParagraphsCount; i++) {
                        const paraDiv = document.createElement('div');
                        paraDiv.className = 'paragraph';
                        paraDiv.innerHTML = newParagraphs[i].innerHTML;
                        lastPage.appendChild(paraDiv);
                    }
                }
            } else if (newParagraphsCount < oldParagraphsCount) {
                // If paragraphs were removed, delete the extra ones from the DOM.
                for (let i = newParagraphsCount; i < oldParagraphsCount; i++) {
                    oldParagraphs[i].remove();
                }
            }
        }
        this.closeEditor();
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
