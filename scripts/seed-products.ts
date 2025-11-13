import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.products.deleteMany({});

    const products = [
        { name: 'Laptop Dell XPS 13', price: 4999.99 },
        { name: 'Mysz Logitech MX Master 3', price: 349.99 },
        { name: 'Klawiatura mechaniczna Keychron K2', price: 399.00 },
        { name: 'Monitor Samsung 27"', price: 1299.99 },
        { name: 'Słuchawki Sony WH-1000XM4', price: 1499.00 },
        { name: 'Pendrive Kingston 64GB', price: 49.99 },
        { name: 'Dysk SSD Samsung 1TB', price: 459.00 },
        { name: 'Kamera internetowa Logitech C920', price: 399.99 },
        { name: 'Router TP-Link AX3000', price: 299.00 },
        { name: 'Hub USB-C 7w1', price: 149.99 }
    ];

    for (const product of products) {
        await prisma.products.create({
            data: product
        });
    }

    console.log(`✅ Dodano ${products.length} produktów`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
