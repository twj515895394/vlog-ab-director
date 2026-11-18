# T03B 可选创意转场导演：边界决策与双端镜头回归矩阵

> **静态文本预期/规则核对，不是可直接执行的测试脚本，也不是 MiniMax H3 生成视频通过报告。**  
> 规范：[transition_director.md](../references/transition_director.md)；46 技巧库：[transition-techniques-library-v2.md](../docs/transition-techniques-library-v2.md)。  
> 内部案例：[transition_boundary_examples.md](../templates/transition_boundary_examples.md)；上游 [continuity_handoff.md](../references/continuity_handoff.md)、[timing_engine.md](../references/timing_engine.md)。

## 1. 决策与评价口径

- `PASS`：该边界决策与输出符合用户授权、故事适配、T01/T02/T03 和 D3/D5。
- `FAIL / HARD`：强制添加特殊技巧、未授权改 Prompt、未配对镜头、违反手/道具状态、时间/参考图约束等。
- `REVIEW`：叙事动因或匹配可能不足，优先不给特殊技巧；应说明风险而不是保证效果。
- **正常硬切（none）是完全正确的结果**。不能通过「每两个 Part 是否有一次转场」统计成功率。
- 当前规则做静态一致性检查；真正加载 Skill 的语言模型路由表现、真实素材可用性与 H3 生成结果仍需后续验证。

## 2. 逐场景测试用例

| ID | 用户/场景输入 | 预期决策或断言 | 结果级别 | 对应机制 |
|---|---|---|---|---|
| X01 | 30s 同客厅连贯对白 | `none`，不要打断对白或情绪 | PASS | 正常硬切优先 |
| X02 | 90s 治愈慢节奏、无合理匹配物 | 所有边界可 `none`；不必硬塞技巧 | PASS | 数量不强制 |
| X03 | 120s 八 Part、七个边界全是正常剪切 | 7×`none` 合法，仍保留 7 份 T03 handoff | PASS | 长片边界 |
| X04 | 用户明确「不要任何神转场」 | 所有边界 `none`；不能附加已应用的甩镜镜头 | PASS | 用户约束优先 |
| X05 | 用户只说「看看有哪些合适的转场」 | 如有叙事价值可 `suggest_only`，**不能直接改原 Prompt** | PASS | 默认建议不实施 |
| X06 | 60s 街头→树林，真实树干可双端遮挡 | 推荐 `OC02`、`suggest_only`，在 Prompt 外建议双端拍法 | PASS | 前景擦镜 |
| X07 | X06 的树干只盖住很小一角 | 不当作可靠满幅遮挡，优先 `none` 或标不可用 | PASS | OC 物理可行性 |
| X08 | 用户只要建议，但 P2 尾镜已被偷偷改成撞树干 | **FAIL**，应保留原尾镜 | FAIL / HARD | 建议不得篡改 |
| X09 | 用户明确「就用树干遮挡」且两端镜头可调整 | `planned_pair`，两端镜头 + 满幅剪点 + T03 handoff | PASS | 用户采纳 |
| X10 | 用户明确委托「有合适的技巧你直接安排」 | 可在真正适合的边界 `planned_pair`，不适合的仍 `none` | PASS | 委托授权 |
| X11 | 同一 120s 片每个 Part 都硬性分配一次神转场 | **FAIL**，数量规则违规 | FAIL / HARD | D5 不强制 |
| X12 | 用户指定 `CM01` 水平甩镜且可行 | 两端同向运动和速度相近，切在真实模糊峰值 | PASS | 运镜匹配 |
| X13 | `CM01` 前 Part 向右甩、后 Part 向左甩却声称无缝 | **FAIL**，未解释方向冲突 | FAIL / HARD | 方向一致 |
| X14 | `CM05` 高速环绕，人物/手部复杂且两端无法对齐 | 不承诺可行；`none` 或仅风险建议 | REVIEW | 高风险回退 |
| X15 | 用户要求水池穿越海岸，明确授权，有匹配水纹 | `PT01` `planned_pair`，两端镜头、气泡/水纹覆盖点、风险 H、回退 | PASS | 双端空间穿越 |
| X16 | `PT01` 只设计出镜「沉入水池」而没有下一段首镜 | **FAIL**，缺 `incoming_shot` | FAIL / HARD | 双端必须存在 |
| X17 | `PT01` 要求角色危险潜水以完成镜头 | **FAIL**，改成摄影机安全接近水面 | FAIL / HARD | 安全可行性 |
| X18 | PT01 两个独立任务保证自动一镜到底 | **FAIL**，不得虚构 H3 跨任务能力 | FAIL / HARD | 独立任务 |
| X19 | PT01 水纹不匹配、没有可用参照 | 提供 `GM03` 水纹匹配或普通硬切回退 | PASS | 风险/回退 |
| X20 | 用户未指定片尾口播，但视频是安静人物电影感 | `none` 或轻微构图匹配；不强行高速甩镜 | PASS | 情绪节奏 |
| X21 | 圆形杯口→水波纹圆环，有真实画面连接 | 可 `GM01` `suggest_only`；不是杯子真实魔法变形 | PASS | 图形匹配 |
| X22 | 想用可下载的交叉叠化/闪白插件作为「神转场」 | 不推荐此类软件模板特效，改找真实拍摄/剪辑技巧或 `none` | PASS | 技法边界 |
| X23 | 仅使用 `OT06` 环境音先入就声称完成摄影神转场 | **FAIL**，音频接力只能辅助画面 | FAIL / HARD | 声画语义 |
| X24 | 正常硬切，但保留环境 Foley 与自然口播 | 合法 `none`，生成依然无 BGM | PASS | 声音保持 |
| X25 | 甩镜建议导致在 H3 Prompt 生成背景音乐 | **FAIL**，`non_diegetic_music: N/A` 必须保持 | FAIL / HARD | D3 无 BGM |
| X26 | 用户指定 Classic 6×2.5s 且尾/首镜已锁定 | 不新增镜头、不改时点；不兼容时 `suggest_only` 或 `none` | PASS | Classic 不回归 |
| X27 | 为实现 Classic 转场增加第七镜或改时点 | **FAIL**，不得破坏旧六镜 | FAIL / HARD | v1 兼容 |
| X28 | 计划 `planned_pair`，但两端故事状态无 handoff 事件而道具瞬移 | **FAIL**，重新执行 T03 状态检查 | FAIL / HARD | 物理连续性 |
| X29 | P3 当前上传只有角色 A + 海岸 C，却引用全局 `<Picture 3>` | **FAIL**，本次必须按上传次序引用 `<Picture 2>` | FAIL / HARD | Per-Part 资产 |
| X30 | T2VA 没有任何参考图，但特殊转场 Prompt 引用 `<Picture 1>` | **FAIL**，不得虚构图片 | FAIL / HARD | 无图路径 |
| X31 | 8×15s 名义 120s，采纳 PT01 后必须剪掉 1s | 净长 119s；标 `LENGTH_FEASIBILITY_CONFLICT`，不能承诺 120s | PASS | 净时长核算 |
| X32 | 普通硬切／`suggest_only`，没有确认裁切动作 | 不自动扣减每个 Part 的可用时长 | PASS | 剪辑预算 |
| X33 | `planned_pair` 缺 `cut_basis` / `fallback` / `risk` | **FAIL**，必须补齐可操作剪点、风险回退 | FAIL / HARD | 配对硬 QC |
| X34 | 多镜情绪低对比柔光 Vlog | 比较 `GM02`、`OT01` 或 `none`，不机械应用 `CM01` | PASS | 风格适配 |
| X35 | 用户要求「只给建议、不应用」且指定水池技巧 | `suggest_only`；建议可能风险 H，但不得改镜头 | PASS | 授权与技巧分离 |
| X36 | 两个镜头都真实具备动作相位匹配（迈步跨门槛） | 可建议 `AC01`；用户采纳后再 `planned_pair` | PASS | Action matching |

## 3. 46 技巧 ID 清单核对

**只能使用文档已有的 ID，不编造「PT99」或未经定义的技巧。**

- OC（7）：`OC01–OC07`
- CM（8）：`CM01–CM08`
- AC（8）：`AC01–AC08`
- GM（8）：`GM01–GM08`
- PT（8）：`PT01–PT08`
- OT（7）：`OT01–OT07`

**合计 7+8+8+8+8+7=46 种**；这个数量是技巧库条目，不是「每条视频应使用的转场数」或模型实机成功次数。

## 4. 语义/静态验收步骤（非自动视频测试）

1. 列出每个相邻 Part 的 `story_boundary` 与 T03 `handoff`。核对正常硬切是否足够。
2. 确认用户偏好和授权。只要推荐就是 `suggest_only`；已明确选用且可行才是 `planned_pair`；否则 `none`。
3. 检查 `transition_id` 是否存在于 46 个技巧 ID；每条建议关联真实叙事理由、可见匹配点、模型/剪辑风险。
4. **只对 `planned_pair`** 验证 `outgoing_shot / incoming_shot / cut_basis / matching_constraints / physical_handoff / assets / edit_plan / duration_budget / risk / fallback`。
5. 两个独立 15 秒任务的局部时间轴和 T03 人物/手/道具/场景状态不能冲突。
6. 若发生实质剪辑裁切，在 T02 净时长账本中扣除；不知道损耗时注明未知而不能捏造精确时长。
7. 任何 H3 生成指令仍无 BGM，人物对白与真实口型语义不能被技巧描述覆盖。
8. 对 `none` 或 `suggest_only` **不因缺少双端镜头计划报错**；不过普通 handoff 仍需存在。
9. 不把静态规则核对当作「模型已按此路由」「视频已无缝」的实际执行证据。

## 5. 阶段性验收边界

- **已交付（T03B 文本 Skill）**：可选场景决策规则、46 技巧检索范围、已选用双端镜头契约、编辑净时长与风险回退约束、36 个正反回归用例。
- **尚未交付**：自动执行的视频剪辑器；真正加载 Skill 的路由行为批测；T05 的正式 Adaptive/Cinematic 多段六字段 Prompt 模板；真实 H3 渲染与转场成功率。T03B 不应对这些未完成项报喜。
