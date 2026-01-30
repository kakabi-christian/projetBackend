# 1. Image de base : PHP avec extensions nécessaires pour Laravel
FROM php:8.2-fpm-alpine

# 2. Installation des dépendances système et extensions PHP
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    oniguruma-dev \
    $PHPIZE_DEPS

RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# 3. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Dossier de travail
WORKDIR /var/www

# 5. Copie du code
COPY . .

# 6. Installation des dépendances Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 7. Permissions pour Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# 🔥 8. CRÉATION DU LIEN SYMBOLIQUE storage → public/storage
RUN php artisan storage:link || true

# 9. Exposition du port
EXPOSE 80

# 10. Lancement de Laravel
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-80}
