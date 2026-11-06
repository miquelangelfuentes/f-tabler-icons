'use strict';
const $=selector=>document.querySelector(selector);
const ui={
 browser:$('#browser'),search:$('#search'),nav:$('#category-nav'),
 navWrap:$('#category-nav-wrap'),navPrev:$('#nav-arrow-prev'),navNext:$('#nav-arrow-next'),
 status:$('#status'),empty:$('#empty'),samples:$('#samples'),
 clear:$('#clear-filters')
};

function updateNavScroll(){
 if(!ui.nav||!ui.navWrap)return;
 const {scrollLeft,scrollWidth,clientWidth}=ui.nav;
 const maxScroll=Math.max(0,scrollWidth-clientWidth);
 const canLeft=scrollLeft>6;
 const canRight=scrollLeft<maxScroll-6;
 if(ui.navPrev)ui.navPrev.disabled=!canLeft;
 if(ui.navNext)ui.navNext.disabled=!canRight;
 ui.navWrap.classList.toggle('can-scroll-left',canLeft);
 ui.navWrap.classList.toggle('can-scroll-right',canRight);
}
const state={catalog:null,topics:null,color:'blau',category:'',topic:'',sort:'recomanat',limit:36};
const PAGE_SIZE=36;
const FEATURED=['book','brain','message','photo','shield','chart-bar','calendar','heart',
 'check','microphone','code','users','folder','school','target','sparkles',
 'presentation','lock','file-text','globe','search','palette','link','settings'];
const normalize=value=>String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLowerCase();
const asset=(name,extension)=>'./assets/'+state.color+'/'+extension+'/'+name+'.'+extension;
const newEl=(tag,cl,textValue)=>{
 const element=document.createElement(tag);
 if(cl)element.className=cl;
 if(textValue!==undefined)element.textContent=String(textValue);
 return element;
};
const categoryById=id=>state.catalog.categories.find(category=>category.id===id);
function topicFor(icon){
 const rules=state.topics[icon.category]||[];
 return rules.find(rule=>rule.exact.includes(icon.name)||rule.prefixes.some(prefix=>
   icon.name===prefix||icon.name.startsWith(prefix+'-')
 ))||{id:'altres',label:'Altres',keywords:''};
}
function flash(message){
 const toast=$('#toast');
 toast.textContent=message;toast.hidden=false;
 clearTimeout(flash.timer);
 flash.timer=setTimeout(()=>{toast.hidden=true},2400);
}
function downloadLink(name,extension){
 const a=newEl('a',null,extension.toUpperCase());
 a.href=asset(name,extension);
 a.download=name+'-'+state.color+'.'+extension;
 a.setAttribute('aria-label','Descarrega '+a.download);
 return a;
}
function iconTile(icon){
 const card=newEl('article','card');
 const art=newEl('div','art');
 const preview=new Image();
 preview.src=asset(icon.name,'png');
 preview.loading='lazy';preview.alt='';
 preview.width=88;preview.height=88;
 art.append(preview);
 const body=newEl('div','body');
 const title=newEl('h3',null,icon.name);
 const actions=newEl('div','actions');
 actions.append(downloadLink(icon.name,'png'),downloadLink(icon.name,'svg'));
 const copy=newEl('button',null,'Copia URL');
 copy.type='button';
 copy.setAttribute('aria-label','Copia l’enllaç PNG de '+icon.name);
 copy.addEventListener('click',async()=>{
   try{
     await navigator.clipboard.writeText(new URL(asset(icon.name,'png'),location.href).href);
     flash('Enllaç copiat.');
   }catch{flash('Obriu el PNG per copiar-ne l’adreça.')}
 });
 actions.append(copy);
 body.append(title,actions);
 card.append(art,body);
 return card;
}
function iconGrid(icons){
 const grid=newEl('div','catalog');
 for(const icon of icons)grid.append(iconTile(icon));
 return grid;
}
function categoryIcons(id){
 return state.catalog.icons.filter(icon=>icon.category===id);
}
function setCategory(id,shouldScroll=false){
 state.category=id;
 state.topic='';
 state.limit=PAGE_SIZE;
 render();
 const chip=ui.nav.querySelector(`[data-category="${id}"]`);
 if(chip){
   chip.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'});
 }
 if(shouldScroll)ui.browser.scrollIntoView({behavior:'smooth',block:'start'});
}
function categoryNavigation(){
 const fragment=document.createDocumentFragment();
 const categories=[{id:'',label:'Totes les categories',count:state.catalog.total},
  ...state.catalog.categories];
 for(const category of categories){
   const button=newEl('button','category-chip');
   button.type='button';
   button.dataset.category=category.id;
   button.setAttribute('aria-pressed',String(state.category===category.id));
   button.append(newEl('span',null,category.label),
    newEl('span','chip-count',category.count));
   button.addEventListener('click',()=>setCategory(category.id));
   fragment.append(button);
 }
 ui.nav.replaceChildren(fragment);
 requestAnimationFrame(updateNavScroll);
}
function categoryCard(category){
 const button=newEl('button','category-tile');
 button.type='button';
 const heading=newEl('div');
 heading.append(newEl('h4',null,category.label),
  newEl('p','category-meta',category.count+' icones · '+(state.topics[category.id]||[]).length+' subcategories'));
 const preview=newEl('div','category-preview');
 for(const icon of categoryIcons(category.id).slice(0,3)){
   const img=new Image();img.src=asset(icon.name,'png');img.alt='';
   img.loading='lazy';img.width=51;img.height=51;
   preview.append(img);
 }
 preview.append(newEl('span','tile-action','Explora'));
 button.append(heading,preview);
 button.addEventListener('click',()=>setCategory(category.id,true));
 return button;
}
function overview(){
 const fragment=document.createDocumentFragment();
 const intro=newEl('div','section-intro');
 const text=newEl('div');
 text.append(newEl('h3',null,'Explora per categories'),
  newEl('p',null,'Entra en un àmbit i afina la selecció amb les subcategories.'));
 intro.append(text);
 const grid=newEl('div','category-overview');
 for(const category of state.catalog.categories)grid.append(categoryCard(category));
 const featured=newEl('section','featured-block');
 const featuredIntro=newEl('div','section-intro');
 const inner=newEl('div');
 inner.append(newEl('h3',null,'Selecció ràpida'),
  newEl('p',null,'Icones habituals per començar a explorar.'));
 featuredIntro.append(inner);
 const lookup=new Map(state.catalog.icons.map(icon=>[icon.name,icon]));
 featured.append(featuredIntro,iconGrid(FEATURED.map(name=>lookup.get(name)).filter(Boolean)));
 fragment.append(intro,grid,featured);
 ui.browser.replaceChildren(fragment);
 ui.status.textContent=state.catalog.total+' icones en '+state.catalog.categories.length+' categories';
 ui.empty.hidden=true;
}
function matchScore(icon,query){
 if(!query)return 1;
 const name=normalize(icon.name);
 const topic=topicFor(icon);
 const group=categoryById(icon.category);
 if(name===query)return 1000;
 if(name.startsWith(query))return 750;
 if(name.includes(query))return 600;
 if(normalize(topic.label).includes(query))return 260;
 if(normalize(topic.keywords).includes(query))return 230;
 if(normalize(group.label).includes(query))return 100;
 return 0;
}
function sortResults(items,query){
 if(state.sort==='alfabetic')return [...items].sort((a,b)=>a.name.localeCompare(b.name));
 if(query)return [...items].sort((a,b)=>
   matchScore(b,query)-matchScore(a,query)
   ||a.name.localeCompare(b.name)
 );
 return items;
}
function topicNavigation(matched){
 const container=newEl('nav','topic-nav');
 container.setAttribute('aria-label','Subcategories');
 const groups=state.topics[state.category]||[];
 const options=[{id:'',label:'Totes',count:matched.length},...groups.map(group=>({
   id:group.id,label:group.label,count:matched.filter(item=>topicFor(item).id===group.id).length
 }))].filter(group=>group.id===''||group.count>0);
 for(const topic of options){
   const b=newEl('button','topic-chip');
   b.type='button';
   b.setAttribute('aria-pressed',String(state.topic===topic.id));
   b.append(newEl('span',null,topic.label),newEl('span',null,topic.count));
   b.addEventListener('click',()=>{
     state.topic=topic.id;state.limit=PAGE_SIZE;render();
   });
   container.append(b);
 }
 return container;
}
function sortControl(){
 const label=newEl('label','sort-field');
 label.append(newEl('span',null,'Ordre'));
 const select=newEl('select');
 for(const [value,title] of [['recomanat','Recomanades'],['alfabetic','Nom (A–Z)']]){
   const o=newEl('option',null,title);o.value=value;
   select.append(o);
 }
 select.value=state.sort;
 select.addEventListener('change',()=>{
   state.sort=select.value;state.limit=PAGE_SIZE;render();
 });
 label.append(select);
 return label;
}
function loadMore(visible,total){
 if(visible>=total)return null;
 const wrap=newEl('div','load-row');
 const button=newEl('button','load-more','Mostra '+Math.min(PAGE_SIZE,total-visible)+' icones més');
 button.type='button';
 button.addEventListener('click',()=>{
   state.limit+=PAGE_SIZE;render();
 });
 wrap.append(button,newEl('div','load-hint','Se’n mostren '+visible+' de '+total));
 return wrap;
}
function resultGroup(category,icons,matchedCount){
 const section=newEl('section','result-group');
 const label=newEl('h4',null,category.label);
 label.append(newEl('small',null,matchedCount+' coincidències'));
 section.append(label,iconGrid(icons));
 return section;
}
function searchEverywhere(query){
 const matching=state.catalog.icons.filter(icon=>matchScore(icon,query)>0);
 const ranked=sortResults(matching,query);
 const visible=ranked.slice(0,state.limit);
 const fragment=document.createDocumentFragment();
 const header=newEl('div','result-header');
 const title=newEl('div');
 title.append(newEl('h3',null,'Resultats de la cerca'),
  newEl('p','result-description',matching.length+' icones coincideixen amb «'+ui.search.value.trim()+'».'));
 header.append(title,sortControl());fragment.append(header);
 for(const category of state.catalog.categories){
   const hits=visible.filter(icon=>icon.category===category.id);
   if(hits.length)fragment.append(resultGroup(category,hits,
    matching.filter(icon=>icon.category===category.id).length));
 }
 const more=loadMore(visible.length,matching.length);
 if(more)fragment.append(more);
 ui.browser.replaceChildren(fragment);
 ui.status.textContent=matching.length+' resultats · '+visible.length+' visibles';
 ui.empty.hidden=matching.length>0;
}
function chosenCategory(category,query){
 const matched=categoryIcons(category.id).filter(icon=>matchScore(icon,query)>0);
 if(state.topic && !matched.some(icon=>topicFor(icon).id===state.topic))state.topic='';
 const filtered=state.topic?matched.filter(icon=>topicFor(icon).id===state.topic):matched;
 const ranked=sortResults(filtered,query);
 const visible=ranked.slice(0,state.limit);
 const fragment=document.createDocumentFragment();
 const header=newEl('div','result-header');
 const title=newEl('div');
 const back=newEl('button','crumb','← Totes les categories');
 back.type='button';back.addEventListener('click',()=>setCategory(''));
 title.append(back,newEl('h3',null,category.label),
  newEl('p','result-description',category.count+' icones distribuïdes en '+state.topics[category.id].length+' subcategories.'));
 header.append(title,sortControl());
 fragment.append(header,topicNavigation(matched),iconGrid(visible));
 const more=loadMore(visible.length,filtered.length);
 if(more)fragment.append(more);
 ui.browser.replaceChildren(fragment);
 ui.status.textContent=filtered.length+' icones · '+visible.length+' visibles';
 ui.empty.hidden=filtered.length>0;
}
function applyTheme(){
 document.documentElement.dataset.theme=state.color;
 for(const [id,path] of [
  ['site-favicon-16','./favicon-'+state.color+'-16.png?v=3'],
  ['site-favicon-32','./favicon-'+state.color+'-32.png?v=3'],
  ['site-favicon','./favicon-'+state.color+'.svg?v=3'],
  ['site-apple-icon','./favicon-'+state.color+'-180.png?v=3']
 ])$( '#'+id ).href=path;
 const sample=document.createDocumentFragment();
 for(const name of ['book','brain','photo']){
   if(!state.catalog.icons.some(icon=>icon.name===name))continue;
   const img=new Image();img.src=asset(name,'png');img.alt='';
   sample.append(img);
 }
 ui.samples.replaceChildren(sample);
}
function render(){
 if(!state.catalog||!state.topics)return;
 applyTheme();
 categoryNavigation();
 const query=normalize(ui.search.value.trim());
 ui.clear.hidden=!query&&!state.category&&!state.topic;
 if(!query&&!state.category){overview();return;}
 if(!state.category){searchEverywhere(query);return;}
 chosenCategory(categoryById(state.category),query);
}
async function init(){
 try{
   const [catalog,topics]=await Promise.all([
    fetch('./data/catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Catàleg');return r.json()}),
    fetch('./data/topics.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Subcategories');return r.json()})
   ]);
   if(catalog.icons.length!==catalog.total)throw Error('Comptadors inconsistents');
   state.catalog=catalog;state.topics=topics;
   try{
     const stored=localStorage.getItem('tabler-theme');
     if(stored==='blau'||stored==='coral')state.color=stored;
   }catch{}
   const radio=document.querySelector('[name=color][value="'+state.color+'"]');
   if(radio)radio.checked=true;
   render();
 }catch(error){
   ui.status.textContent='No s’ha pogut carregar el catàleg';
   ui.empty.hidden=false;ui.empty.textContent='Torneu a carregar la pàgina per consultar les icones.';
   console.error(error);
 }
}
ui.search.addEventListener('input',()=>{state.limit=PAGE_SIZE;state.topic='';render()});
ui.clear.addEventListener('click',()=>{
 ui.search.value='';state.category='';state.topic='';state.limit=PAGE_SIZE;
 state.sort='recomanat';render();ui.search.focus();
});
document.querySelectorAll('[name=color]').forEach(radio=>
 radio.addEventListener('change',event=>{
   state.color=event.currentTarget.value;
   try{localStorage.setItem('tabler-theme',state.color)}catch{}
   render();
 })
);
init();

if(ui.nav){
 ui.nav.addEventListener('scroll',updateNavScroll,{passive:true});
 window.addEventListener('resize',updateNavScroll);
 let isDown=false,startX=0,startScroll=0,hasDragged=false;
 ui.nav.addEventListener('mousedown',e=>{
   if(e.button!==0)return;
   isDown=true;hasDragged=false;
   startX=e.pageX;startScroll=ui.nav.scrollLeft;
 });
 window.addEventListener('mousemove',e=>{
   if(!isDown)return;
   const diff=e.pageX-startX;
   if(Math.abs(diff)>5)hasDragged=true;
   ui.nav.scrollLeft=startScroll-diff;
 });
 window.addEventListener('mouseup',()=>{isDown=false;});
 ui.nav.addEventListener('click',e=>{
   if(hasDragged){e.preventDefault();e.stopPropagation();}
 },true);
}
if(ui.navPrev){
 ui.navPrev.addEventListener('click',()=>{
   ui.nav.scrollBy({left:-280,behavior:'smooth'});
 });
}
if(ui.navNext){
 ui.navNext.addEventListener('click',()=>{
   ui.nav.scrollBy({left:280,behavior:'smooth'});
 });
}
