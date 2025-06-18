# Product Search Assistant

This is a console application that uses OpenAI's function calling feature to filter products based on natural language queries.

## Features

- Natural language product search
- Category filtering (Electronics, Fitness, Kitchen, Books, Clothing)
- Price range filtering
- Rating-based filtering
- Stock availability filtering
- Interactive console interface

## Installation

1. Make sure you have Node.js installed (version 18 or higher)
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your OpenAI API key:
   - The `.env` file is already included with the API key
   - If you need to change it, edit the `.env` file:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```

## Usage

Run the application:

```bash
npm start
```

Then enter natural language queries like:

- "Find electronics under $500"
- "Show me books with rating above 4"
- "I want fitness equipment that's in stock"
- "Kitchen items between $50 and $200"
- "Show all clothing with 5-star ratings"

Type 'exit' to quit the application.

## How it Works

The application uses OpenAI's function calling feature to:

1. Parse natural language queries
2. Extract filtering criteria (category, price range, rating, stock status)
3. Apply filters to the product dataset
4. Return matching products

The AI determines which parameters to use based on your natural language input - no manual logic for parsing queries is implemented.

## Dataset

The application searches through 50 sample products across 5 categories:

- Electronics (laptops, smartphones, headphones, etc.)
- Fitness (equipment, supplements, accessories)
- Kitchen (appliances, cookware, gadgets)
- Books (various genres and topics)
- Clothing (apparel and accessories)

Each product has:

- Name and description
- Category
- Price
- Rating (1-5 stars)
- Stock availability
- Brand information

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
