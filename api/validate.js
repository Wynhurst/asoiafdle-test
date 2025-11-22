import fs from "fs";
import path from "path";
export default function handler(req,res){
  const {guess,date} = JSON.parse(req.body || "{}");
  const filePath = path.join(process.cwd(),"data","characters.json");
  const characters = JSON.parse(fs.readFileSync(filePath,"utf-8"));
  const index = Math.abs(date.split('').reduce((a,c)=>a+c.charCodeAt(0),0)) % characters.length;
  const answer = characters[index];
  const attributes = ["gender","house","class","roles","appearances"];
  const feedback = [];
  const guessedCharacter = characters.find(c => c.name.toLowerCase() === guess.toLowerCase());
  if(!guessedCharacter){
    res.status(200).json({correct:false,feedback:attributes.map(()=> "gray"), msg:"Unknown character"});
    return;
  }
  attributes.forEach(attr => {
    feedback.push(guessedCharacter[attr].toString().toLowerCase() === answer[attr].toString().toLowerCase() ? "green" : "gray");
  });
  res.status(200).json({correct:guessedCharacter.name.toLowerCase() === answer.name.toLowerCase(), feedback, character: answer});
}