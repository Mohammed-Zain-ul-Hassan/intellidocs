import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse/lib/pdf-parse';

// Remove the deprecated export config
// Set route-specific options using the new `routeSegmentConfig` (recommended).
export const dynamic = 'force-dynamic'; // Forces dynamic rendering, similar to disabling `bodyParser`.

export async function GET() {
  return NextResponse.json({ message: 'PDF parser route is working' });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const data = await pdf(buffer);

    return NextResponse.json({ text: data.text });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    );
  }
}
