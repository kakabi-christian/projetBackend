FROM php:8.2-apache

# 1. Dépendances système
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    zip unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

RUN a2enmod rewrite

# 2. Dossier de travail dans l'image
WORKDIR /var/www/html

# 3. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. COPIE DU CONTENU (Méthode NestJS)
# On copie tout le dossier agoraCooperative vers le dossier de travail actuel
COPY . .

# 5. Configuration Apache (DocumentRoot vers /public)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 6. Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 7. Permissions et Nettoyage
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# --- AJOUT CRUCIAL POUR RAILWAY ---
# On force le vidage de la config pour que les variables d'environnement Railway soient lues
RUN php artisan config:clear

# Redirection des logs vers la console Railway
RUN ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

EXPOSE 80

CMD ["apache2-foreground"]