package org.texttechnologylab.uce.common.models.dto;

import java.util.List;

/**
 * DTO for document reanalysis requests.
 * Used when user edits a document and wants to re-run NLP analysis and update its DB entry.
 */
public class ReanalysisRequestDto {

    // document related attributes
    private String documentId;
    private long corpusId;
    private String editedText;
    private String language;
    private List<String> selectedModels;
    private boolean useOriginalModels;
    private boolean updateXmi;

    // special model inputs
    private String inputClaim;
    private String inputCoherence;
    private String inputStance;
    private String inputLLM;

    /**
     * Empty constructor for Gson
     */
    public ReanalysisRequestDto() {
    }

    /**
     * Returns the document's ID
     * @return A string representing the document's ID
     */
    public String getDocumentId() {
        return documentId;
    }

    /**
     * Sets the document's ID
     * @param documentId The document's ID to be set
     */
    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    /**
     * Gets the corpus ID of the document
     * @return The corpus ID of the document
     */
    public long getCorpusId() {
        return corpusId;
    }

    /**
     * Sets the corpus ID of the document
     * @param corpusId The corpus ID of the document
     */
    public void setCorpusId(long corpusId) {
        this.corpusId = corpusId;
    }

    /**
     * Gets the document's new/edited text
     * @return The document's edited text
     */
    public String getEditedText() {
        return editedText;
    }

    /**
     * Sets the document's edited text
     * @param editedText The document's edited text
     */
    public void setEditedText(String editedText) {
        this.editedText = editedText;
    }

    /**
     * Gets the document's language
     * @return The document's language
     */
    public String getLanguage() {
        return language;
    }

    /**
     * Sets the document's language
     * @param language The document's language
     */
    public void setLanguage(String language) {
        this.language = language;
    }

    /**
     * Gets the document's selected models
     * @return A list of the document's selected models
     */
    public List<String> getSelectedModels() {
        return selectedModels;
    }

    /**
     * Sets the documents selected models
     * @param selectedModels A list with the document's selected models
     */
    public void setSelectedModels(List<String> selectedModels) {
        this.selectedModels = selectedModels;
    }

    /**
     * Checks whether the pipeline should use the models the document was originally analyzed with
     * @return A boolean flag telling the pipeline whether to use the document's original models or not
     */
    public boolean isUseOriginalModels() {
        return useOriginalModels;
    }

    /**
     * Sets the boolean flag telling the pipeline to use the models initially used to analyze the document
     * @param useOriginalModels The boolean flag telling the pipeline what models to use
     */
    public void setUseOriginalModels(boolean useOriginalModels) {
        this.useOriginalModels = useOriginalModels;
    }

    /**
     * Checks whether the pipeline should also update the document's XMI in S3 storage
     * @return A boolean flag telling the pipeline whether to update the document's XMI in S3 storage or not
     */
    public boolean isUpdateXmi() {
        return updateXmi;
    }

    /**
     * Sets the boolean flag telling the pipeline to update the document's XMI is S3 storage
     * @param updateXmi  The boolean flag telling the pipeline to update the document's XMI in S3 storage
     */
    public void setUpdateXmi(boolean updateXmi) {
        this.updateXmi = updateXmi;
    }

    /**
     * Gets the input claim used for fact checking the document
     * @return The claim used for fact checking the document
     */
    public String getInputClaim() {
        return inputClaim;
    }

    /**
     * Sets the input claim for fact checking the document's text
     * @param inputClaim The input claim used for fact checking the document
     */
    public void setInputClaim(String inputClaim) {
        this.inputClaim = inputClaim;
    }

    /**
     * Gets input coherence text to be compared against the document's text
     * @return The input coherence text to be compared
     */
    public String getInputCoherence() {
        return inputCoherence;
    }

    /**
     * Sets the input coherence text to be compared against the document's text
     * @param inputCoherence The input coherence text to be set
     */
    public void setInputCoherence(String inputCoherence) {
        this.inputCoherence = inputCoherence;
    }

    /**
     * Gets the input stance text to (a hypothesis/claim) to check against the document's text
     * @return The input stance to check against the document's text
     */
    public String getInputStance() {
        return inputStance;
    }

    /**
     * Sets the input stance text to (a hypothesis/claim) to check against the document's text
     * @param inputStance  The input stance to be checked against the document's text
     */
    public void setInputStance(String inputStance) {
        this.inputStance = inputStance;
    }

    /**
     * Gets the system prompt that will be ran by an LLM on the document's text
     * @return The system prompt for an LLM
     */
    public String getInputLLM() {
        return inputLLM;
    }

    /**
     * Sets the system prompt that will be ran by an LLM on the document's text
     * @param inputLLM  The system prompt for an LLM
     */
    public void setInputLLM(String inputLLM) {
        this.inputLLM = inputLLM;
    }
}