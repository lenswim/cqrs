import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get year from command line argument, default to 2013
const year = process.argv[2] || '2013';

// Configuration
const API_URL = 'http://localhost:8080/conversations';
const INPUT_FILE = join(__dirname, `${year}.txt`);

/**
 * Generate a random date in the specified year
 */
function randomDateInYear(year) {
  const start = new Date(`${year}-01-01`).getTime();
  const end = new Date(`${year}-12-31`).getTime();
  const randomTime = start + Math.random() * (end - start);
  const date = new Date(randomTime);

  // Format as YYYY-MM-DD
  return date.toISOString().split('T')[0];
}

/**
 * Parse a single line into a Line object
 */
function parseLine(lineText, isPunchLine) {
  const trimmedLine = lineText.trim();

  // Check if entire line is wrapped in *...* (context action line)
  const contextActionPattern = /^\*(.+)\*$/;
  const contextActionMatch = trimmedLine.match(contextActionPattern);

  if (contextActionMatch) {
    // Context line wrapped in asterisks - remove them
    return {
      text: contextActionMatch[1].trim(),
      punchLine: isPunchLine,
      lineType: 'CONTEXT',
      participants: []
    };
  }

  // Check if it's a SPEECH line (Name: text pattern)
  const speechPattern = /^([^:]+):\s*(.+)$/;
  const match = trimmedLine.match(speechPattern);

  if (match) {
    // SPEECH line
    const speakerName = match[1].trim();
    const text = match[2].trim();

    return {
      text: text,
      punchLine: isPunchLine,
      lineType: 'SPEECH',
      participants: [
        {
          name: speakerName,
          victim: false
        }
      ]
    };
  } else {
    // CONTEXT line
    return {
      text: trimmedLine,
      punchLine: isPunchLine,
      lineType: 'CONTEXT',
      participants: []
    };
  }
}

/**
 * Parse a single conversation text into a Conversation object
 */
function parseConversation(conversationText) {
  const lines = conversationText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return null;
  }

  // Parse all lines, marking the last one as punchline
  const parsedLines = lines.map((lineText, index) => {
    const isPunchLine = (index === lines.length - 1);
    return parseLine(lineText, isPunchLine);
  });

  return {
    id: randomUUID(),
    conversationDate: randomDateInYear(year),
    lines: parsedLines
  };
}

/**
 * Parse the entire file into conversations
 */
function parseConversationsFile(fileContent) {
  // Split by empty lines (one or more blank lines)
  const conversationTexts = fileContent
    .split(/\n\s*\n/)
    .map(text => text.trim())
    .filter(text => text.length > 0);

  return conversationTexts
    .map(parseConversation)
    .filter(conv => conv !== null);
}

/**
 * POST a conversation to the API
 */
async function postConversation(conversation, index) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conversation)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✓ Conversation ${index + 1} posted successfully (ID: ${result.id})`);
      return { success: true, index, id: result.id };
    } else {
      const errorText = await response.text();
      console.error(`✗ Conversation ${index + 1} failed (Status ${response.status}): ${errorText}`);
      return { success: false, index, status: response.status, error: errorText };
    }
  } catch (error) {
    console.error(`✗ Conversation ${index + 1} failed with error: ${error.message}`);
    return { success: false, index, error: error.message };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`🚀 Starting conversation import for year ${year}...\n`);
  console.log(`Reading from: ${INPUT_FILE}`);
  console.log(`Posting to: ${API_URL}\n`);

  // Read and parse the file
  let fileContent;
  try {
    fileContent = readFileSync(INPUT_FILE, 'utf-8');
  } catch (error) {
    console.error(`❌ Error reading file: ${INPUT_FILE}`);
    console.error(`   ${error.message}`);
    console.error(`\nUsage: node import-conversations.js [year]`);
    console.error(`Example: node import-conversations.js 2015`);
    process.exit(1);
  }

  const conversations = parseConversationsFile(fileContent);

  console.log(`Found ${conversations.length} conversations to import\n`);

  // Post each conversation
  const results = [];
  for (let i = 0; i < conversations.length; i++) {
    const result = await postConversation(conversations[i], i);
    results.push(result);

    // Small delay between requests to avoid overwhelming the server
    if (i < conversations.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  console.log(`\n📊 Import Summary:`);
  console.log(`   Year: ${year}`);
  console.log(`   Total: ${conversations.length}`);
  console.log(`   ✓ Success: ${successCount}`);
  console.log(`   ✗ Failed: ${failureCount}`);

  if (failureCount > 0) {
    console.log(`\n⚠️  Failed conversation indices: ${results.filter(r => !r.success).map(r => r.index + 1).join(', ')}`);
  }

  console.log('\n✨ Import complete!');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

