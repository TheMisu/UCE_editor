package org.texttechnologylab.uce.web.freeMarker;

import io.javalin.http.Context;
import org.apache.logging.log4j.Logger;
import org.texttechnologylab.uce.common.exceptions.DocumentAccessDeniedException;
import org.texttechnologylab.uce.web.LanguageResources;

import java.util.HashMap;
import java.util.Map;

public final class AccessDeniedRenderer {

    private static final String DEFAULT_MESSAGE_KEY = "documentAccessDeniedError";
    private static final String DEFAULT_TEMPLATE = "documentAccessDenied.ftl";
    private static final String DEFAULT_FALLBACK_MESSAGE = "You do not have permission to access this resource.";

    private AccessDeniedRenderer() {}

    public static void render(Context ctx,
                              DocumentAccessDeniedException cause,
                              Logger logger,
                              String logMessage) {
        render(ctx, cause, logger, logMessage, DEFAULT_MESSAGE_KEY);
    }

    public static void render(Context ctx,
                              DocumentAccessDeniedException cause,
                              Logger logger) {
        render(ctx, cause, logger, null, DEFAULT_MESSAGE_KEY);
    }

    public static void render(Context ctx,
                              DocumentAccessDeniedException cause,
                              Logger logger,
                              String logMessage,
                              String languageKey) {
        if (logger != null && cause != null) {
            logger.warn("{} documentId={} (principal={})",
                    logMessage == null ? "Access denied" : logMessage,
                    cause.getDocumentId(),
                    cause.getPrincipal(),
                    cause);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("languageResource", buildLanguageResources(ctx));
        payload.put("information", resolveInformation((LanguageResources) payload.get("languageResource"), languageKey));
        payload.put("requestId", ctx.attribute("id"));

        ctx.status(403);
        ctx.render(DEFAULT_TEMPLATE, payload);
    }

    private static LanguageResources buildLanguageResources(Context ctx) {
        try {
            return LanguageResources.fromRequest(ctx);
        } catch (Exception ex) {
            return null;
        }
    }

    private static String resolveInformation(LanguageResources resources, String languageKey) {
        if (resources == null) {
            return DEFAULT_FALLBACK_MESSAGE;
        }

        var keyToUse = languageKey != null ? languageKey : DEFAULT_MESSAGE_KEY;
        try {
            return resources.get(keyToUse);
        } catch (Exception ex) {
            return DEFAULT_FALLBACK_MESSAGE;
        }
    }
}
