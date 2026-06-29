const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const TARGET_LOCALES = ["en", "ja", "zh"] as const;
const DEEPL_KEY_PLACEHOLDERS = new Set([
  "example",
  "your-deepl-api-key",
  "changeme",
  "change-me",
]);

const DEEPL_LANG_MAP: Record<string, string> = {
  en: "EN",
  ja: "JA",
  zh: "ZH",
};

export type TranslatableLocale = (typeof TARGET_LOCALES)[number];

function isDeepLConfigured() {
  const apiKey = process.env.DEEPL_API_KEY?.trim();
  if (!apiKey) return false;
  return !DEEPL_KEY_PLACEHOLDERS.has(apiKey.toLowerCase());
}

export async function translateText(
  text: string,
  targetLocale: TranslatableLocale
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY?.trim();
  if (!isDeepLConfigured() || !apiKey || !text.trim()) {
    return text;
  }

  const params = new URLSearchParams();
  params.append("text", text);
  params.append("target_lang", DEEPL_LANG_MAP[targetLocale]);
  params.append("source_lang", "TH");

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error("DeepL translation failed:", await response.text());
      return text;
    }

    const data = (await response.json()) as {
      translations: Array<{ text: string }>;
    };

    return data.translations[0]?.text ?? text;
  } catch (error) {
    console.error("DeepL translation request failed:", error);
    return text;
  }
}
export async function translateFields(
  fields: Record<string, string>
): Promise<Record<TranslatableLocale, Record<string, string>>> {
  const result: Record<TranslatableLocale, Record<string, string>> = {
    en: {},
    ja: {},
    zh: {},
  };

  for (const locale of TARGET_LOCALES) {
    for (const [field, value] of Object.entries(fields)) {
      if (!value?.trim()) {
        result[locale][field] = value;
        continue;
      }
      result[locale][field] = await translateText(value, locale);
    }
  }

  return result;
}

export async function upsertTranslations(
  entityType: string,
  entityId: string,
  fields: Record<string, string>
) {
  if (!isDeepLConfigured()) {
    return;
  }

  try {
    const { prisma } = await import("./prisma");
    const translations = await translateFields(fields);

    for (const locale of TARGET_LOCALES) {
      for (const [fieldName, translatedText] of Object.entries(translations[locale])) {
        const existing = await prisma.contentTranslation.findUnique({
          where: {
            entityType_entityId_fieldName_locale: {
              entityType,
              entityId,
              fieldName,
              locale,
            },
          },
        });

        if (existing?.isManualOverride) continue;

        await prisma.contentTranslation.upsert({
          where: {
            entityType_entityId_fieldName_locale: {
              entityType,
              entityId,
              fieldName,
              locale,
            },
          },
          create: {
            entityType,
            entityId,
            fieldName,
            locale,
            translatedText,
          },
          update: {
            translatedText,
          },
        });
      }
    }
  } catch (error) {
    console.error("Failed to upsert translations:", error);
  }
}

export async function getTranslatedField(
  entityType: string,
  entityId: string,
  fieldName: string,
  sourceText: string | null | undefined,
  locale: string
): Promise<string> {
  if (!sourceText) return "";
  if (locale === "th" || locale.startsWith("th")) return sourceText;

  const normalizedLocale = locale.split("-")[0];
  const { prisma } = await import("./prisma");

  const translation = await prisma.contentTranslation.findUnique({
    where: {
      entityType_entityId_fieldName_locale: {
        entityType,
        entityId,
        fieldName,
        locale: normalizedLocale,
      },
    },
  });

  return translation?.translatedText ?? sourceText;
}

export async function applyTranslations<T extends { id: string }>(
  entityType: string,
  items: T[],
  fields: Array<keyof T & string>,
  locale: string
): Promise<T[]> {
  if (locale === "th" || locale.startsWith("th")) return items;

  const normalizedLocale = locale.split("-")[0];
  const { prisma } = await import("./prisma");
  const ids = items.map((item) => item.id);

  const translations = await prisma.contentTranslation.findMany({
    where: {
      entityType,
      entityId: { in: ids },
      locale: normalizedLocale,
      fieldName: { in: fields },
    },
  });

  const map = new Map<string, string>();
  for (const t of translations) {
    map.set(`${t.entityId}:${t.fieldName}`, t.translatedText);
  }

  return items.map((item) => {
    const copy = { ...item };
    for (const field of fields) {
      const key = `${item.id}:${field}`;
      const translated = map.get(key);
      if (translated) {
        (copy as Record<string, unknown>)[field] = translated;
      }
    }
    return copy;
  });
}
