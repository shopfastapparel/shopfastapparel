import fs from 'fs';
let code = fs.readFileSync('src/lib/ssactivewear.server.ts', 'utf8');
code = code.replace(/\.validator\(\(d: unknown\) => d as \{ styleId: number \}\)/, '.input' + 'Validator((d) => z.object({ styleId: z.number() }).parse(d))');
fs.writeFileSync('src/lib/ssactivewear.server.ts', code);
