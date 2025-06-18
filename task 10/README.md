# Product Search Assistant

AI-powered product search tool using OpenAI's function calling capabilities to filter products based on natural language queries.

## Overview

This console application allows users to search for products using natural language input. Instead of manual filtering logic, it leverages OpenAI's function calling feature to interpret user preferences and automatically filter a product database.

## Features

- 🤖 **Natural Language Processing**: Ask for products in everyday language
- 🔍 **Smart Filtering**: AI extracts filtering criteria from your queries
- 📱 **Function Calling**: Uses OpenAI's function calling for structured data processing
- 🛍️ **Multi-Category Support**: Electronics, Fitness, Kitchen, Books, Clothing
- 💰 **Price & Rating Filters**: Supports price range and rating preferences
- 📦 **Stock Availability**: Filter by in-stock status

## Prerequisites

- **Node.js** (version 16.0.0 or higher)
- **OpenAI API Key** with GPT-4 access
- **Internet connection** for API calls

## Installation

1. **Navigate to the project directory:**

   ```bash
   cd "task 10"
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up your OpenAI API key:**

   **Windows (Command Prompt):**

   ```cmd
   set OPENAI_API_KEY=your_api_key_here
   ```

   **Windows (PowerShell):**

   ```powershell
   $env:OPENAI_API_KEY = "your_api_key_here"
   ```

   **Linux/Mac:**

   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

## Usage

### Starting the Application

Run the application using one of these methods:

```bash
# Method 1: Using npm script
npm start

# Method 2: Direct node execution
node product-search.js
```

### Example Queries

The application accepts natural language queries. Here are some examples:

**Basic Searches:**

- "I need electronics under $100"
- "Show me fitness equipment"
- "Find books for me"

**Advanced Searches:**

- "I want kitchen appliances under $200 with rating above 4.5"
- "Show me affordable electronics that are in stock"
- "Find high-rated fitness equipment under $50"
- "I need premium clothing items with excellent ratings"

**Complex Preferences:**

- "I'm looking for electronics under $300 with great reviews and availability"
- "Show me budget-friendly books with good ratings"
- "Find me kitchen gadgets under $100 that are highly rated and in stock"

### Interactive Session

1. The app will display a welcome message and examples
2. Type your product search query in natural language
3. The AI will process your request and show filtered results
4. Type `exit` to quit the application

## How It Works

### OpenAI Function Calling

The application uses OpenAI's function calling feature with a predefined schema:

```javascript
{
  name: 'filter_products',
  parameters: {
    category: 'Electronics|Fitness|Kitchen|Books|Clothing',
    max_price: number,
    min_rating: number (0-5),
    in_stock: boolean
  }
}
```

### Processing Flow

1. **User Input**: Natural language query
2. **AI Analysis**: OpenAI extracts filtering criteria
3. **Function Call**: AI calls `filter_products` with structured parameters
4. **Filtering**: Products are filtered based on extracted criteria
5. **Results**: Formatted product list is displayed

## Dataset

The application uses `products.json` containing 50 products across 5 categories:

- **Electronics**: Laptops, headphones, smartphones, etc.
- **Fitness**: Exercise equipment, yoga mats, weights, etc.
- **Kitchen**: Appliances, cookware, gadgets, etc.
- **Books**: Novels, guides, cookbooks, etc.
- **Clothing**: Apparel, accessories, footwear, etc.

Each product includes:

- Name and category
- Price ($9.99 - $1299.99)
- Rating (4.0 - 4.8 scale)
- Stock availability

## Troubleshooting

### Common Issues

**API Key Not Found:**

```
❌ OpenAI API key not found!
```

- Ensure you've set the `OPENAI_API_KEY` environment variable
- Restart your terminal after setting the environment variable

**Network/API Errors:**

```
❌ Error processing search: ...
```

- Check your internet connection
- Verify your API key is valid and has sufficient credits
- Ensure you have access to GPT-4 models

**Regional Restrictions:**
If you encounter "unsupported_country_region_territory" errors:

- Use a VPN connection to a supported region
- Contact OpenAI support for account verification

**Dependencies Issues:**

```bash
# Reinstall dependencies
npm install --force

# Clear npm cache if needed
npm cache clean --force
```

### Performance Tips

- The app uses `gpt-4.1-mini` model for optimal speed and cost
- Each query makes one API call
- Responses typically take 1-3 seconds

## Configuration

### Model Settings

The application is configured to use:

- **Model**: `gpt-4.1-mini`
- **Temperature**: 0.1 (for consistent results)
- **Function Calling**: Forced to use `filter_products`

### Customization

You can modify these aspects:

1. **Add Categories**: Edit the enum in `FILTER_PRODUCTS_FUNCTION`
2. **Price Ranges**: Adjust system prompt hints
3. **Rating Scale**: Modify min/max values in function schema
4. **Product Data**: Update `products.json` with your dataset

## Security Notes

- ✅ API key is loaded from environment variables only
- ✅ No API key is stored in code or committed to repository
- ✅ Function calling limits AI to predefined operations
- ✅ Input validation prevents malicious queries

## License

MIT License - Feel free to use and modify for your projects.

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Ensure your OpenAI API key has sufficient credits and access
