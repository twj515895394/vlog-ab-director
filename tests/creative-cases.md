# 创意引擎回归矩阵（CE01–CE40）

这些是实际加载 Skill 后应运行的自然语言预期用例；目前 NOT_RUN，不能把结构化规则脚本当作自然语言运行。四份多轮人工示范见 examples/creative/。

| ID | 测试输入/情景 | 预期关键行为 | 行为状态 |
|---|---|---|---|
| CE01 | 没有创意，想拍人物轻剧情 | ZERO/DEVELOP，3–5条不同驱动力点子，停DISCUSS | NOT_RUN |
| CE02 | 只有角色参考图 | CHARACTER_ONLY，不从图推断真实身份关系；图若不可用标待提供 | NOT_RUN |
| CE03 | 雨天等待，有模糊故事 | VAGUE，保留主题，2–4种发展 | NOT_RUN |
| CE04 | 完整剧本，直接生成30s | READY/PROMPT direct_ready，最小简案直通，不重复确认 | NOT_RUN |
| CE05 | 没点子但委托直接生成 | delegated，内部构思/QC，用户已授权才进入制作 | NOT_RUN |
| CE06 | 只给10个创意 | IDEAS，尊重数量，禁止最终Prompt | NOT_RUN |
| CE07 | 给我轻剧情剧本，不要Prompt | BRIEF，停在剧本或简案 | NOT_RUN |
| CE08 | 喜欢B | 只聚焦，未确认制作 | NOT_RUN |
| CE09 | 上一轮问偏好，用户OK | 不是制作授权 | NOT_RUN |
| CE10 | 上一轮明确问定稿并制作，用户OK | 当前revision明确确认，可继续QC | NOT_RUN |
| CE11 | 合并A和B | 新ID/来源，形成单一主线，不硬拼两个完整情节 | NOT_RUN |
| CE12 | 两条都不喜欢，不要咖啡 | 排除咖啡，切换核心驱动力重新发散 | NOT_RUN |
| CE13 | 只改结尾，其他不变 | 保留人物/世界/关系，修订简案 | NOT_RUN |
| CE14 | 已确认古风改现代 | 旧revision失效，重检，未重新授权不出Prompt | NOT_RUN |
| CE15 | 改核心并明确按新版本直接出成品 | 当前新revision授权，不重复确认 | NOT_RUN |
| CE16 | 修改已有Prompt的光线 | 不改创意核心，直接现有导演层复核 | NOT_RUN |
| CE17 | 人物旅拍 | 地点/美景服务人物体验，不堆无人物镜 | NOT_RUN |
| CE18 | 纯审美人物展示 | 非剧情合法，不强行添加冲突/反转/口播 | NOT_RUN |
| CE19 | 没有说明两个人关系 | 虚构建议明确假设，不当事实或默认恋人 | NOT_RUN |
| CE20 | 主角是具体真实人物 | 仅用用户提供事实或明确虚构，不编纪实经历 | NOT_RUN |
| CE21 | 古风无现代手机 | 遵守世界观，主观非手机路径 | NOT_RUN |
| CE22 | 两候选只换地点服装 | 近重复，应重组机制与驱动力 | NOT_RUN |
| CE23 | 明确要求同机制不同结尾 | 允许结构近似，重点结尾差异 | NOT_RUN |
| CE24 | 15秒多线剧情和长台词 | 缩减创意或指出冲突，不无告知删锁定台词 | NOT_RUN |
| CE25 | 52s人物旅行 | 4独立15s任务预算，净长T02核算 | NOT_RUN |
| CE26 | 120s人物短片 | 最多8独立任务，普通硬切合法 | NOT_RUN |
| CE27 | 150s成片 | 说明上限，不承诺一次或9段生成 | NOT_RUN |
| CE28 | 用户要求音乐混剪 | 生成无BGM，后期音乐提示外置 | NOT_RUN |
| CE29 | 仅建议水面穿越 | suggest_only，不修改原Prompt，不默认授权 | NOT_RUN |
| CE30 | 温室角色图待上传 | needed，不生成虚构Picture引用 | NOT_RUN |
| CE31 | 明确Classic六镜 | 即便G06审美，原T01用户锁定优先，6×2.5s | NOT_RUN |
| CE32 | 中文画外心声闭嘴 | 不强制英文短语，保持T04规则 | NOT_RUN |
| CE33 | 已定稿但只要创意简案 | confirmed/BRIEF，仍不进入H3 | NOT_RUN |
| CE34 | 已授权r1却交付r2 | 拒绝旧确认；重检与授权 | NOT_RUN |
| CE35 | 讨论阶段提供详细节拍预览 | 合法，但不得假装最终H3交付 | NOT_RUN |
| CE36 | 用户明确纯景内容 | 非核心范围可按原导演引擎支持，不硬添人物 | NOT_RUN |
| CE37 | 用户明确锁定剧情而导演层认为不可行 | 仅改可逆执行；核心冲突回REOPEN | NOT_RUN |
| CE38 | 相同可读文字需求 | Mirror原H3 Adapter实体文字例外，禁止字幕/UI | NOT_RUN |
| CE39 | 用户明确选择生成前复核 | 当前确认+制作意图+硬QC全部成立 | NOT_RUN |
| CE40 | 未实际运行Skill/H3 | 记录NOT_RUN，禁止伪报通过率 | NOT_RUN |

## 可重复静态检查

Node.js 18+，无依赖：node tests/creative-check.mjs；再执行 node tests/qc-check.mjs。新脚本检查资料库数量与稳定ID、两入口先创意门禁后T01、文档引用、结构化确认/时长/素材门禁正反例、完整交接示范六字段/局部时间、CRLF归一化。它不自动理解自然语言或判断实际视频。旧脚本保留用户的CRLF修复。
