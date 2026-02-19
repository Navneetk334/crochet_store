const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seed started...');

    // 1. Clean up existing data safely
    try {
        await prisma.wishlistItem.deleteMany();
        await prisma.review.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        console.log('Cleaned up existing data.');
    } catch (err) {
        console.log('Cleanup: Tables might be empty or not yet created. Proceeding...');
    }

    // 2. Create Categories
    const categories = [
        { name: 'Home Decor', slug: 'home-decor', description: 'Handcrafted warmth for your living space.' },
        { name: 'Fashion', slug: 'fashion', description: 'Wearable art for the modern soul.' },
        { name: 'Accessories', slug: 'accessories', description: 'Stitched with elegance and care.' },
        { name: 'Yarns', slug: 'yarns', description: 'Premium textures for your own creations.' }
    ];

    const createdCats = {};
    for (const cat of categories) {
        const created = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat
        });
        createdCats[cat.name] = created.id;
    }
    console.log('Categories created/verified.');

    // 3. Create Products with RE-VERIFIED AND ROBUST IDs
    const products = [
        {
            name: 'Vintage Lace Wall Hanging',
            slug: 'vintage-lace-wall-hanging',
            description: 'A breathtaking piece of artisanal craftsmanship. Hand-stitched using premium organic ivory yarn.',
            price: 1850.00,
            stock: 5,
            categoryId: createdCats['Home Decor'],
            images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200'],
            care: 'Hand wash only in cold water. Dry flat in shade.'
        },
        {
            name: 'Sage Dream Cardigan',
            slug: 'sage-dream-cardigan',
            description: 'Wrap yourself in the soft embrace of our signature sage green cardigan. Oversized fit.',
            price: 3400.00,
            stock: 3,
            categoryId: createdCats['Fashion'],
            images: ['https://images.unsplash.com/photo-1516763426617-be0dacc81152?auto=format&fit=crop&q=80&w=1200'],
            care: 'Gentle hand wash. Do not wring.',
            sizeChart: 'Size | Length | Chest | Sleeve\nS | 24" | 38" | 22"\nM | 25" | 40" | 23"\nL | 26" | 42" | 24"'
        },
        {
            name: 'Ivory Shell Tote Bag',
            slug: 'ivory-shell-tote-bag',
            description: 'Elegant and functional. This hand-crocheted tote features a unique shell stitch pattern.',
            price: 1200.00,
            stock: 10,
            categoryId: createdCats['Accessories'],
            images: ['https://images.unsplash.com/photo-1595079502155-24bc9b003759?auto=format&fit=crop&q=80&w=1200'],
            care: 'Spot clean with damp cloth.'
        },
        {
            name: 'Petal Soft Baby Blanket',
            slug: 'petal-soft-baby-blanket',
            description: 'The gentlest touch for your little ones. Made with hypoallergenic cotton yarn.',
            price: 2100.00,
            stock: 4,
            categoryId: createdCats['Home Decor'],
            images: ['https://images.unsplash.com/photo-1515514754803-c157c1f80879?auto=format&fit=crop&q=80&w=1200'],
            care: 'Machine wash on delicate cycle.'
        },
        {
            name: 'Midnight Bloom Cushion',
            slug: 'midnight-bloom-cushion',
            description: 'Add a touch of drama to your sofa with this dark-toned floral cushion cover.',
            price: 1550.00,
            stock: 6,
            categoryId: createdCats['Home Decor'],
            images: ['https://images.unsplash.com/photo-1594910411241-115f5d378077?auto=format&fit=crop&q=80&w=1200'],
            care: 'Dry clean recommended.'
        },
        {
            name: 'Boho Tassel Scarf',
            slug: 'boho-tassel-scarf',
            description: 'A colorful blend of textures. Features handcrafted tassels.',
            price: 950.00,
            stock: 12,
            categoryId: createdCats['Accessories'],
            images: ['https://images.unsplash.com/photo-1502441029202-b25832a813c9?auto=format&fit=crop&q=80&w=1200'],
            care: 'Hand wash cold.'
        }
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: product,
            create: product
        });
    }

    console.log('Products created/updated.');
    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
