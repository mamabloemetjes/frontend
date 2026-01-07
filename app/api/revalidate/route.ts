import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST endpoint to revalidate cache for specific paths or tags
 */
export async function POST(request: NextRequest) {
  // Validate secret token to prevent unauthorized revalidation
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: "Invalid or missing secret token" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { path, tag, paths } = body;

    // Revalidate single path
    if (path) {
      revalidatePath(path);
      console.log(`[Revalidation] Successfully revalidated path: ${path}`);
      return NextResponse.json({
        revalidated: true,
        path,
        timestamp: new Date().toISOString(),
      });
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag, "max");
      console.log(`[Revalidation] Successfully revalidated tag: ${tag}`);
      return NextResponse.json({
        revalidated: true,
        tag,
        timestamp: new Date().toISOString(),
      });
    }

    // Revalidate multiple paths
    if (paths && Array.isArray(paths)) {
      paths.forEach((p) => revalidatePath(p));
      console.log(
        `[Revalidation] Successfully revalidated ${paths.length} paths`,
      );
      return NextResponse.json({
        revalidated: true,
        paths,
        count: paths.length,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { message: "Missing required parameter: path, tag, or paths" },
      { status: 400 },
    );
  } catch (error) {
    console.error("[Revalidation] Error:", error);
    return NextResponse.json(
      {
        message: "Error revalidating cache",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Revalidation API is running. Use POST with secret token.",
  });
}
