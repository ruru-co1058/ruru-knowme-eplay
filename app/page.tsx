'use client';

import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,Check,ChevronRight,Grid3X3,Image as ImageIcon,Music,Puzzle,Sparkles,Volume2,VolumeX} from 'lucide-react';
import PictureMatchGame from './puzzle-game';
import {JigsawGame,LinkGame} from './activity-games';

type View='home'|'match'|'puzzle'|'link';
type MusicPlayer={stop:()=>void};
const games=[
 {id:'match' as const,number:'01',title:'記憶配對',music:'緊張節奏',description:'翻開兩張卡片，找出一模一樣的圖片。考驗你的記憶力！',icon:Grid3X3,color:'coral'},
 {id:'puzzle' as const,number:'02',title:'圖片拼圖',music:'活潑旋律',description:'移動散落的拼圖片，把完整圖片重新拼回來。',icon:Puzzle,color:'yellow'},
 {id:'link' as const,number:'03',title:'趣味連連看',music:'輕快音樂',description:'找出相同圖案，用不超過三條線把它們連起來消除。',icon:ImageIcon,color:'teal'},
];

function startMusic(game:Exclude<View,'home'>):MusicPlayer|null{
 try{const AudioContextClass=window.AudioContext||(window as typeof window&{webkitAudioContext:typeof AudioContext}).webkitAudioContext;const context=new AudioContextClass(),master=context.createGain();master.gain.value=.05;master.connect(context.destination);const themes={match:{notes:[392,466,440,523,494,587,523,622],pace:235,type:'square' as OscillatorType},puzzle:{notes:[523,659,784,1047,784,659,698,880],pace:300,type:'triangle' as OscillatorType},link:{notes:[659,784,880,784,698,784,988,880],pace:355,type:'sine' as OscillatorType}};const theme=themes[game];let step=0;const play=()=>{const now=context.currentTime,osc=context.createOscillator(),gain=context.createGain();osc.type=theme.type;osc.frequency.value=theme.notes[step++%theme.notes.length];gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.24,now+.025);gain.gain.exponentialRampToValueAtTime(.001,now+theme.pace/1000*.7);osc.connect(gain).connect(master);osc.start(now);osc.stop(now+theme.pace/1000*.75)};play();const timer=window.setInterval(play,theme.pace);return{stop:()=>{window.clearInterval(timer);void context.close()}}}catch{return null}
}

export default function Home(){
 const [view,setView]=useState<View>('home'),[completed,setCompleted]=useState<string[]>([]),[musicOn,setMusicOn]=useState(false);const musicRef=useRef<MusicPlayer|null>(null);
 useEffect(()=>{try{setCompleted(JSON.parse(localStorage.getItem('happy-game-completed')||'[]'))}catch{}return()=>musicRef.current?.stop()},[]);
 const markComplete=(id:string)=>setCompleted(current=>{if(current.includes(id))return current;const next=[...current,id];localStorage.setItem('happy-game-completed',JSON.stringify(next));return next});
 const playGame=(id:Exclude<View,'home'>)=>{musicRef.current?.stop();musicRef.current=startMusic(id);setMusicOn(Boolean(musicRef.current));setView(id);window.scrollTo(0,0)};
 const goHome=()=>{musicRef.current?.stop();musicRef.current=null;setMusicOn(false);setView('home');window.scrollTo(0,0)};
 const toggleMusic=()=>{if(musicRef.current){musicRef.current.stop();musicRef.current=null;setMusicOn(false)}else if(view!=='home'){musicRef.current=startMusic(view);setMusicOn(Boolean(musicRef.current))}};
 if(view!=='home')return <div className="game-stage"><div className="game-nav"><button onClick={goHome}><ArrowLeft/>回到遊戲主頁</button><button onClick={toggleMusic}>{musicOn?<Volume2/>:<VolumeX/>}{musicOn?'音樂開啟':'音樂關閉'}</button></div>{view==='match'?<PictureMatchGame onComplete={()=>markComplete('match')}/>:view==='puzzle'?<JigsawGame onComplete={()=>markComplete('puzzle')}/>:<LinkGame onComplete={()=>markComplete('link')}/>}</div>;
 return <main className="hub-shell">
  <nav className="hub-nav" aria-label="主選單"><a className="hub-brand" href="#top"><span className="brand-mark"><i/><i/><i/></span><span><strong>認識你真好～遊戲區</strong><small>快樂遊戲屋</small></span></a><a href="#games">遊戲選單</a></nav>
  <section className="hub-hero" id="top"><div className="hero-copy"><p className="hero-kicker"><Sparkles/>認識你真好～遊戲區</p><h1>今天想玩<br/><em>哪一個遊戲？</em></h1><p>六位動物朋友歡樂合作！三個遊戲都能自由選擇，不必按照順序。</p><a className="hero-jump" href="#games">選擇遊戲 <ChevronRight/></a></div><div className="hero-art"><span className="motion-note note-one">♪</span><span className="motion-note note-two">✦</span><img src="/game-friends.png" alt="鸚鵡、穿山甲、羊駝、水豚、小熊貓和水獺一起合作玩遊戲"/><span className="art-sticker">合作樂無窮！</span></div></section>
  <section className="game-choice" id="games"><div className="section-heading"><span>自由挑戰 3 個遊戲</span><h2>想玩哪一個，就先玩哪一個！</h2><p><Music/>每款遊戲有不同音樂，完成後會留下打勾紀錄。</p></div><div className="game-grid">{games.map(({id,number,title,music,description,icon:Icon,color})=>{const done=completed.includes(id);return <article className={`game-tile ${color} ${done?'is-complete':''}`} key={id}>{done&&<div className="complete-badge"><Check/>已過關</div>}<div className="game-number">{number}</div><div className="game-icon"><Icon strokeWidth={2.5}/></div><h3>{title}</h3><span className="music-label"><Music/>{music}</span><p>{description}</p><button onClick={()=>playGame(id)} aria-label={`${title}：${done?'再玩一次':'開始遊戲'}`}><span>{done?'再玩一次':'開始遊戲'}</span><ChevronRight/></button></article>})}</div></section>
  <footer><span className="brand-mark small"><i/><i/><i/></span><p>不分順序、隨時重玩，一起享受動腦的樂趣！</p></footer>
 </main>
}
