export const MODULES = [
  {
    id: 'intro',
    icon: '◎',
    title: 'Wstęp',
    color: '#e2b94b',
    lessons: [
      {
        id: 'what-is-arch',
        title: 'Czym jest architektura frontendu?',
        duration: '5 min',
        content: `
Architektura frontendu to zestaw **decyzji**, które podejmujesz zanim napiszesz pierwszą linię kodu.

Odpowiada na pytania:
- Jak podzielić aplikację na moduły?
- Gdzie żyje stan aplikacji?
- Jak komponenty komunikują się ze sobą?
- Jak kod będzie wyglądał za 6 miesięcy, gdy dołączy 3 nowych deweloperów?

Dobra architektura to **niskie koszty zmiany** — możesz dodawać funkcje, nie rozwalając istniejącego kodu.
        `,
        quiz: {
          q: 'Głównym celem dobrej architektury frontendu jest:',
          options: [
            'Użycie najnowszych bibliotek',
            'Niski koszt wprowadzania zmian',
            'Jak najkrótszy czas budowania bundle',
            'Jak największa liczba wzorców projektowych',
          ],
          correct: 1,
          explanation: 'Architektura służy przede wszystkim temu, żeby kod dało się utrzymywać i rozwijać. To nie zbiór wzorców dla wzorców — to narzędzie do zarządzania złożonością.',
        },
      },
      {
        id: 'micro-vs-micro',
        title: 'Mikroserwis vs Mikrofrontend',
        duration: '6 min',
        content: `
To analogiczne koncepcje, ale po różnych stronach aplikacji.

## Mikroserwis
Niezależnie deployowana jednostka **backendu** — osobny proces, własna baza danych, własne API. Np. osobny serwis autoryzacji, osobny do płatności.

Komunikacja: HTTP/REST lub kolejki wiadomości (Kafka, RabbitMQ).

## Mikrofrontend
To samo, ale dla **UI** — niezależnie deployowany kawałek interfejsu użytkownika. Osobny team buduje i wypuszcza moduł koszyka, inny — katalog produktów. Użytkownik widzi jedną spójną aplikację, ale pod spodem to wiele osobnych deploymentów.

## Kluczowa różnica

Mikroserwisy są od siebie **naturalnie odizolowane** — osobne procesy, sieć jako granica.

Mikrofrontinendy są **trudniejsze** — działają w tej samej przeglądarce, współdzielą DOM, JavaScript runtime i style CSS. Izolacja musi być wymuszona narzędziami (Module Federation, Web Components, iframes).

## Kiedy mikrofrontendy mają sens?

Rozwiązują **problem organizacyjny**, nie techniczny. Jeśli masz jeden team — to prawdopodobnie over-engineering.
        `,
        quiz: {
          q: 'Mikrofrontendy są trudniejsze w izolacji niż mikroserwisy, ponieważ:',
          options: [
            'Używają innego języka programowania',
            'Działają w tej samej przeglądarce, dzieląc DOM i JS runtime',
            'Są wdrażane częściej niż mikroserwisy',
            'Nie mają własnych repozytoriów kodu',
          ],
          correct: 1,
          explanation: 'Mikroserwisy mają naturalną izolację przez granicę sieciową. Mikrofrontinendy działają razem w jednej przeglądarce — ta sama strona, ten sam window, te same globalne zmienne CSS.',
        },
      },
      {
        id: 'module-federation',
        title: 'Module Federation',
        duration: '8 min',
        content: `
Module Federation to feature **Webpacka 5** (i nowszych bundlerów: Rspack, Vite), który pozwala jednej aplikacji **załadować kod z innej aplikacji w runtime** — przez sieć, na żywo.

## Analogia

Normalnie budujesz aplikację i wszystko jest spakowane w bundle. Żeby użyć kodu z innego projektu — instalujesz go jako npm package.

Module Federation to jakbyś mogła **zaimportować moduł bezpośrednio z cudzego serwera**, bez instalowania czegokolwiek.

## Kluczowe pojęcia

**Remote** — aplikacja która **eksportuje** swoje moduły (komponenty, hooki, utilities).

**Host** — aplikacja która **konsumuje** te moduły z remota.

Jedna aplikacja może być jednocześnie hostem i remotem.

## Jak to działa

Przeglądarka pobiera \`remoteEntry.js\` z serwera remote'a — mały manifest który mówi "mam te moduły, możesz je pobrać". Host pobiera je dynamicznie w runtime.

## Największe zalety i ryzyka

✅ Każdy team deployuje niezależnie. Host automatycznie pobiera najnowszą wersję.

⚠️ Jeśli remote wywróci się w runtime — host może mieć problem. Dlatego zawsze lazy load + \`ErrorBoundary\`.

## Praktyczne użycie

W enterprise łączy się Module Federation z **Nx** lub **Turborepo** — monorepo daje spójne tooling, a Module Federation niezależny deployment.
        `,
        code: `// webpack.config.js — Remote app
new ModuleFederationPlugin({
  name: 'checkout',
  filename: 'remoteEntry.js',
  exposes: {
    './CartWidget': './src/widgets/CartWidget',
    './CheckoutPage': './src/pages/CheckoutPage',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true },
  },
});

// webpack.config.js — Host app
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    checkout: 'checkout@https://checkout.company.com/remoteEntry.js',
    catalog:  'catalog@https://catalog.company.com/remoteEntry.js',
  },
  shared: { react: { singleton: true } },
});

// W host appie — lazy import z remote
const CartWidget = lazy(() => import('checkout/CartWidget'));

const App = () => (
  <ErrorBoundary fallback={<CartFallback />}>
    <Suspense fallback={<Spinner />}>
      <CartWidget />
    </Suspense>
  </ErrorBoundary>
);`,
        quiz: {
          q: 'Co to jest remoteEntry.js w Module Federation?',
          options: [
            'Główny plik konfiguracyjny Webpacka',
            'Manifest eksportowanych modułów, pobierany przez host w runtime',
            'Plik z listą zależności npm',
            'Konfiguracja CORS dla serwera',
          ],
          correct: 1,
          explanation: 'remoteEntry.js to mały manifest generowany przez webpack, który zawiera informacje o dostępnych modułach i ich lokalizacji. Host pobiera go przy starcie, żeby wiedzieć jakie moduły może zaimportować.',
        },
      },
    ],
  },
  {
    id: 'components',
    icon: '⬡',
    title: 'Wzorce komponentów',
    color: '#a78bfa',
    lessons: [
      {
        id: 'atomic-design',
        title: 'Atomic Design',
        duration: '7 min',
        content: `
Metodologia Brada Frosta. Hierarchiczne rozkładanie UI na warstwy:

**Atomy** — najmniejsze jednostki: Button, Input, Label, Icon. Nie da się ich sensownie podzielić dalej.

**Molekuły** — grupy atomów tworzące funkcjonalną całość: SearchBar (Input + Button), FormField (Label + Input + ErrorMessage).

**Organizmy** — złożone, samodzielne sekcje: Header (Logo + SearchBar + NavMenu), ProductCard, CommentSection.

**Szablony (Templates)** — układy stron bez danych. Pokazują jak organizmy rozmieszczają się na stronie.

**Strony (Pages)** — konkretne instancje szablonów z prawdziwymi danymi.

## Praktyczna wartość

Atomic Design to przede wszystkim **wspólny język** w teamie. Gdy mówimy "ten organism" — wszyscy wiemy o jakiej granulacji mówimy.

Nie każdy projekt musi ściśle przestrzegać wszystkich 5 warstw — ważna jest idea **rosnącej złożoności przez kompozycję**.
        `,
        code: `// Atom
const Button = ({ label, onClick, variant = 'primary' }) => (
  <button className={\`btn btn--\${variant}\`} onClick={onClick}>
    {label}
  </button>
);

// Molecule
const SearchBar = () => {
  const [query, setQuery] = React.useState('');
  return (
    <div className="search-bar">
      <Input value={query} onChange={setQuery} placeholder="Szukaj..." />
      <Button label="Szukaj" onClick={() => search(query)} />
    </div>
  );
};

// Organism
const Header = () => (
  <header>
    <Logo />
    <SearchBar />
    <NavMenu />
    <UserMenu />
  </header>
);

// Template
const ProductPageTemplate = ({ header, sidebar, content, footer }) => (
  <div className="layout">
    {header}
    <main>
      {sidebar}
      {content}
    </main>
    {footer}
  </div>
);`,
        quiz: {
          q: 'W Atomic Design, czym różni się Molecule od Organism?',
          options: [
            'Molekuły są mniejsze — składają się z atomów. Organizmy są większe — składają się z molekuł i atomów',
            'Molekuły zawierają logikę biznesową, organizmy nie',
            'Organizmy są używane tylko w Templates',
            'Nie ma praktycznej różnicy — to tylko inna nazwa',
          ],
          correct: 0,
          explanation: 'Molekuła to prosta kombinacja atomów (np. SearchBar = Input + Button). Organism to złożona, samodzielna sekcja UI, która może łączyć molekuły i atomy i realizuje pełną funkcję biznesową (np. cały Header z nawigacją).',
        },
      },
      {
        id: 'compound',
        title: 'Compound Components',
        duration: '8 min',
        content: `
Wzorzec pozwala tworzyć komponenty o elastycznym API bez prop drilling. Komponent nadrzędny zarządza stanem przez Context, podkomponenty go konsumują.

## Analogia z HTML

Dokładnie tak działa \`<select>\` i \`<option>\` w HTML — są semantycznie powiązane, ale użytkownik decyduje o strukturze:

\`\`\`html
<select>
  <option>Opcja A</option>
  <option>Opcja B</option>
</select>
\`\`\`

## Kiedy stosować?

Gdy masz komponent z wieloma konfigurowalnymi częściami i klasyczne "props config" staje się zbyt skomplikowane (15 propsów do jednego komponentu to sygnał).

Używany w bibliotekach: **Radix UI**, **Headless UI**, **Reach UI**.
        `,
        code: `const TabsContext = React.createContext(null);

// Komponent główny — zarządza stanem
const Tabs = ({ children, defaultTab }) => {
  const [active, setActive] = React.useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

// Podkomponenty — konsumują Context
Tabs.List = ({ children }) => (
  <div role="tablist" className="tabs__list">{children}</div>
);

Tabs.Tab = ({ id, children }) => {
  const { active, setActive } = React.useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={active === id}
      onClick={() => setActive(id)}
      className={\`tabs__tab \${active === id ? 'active' : ''}\`}
    >
      {children}
    </button>
  );
};

Tabs.Panel = ({ id, children }) => {
  const { active } = React.useContext(TabsContext);
  return active === id
    ? <div role="tabpanel">{children}</div>
    : null;
};

// Użycie — użytkownik kontroluje strukturę
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab id="profile">Profil</Tabs.Tab>
    <Tabs.Tab id="settings">Ustawienia</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="profile"><ProfileForm /></Tabs.Panel>
  <Tabs.Panel id="settings"><SettingsForm /></Tabs.Panel>
</Tabs>`,
        quiz: {
          q: 'Główna zaleta Compound Components to:',
          options: [
            'Lepsza wydajność dzięki memoizacji',
            'Elastyczne API bez prop drilling — użytkownik kontroluje strukturę',
            'Automatyczne lazy loading podkomponentów',
            'Redukcja liczby re-renderów',
          ],
          correct: 1,
          explanation: 'Compound Components pozwalają użytkownikowi komponentu decydować o strukturze i układzie podkomponentów, unikając jednocześnie przekazywania propsów przez wiele warstw (prop drilling). Stan jest współdzielony przez Context.',
        },
      },
      {
        id: 'hoc',
        title: 'Higher-Order Components (HOC)',
        duration: '7 min',
        content: `
HOC to **funkcja przyjmująca komponent i zwracająca nowy komponent** z rozszerzoną funkcjonalnością. To implementacja wzorca Dekorator dla komponentów React.

## Typowe zastosowania

- **withAuth** — sprawdza autoryzację przed renderowaniem
- **withFeatureFlag** — pokazuje komponent tylko gdy flaga jest włączona
- **withAnalytics** — dodaje tracking eventów
- **withErrorBoundary** — opakowuje komponent w error boundary

## Kiedy używać?

HOC nadal ma sens gdy chcesz rozszerzyć wiele komponentów o to samo zachowanie. Ale w nowoczesnym React wiele przypadków zastępują **Custom Hooks** — są prostsze, nie tworzą "wrapper hell" i nie mają problemów z ref forwarding.

Sygnał że powinieneś użyć hooka zamiast HOC: logika nie wymaga renderowania JSX.
        `,
        code: `// HOC — withAuth
const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <WrappedComponent {...props} currentUser={user} />;
  };

  // Ważne dla React DevTools
  AuthenticatedComponent.displayName =
    \`withAuth(\${WrappedComponent.displayName || WrappedComponent.name})\`;

  return AuthenticatedComponent;
};

// HOC — withFeatureFlag
const withFeatureFlag = (flagName, Fallback = null) => (Component) => {
  return (props) => {
    const isEnabled = useFeatureFlag(flagName);
    if (!isEnabled) return Fallback ? <Fallback {...props} /> : null;
    return <Component {...props} />;
  };
};

// Kompozycja HOC (uwaga: czytaj od środka na zewnątrz)
const ProtectedFeature = withAuth(
  withFeatureFlag('new-dashboard', OldDashboard)(
    NewDashboard
  )
);`,
        quiz: {
          q: 'Co to jest "wrapper hell" w kontekście HOC?',
          options: [
            'Zbyt wiele zagnieżdżonych <div> w HTML',
            'Nadmierne zagnieżdżanie HOC prowadzące do trudnego drzewa komponentów w DevTools',
            'Problemy z CSS w zagnieżdżonych komponentach',
            'Błędy wynikające z zagnieżdżonych useEffect',
          ],
          correct: 1,
          explanation: 'Wrapper hell to sytuacja gdy używasz wielu HOC na raz: withAuth(withLogging(withFeatureFlag(Component))). W React DevTools widzisz głęboko zagnieżdżone "sztuczne" komponenty, co utrudnia debugowanie. Custom Hooks rozwiązują ten problem.',
        },
      },
    ],
  },
  {
    id: 'state',
    icon: '◎',
    title: 'Zarządzanie stanem',
    color: '#60a5fa',
    lessons: [
      {
        id: 'state-classification',
        title: 'Klasyfikacja stanu',
        duration: '6 min',
        content: `
Kluczowa umiejętność seniora: zanim sięgniesz po bibliotekę, **sklasyfikuj dane**.

## 4 typy stanu

**Server State** — dane z API. Asynchroniczne, mogą być stale. Mają swój lifecycle: loading → success/error → revalidation. Zarządzaj przez **React Query** lub SWR.

**Global Client State** — stan współdzielony między niezwiązanymi komponentami: auth user, motyw, koszyk, notyfikacje. Zarządzaj przez Zustand, Redux, lub Context.

**Local UI State** — stan tylko dla jednego komponentu: modal open/close, form draft, accordion expanded. Użyj **useState** lub **useReducer**. Nie wynoś wyżej niż potrzebujesz.

**URL State** — filtry, paginacja, aktywna zakładka — cokolwiek co powinno przeżyć refresh i dać się udostępnić linkiem. Zarządzaj przez **searchParams** (React Router).

## Złota zasada

> Trzymaj stan jak najniżej w drzewie komponentów, jak to możliwe.

Over-engineering state to czerwona flaga. Nie wszystko potrzebuje Reduxa.
        `,
        quiz: {
          q: 'Dane z API (lista produktów pobrana przez fetch) to jaki typ stanu?',
          options: [
            'Global Client State — bo używany w wielu komponentach',
            'Server State — asynchroniczny, zewnętrzny, ma własny lifecycle',
            'Local UI State — bo wyświetlany w jednym widoku',
            'URL State — bo filtrowanie odbywa się przez URL',
          ],
          correct: 1,
          explanation: 'Dane z serwera to Server State — są asynchroniczne, mogą być stale (zmienić się na serwerze), mają stany loading/error/success i wymagają rewalidacji. React Query jest do tego idealny, nie Redux.',
        },
      },
      {
        id: 'react-query',
        title: 'React Query — Server State',
        duration: '10 min',
        content: `
React Query (TanStack Query) obsługuje fetching, caching, synchronizację i aktualizację danych z serwera.

## Dlaczego nie useState + useEffect?

\`\`\`js
// Klasyczne podejście — dużo boilerplate
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchData().then(setData).catch(setError).finally(() => setLoading(false));
}, []);
\`\`\`

React Query załatwia to jedną linią + daje caching, deduplication, background refetch i wiele więcej.

## Kluczowe koncepty

**queryKey** — unikalny identyfikator danych. Zmiana klucza = nowe zapytanie.

**staleTime** — jak długo dane są "świeże". W tym czasie React Query nie refetchuje, tylko zwraca cache.

**gcTime** (dawniej cacheTime) — jak długo nieaktywne dane żyją w cache.

**invalidation** — ręczne oznaczenie danych jako stale (np. po mutacji).
        `,
        code: `import { useQuery, useMutation, useQueryClient } 
  from '@tanstack/react-query';

// Query z cachingiem
const useProducts = (filters) => useQuery({
  queryKey: ['products', filters], // zmiana filters = nowy fetch
  queryFn: () => fetchProducts(filters),
  staleTime: 5 * 60 * 1000,   // 5 min — dane świeże
  gcTime: 10 * 60 * 1000,     // 10 min — potem z cache
});

// Mutation z invalidation
const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Wymuś re-fetch listy produktów po dodaniu
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Optimistic update — UI przed odpowiedzią serwera
const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const snapshot = queryClient.getQueryData(['posts']);
      // Natychmiastowa aktualizacja
      queryClient.setQueryData(['posts'], (old) =>
        old.map(p => p.id === postId 
          ? { ...p, likes: p.likes + 1 } 
          : p
        )
      );
      return { snapshot }; // dla rollback
    },
    onError: (err, vars, ctx) => {
      queryClient.setQueryData(['posts'], ctx.snapshot); // rollback
    },
  });
};`,
        quiz: {
          q: 'Czym jest "staleTime" w React Query?',
          options: [
            'Czas po którym cache jest całkowicie usuwany',
            'Czas przez który dane są uważane za świeże — React Query nie refetchuje',
            'Maksymalny czas oczekiwania na odpowiedź API',
            'Czas między kolejnymi automatycznymi refetchami',
          ],
          correct: 1,
          explanation: 'staleTime to okno "świeżości" danych. Jeśli ustawisz staleTime: 60000 (1 min), przez minutę React Query nie będzie refetchować tych danych — zwróci cached version. Po tym czasie dane stają się "stale" i zostaną odświeżone przy następnym użyciu.',
        },
      },
      {
        id: 'zustand',
        title: 'Zustand — Global Client State',
        duration: '7 min',
        content: `
Zustand to minimalistyczna biblioteka do global state — bez Provider, bez boilerplate, bez reducerów.

## Dlaczego nie zawsze Redux?

Redux jest potężny, ale wymaga dużo konfiguracji: store, reducer, action, action creator, selector... Dla wielu projektów to over-engineering.

Zustand daje te same korzyści (przewidywalny stan, DevTools support) z 90% mniej kodu.

## Kiedy Redux ma sens?

- Bardzo złożony flow między wieloma feature'ami
- Duży team z potrzebą rygorystycznych konwencji
- Time-travel debugging jest kluczowy
- Istniejąca baza kodu Redux

## Zustand vs Context

Context jest wbudowany w React, ale ma problem: każda zmiana dowolnej wartości w Context re-renderuje **wszystkich** konsumentów. Zustand subskrybuje tylko do używanych slice'ów.
        `,
        code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store koszyka — z persist do localStorage
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Actions
      addItem: (product) => set((state) => ({
        items: [...state.items, { ...product, qty: 1 }]
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      
      updateQty: (id, qty) => set((state) => ({
        items: state.items.map(i => 
          i.id === id ? { ...i, qty } : i
        )
      })),
      
      // Derived (computed) values
      total: () => get().items.reduce(
        (sum, item) => sum + item.price * item.qty, 0
      ),
      
      itemCount: () => get().items.reduce(
        (sum, item) => sum + item.qty, 0
      ),
    }),
    { name: 'cart-storage' } // klucz w localStorage
  )
);

// Użycie — bez Provider, zero boilerplate
const CartIcon = () => {
  // Subskrybuje tylko itemCount — re-render tylko gdy count się zmieni
  const count = useCartStore((state) => state.itemCount());
  return <span className="badge">{count}</span>;
};

const CartItem = ({ id }) => {
  const item = useCartStore((state) => state.items.find(i => i.id === id));
  const removeItem = useCartStore((state) => state.removeItem);
  // ...
};`,
        quiz: {
          q: 'Jaka jest kluczowa przewaga Zustand nad Context API w React?',
          options: [
            'Zustand jest szybszy bo jest napisany w Rust',
            'Zustand wymaga mniej konfiguracji niż Redux',
            'Zustand re-renderuje tylko komponenty które subskrybują konkretny slice stanu',
            'Zustand automatycznie synchronizuje stan z backendem',
          ],
          correct: 2,
          explanation: 'Context re-renderuje wszystkich konsumentów przy każdej zmianie wartości. Zustand używa fine-grained subscriptions — komponent re-renderuje się tylko gdy zmieni się ta część stanu, którą obserwuje (przez selektor). To ważna przewaga wydajnościowa.',
        },
      },
    ],
  },
  {
    id: 'architecture',
    icon: '▣',
    title: 'Architektura aplikacji',
    color: '#3ecf8e',
    lessons: [
      {
        id: 'fsd',
        title: 'Feature-Sliced Design',
        duration: '10 min',
        content: `
FSD to metodologia organizacji kodu — alternatywa dla podziału "technicznego" (components/, hooks/, utils/).

## Problem z podziałem technicznym

Przy większych projektach \`components/\` staje się śmietnikiem — 200 plików bez żadnego kontekstu biznesowego. Nie wiadomo które komponenty należą do której funkcji.

## Podejście FSD: podział przez domeny

Hierarchia warstw (każda może importować tylko z warstw poniżej):

\`\`\`
app → pages → widgets → features → entities → shared
\`\`\`

**app** — routing, globalne providers, style  
**pages** — kompletne widoki (HomeApp, ProfilePage)  
**widgets** — duże, samodzielne bloki UI (Header, Sidebar)  
**features** — akcje użytkownika (auth, cart, search)  
**entities** — modele biznesowe (User, Product, Order)  
**shared** — reużywalne elementy bez logiki biznesowej (Button, Input, apiClient)  

## Segmenty w każdej warstwie

Każda warstwa ma te same segmenty: \`ui/\`, \`model/\`, \`api/\`, \`lib/\`, \`config/\`
        `,
        code: `src/
├── app/
│   ├── providers/         # QueryClient, Router, ThemeProvider
│   ├── router/            # Route definitions
│   └── styles/            # Global CSS

├── pages/
│   ├── home/
│   │   └── ui/HomePage.jsx
│   └── profile/
│       └── ui/ProfilePage.jsx

├── widgets/
│   └── header/
│       ├── ui/Header.jsx
│       └── model/headerStore.js

├── features/
│   ├── auth/
│   │   ├── ui/LoginForm.jsx
│   │   ├── model/authSlice.js  # useState, useReducer, zustand store
│   │   └── api/authApi.js      # fetch/axios calls
│   └── product-search/
│       ├── ui/SearchBar.jsx
│       ├── model/useSearch.js
│       └── api/searchApi.js

├── entities/
│   ├── user/
│   │   ├── ui/UserCard.jsx
│   │   └── model/userModel.js  # typy, transformacje danych
│   └── product/
│       ├── ui/ProductCard.jsx
│       └── model/productModel.js

└── shared/
    ├── ui/               # Button, Input, Modal, Spinner...
    ├── lib/              # cn(), formatDate(), hooks utils
    ├── api/              # axios instance, base config
    └── config/           # env variables, constants`,
        quiz: {
          q: 'W FSD, warstwa "features" może importować z:',
          options: [
            'Tylko z "shared"',
            'Z "entities" i "shared" — czyli warstw poniżej',
            'Z dowolnej warstwy — to tylko sugestia',
            'Z "pages", "entities" i "shared"',
          ],
          correct: 1,
          explanation: 'FSD ma ścisłą regułę: każda warstwa może importować tylko z warstw poniżej. Features leży nad entities i shared, więc może z nich importować. Nie może importować z widgets ani pages — to by odwróciło hierarchię.',
        },
      },
      {
        id: 'monorepo',
        title: 'Monorepo — Nx i Turborepo',
        duration: '8 min',
        content: `
Monorepo to jedno repozytorium Git dla wielu projektów — aplikacji i bibliotek.

## Alternatywa: Polyrepo

Każda aplikacja w osobnym repo. Wada: synchronizacja zmian między projektami jest bolesna. Jeśli zmieniasz shared komponent — musisz: opublikować nową wersję npm, zaktualizować zależność we wszystkich projektach, zrobić PR w każdym osobno.

## Korzyści monorepo

- **Atomic commits** — jedna zmiana obejmuje wszystkie dotknięte projekty
- **Shared tooling** — jeden ESLint, jeden TypeScript config, jeden CI pipeline
- **Łatwe współdzielenie kodu** — import jak lokalny moduł, nie npm package
- **nx affected** — rebuild/retest tylko tego co się zmieniło

## Nx vs Turborepo

**Nx** — bardziej opinionated, generatory kodu, boundary enforcement, distributed cache, świetny dla enterprise.

**Turborepo** — lżejszy, task runner z pipeline'ami, mniej narzuca strukturę. Dobry dla mniejszych teamów.
        `,
        code: `// Struktura Nx monorepo
apps/
  web-app/        # React app
  admin/          # React admin panel
  docs/           # Next.js docs

libs/
  ui/             # Shared design system (publishable)
    src/
      Button/
      Input/
      Modal/
  feature-auth/   # Auth feature (buildable)
    src/
  data-access/    # API clients (utility)
    src/
  utils/          # Pure functions

// nx.json — cache i pipeline
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],  // build deps first
      "cache": true
    },
    "test": { "cache": true }
  }
}

// .eslintrc — boundary enforcement
"@nx/enforce-module-boundaries": ["error", {
  "depConstraints": [
    // feature może importować z ui i utils, nie z innych features
    { "sourceTag": "type:feature", 
      "onlyDependOnLibsWithTags": ["type:ui", "type:util"] },
    // ui nie może importować z feature
    { "sourceTag": "type:ui",
      "onlyDependOnLibsWithTags": ["type:util"] }
  ]
}]

// CI — tylko zmienione projekty
npx nx affected --target=build
npx nx affected --target=test`,
        quiz: {
          q: 'Co robi komenda "nx affected" w monorepo?',
          options: [
            'Wyświetla listę wszystkich projektów w monorepo',
            'Uruchamia task tylko dla projektów dotkniętych przez zmiany w kodzie',
            'Aktualizuje zależności we wszystkich projektach',
            'Generuje raport błędów dla całego monorepo',
          ],
          correct: 1,
          explanation: 'nx affected analizuje git diff i uruchamia dany task (build, test, lint) tylko dla projektów które są dotknięte zmianami — bezpośrednio lub przez zależności. Przy dużym monorepo to krytyczna optymalizacja CI — zamiast buildować wszystko, buildujesz tylko to co potrzeba.',
        },
      },
    ],
  },
  {
    id: 'solid',
    icon: '◆',
    title: 'SOLID w React',
    color: '#fb923c',
    lessons: [
      {
        id: 'srp',
        title: 'Single Responsibility Principle',
        duration: '7 min',
        content: `
**Jeden moduł / komponent = jeden powód do zmiany.**

## Sygnały naruszenia SRP w React

- Komponent ma "i" w opisie: "pokazuje listę produktów **i** fetchuje dane **i** obsługuje paginację **i** filtruje"
- Komponent ma > 200 linii
- Wiele niezwiązanych \`useEffect\`
- Komponent jest trudny do przetestowania bo robi za dużo

## Jak naprawić?

Wydziel logikę do Custom Hooks. Wydziel renderowanie do osobnych komponentów. Każdy hook/komponent robi jedną rzecz dobrze.
        `,
        code: `// ❌ Narusza SRP — wszystko w jednym
const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    // fetch logic
    fetchUsers(page).then(setUsers);
  }, [page]);

  // validation logic
  const validated = users.filter(u => u.email && u.role);
  
  // filter logic  
  const filtered = validated.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  // render logic — tabelka, paginacja, search input...
  return ( /* 80 linii JSX */ );
};

// ✅ SRP — każda odpowiedzialność wyizolowana
const useUsers = (page) =>          // tylko fetching
  useQuery(['users', page], () => fetchUsers(page));

const useUserSearch = (users, q) => // tylko filtrowanie
  useMemo(() =>
    users?.filter(u =>
      u.name.toLowerCase().includes(q.toLowerCase())
    ), [users, q]
  );

const UserDashboard = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const { data } = useUsers(page);           // fetching
  const filtered = useUserSearch(data, query); // filtering

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <UsersTable users={filtered} />          {/* rendering */}
      <Pagination page={page} onChange={setPage} />
    </>
  );
};`,
        quiz: {
          q: 'Który sygnał najbardziej wskazuje na naruszenie SRP w komponencie React?',
          options: [
            'Komponent ma więcej niż 3 useState',
            'Komponent importuje z więcej niż 5 plików',
            'Komponent zawiera logikę "i renderuje AND fetchuje dane AND obsługuje błędy AND filtruje"',
            'Komponent używa TypeScript interfejsów',
          ],
          correct: 2,
          explanation: 'Gdy opis komponentu zawiera wiele "i" (AND), to sygnał że robi za dużo. SRP mówi: jeden powód do zmiany. Komponent który fetchuje, filtruje, waliduje i renderuje — zmienia się gdy zmienia się API, gdy zmienia się logika filtrowania, gdy zmienia się walidacja, gdy zmienia się UI. To 4 powody.',
        },
      },
      {
        id: 'ocp',
        title: 'Open/Closed Principle',
        duration: '7 min',
        content: `
**Otwarte na rozszerzenie, zamknięte na modyfikację.**

Komponent powinno się rozszerzać przez props, composition lub polymorphism — bez edytowania jego kodu.

## Sygnał naruszenia

\`if (type === 'A') ... else if (type === 'B') ... else if (type === 'C')\` wewnątrz komponentu. Każdy nowy typ = edycja istniejącego pliku = ryzyko regresji.

## Rozwiązania

1. **Kompozycja przez props** — eksportuj warianty jako osobne komponenty
2. **Strategy pattern** — przekaż behavior jako props (render props, children as function)
3. **Polymorphism** — \`as\` prop (jak w wielu bibliotekach UI)
        `,
        code: `// ❌ Narusza OCP
const Alert = ({ type, message }) => {
  // Każdy nowy typ = edycja tego komponentu
  if (type === 'success') return <div className="alert-success">{message}</div>;
  if (type === 'error')   return <div className="alert-error">{message}</div>;
  if (type === 'warning') return <div className="alert-warning">{message}</div>;
  // a co z "info"? trzeba edytować...
};

// ✅ OCP przez kompozycję
const Alert = ({ className, icon, children }) => (
  <div className={\`alert \${className}\`}>
    {icon && <span className="alert__icon">{icon}</span>}
    {children}
  </div>
);

// Warianty jako osobne, zamknięte komponenty
export const SuccessAlert = (props) =>
  <Alert className="alert--success" icon="✓" {...props} />;
export const ErrorAlert = (props) =>
  <Alert className="alert--error" icon="✕" {...props} />;
export const InfoAlert = (props) =>
  <Alert className="alert--info" icon="ℹ" {...props} />;
// Nowy wariant? Dodaj nowy plik, nie edytuj istniejącego.

// ✅ OCP przez Strategy pattern (render prop)
const DataList = ({ items, renderItem, renderEmpty }) => (
  items.length === 0
    ? (renderEmpty?.() ?? <p>Brak danych</p>)
    : <ul>{items.map(renderItem)}</ul>
);

// Rozszerzasz bez modyfikacji DataList
<DataList
  items={users}
  renderItem={(u) => <UserRow key={u.id} user={u} />}
  renderEmpty={() => <EmptyState cta="Dodaj użytkownika" />}
/>`,
        quiz: {
          q: 'Które podejście najlepiej realizuje OCP w React?',
          options: [
            'Duży switch/case zamiast if/else — czytelniejszy kod',
            'Kompozycja: warianty jako osobne komponenty, zachowanie przez props',
            'Trzymanie wszystkich wariantów w jednym pliku dla łatwego wyszukiwania',
            'Używanie Context do zarządzania wariantami komponentów',
          ],
          correct: 1,
          explanation: 'OCP w praktyce oznacza: zamiast dodawać kolejny "else if" do komponentu (modyfikacja), tworzysz nowy komponent/wariant (rozszerzenie). Kompozycja przez props i render props to naturalne mechanizmy OCP w React.',
        },
      },
      {
        id: 'dip',
        title: 'Dependency Inversion Principle',
        duration: '7 min',
        content: `
**Wysokopoziomowe moduły nie zależą od niskopoziomowych — oba zależą od abstrakcji.**

W React: komponenty nie powinny bezpośrednio importować konkretnych implementacji API/serwisów.

## Praktyczny przykład

Komponent który bezpośrednio wywołuje \`axios.get('/api/users')\` jest na twardo powiązany z:
- biblioteką axios
- konkretnym URL-em
- konkretnym kształtem odpowiedzi

Zmiana URL-a lub biblioteki = edycja komponentu. Testowanie = potrzeba mockowania axios globalnie.

## Rozwiązanie: abstrakcja przez hooki

Hook \`useUsers()\` jest abstrakcją. Komponent zależy od hooka (interfejsu), a nie od szczegółów implementacji fetchowania.
        `,
        code: `// ❌ Narusza DIP — komponent zna szczegóły implementacji
const UserList = ({ teamId }) => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Twarda zależność od axios i konkretnego URL
    axios.get(\`/api/v2/teams/\${teamId}/users?active=true\`)
      .then(r => setUsers(r.data.users));
  }, [teamId]);
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
};

// ✅ DIP — abstrakcja przez hook (interfejs)

// Serwis — jeden szczegół implementacji (można podmienić)
const userService = {
  getTeamUsers: (teamId) =>
    apiClient.get(\`/users\`, { params: { teamId, active: true } }),
};

// Hook — abstrakcja, "port" między komponentem a danymi
const useTeamUsers = (teamId) => useQuery({
  queryKey: ['users', 'team', teamId],
  queryFn: () => userService.getTeamUsers(teamId),
});

// Komponent — zależy tylko od hooka (abstrakcji)
const UserList = ({ teamId }) => {
  const { data: users, isLoading } = useTeamUsers(teamId);
  if (isLoading) return <Spinner />;
  return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
};

// Testy — mockujemy hook, nie axios
jest.mock('./useTeamUsers', () => ({
  useTeamUsers: () => ({ data: mockUsers, isLoading: false })
}));
// Komponent testujemy w pełnej izolacji od serwisu`,
        quiz: {
          q: 'DIP w React jest najlepiej realizowany przez:',
          options: [
            'Używanie tylko bibliotek open-source bez włanego kodu',
            'Komponenty zależące od hooków (abstrakcji), nie od konkretnych serwisów HTTP',
            'Globalne zmienne dla wszystkich serwisów',
            'Trzymanie wszystkich wywołań API w jednym pliku',
          ],
          correct: 1,
          explanation: 'DIP mówi żeby zależeć od abstrakcji, nie od konkretów. Hook jest abstrakcją — komponent wie że "dostaje users" ale nie wie jak są fetchowane. Dzięki temu można podmienić implementację (axios→fetch, REST→GraphQL) bez dotykania komponentu. Testy stają się proste — mockujesz hook.',
        },
      },
    ],
  },
  {
    id: 'systems-design',
    icon: '⇋',
    title: 'FE Systems Design',
    color: '#f472b6',
    lessons: [
      {
        id: 'framework',
        title: 'Framework 8 kroków',
        duration: '8 min',
        content: `
FE Systems Design to ustrukturyzowany sposób odpowiedzi na pytanie rekrutacyjne w stylu "Zaprojektuj [system]".

## 8 kroków z timeboxingiem (~45 min total)

**01 Clarify Requirements** (~5 min) — Zadaj pytania zanim zaczniesz. Senior nie zakłada — pyta.

**02 High-Level Architecture** (~8 min) — Narysuj warstwy systemu, przepływ danych, granice modułów.

**03 Component Design** (~10 min) — Drzewo komponentów, props API, podział odpowiedzialności.

**04 State Management** (~8 min) — Klasyfikuj dane: server / global / local / URL state.

**05 API & Data Layer** (~7 min) — Kontrakt z API, pagination, error handling, optimistic updates.

**06 Performance Strategy** (~7 min) — Core Web Vitals, code splitting, virtualizacja, memoizacja.

**07 Accessibility** (~5 min) — Semantyczny HTML, ARIA, keyboard navigation.

**08 Tradeoffs** (~5 min) — Co uprościłaś i dlaczego. Co byś zrobiła inaczej przy większej skali.

## Złota zasada

Rekruter ocenia **process myślenia**, nie nazwy bibliotek. Mów głośno. Uzasadniaj każdy wybór. Przyznaj się do kompromisów.
        `,
        quiz: {
          q: 'Dlaczego "Clarify Requirements" to pierwszy krok, a nie od razu projektowanie?',
          options: [
            'Bo rekruterzy lubią pytania i to robi dobre wrażenie',
            'Bo bez jasnych wymagań możesz zaprojektować świetne rozwiązanie złego problemu',
            'Bo to daje czas na myślenie bez rysowania',
            'Bo tylko juniorzy od razu zaczynają projektować',
          ],
          correct: 1,
          explanation: 'Pytania o wymagania to nie trik — to realna potrzeba. Pytanie "Zaprojektuj wyszukiwarkę" może oznaczać: typeahead ze 100 produktami (local filter) albo pełnotekstowe search po milionach rekordów (zupełnie inny problem). Bez clarification możesz spędzić 30 min na idealnym rozwiązaniu złego problemu.',
        },
      },
      {
        id: 'case-feed',
        title: 'Case Study: News Feed',
        duration: '10 min',
        content: `
Klasyczne pytanie FE Systems Design: "Zaprojektuj News Feed w stylu Twittera/Facebooka".

## Kluczowe pytania clarifying

- Infinite scroll czy paginacja?
- Czy feed jest personalizowany (algorytm) czy chronologiczny?
- Czy potrzebujemy real-time updates (nowe posty)?
- Czy user może komentować/likować?
- Mobile-first?

## Kluczowe decyzje architektoniczne

**Cursor-based pagination** — nie offset/limit. Feed się zmienia (nowe posty) — offset pagination daje duplikaty przy przewijaniu.

**Virtualizacja listy** — 1000 postów nie może być wszystkich w DOM. TanStack Virtual.

**Optimistic updates** — like/share dają natychmiastowy feedback, rollback przy błędzie.

**Real-time** — WebSocket dla nowych postów lub polling co 30s (prostsze, wystarczające dla MVP).

**Image lazy loading** — zawsze \`loading="lazy"\` + jawne wymiary (zapobiega Layout Shift).

## Pułapka

Jak handlujesz post który zostaje usunięty między refreshami? Jak zarządzasz focus po powrocie z Post Detail? To są gotchas które odróżniają seniora.
        `,
        code: `// Infinite scroll z cursor pagination
const useFeed = () => useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) =>
    feedApi.getPosts({ cursor: pageParam, limit: 20 }),
  getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  initialPageParam: undefined,
  // Cursor-based: brak duplikatów gdy nowe posty się pojawią
});

// Virtualizacja listy postów
const FeedList = () => {
  const { data, fetchNextPage, hasNextPage } = useFeed();
  const allPosts = data?.pages.flatMap(p => p.posts) ?? [];

  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 3,
  });

  // Fetch next page gdy zbliżamy się do końca
  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1);
    if (lastItem && lastItem.index >= allPosts.length - 3 && hasNextPage) {
      fetchNextPage();
    }
  }, [virtualizer.getVirtualItems()]);

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(item => (
          <div
            key={item.index}
            style={{
              position: 'absolute',
              top: 0,
              transform: \`translateY(\${item.start}px)\`,
              width: '100%',
            }}
          >
            {allPosts[item.index]
              ? <PostCard post={allPosts[item.index]} />
              : <PostSkeleton />
            }
          </div>
        ))}
      </div>
    </div>
  );
};`,
        quiz: {
          q: 'Dlaczego cursor-based pagination jest lepszy niż offset/limit dla news feedu?',
          options: [
            'Jest szybszy po stronie bazy danych',
            'Nie generuje duplikatów gdy nowe posty pojawiają się podczas przewijania',
            'Lepiej obsługuje filtrowanie i sortowanie',
            'Nie wymaga informacji o całkowitej liczbie elementów',
          ],
          correct: 1,
          explanation: 'Z offset pagination: jeśli na stronie 1 masz posty 1-20 i pojawia się nowy post, to na stronie 2 (offset=20) dostaniesz post który był już na stronie 1 jako ostatni. Cursor-based używa wskaźnika do konkretnego elementu — "daj mi 20 elementów po tym konkretnym poście" — więc nowe elementy nie psują paginacji.',
        },
      },
    ],
  },
];

export const TOTAL_LESSONS = MODULES.reduce(
  (sum, m) => sum + m.lessons.length, 0
);
