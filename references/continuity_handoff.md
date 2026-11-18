# Vlog AB Director v2：T03 镜头状态机与跨 Part 连续性交接契约

> 状态：T03 已接入的**内部导演规划规范**；不是 MiniMax H3 原生参数格式，不是程序化校验器。  
> 生效范围：Classic AB、Adaptive AB、Cinematic-led 的每一镜，以及最多 8 个独立 15 秒 Part 之间的每个边界。  
> 关联：[基础物理规则](rules_state_machine.md) · [T02 时间轴](timing_engine.md) · [已确认 v2 设计](../docs/design-v2-director-engine.md)。  
> 后续边界：**T03B 才决定是否建议/采纳特殊转场**；T04 完善画外音/声音语法，T05 将状态转成完整 H3 Prompt，T06 执行完整自动 QC。

## 1. 基本原则

1. **每镜先有状态，后写动作**：必须内部规划 `entry_state → visible_action → exit_state`。不能只写「同一人物保持一致」而没有道具/手/地点信息。
2. **人物身份与物理资源可追踪**：角色稳定的身份特征、当前服饰、手的占用、持机模式、关键道具外观/所有者/位置、空间锚点均有稳定 ID。
3. **镜内动作与镜间省略分离**：对模型容易出错的脱鞋、收纳、换装、拾取等复杂操作，优先在**合法硬切区间**省略，并明确 `cut_event` 的前后事实；镜内不可假装瞬间完成多个步骤。
4. **时间/地点跃迁不等于身份丢失**：同场景连续要继承物理状态；剧情允许换地点、日落、换衣服时，必须声明 `jump_event`，指出哪些状态合法改变及未展示动作，不要求像素级无缝。
5. **没有必要就不安排神转场**：本阶段只定义状态交接，**不强制任何特殊转场**；无特殊转场是合法状态。`none` 不需要任何出/入镜技巧字段。
6. **不要承诺视频必定无穿帮**：以上是 Prompt 规划和文字一致性约束，不代表 H3 已经实机验证或可保证物理效果。
7. **声音与输出边界不变**：生成阶段无 BGM；默认最终输出完整六字段 H3 Prompt，内部表默认不展示。

## 2. 内部状态模型（规划字段，不写进 H3 六字段作为新顶层标签）

### 2.1 每镜 ShotState

| 字段 | 必要性 | 说明 |
|---|---|---|
| `shot_id` | 必选 | 本 Part 内 Shot 1…N；与 T02 的局部区间一致 |
| `local_time` | 必选 | `[start_s,end_s)`，对应当前独立 15 秒任务 |
| `camera_mode` | 必选 | `A_handheld` / `A_nondevice_subjective` / `B_external`；摄影机不是可凭空传给人物的道具 |
| `characters` | 必选 | 每个出现人物的稳定 `character_id`、身份锁定项、服饰/发型、姿势/方向、位置与表情 |
| `hands` | 人物有可见交互时必选 | 按每个 `character_id` 标记 `left`/`right` 的 `free` 或所持 `prop_id`，以及持机模式 |
| `props` | 核心道具必选 | 稳定 `prop_id`、材质/形态、`holder/hand` 或世界坐标锚点、可见与否 |
| `spatial_anchors` | 场景存在固定锚点时必选 | `anchor_id` + 所在 `scene_id` + 具体位置 + 是否可见；离开场景时不能自动跟随 |
| `environment` | 必选 | `scene_id`、相对位置/室内外、时段/光照、天气、连续性假设 |
| `audio_carry` | 有跨镜音频时必选 | 仅记录声源/说话者 ID、跨镜是否继续；音频标签语法由 T04 负责 |
| `reference_ids` | 使用参考图时必选 | 稳定全局 `asset_id`，之后按**本任务上传顺序**转换成 `Picture N` |
| `state_confidence` | 适用 | 若用户输入缺信息，标记明确的保守假设，而不是发明新的关键实体 |

内部可以用表格、简短键值或自然语言结构表示这些字段，不需向模型输出 YAML、JSON、伪工具标签。

### 2.2 状态变化三元组

每镜至少要能回答：

- **entry_state**：摄影机开始记录时，人物具体在哪里，穿什么，哪只手持什么道具，人物与镜头是什么关系？
- **visible_action**：这一镜**可实际拍到**的动作及道具转移；不超过已分配镜长所能合理表达的动作负担。
- **exit_state**：镜尾所有被改变的关键状态；未发生变化的字段隐式继承，但关键人/手/道具应显式检查。

**转移有效性：** `exit(Shot i)` 应等于 `entry(Shot i+1)`，除了有明确事件解释的字段差异。对同一镜内，`exit` 应由 `entry + visible_action` 导出。不能一边说「右手一直持机」一边又让右手在同一镜拿咖啡杯。

## 3. 手部和持机物理规则

| 场景 | 持机/视角 | 双手约束 |
|---|---|---|
| **现代 Classic AB 自拍** | A镜右手持手机、B镜手机仍在右手但自然放低 | 右手不能同时拎其他物品；左手可进行单一清晰互动 |
| **现代 Adaptive AB，有明确自拍手机** | A/B 的持机及放低行为遵循同一人物手部资源；不同镜可明示变更 | 不允许镜内瞬间换手、手机无事件消失 |
| **现代 Cinematic-led 纯外部摄影且没有自拍要求** | 可以仅有 `B_external`，**不凭空假设主角必须握手机** | 双手按故事实际道具状态分配；若用户要求无手机，必须无手机 |
| **古风、仙侠或用户明确无现代设备** | 采用 `A_nondevice_subjective`（自然第一人称随行近景）/B，镜头设备不入画 | 角色的双手都可使用，但仍遵守一只手不能同时握两个互斥道具 |
| **双人/多人** | 每个角色单独建手部状态；只有明确的持机者需要占用持机手 | 不把 Subject 1 的固定右手规则无条件套用给所有配角 |

- 背包**背在肩上**不等于左手占用；但如果手里提着包带，需记录。
- 左手持折页并同时用左手把帽子完全戴好，通常属于同一时段的冲突；可先放下折页、换镜或省略过渡。
- **同一件道具的位置应互斥**：例如 `prop_map: holder=S1,left` 与 `prop_map: anchor=table` 不可在同一时点同时成立，除非明确道具的两个不同实例 ID。
- 镜中人物不持机的第三人称 B 镜也要记录手机是否仍在身侧、已合法收入口袋或不存在，不能自动生成或凭空消失。

## 4. 道具生命周期与场景锚点

### 4.1 核心道具状态

为每件核心道具分配稳定 `prop_id`，并保留不易漂移的 `appearance_lock`（颜色、材质、独特形态）。

推荐的生命周期：`not_introduced → world_anchor / held → moved / used → stored / placed → recovered / exited`。

每次转移必须记录可解释事件：
- `acquire(prop_id, source_anchor, character_id, hand)`：从已知桌面/货架拾取；
- `place(prop_id, character_id, hand, destination_anchor)`：放置到固定位置；
- `store(prop_id, character_id, bag_id, hand)`：收纳在同一个包中，之后双手可释放；
- `take_out(prop_id, bag_id, character_id, hand)`：从包中取出；
- `hand_off(prop_id, from_person/hand, to_person/hand)`：可见交接或切镜省略；
- `discard / leave_behind`：明确遗留、丢弃或送出，而不是凭空消失。

**事件不等于必须在镜内表现完整动作**。在硬切省略时，记录切点已发生的合法结果即可，但须有可信的 `before/after`。

### 4.2 空间锚点

- 每个固定锚点都有 `anchor_id`、`scene_id` 和位置描述。例如 `umbrella_bucket@record_store_door`。
- 当人物从 `record_store` 到 `street`，伞桶继续留在原场景；新场景拍不到它不等于消失，更不能让其跟着人物走。
- 场景回访时，如果没有事件改变，固定锚点和落在锚点上的道具应可再次定位，外观一致。
- 手持可携带道具跟随人物改变地点，但需保持所有权与握持方式一致；不随人物移动的固定道具保持原地。
- 时空跳跃/幻想蒙太奇中可合理改变地点、光照或服装，但**必须在交接清单说明是叙事跳跃**，不能当作同一瞬间的物理连续性。

## 5. Cut Ellipsis：镜内动作与镜间事件的分界

| 类型 | 时点 | 允许行为 | 必须记录 |
|---|---|---|---|
| `visible` | 镜内有实际画面时间 | 举起空闲的手、走几步、目光改变、拿起简单物体等 | `entry / visible_action / exit` |
| `cut_ellipsis` | 两镜之间的硬切 | 已收好伞、完成脱鞋、已装包、合理地走入门内 | `cut_event`、涉及道具/人物、`before → after`、地点/时间解释 |
| `time_jump` | 明确叙事时间跳跃 | 光照改变、场景里人已换衣、道具经故事事件重新安排 | `jump_event`、经过的时间/叙事原因、持续不变项与改变项 |
| `location_jump` | 明确地理场景切换 | 从街道切到车站/海边等另一地点 | 起止 `scene_id`、随人携带物、落在旧场景的锚点 |

**例 1：收伞入店。** Shot 1 exit：`umbrella@S1.left, state=open; scene=street`；Shot 2 entry：`umbrella@bucket_by_door, state=folded; S1.left=free, scene=store`。必须有切点事件「收伞、进入店、放入门边伞桶」，镜内不要求完成复杂折叠动作。

**例 2：古风。** Shot 1 A 镜是自然近距离随行摄影，不存在现代实体手机；Shot 2 B 镜同一角色左手持茶盏、右手整理衣袖。不得把 `A_nondevice_subjective` 错误理解为「演员双手必须握有镜头设备」。

**例 3：时间跳跃。** Part 3 在白日林地、Part 4 设为数小时后夕阳海边。人物身份延续；scene、lighting、position 可显式发生变化；要声明从林地离开后经历路程。不要写「原地一秒变换成海边」作为没有解释的写实场景。

## 6. 多 Part 交接契约（2–8 Part，任意相邻边界）

### 6.1 边界生成顺序

1. 在 T02 完成每段时间轴规划以后，依次规划 Part k 的每镜 `entry/action/exit`；
2. 对 Part k 最后一镜的 `exit_state` 形成 `handoff_out(k)`；
3. 在 Part k+1 前，明确衔接类型：`same_moment`、`cut_ellipsis`、`time_jump` 或 `location_jump`；这些是**叙事/物理连续性类型，不是 T03B 的「神转场」算法结果**；
4. 记录 `allowed_changes` 与 `events`；要求 Part k+1 第一镜的 `entry_state` 与 handoff_out 一致，或有对应合法改变事件；
5. 分别构造 Part k 与 Part k+1 的**独立参考素材上传清单**，先映射全局资产，再按当前任务重编号；
6. 检查所有 1–8 Part 的边界，不能只维护 P1→P2 而忘记 P5→P6；
7. 默认只在输出中给用户必需的「下一 Part 上传顺序 / 关键状态」简短说明；完整内部 handoff 表仅按需展示。T05 才完成 3–8 Part 成套 Prompt 装配。

### 6.2 Handoff 必需字段

| 字段 | 意义 |
|---|---|
| `from_part / to_part` | 相邻独立生成任务 ID |
| `boundary_type` | same_moment / cut_ellipsis / time_jump / location_jump |
| `exit_snapshot` | 最后镜人物身份、服饰、姿态/朝向、双手、核心道具、场景锚点、光照 |
| `events` | 不在镜内展示却解释状态变化的动作/时空事实，可为空 |
| `allowed_changes` | 允许改变的字段，**仅在有事件时改变** |
| `entry_snapshot` | 下一 Part 第一镜需要呈现的状态 |
| `persistent_lock` | 即使跨时空仍必须保留的身份、关键道具外观等 |
| `audio_carry` | 仅记录跨 Part 音频是否接续，详细语法归 T04 |
| `asset_manifest` | 各 Part 实际上传的全局资产 ID 与当前 `Picture N` 映射 |
| `edit_notes` | 可直接普通硬切；已知剪辑裁切按 T02 账本核算 |
| `transition_intent` | `none` 或用户明确想尝试某技巧的待评估需求；**T03 不决定/强制特效转场** |

**same_moment** 时场景、持有手、服装、核心道具与光影原则上保持一致，但剪辑可以使用不同机位；**cut_ellipsis** 可以短时间进入门内/收伞等；**time_jump/location_jump** 可以声明合理变化，但不能把身份或核心道具随意替换成别的。

### 6.3 为什么前 Part B 镜放低手机，后 Part A 镜举起手机不是穿帮

持机者在 B 镜 `phone@right_hand, position=lowered`，下一 Part A 镜 `phone@right_hand, position=raised`，握持手没有变；可以用切点动作 `raise_camera` 解释。需要区分**同一道具的姿态变更**和「凭空新增/消失手机」。

**延续 T00 植物园案例**：P1 尾镜人在同一木框玻璃门外、左手拿浅绿色折页，P2 首镜已走到门内，仍左手持同一折页；`cut_event: walk_through_same_door` + `raise_camera` 可以解释跨任务变化，无需为此新增特殊转场。

## 7. 每个 Part 独立的参考图映射

### 7.1 两层 ID

- 全局资产使用稳定 `asset_id`（例如 `role_hero`、`scene_gate`、`scene_greenhouse`、`prop_map`），在全片保持同一含义；
- **单次生成任务**的 `Picture 1..N` 是按用户**当前实际上传顺序**分配的局部编号，每个 Part 从 1 重新编号；
- 给每个任务先列出 `upload_manifest = [(Picture 1, asset_id), (Picture 2, asset_id)...]`，再在该任务 Prompt 中引用；**不能引用这次没有上传的图片**；
- 如果没有上传任何参考图（T2VA）：`upload_manifest=[]`，Prompt 不得假装存在 `<Picture 1>`；具体纯文本模式装配由 T05 处理。

### 7.2 多 Part 映射示例

| 资产 ID | Part 1 上传列表 | Part 2 上传列表 | Part 3 上传列表 |
|---|---|---|---|
| `role_hero` | `<Picture 1>` | `<Picture 1>` | `<Picture 1>` |
| `scene_gate` | `<Picture 2>` | — | — |
| `scene_greenhouse` | — | `<Picture 2>` | — |
| `scene_lake` | — | — | `<Picture 2>` |

P2 的「温室」虽然是全局第三个资产，实际本段仅上传两张，所以编号必须是 `<Picture 2>`，**绝不能写 `<Picture 3>`**。P3 也必须重新按本任务两张图编号。

### 7.3 检查约束

- `Picture N` 必须能在该 Part 的实际 `upload_manifest` 找到相同序号的资产；同一局部编号不可对应两张不同资产；
- manifest 的编号从 1 起连续，不存在漏号；同一资产若需要复用需在各任务**明确再次上传**，不能只写「沿用上一次任务素材」；
- Prompt 里出现的 `Picture N` 均应出现在 manifest 中，不可越界；
- 如果上传了多余但未引用的图，**只标记可疑冗余/潜在混淆的软风险**；关键硬约束是**引用正确**，不应误判为「必须引用每张上传图」；
- 不得在故事里混用`角色稳定资产 ID`与`每次任务的 Picture N`：两者分别描述全局一致性与单任务模型输入。

## 8. T03 状态校验（本轮是文本级规划，非程序化视频检测）

**硬性**：
1. 每镜有 `entry/action/exit`；对应 T02 局部时间段，状态变化有可解释动作/事件；
2. 一个角色的同一只手同一时点不同时占用互斥物件；
3. 同一实体道具不存在两个未解释的并发持有人/位置，不凭空复制/换色/消失；
4. A 镜与 B 镜的持机状态符合用户是否设定实际手机；古风/无手机不编造手机；
5. 固定锚点留在原 `scene_id`，不能随主角跨场景瞬移；场景回访能解释其状态；
6. **每个相邻 Part 都有 handoff_out 与 entry_snapshot**，差异必须有 `event` 或允许的时空跃迁；
7. 全局资产 ID 与当前 Part 上传清单映射正确，无无效 `Picture N` 引用，T2VA 不虚构参考图；
8. 不改变 Classic 六镜与 T02 局部 15s 时间轴；生成阶段无 BGM；转场允许 `none`。

**软性**：
- 在 2–4 秒内安排过多动作、多个道具抓取/交换；
- 服装、天气或时段变化无叙事提示，却在同一地点连续镜头里突然改变；
- 人物出入画、左右方向、视线目标与空间定位不够明确；
- 即使表面有切点事件，隐藏动作过多以至于接续明显突兀。

**边界**：上述为后续 T06 可程序化/语义化检验的**规则条件**。T03 以 Skill 规划说明与案例冻结实现，不代表已经有自动判错引擎或能保证 H3 渲染时物理准确。

## 9. T03 / T03B 的清晰分工

- **T03** 处理 `same_moment`、`cut_ellipsis`、`time_jump`、`location_jump` 的**叙事状态继承**；不把「水池穿越」等技巧当成必须调用的状态事件。
- **T03B** 才根据题材与景别判 `none / suggest_only / planned_pair`，只有选用 `planned_pair` 时才要求两 Part 的出场/入场镜头成对匹配，并计入实际编辑损耗。
- 任意 120 秒片子即使所有边界都是普通硬切，**T03 的 handoff 仍必须成立**；特殊转场数量没有下限。

**T03 完成定义**：规范已接入入口，能够从镜头状态推导合法连续性，能够按每个任务重新编写参考资产清单，能够按不同时间/地点跳跃说明物理状态。完整动态 H3 Prompt 装配及实际视频仍属于 T05/T07。
