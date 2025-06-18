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

// Filter products function implementation
const filterProducts = (products, filters) => {
    return products.filter(product => {
        // Category filter
        if (filters.category && product.category !== filters.category) {
            return false;
        }
        
        // Max price filter
        if (filters.max_price !== undefined && product.price > filters.max_price) {
            return false;
        }
        
        // Min rating filter
        if (filters.min_rating !== undefined && product.rating < filters.min_rating) {
            return false;
        }
        
        // Stock availability filter
        if (filters.in_stock !== undefined && product.in_stock !== filters.in_stock) {
            return false;
        }
        
        return true;
    });
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

// Main search function using OpenAI API
const searchProducts = async (userQuery, products) => {
    try {
        console.log('🤖 Processing your request with AI...\n');
        
        const messages = [
            {
                role: 'system',
                content: `You are a product search assistant. Analyze user preferences and call the filter_products function with appropriate parameters. 
                
Available product categories: Electronics, Fitness, Kitchen, Books, Clothing
Price range in dataset: $9.99 - $1299.99
Rating range: 0-5 scale (dataset contains ratings 4.0-4.8)

When user mentions:
- "affordable" or "cheap" = max_price around $50
- "expensive" or "premium" = min_rating 4.5+
- "good quality" or "high rated" = min_rating 4.5+
- "available" or "in stock" = in_stock: true
- Category names should match exactly: Electronics, Fitness, Kitchen, Books, Clothing`
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

        const filters = JSON.parse(functionCall.arguments);
        console.log('🎯 AI extracted filters:', JSON.stringify(filters, null, 2));
        
        const filteredProducts = filterProducts(products, filters);
        return formatProducts(filteredProducts);
        
    } catch (error) {
        console.error('❌ Error processing search:', error.message);
        return '❌ Failed to process your search request. Please try again.';
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
                const result = await searchProducts(query, products);
                console.log(result);
            } catch (error) {
                console.error('❌ Unexpected error:', error.message);
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