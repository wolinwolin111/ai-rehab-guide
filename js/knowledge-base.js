/**
 * AI运动康复思路助手 — 症状知识库 + 匹配引擎
 * 基于10本骨科/康复/解剖学参考书整理
 * 纯规则引擎，JSON知识库驱动
 */

const SYMPTOM_DB = {
  "膝前痛": {
    "id": "knee_pain_front",
    "name": "膝前痛",
    "synonyms": [
      "膝盖痛",
      "膝前痛",
      "髌骨痛",
      "上楼痛",
      "下楼痛",
      "膝盖前方痛",
      "髌腱痛"
    ],
    "related_joints": [
      "膝关节",
      "髋关节",
      "踝关节"
    ],
    "root_causes": [
      {
        "issue": "股四头肌离心控制弱",
        "likelihood": "high",
        "explain": "股四头肌离心控制不足→下蹲/上楼时髌骨轨迹异常→髌股关节压力集中→膝前痛"
      },
      {
        "issue": "臀中肌抑制/激活不足",
        "likelihood": "high",
        "explain": "臀中肌弱→负重时股骨内旋内收→髌骨外侧偏移→髌股关节受力不均→疼痛"
      },
      {
        "issue": "髌骨活动度下降",
        "likelihood": "medium",
        "explain": "髌骨周围软组织粘连/僵硬→髌骨在股骨滑车内滑动受限→屈伸膝时牵拉痛"
      },
      {
        "issue": "踝背屈受限",
        "likelihood": "medium",
        "explain": "踝背屈不足→下蹲时膝关节被迫过多前移代偿→髌股压力增大"
      }
    ],
    "manual_techniques": [
      {
        "name": "髌骨松动术",
        "desc": "坐姿膝伸直放松，徒手将髌骨向上/下/内/外四个方向缓慢推移，每个方向5-8次"
      },
      {
        "name": "股四头肌泡沫轴放松",
        "desc": "俯卧位，泡沫轴置于大腿前侧，从髋前缓慢滚至膝上，痛点停留10-15秒"
      },
      {
        "name": "髂胫束泡沫轴放松",
        "desc": "侧卧位，泡沫轴从髋外侧缓慢滚至膝外侧，每段停留5-8秒"
      }
    ],
    "training": [
      {
        "name": "靠墙静蹲(40°)",
        "sets": "3组×30-60秒",
        "focus": "股四头肌离心耐力",
        "key_points": "【膝不超过脚尖】【屈曲角度从30°起无痛后增至60°】【腰贴墙避免骨盆前倾】【膝盖对准第二脚趾方向】",
        "common_errors": "膝盖超过脚尖→站远些；膝内扣→弹力带置于膝上引导外旋；腰部悬空→收腹贴墙",
        "regression": "减少屈膝角度至30°，缩短保持时间至15秒",
        "progression": "单腿静蹲/手持哑铃/不稳定面",
        "applicable": [
          "膝前痛",
          "髌骨软化",
          "ACL重建后期"
        ]
      },
      {
        "name": "蚌式开合(弹力带)",
        "sets": "3组×15次/侧",
        "focus": "臀中肌/髋外旋肌群激话",
        "key_points": "【骨盆保持中立不后倾】【躯干不动仅髋外旋避免腰椎旋转代偿】【上侧膝打开时足跟保持相贴】",
        "common_errors": "腰部跟着翻转→减小活动幅度；躯干侧倾→减小弹力带阻力",
        "regression": "无弹力带自重完成",
        "progression": "弹力带加重/上侧腿悬空完成",
        "applicable": [
          "膝前痛",
          "ITBS",
          "髋外侧痛"
        ]
      },
      {
        "name": "坐姿伸膝（开链）",
        "sets": "3组×15次",
        "focus": "股四头肌向心+离心控制",
        "key_points": "【末端伸直保持2秒】【慢放离心4秒下放】【无痛范围内完成】",
        "common_errors": "速度过快→控制节奏；伸到过伸位→末端微屈",
        "regression": "减小活动幅度至最后30°",
        "progression": "踝部加重0.5-1kg",
        "applicable": [
          "膝前痛",
          "股四头肌萎缩"
        ]
      },
      {
        "name": "单腿站立",
        "sets": "30秒×3组/侧",
        "focus": "膝-髋-踝协调稳定",
        "key_points": "【膝微屈不锁死】【臀中肌收紧保持骨盆水平】【目视前方固定点】",
        "common_errors": "骨盆向一侧下沉→收紧臀中肌；膝过伸锁死→保持微屈",
        "regression": "手扶墙辅助",
        "progression": "闭眼/不稳定面",
        "applicable": [
          "膝前痛",
          "踝不稳",
          "髋控制弱"
        ]
      }
    ],
    "contraindications": [
      "深蹲至疼痛角度",
      "跳跃/跑跳",
      "全幅度开链伸膝(急性期)",
      "长时间跪姿"
    ]
  },
  "膝内侧痛": {
    "id": "knee_pain_medial",
    "name": "膝内侧痛",
    "synonyms": [
      "膝盖内侧痛",
      "内侧副韧带",
      "MCL",
      "膝内痛"
    ],
    "related_joints": [
      "膝关节",
      "髋关节",
      "踝关节"
    ],
    "root_causes": [
      {
        "issue": "髋内收肌群紧张/短缩",
        "likelihood": "high",
        "explain": "髋内收肌紧张→牵拉内侧膝关节结构→内侧关节线应力增加→疼痛"
      },
      {
        "issue": "臀中肌/臀大肌抑制",
        "likelihood": "high",
        "explain": "臀肌弱→动态膝外翻（下蹲时膝内扣）→内侧副韧带及内侧半月板过度受力"
      },
      {
        "issue": "足弓塌陷/过度旋前",
        "likelihood": "medium",
        "explain": "足弓塌陷→胫骨内旋→膝关节内侧负荷增加→内侧结构牵拉"
      }
    ],
    "manual_techniques": [
      {
        "name": "髋内收肌群拉伸",
        "desc": "坐姿分腿、蝴蝶式拉伸，保持30秒×3组"
      },
      {
        "name": "大腿内侧泡沫轴放松",
        "desc": "俯卧位，泡沫轴置于大腿内侧，缓慢滚动痛点停留"
      },
      {
        "name": "足底筋膜放松",
        "desc": "坐姿用网球滚压足底，从足跟至前脚掌缓慢滚动2分钟/侧"
      }
    ],
    "training": [
      {
        "name": "蚌式开合（弹力带）",
        "sets": "3组×15次/侧",
        "focus": "臀中肌激活→减少膝内扣",
        "key_points": "【骨盆中立不翻】【仅髋外旋不动腰】【足跟相贴】",
        "common_errors": "腰椎旋转代偿→减小幅度",
        "regression": "无弹力带",
        "progression": "弹力带加重",
        "applicable": [
          "膝内侧痛",
          "膝前痛"
        ]
      },
      {
        "name": "侧卧直腿抬高",
        "sets": "3组×12次/侧",
        "focus": "臀中肌+阔筋膜张肌",
        "key_points": "【腿伸直微后伸】【脚尖微内旋更好激活臀中肌】【慢放4秒】",
        "common_errors": "腿前抬过多用到了屈髋肌→腿保持在身体延长线",
        "regression": "减小抬高幅度",
        "progression": "踝部加重0.5-1kg",
        "applicable": [
          "膝内侧痛"
        ]
      },
      {
        "name": "微蹲+膝盖对齐",
        "sets": "3组×15次",
        "focus": "膝-髋协调控制避免内扣",
        "key_points": "【膝盖始终保持对准第二脚趾方向】【下蹲时膝不可内扣】【镜前自我监控】",
        "common_errors": "膝内扣→弹力带置膝上引导外展发力",
        "regression": "减小下蹲深度",
        "progression": "单腿微蹲",
        "applicable": [
          "膝内侧痛",
          "膝前痛"
        ]
      },
      {
        "name": "单腿臀桥",
        "sets": "3组×10次/侧",
        "focus": "臀大肌+核心稳定",
        "key_points": "【臀发力非腰】【肩-髋-膝成直线】【骨盆不旋转】",
        "common_errors": "腰部过伸代偿→收腹保持腰椎中立",
        "regression": "双腿臀桥",
        "progression": "负重/不稳定面",
        "applicable": [
          "膝内侧痛",
          "下背痛"
        ]
      }
    ],
    "contraindications": [
      "急停变向运动",
      "深蹲低于90°",
      "侧向跳跃/滑步"
    ]
  },
  "膝外侧痛": {
    "id": "knee_pain_lateral",
    "name": "膝外侧痛",
    "synonyms": [
      "膝盖外侧痛",
      "ITBS",
      "髂胫束综合征",
      "膝外痛",
      "跑者膝"
    ],
    "related_joints": [
      "膝关节",
      "髋关节"
    ],
    "root_causes": [
      {
        "issue": "髂胫束紧张/摩擦",
        "likelihood": "high",
        "explain": "髂胫束过紧→屈膝20-30°时在外侧股骨髁反复摩擦→炎症+疼痛（常见于跑者）"
      },
      {
        "issue": "臀中肌后束/臀大肌抑制",
        "likelihood": "high",
        "explain": "臀肌弱→阔筋膜张肌/髂胫束过度代偿→张力增高→外侧摩擦加剧"
      },
      {
        "issue": "髋内旋控制不足",
        "likelihood": "medium",
        "explain": "单腿支撑时髋内旋过多→髂胫束张力进一步增加→外侧摩擦→疼痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "髂胫束泡沫轴放松",
        "desc": "侧卧位，泡沫轴从髋外侧至膝外侧缓慢滚动，避开骨性突起，痛点停留15秒"
      },
      {
        "name": "阔筋膜张肌放松",
        "desc": "俯卧位，泡沫轴或按摩球置于髋外侧（裤兜位置），小范围滚动"
      },
      {
        "name": "臀中肌触发点按压",
        "desc": "用按摩球或手指按压臀中肌（髋外侧上方），找到酸痛点按压30秒"
      }
    ],
    "training": [
      {
        "name": "蚌式开合（弹力带）",
        "sets": "3组×15次/侧",
        "focus": "臀中肌激话→减少ITB代偿",
        "key_points": "【骨盆中立】【躯干不动仅髋外旋】【足跟相贴】",
        "common_errors": "腰椎旋转→减小幅度",
        "regression": "无弹力带",
        "progression": "弹力带加重",
        "applicable": [
          "膝外侧痛",
          "膝前痛",
          "髋外侧痛"
        ]
      },
      {
        "name": "单腿臀桥",
        "sets": "3组×12次/侧",
        "focus": "臀大肌激活→减少TFL代偿",
        "key_points": "【臀发力非腰】【肩-髋-膝成直线】【支撑腿稳定不晃】",
        "common_errors": "腰部过伸→收腹收紧核心",
        "regression": "双腿臀桥",
        "progression": "负重",
        "applicable": [
          "膝外侧痛",
          "下背痛"
        ]
      },
      {
        "name": "侧平板+髋外展",
        "sets": "3组×8次/侧",
        "focus": "动态臀中肌耐力",
        "key_points": "【侧卧上方腿外展至30°控制下放4秒】【核心收紧身体不晃】",
        "common_errors": "腿抬太高屈髋代偿→限制幅度30°以内",
        "regression": "无弹力带",
        "progression": "弹力带",
        "applicable": [
          "膝外侧痛"
        ]
      }
    ],
    "contraindications": [
      "长距离跑步(急性期)",
      "下坡跑",
      "单侧反复承重运动"
    ]
  },
  "膝久坐痛": {
    "id": "knee_pain_sitting",
    "name": "膝久坐痛",
    "synonyms": [
      "久坐膝盖痛",
      "久坐膝痛",
      "坐久膝盖僵痛"
    ],
    "related_joints": [
      "膝关节",
      "髋关节"
    ],
    "root_causes": [
      {
        "issue": "股四头肌/腘绳肌柔韧性不足",
        "likelihood": "high",
        "explain": "长时间屈膝→股四头肌/腘绳肌适应缩短位→站起时软组织瞬间牵拉→疼痛/僵硬"
      },
      {
        "issue": "髌骨活动度受限",
        "likelihood": "medium",
        "explain": "久坐不动→髌骨周围软组织僵硬→站起首次屈伸时牵拉痛"
      },
      {
        "issue": "关节液循环不畅",
        "likelihood": "medium",
        "explain": "长时间不活动→关节滑液循环减慢→关节面润滑不足→初始活动时僵硬/摩擦感"
      }
    ],
    "manual_techniques": [
      {
        "name": "股四头肌拉伸",
        "desc": "站立位，一手扶墙，同侧手握踝将脚跟拉向臀部，保持30秒"
      },
      {
        "name": "腘绳肌拉伸",
        "desc": "坐姿伸膝勾脚尖，躯干前倾至大腿后侧牵拉感，保持30秒"
      },
      {
        "name": "髌骨松动术",
        "desc": "坐姿膝伸直，徒手将髌骨上下内外推移，各方向5-8次"
      }
    ],
    "training": [
      {
        "name": "坐姿伸膝(开链)",
        "sets": "3组×15次",
        "focus": "股四头肌激活+关节液循环",
        "key_points": "【末端伸直保持2秒】【慢放4秒】【无痛范围】",
        "common_errors": "太快→控制节奏",
        "regression": "减少幅度",
        "progression": "踝加重",
        "applicable": [
          "膝久坐痛"
        ]
      },
      {
        "name": "靠墙静蹲(40°)",
        "sets": "3组×45秒",
        "focus": "股四头肌等长耐力",
        "key_points": "【膝不超过脚尖】【腰贴墙】【膝对准第二脚趾】",
        "common_errors": "膝内扣→弹力带引导",
        "regression": "浅蹲30°",
        "progression": "单腿",
        "applicable": [
          "膝久坐痛",
          "膝前痛"
        ]
      }
    ],
    "contraindications": [
      "长时间不动后→先小范围活动再全范围活动"
    ]
  },
  "肩抬不起来": {
    "id": "shoulder_elevation_pain",
    "name": "肩抬不起来",
    "synonyms": [
      "肩抬不起",
      "肩膀抬不起来",
      "肩外展受限",
      "抬手痛",
      "肩关节受限",
      "肩举不高"
    ],
    "related_joints": [
      "肩关节",
      "肩胛胸壁关节",
      "颈椎"
    ],
    "root_causes": [
      {
        "issue": "肩袖肌群（冈上肌）病变/激惹",
        "likelihood": "high",
        "explain": "冈上肌肌腱在肩峰下空间被挤压→外展60-120°（疼痛弧）时疼痛→抬不起来"
      },
      {
        "issue": "肩胛骨上旋不足",
        "likelihood": "high",
        "explain": "前锯肌/斜方肌上下束协同失调→肩胛骨上旋不足→肱骨头与肩峰过早碰撞→抬手受限"
      },
      {
        "issue": "胸小肌/后关节囊紧张",
        "likelihood": "medium",
        "explain": "胸小肌短缩→肩胛骨前倾内旋→肩峰下空间减小；后关节囊紧→肱骨头前移→撞击"
      }
    ],
    "manual_techniques": [
      {
        "name": "胸小肌拉伸",
        "desc": "站立门框边，手臂扶门框，躯干前倾至胸肌牵拉感，保持30秒"
      },
      {
        "name": "后关节囊拉伸",
        "desc": "侧卧，患侧在下，患侧手臂屈肘90°放于胸前，对侧手将患侧前臂向下轻压至肩后牵拉感"
      },
      {
        "name": "上斜方肌放松",
        "desc": "坐姿，用对侧手按摩/按压患侧肩上斜方肌，或用筋膜球靠墙按压"
      }
    ],
    "training": [
      {
        "name": "前锯肌推墙",
        "sets": "3组×12次",
        "focus": "前锯肌激活→改善肩胛上旋",
        "key_points": "【双手推墙肩胛骨向前推出不要耸肩】【保持手臂伸直】【感受肩胛骨内侧离开胸壁】",
        "common_errors": "耸肩代偿→放松上斜方肌；肘弯→保持肘伸直",
        "regression": "四足跪姿前锯肌激活(猫式位)",
        "progression": "脚离墙更远/不稳定面",
        "applicable": [
          "肩抬不起来",
          "肩撞击",
          "翼状肩"
        ]
      },
      {
        "name": "弹力带肩外旋",
        "sets": "3组×15次",
        "focus": "冈下肌/小圆肌强化→肱骨头稳定",
        "key_points": "【肘贴体侧夹毛巾不松开】【只做肩外旋不前臂摆动】【慢放4秒】",
        "common_errors": "肘离开身体→腋下夹毛巾；身体后仰代偿→靠墙做",
        "regression": "减轻弹力带阻力",
        "progression": "加重阻力/外展90°位外旋",
        "applicable": [
          "肩抬不起来",
          "肩袖损伤"
        ]
      },
      {
        "name": "仰卧肩屈曲(棍子辅助)",
        "sets": "3组×10次",
        "focus": "无痛范围肩屈曲活动度",
        "key_points": "【仰卧用健侧手+棍子辅助患侧上举】【慢速控制在无痛范围】【到最大无痛点保持5秒】",
        "common_errors": "耸肩→保持肩下沉；太快→慢速控制",
        "regression": "减小活动范围",
        "progression": "增加活动范围至全范围",
        "applicable": [
          "肩抬不起来",
          "肩周炎"
        ]
      }
    ],
    "contraindications": [
      "快速过顶举重",
      "无保护范围的外展",
      "大重量肩推"
    ]
  },
  "肩外展痛": {
    "id": "shoulder_abduction_pain",
    "name": "肩外展痛",
    "synonyms": [
      "肩外展疼",
      "肩膀外展痛",
      "抬手侧面痛",
      "肩峰撞击"
    ],
    "related_joints": [
      "肩关节",
      "肩胛胸壁关节"
    ],
    "root_causes": [
      {
        "issue": "肩峰下撞击综合征",
        "likelihood": "high",
        "explain": "肩峰下空间狭窄→冈上肌腱/肩峰下滑囊在外展时被挤压→60-120°出现疼痛弧"
      },
      {
        "issue": "肩袖肌群力量失衡",
        "likelihood": "high",
        "explain": "三角肌过度主导→肱骨头上移→肩峰下空间减小→外展时撞击"
      },
      {
        "issue": "肩胛骨稳定性不足",
        "likelihood": "medium",
        "explain": "肩胛骨动态稳定差→外展时肩胛骨上旋延迟→肱骨头与肩峰提前碰撞"
      }
    ],
    "manual_techniques": [
      {
        "name": "肩峰下间隙松动",
        "desc": "坐姿手臂下垂，用对侧手将肱骨头向下轻拉(长轴牵引)"
      },
      {
        "name": "胸小肌拉伸",
        "desc": "门框拉伸，保持30秒×3组"
      }
    ],
    "training": [
      {
        "name": "弹力带肩外旋",
        "sets": "3组×15次",
        "focus": "冈下肌/小圆肌→肱骨头下压",
        "key_points": "【肘贴体侧毛巾不松】【只外旋不摆臂】【慢放4秒】",
        "common_errors": "肘离体→夹毛巾",
        "regression": "减阻力",
        "progression": "外展90°位",
        "applicable": [
          "肩外展痛"
        ]
      },
      {
        "name": "前锯肌推墙",
        "sets": "3组×12次",
        "focus": "前锯肌→肩胛上旋",
        "key_points": "【手臂伸直推墙】【肩胛骨前推不耸肩】",
        "common_errors": "耸肩→放松上斜方肌",
        "regression": "四足跪姿",
        "progression": "脚更远",
        "applicable": [
          "肩外展痛"
        ]
      },
      {
        "name": "肩胛骨后缩练习",
        "sets": "3组×12次",
        "focus": "菱形肌/中斜方肌",
        "key_points": "【坐姿双手拉弹力带向身体】【肩胛骨向内夹紧保持2秒】【不耸肩】",
        "common_errors": "耸肩→先下沉再后缩",
        "regression": "无弹力带",
        "progression": "弹力带加重",
        "applicable": [
          "肩外展痛"
        ]
      }
    ],
    "contraindications": [
      "大重量肩上推举",
      "反复过顶投掷动作",
      "侧卧患侧睡"
    ]
  },
  "肩后伸痛": {
    "id": "shoulder_extension_pain",
    "name": "肩后伸痛",
    "synonyms": [
      "肩后伸疼",
      "肩膀后伸痛",
      "手臂后伸痛"
    ],
    "related_joints": [
      "肩关节"
    ],
    "root_causes": [
      {
        "issue": "肱二头肌长头腱炎",
        "likelihood": "high",
        "explain": "肱二头肌长头腱在结节间沟反复摩擦→后伸时肌腱牵拉→疼痛"
      },
      {
        "issue": "前关节囊/喙肱韧带紧张",
        "likelihood": "medium",
        "explain": "长期圆肩姿势→前关节囊挛缩→后伸时前方结构牵拉受限→疼痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "肱二头肌长头腱放松",
        "desc": "坐姿手臂外旋，在结节间沟(肩前)用拇指横向按摩"
      },
      {
        "name": "前关节囊拉伸",
        "desc": "仰卧位，肩下垫毛巾，手臂自然下垂外旋位拉伸前关节囊"
      }
    ],
    "training": [
      {
        "name": "弹力带划船",
        "sets": "3组×15次",
        "focus": "菱形肌/后三角肌→改善肩胛稳定",
        "key_points": "【肘贴近身体向后拉】【肩胛骨夹紧保持2秒】【控制前伸4秒】",
        "common_errors": "耸肩→先下沉再划船",
        "regression": "轻弹力带",
        "progression": "重弹力带",
        "applicable": [
          "肩后伸痛"
        ]
      },
      {
        "name": "仰卧肩后伸(无负重)",
        "sets": "3组×10次",
        "focus": "无痛范围后伸活动度",
        "key_points": "【仰卧手臂在体侧下滑→后伸至无痛范围】【保持5秒后回位】",
        "common_errors": "躯干抬起代偿→保持仰卧",
        "regression": "减小幅度",
        "progression": "手持轻物",
        "applicable": [
          "肩后伸痛"
        ]
      }
    ],
    "contraindications": [
      "过大范围后伸",
      "负重后伸"
    ]
  },
  "肩夜间痛": {
    "id": "shoulder_night_pain",
    "name": "肩夜间痛",
    "synonyms": [
      "肩膀夜间痛",
      "晚上肩痛",
      "睡觉肩膀痛",
      "肩周炎夜间痛"
    ],
    "related_joints": [
      "肩关节",
      "颈椎"
    ],
    "root_causes": [
      {
        "issue": "肩袖肌腱炎/肩峰下滑囊炎",
        "likelihood": "high",
        "explain": "日间使用后炎症反应在夜间累积→夜间静卧代谢减慢→炎性物质刺激→疼痛加重"
      },
      {
        "issue": "肩周炎(冻结肩)早期",
        "likelihood": "medium",
        "explain": "关节囊炎症+纤维化过程→夜间静卧不动局部循环变差→疼痛→活动后稍缓解"
      },
      {
        "issue": "颈椎源性肩痛",
        "likelihood": "medium",
        "explain": "C4-C5神经根受刺激→肩部放射痛→夜间颈椎姿势不良加重"
      }
    ],
    "manual_techniques": [
      {
        "name": "冷敷/热敷交替",
        "desc": "急性期冷敷肩前外侧15分钟；缓解期热敷10分钟促进循环"
      },
      {
        "name": "睡眠姿势调整",
        "desc": "患侧在上，腋下和前臂下垫枕头支撑，避免患侧受压；仰卧时手臂下放小枕"
      }
    ],
    "training": [
      {
        "name": "钟摆运动",
        "sets": "顺时针+逆时针各20圈×3组",
        "focus": "无负荷关节活动→促进滑液循环",
        "key_points": "【躯干前倾手臂自然下垂】【身体带动手臂摆动非肩主动发力】【小幅度开始】",
        "common_errors": "肩主动发力→身体带动；幅度太大→减小幅度",
        "regression": "更小幅度",
        "progression": "手持0.5kg轻物",
        "applicable": [
          "肩夜间痛",
          "肩周炎"
        ]
      },
      {
        "name": "仰卧被动肩外旋",
        "sets": "3组×10次",
        "focus": "无痛关节活动度维持",
        "key_points": "【仰卧肘屈90°放体侧】【健侧手辅助患侧前臂外旋】【无痛范围保持10秒】",
        "common_errors": "肘离开身体→保持肘贴体侧",
        "regression": "小范围",
        "progression": "增大范围",
        "applicable": [
          "肩夜间痛"
        ]
      }
    ],
    "contraindications": [
      "侧卧患侧睡",
      "日间过度使用后再加重夜间训练"
    ]
  },
  "肩侧睡痛": {
    "id": "shoulder_side_sleep_pain",
    "name": "肩侧睡痛",
    "synonyms": [
      "侧睡肩痛",
      "侧卧肩膀痛"
    ],
    "related_joints": [
      "肩关节"
    ],
    "root_causes": [
      {
        "issue": "肩袖肌腱受压",
        "likelihood": "high",
        "explain": "侧睡时体重压在肩峰下组织→肩袖肌腱/滑囊受压缺血→疼痛→醒来活动后缓解"
      },
      {
        "issue": "肩锁关节病变",
        "likelihood": "medium",
        "explain": "肩锁关节退行性变→侧卧时肩峰上缘受压→疼痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "睡眠姿势调整",
        "desc": "腋下和前臂各放一个枕头支撑，避免直接压在肩关节上；或仰卧手臂下垫枕"
      }
    ],
    "training": [
      {
        "name": "弹力带肩外旋",
        "sets": "3组×15次",
        "focus": "冈下肌/小圆肌→加强肩袖保护",
        "key_points": "【肘贴体侧】【慢放4秒】",
        "common_errors": "肘离体→夹毛巾",
        "regression": "减阻力",
        "progression": "加阻",
        "applicable": [
          "肩侧睡痛"
        ]
      }
    ],
    "contraindications": [
      "侧卧患侧"
    ]
  },
  "下背痛": {
    "id": "low_back_pain",
    "name": "下背痛",
    "synonyms": [
      "腰痛",
      "下背酸",
      "腰椎痛",
      "下腰痛"
    ],
    "related_joints": [
      "腰椎",
      "胸椎",
      "髋关节"
    ],
    "root_causes": [
      {
        "issue": "胸椎伸展不足",
        "likelihood": "high",
        "explain": "胸椎活动受限→腰椎被迫代偿过度伸展/屈曲→负荷时腰椎承受超出设计的压力→疼痛"
      },
      {
        "issue": "腘绳肌紧张",
        "likelihood": "high",
        "explain": "腘绳肌柔韧性不足→限制骨盆前倾→弯腰时腰椎屈曲代偿→椎间盘后方压力增加"
      },
      {
        "issue": "腹横肌/多裂肌激活延迟",
        "likelihood": "high",
        "explain": "深层核心稳定肌肉激活不足/延迟→腰椎在负荷下失去节段稳定→软组织过劳/关节突压力↑"
      },
      {
        "issue": "髋屈肌(髂腰肌)紧张",
        "likelihood": "medium",
        "explain": "久坐致髋屈肌短缩→骨盆前倾→腰椎前凸增大→后关节突压力增加+椎间孔狭窄"
      }
    ],
    "manual_techniques": [
      {
        "name": "胸椎猫牛式",
        "desc": "四足跪姿，逐节活动胸椎，专注胸段而非腰段，10次缓慢完成"
      },
      {
        "name": "腘绳肌拉伸",
        "desc": "坐姿或仰卧位，伸膝勾脚尖，保持腰贴地/直立不弓，保持30秒"
      },
      {
        "name": "腹横肌激活",
        "desc": "仰卧位屈膝，肚脐向脊柱方向下沉，感受深层腹部收紧，保持正常呼吸，10次×5秒"
      },
      {
        "name": "髋屈肌拉伸",
        "desc": "半跪姿（弓步位），后侧腿髋前部有牵拉感，躯干直立不前倾，30秒×3组"
      }
    ],
    "training": [
      {
        "name": "死虫式",
        "sets": "3组×10次/侧",
        "focus": "核心抗伸展稳定+腹横肌/多裂肌协调",
        "key_points": "【腰部始终贴地不弓起】【对侧手脚同步缓慢伸出】【正常呼吸不憋气】【动作速度：伸出4秒收回2秒】",
        "common_errors": "腰部弓起→减小活动幅度；憋气→正常呼吸；太快→慢速控制",
        "regression": "仅伸腿不伸手；或单腿/单手交替",
        "progression": "手持轻物/踝加重/伸直后保持3秒",
        "applicable": [
          "下背痛",
          "核心不稳",
          "腰椎间盘突出(康复期)"
        ]
      },
      {
        "name": "鸟狗式",
        "sets": "3组×8次/侧",
        "focus": "抗旋转+脊柱中立+多裂肌",
        "key_points": "【脊柱保持中立不旋转不塌腰】【对侧手脚同高】【骨盆不晃动保持水平】【伸出保持3秒】",
        "common_errors": "腰部下塌→收紧腹部；骨盆旋转→减小幅度",
        "regression": "仅抬腿，保持脊柱中立",
        "progression": "保持5秒/不平稳面/踝加负重",
        "applicable": [
          "下背痛",
          "核心不稳"
        ]
      },
      {
        "name": "臀桥",
        "sets": "3组×15次",
        "focus": "髋伸肌群(臀大肌/腘绳肌)模式重建",
        "key_points": "【臀发力上顶非腰】【肩-髋-膝成直线不过伸】【顶端臀收紧2秒慢放4秒】",
        "common_errors": "腰过伸→收紧臀+腹；腘绳肌抽筋→减小幅度",
        "regression": "静态臀桥保持30秒",
        "progression": "单腿臀桥/负重",
        "applicable": [
          "下背痛",
          "臀肌失忆"
        ]
      },
      {
        "name": "猫牛式",
        "sets": "10次慢速",
        "focus": "脊柱逐节活动度+胸腰椎分离",
        "key_points": "【从尾骨开始逐节活动至颈椎】【注意胸段活动非腰段】【配合呼吸：牛式吸-猫式呼】",
        "common_errors": "仅活动腰段→想象胸椎逐节推动；太快→慢速",
        "regression": "坐姿猫牛（脊柱活动）",
        "progression": "站立位",
        "applicable": [
          "下背痛",
          "胸椎僵硬"
        ]
      },
      {
        "name": "侧平板(膝支撑)",
        "sets": "3组×20-30秒/侧",
        "focus": "腰方肌+腹斜肌抗侧屈",
        "key_points": "【身体成直线不塌腰】【下方膝支撑减载】【正常呼吸】",
        "common_errors": "身体前倾→保持直线；腰部下塌→收紧核心",
        "regression": "缩短保持时间",
        "progression": "全侧平板/抬上腿",
        "applicable": [
          "下背痛"
        ]
      }
    ],
    "contraindications": [
      "仰卧起坐(腹直肌主导弯腰加大椎间盘压力)",
      "脊柱过伸",
      "直腿硬拉(直至核心控制恢复)",
      "久坐不动>30分钟"
    ]
  },
  "久坐腰痛": {
    "id": "low_back_pain_sitting",
    "name": "久坐腰痛",
    "synonyms": [
      "久坐腰酸",
      "坐久了腰痛",
      "办公腰痛"
    ],
    "related_joints": [
      "腰椎",
      "髋关节"
    ],
    "root_causes": [
      {
        "issue": "髋屈肌(髂腰肌)短缩",
        "likelihood": "high",
        "explain": "长时间屈髋坐位→髂腰肌适应缩短→站起时牵拉腰椎前凸→后关节突挤压→疼痛"
      },
      {
        "issue": "臀肌失忆(臀肌抑制)",
        "likelihood": "high",
        "explain": "久坐臀肌长期不发力→站起后腰椎/腘绳肌代偿髋伸→腰部过劳"
      },
      {
        "issue": "核心耐力不足",
        "likelihood": "medium",
        "explain": "维持坐姿需要核心持续低水平激活→核心耐力差→腰部肌肉疲劳→酸痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "髋屈肌拉伸",
        "desc": "半跪姿后腿髋前牵拉30秒×3组"
      },
      {
        "name": "臀部泡沫轴放松",
        "desc": "坐泡沫轴上，一侧臀下滚动，找到酸痛点停留15秒"
      }
    ],
    "training": [
      {
        "name": "死虫式",
        "sets": "3组×10次/侧",
        "focus": "核心稳定",
        "key_points": "【腰贴地】【慢速】【呼吸正常】",
        "common_errors": "腰弓→减小幅度",
        "regression": "仅伸腿",
        "progression": "伸保持3秒",
        "applicable": [
          "久坐腰痛"
        ]
      },
      {
        "name": "臀桥",
        "sets": "3组×15次",
        "focus": "臀肌激活→减少腰代偿",
        "key_points": "【臀发力】【肩-髋-膝直线】【顶端保持2秒】",
        "common_errors": "腰过伸→收腹",
        "regression": "静态保持",
        "progression": "单腿",
        "applicable": [
          "久坐腰痛"
        ]
      },
      {
        "name": "靠墙深蹲(核心支撑)",
        "sets": "3组×12次",
        "focus": "核心+下肢协调",
        "key_points": "【腰全程贴墙】【膝不超过脚尖】【腹横肌收紧】",
        "common_errors": "腰悬空→收腹贴墙",
        "regression": "浅蹲",
        "progression": "单腿",
        "applicable": [
          "久坐腰痛"
        ]
      }
    ],
    "contraindications": [
      "久坐超过30分钟不活动",
      "坐姿弯腰搬重物"
    ]
  },
  "弯腰痛": {
    "id": "low_back_pain_bending",
    "name": "弯腰痛",
    "synonyms": [
      "弯腰疼",
      "前弯腰痛",
      "俯身腰痛"
    ],
    "related_joints": [
      "腰椎",
      "髋关节"
    ],
    "root_causes": [
      {
        "issue": "腰椎间盘源性疼痛",
        "likelihood": "high",
        "explain": "弯腰时椎间盘前部受压→髓核向后移位→压迫纤维环后部→疼痛（椎间盘源性）"
      },
      {
        "issue": "腘绳肌紧张限制骨盆前倾",
        "likelihood": "high",
        "explain": "腘绳肌紧→弯腰时骨盆不能正常前倾→腰椎被迫过度屈曲→椎间盘/韧带受力增大"
      },
      {
        "issue": "髋屈肌紧张",
        "likelihood": "medium",
        "explain": "髋屈肌紧→站姿骨盆前倾→腰椎前凸增大→弯腰起始位腰椎已在拉紧状态→更易痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "腘绳肌拉伸",
        "desc": "仰卧伸膝勾脚尖，用毛巾辅助，保持腰贴地，30秒×3组"
      },
      {
        "name": "髋屈肌拉伸",
        "desc": "半跪姿后腿髋前牵拉30秒×3组"
      }
    ],
    "training": [
      {
        "name": "鸟狗式",
        "sets": "3组×8次/侧",
        "focus": "多裂肌+脊柱稳定性",
        "key_points": "【脊柱中立不塌腰】【对侧伸出保持3秒】【骨盆稳定不转】",
        "common_errors": "塌腰→收紧腹部",
        "regression": "仅抬腿",
        "progression": "保持5秒",
        "applicable": [
          "弯腰痛"
        ]
      },
      {
        "name": "死虫式",
        "sets": "3组×10次/侧",
        "focus": "核心抗屈曲",
        "key_points": "【腰贴地】【慢速4秒伸】【正常呼吸】",
        "common_errors": "腰弓→减小幅度",
        "regression": "仅伸腿",
        "progression": "保持3秒",
        "applicable": [
          "弯腰痛"
        ]
      },
      {
        "name": "罗马尼亚硬拉(自重→轻壶铃)",
        "sets": "3组×12次",
        "focus": "髋铰链模式重建",
        "key_points": "【腰保持中立不弓不伸】【髋后移非弯腰】【腘绳肌拉伸感非腰痛】【膝微屈】",
        "common_errors": "弯腰→髋铰链练习；腰弓→镜子监控",
        "regression": "仅自重髋铰链靠墙练习",
        "progression": "壶铃/哑铃",
        "applicable": [
          "弯腰痛"
        ]
      }
    ],
    "contraindications": [
      "直腿弯腰够脚尖(急性期)",
      "负重弯腰",
      "仰卧起坐"
    ]
  },
  "晨起腰痛": {
    "id": "low_back_pain_morning",
    "name": "晨起腰痛",
    "synonyms": [
      "晨起腰僵",
      "早上腰痛",
      "睡醒腰痛",
      "晨僵腰痛"
    ],
    "related_joints": [
      "腰椎",
      "骶髂关节"
    ],
    "root_causes": [
      {
        "issue": "椎间盘夜间吸水膨胀",
        "likelihood": "high",
        "explain": "卧位椎间盘减压吸水膨胀→晨起椎间盘内压升高→活动20-30分钟后水分挤出疼痛缓解"
      },
      {
        "issue": "骶髂关节僵硬",
        "likelihood": "medium",
        "explain": "夜间不动→骶髂关节周围软组织僵硬→晨起首次负重痛→活动后好转"
      },
      {
        "issue": "床垫支撑不当",
        "likelihood": "medium",
        "explain": "床垫过软→腰椎塌陷→整夜不良姿势→晨起腰部肌肉疲劳/关节僵硬"
      }
    ],
    "manual_techniques": [
      {
        "name": "猫牛式(床上做)",
        "desc": "醒后不急于起床，在床上四足跪姿缓慢做猫牛式10次→促进椎间盘液体平衡"
      },
      {
        "name": "双膝抱胸",
        "desc": "仰卧双膝抱于胸前，轻柔左右摇摆→放松腰部软组织"
      }
    ],
    "training": [
      {
        "name": "猫牛式",
        "sets": "10次慢速×2组(晨起必做)",
        "focus": "脊柱逐节活动→促进椎间盘液体平衡",
        "key_points": "【从尾骨逐节到颈椎】【幅度从小到大】【配合呼吸】",
        "common_errors": "太快→慢速逐节",
        "regression": "坐姿猫牛",
        "progression": "站立猫牛",
        "applicable": [
          "晨起腰痛"
        ]
      },
      {
        "name": "骨盆卷动",
        "sets": "15次",
        "focus": "腰椎-骨盆节律",
        "key_points": "【仰卧屈膝骨盆后倾→逐节卷起→逐节放下】【与呼吸配合】",
        "common_errors": "整段抬起→逐节卷动",
        "regression": "小幅度",
        "progression": "单腿",
        "applicable": [
          "晨起腰痛"
        ]
      }
    ],
    "contraindications": [
      "晨起立即弯腰/负重",
      "不活动直接开始一天"
    ]
  },
  "低头痛": {
    "id": "neck_pain_flexion",
    "name": "低头痛",
    "synonyms": [
      "低头颈椎痛",
      "低头脖子痛",
      "颈椎屈曲痛",
      "看手机脖子痛"
    ],
    "related_joints": [
      "颈椎",
      "上胸椎"
    ],
    "root_causes": [
      {
        "issue": "颈后肌群(上斜方肌/肩胛提肌)过度牵拉",
        "likelihood": "high",
        "explain": "低头时头前倾→力矩增大→颈后肌群需更大力量拉住头→肌肉过劳→疼痛"
      },
      {
        "issue": "上胸椎屈曲僵硬",
        "likelihood": "high",
        "explain": "上胸椎伸展不足→低头时颈部代偿性过度屈曲→颈后软组织牵拉"
      },
      {
        "issue": "深层颈屈肌(头长肌/颈长肌)抑制",
        "likelihood": "medium",
        "explain": "深层颈屈肌弱→头前倾姿势→浅层肌群(胸锁乳突肌/斜角肌)代偿→疲劳+紧张"
      }
    ],
    "manual_techniques": [
      {
        "name": "上斜方肌拉伸",
        "desc": "坐姿一手轻拉头部向对侧侧屈，另一手固定肩部，保持30秒"
      },
      {
        "name": "肩胛提肌放松",
        "desc": "找到颈后侧肩胛提肌(肩胛骨内上角上方)，用对侧手指按压酸痛点30秒"
      },
      {
        "name": "胸椎泡沫轴伸展",
        "desc": "仰卧泡沫轴置于上胸椎下方，手臂抱头后仰，缓慢伸展上胸椎"
      }
    ],
    "training": [
      {
        "name": "深层颈屈肌训练(收下巴)",
        "sets": "3组×10次保持5秒",
        "focus": "头长肌/颈长肌激活→纠正头前倾",
        "key_points": "【仰卧/站立后脑勺向后平移收下巴如做双下巴】【保持眼水平不低头】【后脑轻微离地/离墙感】",
        "common_errors": "下巴向下点头→向后平移收下巴；头后仰→保持眼平视",
        "regression": "仰卧位低负荷",
        "progression": "站立位/四足位",
        "applicable": [
          "低头痛",
          "颈椎病",
          "头前倾"
        ]
      },
      {
        "name": "胸椎猫牛式(坐姿)",
        "sets": "10次",
        "focus": "上胸椎活动度→减少颈椎代偿",
        "key_points": "【坐姿双手扶膝】【逐节活动上胸椎】【颈椎跟随但不主导】",
        "common_errors": "仅动脖子→想象胸骨前后移动",
        "regression": "小幅度",
        "progression": "四足跪姿",
        "applicable": [
          "低头痛"
        ]
      },
      {
        "name": "肩胛骨后缩+下沉",
        "sets": "3组×12次",
        "focus": "中下斜方肌→改善肩胛位置",
        "key_points": "【肩胛骨向内→向下夹紧保持2秒】【不耸肩】",
        "common_errors": "耸肩→先下沉再夹紧",
        "regression": "无阻力",
        "progression": "弹力带划船",
        "applicable": [
          "低头痛",
          "颈肩酸沉重"
        ]
      }
    ],
    "contraindications": [
      "长时间低头看手机>10分钟不休息",
      "快速大幅度颈部旋转"
    ]
  },
  "转头痛": {
    "id": "neck_pain_rotation",
    "name": "转头痛",
    "synonyms": [
      "颈椎旋转痛",
      "转头脖子痛",
      "扭头颈痛"
    ],
    "related_joints": [
      "颈椎"
    ],
    "root_causes": [
      {
        "issue": "颈旋转肌群(头夹肌/颈夹肌/胸锁乳突肌)紧张",
        "likelihood": "high",
        "explain": "长时间固定姿势→旋转肌群紧张/痉挛→主动旋转时牵拉→疼痛+受限"
      },
      {
        "issue": "颈椎小关节紊乱",
        "likelihood": "medium",
        "explain": "颈椎小关节微小错位→旋转时关节面异常接触→疼痛+保护性肌痉挛"
      },
      {
        "issue": "上颈椎(C1-C2)活动度下降",
        "likelihood": "medium",
        "explain": "上颈椎旋转占颈部旋转50%→C1-C2僵硬→下颈椎过度旋转代偿→疼痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "胸锁乳突肌放松",
        "desc": "找到颈部前外侧胸锁乳突肌，用拇指和食指轻柔捏揉，从上至下"
      },
      {
        "name": "颈后肌群热敷",
        "desc": "热毛巾敷颈后10分钟→放松肌肉"
      }
    ],
    "training": [
      {
        "name": "无痛旋转活动度练习",
        "sets": "10次/方向×3组",
        "focus": "维持旋转活动度",
        "key_points": "【坐姿身体不动】【仅颈部缓慢转至无痛范围极限保持5秒】【慢速回正】",
        "common_errors": "身体跟随转→保持肩/躯干不动；太快→慢速",
        "regression": "小幅度",
        "progression": "手指轻压辅助加压",
        "applicable": [
          "转头痛"
        ]
      },
      {
        "name": "深层颈屈肌训练",
        "sets": "3组×10次保持5秒",
        "focus": "颈椎稳定",
        "key_points": "【收下巴向后平移】【保持眼平视】",
        "common_errors": "低头→平移；头后仰→保持水平",
        "regression": "仰卧",
        "progression": "站立",
        "applicable": [
          "转头痛"
        ]
      }
    ],
    "contraindications": [
      "快速大幅度转头",
      "不当的颈部正骨/高速度手法"
    ]
  },
  "落枕": {
    "id": "neck_stiff_neck",
    "name": "落枕",
    "synonyms": [
      "睡落枕",
      "脖子动不了",
      "急性颈椎痛",
      "歪脖子"
    ],
    "related_joints": [
      "颈椎"
    ],
    "root_causes": [
      {
        "issue": "颈肌急性痉挛/拉伤",
        "likelihood": "high",
        "explain": "睡眠姿势不良→某一侧颈肌长时间被牵拉→肌肉痉挛/微小拉伤→醒来剧痛+活动受限"
      },
      {
        "issue": "颈椎小关节嵌顿",
        "likelihood": "medium",
        "explain": "睡眠中颈椎某节段小关节轻微错位/嵌顿→周围肌肉保护性痉挛→痛+活动受限"
      }
    ],
    "manual_techniques": [
      {
        "name": "热敷",
        "desc": "热毛巾/热水袋敷患侧颈肩部15-20分钟，每隔2-3小时一次→缓解痉挛"
      },
      {
        "name": "轻柔按摩",
        "desc": "用指腹轻柔按压患侧斜方肌/肩胛提肌酸痛点，力度以不加重疼痛为准"
      }
    ],
    "training": [
      {
        "name": "无痛小幅度活动",
        "sets": "每个方向5次×每2小时",
        "focus": "温和恢复活动度",
        "key_points": "【仅活动到无痛范围】【速度极慢】【不追求活动度】",
        "common_errors": "活动太大/太快→疼痛加重",
        "regression": "极小幅度(5-10°)",
        "progression": "随疼痛减轻逐渐增加幅度",
        "applicable": [
          "落枕"
        ]
      },
      {
        "name": "放松颈侧肌肉(疼痛减轻后)",
        "sets": "10次保持5秒",
        "focus": "恢复活动度+放松",
        "key_points": "【头缓慢向非痛侧侧屈至轻度牵拉感保持5秒/回正】",
        "common_errors": "过度拉伸→疼痛加重",
        "regression": "更小幅度",
        "progression": "加大幅度",
        "applicable": [
          "落枕"
        ]
      }
    ],
    "contraindications": [
      "用力掰/甩头",
      "找人强行正骨",
      "深部热疗(急性24h内)",
      "继续不良姿势"
    ]
  },
  "颈肩酸沉重": {
    "id": "neck_shoulder_heavy",
    "name": "颈肩酸沉重",
    "synonyms": [
      "颈肩酸",
      "肩膀沉",
      "脖子和肩酸",
      "斜方肌酸"
    ],
    "related_joints": [
      "颈椎",
      "肩关节"
    ],
    "root_causes": [
      {
        "issue": "上斜方肌/肩胛提肌长期紧张",
        "likelihood": "high",
        "explain": "长期头前倾+耸肩姿势→上斜方肌/肩胛提肌持续低水平收缩→代谢废物堆积→酸沉重感"
      },
      {
        "issue": "中下斜方肌/菱形肌抑制",
        "likelihood": "high",
        "explain": "中下斜方肌弱→肩胛骨前倾内旋→上斜方肌过度代偿→持续紧张疲劳"
      },
      {
        "issue": "呼吸模式异常(胸式呼吸为主)",
        "likelihood": "medium",
        "explain": "过度使用斜角肌/胸锁乳突肌辅助呼吸→颈肩肌肉过劳→酸胀"
      }
    ],
    "manual_techniques": [
      {
        "name": "上斜方肌拉伸",
        "desc": "坐姿一侧手轻拉头部向对侧侧屈，另一手固定肩部，30秒×3组"
      },
      {
        "name": "肩胛提肌按压",
        "desc": "按压颈后侧肩胛骨内上角上方的酸痛点，保持30秒×3点"
      },
      {
        "name": "泡沫轴上胸椎伸展",
        "desc": "仰卧泡沫轴置上胸椎，手臂抱头后仰→伸展胸椎→打开胸腔"
      }
    ],
    "training": [
      {
        "name": "中下斜方肌激活",
        "sets": "3组×15次",
        "focus": "中下斜方肌/菱形肌→减少上斜方肌代偿",
        "key_points": "【坐姿或俯卧，手臂呈W形→肩胛向下+向内夹紧保持2秒】【不耸肩】【想象肩胛骨向下滑入后裤兜】",
        "common_errors": "耸肩→用上斜方肌了！先下沉再夹紧",
        "regression": "无阻力",
        "progression": "弹力带/小哑铃",
        "applicable": [
          "颈肩酸沉重",
          "低头痛"
        ]
      },
      {
        "name": "深层颈屈肌训练",
        "sets": "3组×10次保持5秒",
        "focus": "头颈稳定→减少浅层肌代偿",
        "key_points": "【收下巴向后平移】【保持眼平视】【后脑轻轻向后向上延伸感】",
        "common_errors": "低头→平移收下巴",
        "regression": "仰卧",
        "progression": "站立",
        "applicable": [
          "颈肩酸沉重"
        ]
      },
      {
        "name": "腹式呼吸练习",
        "sets": "5分钟×2组/日",
        "focus": "纠正胸式呼吸→减少斜角肌/胸锁乳突肌过劳",
        "key_points": "【仰卧一手放胸一手放腹】【吸气腹部鼓起胸部不动】【呼气腹部回落慢呼】",
        "common_errors": "胸先动→放松肩颈专注膈肌呼吸",
        "regression": "仰卧最轻松",
        "progression": "坐姿/站立",
        "applicable": [
          "颈肩酸沉重"
        ]
      }
    ],
    "contraindications": [
      "长时间低头玩手机/电脑",
      "单肩背包",
      "耸肩搬重物"
    ]
  },
  "髋外侧痛": {
    "id": "hip_lateral_pain",
    "name": "髋外侧痛",
    "synonyms": [
      "髋外侧疼",
      "髋关节外侧痛",
      "大转子痛",
      "髋外侧"
    ],
    "related_joints": [
      "髋关节",
      "膝关节"
    ],
    "root_causes": [
      {
        "issue": "臀中肌肌腱炎/大转子滑囊炎",
        "likelihood": "high",
        "explain": "臀中肌/臀小肌肌腱在大转子处反复摩擦→肌腱炎/滑囊炎→髋外侧疼痛（侧卧/单腿站加重）"
      },
      {
        "issue": "髂胫束紧张",
        "likelihood": "medium",
        "explain": "髂胫束跨过大转子→张力增加时摩擦/压迫大转子→外侧痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "泡沫轴放松臀中肌/阔筋膜张肌",
        "desc": "侧卧位泡沫轴在髋外侧裤兜位置慢滚，痛点停留15秒"
      },
      {
        "name": "大转子区冰敷",
        "desc": "急性期冰敷大转子区域15分钟"
      }
    ],
    "training": [
      {
        "name": "蚌式开合(弹力带)",
        "sets": "3组×15次/侧",
        "focus": "臀中肌→无痛激活",
        "key_points": "【骨盆中立】【仅髋外旋躯干不动】【慢放4秒】",
        "common_errors": "腰椎旋转→减小幅度",
        "regression": "无弹力带",
        "progression": "弹力带加重",
        "applicable": [
          "髋外侧痛"
        ]
      },
      {
        "name": "单腿臀桥",
        "sets": "3组×10次/侧",
        "focus": "臀大肌→减少TFL代偿",
        "key_points": "【臀发力】【骨盆不旋转】",
        "common_errors": "腰过伸→收腹",
        "regression": "双腿",
        "progression": "负重",
        "applicable": [
          "髋外侧痛"
        ]
      }
    ],
    "contraindications": [
      "侧卧患侧",
      "长距离跑步",
      "侧向跳跃"
    ]
  },
  "腹股沟痛": {
    "id": "hip_groin_pain",
    "name": "腹股沟痛",
    "synonyms": [
      "髋前侧痛",
      "腹股沟疼",
      "髋关节前方痛"
    ],
    "related_joints": [
      "髋关节",
      "腰椎"
    ],
    "root_causes": [
      {
        "issue": "髋关节前方结构激惹(髂腰肌/关节囊)",
        "likelihood": "high",
        "explain": "髋过伸或久坐后→髂腰肌腱/前侧关节囊牵拉→腹股沟区域疼痛"
      },
      {
        "issue": "髋关节骨性撞击(FAI)",
        "likelihood": "medium",
        "explain": "股骨头颈与髋臼缘异常接触→屈髋内旋时卡压→腹股沟痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "髂腰肌轻柔拉伸",
        "desc": "半跪姿，后腿髋前牵拉感，保持30秒（不要过度后伸腰椎）"
      }
    ],
    "training": [
      {
        "name": "臀桥",
        "sets": "3组×15次",
        "focus": "臀大肌激活→改善髋伸减少髋前挤压",
        "key_points": "【臀发力】【不过伸腰椎】【顶端保持2秒】",
        "common_errors": "腰过伸→收腹",
        "regression": "双腿静态保持",
        "progression": "单腿",
        "applicable": [
          "腹股沟痛"
        ]
      },
      {
        "name": "死虫式",
        "sets": "3组×10次/侧",
        "focus": "核心稳定保护髋关节",
        "key_points": "【腰贴地】【慢速】【正常呼吸】",
        "common_errors": "腰弓→减小幅度",
        "regression": "仅伸腿",
        "progression": "保持3秒",
        "applicable": [
          "腹股沟痛"
        ]
      }
    ],
    "contraindications": [
      "深蹲至最大角度",
      "髋关节大幅度旋转",
      "足球/武术高踢"
    ]
  },
  "久坐起立痛": {
    "id": "hip_stand_up_pain",
    "name": "久坐起立痛",
    "synonyms": [
      "坐久起来髋痛",
      "坐久站起痛"
    ],
    "related_joints": [
      "髋关节",
      "腰椎"
    ],
    "root_causes": [
      {
        "issue": "髋屈肌(髂腰肌)短缩/紧张",
        "likelihood": "high",
        "explain": "久坐屈髋位→髂腰肌短缩→站起时被迫快速拉长→牵拉痛"
      },
      {
        "issue": "臀肌抑制",
        "likelihood": "high",
        "explain": "久坐臀肌失活→站起时腘绳肌/腰椎代偿伸髋→髋关节受力异常"
      }
    ],
    "manual_techniques": [
      {
        "name": "髋屈肌拉伸",
        "desc": "半跪姿后腿牵拉30秒×3组"
      },
      {
        "name": "臀肌激活(坐姿)",
        "desc": "坐姿收紧臀部→感受臀肌发力10秒×10次(可办公间歇做)"
      }
    ],
    "training": [
      {
        "name": "臀桥",
        "sets": "3组×15次",
        "focus": "臀肌激活",
        "key_points": "【臀发力上顶】【顶端保持2秒】",
        "common_errors": "腰代偿→收紧臀",
        "regression": "静态保持",
        "progression": "单腿",
        "applicable": [
          "久坐起立痛"
        ]
      },
      {
        "name": "坐姿→站立练习",
        "sets": "3组×10次",
        "focus": "正确站起模式",
        "key_points": "【前倾躯干→臀发力站起→而非膝关节主导】【髋膝同伸】",
        "common_errors": "膝主导站起→髋主导",
        "regression": "手扶辅助",
        "progression": "单腿",
        "applicable": [
          "久坐起立痛"
        ]
      }
    ],
    "contraindications": [
      "长时间不动→猛然快速站起"
    ]
  },
  "弹响髋": {
    "id": "hip_snapping",
    "name": "弹响髋",
    "synonyms": [
      "髋弹响",
      "弹响髋",
      "髋关节弹响",
      "髋部咔哒声"
    ],
    "related_joints": [
      "髋关节"
    ],
    "root_causes": [
      {
        "issue": "髂胫束/臀大肌肌腱在大转子处弹拨",
        "likelihood": "high",
        "explain": "屈伸髋时髂胫束或臀大肌肌腱在大转子凸起处前后滑动→产生弹响(外侧型)"
      },
      {
        "issue": "髂腰肌肌腱在髂耻隆起处弹拨",
        "likelihood": "medium",
        "explain": "髋从屈到伸时髂腰肌腱在骨盆前缘弹拨→产生弹响(内侧型/腹股沟深部)"
      }
    ],
    "manual_techniques": [
      {
        "name": "泡沫轴放松髂胫束/阔筋膜张肌",
        "desc": "侧卧泡沫轴从髋外侧到膝外侧慢滚，避开骨凸"
      },
      {
        "name": "髂腰肌拉伸",
        "desc": "半跪姿后腿牵拉30秒×3组"
      }
    ],
    "training": [
      {
        "name": "臀肌激活训练",
        "sets": "3组×15次/侧",
        "focus": "臀中肌/臀大肌→改善髋控制",
        "key_points": "【控制运动轨迹】【避免弹响角度】",
        "common_errors": "进入弹响角度→在弹响发生前停止",
        "regression": "减小幅度",
        "progression": "增加关节位置控制",
        "applicable": [
          "弹响髋"
        ]
      }
    ],
    "contraindications": [
      "反复在弹响角度活动"
    ]
  },
  "内翻扭伤后": {
    "id": "ankle_inversion_sprain",
    "name": "内翻扭伤后",
    "synonyms": [
      "崴脚后",
      "脚踝内翻扭伤",
      "崴脚扭伤后遗",
      "踝内翻"
    ],
    "related_joints": [
      "踝关节"
    ],
    "root_causes": [
      {
        "issue": "踝外侧韧带(ATFL)愈合不全/松弛",
        "likelihood": "high",
        "explain": "初次扭伤后外侧韧带未充分愈合→踝关节机械稳定性下降→容易反复崴脚"
      },
      {
        "issue": "腓骨长短肌反应延迟",
        "likelihood": "high",
        "explain": "踝周肌肉本体感觉下降→突发内翻应力时腓骨长短肌反应过慢→无法及时保护"
      },
      {
        "issue": "本体感觉缺失",
        "likelihood": "medium",
        "explain": "扭伤后关节感受器受损→大脑对踝位置的感知下降→异常步态→再损伤风险↑"
      }
    ],
    "manual_techniques": [
      {
        "name": "踝关节松动(前向后滑动距骨)",
        "desc": "坐姿踝微跖屈，用弹力带或手将距骨向前滑动"
      },
      {
        "name": "外踝周围冰敷/热敷",
        "desc": "急性期后热敷促进循环；活动后如有酸胀冰敷10分钟"
      }
    ],
    "training": [
      {
        "name": "单腿站立(本体感觉)",
        "sets": "30秒×3组/侧→60秒",
        "focus": "重建踝本体感觉",
        "key_points": "【赤足→不平地面渐进】【从睁眼→闭眼】【踝膝髋保持稳定不晃】",
        "common_errors": "踝晃动太大→先扶墙；太快进闭眼→循序",
        "regression": "手扶墙/睁眼",
        "progression": "闭眼/泡沫垫/同时接球",
        "applicable": [
          "内翻扭伤后",
          "习惯性崴脚"
        ]
      },
      {
        "name": "弹力带踝外翻",
        "sets": "3组×15次",
        "focus": "腓骨长短肌→主动外翻力量",
        "key_points": "【弹力带绕足外侧】【脚向外翻对抗弹力带慢放4秒】【仅踝外翻不旋转腿】",
        "common_errors": "整条腿外旋→仅踝活动",
        "regression": "轻弹力带",
        "progression": "重弹力带",
        "applicable": [
          "内翻扭伤后"
        ]
      },
      {
        "name": "踝背屈活动度练习",
        "sets": "3组×12次",
        "focus": "恢复背屈活动度→防止代偿",
        "key_points": "【弓步位膝向前移→足跟不离地】【到踝前牵拉感保持10秒】",
        "common_errors": "足跟上抬→保持贴地；膝内扣→膝对准第二脚趾",
        "regression": "减小前移幅度",
        "progression": "手持重物",
        "applicable": [
          "内翻扭伤后"
        ]
      },
      {
        "name": "提踵+慢放",
        "sets": "3组×15次",
        "focus": "小腿三头肌力量+跟腱弹性",
        "key_points": "【提至最高点保持2秒】【慢放4秒控制下放】【不弹震】",
        "common_errors": "弹震→匀速；太快→控制节奏",
        "regression": "双腿提踵",
        "progression": "单腿/台阶边",
        "applicable": [
          "内翻扭伤后"
        ]
      }
    ],
    "contraindications": [
      "不平地面跑步(恢复早期)",
      "快速变向运动",
      "不戴护具参加运动"
    ]
  },
  "习惯性崴脚": {
    "id": "ankle_chronic_instability",
    "name": "习惯性崴脚",
    "synonyms": [
      "反复崴脚",
      "经常崴脚",
      "踝不稳"
    ],
    "related_joints": [
      "踝关节"
    ],
    "root_causes": [
      {
        "issue": "慢性踝关节不稳(机械性+功能性)",
        "likelihood": "high",
        "explain": "外侧韧带松弛(机械性)+腓骨肌反应延迟/本体感觉缺失(功能性)→反复内翻扭伤"
      }
    ],
    "manual_techniques": [],
    "training": [
      {
        "name": "进阶本体感觉训练",
        "sets": "逐步增加难度",
        "focus": "重建踝关节神经肌肉控制",
        "key_points": "【睁眼双腿站(30秒)→单腿站(30秒)→闭眼单腿站(30秒)→泡沫垫闭眼单腿站】【每个阶段熟练后进阶】",
        "common_errors": "进阶太快→一次进步一个难度",
        "regression": "退回上个阶段",
        "progression": "同时接抛球",
        "applicable": [
          "习惯性崴脚"
        ]
      },
      {
        "name": "弹力带踝外翻",
        "sets": "3组×15次",
        "focus": "腓骨肌力量",
        "key_points": "【慢放4秒】【仅踝外翻不转腿】",
        "common_errors": "腿外旋→仅踝动",
        "regression": "轻弹力带",
        "progression": "重弹力带",
        "applicable": [
          "习惯性崴脚"
        ]
      },
      {
        "name": "跳跃+稳定落地",
        "sets": "3组×8次",
        "focus": "动态踝稳定",
        "key_points": "【小幅跳起→单腿稳定落地保持3秒】【踝膝髋对齐】【不晃动】",
        "common_errors": "落地不稳晃动→减小跳跃高度",
        "regression": "双腿跳→单腿落",
        "progression": "侧向跳→旋转跳",
        "applicable": [
          "习惯性崴脚"
        ]
      }
    ],
    "contraindications": [
      "不戴护具参加高风险运动(篮球/足球等)"
    ]
  },
  "网球肘": {
    "id": "elbow_tennis",
    "name": "网球肘",
    "synonyms": [
      "网球肘",
      "肱骨外上髁炎",
      "肘外侧痛",
      "外上髁炎"
    ],
    "related_joints": [
      "肘关节",
      "腕关节"
    ],
    "root_causes": [
      {
        "issue": "腕伸肌总腱退行性变",
        "likelihood": "high",
        "explain": "反复抓握/腕伸→腕伸肌总腱在肱骨外上髁附着处微小撕裂累积→退行性变→疼痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "腕伸肌群横向按摩",
        "desc": "用拇指在肘外侧痛点横向推揉3-5分钟→促进血液循环"
      },
      {
        "name": "腕伸肌拉伸",
        "desc": "肘伸直，腕屈曲+前臂旋前，保持30秒×3组"
      }
    ],
    "training": [
      {
        "name": "离心腕伸训练",
        "sets": "3组×15次",
        "focus": "腕伸肌腱重塑",
        "key_points": "【用健侧手辅助→主动腕伸→患侧慢速离心放下4秒(核心!)】【只用轻重量0.5-1kg】",
        "common_errors": "太快→慢离心是关键；重量太重→0.5kg起步",
        "regression": "无负重离心",
        "progression": "增加至1-2kg",
        "applicable": [
          "网球肘"
        ]
      },
      {
        "name": "握力球训练",
        "sets": "3组×30秒保持",
        "focus": "前臂肌群等长收缩→减轻肌腱负荷",
        "key_points": "【最大握力70%保持30秒】【无痛强度】",
        "common_errors": "握力过大→70%即可；疼痛→减轻",
        "regression": "更轻握力/更短时间",
        "progression": "握更久/更强",
        "applicable": [
          "网球肘"
        ]
      }
    ],
    "contraindications": [
      "反复拧毛巾/提重物",
      "大重量抓握训练",
      "过度使用鼠标"
    ]
  },
  "高尔夫球肘": {
    "id": "elbow_golf",
    "name": "高尔夫球肘",
    "synonyms": [
      "高尔夫球肘",
      "肱骨内上髁炎",
      "肘内侧痛"
    ],
    "related_joints": [
      "肘关节",
      "腕关节"
    ],
    "root_causes": [
      {
        "issue": "腕屈肌总腱退行性变",
        "likelihood": "high",
        "explain": "反复屈腕/前臂旋前→腕屈肌总腱在内上髁附着处微小撕裂→退行性变→疼痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "腕屈肌群横向按摩",
        "desc": "用拇指在肘内侧痛点横向推揉3-5分钟"
      },
      {
        "name": "腕屈肌拉伸",
        "desc": "肘伸直，腕背伸，保持30秒×3组"
      }
    ],
    "training": [
      {
        "name": "离心腕屈训练",
        "sets": "3组×15次",
        "focus": "腕屈肌腱重塑",
        "key_points": "【健侧辅助→主动腕屈→患侧慢速离心放下4秒】【0.5-1kg起步】",
        "common_errors": "太快→慢离心",
        "regression": "无负重",
        "progression": "1-2kg",
        "applicable": [
          "高尔夫球肘"
        ]
      }
    ],
    "contraindications": [
      "反复屈腕抓握",
      "拧毛巾",
      "大重量腕弯举"
    ]
  },
  "伸不直": {
    "id": "elbow_extension_loss",
    "name": "肘伸不直",
    "synonyms": [
      "伸不直",
      "肘关节伸直受限",
      "肘屈曲挛缩"
    ],
    "related_joints": [
      "肘关节"
    ],
    "root_causes": [
      {
        "issue": "肘前关节囊挛缩/肱肌短缩",
        "likelihood": "high",
        "explain": "长时间屈肘位固定(如打石膏/长期不活动)→前关节囊/肱肌挛缩→伸直受限"
      }
    ],
    "manual_techniques": [
      {
        "name": "肘前软组织放松",
        "desc": "用按摩球按压肘窝上方肱肌区域"
      },
      {
        "name": "被动伸直(低负荷长时)",
        "desc": "坐姿手臂放桌上，用重力或轻重量(0.5-1kg)辅助肘伸直保持10-15分钟"
      }
    ],
    "training": [
      {
        "name": "低负荷长时间伸直",
        "sets": "10-15分钟×2组/日",
        "focus": "软组织塑性延长→恢复伸直",
        "key_points": "【坐姿前臂放桌/扶手悬空手腕挂轻物0.5-1kg】【重量舒适拉感到但不痛】【保持10-15分钟】",
        "common_errors": "重量太重→轻量长时间；时间太短→≥10分钟",
        "regression": "更轻重量",
        "progression": "稍增加重量/时间",
        "applicable": [
          "伸不直"
        ]
      }
    ],
    "contraindications": [
      "暴力掰直",
      "大重量强制伸直"
    ]
  },
  "支撑痛": {
    "id": "wrist_support_pain",
    "name": "腕支撑痛",
    "synonyms": [
      "手腕支撑痛",
      "平板支撑手腕痛",
      "腕过伸痛",
      "手腕支撑时痛"
    ],
    "related_joints": [
      "腕关节",
      "肘关节",
      "肩胛带"
    ],
    "root_causes": [
      {
        "issue": "腕伸肌群紧张/力量不足",
        "likelihood": "high",
        "explain": "腕过伸位(平板支撑)→腕伸肌被过度牵拉+需持续收缩→肌肉过劳→疼痛"
      },
      {
        "issue": "肩胛骨/核心稳定不足→腕过度代偿",
        "likelihood": "high",
        "explain": "核心/肩胛不稳→身体重心前移→手腕承受过大负荷→腕伸肌过劳"
      }
    ],
    "manual_techniques": [
      {
        "name": "腕伸肌拉伸",
        "desc": "手臂前伸掌心朝前，另一手将手掌向后轻拉，保持30秒"
      },
      {
        "name": "前臂筋膜放松",
        "desc": "用按摩球按压前臂伸肌群(前臂外侧)，从肘至腕滚动"
      }
    ],
    "training": [
      {
        "name": "四足跪姿腕屈伸",
        "sets": "3组×10次",
        "focus": "腕关节适应性负荷",
        "key_points": "【四足跪姿手掌放平→缓慢前后移动重心控制腕屈伸】【慢速控制】【均匀承重】",
        "common_errors": "太快→慢速；承重不均匀→五指分开均匀承重",
        "regression": "重心移动更小幅度",
        "progression": "增加前移幅度",
        "applicable": [
          "支撑痛"
        ]
      },
      {
        "name": "握力球训练",
        "sets": "3组×30秒",
        "focus": "前臂肌群耐力",
        "key_points": "【70%最大握力保持】【无痛范围】",
        "common_errors": "握太用力→70%即可",
        "regression": "更轻/更短",
        "progression": "加强/加长",
        "applicable": [
          "支撑痛"
        ]
      },
      {
        "name": "前锯肌推墙",
        "sets": "3组×12次",
        "focus": "肩胛稳定→减少腕负荷",
        "key_points": "【双手推墙肩胛骨前推】【不耸肩】",
        "common_errors": "耸肩→放松斜方肌",
        "regression": "四足跪姿",
        "progression": "脚更远",
        "applicable": [
          "支撑痛"
        ]
      }
    ],
    "contraindications": [
      "全手掌支撑平板(无变式)",
      "倒立/手倒立",
      "腕过伸位承重"
    ]
  },
  "鼠标手": {
    "id": "wrist_carpal_tunnel",
    "name": "鼠标手",
    "synonyms": [
      "鼠标手",
      "腕管综合征",
      "手腕麻",
      "手麻",
      "腕痛+手指麻"
    ],
    "related_joints": [
      "腕关节",
      "颈椎"
    ],
    "root_causes": [
      {
        "issue": "腕管压力增高→正中神经受压",
        "likelihood": "high",
        "explain": "长期屈腕/反复手指活动→腕管内肌腱肿胀→正中神经受压→桡侧三指半麻木/疼痛"
      }
    ],
    "manual_techniques": [
      {
        "name": "腕管区轻柔按摩",
        "desc": "在腕横纹中点向手指方向轻柔推揉"
      },
      {
        "name": "前臂屈肌群拉伸/放松",
        "desc": "肘伸直掌心朝前，另一手将手掌向后轻拉保持30秒"
      }
    ],
    "training": [
      {
        "name": "正中神经滑动练习",
        "sets": "10次×3组",
        "focus": "神经组织滑动→减少粘连",
        "key_points": "【手臂侧伸→腕背伸→头向对侧侧屈→回正】【缓慢有控制地在无痛/轻度牵拉感范围活动】",
        "common_errors": "出现麻木加重→减小幅度",
        "regression": "更小幅度",
        "progression": "增大滑动范围",
        "applicable": [
          "鼠标手"
        ]
      },
      {
        "name": "前臂屈肌离心训练",
        "sets": "3组×15次",
        "focus": "屈肌群控制",
        "key_points": "【腕屈后慢放4秒】【轻重量0.5kg】",
        "common_errors": "太快→慢离心",
        "regression": "无负重",
        "progression": "1kg",
        "applicable": [
          "鼠标手"
        ]
      }
    ],
    "contraindications": [
      "长时间屈腕(如使用普通鼠标→建议垂直鼠标)",
      "反复抓握+旋转"
    ]
  },
  "拇指痛": {
    "id": "wrist_thumb_pain",
    "name": "拇指痛",
    "synonyms": [
      "拇指根痛",
      "腱鞘炎",
      "妈妈手",
      "de Quervain"
    ],
    "related_joints": [
      "腕关节",
      "拇指"
    ],
    "root_causes": [
      {
        "issue": "拇长展肌/拇短伸肌腱鞘炎(de Quervain)",
        "likelihood": "high",
        "explain": "反复拇指外展/伸展→肌腱在桡骨茎突处腱鞘内摩擦→炎症+疼痛→握拳尺偏时剧痛(Finkelstein阳性)"
      }
    ],
    "manual_techniques": [
      {
        "name": "桡骨茎突处冰敷",
        "desc": "冰敷拇指侧腕部10-15分钟→减轻炎症"
      },
      {
        "name": "拇指周围轻柔拉伸",
        "desc": "拇指屈曲入掌心后缓慢被动尺偏腕"
      }
    ],
    "training": [
      {
        "name": "拇指等长外展",
        "sets": "3组×10次保持5秒",
        "focus": "无痛肌腱负荷",
        "key_points": "【拇指在无痛位置外展→等长保持5秒(不产生关节运动)】【无痛强度】",
        "common_errors": "出现疼痛→减小力度",
        "regression": "更轻力度",
        "progression": "增加等长保持时间",
        "applicable": [
          "拇指痛"
        ]
      }
    ],
    "contraindications": [
      "反复拧/扭转动作",
      "拇指外展+腕尺偏复合动作",
      "长时间使用手机单手打字"
    ]
  },
  "足底痛": {
    "id": "foot_plantar_pain",
    "name": "足底痛",
    "synonyms": [
      "足底疼",
      "足底筋膜炎",
      "脚底痛",
      "足跟痛"
    ],
    "related_joints": [
      "踝关节",
      "足"
    ],
    "root_causes": [
      {
        "issue": "足底筋膜炎",
        "likelihood": "high",
        "explain": "足底筋膜在跟骨附着处反复牵拉→微小撕裂+退行性变→晨起第一步剧痛(特征性)"
      },
      {
        "issue": "小腿三头肌/跟腱紧张",
        "likelihood": "high",
        "explain": "腓肠肌/比目鱼肌紧张→踝背屈受限→足底筋膜张力增加→附着点应力过大"
      }
    ],
    "manual_techniques": [
      {
        "name": "足底筋膜放松(网球滚)",
        "desc": "坐姿用网球滚压足底从足跟至前掌，2分钟/侧"
      },
      {
        "name": "小腿三头肌拉伸",
        "desc": "弓步位后腿伸直(腓肠肌)/微屈(比目鱼肌)牵拉，各30秒"
      }
    ],
    "training": [
      {
        "name": "足底筋膜拉伸",
        "sets": "3组×30秒",
        "focus": "足底筋膜/小腿三头肌",
        "key_points": "【坐姿毛巾绕过前脚掌→手拉脚趾向身体→保持膝伸直→跟腱+足底牵拉感】",
        "common_errors": "牵拉太强→控制在牵拉感非疼痛",
        "regression": "轻拉",
        "progression": "增加牵拉强度",
        "applicable": [
          "足底痛"
        ]
      },
      {
        "name": "提踵慢放(台阶边)",
        "sets": "3组×15次",
        "focus": "小腿离心力量→减少足底筋膜张力",
        "key_points": "【双腿提踵→单腿慢放4秒跟腱低于水平】【控制下放不弹震】",
        "common_errors": "弹震→控制；太快→慢放",
        "regression": "平地双腿",
        "progression": "单腿/负重",
        "applicable": [
          "足底痛"
        ]
      },
      {
        "name": "足趾抓毛巾",
        "sets": "3组×15次",
        "focus": "足内在肌→足弓支持",
        "key_points": "【坐姿脚底放毛巾→足趾屈曲抓毛巾向足跟收拢】【不抬脚跟】",
        "common_errors": "脚跟抬起→保持贴地",
        "regression": "小毛巾",
        "progression": "加重毛巾",
        "applicable": [
          "足底痛"
        ]
      }
    ],
    "contraindications": [
      "赤足在硬地长时间行走/跑步",
      "晨起不活动直接全负荷承重"
    ]
  },
  "腘绳肌拉伤": {
    "id": "hamstring_strain",
    "name": "腘绳肌拉伤",
    "synonyms": [
      "大腿后侧拉伤",
      "腘绳肌损伤",
      "后腿肌拉伤"
    ],
    "related_joints": [
      "髋关节",
      "膝关节"
    ],
    "root_causes": [
      {
        "issue": "腘绳肌离心力量不足",
        "likelihood": "high",
        "explain": "冲刺/急停时腘绳肌需要在拉长状态快速收缩制动→离心力量不足→肌肉撕裂"
      }
    ],
    "manual_techniques": [
      {
        "name": "急性期冰敷",
        "desc": "损伤后48h内冰敷每2小时15分钟"
      },
      {
        "name": "腘绳肌轻柔放松(亚急性期)",
        "desc": "俯卧用泡沫轴在大腿后侧轻柔滚动(避开最痛点)"
      }
    ],
    "training": [
      {
        "name": "桥式腘绳肌离心收缩(亚急性→恢复期)",
        "sets": "3组×8次",
        "focus": "腘绳肌离心力量",
        "key_points": "【仰卧脚跟放滑板/毛巾上→臀桥→缓慢滑出腿伸直(离心)4秒→滑回】【保持臀不落】",
        "common_errors": "臀下落→保持抬臀；太快→慢速",
        "regression": "小幅度滑出",
        "progression": "单腿/增大滑动距离",
        "applicable": [
          "腘绳肌拉伤"
        ]
      }
    ],
    "contraindications": [
      "冲刺/跳跃(恢复早期)",
      "大力拉伸急性期",
      "运动前不做热身"
    ]
  },
  "小腿紧": {
    "id": "calf_tightness",
    "name": "小腿紧",
    "synonyms": [
      "小腿紧",
      "小腿酸痛",
      "小腿涨",
      "小腿后侧紧"
    ],
    "related_joints": [
      "踝关节",
      "膝关节"
    ],
    "root_causes": [
      {
        "issue": "腓肠肌/比目鱼肌过度使用",
        "likelihood": "high",
        "explain": "长时间站立/走路/运动→小腿三头肌疲劳→代谢产物堆积→酸胀紧张感"
      },
      {
        "issue": "踝背屈活动度不足",
        "likelihood": "medium",
        "explain": "小腿后侧肌群柔韧性差→日常活动中被持续牵拉→紧张感"
      }
    ],
    "manual_techniques": [
      {
        "name": "小腿后侧泡沫轴放松",
        "desc": "坐姿双腿放泡沫轴上从跟腱至腘窝缓慢滚动，痛点停留"
      },
      {
        "name": "腓肠肌/比目鱼肌拉伸",
        "desc": "弓步位后腿分别伸直(腓肠肌)和微屈(比目鱼肌)牵拉各30秒"
      }
    ],
    "training": [
      {
        "name": "踝背屈活动度练习",
        "sets": "3组×12次",
        "focus": "动态小腿拉伸",
        "key_points": "【弓步膝前移→足跟不离开地面→踝前牵拉感保持10秒】",
        "common_errors": "足跟上抬→保持贴地",
        "regression": "小幅前移",
        "progression": "手持重物",
        "applicable": [
          "小腿紧"
        ]
      }
    ],
    "contraindications": [
      "不做拉伸直接运动"
    ]
  }
};

/**
 * 提取关键词
 */
function extractKeywords(input) {
  const text = input.toLowerCase().trim();
  const jointMap = {
    '膝':'膝','膝盖':'膝','肩':'肩','肩膀':'肩','腰':'腰','腰椎':'腰','下背':'腰',
    '颈':'颈','脖子':'颈','颈椎':'颈','髋':'髋','胯':'髋','腹股沟':'髋',
    '踝':'踝','脚踝':'踝','脚腕':'踝','肘':'肘','腕':'腕','手腕':'腕',
    '足':'足','脚':'足','足底':'足','脚底':'足','小腿':'小腿','大腿后侧':'腘绳肌'
  };
  const actionMap = {
    '上楼':'上楼','上楼梯':'上楼','下楼':'下楼','下楼梯':'下楼',
    '抬':'抬','抬手':'抬','举手':'抬','外展':'外展','后伸':'后伸','向后':'后伸',
    '弯腰':'弯腰','俯身':'弯腰','低头':'低头','前屈':'低头',
    '转':'转','转头':'转','扭头':'转','旋转':'转',
    '久坐':'久坐','坐久':'久坐','办公':'久坐',
    '侧睡':'侧睡','侧卧':'侧睡','夜间':'夜间','晚上':'夜间','睡觉':'夜间',
    '晨起':'晨起','早上':'晨起','睡醒':'晨起',
    '硬拉':'硬拉','负重':'负重',
    '支撑':'支撑','平板支撑':'支撑',
    '鼠标':'鼠标',
    '崴':'崴','扭伤':'崴','崴脚':'崴',
    '网球':'网球','高尔夫':'高尔夫',
    '弹响':'弹响','咔':'弹响',
    '起立':'起立','站起':'起立','站起来':'起立',
    '落枕':'落枕','歪脖子':'落枕',
    '沉重':'沉重','酸沉':'沉重',
    '手麻':'手麻','麻':'手麻',
    '拇指':'拇指','拉伤':'拉伤','小腿紧':'小腿紧'
  };
  const posMap = {'前':'前','后':'后','内':'内','内侧':'内','外':'外','外侧':'外'};
  const kw = { joint:null, action:null, position:null, pain:/痛|疼|不适|酸|胀|紧|僵|麻|沉重|不舒服/.test(text) };
  for (const [k,v] of Object.entries(jointMap)) { if (text.includes(k)) { kw.joint = v; break; } }
  for (const [k,v] of Object.entries(actionMap)) { if (text.includes(k)) { kw.action = v; break; } }
  for (const [k,v] of Object.entries(posMap)) { if (text.includes(k)) { kw.position = v; break; } }
  return kw;
}

/**
 * 计算相似度
 */
function calculateSimilarity(keywords, symptom) {
  let score = 0;
  const allText = (symptom.name + ' ' + (symptom.synonyms||[]).join(' ')).toLowerCase();
  if (keywords.joint) {
    if (allText.includes(keywords.joint) ||
        (keywords.joint==='腰' && (allText.includes('腰')||allText.includes('下背')||allText.includes('腰椎'))) ||
        (keywords.joint==='颈' && (allText.includes('颈')||allText.includes('脖子'))) ||
        (keywords.joint==='足' && (allText.includes('足')||allText.includes('脚'))) ||
        (keywords.joint==='髋' && (allText.includes('髋')||allText.includes('腹股沟')))) score += 30;
  }
  if (keywords.action) {
    const actMap = {'上楼':25,'下楼':25,'久坐':25,'弯腰':25,'夜间':25,'晨起':25,'支撑':25,'鼠标':20,'网球':25,'高尔夫':25,'落枕':25,'崴':25,'抬':20,'低头':20,'转':20,'外展':20,'后伸':20,'侧睡':20,'起立':20,'弹响':20,'拉伤':20,'小腿紧':20,'硬拉':15,'沉重':15,'手麻':15,'拇指':15};
    if (actMap[keywords.action]) score += actMap[keywords.action];
  }
  if (keywords.position) {
    const posMap = {'前':15,'后':15,'内':15,'外':15};
    if (posMap[keywords.position]) score += posMap[keywords.position];
  }
  return score;
}

/**
 * 主匹配函数：症状→思路
 */
function matchSymptom(inputText) {
  if (!inputText || inputText.trim().length < 2) return { found:false, message:'请输入更详细的症状描述' };
  const inputLower = inputText.toLowerCase();

  // 直接匹配
  for (const [name, data] of Object.entries(SYMPTOM_DB)) {
    if (inputLower.includes(name.toLowerCase())) return buildResponse(name, data, inputText);
    for (const syn of data.synonyms) {
      if (inputLower.includes(syn.toLowerCase())) return buildResponse(name, data, inputText);
    }
  }

  // 模糊匹配
  const keywords = extractKeywords(inputText);
  const scored = [];
  for (const [name, data] of Object.entries(SYMPTOM_DB)) {
    const s = calculateSimilarity(keywords, data);
    if (s > 0) scored.push({ name, data, score:s });
  }
  scored.sort((a,b) => b.score - a.score);
  if (scored.length === 0) return { found:false, message:'未找到匹配的康复思路。\n请尝试更具体的描述，如"膝盖上楼痛"或"弯腰时腰痛"。\n您也可以从下方热门症状中选择。' };
  return buildResponse(scored[0].name, scored[0].data, inputText);
}

function buildResponse(name, data, inputText) {
  return {
    found: true, symptomName: name, symptomData: data,
    currentCauseIndex: 0, totalCauses: data.root_causes.length,
    related_joints: data.related_joints
  };
}

function getApproach(symptomData, causeIndex) {
  if (!symptomData || causeIndex >= symptomData.root_causes.length) return null;
  const cause = symptomData.root_causes[causeIndex];
  let training = (symptomData.training || []);
  if (training.length > 5) training = training.slice(0, 5);
  return {
    issue: cause.issue, likelihood: cause.likelihood, explain: cause.explain,
    manual_techniques: symptomData.manual_techniques || [],
    training: training,
    contraindications: symptomData.contraindications || []
  };
}

function searchSymptoms(query) {
  if (!query || query.trim().length < 1) return [];
  const q = query.toLowerCase(), results = [];
  for (const [name, data] of Object.entries(SYMPTOM_DB)) {
    if (name.toLowerCase().includes(q)) { results.push({name,id:data.id}); continue; }
    for (const syn of data.synonyms) { if (syn.toLowerCase().includes(q)) { results.push({name,id:data.id}); break; } }
  }
  return results.slice(0, 8);
}

function getSymptomsByJoint() {
  return {
    "膝关节":["膝前痛","膝内侧痛","膝外侧痛","膝久坐痛"],
    "肩关节":["肩抬不起来","肩外展痛","肩后伸痛","肩夜间痛","肩侧睡痛"],
    "腰椎":["下背痛","久坐腰痛","弯腰痛","晨起腰痛"],
    "颈椎":["低头痛","转头痛","落枕","颈肩酸沉重"],
    "髋关节":["髋外侧痛","腹股沟痛","久坐起立痛","弹响髋"],
    "踝关节":["内翻扭伤后","习惯性崴脚"],
    "肘关节":["网球肘","高尔夫球肘","伸不直"],
    "腕关节":["支撑痛","鼠标手","拇指痛"],
    "其他":["足底痛","小腿紧","腘绳肌拉伤"]
  };
}

if (typeof window !== 'undefined') {
  window.SYMPTOM_DB = SYMPTOM_DB;
  window.matchSymptom = matchSymptom;
  window.getApproach = getApproach;
  window.searchSymptoms = searchSymptoms;
  window.getSymptomsByJoint = getSymptomsByJoint;
}
if (typeof module !== 'undefined') {
  module.exports = { SYMPTOM_DB, matchSymptom, getApproach, searchSymptoms, getSymptomsByJoint };
}


// ==================== 增强匹配：多维筛选 ====================

// 部位→症状映射
const REGION_SYMPTOM_MAP = {
  "膝关节": ["膝前痛","膝内侧痛","膝外侧痛","膝久坐痛"],
  "肩关节": ["肩抬不起来","肩外展痛","肩后伸痛","肩夜间痛","肩侧睡痛"],
  "腰椎": ["下背痛","久坐腰痛","弯腰痛","晨起腰痛"],
  "颈椎": ["低头痛","转头痛","落枕","颈肩酸沉重"],
  "髋关节": ["髋外侧痛","腹股沟痛","久坐起立痛","弹响髋"],
  "踝关节": ["内翻扭伤后","习惯性崴脚"],
  "肘关节": ["网球肘","高尔夫球肘","伸不直"],
  "腕关节": ["支撑痛","鼠标手","拇指痛"],
  "其他": ["足底痛","小腿紧","腘绳肌拉伤"]
};

// 疼痛性质→根源关键词权重映射
const PAIN_TYPE_WEIGHTS = {
  "刺痛/锐痛": { neuro: 30, inflammatory: 10, mechanical: 0, keywords: ["神经","卡压","放射","麻"] },
  "钝痛/酸痛": { neuro: 0, inflammatory: 10, mechanical: 25, keywords: ["关节","退行","劳损","肌肉","负荷"] },
  "灼烧痛":     { neuro: 5,  inflammatory: 35, mechanical: 0, keywords: ["炎症","滑囊","感染","急性"] },
  "牵拉痛":     { neuro: 5,  inflammatory: 5,  mechanical: 25, keywords: ["挛缩","短缩","紧张","粘连","牵拉","拉伤"] },
  "酸胀感":     { neuro: 0,  inflammatory: 5,  mechanical: 25, keywords: ["疲劳","代谢","慢性","过劳","代偿"] },
  "麻木感":     { neuro: 35, inflammatory: 5,  mechanical: 0, keywords: ["神经","卡压","受压","传导","放射","椎间盘"] }
};

// 诱发条件→症状关键词加权映射
const TRIGGER_WEIGHTS = {
  "上楼梯":    { knee: 30, hip: 5, ankle: 10, keywords: ["上楼","前痛","髌股","股四头肌"] },
  "下楼梯":    { knee: 30, hip: 5, ankle: 10, keywords: ["下楼","前痛","离心","控制"] },
  "深蹲":      { knee: 25, hip: 15, ankle: 10, keywords: ["深蹲","屈曲","半月板","髌股"] },
  "久坐后站起": { knee: 20, hip: 25, lumbar: 15, keywords: ["久坐","起立","髂腰肌","站起"] },
  "弯腰":      { lumbar: 35, hip: 10, keywords: ["弯腰","屈曲","椎间盘","前倾"] },
  "后伸":      { lumbar: 30, keywords: ["后伸","小关节","过伸","关节突"] },
  "低头":      { cervical: 35, keywords: ["低头","屈曲","前倾","手机"] },
  "转头":      { cervical: 30, keywords: ["转头","旋转","扭","颈椎旋转"] },
  "抬手/上举": { shoulder: 35, keywords: ["抬手","上举","外展","过顶","上旋"] },
  "支撑":      { wrist: 30, shoulder: 15, keywords: ["支撑","平板","承重","推"] },
  "抓握":      { elbow: 25, wrist: 25, keywords: ["抓握","网球","高尔夫","拧"] },
  "跑步/跳跃": { knee: 25, ankle: 15, foot: 15, keywords: ["跑步","跳跃","冲击","着地"] },
  "夜间痛":    { shoulder: 20, general: 20, keywords: ["夜间","睡眠","夜间痛","静卧"] },
  "晨起":      { lumbar: 15, general: 20, keywords: ["晨起","晨僵","早上","睡醒"] },
  "长时间不动":{ knee: 15, lumbar: 15, general: 15, keywords: ["久坐","不动","长时间","不动"] }
};

// 部位名称→关节关键词映射
const REGION_JOINT_KEY = {
  "膝关节": "膝", "肩关节": "肩", "腰椎": "腰", "颈椎": "颈",
  "髋关节": "髋", "踝关节": "踝", "肘关节": "肘", "腕关节": "腕", "其他": ""
};

/**
 * 增强匹配：支持多维筛选条件
 * @param {string} inputText - 用户自由文本输入
 * @param {object} filters - { region, subRegion, painType, trigger }
 * @returns {object} 匹配结果
 */
function matchSymptomWithFilters(inputText, filters) {
  filters = filters || {};

  // Step 0: 如果指定了区域，先缩小候选集
  let candidateNames = null;
  if (filters.region && REGION_SYMPTOM_MAP[filters.region]) {
    candidateNames = REGION_SYMPTOM_MAP[filters.region];
  }

  // Step 1: 文本匹配（基础匹配）
  const text = (inputText || '').toLowerCase().trim();
  let symptoms = [];

  // 如果有区域限制，只在区域内匹配
  if (candidateNames) {
    for (const name of candidateNames) {
      if (SYMPTOM_DB[name]) {
        // 区域内直接文本匹配
        if (text && (name.includes(text) || text.includes(name) ||
            SYMPTOM_DB[name].synonyms.some(s => s.includes(text) || text.includes(s)))) {
          symptoms.push({ name, data: SYMPTOM_DB[name], score: 90 });
        } else {
          symptoms.push({ name, data: SYMPTOM_DB[name], score: 40 }); // 区域内无文本匹配给基础分
        }
      }
    }
  } else {
    // 无区域限制，全局匹配
    symptoms = [];
    for (const [name, data] of Object.entries(SYMPTOM_DB)) {
      let score = 0;
      if (text && (name.includes(text) || text.includes(name) ||
          data.synonyms.some(s => s.includes(text) || text.includes(s)))) {
        score = 80;
      }
      symptoms.push({ name, data, score });
    }
  }

  // Step 2: 疼痛性质加权（调整根源排序而非症状选择）
  if (filters.painType && PAIN_TYPE_WEIGHTS[filters.painType]) {
    const pw = PAIN_TYPE_WEIGHTS[filters.painType];
    for (const s of symptoms) {
      const causes = s.data.root_causes;
      let painBonus = 0;
      for (const kw of pw.keywords) {
        // 检查所有根源的解释
        for (const c of causes) {
          if (c.explain.includes(kw) || c.issue.includes(kw)) {
            painBonus += pw.mechanical + pw.neuro + pw.inflammatory;
            break;
          }
        }
        // 检查训练动作
        for (const t of (s.data.training || [])) {
          if ((t.focus || '').includes(kw) || (t.key_points || '').includes(kw)) {
            painBonus += 5;
            break;
          }
        }
      }
      s.score += Math.min(painBonus, 40); // 疼痛性质最多加40分
    }
  }

  // Step 3: 诱发条件加权
  if (filters.trigger && TRIGGER_WEIGHTS[filters.trigger]) {
    const tw = TRIGGER_WEIGHTS[filters.trigger];
    const triggerText = (filters.trigger || '').toLowerCase();
    for (const s of symptoms) {
      const allText = (s.name + ' ' + (s.data.synonyms || []).join(' ')).toLowerCase();
      let triggerBonus = 0;
      // 关键词匹配
      for (const kw of (tw.keywords || [])) {
        if (allText.includes(kw)) triggerBonus += 15;
        // 检查根源解释
        for (const c of s.data.root_causes) {
          if (c.explain.includes(kw) || c.issue.includes(kw)) triggerBonus += 10;
        }
      }
      // 区域加权
      if (filters.region && REGION_JOINT_KEY[filters.region]) {
        const jk = REGION_JOINT_KEY[filters.region];
        for (const [joint, weight] of Object.entries(tw)) {
          if (joint === 'general') continue;
          if (jk === '膝' && joint === 'knee') triggerBonus += weight;
          else if (jk === '肩' && joint === 'shoulder') triggerBonus += weight;
          else if (jk === '腰' && joint === 'lumbar') triggerBonus += weight;
          else if (jk === '颈' && joint === 'cervical') triggerBonus += weight;
          else if (jk === '髋' && joint === 'hip') triggerBonus += weight;
          else if (jk === '踝' && joint === 'ankle') triggerBonus += weight;
          else if (jk === '肘' && joint === 'elbow') triggerBonus += weight;
          else if (jk === '腕' && joint === 'wrist') triggerBonus += weight;
        }
      }
      s.score += Math.min(triggerBonus, 50);
    }
  }

  // Step 4: 子区域精调
  if (filters.subRegion) {
    const sub = filters.subRegion;
    for (const s of symptoms) {
      const allText = (s.name + ' ' + (s.data.synonyms || []).join(' ')).toLowerCase();
      if ((sub.includes('前') && allText.includes('前')) ||
          (sub.includes('后') && allText.includes('后')) ||
          (sub.includes('内') && allText.includes('内')) ||
          (sub.includes('外') && allText.includes('外'))) {
        s.score += 20;
      }
    }
  }

  // 排序
  symptoms.sort((a, b) => b.score - a.score);

  if (symptoms.length === 0 || symptoms[0].score <= 0) {
    return { found: false, message: '未找到匹配的康复思路。请尝试调整筛选条件。' };
  }

  const best = symptoms[0];

  // Step 5: 根据疼痛性质调整根源排序
  if (filters.painType && PAIN_TYPE_WEIGHTS[filters.painType]) {
    const pw = PAIN_TYPE_WEIGHTS[filters.painType];
    const causes = best.data.root_causes.map((c, i) => {
      let weight = 0;
      for (const kw of pw.keywords) {
        if (c.explain.includes(kw) || c.issue.includes(kw)) weight += 10;
      }
      return { ...c, _origIndex: i, _painWeight: weight };
    });
    // 如果有疼痛性质的根源匹配，重新排序
    if (causes.some(c => c._painWeight > 0)) {
      causes.sort((a, b) => b._painWeight - a._painWeight);
      // 更新 originalCauseIndex 指向最佳匹配的根源
      const bestCauseIdx = causes[0]._origIndex;
      return buildResponse(best.name, best.data, inputText, bestCauseIdx);
    }
  }

  return buildResponse(best.name, best.data, inputText);
}

// 修改 buildResponse 支持指定根源索引
function buildResponse(name, data, inputText, causeIndex) {
  return {
    found: true,
    symptomName: name,
    symptomData: data,
    currentCauseIndex: causeIndex || 0,
    totalCauses: data.root_causes.length,
    related_joints: data.related_joints
  };
}

// 导出新函数
if (typeof window !== 'undefined') {
  window.matchSymptomWithFilters = matchSymptomWithFilters;
  window.REGION_SYMPTOM_MAP = REGION_SYMPTOM_MAP;
  window.PAIN_TYPE_WEIGHTS = PAIN_TYPE_WEIGHTS;
  window.TRIGGER_WEIGHTS = TRIGGER_WEIGHTS;
}
if (typeof module !== 'undefined') {
  module.exports.matchSymptomWithFilters = matchSymptomWithFilters;
}
