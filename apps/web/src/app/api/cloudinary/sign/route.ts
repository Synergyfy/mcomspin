import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paramsToSign } = body;

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      return NextResponse.json({ error: 'Cloudinary API secret not configured' }, { status: 500 });
    }

    // Cloudinary signature generation algorithm
    // 1. Sort parameters alphabetically
    const sortedKeys = Object.keys(paramsToSign).sort();
    
    // 2. Create the string to sign (key=value&key=value...)
    const stringToSign = sortedKeys
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&') + apiSecret;

    // 3. Generate SHA-1 hash
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
