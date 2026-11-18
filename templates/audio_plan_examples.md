# T04 声画规划示例：15 秒镜内音频桥与跨 Part 后期衔接

> **内部规划样例，不是可直接复制的完整 H3 六段式 Prompt，也未执行 MiniMax H3 实机渲染。**
> 规范：[Audio Director](../references/audio_director.md)，时序：[Timing Engine](../references/timing_engine.md)。T05 才将这些信息编排进完整 H3 Prompt。

## A. 15 秒 Classic AB：一次 L-Cut 与一次 J-Cut

镜头序列保留**严格六镜，每镜 2.500 秒**，硬切时点为 0 / 2.5 / 5 / 7.5 / 10 / 12.5 / 15 秒。角色 S1 为成年女子，现代右手自拍；声音只有环境、台词与 Foley，绝无 BGM。

| 镜头 | 画面局部区间（秒） | 音频与嘴型计划 |
|---|---|---|
| A1 | [0.000,2.500) | S1 画内于 1.200s 开始说「你看——」，嘴部同步；这条发声事件直到 3.400s 才真正结束 |
| B1 | [2.500,5.000) | 画面硬切到海面；S1 **同一人声**继续说「——天边的夕阳真美」，画中 S1 若可见则闭嘴，不重复发整句话；风、海浪与 S1 声音并存 |
| A2 | [5.000,7.500) | S1 望向景色微笑，**不说话**；原海边环境持续，**7.000s** 提前淡入下一镜树林的真实鸟声（仅为声轨的 J-Cut 意向，不要求画面淡入） |
| B2 | [7.500,10.000) | **画面硬切**至树林，前面 7.000s 已开始的鸟声在此延续，来源是树林；人物不发言 |
| A3 | [10.000,12.500) | 安静看向镜头、轻声呼吸，衣料轻响；无对镜强制台词 |
| B3 | [12.500,15.000) | 外部摄影机平稳收尾，只有风与脚步 Foley；不淡出画面、不添加配乐 |

### A1 → B1：明确 L-Cut 时间关系

```text
audio_event: S1_L_01
source: S1 same female voice
audio_time_in_local_part: [1.200, 3.400)
visual_cut_time: 2.500
pre_cut_lips: S1 sync_lips, while visible in A1
post_cut_lips: S1 closed_lips if visible in B1; otherwise not_visible
utterance: [Chinese] 你看——天边的夕阳真美
editing_intent: L_cut_voice_continues_after_visual_hard_cut
legacy_scenetrans_tag: optional_unverified_not_required
```

这些字段是**内部时间/声画规划标签**，不是要求模型输出额外顶层 JSON/YAML 或宣称该语法已实测。实际把台词拆进两个镜头时，应让画内 S1 的声音和口型关系清楚，不重复完整句两次。

### A2 → B2：明确 J-Cut 时间关系

```text
audio_event: FOREST_J_01
source: scene_forest bird_calls
audio_time_in_local_part: [7.000, 9.500)
visual_cut_time: 7.500
pre_cut_visual: A2 seaside remains visible until 7.500
post_cut_visual: B2 forest reveals at 7.500
editing_intent: J_cut_next_scene_ambience_precedes_picture
avoid: background_music, virtual_subtitles, fade_or_dissolve_video
```

**注意**：J-Cut 的含义是新场景**声音先入**，并不是视觉渐变；应保留 B2 的实际硬切。H3 对精确提前 0.500s 的生成响应尚未验证，属于导演意图与后期可补救方案。

### 六字段装配保护

- `detailed_description` 镜头中须写清 A1/B1 的同一声源与切点，及 A2/B2 的下一场景鸟声先入。
- `overall_soundscape` 只写海浪、风、树林鸟声、人物声音与 Foley，不出现 BGM 指令。
- `non_diegetic_music: N/A`。
- `detailed_description` 的结尾必须仍有完整 `【禁止项】`、`【强制声明】` 与无背景音乐负向块。

## B. 两个独立 Part（30 秒）之间的音轨延续

如果 P1 尾镜 S1 于本地 `[14.100,15.000)` 已经开始一句话，而 P2 首镜希望其声音接着延续到本地 `[0.000,1.300)`：

- **模型生成计划**：P1 和 P2 是**两个独立 H3 任务**，各自的声线/语速/环境可能不同；各 Part 中应明确生成时只能使用自己的 0–15s 时间码与 S1 角色 ID。
- **后期编辑方案**：优先保留/重配一段完整连续的 S1 配音，在剪辑软件跨越 P1/P2 边界，以画面硬切与后期音轨连续实现 L-Cut；可参考独立生成的声音素材，但**不能保证它们自然无缝拼起来**。
- **如果用户没有后期配音条件**：应把跨段台词拆为各段完整独立短句，避免强行要求 H3 一次产生跨 Part 无缝的长句。
- **跨 Part J-Cut**：需要提前把 P2 生成片段的环境音混到 P1 尾部，在后期处理，不能要求 P1 模型凭空提前听到未来视频的真实音轨。
- 仍然只有环境音、人声和 Foley，`non_diegetic_music: N/A`。T02 的净时长账本由实际裁切情况决定，**声音桥本身不自动扣减视频时长**。

## C. 多人画外音语义

```text
speaker S1 (Subject 1): on-camera speech, mouth visible, lips sync
speaker S2 (Subject 2): offscreen inner voice in current shot, not shown
S2 voice: 此时他在画外心声说道：<d>[Chinese] 这次旅行值得记住。</d>
S1 on-screen: not speaking while S2's voiceover plays
no simultaneous contradictory sync_lips and closed_lips
```

每位说话者都要有稳定身份；若后续镜头 S2 出现在画内并正常讲话，该镜可以变为画内对白，但必须清楚记录声源类型发生了变化。
