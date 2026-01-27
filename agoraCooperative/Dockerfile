# ================================
# IMAGE DE BASE
# ================================
FROM php:8.2-apache

# ================================
# 1. Dépendances système + extensions PHP
# ================================
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    zip unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ================================
# 2. Apache : forcer MPM_PREFORK + rewrite
# ================================
RUN a2dismod mpm_event mpm_worker mpm_itk || true \
    && a2enmod mpm_prefork rewrite

# ================================
# 3. Dossier de travail
# ================================
WORKDIR /var/www/html

# ================================
# 4. Apache DocumentRoot → /public (Laravel)
# ================================
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf \
 /etc/apache2/conf-available/*.conf

# ================================
# 5. Installer Composer
# ================================
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ================================
# 6. Copier seulement les fichiers Composer
# ================================
COPY composer.json composer.lock ./

# ================================
# 7. Installer les dépendances PHP
# ================================
RUN composer install --no-interaction --optimize-autoloader --no-dev

# ================================
# 8. Copier le reste du code Laravel
# ================================
COPY . .

# ================================
# 9. Créer les dossiers nécessaires à Laravel
# ================================
RUN mkdir -p storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache

# ================================
# 10. Permissions Laravel
# ================================
RUN chown -R www-data:www-data storage bootstrap/cache

# ================================
# 11. Port HTTP
# ================================
EXPOSE 80

# ================================
# 12. Lancer Apache
# ================================
CMD ["apache2-foreground"]
