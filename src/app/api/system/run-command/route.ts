import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { command } = await request.json();
    const os = platform();

    // Extract the file path from the command
    const filePath = command.split(' ').pop().replace(/['"]/g, '');

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found: ${filePath}` },
        { status: 404 }
      );
    }

    // Determine the correct open command based on OS
    let openCommand;
    if (os === 'darwin') {
      openCommand = `open "${filePath}"`;
    } else if (os === 'win32') {
      openCommand = `start "" "${filePath}"`;
    } else {
      openCommand = `xdg-open "${filePath}"`;
    }

    // Execute the command
    const { stdout, stderr } = await execAsync(openCommand);

    if (stderr) {
      console.error('Command stderr:', stderr);
    }

    return NextResponse.json({ 
      success: true,
      stdout,
      command: openCommand
    });
  } catch (error) {
    console.error('Error running command:', error);
    return NextResponse.json(
      { 
        error: 'Failed to run command',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 