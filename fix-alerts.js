const fs = require('fs');
const files = [
  'app/dashboard/page.tsx',
  'app/admin/page.tsx',
  'app/register/page.tsx',
  'app/plan/[productId]/page.tsx',
  'app/login/page.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('alert(') && !content.includes('react-hot-toast')) {
    content = content.replace(/import \{ ([^}]+) \} from 'react';|import \{ ([^}]+) \} from "react";/, (match) => match + '\nimport toast from "react-hot-toast";');
    
    // Simple heuristic for success vs error
    content = content.replace(/alert\(([`"'].*?(?:success|approved|copied|submitted).*?[`"'])\)/gi, 'toast.success($1)');
    content = content.replace(/alert\(([`"'].*?(?:Failed|not authenticated|Please|Minimum|Insufficient|already|not found).*?[`"'])\)/gi, 'toast.error($1)');
    
    // Fallback for remaining alerts
    content = content.replace(/alert\(/g, 'toast(');
    
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
}
