// CE deterministic fixture regression; Node.js 18+, no dependencies.
// Does not classify arbitrary natural language or validate H3 video.
import { readFileSync } from "node:fs";
function runCreativeQC(rawFiles,group){
 const f=Object.fromEntries(Object.entries(rawFiles).map(([p,c])=>[p,c.replace(/\r\n/g,"\n")]));
 const root="references/creative/",results=[],failures=[];
 function check(id,value){results.push({id,pass:!!value});if(!value)failures.push(id);}
 const libs=[["genre_library.md","G",12],["micro_story_structures.md","S",10],["creative_seed_library.md","K",30],["character_interaction_library.md","R",9],["emotional_arc_library.md","E",13]];
 const mods=["creative_director.md","collaborative_discussion.md","creative_combination_engine.md","creative_brief.md","creative_quality_control.md",...libs.map(x=>x[0])];
 if(group==="library"){
  const ids={};
  for(const [file,p,n] of libs){ids[p]=[...f[root+file].matchAll(new RegExp("^\\| ("+p+"\\d{2}) \\|","gm"))].map(m=>m[1]);check("count:"+p,ids[p].length>=n);check("sequence:"+p,ids[p].every((x,i)=>x===p+String(i+1).padStart(2,"0")));}
  const seed=f[root+"creative_seed_library.md"];
  const gs=[...seed.matchAll(/^\| K\d{2} \| (G\d{2}) \|/gm)].map(m=>m[1]);
  check("seed-cover",ids.G.every(g=>gs.filter(x=>x===g).length>=2));check("seed-genres",gs.length===ids.K.length&&gs.every(x=>ids.G.includes(x)));
  check("seed-structures",(seed.match(/\bS\d{2}\b/g)||[]).every(x=>ids.S.includes(x)));
  for(const p of mods)check("module:"+p,f[root+p].trim().length>250);
  for(const [p,n] of [["H",9],["S",10]]){const a=[...f[root+"creative_quality_control.md"].matchAll(new RegExp("^\\| CR-"+p+"(\\d{2}) \\|","gm"))].map(m=>+m[1]);check("qc:"+p,a.length===n&&a.every((x,i)=>x===i+1));}
  check("discussion-states",["INTAKE","DIVERGE","DISCUSS","DRAFT_BRIEF","CONFIRMED","HANDOFF","REOPEN"].every(x=>f[root+"collaborative_discussion.md"].includes(x)));
  check("combination-fingerprint",f[root+"creative_combination_engine.md"].includes("fingerprint="));
  check("brief-current-revision",f[root+"creative_brief.md"].includes("confirmation.revision=revision"));
 }else if(group==="integration"){
  for(const p of ["SKILL.md","SKILL.cn.md"]){const s=f[p];check(p+":gate-first",s.indexOf("## v2.1 / CE")>=0&&s.indexOf("## v2.1 / CE")<s.indexOf("## v2 / T01"));check(p+":all-links",mods.every(m=>s.includes(root+m)));check(p+":confirmation-fast-track",["direct_ready","喜欢B","不得输出最终H3六字段","当前revision"].every(x=>s.includes(x)));check(p+":legacy",["步骤 5：T06","non_diegetic_music: N/A","Classic AB"].every(x=>s.includes(x)));}
  const cases=[...f["tests/creative-cases.md"].matchAll(/^\| CE(\d{2}) \|.*\| NOT_RUN \|$/gm)].map(m=>+m[1]);check("40-behavior-expectations",cases.length===40&&cases.every((n,i)=>n===i+1));
  check("director-handoff",f["references/director_strategy.md"].includes("v2.1 前置门禁")&&f["references/director_strategy.md"].includes("题材不自动决定摄影模式"));
  check("version-preserved",/^version: 1\.0\.0$/m.test(f["meta.yaml"]));check("old-crlf-preserved",f["tests/qc-check.mjs"].includes('.replace(/\\r\\n/g,"\\n")'));
  check("design-and-plan",f["docs/design-v2.1-creative-engine.md"].includes("## 13.")&&f["docs/implementation-plan-v2.1-creative-engine.md"].includes("CE07"));
  check("readme-tests",f["README.md"].includes("node tests/creative-check.mjs")&&f["README.md"].includes("node tests/qc-check.mjs"));
  const ex=["zero_idea_discussion.md","character_reference_ideation.md","vague_idea_expansion.md","creative_brief_to_director.md"];
  for(const p of ex)check("example:"+p,f["examples/creative/"+p].includes("**用户**")&&f["examples/creative/"+p].length>500);
  for(const p of ex.slice(0,3))check("discussion-no-prompt:"+p,!/^subject_definitions:$/m.test(f["examples/creative/"+p]));
  const blocks=[...f["examples/creative/"+ex[3]].matchAll(/^```text\n([\s\S]*?)^```$/gm)].map(m=>m[1]);
  check("handoff-one-prompt",blocks.length===1);
  if(blocks.length===1){ const b=blocks[0],fields=[...b.matchAll(/^([a-z_]+):\s*$/gm)].map(x=>x[1]);
   check("handoff-six-fields",JSON.stringify(fields)===JSON.stringify(["subject_definitions","summary","retention_analysis","detailed_description","overall_soundscape","non_diegetic_music"]));
   const shots=b.split("\n").filter(l=>/^\[Shot \d+\]/.test(l)).map((l,i)=>({id:+l.match(/\[Shot (\d+)\]/)[1],start:i===0?(/^\[Shot 1\] 0\.000–/.test(l)?0:NaN):+l.match(/At 00:(\d+\.\d{3})/)?.[1],end:+l.match(/(?:–|至)00:(\d+\.\d{3})/)?.[1],mode:l.match(/(?:：|TO:\s*)([AB])\d/)?.[1]}));
   check("handoff-timeline",shots.length===4&&shots.every((s,i)=>s.id===i+1&&s.start===(i?shots[i-1].end:0)&&s.end>s.start&&s.mode==="B")&&shots.at(-1).end===15);
   check("handoff-ref-audio",!b.includes("<Picture")&&!b.includes("[reference generation]")&&!b.includes("<d>")&&/non_diegetic_music:\nN\/A\s*$/.test(b)&&b.includes("【禁止项】\n\n文字/UI/水印/Logo/角标/可读文字/真实UI\n\n【强制声明】\n\n无背景音乐,仅保留"));
  }
  // Only structured fixture decisions; this is not a language classifier.
  function canHandoff(b){return b.requestGoal==="PROMPT"&&b.status==="confirmed"&&Number.isInteger(b.revision)&&b.revision>0&&["explicit","delegated","direct_ready"].includes(b.confirmation?.kind)&&b.confirmation.revision===b.revision&&b.qcRevision===b.revision&&b.hardQC==="PASS"&&b.minimalBrief===true&&Number.isFinite(b.duration)&&b.duration>0&&b.duration<=300&&Number.isInteger(b.partCount)&&b.partCount>=Math.ceil(b.duration/15)&&(!Number.isInteger(b.taskBudget)||b.partCount<=b.taskBudget)&&b.bgm===false&&b.fabricatedAsset===false&&["none","suggest_only","planned_pair"].includes(b.transition)&&(b.transition!=="planned_pair"||b.transitionAuthorized===true);}
  const base={requestGoal:"PROMPT",status:"confirmed",revision:1,confirmation:{kind:"explicit",revision:1},hardQC:"PASS",qcRevision:1,minimalBrief:true,duration:30,partCount:2,bgm:false,fabricatedAsset:false,transition:"none"};
  const rows=[
   ["explicit",{},true],["direct-ready",{confirmation:{kind:"direct_ready",revision:1}},true],["delegated",{confirmation:{kind:"delegated",revision:1}},true],
   ["like",{status:"draft",confirmation:null},false],["ambiguous-ok",{status:"draft",confirmation:null},false],
   ["ideas",{requestGoal:"IDEAS"},false],["develop",{requestGoal:"DEVELOP"},false],["brief",{requestGoal:"BRIEF"},false],
   ["old-authorization",{revision:2,qcRevision:2},false],["stale-qc",{revision:2,confirmation:{kind:"explicit",revision:2}},false],
   ["updated-authorization",{revision:2,qcRevision:2,confirmation:{kind:"explicit",revision:2}},true],
   ["hard-fail",{hardQC:"FAIL"},false],["hard-unknown",{hardQC:"UNKNOWN"},false],["missing-brief",{minimalBrief:false},false],
   ["15s",{duration:15,partCount:1},true],["52s",{duration:52,partCount:4},true],["120s",{duration:120,partCount:8},true],["150s",{duration:150,partCount:10},true],["300s",{duration:300,partCount:20},true],["300s-with-coverage",{duration:300,partCount:24,taskBudget:24},true],["301s",{duration:301,partCount:21},false],
   ["extra-coverage",{duration:120,partCount:9},true],["user-cap",{duration:120,partCount:9,taskBudget:8},false],["wrong-count",{duration:52,partCount:3},false],["bgm",{bgm:true},false],["fabricated-asset",{fabricatedAsset:true},false],
   ["suggest-only",{transition:"suggest_only",transitionAuthorized:false},true],["unauthorized-pair",{transition:"planned_pair",transitionAuthorized:false},false],["authorized-pair",{transition:"planned_pair",transitionAuthorized:true},true],["invalid-transition",{transition:"magic"},false]
  ];
  for(const [id,patch,want] of rows)check("structured:"+id,canHandoff({...base,...patch})===want);
 }else throw Error("unknown regression group");
 return {group,checks:results.length,passed:results.length-failures.length,failures};
}
const groups={
  "library": [
    "references/creative/genre_library.md",
    "references/creative/micro_story_structures.md",
    "references/creative/creative_seed_library.md",
    "references/creative/character_interaction_library.md",
    "references/creative/emotional_arc_library.md",
    "references/creative/creative_director.md",
    "references/creative/collaborative_discussion.md",
    "references/creative/creative_combination_engine.md",
    "references/creative/creative_brief.md",
    "references/creative/creative_quality_control.md"
  ],
  "integration": [
    "SKILL.md",
    "SKILL.cn.md",
    "README.md",
    "meta.yaml",
    "references/director_strategy.md",
    "docs/design-v2.1-creative-engine.md",
    "docs/implementation-plan-v2.1-creative-engine.md",
    "tests/creative-cases.md",
    "tests/qc-check.mjs",
    "examples/creative/zero_idea_discussion.md",
    "examples/creative/character_reference_ideation.md",
    "examples/creative/vague_idea_expansion.md",
    "examples/creative/creative_brief_to_director.md"
  ]
};
for(const [group,paths] of Object.entries(groups)){
 const files=Object.fromEntries(paths.map(p=>[p,readFileSync(new URL("../"+p,import.meta.url),"utf8")]));
 const lf=runCreativeQC(files,group);
 const crlf=runCreativeQC(Object.fromEntries(Object.entries(files).map(([p,c])=>[p,c.replace(/\r?\n/g,"\r\n")])),group);
 const equivalent=JSON.stringify(lf)===JSON.stringify(crlf);
 console.log(JSON.stringify({lf,crlf,equivalent},null,2));
 if(lf.failures.length||crlf.failures.length||!equivalent)process.exitCode=1;
}
