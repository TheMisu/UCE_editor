export KCADM="docker exec -i uce-keycloak-auth /opt/keycloak/bin/kcadm.sh"
export KEYCLOAK_URL="http://localhost:8080/auth"
export ADMIN_REALM="master"
export ADMIN_USER="$KC_ADMIN_USERNAME"
export ADMIN_PASSWORD="$KC_ADMIN_PW"

./core_uce_users.sh hashes.txt provisioned-users.csv