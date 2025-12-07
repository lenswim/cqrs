import fs from "fs";
import path from "path";
import crypto from "crypto";

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

function uuid() {
  return crypto.randomBytes(12).toString("hex");
}

function extractYear(filename) {
  const match = filename.match(/(19\d{2}|20\d{2})/);
  return match ? match[1] : null;
}

function getDatesForYear(year, count) {
  const dates = [];
  const start = new Date(`${year}-01-01T00:00:00Z`).getTime();
  const end = new Date(`${year}-12-31T23:59:59Z`).getTime();
  const span = end - start;

  for (let i = 0; i < count; i++) {
    const t = start + Math.floor((span / count) * i);
    dates.push(new Date(t));
  }
  return dates;
}

function parseConversation(lines) {
  const parsed = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // Action line
    if (line.startsWith("*") && line.endsWith("*")) {
      parsed.push({
        text: line.replace(/\*/g, "").trim(),
        punchLine: false,
        lineType: "ACTION",
        participants: []
      });
      continue;
    }

    // Speech line
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const name = match[1].trim();
      const content = match[2].trim();

      parsed.push({
        text: content,
        punchLine: false,
        lineType: "SPEECH",
        participants: [
          { name, victim: false }
        ]
      });
      continue;
    }
  }

  // Last line becomes punchline
  if (parsed.length > 0) {
    parsed[parsed.length - 1].punchLine = true;
  }

  return parsed;
}

function splitIntoConversations(text) {
  const lines = text.split("\n");

  const conversations = [];
  let buffer = [];

  for (const line of lines) {
    if (line.trim() === "") {
      if (buffer.length > 0) {
        conversations.push([...buffer]);
        buffer = [];
      }
    } else {
      buffer.push(line);
    }
  }

  if (buffer.length > 0) {
    conversations.push(buffer);
  }

  return conversations;
}

// ------------------------------------------------------
// Main migration
// ------------------------------------------------------

function migrate(folderPath) {
  const allFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".txt"));
  const groups = {};

  // Group files by year
  for (const file of allFiles) {
    const year = extractYear(file);
    if (!year) {
      console.warn(`⚠ Skipping ${file} (no year in filename)`);
      continue;
    }
    if (!groups[year]) groups[year] = [];
    groups[year].push(file);
  }

  for (const year of Object.keys(groups)) {
    const files = groups[year];
    let allConversations = [];

    // Parse all conversations from all files of the year
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const txt = fs.readFileSync(fullPath, "utf8");
      const blocks = splitIntoConversations(txt);

      for (const block of blocks) {
        const parsed = parseConversation(block);
        if (parsed.length > 0) {
          allConversations.push(parsed);
        }
      }

      console.log(`Processed ${file} (${blocks.length} blocks)`);
    }

    // Unique spaced dates for this year
    const dates = getDatesForYear(year, allConversations.length);

    // ✨ createdOn and conversationDate are the SAME value now
    const outputData = allConversations.map((lines, i) => {
      const dateISO = dates[i].toISOString();

      return {
        conversation: {
          id: uuid(),
          createdOn: dateISO,
          conversationDate: dateISO.split("T")[0],
          lines
        }
      };
    });

    // Save JSON for this year
    const output = path.join(folderPath, `${year}.json`);
    fs.writeFileSync(output, JSON.stringify(outputData, null, 2));

    console.log(`\n✔ Created ${output} with ${outputData.length} conversations\n`);
  }
}

// ------------------------------------------------------
// Entry
// ------------------------------------------------------

const folder = process.argv[2];
if (!folder) {
  console.error("Usage: node migrate.js <folder>");
  process.exit(1);
}

migrate(folder);
