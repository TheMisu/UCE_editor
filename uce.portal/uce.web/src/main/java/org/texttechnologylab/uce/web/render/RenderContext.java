package org.texttechnologylab.uce.web.render;

import org.texttechnologylab.uce.common.models.corpus.Corpus;
import org.texttechnologylab.uce.common.models.corpus.Document;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Container for all information a renderer might need. Besides the explicit
 * corpus/document references, callers can attach arbitrary payloads keyed by
 * their type to avoid bloating the API whenever new data becomes relevant.
 */
public final class RenderContext {

    private final Corpus corpus;
    private final Document document;
    private final Map<Class<?>, Object> payloads;

    public RenderContext(Corpus corpus,
                         Document document,
                         Map<Class<?>, Object> payloads) {
        this.corpus = Objects.requireNonNull(corpus, "corpus");
        this.document = Objects.requireNonNull(document, "document");
        this.payloads = Collections.unmodifiableMap(new HashMap<>(payloads));
    }

    public Corpus corpus() {
        return corpus;
    }

    public Document document() {
        return document;
    }

    public <T> Optional<T> payload(Class<T> type) {
        Objects.requireNonNull(type, "type");
        var value = payloads.get(type);
        if (value == null) {
            return Optional.empty();
        }
        return Optional.of(type.cast(value));
    }

    public <T> T requirePayload(Class<T> type) throws RenderException {
        return payload(type)
                .orElseThrow(() -> new RenderException(
                        "Render context is missing payload of type " + type.getName()));
    }

    public static Builder builder(Corpus corpus, Document document) {
        return new Builder(corpus, document);
    }

    public static final class Builder {
        private final Corpus corpus;
        private final Document document;
        private final Map<Class<?>, Object> payloads = new HashMap<>();

        private Builder(Corpus corpus, Document document) {
            this.corpus = Objects.requireNonNull(corpus, "corpus");
            this.document = Objects.requireNonNull(document, "document");
        }

        public <T> Builder payload(Class<T> type, T value) {
            payloads.put(type, value);
            return this;
        }

        public RenderContext build() {
            return new RenderContext(corpus, document, payloads);
        }
    }
}
