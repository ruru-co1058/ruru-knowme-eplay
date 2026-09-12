'use client';

import {useMemo,useState} from 'react';
import {Check,RotateCcw,Shuffle} from 'lucide-react';

type Props={onComplete:()=>void};
const shuffle=<T,>(items:T[])=>{const next=[...items];for(let i=next.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[next[i],next[j]]=[next[j],next[i]]}return next};

function WinCard({title,onAgain}:{title:string;onAgain:()=>void}){return <div className="activity-win" role="status"><span><Check/></span><h2>{title}</h2><p>做得真棒！回到主頁會看到完成打勾。</p><button onClick={onAgain}><RotateCcw/>再玩一次</button></div>}

function makePuzzle(){let board=[0,1,2,3,4,5,6,7,8];let blank=8;for(let n=0;n<120;n++){const row=Math.floor(blank/3),col=blank%3;const choices=[row>0?blank-3:-1,row<2?blank+3:-1,col>0?blank-1:-1,col<2?blank+1:-1].filter(i=>i>=0);const target=choices[Math.floor(Math.random()*choices.length)];[board[blank],board[target]]=[board[target],board[blank]];blank=target}return board}

export function JigsawGame({onComplete}:Props){
 const [tiles,setTiles]=useState(()=>makePuzzle()),[won,setWon]=useState(false),[moves,setMoves]=useState(0);
 const reset=()=>{setTiles(makePuzzle());setWon(false);setMoves(0)};
 const move=(index:number)=>{if(won)return;const blank=tiles.indexOf(8),r=Math.floor(index/3),c=index%3,br=Math.floor(blank/3),bc=blank%3;if(Math.abs(r-br)+Math.abs(c-bc)!==1)return;const next=[...tiles];[next[index],next[blank]]=[next[blank],next[index]];setTiles(next);setMoves(m=>m+1);if(next.every((v,i)=>v===i)){setWon(true);onComplete()}};
 return <section className="activity-shell puzzle-activity"><div className="activity-heading"><p>圖片拼圖</p><h1>把動物朋友拼回來！</h1><span>點擊空格旁的拼圖片，完成整張圖片。</span></div><div className="activity-toolbar"><strong>移動 {moves} 次</strong><button onClick={reset}><Shuffle/>重新打亂</button></div><div className="puzzle-board" aria-label="九宮格圖片拼圖">{tiles.map((tile,index)=>tile===8?<span className="puzzle-blank" key="blank"/>:<button key={tile} onClick={()=>move(index)} aria-label={`移動第 ${tile+1} 塊拼圖`} style={{backgroundImage:'url(/game-friends.png)',backgroundPosition:`${(tile%3)*50}% ${Math.floor(tile/3)*50}%`}}/>)}</div>{won&&<WinCard title="拼圖完成！" onAgain={reset}/>}</section>
}

type LinkTile={id:number;symbol:string;removed:boolean};
const symbols=['花','星','葉','果','月','魚','雲','心'];
function makeLinkTiles(){return shuffle([...symbols,...symbols].map((symbol,id)=>({id,symbol,removed:false})))}
function canLink(tiles:LinkTile[],a:number,b:number){
 const board=Array.from({length:6},()=>Array(6).fill(false));tiles.forEach((t,i)=>{if(!t.removed&&i!==a&&i!==b)board[Math.floor(i/4)+1][i%4+1]=true});const start=[Math.floor(a/4)+1,a%4+1],end=[Math.floor(b/4)+1,b%4+1];const queue=[{r:start[0],c:start[1],dir:-1,turns:0}],seen=new Map<string,number>();const dirs=[[-1,0],[1,0],[0,-1],[0,1]];while(queue.length){const cur=queue.shift()!;for(let d=0;d<4;d++){const nr=cur.r+dirs[d][0],nc=cur.c+dirs[d][1];if(nr<0||nr>5||nc<0||nc>5)continue;if(board[nr][nc]||((nr!==end[0]||nc!==end[1])&&nr>0&&nr<5&&nc>0&&nc<5&&tiles[(nr-1)*4+nc-1]?.removed===false))continue;const turns=cur.dir<0||cur.dir===d?cur.turns:cur.turns+1;if(turns>2)continue;if(nr===end[0]&&nc===end[1])return true;const key=`${nr},${nc},${d}`;if((seen.get(key)??3)<=turns)continue;seen.set(key,turns);queue.push({r:nr,c:nc,dir:d,turns})}}return false}

export function LinkGame({onComplete}:Props){
 const [tiles,setTiles]=useState<LinkTile[]>(()=>makeLinkTiles()),[selected,setSelected]=useState<number|null>(null),[won,setWon]=useState(false),[hint,setHint]=useState('選兩個相同圖案，把它們連起來。');
 const left=useMemo(()=>tiles.filter(t=>!t.removed).length,[tiles]);
 const reset=()=>{setTiles(makeLinkTiles());setSelected(null);setWon(false);setHint('選兩個相同圖案，把它們連起來。')};
 const choose=(index:number)=>{if(won||tiles[index].removed)return;if(selected===null){setSelected(index);setHint('再選一個相同圖案。');return}if(selected===index){setSelected(null);setHint('已取消選取。');return}if(tiles[selected].symbol===tiles[index].symbol&&canLink(tiles,selected,index)){const next=tiles.map((t,i)=>i===selected||i===index?{...t,removed:true}:t);setTiles(next);setSelected(null);if(next.every(t=>t.removed)){setWon(true);onComplete()}else setHint('連線成功！繼續找下一對。')}else{setSelected(null);setHint('這一對還連不起來，再試試看！')}};
 return <section className="activity-shell link-activity"><div className="activity-heading"><p>趣味連連看</p><h1>找出可以連線的一對！</h1><span>相同圖案的連線最多轉兩個彎。</span></div><div className="activity-toolbar"><strong>剩下 {left} 張</strong><button onClick={reset}><Shuffle/>重新排列</button></div><div className="link-board">{tiles.map((tile,index)=><button key={tile.id} className={`${tile.removed?'is-removed':''} ${selected===index?'is-selected':''}`} disabled={tile.removed} onClick={()=>choose(index)} aria-label={`${tile.symbol}${selected===index?'，已選取':''}`}><span>{tile.symbol}</span></button>)}</div><p className="link-hint" aria-live="polite">{hint}</p>{won&&<WinCard title="全部連完了！" onAgain={reset}/>}</section>
}
