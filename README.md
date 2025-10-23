# 📚 System Wypożyczalni Książek

Pełnofunkcjonalna aplikacja webowa do zarządzania wypożyczalnią książek. System umożliwia przeglądanie katalogu książek (270k+ pozycji), zarządzanie czytelnikami oraz obsługę wypożyczeń z automatycznym śledzeniem terminów zwrotu.

## 📋 O projekcie

### Główne funkcjonalności

- **📖 Katalog książek** - Baza ~10,000 książek z pełnymi metadanymi (tytuł, autor, ISBN, wydawca, okładki)
- **👥 Zarządzanie czytelnikami** - Rejestracja i zarządzanie członkami wypożyczalni
- **🔄 System wypożyczeń** - Wypożyczanie i zwracanie książek z kontrolą dostępności
- **📊 Monitoring** - Śledzenie aktywnych wypożyczeń i historii
- **🔍 Wyszukiwanie** - Zaawansowane wyszukiwanie książek według różnych kryteriów

### Architektura

Aplikacja zbudowana w architekturze **Jamstack** z użyciem:
- **Frontend**: Next.js 15 (App Router) + React 19
- **Backend**: Next.js API Routes (serverless functions)
- **Baza danych**: MongoDB Atlas (NoSQL, cloud)
- **ORM**: Prisma (type-safe database access)
- **UI**: Material-UI + TailwindCSS
- **Język**: TypeScript (100% type coverage)

## 🚀 Szybki start

### 1. Instalacja

```bash
npm install
```

### 2. Konfiguracja bazy danych

Utwórz plik `.env` w głównym katalogu:

```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/book_rental"
```

### 3. Synchronizacja schematu

```bash
npm run prisma:push
npm run prisma:generate
```

### 4. Import książek (opcjonalnie)

```bash
npm run import-books data/books_clean.csv
```

### 5. Uruchomienie

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000)

## 📦 Dostępne komendy

- `npm run dev` - Uruchamia serwer deweloperski
- `npm run build` - Buduje aplikację produkcyjną
- `npm run start` - Uruchamia aplikację produkcyjną
- `npm run prisma:studio` - Otwiera Prisma Studio (przeglądarka bazy danych)
- `npm run import-books <plik.csv>` - Importuje książki z pliku CSV
- `npm run clear-books` - Usuwa wszystkie książki z bazy
- `npm run check-csv <plik.csv>` - Sprawdza plik CSV przed importem

## 🗄️ Struktura bazy danych

### Kolekcje MongoDB:
- **books** - katalog książek (tytuł, autor, ISBN, wydawca, etc.)
- **members** - czytelnicy biblioteki
- **loans** - wypożyczenia (aktywne i archiwalne)

## 🛠️ Stack technologiczny

- **Next.js 15** - framework React z App Router
- **MongoDB Atlas** - baza danych NoSQL w chmurze
- **Prisma** - ORM z auto-generowaniem typów TypeScript
- **Material-UI** - komponenty UI (DataGrid, formularze)
- **TypeScript** - pełne typowanie kodu
- **TailwindCSS** - utility-first CSS framework

## 🌐 API Endpoints

Aplikacja udostępnia RESTful API z następującymi endpointami:

### 📚 Książki (`/api/books`)

```
GET    /api/books              - Lista wszystkich książek (paginacja, search)
GET    /api/books?search=...   - Wyszukiwanie książek
GET    /api/books/[id]/availability - Sprawdzenie dostępności książki
```

**Przykładowa odpowiedź:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "isbn": "0195153448",
  "title": "Classical Mythology",
  "author": "Mark P. O. Morford",
  "year": "2002",
  "publisher": "Oxford University Press",
  "copies": 3,
  "imageUrlM": "http://images.amazon.com/..."
}
```

### 👥 Czytelnicy (`/api/members`)

```
GET    /api/members            - Lista wszystkich członków
POST   /api/members            - Dodanie nowego członka
GET    /api/members/[id]       - Szczegóły członka
PUT    /api/members/[id]       - Aktualizacja danych członka
DELETE /api/members/[id]       - Usunięcie członka
```

**Przykład tworzenia członka:**
```json
POST /api/members
{
  "name": "Jan Kowalski",
  "email": "jan.kowalski@example.com"
}
```

### 🔄 Wypożyczenia (`/api/loans`)

```
GET    /api/loans              - Lista wszystkich wypożyczeń
POST   /api/loans              - Utworzenie nowego wypożyczenia
GET    /api/loans?active=true  - Tylko aktywne wypożyczenia
POST   /api/loans/[id]/return  - Zwrot książki
```

**Przykład wypożyczenia książki:**
```json
POST /api/loans
{
  "memberId": "507f1f77bcf86cd799439011",
  "bookId": "507f191e810c19729de860ea",
  "dueDate": "2025-11-22T00:00:00Z"
}
```

**Zwrot książki:**
```json
POST /api/loans/[id]/return
{
  "returnDate": "2025-10-25T14:30:00Z"
}
```

## 📊 Model danych (Prisma Schema)

### Books (książki)
- `id` - MongoDB ObjectId
- `isbn` - Numer ISBN (unikalny)
- `title` - Tytuł książki
- `author` - Autor
- `year` - Rok wydania
- `publisher` - Wydawca
- `imageUrlS/M/L` - URLe do okładek (małe/średnie/duże)
- `copies` - Liczba dostępnych egzemplarzy

### Members (czytelnicy)
- `id` - MongoDB ObjectId
- `name` - Imię i nazwisko
- `email` - Email (unikalny)
- `createdAt` - Data rejestracji
- `loans[]` - Relacja do wypożyczeń

### Loans (wypożyczenia)
- `id` - MongoDB ObjectId
- `memberId` - ID członka (relacja)
- `bookId` - ID książki (relacja)
- `loanDate` - Data wypożyczenia
- `dueDate` - Termin zwrotu
- `returnDate` - Data rzeczywistego zwrotu (NULL = aktywne)

## 🔧 Konfiguracja zaawansowana

### Zmienne środowiskowe

Utwórz plik `.env.local` (dla Next.js) i `.env` (dla Prisma):

```env
# MongoDB Connection
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/book_rental?retryWrites=true&w=majority"

# Opcjonalne
NODE_ENV="development"
```

### Prisma Studio

Przeglądaj i edytuj dane w graficznym interfejsie:

```bash
npm run prisma:studio
```

Otwiera się na [http://localhost:5555](http://localhost:5555)

### Import danych

Skrypt importu obsługuje pliki CSV z następującymi kolumnami:
- `ISBN`, `Book-Title`, `Book-Author`, `Year-Of-Publication`, `Publisher`
- `Image-URL-S`, `Image-URL-M`, `Image-URL-L`

Format: CSV z przecinkami lub średnikami jako delimitery.

## 🚨 Obsługa błędów

API zwraca standardowe kody HTTP:
- `200` - Sukces
- `201` - Zasób utworzony
- `400` - Błędne dane wejściowe
- `404` - Nie znaleziono zasobu
- `500` - Błąd serwera

Przykład odpowiedzi błędu:
```json
{
  "error": "Book not found",
  "details": "No book with ID 507f1f77bcf86cd799439011"
}
```

## 📝 Rozwój projektu

### Kolejne kroki
- [ ] Autentykacja użytkowników (NextAuth.js)
- [ ] System powiadomień o zbliżających się terminach zwrotu
- [ ] Statystyki i raporty
- [ ] Rezerwacje książek
- [ ] Oceny i recenzje książek
- [ ] Wersja mobilna (PWA)

## 👨‍💻 Dla deweloperów

### Struktura projektu

```
mkrys-wwsi-ti/
├── src/
│   ├── app/
│   │   ├── api/           # API Routes (backend)
│   │   │   ├── books/     # Endpointy książek
│   │   │   ├── members/   # Endpointy członków
│   │   │   └── loans/     # Endpointy wypożyczeń
│   │   ├── layout.tsx     # Layout główny
│   │   └── page.tsx       # Strona główna
│   ├── lib/
│   │   └── prisma.ts      # Singleton Prisma Client
│   └── styles/
│       └── globals.css    # Style globalne
├── prisma/
│   └── schema.prisma      # Schema bazy danych
├── scripts/
│   ├── import-books.ts    # Import książek z CSV
│   ├── clear-books.ts     # Czyszczenie bazy
│   └── check-csv.ts       # Walidacja CSV
└── data/
    └── books_clean.csv    # Dane książek
```

### Konwencje kodu

- **Nazewnictwo**: camelCase dla zmiennych, PascalCase dla komponentów
- **API**: RESTful conventions
- **Commits**: Conventional Commits (feat:, fix:, docs:, etc.)
- **TypeScript**: Strict mode enabled

### Testowanie API

Użyj Postman, Insomnia lub curl:

```bash
# Pobierz listę książek
curl http://localhost:3000/api/books

# Dodaj nowego członka
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Jan Kowalski","email":"jan@example.com"}'

# Wypożycz książkę
curl -X POST http://localhost:3000/api/loans \
  -H "Content-Type: application/json" \
  -d '{"memberId":"...","bookId":"...","dueDate":"2025-11-30"}'
```

## 📄 Licencja

Projekt edukacyjny - WWSI Technologie Internetowe 2025
