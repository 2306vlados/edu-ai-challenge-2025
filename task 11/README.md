# Audio Transcription & Analysis Tool

A console application that uses OpenAI's Whisper API for audio transcription and GPT models for content summarization and analysis.

## Features

- 🎵 **Audio Transcription**: Converts audio files to text using OpenAI's Whisper-1 model
- 📝 **Content Summarization**: Generates clear summaries using GPT-4.1-mini
- 📊 **Analytics Extraction**: Calculates word count, speaking speed (WPM), and identifies frequently mentioned topics
- 💾 **File Management**: Automatically saves transcriptions with unique timestamps
- 🔧 **Multiple Formats**: Supports MP3, WAV, M4A, MP4, WebM, MPEG, MPGA

## Prerequisites

- **Node.js** v18.0.0 or higher
- **OpenAI API Key** with access to Whisper and GPT models

## Installation

1. **Clone the repository** (or download the task folder):

   ```bash
   cd "task 11"
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up your API key**:
   - Copy `env.example` to `.env`:
     ```bash
     cp env.example .env
     ```
   - Edit `.env` and add your OpenAI API key:
     ```
     OPENAI_API_KEY=sk-proj-your-api-key-here
     ```

## Usage

### Running the Application

Start the interactive console application:

```bash
npm start
```

Or directly with Node.js:

```bash
node app.js
```

### Interactive Mode

The application will present you with options:

```
🎵 Audio Transcription & Analysis Tool
=====================================

📂 Choose an option:
1. Analyze audio file
2. Exit

Enter your choice (1-2):
```

### Analyzing Audio Files

1. **Select option 1** to analyze an audio file
2. **Enter the file path** when prompted:
   ```
   Enter audio file path: ./CAR0004.mp3
   ```
3. **Wait for processing** - the application will:
   - Transcribe the audio using Whisper-1
   - Generate a summary using GPT-4.1-mini
   - Extract analytics and insights
   - Save the transcription to a timestamped file

### Example Output

```
🎵 Processing: CAR0004.mp3
🔄 Step 1/3: Transcribing audio with Whisper...
🔄 Step 2/3: Generating summary with GPT...
🔄 Step 3/3: Analyzing content and extracting insights...

============================================================
📊 ANALYSIS RESULTS
============================================================

📈 Analytics:
   Word Count: 245
   Speaking Speed: 125 WPM
   Frequently Mentioned Topics:
     1. Car Maintenance (8 mentions)
     2. Engine Problems (5 mentions)
     3. Service Appointments (3 mentions)

📝 Summary:
[Generated summary of the audio content...]

💾 Files saved:
   📄 Transcription: transcription_2024-01-15T10-30-45.md

⏱️  Processing completed in 12.3s
```

## File Limitations

- **Maximum file size**: 25 MB
- **Supported formats**: .mp3, .wav, .m4a, .mp4, .webm, .mpeg, .mpga
- Files larger than 25MB will need to be compressed or split

## Output Files

The application creates timestamped transcription files:

- **Format**: `transcription_YYYY-MM-DDTHH-MM-SS.md`
- **Location**: Same directory as the application
- **Content**: File metadata, transcription text, and processing details

## API Usage

The application uses the following OpenAI models:

- **Whisper-1**: For audio transcription
- **GPT-4.1-mini**: For summarization and content analysis

## Troubleshooting

### Common Issues

**1. API Key Not Found**

```
❌ OpenAI API key not found!
```

- Ensure you've created a `.env` file with your API key
- Verify the API key format is correct

**2. File Not Found**

```
❌ File not found: ./audio.mp3
```

- Check the file path is correct
- Ensure the file exists in the specified location

**3. File Too Large**

```
❌ File too large (30.5MB). Maximum: 25MB
```

- Compress your audio file to under 25MB
- Use audio compression tools or convert to a more efficient format

**4. Unsupported Format**

```
❌ Unsupported format. Supported: .mp3, .wav, .m4a, .mp4, .webm, .mpeg, .mpga
```

- Convert your audio file to a supported format

**5. Rate Limit Exceeded**

```
❌ Rate limit exceeded. Please wait and try again.
```

- Wait a few moments before making another request
- Check your OpenAI API usage limits

### Network Issues

If you encounter network-related errors:

- Check your internet connection
- Verify your OpenAI API key has sufficient credits
- Ensure you have access to the required models

## Technical Details

### Architecture

- **Language**: Node.js/JavaScript
- **API Client**: OpenAI SDK v4
- **File Operations**: Native Node.js fs module
- **User Interface**: Interactive console with readline

### Processing Pipeline

1. **File Validation**: Checks format, size, and existence
2. **Audio Transcription**: Uploads to Whisper-1 API
3. **Content Analysis**: Processes text with GPT-4.1-mini
4. **Results Generation**: Calculates metrics and saves files

### Analytics Calculations

- **Word Count**: Splits text by whitespace and counts non-empty words
- **Speaking Speed**: (Word Count / Duration in seconds) × 60
- **Topics**: AI-extracted themes with mention frequency

## Security Notes

- ✅ API key stored securely in environment variables
- ✅ No sensitive data committed to repository
- ✅ Input validation for file operations
- ✅ Error handling for API failures

## License

MIT License - Feel free to use and modify for your projects.

## Support

For issues with this application:

1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Ensure your OpenAI API key is valid and has sufficient credits

For OpenAI API issues, consult the [OpenAI Documentation](https://platform.openai.com/docs/).
