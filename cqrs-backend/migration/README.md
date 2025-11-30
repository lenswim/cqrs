# Migration Scripts

## Import Conversations

This script imports conversations from text files into the CQRS backend.

### Prerequisites

1. Ensure the backend is running on `http://localhost:8080`
2. Node.js 18+ installed (for native `fetch` support)

### Usage

From the `cqrs-backend` directory:

```bash
# Import 2013 conversations (default)
npm run import:2013
# or
node migration/import-conversations.js

# Import 2015 conversations
npm run import:2015
# or
node migration/import-conversations.js 2015

# Import any year
node migration/import-conversations.js [year]
```

### What it does

1. Reads `migration/{year}.txt` file (e.g., `2013.txt`, `2015.txt`)
2. Parses conversations separated by empty lines
3. For each conversation:
   - Generates a random date in the specified year for `conversationDate`
   - Generates a UUID for the conversation `id`
   - Parses lines as either:
     - **SPEECH**: Lines matching `Name: text` pattern (e.g., `Kevin: Ik ga trouwen`)
       - Creates participant with the speaker's name
       - Sets `victim: false`
     - **CONTEXT**: All other lines (e.g., `Kevin is aan het hikken...`)
       - No participants
       - **Special handling**: Lines wrapped in `*...*` (e.g., `*andere persoon legt af*`) have the asterisks removed
   - Marks the last line of each conversation as `punchLine: true`
4. POSTs each conversation to `http://localhost:8080/conversations`
5. Logs success/failure for each conversation

### Output

The script provides:
- Real-time progress with ✓/✗ indicators
- Final summary with success/failure counts
- List of failed conversation indices (if any)

### Example Output

```
🚀 Starting conversation import for year 2015...

Reading from: C:\cqrs_old\cqrs-backend\migration\2015.txt
Posting to: http://localhost:8080/conversations

Found 53 conversations to import

✓ Conversation 1 posted successfully (ID: a1b2c3d4-...)
✓ Conversation 2 posted successfully (ID: e5f6g7h8-...)
...

==================================================

📊 Import Summary:
   Year: 2015
   Total: 53
   ✓ Success: 53
   ✗ Failed: 0

✨ Import complete!
```

### Features

- **Year parameter**: Specify which year file to import
- **Action context lines**: Automatically removes `*` from lines like `*action*`
- **Error handling**: Shows helpful message if file not found
- **Batch import**: Imports all conversations with 100ms delay between requests
- **Summary report**: Complete success/failure statistics

