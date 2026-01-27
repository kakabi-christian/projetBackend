FROM php:8.2-apache

# 1. Installation des dépendances système
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# 2. SE PLACER DANS LE DOSSIER AVANT TOUTE COPIE
WORKDIR /var/www/html

# 3. Activation du module rewrite
RUN a2enmod rewrite

# 4. Configuration Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Copie des fichiers de dépendances (Docker les cherche maintenant dans agoraCooperative/)
COPY composer.json composer.lock ./

# 7. Installation des dépendances (SANS les scripts pour l'instant)
RUN composer install --no-interaction --no-scripts --no-autoloader --no-dev

# 8. Copie du reste du code
COPY . .

# 9. Finalisation Composer et Permissions
RUN composer dump-autoload --optimize --no-dev
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

EXPOSE 80

CMD ["apache2-foreground"]