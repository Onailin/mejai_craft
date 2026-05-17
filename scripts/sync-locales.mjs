import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "src", "locales");
const BASE_LOCALE = "th";
const TARGET_LOCALES = ["en", "zh", "ja"];

function readLocaleObject(localeCode) {
  const filePath = path.join(LOCALES_DIR, `${localeCode}.ts`);
  const raw = fs.readFileSync(filePath, "utf8");

  const assignRegex = new RegExp(`const\\s+${localeCode}\\s*=\\s*([\\s\\S]*?);\\s*export\\s+default\\s+${localeCode};`);
  const match = raw.match(assignRegex);

  if (!match?.[1]) {
    throw new Error(`Cannot parse locale file: ${filePath}`);
  }

  // Controlled local files only; evaluates object literals from locale files.
  return Function(`"use strict"; return (${match[1]});`)();
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map(cloneValue);
  }

  if (isPlainObject(value)) {
    const result = {};
    for (const [key, child] of Object.entries(value)) {
      result[key] = cloneValue(child);
    }
    return result;
  }

  return value;
}

function mergeWithBase(baseValue, targetValue) {
  if (Array.isArray(baseValue)) {
    return Array.isArray(targetValue) ? targetValue.map(cloneValue) : cloneValue(baseValue);
  }

  if (isPlainObject(baseValue)) {
    const result = {};
    const targetObject = isPlainObject(targetValue) ? targetValue : {};

    for (const [key, childBase] of Object.entries(baseValue)) {
      result[key] = mergeWithBase(childBase, targetObject[key]);
    }

    // Preserve extra keys already present in target locale.
    for (const [extraKey, extraValue] of Object.entries(targetObject)) {
      if (!(extraKey in result)) {
        result[extraKey] = cloneValue(extraValue);
      }
    }

    return result;
  }

  return targetValue === undefined ? baseValue : targetValue;
}

function isIdentifierKey(key) {
  return /^[$A-Z_][0-9A-Z_$]*$/i.test(key);
}

function serializeValue(value, indentLevel = 0) {
  const indent = "  ".repeat(indentLevel);
  const nextIndent = "  ".repeat(indentLevel + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((item) => `${nextIndent}${serializeValue(item, indentLevel + 1)}`);
    return `[\n${items.join(",\n")}\n${indent}]`;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";

    const lines = entries.map(([key, childValue]) => {
      const safeKey = isIdentifierKey(key) ? key : JSON.stringify(key);
      return `${nextIndent}${safeKey}: ${serializeValue(childValue, indentLevel + 1)}`;
    });

    return `{\n${lines.join(",\n")}\n${indent}}`;
  }

  return JSON.stringify(value);
}

function writeLocaleObject(localeCode, localeObject) {
  const filePath = path.join(LOCALES_DIR, `${localeCode}.ts`);
  const body = `const ${localeCode} = ${serializeValue(localeObject)};\n\nexport default ${localeCode};\n`;
  fs.writeFileSync(filePath, body, "utf8");
}

function main() {
  const baseObject = readLocaleObject(BASE_LOCALE);

  for (const localeCode of TARGET_LOCALES) {
    const currentTarget = readLocaleObject(localeCode);
    const merged = mergeWithBase(baseObject, currentTarget);
    writeLocaleObject(localeCode, merged);
    console.log(`Synced locale: ${localeCode}`);
  }

  console.log("Locale sync complete.");
}

main();
