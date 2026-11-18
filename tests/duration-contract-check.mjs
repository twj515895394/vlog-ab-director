// Repository-wide duration contract lint. Node.js 18+, no dependencies.
// Historical design/implementation records are explicitly non-runtime.
// Targeted pattern regression, not a semantic proof of every possible wording.
import {readFileSync,readdirSync} from "node:fs";
import {join,relative} from "node:path";
import {fileURLToPath} from "node:url";
function scanDurationFile(path,raw){
 const s=raw.replace(/\r\n/g,"\n"),failures=[];
 const archive=new Set(["docs/design-v2-director-engine.md","docs/design-v2.1-creative-engine.md","docs/implementation-plan-v2.md","docs/implementation-plan-v2.1-creative-engine.md"]);
 if(archive.has(path)){
   if(!s.split("\n").slice(0,5).join("\n").includes("v2.2")||!s.split("\n").slice(0,5).join("\n").includes("历史"))failures.push({path,line:1,reason:"historical design/plan must have explicit supersession notice"});
   // Historical original decisions are preserved, not runtime requirements.
   return failures;
 }
 if(path==="tests/duration-contract-check.mjs")return failures;
 const rules=[
  ["legacy-duration-cap",/(?:最长|最大|最多|不得超过|不超过|不大于|不得大于|仅支持|只支持|限制为|上限(?:为|是)?|少于或等于|小于等于)\s*(?:成片(?:时长)?\s*)?(?:120\s*(?:秒|s\b)|(?:两|二|2)\s*(?:分钟|min\b))/i],
  ["legacy-duration-cap-reverse",/(?:120\s*(?:秒|s\b)|(?:两|二|2)\s*(?:分钟|min\b))\s*(?:是|为|作为)?\s*(?:成片(?:的)?\s*)?(?:最大时长|最长时长|时长上限|成片上限|上限)/i],
  ["legacy-task-cap",/(?:最多|最长|不得超过|不超过|上限(?:为|是)?|仅支持|只支持)\s*(?:8|八)\s*(?:个|段|个独立|Part\b|parts\b|independent)/i],
  ["legacy-task-range",/\b(?:1|2|3)\s*[-–—~～至到]\s*8\s*(?:个独立|个\s*15\s*秒|Part\b|parts\b|段\s*(?:规划|预算|生成|装配))/i],
  ["legacy-duration-scope",/(?:适用|定位|范围|支持|成片规划|时长上限).{0,12}(?:15|30|45)\s*[-–—~～至到]\s*120\s*(?:秒|s\b)/i],
  ["legacy-duration-code",/(?:target(?:_final_s)?|duration(?:_target_s)?|targetFinalS|finalDuration|b\.duration)\s*(?:<=|≤|>=|≥|>|<)\s*120(?:000)?\b/i],
  ["legacy-task-code",/(?:partCount|part_count|maxTasks|taskCount|coreParts|N|parts\.length)\s*(?:<=|≤)\s*8\b/i],
  ["legacy-range-english",/(?:up to|maximum(?: of)?|at most|no more than|limited to)\s*(?:120\s*(?:s\b|seconds?)|2\s*(?:minutes?)|eight\s+(?:independent|parts?|tasks?)|8\s+(?:independent|parts?|tasks?))/i]
 ];
 for(const [i,l] of s.split("\n").entries()){
   // Known regression detector contains obsolete strings deliberately.
   if(path==="tests/editing-check.mjs"&&l.includes('check(p+":legacy-no-cap"'))continue;
   // Narrowly scoped historical record or negation, not an active directive.
   if(/历史设计记录|历史v2\.1实施证据|历史v2实施证据|历史2–8 Part handoff示例|原2–8 Part连续边界示例|原120秒\/8任务不是现行限制|原120秒\/8任务只为历史基线|原120秒及8任务为历史固定预算兼容例|1–8段预算，素材\/净时长分离/.test(l))continue;
   if(/旧120\/8限制迁移|120s\/8 段的旧上限|不是现行限制|非现行约束/.test(l)&&path.startsWith("docs/"))continue;
   const plain=l.replace(/[*`_]/g,"");
   for(const [reason,re] of rules)if(re.test(plain)||re.test(l))failures.push({path,line:i+1,reason,excerpt:l.slice(0,240)});
 }
 return failures;
}
function runDurationFixtures(){
 const inputs=[
  ["### 120 秒是成片最大时长",true],
  ["**最长成片不超过 120 秒**",true],
  ["适用：15–120 秒的多 Part Vlog",true],
  ["最多八个独立15秒任务",true],
  ["支持 3–8 Part 的长片规划",true],
  ["成片上限为2分钟",true],
  ["target_final_s<=120",true],
  ["partCount<=8",true],
  ["up to eight independent 15s tasks",true],
  ["成片上限300秒，独立15秒任务",false],
  ["120秒固定8任务兼容案例",false],
  ["120秒成片需要额外补镜",false],
  ["20任务只是无损下界，不是硬上限",false],
  ["15秒固定8个英语单词不是任务数量",false],
  ["60–120秒2–5章（完整故事）",false],
  ["300秒24任务，有限素材预算",false]
 ];
 const failures=inputs.flatMap(([line,expected])=>[false,true].map(crlf=>({line,crlf,expected,actual:scanDurationFile("references/fixture.md",line+(crlf?"\r\n":"\n")).length>0})).filter(x=>x.actual!==expected));
 return {checks:inputs.length*2,passed:inputs.length*2-failures.length,failures};
}
const root=fileURLToPath(new URL("../",import.meta.url));
function walk(dir){
 return readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  const p=join(dir,e.name);
  if(e.isDirectory())return [".git","node_modules"].includes(e.name)?[]:walk(p);
  return e.isFile()&&/\.(?:md|ya?ml|mjs|js|json|txt)$/i.test(e.name)?[p]:[];
 });
}
const paths=walk(root).sort();
const failures=paths.flatMap(p=>scanDurationFile(relative(root,p).split("\\").join("/"),readFileSync(p,"utf8")));
const fixtures=runDurationFixtures();
console.log(JSON.stringify({files:paths.length,failures,fixtures},null,2));
if(failures.length||fixtures.failures.length)process.exitCode=1;
