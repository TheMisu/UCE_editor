package org.texttechnologylab.uce.common.models.dto;

import java.util.List;

/**
 * DTO for document analysis pipeline responses.
 * Used after the pipeline analyzed an edited document
 */
public class ReanalysisResponseDto {

    private boolean success;
    private String message;
    private String documentId;
    private long corpusId;
    private List<String> modelsUsed;
    private String errorDetails;

    /**
     * Empty constructor, not used
     */
    public ReanalysisResponseDto() {
    }


    /**
     * Constructor for the response DTO
     * @param success A boolean showing whether the analysis succeeded or not
     * @param message A status message regarding the analysis pipeline
     */
    public ReanalysisResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    /**
     * Constructs a response for the successful analysis of an edited text
     *
     * @param documentId ID of the reanalyzed document
     * @param corpusId   ID of the corpus
     * @param modelsUsed Models that were applied
     * @return Response DTO with success=true
     */
    public static ReanalysisResponseDto success(String documentId, long corpusId, List<String> modelsUsed) {
        var response = new ReanalysisResponseDto(true, "Document reanalyzed successfully");
        response.setDocumentId(documentId);
        response.setCorpusId(corpusId);
        response.setModelsUsed(modelsUsed);
        return response;
    }

    /**
     * Constructs a response for the failed analysis of an edited text
     *
     * @param message      The errror message displayed to the user
     * @param errorDetails Detailed error info
     * @return Response DTO with success=false
     */
    public static ReanalysisResponseDto error(String message, String errorDetails) {
        var response = new ReanalysisResponseDto(false, message);
        response.setErrorDetails(errorDetails);
        return response;
    }

    /**
     * Gets the analysis' status (sucess/failure)
     * @return The analysis pipeline's status
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * Sets the analysis pipeline's status
     * @param success The analysis pipeline's status
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }

    /**
     * Gets the response message the user will see
     * @return The response message the user will see
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the response message the user will see
     * @param message The response message to be set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Gets the edited document's ID
     * @return The edited document's ID
     */
    public String getDocumentId() {
        return documentId;
    }

    /**
     * Sets the edited document's ID
     * @param documentId The edited document's ID to be set
     */
    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    /**
     * Gets the corpus ID of the edited document
     * @return The corpus ID of the edited document
     */
    public long getCorpusId() {
        return corpusId;
    }

    /**
     * Sets the corpus ID of the edited document
     * @param corpusId The corpus ID to be set
     */
    public void setCorpusId(long corpusId) {
        this.corpusId = corpusId;
    }

    /**
     * Gets the models used when analyzing the edited document
     * @return A list with the models used to analyze the edited document
     */
    public List<String> getModelsUsed() {
        return modelsUsed;
    }

    /**
     * Sets the models used to analyze the edited document
     * @param modelsUsed A list with the models used to analyze the document
     */
    public void setModelsUsed(List<String> modelsUsed) {
        this.modelsUsed = modelsUsed;
    }

    /**
     * Gets error details if the pipeline failed executing
     * @return The error details raised by the pipeline's failure
     */
    public String getErrorDetails() {
        return errorDetails;
    }

    /**
     * Sets the error details if the pipeline failed executing
     * @param errorDetails The error details to be set
     */
    public void setErrorDetails(String errorDetails) {
        this.errorDetails = errorDetails;
    }
}
