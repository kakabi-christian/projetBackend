FROM php:8.2-apache

# 1. Installation des dépendances système
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    zip unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# 2. FIX RADICAL POUR L'ERREUR MPM
# On force la suppression des fichiers de configuration des modules mpm_event et mpm_worker
# pour garantir que seul mpm_prefork (requis par PHP) soit chargé.
RUN rm -f /etc/apache2/mods-enabled/mpm_event.load /etc/apache2/mods-enabled/mpm_event.conf \
    && rm -f /etc/apache2/mods-enabled/mpm_worker.load /etc/apache2/mods-enabled/mpm_worker.conf \
    && a2dismod mpm_event mpm_worker || true \
    && a2enmod mpm_prefork rewrite

# 3. Dossier de travail
WORKDIR /var/www/html

# 4. Configuration du DocumentRoot (Pointé vers /public pour Laravel)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Copie du code (depuis le dossier de l'app vers le dossier de travail Apache)
COPY ./agoraCooperative/ .

# 7. Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 8. Permissions cruciales pour Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Pré-optimisation (pendant le build pour accélérer le démarrage)
# RUN php artisan config:cache && php artisan route:cache

# 10. Redirection des logs vers la console Railway
RUN ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

EXPOSE 80

# Commande de lancement officielle
CMD ["apache2-foreground"]