# Service Analyzer Console App

A command-line tool that uses the OpenAI API to generate structured, multi-perspective analysis reports for digital services or products. The app accepts either a service name (e.g., "Spotify") or a raw service description and outputs a markdown-formatted report with business, technical, and user-focused insights.

---

## Prerequisites

- **Node.js v18 or higher** (for built-in fetch API)
- **An OpenAI API key** (see [OpenAI](https://platform.openai.com/account/api-keys))

---

## Setup & Usage

1. **Clone or download this repository and open the `task 9` folder.**

2. **Set your OpenAI API key as an environment variable:**

   - On Windows (PowerShell):
     ```sh
     $env:OPENAI_API_KEY="your-key-here"
     ```
   - On macOS/Linux:
     ```sh
     export OPENAI_API_KEY="your-key-here"
     ```

3. **Run the application:**

   ```sh
   node service-analyzer.js
   ```

4. **Follow the prompt:**
   - Enter a service name (e.g., `Spotify`) or paste a service description.
   - Wait for the analysis to complete.
   - The markdown report will be displayed in the terminal.
   - You will be asked if you want to save the report to a file (`service_report.md`).

---

## Example

```
Enter a service name or description: Notion

Analyzing... Please wait.

--- Service Analysis Report ---

## Brief History
... (output continues)
```

---

## Output Sections

The generated report will always include:

- Brief History
- Target Audience
- Core Features
- Unique Selling Points
- Business Model
- Tech Stack Insights
- Perceived Strengths
- Perceived Weaknesses

---

## Security Note

**Never commit your OpenAI API key to any public repository!**

- The app only reads your key from the environment variable at runtime.
- Do not hardcode or share your key.

---

## Troubleshooting

- If you see `Error: Please set your OpenAI API key...`, make sure the environment variable is set in the same terminal session.
- If you get an OpenAI API error, check your key and your usage limits.
- Node.js must be version 18 or higher (for fetch support).

---

## Contact

For questions or issues, please contact [your-email@example.com].
