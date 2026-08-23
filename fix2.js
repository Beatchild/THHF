const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/[slug]/page.tsx', 'utf8');

code = code.replace(
  /interface Props \{\s*params: \{ slug: string \};\s*\}/,
  'type Props = { params: Promise<{ slug: string }> };'
);

code = code.replace(
  'export async function generateMetadata({ params }: Props): Promise<Metadata> {',
  'export async function generateMetadata({ params }: Props): Promise<Metadata> {\n  const resolvedParams = await params;\n  const { slug } = resolvedParams;'
);

code = code.replace(
  'export default async function BlogPost({ params }: Props) {',
  'export default async function BlogPost({ params }: Props) {\n  const resolvedParams = await params;\n  const { slug } = resolvedParams;'
);

code = code.replaceAll('params.slug', 'slug');

fs.writeFileSync('src/app/(public)/[slug]/page.tsx', code);
