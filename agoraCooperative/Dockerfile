# 1. Image de base avec Apache
FROM php:8.2-apache

# 2. Dépendances système + extensions PHP pour Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip exif bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Activer mod_rewrite pour Laravel
RUN a2enmod rewrite

# 4. Forcer un seul MPM (ici event)
RUN a2dismod mpm_prefork || true \
    && a2enmod mpm_event

# 5. Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Dossier de travail
WORKDIR /var/www/html

# 7. Copier le projet Laravel
COPY . .

# 8. Installer les dépendances Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 9. Créer le lien storage → public/storage
RUN php artisan storage:link || true

# 10. Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# 11. Pointer Apache sur /public
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80

# 12. Lancement Apache
CMD ["apache2-foreground"]
