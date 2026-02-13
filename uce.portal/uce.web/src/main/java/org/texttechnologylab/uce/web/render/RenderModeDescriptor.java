package org.texttechnologylab.uce.web.render;

import java.util.Objects;

/**
 * Runtime representation of a render mode entry (typically loaded from
 * {@link org.texttechnologylab.uce.common.config.corpusConfig.RenderModeConfig}).
 */
public final class RenderModeDescriptor {
    private final String key;
    private final String name;
    private final String handler;
    private final String description;

    public RenderModeDescriptor(String key, String name, String handler, String description) {
        this.key = Objects.requireNonNull(key, "key");
        this.name = Objects.requireNonNull(name, "name");
        this.handler = Objects.requireNonNull(handler, "handler");
        this.description = description;
    }

    public String key() {
        return key;
    }

    public String name() {
        return name;
    }

    public String handler() {
        return handler;
    }

    public String description() {
        return description;
    }
}
