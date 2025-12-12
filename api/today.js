import fs from 'fs';
import path from 'path';
export default function handler(req, res){
  const filePath = path.join(process.cwd(), 'data', 'characters.json');
  const characters = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const todayStr = new Date().toISOString().slice(0,10);
  const index = Math.abs(Array.from(todayStr).reduce((a,c)=>a + c.charCodeAt(0), 0)) % characters.length;

  // Do NOT include the answer contents here - only metadata
  res.status(200).json({
    date: todayStr,
    attributes: ["name","gender","birthplace","lastName","class","roles","appearsIn"],
    maxAttempts: 6
  });
}
