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

# 2. Activation du module rewrite d'Apache
RUN a2enmod rewrite

# 3. Dossier de travail
WORKDIR /var/www/html

# 4. Configuration Apache (Fixer le chemin vers /public)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Copie spécifique des dépendances (Pour garantir la détection par Docker)
COPY composer.json composer.lock /var/www/html/

# 7. Installation des dépendances (Optimisée pour le cloud)
RUN composer install --no-interaction --no-scripts --no-autoloader --no-dev

# 8. Copie de tout le reste du projet
COPY . /var/www/html

# 9. Finalisation de l'autoloader
RUN composer dump-autoload --optimize --no-dev

# 10. Permissions pour Laravel et Logs vers la console Railway
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

EXPOSE 80

CMD ["apache2-foreground"]