package org.texttechnologylab.uce.web.render;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple thread-safe registry that maps handler identifiers to renderer
 * implementations. This avoids sprinkling {@code if/else} chains throughout
 * the HTTP handlers.
 */
public final class RendererRegistry {

    private final Map<String, PaneRenderer> renderers = new ConcurrentHashMap<>();

    public RendererRegistry register(String handlerKey, PaneRenderer renderer) {
        Objects.requireNonNull(handlerKey, "handlerKey");
        Objects.requireNonNull(renderer, "renderer");
        renderers.put(handlerKey, renderer);
        return this;
    }

    public Optional<PaneRenderer> renderer(String handlerKey) {
        Objects.requireNonNull(handlerKey, "handlerKey");
        return Optional.ofNullable(renderers.get(handlerKey));
    }

    public PaneRenderer rendererOrDefault(String handlerKey, PaneRenderer fallback) {
        return renderer(handlerKey).orElse(fallback);
    }
}
