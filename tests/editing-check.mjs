// ED09: deterministic fixture and actual document structure checks, not NL/video tests.
import {readFileSync} from "node:fs";
function runEditingQC(rawFiles,group){
 const f=Object.fromEntries(Object.entries(rawFiles).map(([p,c])=>[p,c.replace(/\r\n/g,"\n")]));
 const root="references/editing/",checks=[],failures=[];
 const check=(id,ok)=>{checks.push(id);if(!ok)failures.push(id)};
 if(group==="library"){
  const libs=[["temporal_editing_library.md","TE",10],["montage_library.md","MO",8],["continuity_editing_library.md","CO",8],["emotional_editing_library.md","EM",6],["rhythm_pacing_library.md","RY",7],["information_editing_library.md","IN",6],["insert_cutaway_library.md","IC",6],["audio_editing_library.md","AU",8]];
  const all=[];
  for(const [path,prefix,n] of libs){
   const rows=f[root+path].split("\n").filter(x=>new RegExp("^\\| "+prefix+"\\d{2} ").test(x));
   const ids=rows.map(x=>x.match(/^\| ([A-Z]+\d{2}) /)[1]);all.push(...ids);
   check(prefix+":ids",rows.length===n&&ids.every((x,i)=>x===prefix+String(i+1).padStart(2,"0")));
   check(prefix+":card-fields",rows.every(x=>x.split("|").slice(1,-1).length===7&&x.split("|").slice(1,-1).every(y=>y.trim())&&/SRC\d{2}/.test(x)));
   check(prefix+":sources",rows.every(x=>{const refs=x.split("|").at(-2).match(/\d{2}/g)||[];return refs.length>0&&refs.every(y=>f[root+"sources.md"].includes("SRC"+y));}));
  }
  check("59-unique-cards",all.length===59&&new Set(all).size===59);
  check("46-adapter",f[root+"transition_adapter.md"].includes("transition-techniques-library-v2.md")&&["none","suggest_only","planned_pair"].every(x=>f[root+"transition_adapter.md"].includes(x)));
  for(const [p,n] of [["H",12],["S",10]])check("quality:"+p,(f[root+"editing_quality_control.md"].match(new RegExp("^\\| ED-"+p+"\\d{2} \\|","gm"))||[]).length===n);
 }else if(group==="integration"){
  for(const p of ["SKILL.md","SKILL.cn.md"]){
   const s=f[p];check(p+":route-order",s.indexOf("## v2.1 / CE")>=0&&s.indexOf("## v2.1 / CE")<s.indexOf("## v2.2 / ED")&&s.indexOf("## v2.2 / ED")<s.indexOf("## v2 / T01"));
   check(p+":dual-route",["CONTINUOUS","EDITED","HYBRID","技术上独立生成不代表剧情解耦","Editing QC","0<T≤300","non_diegetic_music: N/A"].every(x=>s.includes(x)));
   check(p+":legacy-no-cap",!/(?:成片最多 120|最多8个独立|最长 8 个独立|3–8 Part 统一)/.test(s));
  }
  check("timing-limit",f["references/timing_engine.md"].includes("0<T≤300")&&f["references/timing_engine.md"].includes("不固定20上限"));
  check("continuity-dependency",f["references/continuity_handoff.md"].includes("depends_on_task_ids")&&f["references/continuity_handoff.md"].includes("实际保留点"));
  check("auto-not-duration",f[root+"editing_auto_strategy.md"].includes("不依据长短"));
  check("creative-300",f["references/creative/creative_director.md"].includes("15–300秒"));
  check("legacy-crlf",f["tests/qc-check.mjs"].includes('.replace(/\\r\\n/g,"\\n")'));
  check("formal-version",/^version: 1\.0\.0$/m.test(f["meta.yaml"]));
  check("behavior-not-run",(f["tests/editing-cases.md"].match(/^\| ED\d{2} \|.*\| NOT_RUN \|$/gm)||[]).length===50);
  const hybrid=f["examples/editing/hybrid-30s-complete.md"];
  const blocks=[...hybrid.matchAll(/^```text\n([\s\S]*?)^```$/gm)].map(x=>x[1]);
  check("hybrid-3-prompts",blocks.length===3);
  for(let i=0;i<blocks.length;i++){
   const b=blocks[i];check("hybrid-six-fields:"+i,JSON.stringify([...b.matchAll(/^([a-z_]+):\s*$/gm)].map(x=>x[1]))===JSON.stringify(["subject_definitions","summary","retention_analysis","detailed_description","overall_soundscape","non_diegetic_music"]));
   const rows=b.split("\n").filter(l=>/^\[Shot \d+\]/.test(l));
   const times=rows.map((l,k)=>({start:k===0?(/^\[Shot 1\] 0\.000–/.test(l)?0:NaN):+l.match(/At 00:(\d+\.\d{3})/)?.[1],end:+l.match(/(?:–|至)00:(\d+\.\d{3})/)?.[1]}));
   check("hybrid-local:"+i,times.length===4&&times.every((x,k)=>x.start===(k?times[k-1].end:0)&&x.end>x.start)&&times.at(-1).end===15);
   check("hybrid-no-bgm-no-image:"+i,/non_diegetic_music:\nN\/A\s*$/.test(b)&&!b.includes("<Picture")&&b.includes("【禁止项】"));
  }
  const h=[...hybrid.matchAll(/^\| D\d+ \| (P\d+) \| (\d+)–(\d+) \| (\d+)–(\d+) \|/gm)];
  check("hybrid-actual-edl",h.map(x=>x[1]).join(",")==="P02,P01,P03"&&h.every((x,i)=>+x[4]===i*10&&+x[5]===i*10+10&&+x[3]-+x[2]===10));
  const two=f["examples/editing/edited-120s-story-plan.md"];
  const t=[...two.matchAll(/^\| \d+ \| (P\d+) \| (\d+)–(\d+) \| (\d+)–(\d+) \|/gm)];check("120-actual-edl",t.length===10&&new Set(t.map(x=>x[1])).size===10&&t[0][1]==="P05"&&t.every((x,i)=>+x[4]===i*12&&+x[5]===(i+1)*12&&+x[3]-+x[2]===12));
  const five=f["examples/editing/300s-dual-path-budget.md"];
  const v=[...five.matchAll(/^\| P\d+ \| .* \| (\d+)–(\d+) \|$/gm)];
  check("300-continuous",v.length===20&&v.every((x,i)=>+x[1]===15*i&&+x[2]===15*(i+1)));
  const q=[...five.matchAll(/^\| C\d+ \| Q(\d+)–Q(\d+) \| (\d+)–(\d+) \|/gm)];
  check("300-coverage",q.length===6&&q.every((x,i)=>+x[1]===i*4+1&&+x[2]===i*4+4&&+x[3]===50*i&&+x[4]===50*(i+1)));
  // Deterministic fixtures only: explicit states and edited ranges, not natural-language/video understanding.
  function validate(p){
   const errors=[];
   const fail=id=>errors.push(id);
   if(!["CONTINUOUS","EDITED","HYBRID"].includes(p.mode)||p.lockMode&&p.mode!==p.lockMode)fail("routing");
   if(!Number.isInteger(p.target)||p.target<=0||p.target>300000)fail("target");
   const clips=new Map(p.clips.map(x=>[x.id,x]));
   if(clips.size!==p.clips.length||p.clips.some(c=>!Number.isInteger(c.duration)||c.duration<=0||c.kind==="generation"&&c.duration!==15000||!["generation","existing"].includes(c.kind)||c.kind==="existing"&&!c.verified))fail("clips");
   const count=p.clips.filter(c=>c.kind==="generation").length;
   if(!Number.isInteger(p.budget)||count>p.budget)fail("budget");
   if(p.bgm!==false)fail("bgm");
   const ids=new Set(),seen=new Map();let end=0;let prev=null;let unique=0;
   for(const x of p.edits){
    const c=clips.get(x.clip);
    if(ids.has(x.id))fail("id");ids.add(x.id);
    if(!c||!c.events.includes(x.event)||x.version!==p.versions[x.event])fail("event");
    if(![x.si,x.so,x.di,x.do].every(Number.isInteger)||x.si<0||x.so<=x.si||!c||x.so>c.duration||x.di!==end||x.do<=x.di||x.so-x.si!==x.do-x.di)fail("ranges");
    const ranges=seen.get(x.clip)||[];
    if(ranges.some(([a,b])=>x.si<b&&a<x.so)&&!(typeof x.reuse==="string"&&x.reuse.trim()))fail("reuse");
    ranges.push([x.si,x.so]);seen.set(x.clip,ranges);end=x.do;
    if(prev){
     const b=x.boundary;
     if(!b||!["same_moment","ellipsis","time_jump","location_jump","flashback","flashforward","parallel","associative","return"].includes(b.relation))fail("boundary");
     else {
      if(b.relation==="same_moment"&&prev.out!==x.in)fail("continuity");
      if(b.relation!=="same_moment"&&!b.cue)fail("cue");
      if(p.mode==="CONTINUOUS"&&["flashback","flashforward","parallel","associative","return"].includes(b.relation))fail("continuous-order");
      if(b.transition==="planned_pair"&&!(b.authorized&&b.pair&&b.fallback))fail("transition");
      if(b.transition==="suggest_only"&&b.modified)fail("suggestion");
     }
    }
    if(x.verified&&!c?.verified)fail("evidence");
    prev=x;
   }
   if(end!==p.target)fail("net");
   for(const d of p.dependencies){const a=p.edits.find(e=>e.id===d.from),b=p.edits.find(e=>e.id===d.to);if(!a||!b||a.do>b.di||a.out!==b.in)fail("dependency");}
   for(const ranges of seen.values()){let a=-1,b=-1;for(const [s,e] of ranges.sort((x,y)=>x[0]-y[0])){if(s>b){if(a>=0)unique+=b-a;a=s;b=e}else b=Math.max(b,e)}if(a>=0)unique+=b-a;}
   return {valid:!errors.length,errors,net:end,uniqueUsed:unique,gross:count*15000};
  }
  function make(n,keep=15000,mode="CONTINUOUS"){
   return {mode,target:n*keep,budget:n,bgm:false,versions:Object.fromEntries(Array.from({length:n},(_,i)=>["E"+i,"now"])),clips:Array.from({length:n},(_,i)=>({id:"P"+i,duration:15000,kind:"generation",events:["E"+i]})),edits:Array.from({length:n},(_,i)=>({id:"D"+i,clip:"P"+i,event:"E"+i,version:"now",si:0,so:keep,di:i*keep,do:(i+1)*keep,in:"s"+i,out:"s"+(i+1),boundary:i?{relation:"same_moment",transition:"none"}:undefined})),dependencies:Array.from({length:n-1},(_,i)=>({from:"D"+i,to:"D"+(i+1)}))};
  }
  function mutate(p,fn){const c=JSON.parse(JSON.stringify(p));fn(c);return c;}
  const base=make(2),hplan=make(3,10000,"HYBRID");
  hplan.versions.E1="past"; hplan.edits[1].version="past";hplan.edits[1].in="past start";hplan.edits[1].out="past end";hplan.edits[1].boundary={relation:"flashback",cue:"past wardrobe"};hplan.edits[2].in=hplan.edits[0].out;hplan.edits[2].boundary={relation:"return",cue:"now wardrobe"};hplan.dependencies=[{from:"D0",to:"D2"}];
  const cases=[
   ["continuous-30",base,true],
   ["continuous-300",make(20),true],
   ["edited-300-coverage",make(24,12500,"EDITED"),true],
   ["hybrid-return",hplan,true],
   ["hybrid-broken-return",mutate(hplan,p=>p.edits[2].in="past end"),false],
   ["continuous-mismatch",mutate(base,p=>p.edits[1].in="wrong prop"),false],
   ["no-auto-reorder",mutate(hplan,p=>p.mode="CONTINUOUS"),false],
   ["user-continuity-lock",mutate(hplan,p=>p.lockMode="CONTINUOUS"),false],
   ["no-cue",mutate(hplan,p=>delete p.edits[1].boundary.cue),false],
   ["wrong-story-version",mutate(hplan,p=>p.edits[1].version="now"),false],
   ["bad-dependency",mutate(base,p=>p.dependencies[0].to="missing"),false],
   ["wrong-source-id",mutate(base,p=>p.edits[1].clip="ghost"),false],
   ["wrong-event",mutate(base,p=>p.edits[1].event="E0"),false],
   ["source-overrun",mutate(base,p=>p.edits[1].so=15001),false],
   ["negative-source",mutate(base,p=>p.edits[0].si=-1),false],
   ["dest-gap",mutate(base,p=>p.edits[1].di++),false],
   ["dest-overlap",mutate(base,p=>p.edits[1].di--),false],
   ["net-mismatch",mutate(base,p=>p.target=29000),false],
   ["301s",mutate(make(20),p=>p.target=301000),false],
   ["fixed-task-cap",mutate(make(24,12500),p=>p.budget=20),false],
   ["bgm",mutate(base,p=>p.bgm=true),false],
   ["unauth-special",mutate(base,p=>p.edits[1].boundary.transition="planned_pair"),false],
   ["auth-special",mutate(base,p=>Object.assign(p.edits[1].boundary,{transition:"planned_pair",authorized:true,pair:true,fallback:"cut"})),true],
   ["suggest-no-mutation",mutate(base,p=>Object.assign(p.edits[1].boundary,{transition:"suggest_only",modified:false})),true],
   ["suggest-mutates",mutate(base,p=>Object.assign(p.edits[1].boundary,{transition:"suggest_only",modified:true})),false],
   ["false-verified",mutate(base,p=>p.edits[0].verified=true),false],
   ["existing-only",mutate(base,p=>{p.clips.forEach(c=>{c.kind="existing";c.verified=true});p.budget=0;}),true],
   ["unknown-existing",mutate(base,p=>{p.clips[0].kind="existing";p.clips[0].verified=false}),false],
   ["source-duration-invalid",mutate(base,p=>p.clips[0].duration=16000),false]
  ];
  const reuse=mutate(base,p=>{p.mode="EDITED";p.clips[0].events.push("E1");p.edits[1].clip="P0";p.edits[1].reuse="same-object motif";});
  cases.push(["intentional-reuse",reuse,true],["unexplained-reuse",mutate(reuse,p=>delete p.edits[1].reuse),false]);
  for(const [id,p,want] of cases)check("fixture:"+id,validate(p).valid===want);
  const rv=validate(reuse);check("unique-reuse",rv.net===30000&&rv.uniqueUsed===15000&&rv.gross===30000);
  check("coverage-budget",validate(make(24,12500)).net===300000&&validate(make(24,12500)).gross===360000);
  const withAudio=mutate(base,p=>p.audio=[{start:14000,end:16000,track:"dialogue"}]);
  check("audio-overlap-not-video",validate(withAudio).net===30000);
 }else throw Error("unknown group");
 return {group,checks:checks.length,passed:checks.length-failures.length,failures};
}
const groups={
  "library": [
    "references/editing/temporal_editing_library.md",
    "references/editing/montage_library.md",
    "references/editing/continuity_editing_library.md",
    "references/editing/emotional_editing_library.md",
    "references/editing/rhythm_pacing_library.md",
    "references/editing/information_editing_library.md",
    "references/editing/insert_cutaway_library.md",
    "references/editing/audio_editing_library.md",
    "references/editing/sources.md",
    "references/editing/transition_adapter.md",
    "references/editing/editing_quality_control.md"
  ],
  "integration": [
    "SKILL.md",
    "SKILL.cn.md",
    "references/timing_engine.md",
    "references/continuity_handoff.md",
    "references/creative/creative_director.md",
    "references/editing/editing_auto_strategy.md",
    "references/editing/editing_timeline.md",
    "references/editing/footage_planning.md",
    "tests/editing-cases.md",
    "examples/editing/hybrid-30s-complete.md",
    "examples/editing/edited-120s-story-plan.md",
    "examples/editing/300s-dual-path-budget.md",
    "meta.yaml",
    "tests/qc-check.mjs"
  ]
};
for(const [group,paths] of Object.entries(groups)){
 const files=Object.fromEntries(paths.map(p=>[p,readFileSync(new URL("../"+p,import.meta.url),"utf8")]));
 const lf=runEditingQC(files,group),crlf=runEditingQC(Object.fromEntries(Object.entries(files).map(([p,c])=>[p,c.replace(/\r?\n/g,"\r\n")])),group);
 const equivalent=JSON.stringify(lf)===JSON.stringify(crlf);console.log(JSON.stringify({lf,crlf,equivalent},null,2));if(lf.failures.length||crlf.failures.length||!equivalent)process.exitCode=1;
}
