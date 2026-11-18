# v2.1 Creative Engine 实施计划

> 历史v2.1实施证据：当前300秒与三种叙事组织见 [v2.2实施计划](implementation-plan-v2.2-editing-director.md)，不以历史120秒/8任务为现行限制。历史静态测试结果不改写。

> 基于 [详细设计](design-v2.1-creative-engine.md)，设计提交 1395b0ab2df3c77c31f5341119af78d21eeb5b9c；原基线 67de77323ec096335408d19d53570ca3f8bcec11。用户已要求先设计、再计划、再一次性实施。保留 v2 T01–T06、Windows CRLF 修复与正式版本 1.0.0。

## 1. 工作分解与验收

| Ticket | 前置 | 实施交付 | 完成标准 |
|---|---|---|---|
| CE00 | 设计 | 设计与计划，核对 main 当前基线 | 设计/计划先提交；不覆盖旧QC |
| CE01 | CE00 | creative_director.md、collaborative_discussion.md | 四入口×五交付意图；多轮状态、反馈协议；确认不等于偏好；快路径、重新打开 |
| CE02 | CE00 | genre_library.md、micro_story_structures.md、creative_seed_library.md、character_interaction_library.md、emotional_arc_library.md | ≥12题材、≥10结构、≥24种子、≥8关系、≥10情绪；稳定ID，人物主体和生成风险 |
| CE03 | CE01/02 | creative_combination_engine.md | 约束过滤→组合→差异审查→候选，默认3–5；无固定故事/冲突，用户反馈和排除项可追踪 |
| CE04 | CE01/03 | creative_brief.md、creative_quality_control.md | 简案确认、版本门禁、T01字段映射、9硬10软；拒绝虚假资产/BGM/无授权转场；导演发现核心冲突返回创意 |
| CE05 | CE01–04 | SKILL.md/SKILL.cn.md、director_strategy.md、README.md、meta.yaml、变更记录 | 创意入口在 T01 前，确认前无最终Prompt；直接生成兼容；仅创意时停止；默认Prompt输出不变；版本仍1.0.0 |
| CE06 | CE05 | examples/creative/* 四类示例、tests/creative-cases.md、tests/creative-check.mjs | 完整多轮对话和至少一个确认到H3完整交接；正反例；可重复结构和规则检查；CRLF/LF兼容 |
| CE07 | CE06 | 回读运行、实施进度、验收记录 | 原v2 QC核心/CLI与新增QC通过，冻结基线不变；真实载入Skill/H3未执行时标NOT_RUN；不发正式release |

## 2. 执行顺序与文件边界

先设计和计划；CE01–CE04 参考模块按依赖落地；CE05 再改入口；CE06 写样例、测试；CE07 按当前真实仓库执行核验并记录。不得改旧Classic冻结案例、H3六字段、T02时间引擎、T03持机/资产、T03B转场授权、T04无BGM和中文VO硬规则。旧qc-check.mjs保留CRLF修复，不替换或重写。新增文件默认Markdown与无依赖Node.js 18+脚本，不增加运行时服务。正式版本不升级。

## 3. 重点回归

- ZERO/CHARACTER_ONLY/VAGUE/READY，每类至少一个正例；仅要创意、明确直出、已有剧本、拒绝追问各自正确。
- 方向选择、仅讨论OK、明确确认、委托、核心修改后撤销旧确认、当前revision核对。
- 多轮融合与否决、排除项保留、不同候选不机械换地点；非剧情审美不强制冲突。
- 人物旅拍人物主导、关系不乱编、参考图未知不虚构、古风无手机、真实人物不编造经历。
- 15/30/52/120s 预算、超120s 边界；Classic/VO/无BGM/转场原约束不变。
- 创意QC通过不等于模型实机成功；真实行为和视频必须另行取证。

## 4. 测试方法与交付

运行 node tests/creative-check.mjs 与 node tests/qc-check.mjs。可用环境若不能运行 Node CLI，则执行回读的相同核心JS逻辑并披露区别；不能宣称本地已运行。脚本只对结构化fixture和可解析规范事实做断言，语义、多轮自然语言实际执行及H3渲染独立记录。用户的CRLF修复必须保持，新增读取同样规范化换行，另测LF/CRLF。报告实际commit、文件、通过/失败数量、未执行项目。设计选择及临时假设可追溯。

## 5. 实际实施与验收记录（2026-11-18）

| Ticket | 状态 | 实际交付 |
|---|---|---|
| CE00 | 已完成 | 详细设计 1395b0a、实施计划 94eb73c；基于用户 CRLF 修复 67de773 |
| CE01 | 已完成 | 创意入口、四种成熟度和五种交付意图、多轮讨论协议、确认版本门禁 |
| CE02 | 已完成 | 12 题材、10 叙事结构、30 种子、9 人物关系、13 情绪路径 |
| CE03 | 已完成 | 组合机制、差异化指纹、约束过滤、反馈与排除项 |
| CE04 | 已完成 | Creative Brief、T01 映射、9 HARD / 10 SOFT 创意 QC |
| CE05 | 已完成 | 中英文入口、T01 前置门禁、README、meta 描述、变更记录 |
| CE06 | 已完成 | 4 份人工共创示例（含完整独立15s H3交接）、40条行为预期、creative-check.mjs |
| CE07 | 静态回读验收完成 | 实际执行仓库回读的核心函数；真实 Skill 行为和 H3 视频仍待验证，不发布正式版本 |

### 实际执行证据

- 从 GitHub 回读 tests/creative-check.mjs（blob 70c4714152a0992f8bd1dca3a4efbb128a80ca9d）并在 JavaScript 执行环境执行其 runCreativeQC 核心函数。library 28/28、integration 51/51，共79/79项确定性断言通过；以 CRLF 重编码后再执行，79/79通过，结果与 LF 完全相同。
- 从 GitHub 回读原 tests/qc-check.mjs，blob c1e75107e2b0a85f8b8e1e0afb30ea3ec7b7ce0d，与 CRLF 修复后的基线完全相同。执行原 runQC 核心函数及原归一化口径：15份完整模板Prompt、69镜、176/176断言通过；CRLF输入重复验证176/176通过，与LF相同；Classic冻结比对通过。
- 以上为回读实际文件并执行相同核心函数的有限静态测试，**未执行 Node CLI 包装器或用户本地环境**；可在仓库根目录用 Node.js 18+ 运行 node tests/creative-check.mjs 和 node tests/qc-check.mjs 复现。40条自然语言行为用例为 NOT_RUN，人工编写的4份会话示范不是模型实际运行结果。H3视频、口型、手部、剪辑、创意主观质量与模型稳定性均未实测。
- 版本仍为 1.0.0；main 是 v2.1 Creative Engine 文本候选实现，不打正式发布标签。下一步为在实际 Skill 客户端按用例进行多轮行为验收，再使用具体 H3 部署完成原 T07 视频验收。
