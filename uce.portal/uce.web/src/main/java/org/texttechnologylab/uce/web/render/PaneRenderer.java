package org.texttechnologylab.uce.web.render;

/**
 * A strategy that knows how to populate the middle (and optionally right) pane
 * for a particular render mode.
 */
@FunctionalInterface
public interface PaneRenderer {

    /**
     * Populates the UI panes based on the provided {@link RenderContext}.
     *
     * @throws RenderException if the renderer cannot satisfy the request.
     */
    RenderResult render(RenderContext context) throws RenderException;
}
