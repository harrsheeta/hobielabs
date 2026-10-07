// Screenshot values are fixed; this is a reveal/count-up effect, not a live data feed.
const founderCards = [...document.querySelectorAll('.founder-section')];
const prefersStillCards = window.matchMedia('(prefers-reduced-motion: reduce)');
const plainCount = new Intl.NumberFormat('en-US');
const compactCount = new Intl.NumberFormat('en-US', {notation:'compact',maximumFractionDigits:1});
function animateProfileCounters(card) {
  const counters = [...card.querySelectorAll('.profile-counter')];
  let started;
  function tick(now) {
    started ??= now;
    const progress = prefersStillCards.matches ? 1 : Math.min((now-started)/1600,1);
    counters.forEach(counter => {
      const target = Number(counter.dataset.count);
      const formatter = counter.dataset.compact === 'true' ? compactCount : plainCount;
      counter.textContent = formatter.format(Math.round(target*(1-Math.pow(1-progress,3))));
    });
    if (progress < 1) requestAnimationFrame(tick);
    else card.classList.add('count-finished');
  }
  requestAnimationFrame(tick);
}
if ('IntersectionObserver' in window && !prefersStillCards.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      animateProfileCounters(entry.target);
      observer.unobserve(entry.target);
    });
  },{threshold:0.3});
  founderCards.forEach((card,index) => {
    card.querySelectorAll('.profile-counter').forEach(counter=>{counter.textContent='0';});
    card.style.setProperty('--card-delay',`${index*120}ms`);
    card.classList.add('scroll-ready','counter-ready');
    observer.observe(card);
  });
  prefersStillCards.addEventListener('change',event=>{
    if (!event.matches) return;
    observer.disconnect();
    founderCards.forEach(card=>card.classList.add('is-visible','count-finished'));
  });
}

// One-time reveals; comment cards move only on entry and hover, never in a loop.
const commentSlots=[...document.querySelectorAll('.comment-slot')];
if('IntersectionObserver' in window && !prefersStillCards.matches){
 const commentsObserver=new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{
   if(!isIntersecting)return;
   target.classList.add('has-entered');
   commentsObserver.unobserve(target);
  });
 },{threshold:.12});
 commentSlots.forEach(slot=>{slot.classList.add('comment-reveal');commentsObserver.observe(slot)});
 prefersStillCards.addEventListener('change',event=>{
  if(!event.matches)return;
  commentsObserver.disconnect();
  commentSlots.forEach(slot=>slot.classList.add('has-entered'));
 });
}
