package org.texttechnologylab.uce.web.render;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Result payload returned by a {@link PaneRenderer}. The template names are
 * kept abstract so callers can plug any engine (FreeMarker, Thymeleaf, etc.)
 * without coupling the renderer to a specific technology.
 */
public final class RenderResult {
    private final String middlePaneTemplate;
    private final Map<String, Object> middlePaneModel;
    private final String rightPaneTemplate;
    private final Map<String, Object> rightPaneModel;

    private RenderResult(Builder builder) {
        this.middlePaneTemplate = Objects.requireNonNull(builder.middlePaneTemplate, "middlePaneTemplate");
        this.middlePaneModel = Collections.unmodifiableMap(new HashMap<>(builder.middlePaneModel));
        if (builder.rightPaneTemplate != null) {
            this.rightPaneTemplate = builder.rightPaneTemplate;
            this.rightPaneModel = Collections.unmodifiableMap(new HashMap<>(builder.rightPaneModel));
        } else {
            this.rightPaneTemplate = null;
            this.rightPaneModel = Collections.emptyMap();
        }
    }

    public String getMiddlePaneTemplate() {
        return middlePaneTemplate;
    }

    public Map<String, Object> getMiddlePaneModel() {
        return middlePaneModel;
    }

    public String getRightPaneTemplate() {
        return rightPaneTemplate;
    }

    public Map<String, Object> getRightPaneModel() {
        return rightPaneModel;
    }

    public boolean hasRightPane() {
        return rightPaneTemplate != null;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static RenderResult middleOnly(String template, Map<String, Object> model) {
        return builder()
                .middlePane(template, model)
                .build();
    }

    public static final class Builder {
        private String middlePaneTemplate;
        private Map<String, Object> middlePaneModel = Map.of();
        private String rightPaneTemplate;
        private Map<String, Object> rightPaneModel = Map.of();

        public Builder middlePane(String template, Map<String, Object> model) {
            this.middlePaneTemplate = template;
            this.middlePaneModel = model != null ? model : Map.of();
            return this;
        }

        public Builder rightPane(String template, Map<String, Object> model) {
            this.rightPaneTemplate = template;
            this.rightPaneModel = model != null ? model : Map.of();
            return this;
        }

        public RenderResult build() {
            return new RenderResult(this);
        }
    }
}
