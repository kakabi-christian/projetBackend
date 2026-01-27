# ================================
# IMAGE DE BASE
# ================================
FROM php:8.2-apache

# ================================
# 1. Dépendances système + extensions PHP
# ================================
RUN set -eux; \
    echo "==> Mise à jour des paquets et installation des extensions PHP"; \
    apt-get update; \
    apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip unzip git; \
    echo "==> Configuration GD"; \
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    echo "==> Installation des extensions GD, PDO, PDO_MYSQL"; \
    docker-php-ext-install gd pdo pdo_mysql; \
    echo "==> Nettoyage des fichiers temporaires"; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*

# ================================
# 2. Apache : forcer MPM_PREFORK + rewrite
# ================================
RUN set -eux; \
    echo "==> Configuration Apache: MPM_PREFORK et rewrite"; \
    a2dismod mpm_event mpm_worker mpm_itk || true; \
    a2enmod mpm_prefork rewrite

# ================================
# 3. Dossier de travail
# ================================
WORKDIR /var/www/html
RUN echo "==> Dossier de travail défini à /var/www/html"

# ================================
# 4. Apache DocumentRoot → /public (Laravel)
# ================================
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN set -eux; \
    echo "==> Mise à jour des configs Apache pour DocumentRoot"; \
    sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf; \
    sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# ================================
# 5. Installer Composer
# ================================
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN echo "==> Composer installé"

# ================================
# 6. Copier uniquement les fichiers Composer
# ================================
COPY composer.json composer.lock* ./
RUN echo "==> Fichiers composer.json et composer.lock copiés"

# ================================
# 7. Installer les dépendances PHP seulement si composer.json existe
# ================================
RUN set -eux; \
    if [ -f composer.json ]; then \
        echo "==> Installation des dépendances PHP via Composer"; \
        composer install --no-interaction --optimize-autoloader --no-dev; \
    else \
        echo "==> Aucun composer.json trouvé, pas d'installation"; \
    fi

# ================================
# 8. Copier le reste du code Laravel
# ================================
COPY . .
RUN echo "==> Tous les fichiers Laravel copiés"

# ================================
# 9. Créer les dossiers nécessaires à Laravel
# ================================
RUN set -eux; \
    echo "==> Création des dossiers de stockage et cache"; \
    mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache

# ================================
# 10. Permissions Laravel
# ================================
RUN set -eux; \
    echo "==> Définition des permissions"; \
    chown -R www-data:www-data storage bootstrap/cache

# ================================
# 11. Port HTTP
# ================================
EXPOSE 80
RUN echo "==> Port 80 exposé"

# ================================
# 12. Lancer Apache
# ================================
CMD set -eux; \
    echo "==> Démarrage d'Apache en premier plan"; \
    apache2-foreground
