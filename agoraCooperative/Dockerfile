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
# 2. Apache : forcer MPM_PREFORK
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
# 6. Copier le code Laravel
# ================================
COPY . .

# ================================
# 7. Créer les dossiers nécessaires à Laravel
# (IMPORTANT pour éviter les erreurs 500)
# ================================
RUN mkdir -p storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache

# ================================
# 8. Installer les dépendances PHP
# ================================
RUN composer install --no-interaction --optimize-autoloader --no-dev

# ================================
# 9. Permissions Laravel
# ================================
RUN chown -R www-data:www-data storage bootstrap/cache

# ================================
# 10. Port HTTP
# ================================
EXPOSE 80

# ================================
# 11. Lancer Apache
# ================================
CMD ["apache2-foreground"]
