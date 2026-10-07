const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
function openPreview(title,content){$('#dialog-title').textContent=title;$('#dialog-content').replaceChildren(content);$('#preview-dialog').showModal()}
const workClips=[...document.querySelector('#work-video-template').content.querySelectorAll('video')];
function buildTrack(id,clips){
 const group=document.createElement('div');group.className='snippet-group';
 clips.forEach(clip=>{
  const card=document.createElement('div');card.className='snippet-card video-snippet';
  card.append(clip.cloneNode(true));group.append(card);
 });
 const duplicate=group.cloneNode(true);duplicate.setAttribute('aria-hidden','true');
 duplicate.querySelectorAll('video').forEach(video=>video.tabIndex=-1);
 $(id).append(group,duplicate);
}
buildTrack('#track-left',workClips.slice(0,5));
buildTrack('#track-right',workClips.slice(5));
let paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;function setPaused(value){paused=value;$('.snippet-rows').classList.toggle('paused',value);$('#motion-toggle').setAttribute('aria-pressed',String(value));$('#motion-label').textContent=value?'RESUME MOTION':'PAUSE MOTION';$('#motion-icon').textContent=value?'▷':'Ⅱ';document.dispatchEvent(new Event('workmotionchange'))}setPaused(paused);$('#motion-toggle').onclick=()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){$('#motion-label').textContent='REDUCED MOTION ON';return}setPaused(!paused)};
$('.close').onclick=()=>$('#preview-dialog').close();$('#dialog-done').onclick=()=>$('#preview-dialog').close();$('#preview-dialog').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close()});
// Contact submissions are handled separately in contact-form.js.
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)$$('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-15% 0px -55% 0px'});$$('main>section').forEach(s=>observer.observe(s));

const heroVideo = $('#hero-video');
const heroVideoToggle = $('#hero-video-toggle');
function syncHeroVideoControl(){const paused=heroVideo.paused;heroVideoToggle.setAttribute('aria-label',paused?'Play logo animation':'Pause logo animation');heroVideoToggle.innerHTML=paused?'▷ <span>PLAY</span>':'Ⅱ <span>PAUSE</span>'}
heroVideo.addEventListener('play',syncHeroVideoControl);
heroVideo.addEventListener('pause',syncHeroVideoControl);
heroVideoToggle.onclick=()=>{if(heroVideo.paused){playHeroFullscreen()}else{heroVideo.pause()}};
heroVideo.muted=true;
heroVideo.play().catch(syncHeroVideoControl);
syncHeroVideoControl();

// Sound effects are started only by an explicit click.
let sfxMuted=false;let sfxContext;
$('#sfx-toggle').onclick=()=>{sfxMuted=!sfxMuted;$('#sfx-toggle').setAttribute('aria-pressed',String(sfxMuted));$('#sfx-toggle').textContent=sfxMuted?'×':'♫';$('#sfx-toggle').setAttribute('aria-label',sfxMuted?'Unmute sound effects':'Mute sound effects');$('#sfx-toggle').title=sfxMuted?'Unmute sound effects':'Mute sound effects';if(sfxMuted)$('#faah-audio').pause()};
async function pewPew(){if(sfxMuted)return;try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;sfxContext=sfxContext||new Context();await sfxContext.resume();[0,.19].forEach((delay)=>{const t=sfxContext.currentTime+delay;const oscillator=sfxContext.createOscillator(),gain=sfxContext.createGain();oscillator.type='sawtooth';oscillator.frequency.setValueAtTime(1100,t);oscillator.frequency.exponentialRampToValueAtTime(100,t+.16);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.09,t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+.19);oscillator.connect(gain);gain.connect(sfxContext.destination);oscillator.start(t);oscillator.stop(t+.2);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()}})}catch(e){}}
$$('.service-link').forEach(link=>link.addEventListener('click',pewPew));
let faahTimer;
function animateFaahMeter(){clearInterval(faahTimer);let frame=0;const bars=$$('.faah-bar i');faahTimer=setInterval(()=>{frame++;let level=frame<9?Math.min(100,frame*14):Math.max(0,100-(frame-9)*7);$('#faah-level').textContent=String(level).padStart(2,'0')+' / 100';bars.forEach((bar,i)=>bar.classList.toggle('lit',i<Math.ceil(level/100*bars.length)));if(!level&&frame>9)clearInterval(faahTimer)},70)}
$('#faah-button').onclick=()=>{animateFaahMeter();const audio=$('#faah-audio');if(sfxMuted){$('#faah-status').textContent='Sound is muted. Turn sound on to hear the clip.';return}if(!audio.getAttribute('src')){$('#faah-status').textContent='Add the FAAAH clip below to give this meter its voice.';return}audio.pause();audio.currentTime=0;audio.volume=.7;audio.play().then(()=>{$('#faah-status').textContent='FAAAH!'}).catch(()=>{$('#faah-status').textContent='Could not play this clip. Try an MP3 or WAV file.'})};

// Reveal content once as it enters view. Sticky cards themselves are never transformed.
const reduceEffects=window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets=$$('.section-meta,.solutions-heading,.stack-title,.service-art svg,.service-copy,.work-intro h2,.work-lead,.work-copy,.work-controls,.work-reaction,.snippet-rows,.footer-socials,.footer-logo,footer>div:last-child');
let revealObserver;
if(!reduceEffects.matches&&'IntersectionObserver' in window){
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
  revealTargets.forEach(el=>{el.classList.add('reveal-ready');revealObserver.observe(el)});
}
// Wrap numeric text without touching links, SVG coordinates, form controls, or live meters.
const counterRoots=$$('.section-meta,.stack-title,.art-id,.volume,.snippet-card .card-top,footer>div:last-child');
const counterElements=[];
counterRoots.forEach(root=>{
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return /\d/.test(node.nodeValue)&&!node.parentElement.closest('svg,button,input,textarea,script,style,[data-counter]')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(node=>{const fragment=document.createDocumentFragment();let last=0;const text=node.nodeValue;for(const match of text.matchAll(/\d+(?:,\d{3})*/g)){fragment.append(document.createTextNode(text.slice(last,match.index)));const span=document.createElement('span');span.dataset.counter=match[0];span.textContent=match[0];fragment.append(span);counterElements.push(span);last=match.index+match[0].length}fragment.append(document.createTextNode(text.slice(last)));node.replaceWith(fragment)});
});
const activeCounts=new Map();
function runCounter(el){if(reduceEffects.matches)return;const original=el.dataset.counter;const target=Number(original.replaceAll(',',''));const padded=/^0\d/.test(original);const duration=target<10?600:1200;let start;
 function tick(time){if(start===undefined)start=time;const progress=Math.min((time-start)/duration,1);const value=Math.round(target*(1-Math.pow(1-progress,3)));el.textContent=progress===1?original:original.includes(',')?value.toLocaleString('en-US'):padded?String(value).padStart(original.length,'0'):String(value);if(progress<1&&!reduceEffects.matches){activeCounts.set(el,requestAnimationFrame(tick))}else{el.textContent=original;activeCounts.delete(el)}}
 activeCounts.set(el,requestAnimationFrame(tick));
}
let counterObserver;
if(!reduceEffects.matches&&'IntersectionObserver' in window){counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){runCounter(entry.target);counterObserver.unobserve(entry.target)}}),{threshold:.5});counterElements.forEach(el=>counterObserver.observe(el))}
reduceEffects.addEventListener('change',event=>{if(!event.matches)return;revealObserver?.disconnect();counterObserver?.disconnect();revealTargets.forEach(el=>el.classList.add('is-revealed'));activeCounts.forEach((frame,el)=>{cancelAnimationFrame(frame);el.textContent=el.dataset.counter});activeCounts.clear()});

// Fullscreen must begin with a user gesture; autoplay cannot request it.
async function playHeroFullscreen(){
 try{
  const playing=heroVideo.play();
  if(heroVideo.requestFullscreen){await heroVideo.requestFullscreen()}
  else if(heroVideo.webkitEnterFullscreen){heroVideo.webkitEnterFullscreen()}
  else{heroVideo.controls=true;heroVideo.scrollIntoView({block:'center',behavior:'smooth'});heroVideo.title='Use the video player controls to expand this video'}
  await playing;
 }catch(error){heroVideo.controls=true;heroVideo.title='Use the video player controls to enter full screen'}
 syncHeroVideoControl();
}

heroVideo.addEventListener('click',()=>{if(document.fullscreenElement!==heroVideo)playHeroFullscreen()});
heroVideo.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&document.fullscreenElement!==heroVideo){event.preventDefault();playHeroFullscreen()}});
document.addEventListener('fullscreenchange',()=>{heroVideo.controls=document.fullscreenElement===heroVideo});
heroVideo.addEventListener('webkitbeginfullscreen',()=>{heroVideo.controls=true});
heroVideo.addEventListener('webkitendfullscreen',()=>{heroVideo.controls=false});

$('#brand-motion-toggle').onclick=()=>{const stopped=$('.brand-strip').classList.toggle('is-paused');$('#brand-motion-toggle').setAttribute('aria-pressed',String(stopped));$('#brand-motion-toggle').setAttribute('aria-label',stopped?'Resume brand strip':'Pause brand strip');$('#brand-motion-toggle').textContent=stopped?'▷':'Ⅱ'};

// Service films download near the viewport and pause when off screen.
$$('.service-video').forEach(video=>{
 const button=video.parentElement.querySelector('.service-video-toggle');
 let loaded=false,userPaused=false,visible=false;
 const label=video.getAttribute('aria-label')||'service video';
 function sync(){button.textContent=video.paused?'▷':'Ⅱ';button.setAttribute('aria-label',(video.paused?'Play ':'Pause ')+label)}
 function load(){if(loaded)return;const source=video.querySelector('source');source.src=source.dataset.src;video.load();loaded=true}
 function play(){load();video.muted=true;video.play().catch(sync)}
 button.onclick=()=>{if(video.paused){userPaused=false;play()}else{userPaused=true;video.pause()}};
 video.addEventListener('play',sync);video.addEventListener('pause',sync);
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>entries.forEach(entry=>{visible=entry.isIntersecting;if(visible&&!userPaused&&!document.hidden)play();else video.pause()}),{rootMargin:'80px 0px',threshold:.05}).observe(video)}else{visible=true;play()}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(visible&&!userPaused)play()});sync();
});

// Avoid rendering the background film while the visitor is elsewhere on the page.
let heroVisible=true;let heroUserPaused=false;
$('#hero-video-toggle').addEventListener('click',()=>{heroUserPaused=heroVideo.paused});
if('IntersectionObserver' in window){new IntersectionObserver(entries=>entries.forEach(entry=>{heroVisible=entry.isIntersecting;if(!heroVisible)heroVideo.pause();else if(!heroUserPaused&&!document.hidden)heroVideo.play().catch(syncHeroVideoControl)}),{threshold:.01}).observe(heroVideo)}
document.addEventListener('visibilitychange',()=>{if(document.hidden)heroVideo.pause();else if(heroVisible&&!heroUserPaused)heroVideo.play().catch(syncHeroVideoControl)});

// Keep the transparent two-second reverse animation aligned with each hero loop.
const heroBrandOverlay = document.querySelector('#hero-brand-overlay');
const heroBrandAnimation = document.querySelector('#hero-brand-animation');
const heroBrandReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroBrandFrame = 0;
let lastHeroBrandTime = 0;
function syncHeroBrandOverlay() {
  cancelAnimationFrame(heroBrandFrame);
  heroBrandFrame = 0;
  const time = heroVideo.currentTime;
  const visible = time < 2;
  const restarted = time < lastHeroBrandTime - 0.5;
  lastHeroBrandTime = time;
  heroBrandOverlay.style.opacity = String(visible ? (heroBrandReducedMotion.matches ? 1 : Math.max(0, Math.min(1, (2 - time) / 0.5))) : 0);
  if (heroBrandAnimation.readyState >= 2) {
    const target = heroBrandReducedMotion.matches ? 0 : Math.min(time, 1.99);
    if (restarted || Math.abs(heroBrandAnimation.currentTime - target) > 0.2) {
      heroBrandAnimation.currentTime = target;
    }
    if (visible && !heroVideo.paused && !document.hidden && !heroBrandReducedMotion.matches) {
      if (heroBrandAnimation.paused) heroBrandAnimation.play().catch(() => {});
    } else {
      heroBrandAnimation.pause();
    }
  }
  if (visible && !heroVideo.paused && !document.hidden) {
    heroBrandFrame = requestAnimationFrame(syncHeroBrandOverlay);
  }
}
['play', 'pause', 'timeupdate', 'seeked', 'loadedmetadata', 'ended'].forEach(event => {
  heroVideo.addEventListener(event, syncHeroBrandOverlay);
});
heroBrandAnimation.addEventListener('loadeddata', syncHeroBrandOverlay);
document.addEventListener('visibilitychange', syncHeroBrandOverlay);
heroBrandReducedMotion.addEventListener('change', syncHeroBrandOverlay);
syncHeroBrandOverlay();

// Plain inline work clips share the existing optimized asset and load near the viewport.
document.querySelectorAll('.work-video').forEach(video => {
 video.muted=true;
 let loaded=false, userPaused=false, inView=false, automaticPause=false;
 const load=()=>{if(loaded)return;loaded=true;video.src=video.dataset.src;video.load()};
 const play=()=>{load();if(!userPaused&&!document.hidden)video.play().catch(()=>{})};
 const pause=()=>{if(video.paused)return;automaticPause=true;video.pause()};
 video.addEventListener('pause',()=>{if(!automaticPause)userPaused=true;automaticPause=false});
 video.addEventListener('play',()=>{userPaused=false});
 if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>entries.forEach(entry=>{inView=entry.isIntersecting;if(inView)play();else pause()}),{rootMargin:'100px',threshold:.01}).observe(video);
 }else{inView=true;play()}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(inView)play()});
});

// Animation is loaded only after an explicit click and stops outside the viewport.
const dancingCat = document.querySelector('#dancing-cat');
const catToggle = document.querySelector('#cat-dance-toggle');
const catStatus = document.querySelector('#cat-dance-status');
let catRequested = false;
let catInView = true;
let catShowingAnimation = false;
function syncCatDance() {
 const animate = catRequested && catInView && !document.hidden;
 if (animate !== catShowingAnimation) {
  catShowingAnimation = animate;
  dancingCat.src = animate ? dancingCat.dataset.animatedSrc : dancingCat.dataset.stillSrc;
 }
 catToggle.setAttribute('aria-checked', String(catRequested));
}
catToggle.addEventListener('click', () => {
 catRequested = !catRequested;
 syncCatDance();
 catStatus.textContent = catRequested ? 'The cat is dancing.' : 'The cat is resting.';
});
dancingCat.addEventListener('error', () => {
 if (!catShowingAnimation) return;
 catRequested = false;
 syncCatDance();
 catStatus.textContent = 'The animation could not load. Click again to retry.';
});
if ('IntersectionObserver' in window) {
 new IntersectionObserver(entries => {
  catInView = entries[0].isIntersecting;
  syncCatDance();
 }, {threshold:0}).observe(dancingCat);
}
document.addEventListener('visibilitychange', syncCatDance);

const workReaction = document.querySelector('#work-reaction-video');
let reactionInView=false, reactionLoaded=false;
workReaction.muted=true;
function syncWorkReaction(){
 if(reactionInView&&!paused&&!document.hidden){
  if(!reactionLoaded){reactionLoaded=true;workReaction.src=workReaction.dataset.src;workReaction.load()}
  workReaction.play().catch(()=>{});
 }else workReaction.pause();
}
if('IntersectionObserver' in window){
 new IntersectionObserver(entries=>{reactionInView=entries[0].isIntersecting;syncWorkReaction()},{threshold:.01}).observe(workReaction);
}else{reactionInView=true;syncWorkReaction()}
document.addEventListener('visibilitychange',syncWorkReaction);
document.addEventListener('workmotionchange',syncWorkReaction);

// Give the contact section its own staggered entrance, including on small screens.
const contactSection = document.querySelector('#contact');
const contactEntries = [...contactSection.querySelectorAll('.contact-entry')];
[...contactSection.querySelector('#contact-form').children].filter(field => field.type !== 'hidden').forEach((field,index)=>field.style.setProperty('--field-delay',`${240+Math.floor(index/2)*100}ms`));
let contactEntranceObserver;
if ('IntersectionObserver' in window && !reduceEffects.matches) {
 contactSection.classList.add('contact-motion-ready');
 contactEntranceObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   entry.target.classList.add('contact-entered');
   contactEntranceObserver.unobserve(entry.target);
  });
 }, {threshold:0.12,rootMargin:'0px 0px -20px 0px'});
 contactEntries.forEach(entry => contactEntranceObserver.observe(entry));
 // Keyboard navigation must never leave a focused field visually hidden.
 contactSection.addEventListener('focusin', () => {
  contactEntries.forEach(entry => entry.classList.add('contact-entered'));
  contactEntranceObserver.disconnect();
 });
}
reduceEffects.addEventListener('change', event => {
 if (!event.matches) return;
 contactEntranceObserver?.disconnect();
 contactEntries.forEach(entry => entry.classList.add('contact-entered'));
});
