'use client';

import {useState} from 'react';
import {ArrowLeft, ChevronRight, Grid3X3, Image as ImageIcon, Puzzle, Sparkles, X} from 'lucide-react';
import PictureMatchGame from './puzzle-game';

type View='home'|'match';
const games=[
 {id:'match',number:'01',title:'記憶配對',label:'現在就玩',description:'翻開兩張卡片，找出一模一樣的圖片。考驗你的記憶力！',icon:Grid3X3,color:'coral',available:true},
 {id:'puzzle',number:'02',title:'圖片拼圖',label:'準備中',description:'移動散落的拼圖片，把完整圖片重新拼回來。',icon:Puzzle,color:'yellow',available:false},
 {id:'link',number:'03',title:'趣味連連看',label:'準備中',description:'找出相同圖案，用不超過三條線把它們連起來消除。',icon:ImageIcon,color:'teal',available:false},
] as const;

export default function Home(){
 const [view,setView]=useState<View>('home');
 const [notice,setNotice]=useState<string|null>(null);
 if(view==='match')return <><button className="home-return" onClick={()=>setView('home')}><ArrowLeft/>回到遊戲主頁</button><PictureMatchGame/></>;
 return <main className="hub-shell">
  <nav className="hub-nav" aria-label="主選單"><a className="hub-brand" href="#top"><span className="brand-mark"><i/><i/><i/></span><span><strong>認識你真好</strong><small>快樂遊戲屋</small></span></a><a href="#games">遊戲選單</a></nav>
  <section className="hub-hero" id="top"><div className="hero-copy"><p className="hero-kicker"><Sparkles/>一起玩・一起發現</p><h1>今天想玩<br/><em>哪一個遊戲？</em></h1><p>動動眼睛、動動腦，挑一個喜歡的遊戲開始挑戰吧！</p><a className="hero-jump" href="#games">選擇遊戲 <ChevronRight/></a></div><div className="hero-art"><img src="/game-friends.png" alt="鸚鵡、穿山甲和羊駝一起玩三種遊戲"/><span className="art-sticker">一起來玩吧！</span></div></section>
  <section className="game-choice" id="games"><div className="section-heading"><span>3 個小挑戰</span><h2>選一個遊戲，開始吧！</h2><p>每個遊戲都有不同的玩法，你想先挑戰哪一個？</p></div><div className="game-grid">{games.map(({id,number,title,label,description,icon:Icon,color,available})=><article className={`game-tile ${color}`} key={id}><div className="game-number">{number}</div><div className="game-icon"><Icon strokeWidth={2.5}/></div><h3>{title}</h3><p>{description}</p><button onClick={()=>available?setView('match'):setNotice(title)} aria-label={`${title}：${label}`}><span>{label}</span><ChevronRight/></button></article>)}</div></section>
  <footer><span className="brand-mark small"><i/><i/><i/></span><p>選擇喜歡的遊戲，享受動腦的樂趣！</p></footer>
  {notice&&<div className="notice-backdrop" role="presentation" onClick={()=>setNotice(null)}><div className="notice-card" role="dialog" aria-modal="true" aria-labelledby="notice-title" onClick={event=>event.stopPropagation()}><button className="notice-close" aria-label="關閉" onClick={()=>setNotice(null)}><X/></button><span>✦</span><h2 id="notice-title">{notice}準備中</h2><p>這個遊戲正在布置關卡，敬請期待！<br/>可以先來玩「記憶配對」。</p><button className="notice-play" onClick={()=>{setNotice(null);setView('match')}}>先玩記憶配對</button></div></div>}
 </main>
}
