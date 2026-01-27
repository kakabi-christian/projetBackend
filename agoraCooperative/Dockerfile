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

# 3. Définition du dossier de travail (INDISPENSABLE pour trouver composer.json)
WORKDIR /var/www/html

# 4. Configuration du DocumentRoot d'Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Copie des fichiers (Grâce au contexte défini dans railway.json, "." ici est "agoraCooperative")
COPY . /var/www/html

# 6. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 7. Installation des dépendances avec logs détaillés
RUN composer install --no-interaction --optimize-autoloader --no-dev --verbose

# 8. Configuration des permissions pour Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Forcer Laravel à envoyer les logs dans la sortie standard de Docker (stderr)
# Cela permet de voir toutes les erreurs PHP directement dans Railway
RUN ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

# 10. Port par défaut
EXPOSE 80

# 11. Commande de démarrage
CMD ["apache2-foreground"]