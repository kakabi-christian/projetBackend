# 1. Image de base avec Apache (OBLIGATOIRE pour servir /storage)
FROM php:8.2-apache

# 2. Dépendances système + extensions PHP nécessaires à Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip exif bcmath gd

# 3. Activer mod_rewrite (Laravel)
RUN a2enmod rewrite

# 4. Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Dossier de travail Apache
WORKDIR /var/www/html

# 6. Copier le projet Laravel
COPY . .

# 7. Installer les dépendances Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 8. Créer le lien storage → public/storage
RUN php artisan storage:link || true

# 9. Permissions Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

# 10. Apache doit pointer vers /public
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80

# 11. Lancement Apache
CMD ["apache2-foreground"]
