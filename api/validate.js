import fs from 'fs';
import path from 'path';

function toArray(v){
  if(v === undefined || v === null) return [];
  if(Array.isArray(v)) return v.map(x => String(x).toLowerCase());
  return [String(v).toLowerCase()];
}

export default function handler(req, res){
  const body = JSON.parse(req.body || '{}');
  const guessName = body.guess;
  const date = body.date;

  const filePath = path.join(process.cwd(), 'data', 'characters.json');
  const characters = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const index = Math.abs(Array.from(date).reduce((a,c)=>a + c.charCodeAt(0), 0)) % characters.length;
  const answer = characters[index];

  const attrs = ["name","gender","birthplace","lastName","class","roles","appearsIn"];
  const feedback = [];

  const guessed = characters.find(c => c.name.toLowerCase() === String(guessName).toLowerCase());
  if(!guessed){
    res.status(200).json({ correct: false, feedback: attrs.map(()=> 'gray'), msg: 'Unknown character', character: answer });
    return;
  }

  // NAME: exact match?
  feedback.push( guessed.name.toLowerCase() === answer.name.toLowerCase() ? 'green' : 'gray' );

  // GENDER, BIRTHPLACE: single-value exact checks
  feedback.push( guessed.gender && answer.gender && String(guessed.gender).toLowerCase() === String(answer.gender).toLowerCase() ? 'green' : 'gray' );
  feedback.push( guessed.birthplace && answer.birthplace && String(guessed.birthplace).toLowerCase() === String(answer.birthplace).toLowerCase() ? 'green' : 'gray' );

  // Multi-value categories: lastName, class, roles, appearsIn
  const multiKeys = ['lastName','class','roles','appearsIn'];
  multiKeys.forEach(key => {
    const guessedVals = toArray(guessed[key]);
    const answerVals = toArray(answer[key]);

    // intersection size
    const intersect = guessedVals.filter(v => answerVals.includes(v));
    if(intersect.length === 0){
      feedback.push('gray');
    } else if(intersect.length < answerVals.length){
      feedback.push('yellow');
    } else {
      // intersection length >= answerVals.length -> all answer values covered by guess
      feedback.push('green');
    }
  });

  const correct = guessed.name.toLowerCase() === answer.name.toLowerCase();
  res.status(200).json({ correct, feedback, character: { name: answer.name } });
}
