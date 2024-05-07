# Uruchomienie

## Backend

1. Konfiguracja pliku .env w `todo_app_backend/` 
    1. Utwórz plik .env: `cp .env.example .env`
    2. Zedytuj plik .env aby podać prawidłową ścieżkę do połączenia z bazą danych (`DATABASE_URL`)
2. Instalacja zależności composer
    1. `composer update`
    2. `composer install`
3. Przeprowadzenie migracji
    1. `php bin/console make:migration`
    2. `php bin/console doctrine:migrations:migrate`
4. Uruchomienie `symfony-cli`
    1. `symfony server:start`
    2. Instrukcje instalacji do symfony-cli: https://symfony.com/download


## Frontend
1. Instalacja node_modules
    1. W katalogu głównym projektu (`todo_app/`): `npm install`
    2. Uruchomienie aplikacji: `npm start`