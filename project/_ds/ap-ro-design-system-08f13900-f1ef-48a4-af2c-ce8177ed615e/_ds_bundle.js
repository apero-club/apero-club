/* @ds-bundle: {"format":4,"namespace":"ApRoDesignSystem_08f139","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Critter","sourcePath":"components/brand/Critter.jsx"},{"name":"Eyes","sourcePath":"components/brand/Eyes.jsx"},{"name":"ShapeTile","sourcePath":"components/brand/ShapeTile.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"ChoiceTile","sourcePath":"components/learning/ChoiceTile.jsx"},{"name":"FeedbackBanner","sourcePath":"components/learning/FeedbackBanner.jsx"},{"name":"LessonNode","sourcePath":"components/learning/LessonNode.jsx"},{"name":"WordChip","sourcePath":"components/learning/WordChip.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"e81134acf0c5","components/actions/IconButton.jsx":"923ef5e28244","components/brand/Critter.jsx":"b26413054671","components/brand/Eyes.jsx":"7b3c19e94133","components/brand/ShapeTile.jsx":"927f69c43506","components/display/Badge.jsx":"254e10a36a38","components/display/Card.jsx":"4b0d6534c285","components/display/Tag.jsx":"f3099fcd069f","components/feedback/Dialog.jsx":"961bdb91159b","components/feedback/ProgressBar.jsx":"7b4decdb50ad","components/feedback/Toast.jsx":"dd3c2e8f8f81","components/feedback/Tooltip.jsx":"906a78fe2d23","components/forms/Checkbox.jsx":"2b41b9a877f4","components/forms/Input.jsx":"460a37a53ab4","components/forms/Radio.jsx":"24c052f134b7","components/forms/Select.jsx":"291e4032a9ef","components/forms/Switch.jsx":"1828f872d3cc","components/icons/Icon.jsx":"b79e8aa856ac","components/learning/ChoiceTile.jsx":"bfc88fd4d309","components/learning/FeedbackBanner.jsx":"5407b0ff8f31","components/learning/LessonNode.jsx":"0d433d5ab271","components/learning/WordChip.jsx":"968f864295d1","components/navigation/Tabs.jsx":"a91b0db60aff","components/usePress.js":"bf65e97c0d03","ds-loader.js":"172ce8cec6f7","guidelines/doc-page.js":"f52ae9c02fca","ui_kits/app/CompleteScreen.jsx":"07c2f501a921","ui_kits/app/LessonScreen.jsx":"cf87314206d0","ui_kits/app/PathScreen.jsx":"459b29cb0ae0"},"inlinedExternals":[],"unexposedExports":[{"name":"usePress","sourcePath":"components/usePress.js"}]} */

(() => {

const __ds_ns = (window.ApRoDesignSystem_08f139 = window.ApRoDesignSystem_08f139 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Eyes.jsx
try { (() => {
const LOOK = {
  center: [0, 0],
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
  'up-left': [-0.7, -0.7],
  'up-right': [0.7, -0.7],
  'down-left': [-0.7, 0.7],
  'down-right': [0.7, 0.7]
};
const BLINKS = {
  look: 1,
  wide: 1,
  dots: 1
};
const sz = s => typeof s === 'number' ? s + 'px' : s;

/* A pair of eyes. 1em = one eye's diameter, so `size` scales everything. */
function Eyes({
  expression = 'look',
  look = 'center',
  size = 16,
  gap = 0.34,
  eyeColor = 'var(--white)',
  ink = 'var(--ink-900)',
  blink = false,
  blinkDelay = 0,
  style
}) {
  const cross = look === 'cross';
  const eye = i => {
    const ex = expression === 'wink' ? i ? 'happy' : 'look' : expression;
    const [dx, dy] = cross ? i ? [-1, 0] : [1, 0] : LOOK[look] || LOOK.center;
    const pupil = (w, h, m) => /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: w + 'em',
        height: h + 'em',
        borderRadius: '50%',
        background: ink,
        transform: `translate(calc(-50% + ${dx * m}em), calc(-50% + ${dy * m}em))`
      }
    });
    if (ex === 'wide') return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: 'relative',
        display: 'block',
        width: '0.8em',
        height: '1.12em',
        borderRadius: '50%',
        background: eyeColor
      }
    }, pupil(0.44, 0.64, 0.16));
    if (ex === 'dots') return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'block',
        width: '0.56em',
        height: '0.56em',
        margin: '0 0.08em',
        borderRadius: '50%',
        background: ink,
        transform: `translate(${dx * 0.08}em, ${dy * 0.08}em)`
      }
    });
    if (ex === 'happy') return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'block',
        width: '1em',
        height: '0.5em',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        width: '1em',
        height: '1em',
        borderRadius: '50%',
        border: '0.18em solid ' + ink,
        boxSizing: 'border-box'
      }
    }));
    if (ex === 'closed') return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'block',
        width: '0.9em',
        height: '0.16em',
        borderRadius: 999,
        background: ink
      }
    });
    if (ex === 'sleepy') return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: 'relative',
        display: 'block',
        width: '1em',
        height: '0.56em',
        overflow: 'hidden',
        background: eyeColor,
        borderRadius: '0 0 1em 1em',
        borderTop: '0.14em solid ' + ink,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '-0.2em',
        width: '0.56em',
        height: '0.56em',
        borderRadius: '50%',
        background: ink,
        transform: `translateX(calc(-50% + ${dx * 0.16}em))`
      }
    }));
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: 'relative',
        display: 'block',
        width: '1em',
        height: '1em',
        borderRadius: '50%',
        background: eyeColor
      }
    }, pupil(0.56, 0.56, 0.2));
  };
  const blinks = blink && BLINKS[expression];
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: gap + 'em',
      fontSize: sz(size),
      lineHeight: 0,
      animation: blinks ? `eyes-blink 4.6s ${blinkDelay}s infinite` : undefined,
      transformOrigin: '50% 50%',
      ...style
    }
  }, eye(0), eye(1));
}
Object.assign(__ds_scope, { Eyes });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Eyes.jsx", error: String((e && e.message) || e) }); }

// components/brand/Critter.jsx
try { (() => {
const ARCH = '999px 999px 0 0',
  BOWL = '0 0 999px 999px',
  R = '50%';
/* Each character: parts in % of a square box (c = body | accent | accent2), eyes at x/y with size s (% of box width). */
const KINDS = {
  arch: {
    color: 'violet-500',
    ex: 'look',
    look: 'right',
    eyes: [50, 38, 18],
    parts: [[18, 8, 64, 84, ARCH]]
  },
  jelly: {
    color: 'pink-500',
    ex: 'look',
    look: 'up',
    eyes: [50, 36, 16],
    parts: [[16, 8, 68, 64, ARCH], [16, 56, 17, 30, 999], [33, 56, 17, 30, 999], [50, 56, 17, 30, 999], [67, 56, 17, 30, 999]]
  },
  bean: {
    color: 'orange-500',
    ex: 'look',
    look: 'left',
    eyes: [50, 50, 16],
    parts: [[6, 28, 88, 44, 999]]
  },
  dome: {
    color: 'sun-500',
    ex: 'look',
    look: 'left',
    eyes: [50, 60, 15],
    parts: [[4, 30, 92, 46, ARCH]]
  },
  flower: {
    color: 'sky-500',
    ex: 'happy',
    eyes: [50, 52, 15],
    parts: [[6, 28, 44, 44, R], [50, 28, 44, 44, R], [28, 6, 44, 44, R], [28, 50, 44, 44, R], [28, 28, 44, 44, 0]]
  },
  diamond: {
    color: 'green-500',
    ex: 'look',
    look: 'down-right',
    eyes: [50, 47, 16],
    parts: [[19, 19, 62, 62, '22%', 45]]
  },
  macaron: {
    color: 'lilac-500',
    ex: 'dots',
    eyes: [50, 50, 14],
    parts: [[12, 12, 76, 28, 999], [4, 36, 92, 28, 999], [12, 60, 76, 28, 999]]
  },
  spark: {
    color: 'sun-500',
    ex: 'dots',
    look: 'up',
    eyes: [50, 50, 12],
    parts: [[4, 38, 92, 24, 999], [4, 38, 92, 24, 999, 60], [4, 38, 92, 24, 999, 120], [27, 27, 46, 46, R]]
  },
  olive: {
    color: 'green-900',
    ex: 'sleepy',
    eyes: [50, 48, 19],
    parts: [[10, 10, 80, 80, R]]
  },
  tower: {
    color: 'pink-500',
    accent: 'orange-500',
    accent2: 'green-900',
    ex: 'look',
    look: 'left',
    eyes: [50, 40, 13],
    parts: [[34, 2, 32, 16, ARCH, 0, 'accent2'], [28, 18, 44, 44, R], [16, 62, 68, 34, BOWL, 0, 'accent']]
  },
  sugar: {
    color: 'sky-500',
    accent: 'violet-500',
    ex: 'look',
    look: 'right',
    eyes: [62, 33, 12],
    parts: [[26, 8, 62, 58, 0], [16, 8, 20, 20, R], [16, 27, 20, 20, R], [16, 46, 20, 20, R], [32, 68, 50, 25, ARCH, 0, 'accent']]
  },
  bowl: {
    color: 'orange-500',
    accent: 'sun-500',
    ex: 'sleepy',
    look: 'down',
    eyes: [50, 50, 15],
    parts: [[32, 14, 36, 18, ARCH, 0, 'accent'], [6, 34, 88, 44, BOWL]]
  }
};
const v = t => t && t.indexOf('var(') !== 0 && t.indexOf('#') !== 0 && t.indexOf('rgb') !== 0 ? 'var(--' + t + ')' : t;

/* A standalone apéro character: one or a few kit shapes plus a pair of Eyes. Transparent background. */
function Critter({
  kind = 'arch',
  color,
  accent,
  accent2,
  expression,
  look,
  size = 120,
  blink = false,
  blinkDelay = 0,
  tilt = 0,
  style
}) {
  const k = KINDS[kind] || KINDS.arch;
  const fills = {
    body: v(color || k.color),
    accent: v(accent || k.accent || 'violet-500'),
    accent2: v(accent2 || k.accent2 || 'green-900')
  };
  const [ex, ey, es] = k.eyes;
  return /*#__PURE__*/React.createElement("div", {
    role: "img",
    "aria-label": kind + ' character',
    style: {
      position: 'relative',
      width: typeof size === 'number' ? size : size,
      aspectRatio: '1',
      flexShrink: 0,
      containerType: 'inline-size',
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
      ...style
    }
  }, k.parts.map(([l, t, w, h, r, rot, c], i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      left: l + '%',
      top: t + '%',
      width: w + '%',
      height: h + '%',
      borderRadius: r,
      background: fills[c || 'body'],
      transform: rot ? `rotate(${rot}deg)` : undefined
    }
  })), /*#__PURE__*/React.createElement(__ds_scope.Eyes, {
    expression: expression || k.ex,
    look: look || k.look || 'center',
    size: es + 'cqw',
    blink: blink,
    blinkDelay: blinkDelay,
    style: {
      position: 'absolute',
      left: ex + '%',
      top: ey + '%',
      translate: '-50% -50%'
    }
  }));
}
Object.assign(__ds_scope, { Critter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Critter.jsx", error: String((e && e.message) || e) }); }

// components/brand/ShapeTile.jsx
try { (() => {
const DEFAULTS = {
  arch: {
    bg: 'pink-500',
    fg: 'pink-900'
  },
  circle: {
    bg: 'cream-200',
    fg: 'orange-500'
  },
  halves: {
    bg: 'sky-500',
    fg: 'sky-300'
  },
  flower: {
    bg: 'orange-500',
    fg: 'cream-50',
    accent: 'violet-500'
  },
  asterisk: {
    bg: 'violet-500',
    fg: 'lilac-500'
  },
  pill: {
    bg: 'lilac-500',
    fg: 'violet-500'
  }
};
/* Where eyes sit on each kit shape: [top %, eye size in cqw]. */
const EYE_AT = {
  arch: [50, 13],
  circle: [48, 15],
  halves: [80, 12],
  flower: [50, 13],
  pill: [50, 12]
};
const v = t => t && t.indexOf('var(') !== 0 && t.indexOf('#') !== 0 ? 'var(--' + t + ')' : t;

/* One square poster tile holding one shape from the kit. Built only from CSS radii. */
function ShapeTile({
  shape = 'arch',
  bg,
  fg,
  accent,
  size,
  eyes,
  look,
  blink = false,
  blinkDelay = 0,
  children,
  style
}) {
  const at = eyes && EYE_AT[shape];
  const d = DEFAULTS[shape] || DEFAULTS.arch;
  const B = v(bg || d.bg),
    F = v(fg || d.fg),
    A = v(accent || d.accent || 'violet-500');
  const center = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  let inner = null;
  if (shape === 'arch') {
    inner = /*#__PURE__*/React.createElement("div", {
      style: {
        ...center,
        width: '56%',
        height: '76%',
        background: F,
        borderRadius: '999px 999px 0 0',
        position: 'relative',
        top: '12%'
      }
    }, children);
  } else if (shape === 'circle') {
    inner = /*#__PURE__*/React.createElement("div", {
      style: {
        ...center,
        width: '64%',
        height: '64%',
        borderRadius: '50%',
        background: F
      }
    }, children);
  } else if (shape === 'halves') {
    inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '80%',
        height: '40%',
        borderRadius: '0 0 999px 999px',
        background: F,
        position: 'absolute',
        top: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '80%',
        height: '40%',
        borderRadius: '999px 999px 0 0',
        background: F,
        position: 'absolute',
        bottom: 0
      }
    }));
  } else if (shape === 'flower') {
    const p = (l, t) => /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: l,
        top: t,
        width: '50%',
        height: '50%',
        borderRadius: '50%',
        background: F
      }
    });
    inner = /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '70%',
        height: '70%'
      }
    }, p('0%', '25%'), p('50%', '25%'), p('25%', '0%'), p('25%', '50%'), !at && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '35%',
        top: '35%',
        width: '30%',
        height: '30%',
        borderRadius: '50%',
        background: A
      }
    }));
  } else if (shape === 'asterisk') {
    inner = /*#__PURE__*/React.createElement("div", {
      style: {
        font: '800 1em/1 var(--font-display)',
        fontSize: 'calc(var(--tile, 120px) * 1.25)',
        color: F,
        marginTop: 'calc(var(--tile, 120px) * 0.48)'
      }
    }, "*");
  } else if (shape === 'pill') {
    inner = /*#__PURE__*/React.createElement("div", {
      style: {
        ...center,
        width: '76%',
        height: '34%',
        borderRadius: 999,
        background: F
      }
    }, children);
  }
  const px = typeof size === 'number' ? size : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...center,
      position: 'relative',
      overflow: 'hidden',
      background: B,
      width: px ? px : size || '100%',
      aspectRatio: px || !style || !style.height ? '1' : undefined,
      '--tile': px ? px + 'px' : '120px',
      containerType: 'inline-size',
      ...style
    }
  }, inner, at && /*#__PURE__*/React.createElement(__ds_scope.Eyes, {
    expression: eyes === true ? 'look' : eyes,
    look: look,
    size: at[1] + 'cqw',
    blink: blink,
    blinkDelay: blinkDelay,
    style: {
      position: 'absolute',
      left: '50%',
      top: at[0] + '%',
      translate: '-50% -50%'
    }
  }));
}
Object.assign(__ds_scope, { ShapeTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ShapeTile.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
const FILLS = {
  violet: 'var(--violet-500)',
  green: 'var(--green-500)',
  sun: 'var(--sun-500)',
  pink: 'var(--pink-500)',
  orange: 'var(--orange-500)',
  lilac: 'var(--lilac-500)'
};
function ProgressBar({
  value = 0,
  max = 100,
  tone = 'violet',
  size = 'md',
  label,
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const h = size === 'lg' ? 20 : size === 'sm' ? 10 : 16;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max,
    style: {
      flex: 1,
      height: h,
      borderRadius: 999,
      background: 'var(--cream-200)',
      overflow: 'hidden',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      borderRadius: 999,
      background: FILLS[tone] || tone,
      position: 'relative',
      transition: 'width var(--dur-slow) var(--ease-out)',
      minWidth: pct > 0 ? h : 0
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 14px/1 var(--font-display)',
      color: 'var(--fg-2)',
      whiteSpace: 'nowrap'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  placement = 'top',
  open,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const show = open !== undefined ? open : hover;
  const top = placement === 'top';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false)
  }, children, show ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      [top ? 'bottom' : 'top']: 'calc(100% + 10px)',
      transform: 'translateX(-50%)',
      background: 'var(--ink-900)',
      color: 'var(--white)',
      padding: '8px 12px',
      borderRadius: 10,
      whiteSpace: 'nowrap',
      font: '500 13px/1.3 var(--font-body)',
      boxShadow: 'var(--shadow-pop)',
      zIndex: 50,
      pointerEvents: 'none',
      animation: 'pop-in var(--dur) var(--ease-bounce)'
    }
  }, content, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      [top ? 'bottom' : 'top']: -5,
      width: 10,
      height: 10,
      background: 'var(--ink-900)',
      transform: 'translateX(-50%) rotate(45deg)',
      borderRadius: 2
    }
  })) : null);
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  checked = false,
  onChange,
  label,
  name,
  value,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 44,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: () => onChange && onChange(value),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: '50%',
      flexShrink: 0,
      background: 'var(--white)',
      border: (checked ? 8 : 2) + 'px solid ' + (checked ? 'var(--violet-500)' : 'var(--cream-300)'),
      transition: 'border var(--dur) var(--ease-bounce)'
    }
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 16px/1.3 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 44,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 54,
      height: 32,
      borderRadius: 999,
      flexShrink: 0,
      background: checked ? 'var(--violet-500)' : 'var(--cream-300)',
      transition: 'background var(--dur) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 4,
      left: checked ? 26 : 4,
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: checked ? 'var(--lilac-500)' : 'var(--white)',
      transition: 'left var(--dur-slow) var(--ease-bounce), background var(--dur) var(--ease-out)'
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 16px/1.3 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function toPascal(n) {
  return String(n).split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

/* Renders a Lucide icon by kebab-case name. Requires the Lucide UMD script on the page (window.lucide). */
function Icon({
  name,
  size = 24,
  strokeWidth = 2.25,
  color = 'currentColor',
  style,
  ...rest
}) {
  const lib = typeof window !== 'undefined' ? window.lucide : null;
  let node = lib && lib.icons ? lib.icons[toPascal(name)] : null;
  if (node && node[0] === 'svg') node = node[2];
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    }
  }, rest), (node || []).map(([tag, attrs], i) => React.createElement(tag, {
    key: i,
    ...attrs
  })));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const SOLID = {
  violet: ['var(--violet-500)', 'var(--white)'],
  lilac: ['var(--lilac-500)', 'var(--violet-500)'],
  pink: ['var(--pink-500)', 'var(--pink-900)'],
  orange: ['var(--orange-500)', 'var(--ink-900)'],
  sun: ['var(--sun-500)', 'var(--ink-900)'],
  green: ['var(--green-500)', 'var(--ink-900)'],
  sky: ['var(--sky-500)', 'var(--white)'],
  ink: ['var(--ink-900)', 'var(--white)'],
  cream: ['var(--cream-200)', 'var(--ink-700)']
};
const SOFT = {
  violet: ['var(--violet-100)', 'var(--violet-700)'],
  lilac: ['var(--lilac-300)', 'var(--lilac-900)'],
  pink: ['var(--pink-100)', 'var(--pink-900)'],
  orange: ['var(--orange-100)', 'var(--orange-900)'],
  sun: ['var(--sun-100)', 'var(--sun-900)'],
  green: ['var(--green-100)', 'var(--green-900)'],
  sky: ['var(--sky-100)', 'var(--sky-900)'],
  ink: ['var(--cream-200)', 'var(--ink-900)'],
  cream: ['var(--cream-100)', 'var(--ink-700)']
};
function Badge({
  tone = 'violet',
  variant = 'soft',
  icon,
  size = 'md',
  children,
  style
}) {
  const [bg, fg] = (variant === 'solid' ? SOLID : SOFT)[tone] || SOFT.violet;
  const h = size === 'sm' ? 22 : 28;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: h,
      padding: '0 ' + (size === 'sm' ? 8 : 11) + 'px',
      borderRadius: 999,
      background: bg,
      color: fg,
      font: '700 ' + (size === 'sm' ? 10 : 11) + 'px/1 var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 13 : 15,
    strokeWidth: 2.5
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONES = {
  ink: {
    bg: 'var(--ink-900)',
    fg: 'var(--white)',
    chip: 'var(--violet-500)',
    chipFg: 'var(--white)',
    icon: 'info'
  },
  correct: {
    bg: 'var(--green-100)',
    fg: 'var(--green-900)',
    chip: 'var(--green-500)',
    chipFg: 'var(--ink-900)',
    icon: 'check'
  },
  wrong: {
    bg: 'var(--orange-100)',
    fg: 'var(--orange-900)',
    chip: 'var(--orange-500)',
    chipFg: 'var(--ink-900)',
    icon: 'x'
  },
  streak: {
    bg: 'var(--sun-100)',
    fg: 'var(--sun-900)',
    chip: 'var(--sun-500)',
    chipFg: 'var(--ink-900)',
    icon: 'flame'
  }
};
function Toast({
  tone = 'ink',
  icon,
  title,
  message,
  action,
  onClose,
  style
}) {
  const t = TONES[tone] || TONES.ink;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 22px 10px 10px',
      minWidth: 280,
      maxWidth: 420,
      background: t.bg,
      color: t.fg,
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-pop)',
      animation: 'pop-in var(--dur-slow) var(--ease-bounce)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: t.chip,
      color: t.chipFg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || t.icon,
    size: 20,
    strokeWidth: 2.5
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, title ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 15px/1.2 var(--font-display)'
    }
  }, title) : null, message ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 13px/1.35 var(--font-body)',
      opacity: 0.85
    }
  }, message) : null), action ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: action.onClick,
    style: {
      border: 0,
      background: 'transparent',
      color: 'inherit',
      font: '700 14px/1 var(--font-display)',
      textDecoration: 'underline',
      textUnderlineOffset: 3,
      cursor: 'pointer',
      padding: '8px 4px'
    }
  }, action.label) : null, onClose ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Dismiss",
    onClick: onClose,
    style: {
      border: 0,
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      padding: 4,
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  })) : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 44,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 8,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--violet-500)' : 'var(--white)',
      border: '2px solid ' + (checked ? 'var(--violet-500)' : 'var(--cream-300)'),
      boxShadow: '0 2px 0 ' + (checked ? 'var(--violet-900)' : 'var(--cream-300)'),
      transition: 'background var(--dur) var(--ease-out)',
      color: 'var(--white)'
    }
  }, checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16,
    strokeWidth: 3.5,
    style: {
      animation: 'pop-in var(--dur-slow) var(--ease-bounce)'
    }
  }) : null), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 16px/1.3 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  icon,
  value,
  defaultValue,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  size = 'md',
  style,
  inputStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'lg' ? 60 : size === 'sm' ? 40 : 52;
  const border = error ? 'var(--orange-500)' : focus ? 'var(--violet-500)' : 'var(--cream-300)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1.2 var(--font-display)',
      color: 'var(--fg-1)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: h,
      padding: '0 16px',
      background: 'var(--white)',
      border: '2px solid ' + border,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? '0 0 0 4px ' + (error ? 'var(--orange-100)' : 'var(--violet-100)') : 'none',
      transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    color: "var(--fg-3)"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest, {
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: 'transparent',
      font: '400 ' + (size === 'lg' ? 19 : 16) + 'px/1.2 var(--font-body)',
      color: 'var(--fg-1)',
      ...inputStyle
    }
  }))), error || hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 13px/1.3 var(--font-body)',
      color: error ? 'var(--orange-700)' : 'var(--fg-3)'
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1.2 var(--font-display)',
      color: 'var(--fg-1)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest, {
    style: {
      width: '100%',
      height: 52,
      padding: '0 44px 0 16px',
      appearance: 'none',
      WebkitAppearance: 'none',
      background: 'var(--white)',
      border: '2px solid ' + (focus ? 'var(--violet-500)' : 'var(--cream-300)'),
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? '0 0 0 4px var(--violet-100)' : 'none',
      outline: 0,
      font: '500 16px/1.2 var(--font-body)',
      color: 'var(--fg-1)',
      cursor: 'pointer'
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 20,
    color: "var(--fg-2)",
    style: {
      position: 'absolute',
      right: 14,
      top: 16,
      pointerEvents: 'none'
    }
  })), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 13px/1.3 var(--font-body)',
      color: 'var(--fg-3)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  variant = 'pill',
  block = false,
  style
}) {
  const pill = variant === 'pill';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: block ? 'flex' : 'inline-flex',
      gap: pill ? 4 : 24,
      padding: pill ? 4 : 0,
      background: pill ? 'var(--cream-200)' : 'transparent',
      borderRadius: pill ? 999 : 0,
      borderBottom: pill ? 'none' : '2px solid var(--cream-200)',
      ...style
    }
  }, items.map(it => {
    const active = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": active,
      type: "button",
      onClick: () => onChange && onChange(it.id),
      style: {
        flex: block ? 1 : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: pill ? 40 : 44,
        padding: pill ? '0 18px' : '0 2px',
        border: 0,
        cursor: 'pointer',
        borderRadius: pill ? 999 : 0,
        background: pill && active ? 'var(--violet-500)' : 'transparent',
        boxShadow: pill && active ? '0 3px 0 var(--violet-900)' : 'none',
        borderBottom: pill ? 'none' : '4px solid ' + (active ? 'var(--violet-500)' : 'transparent'),
        marginBottom: pill ? 0 : -2,
        color: active ? pill ? 'var(--white)' : 'var(--violet-500)' : 'var(--fg-2)',
        font: '600 13px/1 var(--font-display)',
        letterSpacing: '-0.01em',
        transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)'
      }
    }, it.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 18
    }) : null, it.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/usePress.js
try { (() => {
/* Shared hover/press state for lipped, pressable surfaces. */
function usePress(disabled) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const handlers = disabled ? {} : {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    onTouchStart: () => setPress(true),
    onTouchEnd: () => setPress(false)
  };
  return [hover && !disabled, press && !disabled, handlers];
}
Object.assign(__ds_scope, { usePress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/usePress.js", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  primary: {
    bg: 'var(--violet-500)',
    hover: 'var(--primary-hover)',
    fg: 'var(--white)',
    lip: 'var(--violet-900)',
    border: 'transparent'
  },
  secondary: {
    bg: 'var(--lilac-500)',
    hover: 'var(--lilac-300)',
    fg: 'var(--violet-500)',
    lip: 'var(--lilac-700)',
    border: 'transparent'
  },
  outline: {
    bg: 'var(--white)',
    hover: 'var(--cream-50)',
    fg: 'var(--ink-900)',
    lip: 'var(--cream-300)',
    border: 'var(--cream-300)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'var(--violet-50)',
    fg: 'var(--violet-700)',
    lip: null,
    border: 'transparent'
  },
  correct: {
    bg: 'var(--green-500)',
    hover: '#45BE79',
    fg: 'var(--ink-900)',
    lip: 'var(--green-700)',
    border: 'transparent'
  },
  wrong: {
    bg: 'var(--orange-500)',
    hover: '#FF7440',
    fg: 'var(--ink-900)',
    lip: 'var(--orange-700)',
    border: 'transparent'
  }
};
const SIZES = {
  sm: {
    h: 36,
    px: 16,
    font: 13,
    icon: 18,
    gap: 6,
    radius: 'var(--radius-pill)'
  },
  md: {
    h: 48,
    px: 24,
    font: 15,
    icon: 20,
    gap: 8,
    radius: 'var(--radius-pill)'
  },
  lg: {
    h: 56,
    px: 28,
    font: 16,
    icon: 22,
    gap: 10,
    radius: 'var(--radius-pill)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  block = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const [hover, press, handlers] = __ds_scope.usePress(disabled);
  const lipPx = size === 'sm' ? 3 : 4;
  const showLip = v.lip && !disabled;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick
  }, handlers, rest, {
    style: {
      display: block ? 'flex' : 'inline-flex',
      width: block ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      borderRadius: s.radius,
      border: '2px solid ' + (disabled ? 'transparent' : v.border),
      background: disabled ? 'var(--cream-200)' : hover ? v.hover : v.bg,
      color: disabled ? 'var(--ink-300)' : v.fg,
      font: '600 ' + s.font + 'px/1 var(--font-display)',
      letterSpacing: '-0.02em',
      whiteSpace: 'nowrap',
      boxShadow: showLip ? '0 ' + (press ? 0 : lipPx) + 'px 0 ' + v.lip : 'none',
      transform: press && showLip ? 'translateY(' + lipPx + 'px)' : 'none',
      transition: 'background var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      ...style
    }
  }), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }) : null, children, iconRight ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  primary: {
    bg: 'var(--violet-500)',
    hover: 'var(--primary-hover)',
    fg: 'var(--white)',
    lip: 'var(--violet-900)',
    border: 'transparent'
  },
  secondary: {
    bg: 'var(--lilac-500)',
    hover: 'var(--lilac-300)',
    fg: 'var(--violet-500)',
    lip: 'var(--lilac-700)',
    border: 'transparent'
  },
  outline: {
    bg: 'var(--white)',
    hover: 'var(--cream-50)',
    fg: 'var(--ink-900)',
    lip: 'var(--cream-300)',
    border: 'var(--cream-300)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'var(--cream-200)',
    fg: 'var(--ink-700)',
    lip: null,
    border: 'transparent'
  }
};
const SIZES = {
  sm: {
    box: 36,
    icon: 18
  },
  md: {
    box: 44,
    icon: 22
  },
  lg: {
    box: 56,
    icon: 26
  }
};
function IconButton({
  icon,
  label,
  variant = 'outline',
  size = 'md',
  shape = 'square',
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.outline;
  const s = SIZES[size] || SIZES.md;
  const [hover, press, handlers] = __ds_scope.usePress(disabled);
  const showLip = v.lip && !disabled;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick
  }, handlers, rest, {
    style: {
      width: s.box,
      height: s.box,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      borderRadius: shape === 'circle' ? '50%' : size === 'sm' ? 'var(--radius-sm)' : 'var(--radius-md)',
      border: '2px solid ' + (disabled ? 'transparent' : v.border),
      background: disabled ? 'var(--cream-200)' : hover ? v.hover : v.bg,
      color: disabled ? 'var(--ink-300)' : v.fg,
      boxShadow: showLip ? '0 ' + (press ? 0 : 3) + 'px 0 ' + v.lip : 'none',
      transform: press && showLip ? 'translateY(3px)' : 'none',
      transition: 'background var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  white: {
    bg: 'var(--white)',
    fg: 'var(--ink-900)',
    lip: 'var(--cream-300)'
  },
  cream: {
    bg: 'var(--cream-200)',
    fg: 'var(--ink-900)',
    lip: 'var(--cream-300)'
  },
  violet: {
    bg: 'var(--violet-500)',
    fg: 'var(--white)',
    lip: 'var(--violet-900)'
  },
  lilac: {
    bg: 'var(--lilac-500)',
    fg: 'var(--violet-500)',
    lip: 'var(--lilac-700)'
  },
  pink: {
    bg: 'var(--pink-500)',
    fg: 'var(--pink-900)',
    lip: 'var(--pink-700)'
  },
  plum: {
    bg: 'var(--pink-900)',
    fg: 'var(--pink-500)',
    lip: '#420B37'
  },
  forest: {
    bg: 'var(--green-900)',
    fg: 'var(--green-300)',
    lip: '#002A21'
  },
  orange: {
    bg: 'var(--orange-500)',
    fg: 'var(--ink-900)',
    lip: 'var(--orange-700)'
  },
  sun: {
    bg: 'var(--sun-500)',
    fg: 'var(--violet-500)',
    lip: 'var(--sun-700)'
  },
  green: {
    bg: 'var(--green-500)',
    fg: 'var(--green-900)',
    lip: 'var(--green-700)'
  },
  sky: {
    bg: 'var(--sky-500)',
    fg: 'var(--sky-100)',
    lip: 'var(--sky-700)'
  },
  ink: {
    bg: 'var(--ink-900)',
    fg: 'var(--white)',
    lip: '#000000'
  }
};
function Card({
  tone = 'white',
  shape = 'rounded',
  padding = 24,
  interactive = false,
  onClick,
  children,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.white;
  const [hover, press, handlers] = __ds_scope.usePress(!interactive);
  const lip = interactive ? 4 : 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick
  }, interactive ? handlers : {}, {
    role: interactive ? 'button' : undefined,
    tabIndex: interactive ? 0 : undefined
  }, rest, {
    style: {
      background: t.bg,
      color: t.fg,
      padding,
      borderRadius: shape === 'arch' ? '999px 999px var(--radius-lg) var(--radius-lg)' : shape === 'square' ? 0 : 'var(--radius-lg)',
      paddingTop: shape === 'arch' ? Math.max(padding, 56) : padding,
      boxShadow: (interactive ? '0 ' + (press ? 0 : lip) + 'px 0 ' + t.lip : 'none') + (tone === 'white' && !interactive ? ', inset 0 0 0 2px var(--cream-200)' : ''),
      transform: press ? 'translateY(' + lip + 'px)' : hover ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur) var(--ease-bounce), box-shadow var(--dur-fast) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  selected = false,
  icon,
  onClick,
  onRemove,
  disabled = false,
  children,
  style
}) {
  const [hover,, handlers] = __ds_scope.usePress(disabled || !onClick);
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: disabled ? undefined : onClick
  }, handlers, {
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 38,
      padding: '0 ' + (onRemove ? 8 : 14) + 'px 0 14px',
      borderRadius: 999,
      border: '2px solid ' + (selected ? 'var(--violet-500)' : 'var(--cream-300)'),
      background: selected ? 'var(--violet-100)' : hover ? 'var(--cream-50)' : 'var(--white)',
      color: selected ? 'var(--violet-700)' : 'var(--ink-900)',
      font: '500 14px/1 var(--font-body)',
      cursor: onClick && !disabled ? 'pointer' : 'default',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
      ...style
    }
  }), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }) : null, children, onRemove ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      width: 24,
      height: 24,
      border: 0,
      borderRadius: '50%',
      background: 'transparent',
      color: 'inherit',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14,
    strokeWidth: 2.75
  })) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
const BANDS = {
  violet: 'var(--violet-500)',
  lilac: 'var(--lilac-500)',
  pink: 'var(--pink-500)',
  sun: 'var(--sun-500)',
  orange: 'var(--orange-500)',
  green: 'var(--green-500)'
};
function Dialog({
  open = true,
  onClose,
  title,
  art,
  tone = 'violet',
  actions,
  inline = false,
  children,
  style
}) {
  if (!open) return null;
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      width: '100%',
      maxWidth: 420,
      background: 'var(--white)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-pop)',
      animation: 'pop-in var(--dur-slow) var(--ease-bounce)',
      position: 'relative',
      ...style
    }
  }, onClose ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    variant: "ghost",
    size: "sm",
    onClick: onClose,
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      zIndex: 1
    }
  }) : null, art ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: 160,
      background: BANDS[tone] || tone,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, art) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, title ? /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '800 24px/1.05 var(--font-display)',
      letterSpacing: '-0.04em',
      margin: 0,
      paddingRight: art ? 0 : 32
    }
  }, title) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 16px/1.55 var(--font-body)',
      color: 'var(--fg-2)'
    }
  }, children), actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 14
    }
  }, actions) : null));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--scrim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 420
    }
  }, panel));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/learning/ChoiceTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATES = {
  idle: {
    bg: 'var(--white)',
    hover: 'var(--cream-50)',
    border: 'var(--cream-300)',
    fg: 'var(--ink-900)',
    key: 'var(--fg-3)'
  },
  selected: {
    bg: 'var(--violet-50)',
    hover: 'var(--violet-50)',
    border: 'var(--violet-500)',
    fg: 'var(--violet-700)',
    key: 'var(--violet-500)'
  },
  correct: {
    bg: 'var(--green-100)',
    hover: 'var(--green-100)',
    border: 'var(--green-500)',
    fg: 'var(--green-900)',
    key: 'var(--green-700)'
  },
  wrong: {
    bg: 'var(--orange-100)',
    hover: 'var(--orange-100)',
    border: 'var(--orange-500)',
    fg: 'var(--orange-900)',
    key: 'var(--orange-700)'
  },
  disabled: {
    bg: 'var(--cream-100)',
    hover: 'var(--cream-100)',
    border: 'var(--cream-200)',
    fg: 'var(--ink-300)',
    key: 'var(--ink-300)'
  }
};

/* Poster-tile fills: solid color blocks, square, no lip. */
const BLOCKS = {
  idle: {
    bg: 'var(--white)',
    hover: 'var(--lilac-100)',
    press: 'var(--lilac-300)',
    fg: 'var(--ink-900)',
    key: 'var(--violet-500)'
  },
  selected: {
    bg: 'var(--violet-500)',
    hover: 'var(--violet-500)',
    press: 'var(--violet-700)',
    fg: 'var(--white)',
    key: 'var(--lilac-500)'
  },
  correct: {
    bg: 'var(--green-500)',
    hover: 'var(--green-500)',
    press: 'var(--green-500)',
    fg: 'var(--green-900)',
    key: 'var(--green-900)'
  },
  wrong: {
    bg: 'var(--orange-500)',
    hover: 'var(--orange-500)',
    press: 'var(--orange-500)',
    fg: 'var(--ink-900)',
    key: 'var(--ink-900)'
  },
  disabled: {
    bg: 'var(--cream-200)',
    hover: 'var(--cream-200)',
    press: 'var(--cream-200)',
    fg: 'var(--ink-500)',
    key: 'var(--ink-300)'
  }
};
function ChoiceTile({
  state = 'idle',
  variant = 'outline',
  index,
  media,
  sublabel,
  layout = 'row',
  onClick,
  children,
  style
}) {
  const locked = state === 'disabled' || state === 'correct' || state === 'wrong';
  const [hover, press, handlers] = __ds_scope.usePress(locked);
  const anim = state === 'wrong' ? 'shake 360ms var(--ease-out)' : state === 'correct' ? 'pop-in var(--dur-slow) var(--ease-bounce)' : 'none';
  if (variant === 'block') {
    const b = BLOCKS[state] || BLOCKS.idle;
    return /*#__PURE__*/React.createElement("button", _extends({
      type: "button",
      onClick: locked ? undefined : onClick
    }, handlers, {
      "aria-pressed": state === 'selected',
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        minHeight: 112,
        padding: '14px 16px 16px',
        textAlign: 'left',
        border: 0,
        borderRadius: 0,
        background: press ? b.press : hover ? b.hover : b.bg,
        color: b.fg,
        cursor: locked ? 'default' : 'pointer',
        animation: anim,
        transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)',
        ...style
      }
    }), index !== undefined ? /*#__PURE__*/React.createElement("span", {
      style: {
        font: '900 30px/1 var(--font-display)',
        letterSpacing: '-0.05em',
        color: b.key
      }
    }, index) : /*#__PURE__*/React.createElement("span", null), media ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex'
      }
    }, media) : null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
        alignSelf: 'stretch'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 18px/1.2 var(--font-body)'
      }
    }, children), sublabel ? /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 13px/1.3 var(--font-body)',
        opacity: 0.75
      }
    }, sublabel) : null));
  }
  const s = STATES[state] || STATES.idle;
  const stack = layout === 'stack';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: locked ? undefined : onClick
  }, handlers, {
    "aria-pressed": state === 'selected',
    style: {
      display: 'flex',
      flexDirection: stack ? 'column' : 'row',
      alignItems: 'center',
      gap: stack ? 10 : 14,
      width: '100%',
      minHeight: 60,
      padding: stack ? '18px 14px 16px' : '12px 16px',
      textAlign: stack ? 'center' : 'left',
      background: hover ? s.hover : s.bg,
      color: s.fg,
      border: '2px solid ' + s.border,
      borderRadius: 'var(--radius-md)',
      boxShadow: state === 'disabled' ? 'none' : '0 ' + (press ? 0 : 4) + 'px 0 ' + s.border,
      transform: press ? 'translateY(4px)' : 'none',
      cursor: locked ? 'default' : 'pointer',
      animation: anim,
      transition: 'background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style
    }
  }), index !== undefined && !stack ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      border: '2px solid ' + s.border,
      color: s.key,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '700 12px/1 var(--font-display)',
      flexShrink: 0
    }
  }, index) : null, media ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, media) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: stack ? 'none' : 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 18px/1.25 var(--font-body)'
    }
  }, children), sublabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 13px/1.3 var(--font-body)',
      opacity: 0.7
    }
  }, sublabel) : null));
}
Object.assign(__ds_scope, { ChoiceTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/learning/ChoiceTile.jsx", error: String((e && e.message) || e) }); }

// components/learning/FeedbackBanner.jsx
try { (() => {
function FeedbackBanner({
  result = 'correct',
  title,
  answer,
  note,
  continueLabel = 'Continue',
  onContinue,
  inline = false,
  style
}) {
  const ok = result === 'correct';
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      background: ok ? 'var(--green-100)' : 'var(--orange-100)',
      padding: '20px 20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      borderRadius: inline ? 'var(--radius-lg)' : 0,
      borderTop: inline ? 'none' : '2px solid ' + (ok ? 'var(--green-500)' : 'var(--orange-500)'),
      animation: inline ? 'none' : 'slide-up var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: ok ? 'var(--green-500)' : 'var(--orange-500)',
      color: 'var(--ink-900)',
      animation: 'pop-in var(--dur-slow) var(--ease-bounce)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ok ? 'check' : 'x',
    size: 26,
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '800 22px/1.1 var(--font-display)',
      letterSpacing: '-0.04em',
      color: ok ? 'var(--green-700)' : 'var(--orange-700)'
    }
  }, title || (ok ? 'Nice one!' : 'Not quite')), answer ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 16px/1.4 var(--font-body)',
      color: ok ? 'var(--green-900)' : 'var(--orange-900)'
    }
  }, ok ? '' : 'Answer: ', answer) : null, note ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px/1.4 var(--font-body)',
      color: 'var(--fg-2)'
    }
  }, note) : null)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: ok ? 'correct' : 'wrong',
    size: "lg",
    block: true,
    onClick: onContinue
  }, continueLabel));
}
Object.assign(__ds_scope, { FeedbackBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/learning/FeedbackBanner.jsx", error: String((e && e.message) || e) }); }

// components/learning/LessonNode.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATES = {
  done: {
    bg: 'var(--sun-500)',
    fg: 'var(--ink-900)',
    lip: 'var(--sun-700)',
    icon: 'check'
  },
  current: {
    bg: 'var(--violet-500)',
    fg: 'var(--lilac-500)',
    lip: 'var(--violet-900)',
    icon: 'star'
  },
  locked: {
    bg: 'var(--cream-300)',
    fg: 'var(--ink-500)',
    lip: '#C7BFAC',
    icon: 'lock'
  },
  review: {
    bg: 'var(--pink-500)',
    fg: 'var(--pink-900)',
    lip: 'var(--pink-700)',
    icon: 'rotate-ccw'
  }
};
function LessonNode({
  state = 'locked',
  icon,
  label,
  size = 72,
  onClick,
  style
}) {
  const s = STATES[state] || STATES.locked;
  const locked = state === 'locked';
  const [hover, press, handlers] = __ds_scope.usePress(locked);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, state === 'current' ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '999px 999px ' + size * 0.26 + 'px ' + size * 0.26 + 'px',
      animation: 'pulse-ring 1.6s var(--ease-out) infinite'
    }
  }) : null, /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    onClick: locked ? undefined : onClick
  }, handlers, {
    style: {
      width: size,
      height: size * 1.12,
      padding: 0,
      border: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '999px 999px ' + size * 0.26 + 'px ' + size * 0.26 + 'px',
      background: s.bg,
      color: s.fg,
      boxShadow: '0 ' + (press ? 0 : 6) + 'px 0 ' + s.lip,
      position: 'relative',
      transform: press ? 'translateY(6px)' : hover ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur) var(--ease-bounce), box-shadow var(--dur-fast) var(--ease-out)',
      cursor: locked ? 'not-allowed' : 'pointer'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || s.icon,
    size: size * 0.42,
    strokeWidth: 2.75,
    fill: state === 'current' && !icon ? 'currentColor' : 'none'
  }))), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 12px/1.2 var(--font-display)',
      color: locked ? 'var(--fg-3)' : 'var(--fg-1)',
      textAlign: 'center',
      maxWidth: size * 1.6
    }
  }, label) : null);
}
Object.assign(__ds_scope, { LessonNode });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/learning/LessonNode.jsx", error: String((e && e.message) || e) }); }

// components/learning/WordChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function WordChip({
  used = false,
  state = 'idle',
  onClick,
  children,
  style
}) {
  const [hover, press, handlers] = __ds_scope.usePress(used);
  const tone = state === 'correct' ? ['var(--green-100)', 'var(--green-500)', 'var(--green-900)'] : state === 'wrong' ? ['var(--orange-100)', 'var(--orange-500)', 'var(--orange-900)'] : [hover ? 'var(--cream-50)' : 'var(--white)', 'var(--cream-300)', 'var(--ink-900)'];
  if (used) {
    return /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'inline-flex',
        height: 48,
        padding: '0 16px',
        alignItems: 'center',
        borderRadius: 12,
        background: 'var(--cream-200)',
        color: 'transparent',
        font: '500 17px/1 var(--font-body)',
        userSelect: 'none',
        ...style
      }
    }, children);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick
  }, handlers, {
    style: {
      display: 'inline-flex',
      height: 48,
      padding: '0 16px',
      alignItems: 'center',
      borderRadius: 12,
      background: tone[0],
      border: '2px solid ' + tone[1],
      color: tone[2],
      font: '500 17px/1 var(--font-body)',
      boxShadow: '0 ' + (press ? 0 : 3) + 'px 0 ' + tone[1],
      transform: press ? 'translateY(3px)' : 'none',
      cursor: 'pointer',
      animation: 'pop-in var(--dur) var(--ease-bounce)',
      transition: 'background var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { WordChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/learning/WordChip.jsx", error: String((e && e.message) || e) }); }

// ds-loader.js
try { (() => {
/* Resolves the component namespace for cards and UI kits.
   Uses the compiled _ds_bundle.js if present; otherwise transpiles the .jsx sources in-browser (needs React + Babel loaded first). */
(function () {
  var s = document.currentScript;
  /* Only run when loaded directly as ds-loader.js (cards, kits). The compiler also inlines this file into _ds_bundle.js; there it must do nothing. */
  if (!s || !/ds-loader\.js(\?.*)?$/.test(s.src || '')) return;
  var base = s && s.src ? s.src.replace(/ds-loader\.js(\?.*)?$/, '') : s && s.getAttribute('data-base') || './';
  var FILES = ['components/usePress.js', 'components/icons/Icon.jsx', 'components/brand/Eyes.jsx', 'components/brand/ShapeTile.jsx', 'components/brand/Critter.jsx', 'components/actions/Button.jsx', 'components/actions/IconButton.jsx', 'components/forms/Input.jsx', 'components/forms/Select.jsx', 'components/forms/Checkbox.jsx', 'components/forms/Radio.jsx', 'components/forms/Switch.jsx', 'components/display/Card.jsx', 'components/display/Badge.jsx', 'components/display/Tag.jsx', 'components/navigation/Tabs.jsx', 'components/feedback/Dialog.jsx', 'components/feedback/Toast.jsx', 'components/feedback/Tooltip.jsx', 'components/feedback/ProgressBar.jsx', 'components/learning/ChoiceTile.jsx', 'components/learning/WordChip.jsx', 'components/learning/FeedbackBanner.jsx', 'components/learning/LessonNode.jsx'];
  function findNS() {
    for (var k in window) {
      try {
        var v = window[k];
        if (v && typeof v === 'object' && v.Button && v.ChoiceTile && v.LessonNode && v.ShapeTile && v.Critter) return v;
      } catch (e) {}
    }
    return null;
  }
  window.dsReady = async function () {
    var ns = findNS();
    if (ns) return ns;
    await new Promise(function (res) {
      var sc = document.createElement('script');
      sc.src = base + '_ds_' + 'bundle.js';
      sc.onload = res;
      sc.onerror = res;
      document.head.appendChild(sc);
    });
    ns = findNS();
    if (ns) return ns;
    var DS = {};
    var srcs = await Promise.all(FILES.map(function (f) {
      return fetch(base + f).then(function (r) {
        return r.text();
      });
    }));
    srcs.forEach(function (src) {
      var names = [];
      src = src.replace(/^\s*import[^;]*;\s*$/gm, '').replace(/export\s+(function|const)\s+([A-Za-z0-9_]+)/g, function (m, kw, n) {
        names.push(n);
        return kw + ' ' + n;
      });
      var code = Babel.transform(src, {
        presets: ['react']
      }).code;
      new Function('React', 'DS', 'with(DS){(function(){' + code + '\n' + names.map(function (n) {
        return 'DS.' + n + '=' + n + ';';
      }).join('') + '})();}')(React, DS);
    });
    return DS;
  }();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ds-loader.js", error: String((e && e.message) || e) }); }

// guidelines/doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * FIRST, decide how the document paginates — up front, before building:
 *
 * - FLOWING document (the default): write the whole document as one
 *   normal HTML flow inside <doc-page>; the browser's print engine
 *   splits it onto pages at export. Use for long-form documents with a
 *   single text flow: reports, memos, letters, essays.
 * - EXPLICIT pagination: a fixed set of pre-paginated pages, one
 *   <section class="page"> child per page. Use when the user asks for a
 *   specific page count, or the design implies one: a one-page resume, a
 *   two-sided flier, a poster, a certificate, a brochure — any richly
 *   laid-out document without a single text flow.
 * - If in doubt, ask the user as part of the build.
 *
 * PAGE SIZING — paper differs by country (letter vs A4), so the printed
 * sheet is not one fixed truth:
 * - FLOWING documents pin NO paper size: the print engine paginates
 *   onto the user's real paper, and the content reflows to it.
 * - EXPLICITLY PAGINATED documents print each page at a FIXED page box
 *   with overflow hidden — letter by default, size="a4" for a clearly
 *   metric user, the user's chosen paper when they export. Design each
 *   page to FILL that box, fitting letter and A4 alike without overlap.
 * - width/height pin an explicit fixed size, ONLY when the user gives
 *   one.
 * Never write your own @page rule or hard-code paper dimensions in the
 * content.
 *
 * Sizing modes (attributes):
 *   (none)                      — portrait: flowing docs use the user's
 *           paper; explicitly paginated pages use the named size box
 *           (letter unless size="a4")
 *   orientation="landscape"     — the same, landscape
 *   width / height              — explicit fixed size, ONLY when the user
 *           gives one (e.g. width="22in" height="30in" for a 22×30
 *           poster): the page IS the design's size, printed at true
 *           dimensions (or scaled onto the user's paper at print time).
 *           Any absolute CSS length: px/in/mm/cm/pt/pc.
 * The component announces the chosen mode to the host app at runtime (a
 * meta tag it injects), so the print path can inject the user's true
 * paper size.
 *
 * On screen the document renders on a desk background: a flowing
 * document as one tall scrolling sheet (Google Docs' pageless view);
 * explicitly paginated documents as one card per page.
 *
 * EXPLICIT pagination usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page>
 *     <section class="page" id="p1">…one page's design…</section>
 *     <section class="page" id="p2">…</section>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * How the page box works, concretely: each .page prints as ONE full-bleed
 * sheet at a FIXED physical size — letter by default (set size="a4" for
 * a clearly metric user), the user's chosen paper when they export —
 * with overflow hidden. Nothing scrolls and nothing reflows onto a next
 * sheet: content that misses the box is CLIPPED. Design each page to
 * FILL that page box, and to fit it — letter and A4 alike — without
 * overlap. Each page is a size container; don't size anything in
 * viewport units (they track the window, not the page), and never set
 * width or height on the .page section itself (the component sizes the
 * page box; an authored height like 100% is meaningless at print and is
 * overridden). The component owns the page box, the screen card chrome,
 * and the page breaks (never add your own break-before/after). Don't mix
 * .page sections with flowing content or header/footer slots in the same
 * document.
 *
 * FLOWING usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * There is no manual page-splitting — the browser's print engine
 * paginates at export. Standard break-hygiene rules (`break-inside:
 * avoid` on figures, code blocks, images and table rows; `orphans/
 * widows: 3`) are applied so paragraphs and groups split cleanly. On
 * screen and at print, headings default to `text-wrap: balance` and
 * body text to `text-wrap: pretty`; the defaults have zero specificity,
 * so any text-wrap you declare wins.
 *
 * Other attributes:
 *   size    — letter | a4 | legal (default letter). Flowing documents:
 *           preview proportion only — it does NOT pin their printed
 *           paper (the print dialog's paper governs); leave it alone
 *           there. Explicitly paginated documents: it sets the page box
 *           the cards and the pinned @page share (the export dialog's
 *           choice overrides both at print) — set size="a4" for a
 *           clearly metric user. Scaled-fit: names the sheet the fit is
 *           computed against, same a4-for-metric-users advice.
 *   content-width / content-height — the design's own fixed dimensions
 *           (CSS lengths), for scaling a fixed-size design ONTO the
 *           named sheet: content lays out at exactly this size, and the
 *           component scales it to fit that sheet's printable area
 *           (centered horizontally, top-aligned; the export dialog
 *           re-fits to the user's actual paper choice where available).
 *           Both must be set; they do not change the page box. For pages
 *           WITHOUT running header/footer slots.
 *   margin  — printable inset on every page of a FLOWING document
 *           (default 0.75in); margin="0" makes pages full-bleed.
 *           Explicitly paginated pages are always full-bleed.
 *
 * Running header/footer (flowing documents only): give an element
 * `slot="header"` or `slot="footer"` and it repeats on every printed
 * page via `position: fixed`. To keep body text from sliding under it,
 * the component prints inside a single-cell table whose <thead>/<tfoot>
 * are spacers sized to the header/footer height — browsers repeat
 * thead/tfoot on every page, so each sheet's content starts below the
 * header and ends above the footer. On screen the header/footer render
 * once at the top/bottom of the sheet.
 *
 * At print the component injects `@page { margin: 0 }` (which leaves
 * Chrome no margin box to draw its date/URL/page-count header in) and
 * moves the visual margin onto the sheet's own padding. It also marks
 * the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks in flowing documents: `break-before: page` on an
 *   element that must start a new page (a chapter, an appendix). Add
 *   your own kept-together blocks (callouts, stat tiles, cards) to a
 *   `break-inside: avoid` rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  // WebKit (Safari and every iOS browser shell) never repeats a table's
  // thead/tfoot on printed pages (WebKit bug 17205), so the spacer-borne
  // vertical margins of a FLOWING document reach only the first page
  // there. Engine check, not browser check: vendor is 'Apple Computer,
  // Inc.' exactly for WebKit and 'Google Inc.' for Blink.
  const WK_PRINT = /apple/i.test(navigator.vendor || '');
  // CSS length → px number (CSS absolute units are exact: 1in = 96px).
  // Returns NaN for anything safeLen would reject — callers gate on it.
  const PX_PER = {
    px: 1,
    in: 96,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    pt: 96 / 72,
    pc: 16
  };
  const toPx = v => {
    const m = /^(\d+(?:\.\d+)?)(px|in|mm|cm|pt|pc)$/.exec((v || '').trim());
    return m ? parseFloat(m[1]) * PX_PER[m[2]] : NaN;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #f5f5f4;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 10px rgba(20, 20, 19, 0.12);
      border-radius: 7px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    /* Scaled-fit mode (content-width/content-height): the inner .fit box
     * lays the content out at its authored fixed size and scales it onto
     * the printable area; .fit-box reserves the scaled footprint in flow
     * (transforms don't affect layout) and centers it. Without the mode,
     * both divs are unstyled block pass-throughs. */
    /* Explicit pagination: direct .page children are the pages. The sheet
     * becomes a transparent stack and each page carries the card look on
     * screen; at print each page is exactly one full-bleed sheet. The
     * ::slotted defaults are deliberately weak (document CSS wins), so
     * authored page styling can override any of this. */
    .sheet.paginated {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }
    .paginated ::slotted(.page) {
      position: relative;
      display: block;
      width: 100%;
      aspect-ratio: var(--doc-page-ar);
      container-type: size;
      overflow: hidden;
      box-sizing: border-box;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      break-inside: avoid;
    }
    .paginated ::slotted(.page:not(:first-child)) { margin-top: 1rem; }
    @media print {
      .sheet.paginated { padding: 0; }
      /* The flowing-document vertical inset lives on the repeating
       * thead/tfoot spacers, not the sheet padding — they must go too,
       * or each full-sheet .page is pushed ~margin down and spills onto
       * a second sheet. Paginated pages are full-bleed by definition
       * (content owns its insets). */
      .sheet.paginated .hdr-space,
      .sheet.paginated .ftr-space { height: 0; }
      .paginated ::slotted(.page) {
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        /* Physical page-box sizing, no viewport units: Safari resolves
         * 100vh against the window, not the page box, so a vh-sized card
         * paginates wrong there. --doc-page-w/h are the named size by
         * default and are overridden to the user's chosen paper by the
         * export path, so every card is exactly one sheet either way.
         * Width + height (same source values as @page size) rather than
         * width + aspect-ratio: the ratio is a 6-decimal rounding of the
         * same division, and a few millionths of overflow would spill a
         * blank sheet after every page. The screen-only aspect-ratio
         * (preview proportions) must not leak into print. cqh typography
         * tracks the same box.
         *
         * Every declaration is !important: per CSS Scoping, unimportant
         * shadow ::slotted rules LOSE to the document context, so a page
         * section's authored inline style would silently beat this print
         * geometry. A model-authored height:100% did exactly that — the
         * percentage resolves as auto in the all-auto print ancestry, the
         * base rule's size containment turns auto into ZERO, and
         * overflow:hidden then paints nothing: a blank PDF with perfect
         * page boxes. At print the component's geometry is the design's
         * whole contract, so it must win over any authored sizing. */
        aspect-ratio: auto !important;
        width: var(--doc-page-w) !important;
        height: var(--doc-page-h) !important;
        overflow: hidden !important;
      }
      .paginated ::slotted(.page:not(:first-child)) {
        break-before: page !important;
        margin-top: 0 !important;
      }
    }
    .fit-mode .fit-box {
      width: calc(var(--doc-fit-w) * var(--doc-fit-scale));
      height: calc(var(--doc-fit-h) * var(--doc-fit-scale));
      margin: 0 auto;
      break-inside: avoid;
    }
    /* Monolithic at print: Blink slices a transform-scaled child at
     * fragmentainer boundaries mapped in UNSCALED layout coordinates
     * (transforms are paint-time), so the .fit box (authored size, e.g.
     * 1400x990) gets cut at the page's free block space and spills onto
     * a second sheet even though its SCALED footprint fits the page by
     * construction. overflow:hidden makes .fit-box a scroll container —
     * monolithic under fragmentation (css-break-3) — so the scaled
     * content prints atomically on one sheet. No clipping for content
     * within the authored box: .fit-box is calc-sized to exactly the
     * scaled footprint. (Content that bleeds past content-width/height
     * is clipped at the footprint — fit mode's contract; it previously
     * painted beyond it at print.) Print-only, so the screen rendering
     * keeps visible overflow for editor affordances.
     * The export path injects the same rule into frozen copies
     * (print-eval.ts om-print-fit-contain). The .fit-mode scope is
     * load-bearing: .fit-box wraps slotted content in EVERY mode, and an
     * unscoped overflow:hidden would make whole flowing documents
     * monolithic (one truncated sheet). overflow:hidden, never clip —
     * clip is not a scroll container, so not monolithic. */
    @media print {
      .fit-mode .fit-box { overflow: hidden; }
    }
    .fit-mode .fit {
      width: var(--doc-fit-w);
      height: var(--doc-fit-h);
      transform: scale(var(--doc-fit-scale));
      transform-origin: top left;
    }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      /* WebKit flowing documents: @page carries the vertical margin (see
       * _syncPrintPageRule), so the spacers keep only whatever a running
       * header/footer needs BEYOND it — page 1 would otherwise double its
       * top inset. Paginated sheets already zero their spacers above. */
      .sheet.wk-print:not(.paginated) .hdr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))) - var(--doc-page-margin))); }
      .sheet.wk-print:not(.paginated) .ftr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))) - var(--doc-page-margin))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation', 'content-width', 'content-height'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }

    /** Scaled-fit mode's content box [w, h] as CSS lengths, or null when
     *  the mode is off (either attribute missing/invalid/zero — a partial
     *  declaration falls back to normal flow rather than guessing). */
    _contentFit() {
      const w = safeLen(this.getAttribute('content-width'), null);
      const h = safeLen(this.getAttribute('content-height'), null);
      if (!w || !h) return null;
      const wPx = toPx(w),
        hPx = toPx(h);
      return wPx > 0 && hPx > 0 ? [w, h, wPx, hPx] : null;
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      const survivor = document.querySelector('doc-page');
      if (!survivor) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print', 'doc-page-fixed-size', 'doc-page-print-sizing'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
        // A live deck-stage deferred its own print-sizing meta to ours —
        // hand the page-global meta over so the deck isn't left unmarked.
        const deck = document.querySelector('deck-stage');
        if (deck && typeof deck._ensurePrintSizingMeta === 'function') {
          deck._ensurePrintSizingMeta();
        }
      } else {
        // A departed owner hands each page-global meta to whatever
        // doc-page remains (or it's removed).
        if (typeof survivor._syncFixedSizeMeta === 'function') {
          survivor._syncFixedSizeMeta();
        }
        if (typeof survivor._syncPrintSizingMeta === 'function') {
          survivor._syncPrintSizingMeta();
        }
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><div class="fit-box"><div class="fit"><slot></slot></div></div></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      // Scaled-fit mode: content at its authored size, scaled onto the
      // printable area (page minus margins on both axes). The factor is a
      // plain number var so calc(length * number) stays valid; 4 decimals
      // keeps the shadow style stable across re-measures. Upscaling is
      // allowed — print transforms are vector, so text and CSS stay crisp
      // (raster images soften, which the catalog bullet warns about).
      const fit = this._contentFit();
      let fitVars = '';
      if (fit) {
        const marginPx = toPx(this.pageMargin) || 0;
        const availW = toPx(this.pageWidth) - 2 * marginPx;
        const availH = toPx(this.pageHeight) - 2 * marginPx;
        const scale = Math.min(availW / fit[2], availH / fit[3]);
        if (scale > 0 && Number.isFinite(scale)) {
          fitVars = '--doc-fit-w:' + fit[0] + ';' + '--doc-fit-h:' + fit[1] + ';' + '--doc-fit-scale:' + scale.toFixed(4) + ';';
        }
      }
      this._sheet.classList.toggle('fit-mode', !!fitVars);
      // Numeric w/h ratio for the paginated page cards' aspect-ratio —
      // aspect-ratio takes a number, not a length ratio, so compute it
      // here (CSS length division isn't portable). 6 decimals keeps the
      // shadow style stable across re-syncs.
      const arW = toPx(this.pageWidth);
      const arH = toPx(this.pageHeight);
      const ar = arW > 0 && arH > 0 ? (arW / arH).toFixed(6) : '0.772727';
      this._vars.textContent = ':host{' + fitVars + '--doc-page-ar:' + ar + ';' + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document.
     *
     *  The @page SIZE is pinned where the page box IS part of the design:
     *  explicit-fixed-size mode (width + height authored), scaled-fit
     *  mode (the named sheet the fit targets), and explicit pagination
     *  (the named size the cards share — so card and sheet agree on
     *  every print path, and the export path's chosen paper overrides
     *  BOTH with one later rule). For FLOWING documents no paper size is
     *  emitted at all — the true size comes from the user's preference,
     *  injected by the export path or chosen in the print dialog — so a
     *  flowing document never fights the paper it lands on.
     *  margin: 0 is emitted in every mode: it leaves Chrome no margin box
     *  to draw its date/URL/page-count header in, and the visual margin
     *  lives on the sheet's own padding. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      // Three print-geometry regimes:
      // - true-size: the page IS the design — pin its exact size.
      // - scaled-fit (content-width/height): the fit factor is computed
      //   against the NAMED paper's printable area, so that paper must
      //   stay pinned or the scaled content overflows a smaller sheet
      //   (the export path re-fits and re-pins at print time on top).
      // - default modes: no paper size — but landscape still needs the
      //   paper-agnostic 'size: landscape' keyword, because the size
      //   descriptor is what carries orientation; without it a landscape
      //   document prints portrait whenever nothing injects a size.
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      // Explicit pagination pins the page box to the SAME values that
      // size the cards (the named size by default, the export path's
      // chosen paper when its later rule overrides both) — card and
      // sheet agree on every print path, and a mismatched real paper
      // shrinks-to-fit in the dialog instead of clipping a Letter card
      // on A4. Declared before the paginated read below so both derive
      // from one check.
      const paginatedNow = this.querySelector(':scope > .page') !== null;
      const sizeDescriptor = this._trueSizePx() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : this._contentFit() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : paginatedNow ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : landscape ? 'size: landscape; ' : '';
      // WebKit never repeats the thead/tfoot spacers that carry a flowing
      // document's vertical page margins (see WK_PRINT above), so pages
      // after the first print edge-to-edge there. Carry the VERTICAL
      // margins on @page for WebKit instead, and the shadow print CSS
      // trims the first-page spacers by the same amount (.sheet.wk-print
      // rules). Horizontal inset stays on the sheet's own padding in
      // every engine. Blink keeps margin: 0 (a nonzero margin there
      // re-opens the box Chrome draws its header furniture in). One cost,
      // learned in testing: Safari's own date/URL headers are a USER
      // dialog setting ("Print headers and footers") that renders in the
      // margin area when room exists — margin: 0 only suppressed it by
      // leaving no room, and no CSS controls it. The export dialog's
      // Safari guide teaches turning the setting off for flowing
      // documents. Explicitly paginated and fixed-size documents keep
      // margin: 0 everywhere: their pages ARE the sheet.
      const wkFlowing = WK_PRINT && !paginatedNow && !this._trueSizePx() && !this._contentFit();
      const marginDescriptor = wkFlowing ? 'margin: ' + this.pageMargin + ' 0; ' : 'margin: 0; ';
      // Shadow-internal marker (never serialized), kept in lockstep with
      // the @page decision above: the print CSS trims the first-page
      // spacers ONLY while @page actually carries the margins — a
      // true-size or scaled-fit sheet keeps margin: 0 and must keep its
      // spacers too. Re-synced here so attribute changes and pagination
      // flips move both together.
      if (this._sheet) this._sheet.classList.toggle('wk-print', wkFlowing);
      tag.textContent = '@page { ' + sizeDescriptor + marginDescriptor + '} ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; ' + 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }

    /** This page's valid true-size page box (explicit width AND height)
     *  as [w, h] px ints, or null when the mode is off. */
    _trueSizePx() {
      if (!safeLen(this.getAttribute('width'), null) || !safeLen(this.getAttribute('height'), null)) return null;
      const w = Math.round(toPx(this.pageWidth));
      const h = Math.round(toPx(this.pageHeight));
      return w > 0 && h > 0 ? [w, h] : null;
    }

    /** True-size pages (explicit width AND height) also declare the page
     *  box as the preview size: the in-app preview reads
     *  meta[name="omelette-fixed-size"] (content "W,H" in px ints) and
     *  scales the sheet into view — without it an 18in poster previews at
     *  true size with scrollbars. Never overrides an author-set meta
     *  (only the component's own id is managed). The meta is page-global
     *  while doc-page instances are not, so every sync recomputes the
     *  page-wide owner — the first connected true-size doc-page — and a
     *  non-true-size sibling's sync can never delete the owner's meta.
     *  Removed when no true-size page remains (the owner's disconnect
     *  re-syncs via any survivor) or when an author-set meta exists. */
    _syncFixedSizeMeta() {
      const id = 'doc-page-fixed-size';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-fixed-size"]:not([data-omelette-injected])');
      // The page-wide owner, not this instance: an upgraded true-size page
      // anywhere in the document keeps the meta alive and sized.
      let box = null;
      for (const el of document.querySelectorAll('doc-page')) {
        box = typeof el._trueSizePx === 'function' ? el._trueSizePx() : null;
        if (box) break;
      }
      if (!box || authored) {
        if (own) own.remove();
        return;
      }
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-fixed-size';
      tag.content = box[0] + ',' + box[1];
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }

    /** This page's print-sizing mode: 'fixed' when an explicit width AND
     *  height are authored (the page is the design's own size), else the
     *  default paper in the authored orientation. */
    _printSizingMode() {
      if (this._trueSizePx()) return 'fixed';
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? 'default-landscape' : 'default-portrait';
    }

    /** Announces the print-sizing mode to the host app:
     *  meta[name="omelette-print-sizing"] with content 'default-portrait',
     *  'default-landscape', or 'fixed' (fixed pages also carry the
     *  omelette-fixed-size meta with the page box in px). The export path
     *  probes it to decide what true paper size to inject at print time —
     *  in the default modes the component emits no paper size of its own.
     *  Same page-global ownership rules as the fixed-size meta above:
     *  first connected doc-page owns it, an authored meta is never
     *  overridden, removed when no doc-page remains. */
    _syncPrintSizingMeta() {
      const id = 'doc-page-print-sizing';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-print-sizing"]:not([data-omelette-injected])');
      // A fixed page wins outright (mirroring the fixed-size loop above,
      // so the two metas can never contradict each other in a mixed
      // multi-page document); otherwise the first page's mode holds.
      let mode = null;
      for (const el of document.querySelectorAll('doc-page')) {
        if (typeof el._printSizingMode !== 'function') continue;
        const m = el._printSizingMode();
        if (m === 'fixed') {
          mode = m;
          break;
        }
        if (mode === null) mode = m;
      }
      if (!mode || authored) {
        if (own) own.remove();
        return;
      }
      // A deck-stage that connected first injected its own meta and
      // defers to any existing one — take it over, or the document ends
      // up with two conflicting injected metas (a doc-page page is the
      // document; the deck re-ensures its meta if every doc-page leaves).
      const deckMeta = document.getElementById('deck-stage-print-sizing');
      if (deckMeta) deckMeta.remove();
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-print-sizing';
      tag.content = mode;
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. The
     *  same pass detects explicit pagination (direct .page children) and
     *  toggles the sheet between the flowing-document card and the
     *  page-per-card stack — content edits can add or remove pages at any
     *  time, so this tracks the same mutations the measurement does. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      const wasPaginated = this._sheet.classList.contains('paginated');
      this._sheet.classList.toggle('paginated', this.querySelector(':scope > .page') !== null);
      // The WebKit @page margin is flowing-only, so a pagination flip
      // must re-emit the rule (content edits can add or remove .page
      // sections at any time).
      if (this._sheet.classList.contains('paginated') !== wasPaginated) {
        this._syncPrintPageRule();
      }
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "guidelines/doc-page.js", error: String((e && e.message) || e) }); }

// ui_kits/app/CompleteScreen.jsx
try { (() => {
function CompleteScreen({
  onContinue
}) {
  const {
    Button,
    Icon,
    ShapeTile
  } = window.DS;
  const stats = [{
    label: 'XP earned',
    value: '+15',
    bg: 'var(--sun-500)',
    fg: 'var(--violet-500)',
    icon: 'zap'
  }, {
    label: 'Accuracy',
    value: '92%',
    bg: 'var(--green-900)',
    fg: 'var(--green-300)',
    icon: 'target'
  }, {
    label: 'Time',
    value: '3:40',
    bg: 'var(--pink-500)',
    fg: 'var(--pink-900)',
    icon: 'timer'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--violet-500)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr 1fr',
      height: 240
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement(ShapeTile, {
    shape: "halves",
    style: {
      height: '100%',
      aspectRatio: 'auto'
    }
  }), /*#__PURE__*/React.createElement(ShapeTile, {
    shape: "circle",
    bg: "sun-500",
    fg: "pink-500",
    style: {
      height: '100%',
      aspectRatio: 'auto'
    }
  })), /*#__PURE__*/React.createElement(ShapeTile, {
    shape: "arch",
    bg: "lilac-500",
    fg: "violet-500",
    style: {
      height: '100%',
      aspectRatio: 'auto',
      animation: 'pop-in var(--dur-slow) var(--ease-bounce)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 64,
    strokeWidth: 2,
    color: "var(--lilac-500)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement(ShapeTile, {
    shape: "flower",
    style: {
      height: '100%',
      aspectRatio: 'auto'
    }
  }), /*#__PURE__*/React.createElement(ShapeTile, {
    shape: "asterisk",
    bg: "pink-900",
    fg: "pink-500",
    style: {
      height: '100%',
      aspectRatio: 'auto'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '24px 24px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '900 40px/0.92 var(--font-display)',
      letterSpacing: '-0.05em',
      color: 'var(--lilac-500)'
    }
  }, "Le\xE7on termin\xE9e !"), /*#__PURE__*/React.createElement("p", {
    className: "t-lg",
    style: {
      color: 'var(--violet-100)'
    }
  }, "You can now order a coffee in French.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)'
    }
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      background: s.bg,
      color: s.fg,
      padding: '14px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 22,
    strokeWidth: 2.5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '900 24px/1 var(--font-display)',
      letterSpacing: '-0.05em'
    }
  }, s.value), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px/1.2 var(--font-body)'
    }
  }, s.label)))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 28px/1 var(--font-hand)',
      color: 'var(--lilac-500)',
      transform: 'rotate(-4deg)',
      alignSelf: 'flex-end'
    }
  }, "13 days in a row!")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 28px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    block: true,
    onClick: onContinue
  }, "Continue")));
}
window.CompleteScreen = CompleteScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/CompleteScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LessonScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const EXERCISES = [{
  type: 'choice',
  prompt: 'What does this mean?',
  word: 'le café',
  options: ['the tea', 'the coffee', 'the cake', 'the milk'],
  answer: 1
}, {
  type: 'build',
  prompt: 'Translate this sentence',
  source: 'I would like a coffee, please.',
  bank: ['café', 'Je', 'thé', 'plaît', 'un', 'voudrais', 'vous', "s'il", 'une'],
  answer: ['Je', 'voudrais', 'un', 'café', "s'il", 'vous', 'plaît']
}, {
  type: 'type',
  prompt: 'Type in French',
  source: 'the water',
  answer: "l'eau"
}];
function LessonScreen({
  onExit,
  onDone
}) {
  const {
    IconButton,
    ProgressBar,
    Badge,
    ChoiceTile,
    WordChip,
    Input,
    Button,
    FeedbackBanner,
    Dialog,
    ShapeTile
  } = window.DS;
  const [step, setStep] = React.useState(0);
  const [pick, setPick] = React.useState(null);
  const [built, setBuilt] = React.useState([]);
  const [typed, setTyped] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [hearts, setHearts] = React.useState(5);
  const [quit, setQuit] = React.useState(false);
  const ex = EXERCISES[step];
  const ready = ex.type === 'choice' ? pick !== null : ex.type === 'build' ? built.length > 0 : typed.trim().length > 0;
  const check = () => {
    let ok;
    if (ex.type === 'choice') ok = pick === ex.answer;else if (ex.type === 'build') ok = built.map(i => ex.bank[i]).join(' ') === ex.answer.join(' ');else ok = typed.trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ') === ex.answer;
    if (!ok) setHearts(h => Math.max(0, h - 1));
    setResult(ok ? 'correct' : 'wrong');
  };
  const next = () => {
    if (step === EXERCISES.length - 1) return onDone();
    setStep(step + 1);
    setPick(null);
    setBuilt([]);
    setTyped('');
    setResult(null);
  };
  const correctText = ex.type === 'choice' ? ex.options[ex.answer] : ex.type === 'build' ? ex.answer.join(' ').replace(" s'il", ", s'il") + '.' : ex.answer;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '18px 20px 8px'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "Quit lesson",
    variant: "ghost",
    onClick: () => setQuit(true)
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    value: step + (result ? 1 : 0),
    max: EXERCISES.length,
    tone: "green",
    size: "lg",
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "pink",
    icon: "heart"
  }, hearts)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '16px 0 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      overflow: 'auto',
      scrollbarWidth: 'none'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "t-h4",
    style: {
      padding: '0 20px'
    }
  }, ex.prompt), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 84px',
      minHeight: 132
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--lilac-500)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 12
    }
  }, ex.type === 'build' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "volume-2",
    label: "Play audio",
    variant: "primary"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 18px/1.35 var(--font-body)',
      color: 'var(--violet-900)'
    }
  }, ex.source)) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, ex.type === 'choice' ? /*#__PURE__*/React.createElement(IconButton, {
    icon: "volume-2",
    label: "Play audio",
    variant: "primary",
    size: "lg"
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '900 34px/1 var(--font-display)',
      letterSpacing: '-0.05em',
      color: 'var(--violet-500)',
      whiteSpace: 'nowrap'
    }
  }, ex.type === 'choice' ? ex.word : ex.source)), ex.type === 'type' ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 24px/1 var(--font-hand)',
      color: 'var(--violet-900)',
      transform: 'rotate(-3deg)',
      alignSelf: 'flex-start'
    }
  }, "l' before a vowel!") : null), /*#__PURE__*/React.createElement(ShapeTile, _extends({
    shape: ex.type === 'choice' ? 'asterisk' : ex.type === 'build' ? 'halves' : 'arch'
  }, ex.type === 'choice' ? {
    bg: 'violet-500',
    fg: 'lilac-500'
  } : ex.type === 'build' ? {
    bg: 'orange-500',
    fg: 'orange-300'
  } : {
    bg: 'green-900',
    fg: 'green-500'
  }, {
    style: {
      height: '100%',
      aspectRatio: 'auto'
    }
  }))), ex.type === 'choice' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      background: 'var(--ink-900)',
      borderTop: '2px solid var(--ink-900)',
      borderBottom: '2px solid var(--ink-900)',
      marginTop: -20
    }
  }, ex.options.map((o, i) => {
    let st = pick === i ? 'selected' : 'idle';
    if (result) st = i === ex.answer ? 'correct' : pick === i ? 'wrong' : 'disabled';
    return /*#__PURE__*/React.createElement(ChoiceTile, {
      key: o,
      variant: "block",
      index: i + 1,
      state: st,
      onClick: () => setPick(i)
    }, o);
  })) : null, ex.type === 'build' ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 120,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignContent: 'flex-start',
      padding: '12px 0',
      borderTop: '2px solid var(--cream-300)',
      borderBottom: '2px solid var(--cream-300)',
      backgroundImage: 'linear-gradient(transparent 58px, var(--cream-300) 58px, var(--cream-300) 60px, transparent 60px)',
      backgroundSize: '100% 62px'
    }
  }, built.map(i => /*#__PURE__*/React.createElement(WordChip, {
    key: i,
    state: result || 'idle',
    onClick: () => !result && setBuilt(b => b.filter(x => x !== i))
  }, ex.bank[i]))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center'
    }
  }, ex.bank.map((w, i) => /*#__PURE__*/React.createElement(WordChip, {
    key: i,
    used: built.includes(i),
    onClick: () => !result && setBuilt(b => [...b, i])
  }, w)))) : null, ex.type === 'type' ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "lg",
    placeholder: "\xC9cris en fran\xE7ais",
    value: typed,
    onChange: e => setTyped(e.target.value),
    disabled: !!result,
    autoFocus: true
  })) : null), result ? /*#__PURE__*/React.createElement(FeedbackBanner, {
    result: result,
    answer: result === 'wrong' ? correctText : 'Très bien. ' + correctText,
    continueLabel: result === 'correct' ? 'Continue' : 'Got it',
    onContinue: next
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 28px',
      borderTop: '2px solid var(--cream-200)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    block: true,
    disabled: !ready,
    onClick: check
  }, "Check")), quit ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim)',
      display: 'flex',
      alignItems: 'center',
      padding: 20,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(Dialog, {
    inline: true,
    title: "Leave this lesson?",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      block: true,
      onClick: () => setQuit(false)
    }, "Keep learning"), /*#__PURE__*/React.createElement(Button, {
      block: true,
      variant: "ghost",
      onClick: onExit
    }, "Leave"))
  }, "You'll lose progress on this lesson.")) : null);
}
window.LessonScreen = LessonScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LessonScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/PathScreen.jsx
try { (() => {
function PathScreen({
  done,
  onStart
}) {
  const {
    LessonNode,
    Badge,
    Card,
    Button,
    Icon,
    ShapeTile
  } = window.DS;
  const nodes = [{
    label: 'Bonjour',
    state: 'done',
    x: 0
  }, {
    label: 'Numbers',
    state: 'done',
    x: -70
  }, {
    label: 'Review',
    state: 'review',
    x: -40
  }, {
    label: 'Café',
    state: done ? 'done' : 'current',
    x: 40
  }, {
    label: 'Ordering',
    state: done ? 'current' : 'locked',
    x: 80
  }, {
    label: 'Paying',
    state: 'locked',
    x: 20
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 20px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '900 22px/1 var(--font-display)',
      letterSpacing: '-0.05em',
      color: 'var(--violet-500)'
    }
  }, "ap\xE9ro club"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "ink",
    variant: "solid"
  }, "FR"), /*#__PURE__*/React.createElement(Badge, {
    tone: "sun",
    icon: "flame"
  }, done ? 13 : 12), /*#__PURE__*/React.createElement(Badge, {
    tone: "violet",
    icon: "zap"
  }, done ? 255 : 240))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      scrollbarWidth: 'none',
      padding: '4px 0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 96px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "violet",
    shape: "square",
    padding: 20,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-eyebrow",
    style: {
      color: 'var(--lilac-500)'
    }
  }, "Unit 2"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '900 30px/0.95 var(--font-display)',
      letterSpacing: '-0.05em',
      color: 'var(--lilac-500)'
    }
  }, "At the caf\xE9"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px/1.4 var(--font-body)',
      color: 'var(--violet-100)'
    }
  }, "Order food and drinks politely"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "book-open",
    style: {
      alignSelf: 'flex-start',
      marginTop: 6
    }
  }, "Guide")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement(ShapeTile, {
    shape: "flower",
    style: {
      height: '100%',
      aspectRatio: 'auto'
    }
  }), /*#__PURE__*/React.createElement(ShapeTile, {
    shape: "arch",
    bg: "sun-500",
    fg: "violet-500",
    style: {
      height: '100%',
      aspectRatio: 'auto'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22,
      padding: '32px 0 8px',
      position: 'relative'
    }
  }, nodes.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      transform: 'translateX(' + n.x + 'px)',
      position: 'relative'
    }
  }, n.state === 'current' ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: -30,
      transform: 'translateX(-50%)',
      background: 'var(--ink-900)',
      color: 'var(--white)',
      font: '700 12px/1 var(--font-display)',
      padding: '7px 14px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      zIndex: 2
    }
  }, "Start") : null, n.state === 'current' ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 'calc(100% + 14px)',
      top: 26,
      font: '700 24px/1 var(--font-hand)',
      color: 'var(--orange-500)',
      transform: 'rotate(-6deg)',
      whiteSpace: 'nowrap'
    }
  }, "you're here!") : null, /*#__PURE__*/React.createElement(LessonNode, {
    state: n.state,
    label: n.label,
    onClick: n.state === 'current' ? onStart : undefined
  }))))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 12px 22px',
      borderTop: '2px solid var(--cream-200)',
      background: 'var(--cream-100)'
    }
  }, [['house', 'Learn', true], ['rotate-ccw', 'Review'], ['mic', 'Speak'], ['user', 'Me']].map(([ic, l, a]) => /*#__PURE__*/React.createElement("button", {
    key: l,
    type: "button",
    style: {
      border: 0,
      background: a ? 'var(--violet-500)' : 'transparent',
      color: a ? 'var(--lilac-500)' : 'var(--fg-2)',
      borderRadius: 999,
      padding: '9px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      font: '600 11px/1 var(--font-display)',
      cursor: 'pointer',
      minWidth: 64
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 22
  }), l))));
}
window.PathScreen = PathScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/PathScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Critter = __ds_scope.Critter;

__ds_ns.Eyes = __ds_scope.Eyes;

__ds_ns.ShapeTile = __ds_scope.ShapeTile;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ChoiceTile = __ds_scope.ChoiceTile;

__ds_ns.FeedbackBanner = __ds_scope.FeedbackBanner;

__ds_ns.LessonNode = __ds_scope.LessonNode;

__ds_ns.WordChip = __ds_scope.WordChip;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
