import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Dynamic — needed for puppeteer at runtime
export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes

interface GenerateAdsRequest {
  businessDescription: string;
  count: number;
  cookies: string;
}

export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: GenerateAdsRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { businessDescription, count, cookies } = body;

  if (!businessDescription || !cookies) {
    return NextResponse.json(
      { error: "businessDescription and cookies are required" },
      { status: 400 }
    );
  }

  const imageCount = Math.max(1, Math.min(5, Number(count) || 1));

  // Parse cookies string — support both JSON array and Netscape/key=value formats
  let parsedCookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
  }> = [];

  try {
    // Try JSON array first
    const raw = JSON.parse(cookies);
    if (Array.isArray(raw)) {
      parsedCookies = raw.map((c) => ({
        name: c.name ?? c.key ?? "",
        value: c.value ?? "",
        domain: c.domain ?? ".chatgpt.com",
        path: c.path ?? "/",
      }));
    }
  } catch {
    // Try key=value; pairs
    try {
      parsedCookies = cookies
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const eqIdx = s.indexOf("=");
          const name = eqIdx > -1 ? s.slice(0, eqIdx).trim() : s;
          const value = eqIdx > -1 ? s.slice(eqIdx + 1).trim() : "";
          return { name, value, domain: ".chatgpt.com", path: "/" };
        });
    } catch {
      return NextResponse.json(
        { error: "Failed to parse cookies. Use JSON array or key=value format." },
        { status: 400 }
      );
    }
  }

  if (parsedCookies.length === 0) {
    return NextResponse.json(
      { error: "No cookies parsed. Please provide valid cookies." },
      { status: 400 }
    );
  }

  let browser;
  const images: string[] = [];

  try {
    // Use @sparticuz/chromium on Linux (server) and puppeteer-core locally
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const puppeteer = require("puppeteer-core");

    let executablePath: string;
    let args: string[];

    if (process.platform === "linux") {
      // Server (Hetzner Linux)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const chromium = require("@sparticuz/chromium");
      executablePath = await chromium.executablePath();
      args = chromium.args;
    } else {
      // Local development — use system Chrome
      const possiblePaths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium-browser",
      ];
      executablePath =
        possiblePaths.find((p) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require("fs").accessSync(p);
            return true;
          } catch {
            return false;
          }
        }) ?? possiblePaths[0];
      args = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ];
    }

    browser = await puppeteer.launch({
      executablePath,
      args,
      headless: true,
      defaultViewport: { width: 1280, height: 900 },
    });

    const page = await browser.newPage();

    // Set cookies on chatgpt.com
    for (const cookie of parsedCookies) {
      try {
        await page.setCookie({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain || ".chatgpt.com",
          path: cookie.path || "/",
        });
      } catch {
        // Skip invalid cookies silently
      }
    }

    // Navigate to ChatGPT
    await page.goto("https://chatgpt.com/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for the chat input to be ready
    await page.waitForSelector(
      'div[contenteditable="true"], textarea#prompt-textarea, #prompt-textarea',
      { timeout: 30000 }
    );

    // Build the prompt
    const prompt =
      `אני מעסק בתחום: "${businessDescription}".\n` +
      `אנא צור ${imageCount} תמונות פרסומיות מקצועיות לעסק שלי שמתאימות לפרסום ברשתות חברתיות (פייסבוק, אינסטגרם).\n` +
      `כל תמונה צריכה להיות בעלת עיצוב יצירתי, מושך ומקצועי.\n` +
      `כלול טקסט שיווקי רלוונטי בכל תמונה.\n` +
      `צור את כל ${imageCount} התמונות בהודעה אחת.`;

    // Find and focus the textarea
    const inputSelector =
      'div[contenteditable="true"], textarea#prompt-textarea, #prompt-textarea';
    await page.click(inputSelector);
    await page.keyboard.type(prompt, { delay: 20 });

    // Submit by pressing Enter
    await page.keyboard.press("Enter");

    // Wait for images to appear in the response
    // ChatGPT image generation takes time — wait up to 90s
    const startTime = Date.now();
    const timeout = 90_000;

    while (Date.now() - startTime < timeout && images.length < imageCount) {
      await new Promise((r) => setTimeout(r, 3000));

      // Try to find generated images in the latest assistant message
      const imgSrcs: string[] = await page.evaluate(() => {
        const imgs = Array.from(
          document.querySelectorAll(
            'div[data-message-author-role="assistant"] img[src], article img[src]'
          )
        );
        return imgs
          .map((img) => (img as HTMLImageElement).src)
          .filter(
            (src) =>
              src &&
              !src.includes("avatar") &&
              !src.includes("logo") &&
              src.startsWith("https")
          );
      });

      for (const src of imgSrcs) {
        if (!images.includes(src) && images.length < imageCount) {
          images.push(src);
        }
      }

      // Check if a "stop" button disappeared (generation done)
      const isGenerating = await page
        .$(
          'button[aria-label="Stop generating"], button[data-testid="stop-button"]'
        )
        .then((el: unknown) => !!el)
        .catch(() => false);

      if (!isGenerating && images.length > 0) break;
    }

    await browser.close();
    browser = undefined;

    if (images.length === 0) {
      return NextResponse.json(
        {
          error:
            "לא נמצאו תמונות. ייתכן שהסשן פג תוקף, ה-cookies שגויים, או שChatGPT לא הצליח לייצר תמונות.",
          hint: "נסה להתחדש ב-cookies ולנסות שנית.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ images, count: images.length });
  } catch (err) {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore
      }
    }

    const message = err instanceof Error ? err.message : "שגיאה לא ידועה";
    console.error("[generate-ads] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
