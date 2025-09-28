import dbConnect from '../../../lib/dbConnect';

export async function GET() {
  await dbConnect();
  return new Response('DB connected!', { status: 200 });
}