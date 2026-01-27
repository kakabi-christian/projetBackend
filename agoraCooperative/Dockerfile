FROM php:8.2-apache

# 1. Installation des dépendances système
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    zip unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# 2. Activation du module rewrite d'Apache
RUN a2enmod rewrite

# 3. Dossier de travail (On définit où le code va habiter)
WORKDIR /var/www/html

# 4. Configuration du DocumentRoot d'Apache (Pointé vers /public)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. COPIE DU CODE (Version "Directe")
# Puisque ton railway.json a le context="agoraCooperative", 
# on copie tout ce qui est là-bas directement ici.
COPY ./agoraCooperative/ .

# --- DEBUG : On vérifie si composer.json est là ---
RUN ls -la /var/www/html

# 7. Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# ... (garde le début inchangé)

# 8. Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Pré-optimisation (On le fait au build pour gagner du temps)
RUN php artisan config:cache && php artisan route:cache

# Redirection des logs
RUN ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

EXPOSE 80

# On lance Apache directement
CMD ["apache2-foreground"]