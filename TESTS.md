# Testy API - Kryteria Akceptacji

## Test 1: Nie można wypożyczyć, gdy active_loans >= copies (oczekiwany 409)

### Scenariusz testowy:
1. Dodaj książkę z `copies: 1`
2. Wypożycz tę książkę (pierwszy raz - powinno się udać)
3. Spróbuj wypożyczyć tę samą książkę ponownie (drugi raz - powinno zwrócić 409)

### Test manualny:

#### Krok 1: Dodaj książkę
```bash
POST /api/books
{
  "title": "Test Book",
  "author": "Test Author",
  "copies": 1
}
```
Oczekiwany wynik: 201, zwraca bookId

#### Krok 2: Dodaj członka (jeśli nie istnieje)
```bash
POST /api/members
{
  "name": "Jan Kowalski",
  "email": "jan.kowalski@test.pl"
}
```
Oczekiwany wynik: 201, zwraca memberId

#### Krok 3: Wypożycz książkę (pierwszy raz)
```bash
POST /api/loans
{
  "memberId": "<memberId z kroku 2>",
  "bookId": "<bookId z kroku 1>"
}
```
Oczekiwany wynik: 201, wypożyczenie utworzone

#### Krok 4: Wypożycz tę samą książkę (drugi raz)
```bash
POST /api/loans
{
  "memberId": "<inny memberId>",
  "bookId": "<bookId z kroku 1>"
}
```
Oczekiwany wynik: 
- Status: **409 Conflict**
- Komunikat: "Brak dostępnych egzemplarzy. Wszystkie 1 egzemplarze książki "Test Book" są już wypożyczone."

---

## Test 2: Dodanie/zwrot aktualizuje liczby bez restartu aplikacji

### Scenariusz testowy:
1. Wypożycz książkę
2. Sprawdź GET /api/books - availableCopies powinno się zmniejszyć
3. Zwróć książkę
4. Sprawdź GET /api/books ponownie - availableCopies powinno się zwiększyć

### Test manualny:

#### Krok 1: Sprawdź dostępność przed wypożyczeniem
```bash
GET /api/books?pageSize=1000
```
Znajdź książkę i zanotuj `availableCopies` (np. 3)

#### Krok 2: Wypożycz książkę
```bash
POST /api/loans
{
  "memberId": "<memberId>",
  "bookId": "<bookId>"
}
```
Zanotuj `loanId` z odpowiedzi

#### Krok 3: Sprawdź dostępność po wypożyczeniu
```bash
GET /api/books?pageSize=1000
```
Oczekiwany wynik: `availableCopies` zmniejszone o 1 (np. 2)

#### Krok 4: Zwróć książkę
```bash
PATCH /api/loans/<loanId>/return
{
  "returnDate": "2025-10-19"
}
```

#### Krok 5: Sprawdź dostępność po zwrocie
```bash
GET /api/books?pageSize=1000
```
Oczekiwany wynik: `availableCopies` zwiększone o 1 (z powrotem 3)

---

## Test 3: Email członka jest unikalny (drugi insert → 409)

### Scenariusz testowy:
1. Dodaj członka z emailem "test@example.com"
2. Spróbuj dodać kolejnego członka z tym samym emailem
3. Powinno zwrócić 409

### Test manualny:

#### Krok 1: Dodaj członka (pierwszy raz)
```bash
POST /api/members
{
  "name": "Jan Kowalski",
  "email": "test@example.com"
}
```
Oczekiwany wynik: 201, członek utworzony

#### Krok 2: Dodaj członka z tym samym emailem (drugi raz)
```bash
POST /api/members
{
  "name": "Anna Nowak",
  "email": "test@example.com"
}
```
Oczekiwany wynik:
- Status: **409 Conflict**
- Komunikat: "Członek z podanym adresem email już istnieje"

---

## Podsumowanie walidacji w kodzie:

### API Loans (POST /api/loans):
✅ Walidacja wymaganych pól (memberId, bookId) - status 400
✅ Sprawdzenie czy członek istnieje - status 404
✅ Sprawdzenie czy książka istnieje - status 404
✅ **Walidacja dostępności: activeLoansCount >= copies - status 409 ✓**
✅ Automatyczne daty: loanDate (dziś), dueDate (+14 dni)

### API Members (POST /api/members):
✅ Walidacja wymaganych pól (name, email) - status 400
✅ Walidacja formatu email - status 400
✅ **Unikalność email - status 409 ✓**

### API Books (GET /api/books):
✅ Zwraca availableCopies = copies - activeLoansCount
✅ Zwraca loanedCopies = activeLoansCount
✅ Aktualizuje się automatycznie po każdym wypożyczeniu/zwrocie

### Frontend (LoanBookForm):
✅ Odświeża listę książek po wypożyczeniu
✅ Filtruje tylko dostępne książki (availableCopies > 0)
✅ Wyłącza przycisk gdy brak dostępnych książek
✅ Walidacja przed wysłaniem (sprawdza czy książka nadal dostępna)
✅ Pokazuje komunikaty błędów z API

### Frontend (ReturnBookForm):
✅ Callback onSuccess do odświeżenia strony po zwrocie
✅ Automatyczna data zwrotu (dziś)
