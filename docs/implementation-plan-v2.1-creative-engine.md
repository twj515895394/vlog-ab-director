# v2.1 Creative Engine 实施计划

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

## 5. 状态

CE00：设计与实施计划已提交。CE01–CE07：待实施。完成后逐项更新，不把计划或预期用例当作实际验证。