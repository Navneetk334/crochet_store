import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seed started...')

    // 1. Clean up existing data
    await prisma.wishlistItem.deleteMany()
    await prisma.review.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    console.log('Cleaned up existing data.')

    // 2. Create Categories
    const catHome = await prisma.category.create({
        data: {
            name: 'Home Decor',
            slug: 'home-decor',
            description: 'Handcrafted warmth for your living space.'
        }
    })

    const catFashion = await prisma.category.create({
        data: {
            name: 'Fashion',
            slug: 'fashion',
            description: 'Wearable art for the modern soul.'
        }
    })

    const catAccessories = await prisma.category.create({
        data: {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Stitched with elegance and care.'
        }
    })

    const catYarns = await prisma.category.create({
        data: {
            name: 'Yarns',
            slug: 'yarns',
            description: 'Premium textures for your own creations.'
        }
    })

    console.log('Categories created.')

    // 3. Create Products
    const products = [
        {
            name: 'Vintage Lace Wall Hanging',
            slug: 'vintage-lace-wall-hanging',
            description: 'A breathtaking piece of artisanal craftsmanship. Hand-stitched using premium organic ivory yarn, featuring intricate patterns.',
            price: 1850.00,
            stock: 5,
            categoryId: catHome.id,
            images: ['https://images.unsplash.com/photo-1594910411241-115f5d378077?q=80&w=1000&auto=format&fit=crop'],
            care: 'Hand wash only in cold water. Dry flat in shade.'
        },
        {
            name: 'Sage Dream Cardigan',
            slug: 'sage-dream-cardigan',
            description: 'Wrap yourself in the soft embrace of our signature sage green cardigan. Oversized fit with beautiful textured stitches.',
            price: 3400.00,
            stock: 3,
            categoryId: catFashion.id,
            images: ['https://images.unsplash.com/photo-1516763426617-be0dacc81152?q=80&w=1000&auto=format&fit=crop'],
            care: 'Gentle hand wash. Do not wring.'
        },
        {
            name: 'Ivory Shell Tote Bag',
            slug: 'ivory-shell-tote-bag',
            description: 'Elegant and functional. This hand-crocheted tote features a unique shell stitch pattern and sturdy handles.',
            price: 1200.00,
            stock: 10,
            categoryId: catAccessories.id,
            images: ['https://images.unsplash.com/photo-1595079502155-24bc9b003759?q=80&w=1000&auto=format&fit=crop'],
            care: 'Spot clean with damp cloth.'
        },
        {
            name: 'Petal Soft Baby Blanket',
            slug: 'petal-soft-baby-blanket',
            description: 'The gentlest touch for your little ones. Made with hypoallergenic cotton yarn in a beautiful floral pattern.',
            price: 2100.00,
            stock: 4,
            categoryId: catHome.id,
            images: ['https://images.unsplash.com/photo-1515514754803-c157c1f80879?q=80&w=1000&auto=format&fit=crop'],
            care: 'Machine wash on delicate cycle.'
        },
        {
            name: 'Midnight Bloom Cushion',
            slug: 'midnight-bloom-cushion',
            description: 'Add a touch of drama to your sofa with this dark-toned floral cushion cover. Intricate 3D crochet details.',
            price: 1550.00,
            stock: 6,
            categoryId: catHome.id,
            images: ['https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1000&auto=format&fit=crop'],
            care: 'Dry clean recommended.'
        },
        {
            name: 'Boho Tassel Scarf',
            slug: 'boho-tassel- scarf',
            description: 'A colorful blend of textures. This scarf features handcrafted tassels and a playful mix of yarn types.',
            price: 950.00,
            stock: 12,
            categoryId: catAccessories.id,
            images: ['https://images.unsplash.com/photo-1620799435882-628d3bd70417?q=80&w=1000&auto=format&fit=crop'],
            care: 'Hand wash cold.'
        }
    ]

    for (const product of products) {
        await prisma.product.create({
            data: product
        })
    }

    console.log('Products created.')
    console.log('Seed completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
