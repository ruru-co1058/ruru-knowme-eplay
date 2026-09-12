'use client';

import {useEffect,useState} from 'react';
import {Check,ChevronRight,ExternalLink,Grid3X3,Image as ImageIcon,Puzzle,Sparkles} from 'lucide-react';

const games=[
 {id:'match',number:'01',title:'圖形配對遊戲',description:'匯入自己的圖片，翻開兩張牌找出相同圖案；牌面固定用上下兩列呈現。',icon:Grid3X3,color:'coral',url:'https://ruru-co1058.github.io/ruru-copypaly/'},
 {id:'named',number:'02',title:'圖面名字連連看',description:'看人物照片，從三個容易混淆的字中，依序選出正確姓名。',icon:ImageIcon,color:'teal',url:'https://ruru-co1058.github.io/ruru-named-play/'},
 {id:'puzzle',number:'03',title:'照片拼圖小遊戲',description:'選擇照片與難度，移動拼圖片完成挑戰，也可以進行雙人 PK。',icon:Puzzle,color:'yellow',url:'https://ruru-co1058.github.io/ruru-puzzleplay/'},
] as const;

export default function Home(){
 const [visited,setVisited]=useState<string[]>([]);
 useEffect(()=>{try{setVisited(JSON.parse(localStorage.getItem('knowme-games-visited')||'[]'))}catch{}},[]);
 const markVisited=(id:string)=>{setVisited(current=>{if(current.includes(id))return current;const next=[...current,id];localStorage.setItem('knowme-games-visited',JSON.stringify(next));return next})};
 return <main className="hub-shell">
  <nav className="hub-nav" aria-label="主選單"><a className="hub-brand" href="#top"><span className="brand-mark"><i/><i/><i/></span><span><strong>認識你真好～遊戲區</strong><small>快樂遊戲屋</small></span></a><a href="#games">遊戲選單</a></nav>
  <section className="hub-hero" id="top"><div className="hero-copy"><p className="hero-kicker"><Sparkles/>認識你真好～遊戲區</p><h1>今天想玩<br/><em>哪一個遊戲？</em></h1><p>六位動物朋友歡樂合作！三個遊戲都能自由選擇，不必按照順序。</p><a className="hero-jump" href="#games">選擇遊戲 <ChevronRight/></a></div><div className="hero-art"><span className="motion-note note-one">♪</span><span className="motion-note note-two">✦</span><img src="/game-friends.png" alt="鸚鵡、穿山甲、羊駝、水豚、小熊貓和水獺一起合作玩遊戲"/><span className="art-sticker">合作樂無窮！</span></div></section>
  <section className="game-choice" id="games"><div className="section-heading"><span>自由選擇 3 個遊戲</span><h2>想玩哪一個，就先玩哪一個！</h2><p>按下大型按鈕，即可進入您已完成的原版遊戲。</p></div><div className="game-grid">{games.map(({id,number,title,description,icon:Icon,color,url})=>{const done=visited.includes(id);return <article className={`game-tile ${color} ${done?'is-complete':''}`} key={id}>{done&&<div className="complete-badge"><Check/>已挑戰</div>}<div className="game-number">{number}</div><div className="game-icon"><Icon strokeWidth={2.5}/></div><h3>{title}</h3><p>{description}</p><a className="game-link-button" href={url} onClick={()=>markVisited(id)} aria-label={`開啟${title}`}><span>{done?'再次挑戰':'進入遊戲'}</span><ExternalLink/></a></article>})}</div></section>
  <footer><span className="brand-mark small"><i/><i/><i/></span><p>不分順序、隨時重玩，一起享受動腦的樂趣！</p></footer>
 </main>
}
