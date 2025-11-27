# LAB03 - Blog z komentarzami i moderacją

## Opis
Blog z systemem dodawania komentarzy i ręczną moderacją. Komentarze są domyślnie niewidoczne i wymagają zatwierdzenia przez moderatora przed publikacją.

## Model danych

### Posts (Posty)
- `id` - Identyfikator (ObjectId)
- `title` - Tytuł posta
- `body` - Treść posta
- `createdAt` - Data utworzenia
- `updatedAt` - Data aktualizacji

### Comments (Komentarze)
- `id` - Identyfikator (ObjectId)
- `postId` - Relacja do posta
- `author` - Autor komentarza
- `body` - Treść komentarza
- `approved` - Status moderacji (0 = oczekujący, 1 = zatwierdzony)
- `createdAt` - Data utworzenia
- `updatedAt` - Data aktualizacji

## API Endpoints

### Posty
- `GET /api/lab3/posts` - Lista wszystkich postów (z paginacją)
  - Query params: `page`, `pageSize`
  - Zwraca liczbę zatwierdzonych komentarzy dla każdego posta

- `POST /api/lab3/posts` - Dodawanie nowego posta
  - Body: `{ title, body }`
  - Status: 201

- `GET /api/lab3/posts/{id}` - Szczegóły posta
  - Zwraca post wraz z zatwierdzonymi komentarzami

### Komentarze
- `GET /api/lab3/posts/{id}/comments` - Lista zatwierdzonych komentarzy
  - Tylko komentarze z `approved=1`

- `POST /api/lab3/posts/{id}/comments` - Dodawanie komentarza
  - Body: `{ author, body }`
  - Domyślnie `approved=0`
  - Status: 201

- `GET /api/lab3/comments/pending` - Lista komentarzy oczekujących
  - Tylko komentarze z `approved=0`
  - Zawiera informacje o powiązanym poście

- `POST /api/lab3/comments/{id}/approve` - Zatwierdzanie komentarza
  - Ustawia `approved=1`
  - Status: 200

## Interfejs użytkownika

### Strony

1. **Główna (`/dashboard/lab3`)**
   - Nawigacja do postów i panelu moderacji

2. **Lista postów (`/dashboard/lab3/posts`)**
   - Tabela z postami
   - Liczba zatwierdzonych komentarzy
   - Formularz dodawania nowego posta
   - Przycisk "Zobacz" do szczegółów posta

3. **Szczegóły posta (`/dashboard/lab3/posts/[id]`)**
   - Wyświetlanie tytułu i treści posta
   - Lista zatwierdzonych komentarzy
   - Formularz dodawania komentarza
   - Informacja o konieczności moderacji

4. **Panel moderacji (`/dashboard/lab3/moderation`)**
   - Lista komentarzy oczekujących na zatwierdzenie
   - Informacje o poście i autorze
   - Przycisk "Zatwierdź" dla każdego komentarza
   - Automatyczne odświeżanie po zatwierdzeniu

## Funkcjonalności

### Dodawanie postów
- Formularz z walidacją
- Wymagane pola: tytuł i treść
- Automatyczne odświeżanie listy po dodaniu

### Dodawanie komentarzy
- Formularz dostępny na stronie szczegółów posta
- Wymagane pola: autor i treść
- Domyślnie `approved=0` (niewidoczny)
- Informacja o konieczności moderacji

### Moderacja komentarzy
- Panel z listą oczekujących komentarzy
- Wyświetlanie informacji o poście
- Przycisk "Zatwierdź" dla każdego komentarza
- Po zatwierdzeniu komentarz natychmiast widoczny w widoku publicznym

### Widok publiczny
- Wyświetlanie tylko zatwierdzonych komentarzy (`approved=1`)
- Niewidoczność komentarzy oczekujących na moderację
- Real-time aktualizacja po moderacji (SWR)

## Komponenty

### Formularze
- `AddNewPostForm` - Dodawanie nowego posta
- `AddCommentForm` - Dodawanie komentarza do posta
- `ApproveCommentButton` - Przycisk zatwierdzania komentarza

### Nawigacja
- `NavbarLab3` - Menu z linkami do postów i moderacji

## Technologie
- **Next.js 15** (App Router)
- **Prisma** (ORM)
- **MongoDB** (Baza danych)
- **Material-UI** (Komponenty UI)
- **SWR** (Data fetching i cache)
- **React Hook Form** (Formularze)
- **TypeScript** (Typowanie)

## Uruchomienie

1. Zaktualizuj schemat Prisma:
```bash
npx prisma generate
```

2. Uruchom aplikację:
```bash
npm run dev
```

3. Otwórz przeglądarkę:
```
http://localhost:3000/dashboard/lab3
```

## Workflow użytkownika

1. **Dodawanie posta**: Użytkownik tworzy nowy post w formularzu
2. **Przeglądanie postów**: Lista wszystkich postów z licznikiem komentarzy
3. **Szczegóły posta**: Wyświetlanie treści i zatwierdzonych komentarzy
4. **Dodawanie komentarza**: Użytkownik dodaje komentarz (niewidoczny dla innych)
5. **Moderacja**: Moderator sprawdza i zatwierdza komentarze
6. **Publikacja**: Zatwierdzony komentarz natychmiast widoczny dla wszystkich

## Akceptacja ✅
- ✅ Nowy komentarz nie jest widoczny, dopóki nie zostanie zatwierdzony
- ✅ Zatwierdzony komentarz natychmiast widoczny w widoku publicznym
- ✅ Panel moderatora z listą oczekujących komentarzy
- ✅ Formularz dodawania postów i komentarzy
- ✅ API zgodne z kontraktem
- ✅ Paginacja na liście postów
- ✅ Real-time aktualizacja danych (SWR)
