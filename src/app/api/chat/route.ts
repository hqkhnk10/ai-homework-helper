import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];
    
    // Handle file uploads
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save file to uploads directory (you'll need to create this)
      const uploadDir = join(process.cwd(), 'uploads');
      const path = join(uploadDir, file.name);
      await writeFile(path, buffer);
      
      return {
        name: file.name,
        path: path,
        type: file.type
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    // TODO: Implement your AI service integration here
    // This is a mock response
    const aiResponse = {
      role: 'assistant',
      content: `I received your message: "${message}" and ${uploadedFiles.length} file(s).`,
      files: uploadedFiles
    };

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
