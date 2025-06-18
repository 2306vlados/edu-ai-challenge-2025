// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const readline = require('readline');
const { OpenAI } = require('openai');

// Constants
const PRODUCTS_FILE = './products.json';
const MODEL_NAME = 'gpt-4.1-mini';

// Initialize OpenAI client (lazy initialization)
let openai = null;

const initializeOpenAI = () => {
    if (!openai) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    return openai;
};

// Function schema for OpenAI function calling
const FILTER_PRODUCTS_FUNCTION = {
    name: 'filter_products',
    description: 'Filter products based on user preferences including category, price range, rating, and stock availability',
    parameters: {
        type: 'object',
        properties: {
            category: {
                type: 'string',
                description: 'Product category to filter by',
                enum: ['Electronics', 'Fitness', 'Kitchen', 'Books', 'Clothing']
            },
            max_price: {
                type: 'number',
                description: 'Maximum price for the product'
            },
            min_rating: {
                type: 'number',
                description: 'Minimum rating for the product (0-5 scale)',
                minimum: 0,
                maximum: 5
            },
            in_stock: {
                type: 'boolean',
                description: 'Whether to only show products that are in stock'
            }
        }
    }
};

// Load products data
const loadProducts = () => {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error loading products data:', error.message);
        process.exit(1);
    }
};

const PRICE_RANGES = {
    'cheap': 50,
    'budget': 100,
    'affordable': 200,
    'expensive': 500,
    'premium': 1000
};

// Filter products function implementation
const filterProducts = (filters) => {
    const {
        category,
        min_price,
        max_price,
        min_rating,
        in_stock_only,
        search_term
    } = filters;

    let filteredProducts = products.filter(product => {
        // Category filter
        if (category && product.category.toLowerCase() !== category.toLowerCase()) {
            return false;
        }

        // Price filters
        if (min_price !== undefined && product.price < min_price) {
            return false;
        }
        if (max_price !== undefined && product.price > max_price) {
            return false;
        }

        // Rating filter
        if (min_rating !== undefined && product.rating < min_rating) {
            return false;
        }

        // Stock filter
        if (in_stock_only && !product.in_stock) {
            return false;
        }

        // Search term filter
        if (search_term) {
            const searchLower = search_term.toLowerCase();
            return product.name.toLowerCase().includes(searchLower);
        }

        return true;
    });



    // Smart sorting logic
    if (filteredProducts.length > 1) {
        // If no price constraints, sort by rating (best first)
        if (max_price === undefined && min_price === undefined) {
            filteredProducts = filteredProducts.sort((a, b) => b.rating - a.rating);
        }
        // If price constraints exist, sort by price (cheapest first)
        else if (max_price !== undefined) {
            filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
        }
    }

    // FALLBACK: If no results and we have ANY criteria, try progressive relaxation
    if (filteredProducts.length === 0) {
        console.log('\n❗ No exact matches found. Trying progressive search...');
        
        // Try 1: Relax rating requirements
        if (min_rating !== undefined && min_rating > 4.0) {
            const relaxedRating = filterProductsWithRelaxedRating(filters);
            if (relaxedRating.length > 0) {
                console.log('📈 Relaxed rating requirements');
                return relaxedRating.slice(0, 10);
            }
        }
        
        // Try 2: Relax price requirements
        if (max_price !== undefined || min_price !== undefined) {
            const relaxedPrice = filterProductsWithRelaxedPrice(filters);
            if (relaxedPrice.length > 0) {
                console.log('💰 Relaxed price requirements');
                return relaxedPrice.slice(0, 10);
            }
        }
        
        // Try 3: Category-only search
        if (category) {
            const categoryOnly = products.filter(p => 
                p.category.toLowerCase() === category.toLowerCase()
            ).sort((a, b) => b.rating - a.rating);
            if (categoryOnly.length > 0) {
                console.log('📂 Showing all products in category');
                return categoryOnly.slice(0, 10);
            }
        }
        
        // Try 4: Search term only (if exists)
        if (search_term) {
            const termOnly = products.filter(p => 
                p.name.toLowerCase().includes(search_term.toLowerCase())
            ).sort((a, b) => b.rating - a.rating);
            if (termOnly.length > 0) {
                console.log('🔍 Broader search by product name');
                return termOnly.slice(0, 10);
            }
        }
        
        // Try 5: Last resort - show popular products (high ratings)
        console.log('⭐ Showing most popular products');
        return products
            .filter(p => p.rating >= 4.5)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);
    }

    return filteredProducts;
};

// Helper function to relax rating requirements
const filterProductsWithRelaxedRating = (originalFilters) => {
    const relaxedFilters = { ...originalFilters };
    // Lower the rating requirement
    if (relaxedFilters.min_rating >= 4.5) {
        relaxedFilters.min_rating = 4.0;
    } else if (relaxedFilters.min_rating >= 4.0) {
        delete relaxedFilters.min_rating;
    }
    
    return products.filter(product => {
        if (relaxedFilters.category && product.category.toLowerCase() !== relaxedFilters.category.toLowerCase()) return false;
        if (relaxedFilters.min_price !== undefined && product.price < relaxedFilters.min_price) return false;
        if (relaxedFilters.max_price !== undefined && product.price > relaxedFilters.max_price) return false;
        if (relaxedFilters.min_rating !== undefined && product.rating < relaxedFilters.min_rating) return false;
        if (relaxedFilters.in_stock_only && !product.in_stock) return false;
        if (relaxedFilters.search_term) {
            const searchLower = relaxedFilters.search_term.toLowerCase();
            return product.name.toLowerCase().includes(searchLower);
        }
        return true;
    }).sort((a, b) => b.rating - a.rating);
};

// Helper function to relax price requirements
const filterProductsWithRelaxedPrice = (originalFilters) => {
    const relaxedFilters = { ...originalFilters };
    // Increase max_price or remove min_price
    if (relaxedFilters.max_price !== undefined) {
        relaxedFilters.max_price = relaxedFilters.max_price * 2; // Double the budget
    }
    if (relaxedFilters.min_price !== undefined) {
        relaxedFilters.min_price = relaxedFilters.min_price * 0.5; // Half the minimum
    }
    
    return products.filter(product => {
        if (relaxedFilters.category && product.category.toLowerCase() !== relaxedFilters.category.toLowerCase()) return false;
        if (relaxedFilters.min_price !== undefined && product.price < relaxedFilters.min_price) return false;
        if (relaxedFilters.max_price !== undefined && product.price > relaxedFilters.max_price) return false;
        if (relaxedFilters.min_rating !== undefined && product.rating < relaxedFilters.min_rating) return false;
        if (relaxedFilters.in_stock_only && !product.in_stock) return false;
        if (relaxedFilters.search_term) {
            const searchLower = relaxedFilters.search_term.toLowerCase();
            return product.name.toLowerCase().includes(searchLower);
        }
        return true;
    }).sort((a, b) => a.price - b.price);
};

// Format filtered products for display
const formatProducts = (products) => {
    if (products.length === 0) {
        return '❌ No products found matching your criteria.';
    }
    
    let output = '\n🔍 Filtered Products:\n';
    products.forEach((product, index) => {
        const stockStatus = product.in_stock ? 'In Stock' : 'Out of Stock';
        output += `${index + 1}. ${product.name} - $${product.price}, Rating: ${product.rating}, ${stockStatus}\n`;
    });
    
    return output;
};

const displayResults = (products, originalFilters) => {
    if (products.length === 0) {
        console.log('\n❌ No products found matching your criteria.');
        console.log('💡 Try adjusting your search terms or budget.');
        return;
    }

    console.log('\n🔍 Filtered Products:');
    
    // Check if results are alternatives (not exact matches)
    const isAlternativeResults = originalFilters.max_price !== undefined && 
                                products.some(p => p.price > originalFilters.max_price);
    
    if (isAlternativeResults) {
        console.log('💡 Showing closest alternatives since no exact matches were found within your budget.');
    }

    products.forEach((product, index) => {
        const stockStatus = product.in_stock ? 'In Stock' : 'Out of Stock';
        const priceWarning = originalFilters.max_price !== undefined && 
                            product.price > originalFilters.max_price ? ' ⚠️ Above budget' : '';
        
        console.log(`${index + 1}. ${product.name} - $${product.price}${priceWarning}, Rating: ${product.rating}, ${stockStatus}`);
    });

    // Show budget summary if price filtering was used
    if (originalFilters.max_price !== undefined || originalFilters.min_price !== undefined) {
        console.log('\n💰 Budget Summary:');
        if (originalFilters.max_price !== undefined) {
            console.log(`   • Your max budget: $${originalFilters.max_price}`);
            const withinBudget = products.filter(p => p.price <= originalFilters.max_price);
            const aboveBudget = products.filter(p => p.price > originalFilters.max_price);
            
            if (withinBudget.length > 0) {
                console.log(`   • Within budget: ${withinBudget.length} product(s)`);
            }
            if (aboveBudget.length > 0) {
                const cheapestAbove = Math.min(...aboveBudget.map(p => p.price));
                console.log(`   • Above budget: ${aboveBudget.length} product(s) (cheapest: $${cheapestAbove})`);
            }
        }
    }
};

// Main search function using OpenAI API
const searchProducts = async (userQuery) => {
    try {
        const messages = [
            {
                role: 'system',
                content: `You are a product search assistant. Analyze ANY user input and extract the most logical search criteria. Be flexible and interpret user intent, not just keywords.

Available categories: Electronics, Fitness, Kitchen, Books, Clothing

Extract filters based on user intent:
- If user mentions price terms like "cheap", "budget" → max_price: 50
- If user mentions "affordable" → max_price: 200  
- If user mentions "expensive", "premium" → min_price: 500
- If user mentions quality like "best", "top", "high quality" → min_rating: 4.5
- If user mentions "good", "decent" → min_rating: 4.0
- If user mentions availability like "available", "in stock" → in_stock_only: true

IMPORTANT FALLBACK LOGIC:
- If no specific criteria mentioned, try to infer from context
- If user just says general things like "show me products" → return empty filters (show all)
- If user mentions a category without specifics → just set category
- If user asks for "something" without details → be flexible and helpful
- For vague requests, prefer broader searches over empty results
- Extract product names as search_term when mentioned (laptop, phone, book, etc.)

Always try to be helpful - if unsure, err on the side of showing more results rather than fewer.`
            },
            {
                role: 'user',
                content: userQuery
            }
        ];

        const client = initializeOpenAI();
        const response = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: messages,
            functions: [FILTER_PRODUCTS_FUNCTION],
            function_call: { name: 'filter_products' },
            temperature: 0.1
        });

        const functionCall = response.choices[0].message.function_call;
        
        if (!functionCall || functionCall.name !== 'filter_products') {
            throw new Error('AI did not call the filter_products function');
        }

        const extractedFilters = JSON.parse(functionCall.arguments);
        console.log('🎯 AI extracted filters:', JSON.stringify(extractedFilters, null, 2));
        
        const results = filterProducts(extractedFilters);
        displayResults(results, extractedFilters);
        
    } catch (error) {
        console.error('❌ Error processing search:', error.message);
        throw error;
    }
};

// Setup readline interface
const setupReadline = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
};

// Main application
const main = async () => {
    console.log('🛍️  Product Search Assistant');
    console.log('═══════════════════════════');
    console.log('Ask for products in natural language!');
    console.log('Examples:');
    console.log('- "I need electronics under $100 that are in stock"');
    console.log('- "Show me fitness equipment with good ratings"');
    console.log('- "Find affordable books for me"');
    console.log('- "I want kitchen appliances under $200 with rating above 4.5"');
    console.log('\nType "exit" to quit.\n');

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OpenAI API key not found!');
        console.error('Please set OPENAI_API_KEY environment variable.');
        console.error('\nExample:');
        console.error('set OPENAI_API_KEY=your_api_key_here  (Windows)');
        console.error('export OPENAI_API_KEY=your_api_key_here  (Linux/Mac)');
        process.exit(1);
    }

    // Load products
    const products = loadProducts();
    console.log(`✅ Loaded ${products.length} products from database.\n`);

    const rl = setupReadline();

    // Interactive loop
    const askQuestion = () => {
        rl.question('🔍 What products are you looking for? ', async (input) => {
            const query = input.trim();
            
            if (query.toLowerCase() === 'exit') {
                console.log('\n👋 Thank you for using Product Search Assistant!');
                rl.close();
                return;
            }
            
            if (!query) {
                console.log('❌ Please enter a search query.\n');
                askQuestion();
                return;
            }

            try {
                console.log('🤖 Processing your request with AI...');
                await searchProducts(query);
            } catch (error) {
                if (error.code === 'unsupported_country_region_territory') {
                    console.log('❌ Error processing search: 403 Country, region, or territory not supported');
                    console.log('❌ Failed to process your search request. Please try again.');
                } else {
                    console.error('❌ Error processing search:', error.message);
                }
            }
            
            console.log('\n' + '─'.repeat(50) + '\n');
            askQuestion();
        });
    };

    askQuestion();
};

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Goodbye!');
    process.exit(0);
});

// Run the application
if (require.main === module) {
    main().catch((error) => {
        console.error('❌ Application error:', error.message);
        process.exit(1);
    });
}

module.exports = { filterProducts, formatProducts, loadProducts }; 