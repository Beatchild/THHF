const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/[slug]/page.tsx', 'utf8');

// Replace standard params
code = code.replace(
  /export default async function PostPage\(\{ params \}: \{ params: \{ slug: string \} \}\) \{/,
  'export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {\n  const resolvedParams = await params;\n  const { slug } = resolvedParams;'
);

// Replace generateMetadata params
code = code.replace(
  /export async function generateMetadata\(\{ params \}: \{ params: \{ slug: string \} \}\): Promise<Metadata> \{/,
  'export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {\n  const resolvedParams = await params;\n  const { slug } = resolvedParams;'
);

// Replace params.slug usage
code = code.replaceAll('params.slug', 'slug');

fs.writeFileSync('src/app/(public)/[slug]/page.tsx', code);
