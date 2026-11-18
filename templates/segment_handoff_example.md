# T03 内部状态机示例：植物园 45 秒、三个独立 Part 的交接

> **重要：这是导演规划中的交接实例，不是 H3 模型 Prompt、不是让模型一次生成 45 秒的指令。**  
> T03 只定义镜头状态迁移和边界清单。完整多段六字段 Prompt 模板由 T05 实施，转场推荐由 T03B 实施。  
> 兼容 [T00 植物园 30 秒案例](../examples/classic-ab-30s.md) 的前两段：只增加第三段湖边漫步。  
> **没有特殊转场**：两个 Part 边界均用正常硬切/合理切点省略；用户无需接受神转场。

## 1. 故事、人物与全局稳定 ID

- 角色 `S1`：同一个成年女子；棕黑色低马尾、浅米色衬衫、浅蓝牛仔裤、浅卡其单肩包。
- 现代 Classic AB 拍摄：右手专职持手机，A 镜举起、B 镜低握；左手拿浅绿色园区折页，在 Part 2 第二镜前收进同一单肩包。
- 持久实体：`prop_phone`（手机）、`prop_map`（浅绿色无字对折折页）、`prop_bag`（浅卡其单肩包）。
- 空间：`scene_gate`（温室外入口）、`scene_greenhouse`（温室内）、`scene_lake`（园内湖边）。
- 固定锚点：`anchor_greenhouse_wood_door` 位于温室入口，不会随人物行走漂移。
- 视频名义素材：`P1 0–15s, P2 15–30s, P3 30–45s`；每次独立的 H3 生成任务都使用**局部 0–15s**。剪后净时长须按 T02 编辑账本核算。

## 2. 全局 asset_id → 每个任务的上传清单

| 稳定全局 ID | P1 实际上传顺序 | P2 实际上传顺序 | P3 实际上传顺序 |
|---|---|---|---|
| `role_hero` | 第 1 张：`<Picture 1>` | 第 1 张：`<Picture 1>` | 第 1 张：`<Picture 1>` |
| `scene_gate` | 第 2 张：`<Picture 2>` | 无 | 无 |
| `scene_greenhouse` | 无 | 第 2 张：`<Picture 2>` | 无 |
| `scene_lake` | 无 | 无 | 第 2 张：`<Picture 2>` |

**事实前提**：表格表达用户按计划真实上传这些图片时的编号。仓库没有相应图片，不能声称图片已上传；若某任务实际没传图，须重新生成清单且不能在 Prompt 中引用不存在的 `Picture N`。

P3 的 `scene_lake` 是全局第 4 个资产，但**当前任务**第 2 张图，仍写 `<Picture 2>`，**不是 `<Picture 4>`**。

## 3. 跨镜示例：entry → action → exit

以下字段用于规划内部状态，不是 MiniMax H3 的原生键名：

```text
P1.Shot6 local_time=[12.500,15.000)
  camera=B_external
  entry_state:
    S1: {scene: scene_gate, position: outside_wood_door,
         outfit: beige_top_blue_jeans_ponytail, bag: left_shoulder,
         left_hand: prop_map, right_hand: prop_phone(lowered)}
  visible_action: pause, look_towards_greenhouse_door
  exit_state: same as entry (door not yet crossed)

CUT P1 -> P2
  boundary_type: cut_ellipsis
  events: [walk_through_same_wood_door, raise_phone_in_right_hand]
  allowed_changes: [scene, position, phone_height, camera_mode]
  persistent_lock: [S1_identity, outfit, bag, prop_map, prop_phone]
  transition_intent: none

P2.Shot1 local_time=[0.000,2.500)
  camera=A_handheld
  entry_state:
    S1: {scene: scene_greenhouse, position: inside_same_wood_door,
         outfit: beige_top_blue_jeans_ponytail, bag: left_shoulder,
         left_hand: prop_map, right_hand: prop_phone(raised)}
  visible_action: look around, short greeting
  exit_state: map still in left hand; phone still in right hand

CUT P2.Shot1 -> P2.Shot2
  events: [store_map_in_left_shoulder_bag, lower_phone_in_right_hand]
  allowed_changes: [left_hand, prop_map_location, phone_height, camera_mode]

P2.Shot2 local_time=[2.500,5.000)
  camera=B_external
  entry_state:
    S1: {scene: scene_greenhouse, bag: left_shoulder,
         left_hand: free, right_hand: prop_phone(lowered)}
    prop_map: {location: prop_bag, appearance: pale_green_folded_leaflet}
  visible_action: walk slowly past foliage
  exit_state: map remains inside the same bag
```

关键检查：
- P1 B 镜的手机降低与 P2 A 镜的手机举起，**手始终是右手**，变化有切点事件；
- P1 尾镜/ P2 首镜**地图仍在左手**；只有 P2 Shot 1→2 的硬切期间收进包里；
- `scene_gate` 的木框门内外是同一座温室；门不跟随主角移入温室深处；
- 不增加无意义的甩镜/水面穿越，跨段普通硬切合法。

## 4. 再跨一段：P2 温室 → P3 湖边

```text
P2.Shot6 local_time=[12.500,15.000)
  camera=B_external
  exit_state:
    S1: {scene: scene_greenhouse, position: central_path,
         outfit: beige_top_blue_jeans_ponytail, bag: left_shoulder,
         left_hand: free, right_hand: prop_phone(lowered)}
    prop_map: {location: prop_bag}
    anchor_greenhouse_wood_door: {scene: scene_greenhouse, position: entrance}

CUT P2 -> P3
  boundary_type: location_jump
  events: [leave_greenhouse, walk_along_park_path, arrive_at_lake, raise_phone]
  elapsed_time: several_minutes (story assumption, not model generation time)
  allowed_changes: [scene, position, lighting_subtle, phone_height, camera_mode]
  persistent_lock: [S1_identity, outfit, hairstyle, bag, prop_map_in_bag]
  retained_old_anchors: [anchor_greenhouse_wood_door @ greenhouse_entrance]
  transition_intent: none

P3.Shot1 local_time=[0.000,2.500)
  camera=A_handheld
  entry_state:
    S1: {scene: scene_lake, position: lakeside_path,
         outfit: beige_top_blue_jeans_ponytail, bag: left_shoulder,
         left_hand: free, right_hand: prop_phone(raised)}
    prop_map: {location: prop_bag}
  visible_action: quietly look at lake, smile
  exit_state: no new physical transfer
```

**为何合法**：地点与相机高度有显式 `location_jump` 和事件；人物身份/服饰/包/地图没有改变。温室木门锚点保留在原地点，但不会在 P3 湖边凭空出现。P3 的单任务仍只生成 15 秒。

## 5. 需要拦截的负面变体

- 在 P2 Shot 1 中，主角左手握折页的同时还要左手端满杯咖啡 → **同手互斥冲突**；
- P1 手握折页，P2 首镜折页已在湖边地上且没有任何事件 → **道具瞬移**；
- P3 复制 P1 中温室门外的 `<Picture 2>` 作为湖边参考 → **当前任务图片映射错误**；
- P2 到 P3 改变服装却仍声明 \`same_moment\` 和「衣着 100% 继承」 → **状态矛盾**，需改为明确时空跳跃或保持衣着；
- 因为有两个 Part 边界就必须各使用一次技巧性转场 → **违反 D5**；
- 由于三段名义时长为 45 秒就宣称真实视频拼接后必定无损 45 秒 → **未经剪辑余量核算**；
- 无参考图时继续写 `<Picture 2>` → **虚构素材**。

## 6. 输出与证据分级

本文件是 T03 的**规划型样例**。默认用户最终要完整 H3 Prompt；完整的内部 `handoff`、资产映射表仅在用户需要时展示。此样例未经 MiniMax H3 渲染验证，不能宣称人物与道具一定不会穿帮；跨段画面真实拼接效果留给 T07 实测。
