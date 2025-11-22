import fs from "fs";
import path from "path";
export default function handler(req,res){
  const filePath = path.join(process.cwd(),"data","characters.json");
  const characters = JSON.parse(fs.readFileSync(filePath,"utf-8"));
  const todayStr = new Date().toISOString().slice(0,10);
  const index = Math.abs(todayStr.split('').reduce((a,c)=>a+c.charCodeAt(0),0)) % characters.length;
  const todayCharacter = characters[index];
  res.status(200).json({
    date: todayStr,
    attributes: ["gender","house","class","roles","appearances"],
    maxAttempts:6,
    character: todayCharacter
  });
}