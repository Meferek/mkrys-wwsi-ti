# Lab02 - Sklep: koszyk i zamówienia

## Struktura projektu

### Modele danych (Prisma Schema)
- `Products` - produkty w sklepie (name, price)
- `Orders` - zamówienia
- `OrderItems` - pozycje zamówienia (snapshot ceny, ilość)

### API Endpoints

#### Produkty
- `GET /api/lab2/products` - lista produktów (paginacja)
- `POST /api/lab2/products` - dodawanie produktu

#### Koszyk
- `GET /api/lab2/cart` - pobieranie koszyka
- `POST /api/lab2/cart/add` - dodawanie produktu do koszyka
- `PATCH /api/lab2/cart/item` - aktualizacja ilości
- `DELETE /api/lab2/cart/item/{product_id}` - usuwanie z koszyka

#### Zamówienia
- `POST /api/lab2/checkout` - składanie zamówienia

### Komponenty UI
- `AddNewProductForm` - formularz dodawania produktu
- `AddToCartButton` - przycisk dodawania do koszyka
- `Cart` - panel koszyka z zarządzaniem

### Strony
- `/dashboard/lab2` - strona główna lab2
- `/dashboard/lab2/products` - produkty i koszyk

## Funkcjonalności
- Walidacja qty > 0
- Snapshot ceny przy zamówieniu
- Koszyk w cookies
- Czyszczenie koszyka po zamówieniu
- Real-time odświeżanie koszyka

## Uruchomienie

```bash
npm run reset:db
npm run dev
```

Aplikacja dostępna na http://localhost:3001
