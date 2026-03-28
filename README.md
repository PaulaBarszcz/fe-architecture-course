# FE Architecture Course

Interaktywny kurs architektury frontendowej — React, wzorce, systems design.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

## Deploy na GitHub Pages

### Jednorazowa konfiguracja

1. Utwórz nowe repo na GitHubie o nazwie `fe-architecture-course`
2. W pliku `vite.config.js` upewnij się że `base` pasuje do nazwy repo:
   ```js
   base: '/fe-architecture-course/'
   ```
3. Wsuń kod do repo:
   ```bash
   git init
   git add .
   git commit -m "init: fe architecture course"
   git remote add origin https://github.com/TWÓJ_USERNAME/fe-architecture-course.git
   git push -u origin main
   ```

### Deploy

```bash
npm run deploy
```

To polecenie zbuduje projekt i wypchnie katalog `dist` do gałęzi `gh-pages`.

### Włącz GitHub Pages

W ustawieniach repo: **Settings → Pages → Source: Deploy from branch → `gh-pages` → `/ (root)`**

Strona będzie dostępna pod:
`https://TWÓJ_USERNAME.github.io/fe-architecture-course/`

## Zawartość kursu

- **Wstęp** — architektura frontendu, mikroserwisy vs mikrofrontinendy, Module Federation
- **Wzorce komponentów** — Atomic Design, Compound Components, HOC
- **Zarządzanie stanem** — klasyfikacja stanu, React Query, Zustand
- **Architektura aplikacji** — Feature-Sliced Design, Monorepo (Nx/Turborepo)
- **SOLID w React** — SRP, OCP, DIP w praktyce
- **FE Systems Design** — framework 8 kroków, case study News Feed
