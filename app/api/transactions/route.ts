import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const API_KEY = process.env.YAYA_API_KEY!;
const API_SECRET = process.env.YAYA_API_SECRET!;
const BASE_URL = process.env.YAYA_BASE_URL!;

/**
 * Generate HMAC SHA256 signature and base64 encode it
 */
function generateSignature(
  timestamp: string,
  method: string,
  endpoint: string,
  body = ""
): string {
  const message = timestamp + method.toUpperCase() + endpoint + body;
  return crypto.createHmac("sha256", API_SECRET).update(message).digest("base64");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const p = parseInt(searchParams.get("p") || "0", 10); // read p, default 0
    const page = p + 1; // convert API 0-based to frontend 1-based

    const timestamp = Date.now().toString();
    const path = "/api/en/transaction/find-by-user";
    const query = `?p=${p}`;
    const signature = generateSignature(timestamp, "GET", path);

    console.log("[DEBUG GET] Calling API", {
      endpoint: path,
      query,
      signature: signature.substring(0, 10) + "...",
    });

    const response = await fetch(`${BASE_URL}${path}${query}`, {
      method: "GET",
      headers: {
        "YAYA-API-KEY": API_KEY,
        "YAYA-API-TIMESTAMP": timestamp,
        "YAYA-API-SIGN": signature,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[DEBUG GET] API Error response:", errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Return frontend page as page
    return NextResponse.json({ ...data, page });
  } catch (error: any) {
    console.error("[DEBUG GET] API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions", details: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timestamp = Date.now().toString();
    const endpoint = "/api/en/transaction/search";
    const bodyString = JSON.stringify(body);
    const signature = generateSignature(timestamp, "POST", endpoint, bodyString);

    console.log("[DEBUG POST] Calling search API", {
      endpoint,
      body,
      signature: signature.substring(0, 10) + "...",
    });

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "YAYA-API-KEY": API_KEY,
        "YAYA-API-TIMESTAMP": timestamp,
        "YAYA-API-SIGN": signature,
        "Content-Type": "application/json",
      },
      body: bodyString,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[DEBUG POST] API Error response:", errorText);
      throw new Error(`Search API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[DEBUG POST] API Error:", error);
    return NextResponse.json(
      { error: "Failed to search transactions", details: error.message },
      { status: 500 }
    );
  }
}
