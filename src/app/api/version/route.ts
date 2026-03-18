import { NextResponse } from 'next/server';
import { APP_VERSION, getVersionInfo } from '@/lib/version';

export async function GET() {
  const versionInfo = getVersionInfo();
  
  return NextResponse.json({
    ...versionInfo,
    buildNumber: APP_VERSION.buildNumber,
    updateAvailable: false, // In production, this would check a remote server
    updateUrl: null,
  });
}
