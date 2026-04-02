package org.texttechnologylab.uce.common.models.dto;

/**
 * DTO for in DB document creation
 * Used when uploading Word documents to UCE
 */
public class CreateDocumentRequestDto {
    private String text;
    private long corpusId;
    private String title;

    /**
     * Empty constructor
     */
    public CreateDocumentRequestDto() {
    }

    /**
     * Sets the document's text
     * @param text The text to be set
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * Gets the document's text
     * @return The text set for the document
     */
    public String getText() {
        return text;
    }

    /**
     * Sets the document's corpus ID
     * @param corpusId The document's corpus ID
     */
    public void setCorpusId(long corpusId) {
        this.corpusId = corpusId;
    }

    /**
     * Gets the document's corpus ID
     * @return The document's corpus ID
     */
    public long getCorpusId() {
        return corpusId;
    }

    /**
     * Sets the document's title
     * @param title The document's title
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gets the document's title
     * @return The document's title
     */
    public String getTitle() {
        return title;
    }
}
