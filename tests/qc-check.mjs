// T06 fixture regression; Node.js 18+; no dependencies.
// Does not judge arbitrary natural-language prompts or actual video quality.
import { readFileSync } from "node:fs";
function runQC(files) {
 const fields=["subject_definitions","summary","retention_analysis","detailed_description","overall_soundscape","non_diegetic_music"];
 const neg="【禁止项】\n\n文字/UI/水印/Logo/角标/可读文字/真实UI\n\n【强制声明】\n\n无背景音乐,仅保留环境音与人声和音效;画面禁字幕/文字/水印/Logo;禁止可读文字(指画面字幕文字,不含人声台词)";
 const exception="【禁止项】\n\n生成字幕/浮层文字/UI/水印/Logo/角标/虚假UI；非指定实体上的可读文字\n\n【强制声明】\n\n无背景音乐,仅保留环境音与人声和音效;禁止画面叠加字幕/文字/水印/Logo;仅允许镜头中明确指定的实体场景文字，不将人声台词生成字幕";
 const specs=[
 ["templates/template_15s_single.md",1,"Classic",1],
 ["templates/template_30s_twopart.md",2,"Classic",2],
 ["templates/template_15s_adaptive.md",1,"Adaptive",0],
 ["templates/template_30s_adaptive_twopart.md",2,"Adaptive",2],
 ["templates/template_15s_cinematic.md",1,"Cinematic",0],
 ["templates/template_multipart_15s_sequence.md",8,"Cinematic",0]];
 const blocks=s=>[...s.matchAll(/^```text\s*\n([\s\S]*?)^```[ \t]*$/gm)].map(m=>m[1].trimEnd());
 const results=[], errors=[];
 function assert(id,pass,detail){results.push({id,pass:!!pass,detail});if(!pass)errors.push({id,detail});}
 function inspect(b,mode,uploadCount,allowText=false){
  const parts=[...b.matchAll(/^([a-z_]+):[ \t]*$/gm)];
  const values={};parts.forEach((x,i)=>values[x[1]]=b.slice(x.index+x[0].length,parts[i+1]?.index??b.length).trim());
  const desc=values.detailed_description??"";
  const rows=desc.split("\n").filter(x=>/^\[Shot \d+\]/.test(x));
  const shots=rows.map((l,k)=>({id:+l.match(/^\[Shot (\d+)\]/)[1],start:k===0?(/^\[Shot 1\] 0\.000–/.test(l)?0:NaN):Number(l.match(/At 00:(\d+\.\d{3})/)?.[1]),end:Number(l.match(/(?:–|至)00:(\d+\.\d{3})/)?.[1]),mode:l.match(/(?:：|TO:\s*)([AB])\d/)?.[1]}));
  const msec=x=>Math.round(x*1000);
  const ids=[...b.matchAll(/<Picture (\d+)>/g)].map(m=>+m[1]);
  const malformed=/<Picture\b(?! \d+>)/.test(b);
  const sound=(values.overall_soundscape??"").replace(/整个声场不含背景音乐。|没有背景音乐。|不含背景音乐。|无背景音乐[。；;，,]?|无\s*BGM[。；;，,]?/gi,"");
  const noPositiveMusic=!/(?:BGM|配乐|背景音乐|钢琴|旋律|background music|soundtrack)/i.test(sound)&&!/(?:加入|添加|播放|生成|搭配|伴随|使用)(?:轻柔|舒缓|温暖|动感|一点|一段|一首|轻快|的|\s)*(?:BGM|背景音乐|配乐|钢琴曲)|(?:add|play|generate|include)\s+(?:soft\s+)?(?:background music|BGM|soundtrack)/i.test(b.replace(neg,"").replace(exception,"").replace(/不(?:要|得|可|能|允许|请求|添加|生成)[^。；;\n]{0,30}(?:背景音乐|BGM|配乐)/gi,""));
  const tags=[...b.matchAll(/<\/?d>/g)].map(x=>x[0]);
  let paired=true,level=0;for(const t of tags){level+=t==="<d>"?1:-1;if(level<0||level>1)paired=false;}
  return {
   H06_fields:JSON.stringify(parts.map(x=>x[1]))===JSON.stringify(fields)&&fields.every(f=>!!values[f])&&parts[0]?.index===0,
   H06_placeholders:[...b.matchAll(/\[[^\]\n]+\]/g)].every(x=>/^\[(?:Shot \d+|Chinese|English|Japanese|Korean|French|Spanish|German|reference generation)\]$/.test(x[0]))&&!/(?:其余同上|其余略|后续.*依此类推|same as above)/i.test(b),
   H01_timeline:shots.length>0&&shots.every((x,k)=>x.id===k+1&&Number.isFinite(x.start)&&Number.isFinite(x.end)&&msec(x.start)===(k?msec(shots[k-1].end):0)&&msec(x.end)>msec(x.start)&&["A","B"].includes(x.mode))&&msec(shots.at(-1).end)===15000,
   H12_classic:mode!=="Classic"||shots.map(x=>x.mode).join("")==="ABABAB"&&shots.every(x=>msec(x.end)-msec(x.start)===2500),
   H02_refs:!malformed&&ids.every(n=>n>=1&&n<=uploadCount)&&(uploadCount===0?!b.includes("[reference generation]")&&!ids.length:b.includes("[reference generation]")),
   H07_dialogue_tags:paired&&level===0&&[...b.matchAll(/<d>([\s\S]*?)<\/d>/g)].every(x=>/^\[[^\]\n]+\]\s+\S/.test(x[1])),
   H08_negative:allowText?desc.includes(exception)&&!desc.includes(neg):desc.includes(neg)&&!desc.includes(exception),
   H09_no_bgm:values.non_diegetic_music==="N/A"&&noPositiveMusic
  };
 }
 // Sequential no-reuse fixture; parts is the explicitly budgeted list; ED regression handles EDL/reuse.
 function budget(target,parts,overlap=0,maxTasks=parts.length){
  const range=Number.isFinite(target)&&target>0&&target<=300&&Array.isArray(parts)&&Number.isInteger(maxTasks)&&parts.length>0&&parts.length<=maxTasks&&parts.every(p=>p.length===2&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&p[0]>=0&&p[1]<=15&&p[1]>p[0])&&Number.isFinite(overlap)&&overlap>=0;
  if(!range)return {valid:false,net:null,conflict:true};
  const retained=parts.reduce((n,[a,b])=>n+b-a,0);
  if(overlap>retained||overlap>(parts.length===1?0:retained-Math.max(...parts.map(([a,b])=>b-a))))return {valid:false,net:null,conflict:true};
  const net=Math.round((retained-overlap)*1000)/1000;
  return {valid:true,net,conflict:Math.abs(net-target)>0.0005};
 }
 function boundary(b){
  if(b.decision==="none"||b.decision==="suggest_only")return b.modified===false&&b.handoff===true;
  return b.decision==="planned_pair"&&b.authorized===true&&b.modified===true&&b.handoff===true&&["outgoing","incoming","cut_basis","matching","risk","fallback","budget"].every(k=>typeof b[k]==="string"&&b[k].trim())&&(!b.outDirection||b.outDirection===b.inDirection);
 }
 function state(s){
  const positions=Object.values(s.hands??{}).flat().filter(Boolean);
  const validHands=Object.values(s.hands??{}).every(a=>Array.isArray(a)&&a.filter(Boolean).length<=1);
  const unique=new Set([...positions,...Object.values(s.anchors??{}).flat()]).size===positions.length+Object.values(s.anchors??{}).flat().length;
  return validHands&&unique&&(!s.noPhone||!positions.includes("phone"))&&(!s.changed||typeof s.event==="string"&&!!s.event.trim());
 }
 function voices(events){
  return events.every((x,i)=>x.speaker&&x.start>=0&&x.end<=15&&x.end>x.start&&(["sync_lips","closed_lips","not_visible"].includes(x.lips))&&(x.kind==="vo"?x.lips!=="sync_lips":x.kind==="speech"?x.lips!=="closed_lips":false)&&!events.some((y,j)=>i!==j&&x.speaker===y.speaker&&x.start<y.end&&y.start<x.end&&x.lips!==y.lips));
 }
 let promptCount=0,shotCount=0;
 for(const [path,n,mode,refs] of specs){
  const bs=blocks(files[path]);assert("fixture-count:"+path,bs.length===n,`${bs.length}/${n}`);
  bs.forEach((b,i)=>{promptCount++;shotCount+=(b.match(/^\[Shot \d+\]/gm)||[]).length;Object.entries(inspect(b,mode,refs)).forEach(([k,v])=>assert(`${path}#${i+1}:${k}`,v,k));});
 }
 const a=blocks(files[specs[0][0]])[0],b=blocks(files[specs[2][0]])[0];
 for(const [template,example] of [[specs[0][0],"examples/classic-ab-15s.md"],[specs[1][0],"examples/classic-ab-30s.md"]])assert("classic-frozen:"+template,JSON.stringify(blocks(files[template]))===JSON.stringify(blocks(files[example])),"exact frozen text");
 const mutations=[
 ["gap",a.replace("At 00:02.500","At 00:02.600"),"Classic",1,"H01_timeline"],
 ["overlap",a.replace("At 00:02.500","At 00:02.400"),"Classic",1,"H01_timeline"],
 ["late-end",a.replace("至00:15.000","至00:15.001"),"Classic",1,"H01_timeline"],
 ["local-not-zero",a.replace("[Shot 1] 0.000","[Shot 1] 15.000"),"Classic",1,"H01_timeline"],
 ["wrong-mode",a.replace("TO: B1","TO: A1"),"Classic",1,"H12_classic"],
 ["classic-five",b,"Classic",0,"H12_classic"],
 ["unknown-ref",a.replaceAll("<Picture 1>","<Picture 3>"),"Classic",1,"H02_refs"],
 ["no-image-fake",b.replace("S1 是","<Picture 1> S1 是"),"Adaptive",0,"H02_refs"],
 ["zero-ref",a.replaceAll("<Picture 1>","<Picture 0>"),"Classic",1,"H02_refs"],
 ["missing-field",a.replace("summary:",""),"Classic",1,"H06_fields"],
 ["extra-field",a.replace("summary:","state_machine:\nx\n\nsummary:"),"Classic",1,"H06_fields"],
 ["empty-field",a.replace(/summary:\n[\s\S]*?\nretention_analysis:/,"summary:\n\nretention_analysis:"),"Classic",1,"H06_fields"],
 ["placeholder",b.replace("S1 是","[场景名称] S1 是"),"Adaptive",0,"H06_placeholders"],
 ["omission",b.replace("S1 是","其余同上。S1 是"),"Adaptive",0,"H06_placeholders"],
 ["broken-dialogue",a.replace("</d>",""),"Classic",1,"H07_dialogue_tags"],
 ["music-field",a.replace(/N\/A$/,"piano music"),"Classic",1,"H09_no_bgm"],
 ["music-in-sound",b.replace("overall_soundscape:\n","overall_soundscape:\n加入轻柔背景音乐。"),"Adaptive",0,"H09_no_bgm"],
 ["music-in-shot",b.replace("detailed_description:\n","detailed_description:\n播放背景音乐。"),"Adaptive",0,"H09_no_bgm"],
 ["missing-negative",b.replace(neg,""),"Adaptive",0,"H08_negative"],
 ["unapproved-text-exception",b.replace(neg,exception),"Adaptive",0,"H08_negative"]
 ];
 for(const [id,p,mode,n,k] of mutations)assert("negative:"+id,!inspect(p,mode,n)[k],k);
 assert("positive:authorized-text-exception",inspect(b.replace(neg,exception),"Adaptive",0,true).H08_negative,"explicit permission");
 assert("positive:unused-upload",inspect(a,"Classic",2).H02_refs,"unused upload is not hard error");
 const paired={decision:"planned_pair",authorized:true,modified:true,handoff:true,outgoing:"right whip",incoming:"right whip",cut_basis:"blur peak",matching:"same direction",risk:"M",fallback:"hard cut",budget:"pending trim",outDirection:"right",inDirection:"right"};
 const semantic=[
 ["budget-3-to-8",[45,60,75,90,105,120].every(t=>{const q=budget(t,Array.from({length:t/15},()=>[0,15]));return q.valid&&!q.conflict})],
 ["budget-52",budget(52,[[0,13],[1,14],[1,14],[2,15]]).net===52&&!budget(52,[[0,13],[1,14],[1,14],[2,15]]).conflict],
 ["budget-120-trim",budget(120,Array.from({length:8},(_,i)=>[0,i===7?14:15])).net===119&&budget(120,Array.from({length:8},(_,i)=>[0,i===7?14:15])).conflict],
 ["budget-over-limit",!budget(301,Array.from({length:21},()=>[0,15])).valid],
 ["budget-150-sequential",budget(150,Array.from({length:10},()=>[0,15])).valid&&!budget(150,Array.from({length:10},()=>[0,15])).conflict],
 ["budget-300-continuous",budget(300,Array.from({length:20},()=>[0,15])).net===300],
 ["budget-300-coverage",budget(300,Array.from({length:24},()=>[1,13.5])).net===300],
 ["budget-user-cap",!budget(300,Array.from({length:24},()=>[1,13.5]),0,20).valid],
 ["budget-overlap",budget(30,[[0,15],[0,15]],1).net===29&&budget(30,[[0,15],[0,15]],1).conflict],
 ["boundary-none",boundary({decision:"none",modified:false,handoff:true})],
 ["boundary-suggest",boundary({decision:"suggest_only",modified:false,handoff:true})],
 ["boundary-suggest-mutation",!boundary({decision:"suggest_only",modified:true,handoff:true})],
 ["boundary-pair",boundary(paired)],
 ["boundary-no-auth",!boundary({...paired,authorized:false})],
 ["boundary-missing-incoming",!boundary({...paired,incoming:""})],
 ["boundary-mismatch-direction",!boundary({...paired,inDirection:"left"})],
 ["boundary-no-handoff",!boundary({decision:"none",modified:false,handoff:false})],
 ["state-legal",state({hands:{right:["phone"],left:["map"]},anchors:{bucket:["umbrella"]}})],
 ["state-double-hand",!state({hands:{right:["phone","coffee"],left:[]}})],
 ["state-duplicate-prop",!state({hands:{left:["map"]},anchors:{table:["map"]}})],
 ["state-ancient",state({noPhone:true,hands:{left:["fan"],right:["tea"]}})],
 ["state-ancient-phone",!state({noPhone:true,hands:{right:["phone"]}})],
 ["state-unexplained-change",!state({hands:{left:[]},changed:true})],
 ["state-legal-event",state({hands:{left:[]},anchors:{bag:["map"]},changed:true,event:"store map in bag"})],
 ["voice-cn-vo",voices([{speaker:"S1",kind:"vo",lips:"closed_lips",start:1,end:3}])],
 ["voice-contradiction",!voices([{speaker:"S1",kind:"vo",lips:"sync_lips",start:1,end:3}])],
 ["voice-overlap-conflict",!voices([{speaker:"S1",kind:"speech",lips:"sync_lips",start:1,end:3},{speaker:"S1",kind:"vo",lips:"closed_lips",start:2,end:4}])],
 ["voice-missing-speaker",!voices([{kind:"vo",lips:"closed_lips",start:1,end:3}])],
 ["voice-two-speakers",voices([{speaker:"S1",kind:"speech",lips:"sync_lips",start:0,end:2},{speaker:"S2",kind:"speech",lips:"sync_lips",start:2,end:4}])],
 ["voice-no-dialogue",voices([])]
 ];
 semantic.forEach(([id,v])=>assert("structured:"+id,v,"deterministic fixture; not natural language classifier"));
 return {promptCount,shotCount,checks:results.length,passed:results.length-errors.length,failures:errors,negativeCases:mutations.length,structuredCases:semantic.length,classicFrozen:true};
}
const paths=[
  "templates/template_15s_single.md",
  "templates/template_30s_twopart.md",
  "templates/template_15s_adaptive.md",
  "templates/template_30s_adaptive_twopart.md",
  "templates/template_15s_cinematic.md",
  "templates/template_multipart_15s_sequence.md",
  "examples/classic-ab-15s.md",
  "examples/classic-ab-30s.md"
];
// Normalize checkout line endings before exact block comparisons and mutations.
const files=Object.fromEntries(paths.map(p=>[p,readFileSync(new URL("../"+p,import.meta.url),"utf8").replace(/\r\n/g,"\n")]));
const report=runQC(files);
console.log(JSON.stringify(report,null,2));
if(report.failures.length)process.exitCode=1;
