package org.texttechnologylab.uce.common.models.authentication;

import lombok.Getter;
import lombok.Setter;

import java.util.EnumSet;
import java.util.Set;

import org.texttechnologylab.uce.common.security.DocumentAccessContext;

@Getter
@Setter
public class UceUser {
    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private boolean emailVerified;
    private String name;
    private String email;
    private String username;
    private Set<String> groups;
    private EnumSet<DocumentAccessContext.Role> roles;

    public String getAbbreviation() {
        if (name == null || name.trim().isEmpty()) {
            return "";
        }

        var parts = name.trim().split("\\s+");
        var abbrev = new StringBuilder();

        if (parts.length >= 2) {
            abbrev.append(Character.toUpperCase(parts[0].charAt(0)));
            abbrev.append(Character.toUpperCase(parts[1].charAt(0)));
        } else {
            var single = parts[0];
            if (single.length() == 1) {
                abbrev.append(Character.toUpperCase(single.charAt(0)));
            } else {
                abbrev.append(Character.toUpperCase(single.charAt(0)));
                abbrev.append(Character.toUpperCase(single.charAt(single.length() - 1)));
            }
        }

        return abbrev.toString();
    }

}
