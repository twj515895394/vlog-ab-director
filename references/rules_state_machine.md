# Vlog AB Director: 状态机、手部分工与防穿帮法则

本指南保留 v1 的物理连续性基线；**T03 已将其提升为每镜 `entry_state → visible_action → exit_state` 与多 Part handoff 契约**，完整状态字段、时空跳跃、资产映射和检查规则以 [`references/continuity_handoff.md`](continuity_handoff.md) 为准。

> 重要适用范围：下文「现代右手专职持机」适用于**确实存在手机自拍的角色**（特别是 Classic AB），不应要求没有自拍任务的 Cinematic-led 人物无端握着手机；古风/禁用手机的主观镜头同理不凭空引入现代设备。下文 2.5s 节拍和六镜标注只对 Classic AB 强制；其他导演模式遵循 [`references/timing_engine.md`](timing_engine.md)。
>
> 这些规则用于提高 Prompt 一致性、降低穿帮风险，**不保证模型绝对不会产生手部错误**。

---

## 一、 右手持机法则与免持道具浮空模式

### 1. 现代手持自拍：右手持机唯一性原则（The Right-Hand Rule）
在手持自拍 Vlog 中，AI 模型最容易犯的错误是“同一只手既要拿手机自拍，又要去捡东西、翻包、撩头发”，直接导致手指融合、多指或手机凭空消失。
* **右手专职持机（Right Hand for Camera Only）**：
  * **在 A 镜（自拍镜头）**：`<Subject 1>` 的右手在画外（或画面边缘下部）稳固握持智能手机。自拍画面随步伐产生轻微、有机的呼吸起伏微晃（`Handheld Shake Slightly`），但画面绝不做镜像翻转。
  * **在 B 镜（客观镜头）**：`<Subject 1>` 的右手自然将手机垂放于身侧，或随性贴大腿侧握，绝不在 B 镜中凭空丢弃手机。
* **左手专职物理交互（Left Hand for Interactions Only）**：
  * 拾取贝壳、撑开或收起雨伞、抚平衬衫翻领、把发丝撩到耳后、端咖啡杯、按压快门、挽扶同伴等所有动作，**一律由左手完成**。
* **双人互动时的手部边界**：
  * `<Subject 1>`（持机者）右手始终握机，左手可搭在 `<Subject 2>` 肩膀上；
  * `<Subject 2>`（同伴）双手完全自由，可抱书、比心、整理衣服或挽住 `<Subject 1>` 的手臂。

### 2. 古风/仙侠/奇幻无道具场景：免持道具浮空随行模式（Floating Subjective Follow Mode）
在古风、玄幻、仙侠或无手机设定的场景中，强行手持现代手机或实体镜子往往破坏沉浸感。此时 A 镜由“实体手持”进化为“仙灵/主观浮空随行跟拍”：
* **机位本质**：由灵气气流、随行仙侍或第一人称主观视角在主角斜前方半身近景浮空漂移跟拍；
* **双手完全解放**：主角双手完全自由，可用于拂袖、整理发簪、端茶盏、掐指御剑、整理腰间配饰，彻底杜绝手持怪异道具的逻辑破绽；
* **保留 Vlog 核心灵魂**：依然保留直视镜头交流、生动微表情对视与 2.5s 节奏，保持第一人称的陪伴感与互动感。

---

## 二、 硬切省略哲学（Cut Ellipsis）

AI 视频模型在 2~3 秒内极其难以连续且合理地完成复杂的物理交互过程（例如解开细高跟鞋扣带脱鞋、将贝壳拉开包链塞入狭小侧袋、戴墨镜穿过耳根等），强行生成极易发生肢体扭曲和穿模。

### 规则定义：
1. **过程省略，结果切入（Omit Process, Jump to Result）**：
   * **脱鞋状态**：[Shot 1] 穿高跟鞋走路 → [Shot 2] 切入时**已经脱下鞋子**并挽好裤脚，黑色高跟鞋与包已整齐放好；
   * **装包与取出**：[Shot 4] 展示贝壳 → [Shot 5] 切入时贝壳**已经收进包内**；[Shot 7] 切入时贝壳**已经由左手握在掌心**；
   * **收伞与入店**：[Shot 1] 雨中撑伞 → [Shot 2] 切入时伞**已经利落收拢插在门边伞桶内**；
   * **戴墨镜**：[Shot 2] 墨镜插在领口 → [Shot 3] 切入时左手刚完成佩戴动作或已戴好。
2. **切镜标识规范**：
   * 必须使用直接硬切（Hard Cut），明确声明时间戳：`[Shot N] At 00:0X.000, HARD CUT TO:`（或英文 `At 00:0X.000, the camera cuts to...`），严禁使用淡入淡出（Fade）、叠化（Cross-dissolve）或连续变形转场。

---

## 三、 场景永久锚点（Persistent Spatial Anchors）

为了保证画面的空间可信度，被人物卸下的随身物品必须在后续镜头中充当“环境参照物”：

1. **同点存放**：
   * 脱下的鞋履与卸下的背包必须放置在同一处干燥安全区域（如“栈道末端的干燥沙地”、“天台木质长椅上”、“店门口的伞桶”）；
2. **物理恒定**：
   * 当人物在环境内移动时，这些锚点物体不能“跟着人物走”，也不能凭空消失；当机位拍回原处时，它们必须作为背景细节稳定出现。

---

## 四、 核心道具守恒定律（Prop Conservation Lifecycle）

全片的核心互动道具（贝壳、复古拍立得与相纸、黑胶唱片、咖啡杯、墨镜、书籍等）必须具备完整的生命周期与外观一致性：

1. **唯一性与特征固化**：
   * 在 `subject_definitions` 或 `detailed_description` 首现时，彻底锁死其外形、颜色、材质与特征（例如：“一枚小巧的浅米白色扇形空贝壳，表面带细密放射状纹路，边缘略呈浅棕色”）。后续全片必须严格指明“同一枚贝壳”，杜绝变色变形。
2. **物理状态演化链**：
   * 拍立得相纸：`空白方形白底片吐出` ──> `等待显影` ──> `浮现出金色晚霞微缩画面`；
   * 热咖啡：`刚端起时升腾淡淡白汽` ──> `小抿一口` ──> `平稳放在桌角`。

---

## 五、 T03 镜头状态迁移与事件追踪（Shot State Transitions）

所有模式在内部规划时，按「**入镜状态 → 镜中实际动作 → 出镜状态 → 允许的切点事件 → 下一镜入镜**」依次处理；**不把这个表格当作 MiniMax H3 的原生字段**。

- **入镜状态 `entry_state`**：人物身份、服饰、位置/朝向、左右手占用、可见道具与固定锚点、场景/光照、A/B 机位；
- **镜中实际动作 `visible_action`**：本镜时间内有能力呈现的有限动作，不能把同一只手分配给互斥道具；
- **出镜状态 `exit_state`**：只记录可合理发生的状态更新，其他稳定字段继承；
- **切点事件 `cut_event`**：若下一镜出现已收伞、已装包、已进门等状态，明确该事件发生在镜头之间，提供合法的 `before → after`；
- **时空跳跃 `jump_event`**：如果下一镜或下一 Part 已处于其他地点、较晚时间或更换服装，声明时间/地点变化及被允许改变的字段，不要求假装完全无缝。

手部、道具和身份的全部字段见 [`continuity_handoff.md`](continuity_handoff.md)。**同一个道具不可同时在左手与桌面上**；一个固定场景锚点不可跟随主角移到另一座城市；双人要分别检查各自双手和交接事件。

**三类合法切镜示例**：

1. `Shot 1 exit: umbrella@S1.left, open, street` → `cut_event: fold_umbrella, enter_shop, place_in_bucket` → `Shot 2 entry: umbrella@bucket, folded, shop`；
2. `Shot 3 exit: map@S1.left` → `cut_event: store_map_in_bag` → `Shot 4 entry: map@shoulder_bag, S1.left=free`；
3. `Part 1 exit: greenhouse_door_outside, phone@S1.right(lowered), map@S1.left` → `cut_event: walk_through_door, raise_phone` → `Part 2 entry: same_greenhouse_door_inside, phone@S1.right(raised), map@S1.left`。

---

## 六、 单段任务资产独立紧凑重编号法则（Per-Task Asset Re-indexing Rule）

这是**任何 2–8 Part 多段生成任务**中最关键的工程避坑指南（30 秒只是双 Part 兼容示例）：

1. **生成引擎的任务独立性**：
   * 在 MiniMax H3 或同类模型中，Part 1 和 Part 2 是通过两次独立创建任务（New Task）来分别生成的；
   * 模型判定 `<Picture N>` 是严格根据**当前单次任务实际上传的参考图文件列表索引（Index 1 到 N）**来绑定的。
2. **严禁未上传引用与局部编号混乱（No Unresolved Labels）**：
   * 如果用户在项目全局有 3 张资产图（图A人物，图B车库，图C超市）：
     * **Part 1 任务**：用户仅上传了 图A 和 图B。提示词中必须写为 `<Picture 1>`（图A）和 `<Picture 2>`（图B）。
     * **Part 2 任务**：用户在界面中仅上传了 图A 和 图C（共 2 张图）。此时 图C 在模型眼中是当前任务上传的**第二张图**！因此在 Part 2 的提示词中，**必须将 图C 的编号严格映射为 `<Picture 2>`，绝不能写成 `<Picture 3>`**！
   * 如果在只传了 2 张图的 Part 2 任务中写了 `<Picture 3>`，模型可能报错 `Unresolved Reference Label <Picture 3>` 或发生主体混乱。
   * **T03 新规则**：每个 Part 先明确实际上传的 `asset_id → Picture N` 对应表。上传列表编号必须连续，Prompt 所引用的每个 `Picture N` 都必须存在于本次上传列表。**上传了某张图但未在 Prompt 中引用通常是软风险，不是硬性「每张图必须被引用」的要求。** 无参考图的 T2VA 场景不能伪造 `Picture N`，具体装配仍留给 T05。

---

## 七、 画面绝对防字幕与防UI负向铁律（Zero-Text & Clean Screen Format）

彻底解决 AI 视频因包含 `<d>` 对白标签而容易在画面中“烧录字幕、生成乱码水印与虚假UI”的通病。
在所有提示词的 `detailed_description` 结尾，必须永久强制注入以下内容，**并且必须严格遵循每个标题后独立空一行的格式**：

```text
【禁止项】

文字/UI/水印/Logo/角标/可读文字/真实UI

【强制声明】

无背景音乐,仅保留环境音与人声和音效;画面禁字幕/文字/水印/Logo;禁止可读文字(指画面字幕文字,不含人声台词)
```

---

## 八、 T03 多 Part 连续性交接（Segment Handoff）

1. 对 2–8 个独立 15 秒任务中的**每一对相邻 Part**，从前一段最后一镜的 `exit_state` 生成 `handoff_out`，后一段的第一镜 `entry_state` 逐项消费。
2. 必须明确 `boundary_type`：`same_moment` / `cut_ellipsis` / `time_jump` / `location_jump`。前两类侧重物理连续；后两类允许有原因的光照/场景/服装变化，但稳定身份不可凭空替换。
3. 交接至少包含人物身份/造型、手与道具、场景锚点、光照与时段、音频是否接续、当前 Part 参考图上传顺序；如有不同，明确 `allowed_changes` 及事件。
4. 如果 B 镜低握手机、下一段 A 镜举机，右手占用可以保持不变，**举起手机是切点动作**，不属于手机消失后重新出现。
5. **普通硬切始终有效**。T03 只维护叙事与物理状态，不强制使用遮挡转场、甩镜、穿越水池等技巧；是否建议特殊转场由 T03B 决定。
6. 用户默认只需要完整可复制的 H3 Prompt、必要的下一段参考图上传/状态提醒；内部状态表与交接字段按需展示。
7. 时长与参考图按 T02/各任务局部映射处理。**最多 120 秒是成片规划上限，不是一次生成时长**。

**格式参考**：[`continuity_handoff.md`](continuity_handoff.md)、[`templates/segment_handoff_example.md`](../templates/segment_handoff_example.md)。**完整多段 H3 Prompt 模板在 T05**，上述内容不作为新增的 H3 顶层字段输出。
