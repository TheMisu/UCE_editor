package org.texttechnologylab.uce.web.render;

/**
 * Signals a recoverable problem while rendering a specialised pane view.
 */
public class RenderException extends Exception {
    public RenderException(String message) {
        super(message);
    }

    public RenderException(String message, Throwable cause) {
        super(message, cause);
    }
}
