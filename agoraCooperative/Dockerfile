FROM php:8.2-apache

# 1. Installation des dépendances système
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    zip unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# 2. Activation du module rewrite d'Apache et FIX des modules MPM
RUN a2enmod rewrite
# Ce bloc règle l'erreur "More than one MPM loaded"
RUN a2dismod mpm_event && a2dismod mpm_worker && a2enmod mpm_prefork

# 3. Dossier de travail
WORKDIR /var/www/html

# 4. Configuration du DocumentRoot d'Apache (Pointé vers /public)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Copie du code
# On copie le contenu du dossier agoraCooperative dans /var/www/html
COPY ./agoraCooperative/ .

# 7. Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 8. Permissions pour Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Pré-optimisation au moment du build
RUN php artisan config:cache && php artisan route:cache

# 10. Redirection des logs vers la sortie standard de Railway
RUN ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

EXPOSE 80

# Lancement d'Apache
CMD ["apache2-foreground"]