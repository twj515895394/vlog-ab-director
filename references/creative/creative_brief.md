# Creative Brief — 创意简案数据契约

简案是创意与现有导演引擎的交接契约。内部结构不是H3顶层字段或必须展示的JSON。仅要创意/剧本时可交付简案并停止；用户明确要Prompt且当前创意确认后才进入T01。

## 1. 字段定义

| 字段 | 类型/说明 |
|---|---|
| brief_id, revision | 稳定ID、正整数版本；核心变化使版本增加 |
| status | draft / confirmed |
| confirmation | draft=null；confirmed={kind:explicit/delegated/direct_ready,revision} |
| request_goal | IDEAS / DEVELOP / BRIEF / PROMPT / MODIFY；进入制作时是PROMPT或明确生产型修改 |
| title, logline | 片名与一句话核心内容 |
| primary_genre, secondary_genres | G-ID或custom；不当作摄影模式 |
| primary_goal, driver | 体验/探索/情绪/关系/审美/趣味/目标等及人物目的 |
| story_structure | S-ID或custom；可为观察式 |
| characters | {character_id,description,relationship,visual_identity,locked_fields}；未知不虚构 |
| setting, world | 地点、时代、物理环境与叙事规则 |
| premise_or_visual_theme | 核心事件/视觉主题，无剧情时可只是观察主题 |
| beats | 有序{beat_id,action,meaning,result}；不是固定镜数或全片模型时码 |
| emotional_arc | 可变化或保持；用动作/表演/声场表达 |
| memorable_moment, ending | 可见记忆点与结尾；开放或无反转合法 |
| duration_target_s | 交接时为15–120内目标，可用15秒默认且注明；非整15由T02规划 |
| aspect_ratio, language | 用户指定优先；未知可标可逆默认 |
| camera_intent, director_mode_lock | 自拍/观众POV/客观/混合/禁自拍；仅用户明确才锁模式 |
| dialogue_intent | 无台词/对白/VO/具体锁定原文；不静默删改 |
| audio_plan_intent | generation_bgm=false；可有post_music_note但不装进H3 |
| transition_preference | none/suggest_only/用户明确选用或授权；未指定只建议 |
| assets | {global_id,type,status:available/needed,description}；只有真正可用才能引用，编号T03处理 |
| constraints/preferences/exclusions | 锁定、偏好、禁止元素，保留用户原文意义 |
| assumptions/risks/open_questions | 可逆默认、生成难度与实际未知，不编造 |
| creative_qc | hard项PASS/FAIL/UNKNOWN/N/A、soft项、证据与当前revision |

## 2. 最小可审核简案

标题；一句话；人物与关系；情境/世界；3个以内（短片）核心节拍或视觉母题；情绪/记忆点；结尾；目标时长；已锁定的画面、对白、声音、转场、素材约束；必要假设与风险。较长片按容量扩写，不强迫用户填表。不确定资料用未知/待提供而不是伪造。

例如：B07 r2《并肩发现》；G02+G03、S06；两位虚构好友在林间小径走散几步，一人停下来等另一人，两人共同看到林间阳光；情绪好奇→分享，记忆点是回头与并肩；30秒、9:16，无台词、无BGM、普通硬切，无图。用户选定人物关系前保持draft。明确「按这个直接做」后确认绑定r2，再进行QC。不要将演示简案当用户真实事实。

## 3. 交接门禁

- 仍在讨论、仅选题/偏好、仅需简案时不交付最终Prompt。
- 只有 request_goal=PROMPT（或明确要求制作型修改），status=confirmed，confirmation.revision=revision，且当前创意QC硬项无FAIL/未解决UNKNOWN时才交 T01。
- READY/PROMPT 充分明确的任务可最小简案 direct_ready；委托方向并要求直接成品 -> delegated。不要求重复确认；默认未锁定细节注明即可。
- 核心修改后旧授权失效；更新版本、按新约束重检，只有明确同步授权才可直接继续。执行层不改变核心的调整无需重开创意。

## 4. Director Brief 映射（现有T01）

| Creative Brief | T01字段 |
|---|---|
| primary_genre/logline | theme |
| primary_goal/driver/beats | primary_goal 与故事语境 |
| camera_intent/director_mode_lock | camera_intent/constraints |
| characters/setting/world | characters/setting |
| duration_target_s/aspect_ratio | duration/aspect_ratio |
| assets | references（标可用和待提供；局部编号由T03） |
| dialogue_intent/audio_plan_intent | audio；锁定原文保留 |
| transition_preference | transition_preference；建议不等于授权 |
| constraints/preferences/exclusions/language | constraints/language 与导演决策依据 |

T01依原优先级选择Classic/Adaptive/Cinematic，不因G-ID强制模式。T02划分独立15秒任务并净长核算，T03构建具体镜头状态和真实逐任务图片，T03B处理选用转场，T04音频，T05完整六字段，T06最终QC。创意层beats、session、QC、库ID等不添加为模型字段。跨任务声音/剪辑依现有边界。现有已批准剧本按用户原意直通，不因创意模板擅加小事件、人物或台词。
