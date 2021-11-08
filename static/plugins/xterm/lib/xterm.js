!function (e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else {
        var r = t();
        for (var i in r) ("object" == typeof exports ? exports : e)[i] = r[i]
    }
}(self, (function () {
    return (() => {
        "use strict";
        var e = {
            4567: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.AccessibilityManager = void 0;
                var o = r(9042), s = r(6114), a = r(6193), c = r(3656), l = r(844), h = r(5596), u = r(9631),
                    f = function (e) {
                        function t(t, r) {
                            var i = e.call(this) || this;
                            i._terminal = t, i._renderService = r, i._liveRegionLineCount = 0, i._charsToConsume = [], i._charsToAnnounce = "", i._accessibilityTreeRoot = document.createElement("div"), i._accessibilityTreeRoot.classList.add("xterm-accessibility"), i._rowContainer = document.createElement("div"), i._rowContainer.setAttribute("role", "list"), i._rowContainer.classList.add("xterm-accessibility-tree"), i._rowElements = [];
                            for (var n = 0; n < i._terminal.rows; n++) i._rowElements[n] = i._createAccessibilityTreeNode(), i._rowContainer.appendChild(i._rowElements[n]);
                            if (i._topBoundaryFocusListener = function (e) {
                                return i._onBoundaryFocus(e, 0)
                            }, i._bottomBoundaryFocusListener = function (e) {
                                return i._onBoundaryFocus(e, 1)
                            }, i._rowElements[0].addEventListener("focus", i._topBoundaryFocusListener), i._rowElements[i._rowElements.length - 1].addEventListener("focus", i._bottomBoundaryFocusListener), i._refreshRowsDimensions(), i._accessibilityTreeRoot.appendChild(i._rowContainer), i._renderRowsDebouncer = new a.RenderDebouncer(i._renderRows.bind(i)), i._refreshRows(), i._liveRegion = document.createElement("div"), i._liveRegion.classList.add("live-region"), i._liveRegion.setAttribute("aria-live", "assertive"), i._accessibilityTreeRoot.appendChild(i._liveRegion), !i._terminal.element) throw new Error("Cannot enable accessibility before Terminal.open");
                            return i._terminal.element.insertAdjacentElement("afterbegin", i._accessibilityTreeRoot), i.register(i._renderRowsDebouncer), i.register(i._terminal.onResize((function (e) {
                                return i._onResize(e.rows)
                            }))), i.register(i._terminal.onRender((function (e) {
                                return i._refreshRows(e.start, e.end)
                            }))), i.register(i._terminal.onScroll((function () {
                                return i._refreshRows()
                            }))), i.register(i._terminal.onA11yChar((function (e) {
                                return i._onChar(e)
                            }))), i.register(i._terminal.onLineFeed((function () {
                                return i._onChar("\n")
                            }))), i.register(i._terminal.onA11yTab((function (e) {
                                return i._onTab(e)
                            }))), i.register(i._terminal.onKey((function (e) {
                                return i._onKey(e.key)
                            }))), i.register(i._terminal.onBlur((function () {
                                return i._clearLiveRegion()
                            }))), i.register(i._renderService.onDimensionsChange((function () {
                                return i._refreshRowsDimensions()
                            }))), i._screenDprMonitor = new h.ScreenDprMonitor, i.register(i._screenDprMonitor), i._screenDprMonitor.setListener((function () {
                                return i._refreshRowsDimensions()
                            })), i.register(c.addDisposableDomListener(window, "resize", (function () {
                                return i._refreshRowsDimensions()
                            }))), i
                        }

                        return n(t, e), t.prototype.dispose = function () {
                            e.prototype.dispose.call(this), u.removeElementFromParent(this._accessibilityTreeRoot), this._rowElements.length = 0
                        }, t.prototype._onBoundaryFocus = function (e, t) {
                            var r = e.target, i = this._rowElements[0 === t ? 1 : this._rowElements.length - 2];
                            if (r.getAttribute("aria-posinset") !== (0 === t ? "1" : "" + this._terminal.buffer.lines.length) && e.relatedTarget === i) {
                                var n, o;
                                if (0 === t ? (n = r, o = this._rowElements.pop(), this._rowContainer.removeChild(o)) : (n = this._rowElements.shift(), o = r, this._rowContainer.removeChild(n)), n.removeEventListener("focus", this._topBoundaryFocusListener), o.removeEventListener("focus", this._bottomBoundaryFocusListener), 0 === t) {
                                    var s = this._createAccessibilityTreeNode();
                                    this._rowElements.unshift(s), this._rowContainer.insertAdjacentElement("afterbegin", s)
                                } else s = this._createAccessibilityTreeNode(), this._rowElements.push(s), this._rowContainer.appendChild(s);
                                this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._terminal.scrollLines(0 === t ? -1 : 1), this._rowElements[0 === t ? 1 : this._rowElements.length - 2].focus(), e.preventDefault(), e.stopImmediatePropagation()
                            }
                        }, t.prototype._onResize = function (e) {
                            this._rowElements[this._rowElements.length - 1].removeEventListener("focus", this._bottomBoundaryFocusListener);
                            for (var t = this._rowContainer.children.length; t < this._terminal.rows; t++) this._rowElements[t] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[t]);
                            for (; this._rowElements.length > e;) this._rowContainer.removeChild(this._rowElements.pop());
                            this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._refreshRowsDimensions()
                        }, t.prototype._createAccessibilityTreeNode = function () {
                            var e = document.createElement("div");
                            return e.setAttribute("role", "listitem"), e.tabIndex = -1, this._refreshRowDimensions(e), e
                        }, t.prototype._onTab = function (e) {
                            for (var t = 0; t < e; t++) this._onChar(" ")
                        }, t.prototype._onChar = function (e) {
                            var t = this;
                            this._liveRegionLineCount < 21 && (this._charsToConsume.length > 0 ? this._charsToConsume.shift() !== e && (this._charsToAnnounce += e) : this._charsToAnnounce += e, "\n" === e && (this._liveRegionLineCount++, 21 === this._liveRegionLineCount && (this._liveRegion.textContent += o.tooMuchOutput)), s.isMac && this._liveRegion.textContent && this._liveRegion.textContent.length > 0 && !this._liveRegion.parentNode && setTimeout((function () {
                                t._accessibilityTreeRoot.appendChild(t._liveRegion)
                            }), 0))
                        }, t.prototype._clearLiveRegion = function () {
                            this._liveRegion.textContent = "", this._liveRegionLineCount = 0, s.isMac && u.removeElementFromParent(this._liveRegion)
                        }, t.prototype._onKey = function (e) {
                            this._clearLiveRegion(), this._charsToConsume.push(e)
                        }, t.prototype._refreshRows = function (e, t) {
                            this._renderRowsDebouncer.refresh(e, t, this._terminal.rows)
                        }, t.prototype._renderRows = function (e, t) {
                            for (var r = this._terminal.buffer, i = r.lines.length.toString(), n = e; n <= t; n++) {
                                var o = r.translateBufferLineToString(r.ydisp + n, !0),
                                    s = (r.ydisp + n + 1).toString(), a = this._rowElements[n];
                                a && (0 === o.length ? a.innerText = " " : a.textContent = o, a.setAttribute("aria-posinset", s), a.setAttribute("aria-setsize", i))
                            }
                            this._announceCharacters()
                        }, t.prototype._refreshRowsDimensions = function () {
                            if (this._renderService.dimensions.actualCellHeight) {
                                this._rowElements.length !== this._terminal.rows && this._onResize(this._terminal.rows);
                                for (var e = 0; e < this._terminal.rows; e++) this._refreshRowDimensions(this._rowElements[e])
                            }
                        }, t.prototype._refreshRowDimensions = function (e) {
                            e.style.height = this._renderService.dimensions.actualCellHeight + "px"
                        }, t.prototype._announceCharacters = function () {
                            0 !== this._charsToAnnounce.length && (this._liveRegion.textContent += this._charsToAnnounce, this._charsToAnnounce = "")
                        }, t
                    }(l.Disposable);
                t.AccessibilityManager = f
            }, 3614: (e, t) => {
                function r(e) {
                    return e.replace(/\r?\n/g, "\r")
                }

                function i(e, t) {
                    return t ? "[200~" + e + "[201~" : e
                }

                function n(e, t, n) {
                    e = i(e = r(e), n.decPrivateModes.bracketedPasteMode), n.triggerDataEvent(e, !0), t.value = ""
                }

                function o(e, t, r) {
                    var i = r.getBoundingClientRect(), n = e.clientX - i.left - 10, o = e.clientY - i.top - 10;
                    t.style.width = "20px", t.style.height = "20px", t.style.left = n + "px", t.style.top = o + "px", t.style.zIndex = "1000", t.focus()
                }

                Object.defineProperty(t, "__esModule", {value: !0}), t.rightClickHandler = t.moveTextAreaUnderMouseCursor = t.paste = t.handlePasteEvent = t.copyHandler = t.bracketTextForPaste = t.prepareTextForTerminal = void 0, t.prepareTextForTerminal = r, t.bracketTextForPaste = i, t.copyHandler = function (e, t) {
                    e.clipboardData && e.clipboardData.setData("text/plain", t.selectionText), e.preventDefault()
                }, t.handlePasteEvent = function (e, t, r) {
                    e.stopPropagation(), e.clipboardData && n(e.clipboardData.getData("text/plain"), t, r)
                }, t.paste = n, t.moveTextAreaUnderMouseCursor = o, t.rightClickHandler = function (e, t, r, i, n) {
                    o(e, t, r), n && i.rightClickSelect(e), t.value = i.selectionText, t.select()
                }
            }, 4774: (e, t) => {
                var r, i, n, o;

                function s(e) {
                    var t = e.toString(16);
                    return t.length < 2 ? "0" + t : t
                }

                function a(e, t) {
                    return e < t ? (t + .05) / (e + .05) : (e + .05) / (t + .05)
                }

                Object.defineProperty(t, "__esModule", {value: !0}), t.contrastRatio = t.toPaddedHex = t.rgba = t.rgb = t.css = t.color = t.channels = void 0, function (e) {
                    e.toCss = function (e, t, r, i) {
                        return void 0 !== i ? "#" + s(e) + s(t) + s(r) + s(i) : "#" + s(e) + s(t) + s(r)
                    }, e.toRgba = function (e, t, r, i) {
                        return void 0 === i && (i = 255), (e << 24 | t << 16 | r << 8 | i) >>> 0
                    }
                }(r = t.channels || (t.channels = {})), (i = t.color || (t.color = {})).blend = function (e, t) {
                    var i = (255 & t.rgba) / 255;
                    if (1 === i) return {css: t.css, rgba: t.rgba};
                    var n = t.rgba >> 24 & 255, o = t.rgba >> 16 & 255, s = t.rgba >> 8 & 255, a = e.rgba >> 24 & 255,
                        c = e.rgba >> 16 & 255, l = e.rgba >> 8 & 255, h = a + Math.round((n - a) * i),
                        u = c + Math.round((o - c) * i), f = l + Math.round((s - l) * i);
                    return {css: r.toCss(h, u, f), rgba: r.toRgba(h, u, f)}
                }, i.isOpaque = function (e) {
                    return 255 == (255 & e.rgba)
                }, i.ensureContrastRatio = function (e, t, r) {
                    var i = o.ensureContrastRatio(e.rgba, t.rgba, r);
                    if (i) return o.toColor(i >> 24 & 255, i >> 16 & 255, i >> 8 & 255)
                }, i.opaque = function (e) {
                    var t = (255 | e.rgba) >>> 0, i = o.toChannels(t), n = i[0], s = i[1], a = i[2];
                    return {css: r.toCss(n, s, a), rgba: t}
                }, i.opacity = function (e, t) {
                    var i = Math.round(255 * t), n = o.toChannels(e.rgba), s = n[0], a = n[1], c = n[2];
                    return {css: r.toCss(s, a, c, i), rgba: r.toRgba(s, a, c, i)}
                }, (t.css || (t.css = {})).toColor = function (e) {
                    switch (e.length) {
                        case 7:
                            return {css: e, rgba: (parseInt(e.slice(1), 16) << 8 | 255) >>> 0};
                        case 9:
                            return {css: e, rgba: parseInt(e.slice(1), 16) >>> 0}
                    }
                    throw new Error("css.toColor: Unsupported css format")
                }, function (e) {
                    function t(e, t, r) {
                        var i = e / 255, n = t / 255, o = r / 255;
                        return .2126 * (i <= .03928 ? i / 12.92 : Math.pow((i + .055) / 1.055, 2.4)) + .7152 * (n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4)) + .0722 * (o <= .03928 ? o / 12.92 : Math.pow((o + .055) / 1.055, 2.4))
                    }

                    e.relativeLuminance = function (e) {
                        return t(e >> 16 & 255, e >> 8 & 255, 255 & e)
                    }, e.relativeLuminance2 = t
                }(n = t.rgb || (t.rgb = {})), function (e) {
                    function t(e, t, r) {
                        for (var i = e >> 24 & 255, o = e >> 16 & 255, s = e >> 8 & 255, c = t >> 24 & 255, l = t >> 16 & 255, h = t >> 8 & 255, u = a(n.relativeLuminance2(c, h, l), n.relativeLuminance2(i, o, s)); u < r && (c > 0 || l > 0 || h > 0);) c -= Math.max(0, Math.ceil(.1 * c)), l -= Math.max(0, Math.ceil(.1 * l)), h -= Math.max(0, Math.ceil(.1 * h)), u = a(n.relativeLuminance2(c, h, l), n.relativeLuminance2(i, o, s));
                        return (c << 24 | l << 16 | h << 8 | 255) >>> 0
                    }

                    function i(e, t, r) {
                        for (var i = e >> 24 & 255, o = e >> 16 & 255, s = e >> 8 & 255, c = t >> 24 & 255, l = t >> 16 & 255, h = t >> 8 & 255, u = a(n.relativeLuminance2(c, h, l), n.relativeLuminance2(i, o, s)); u < r && (c < 255 || l < 255 || h < 255);) c = Math.min(255, c + Math.ceil(.1 * (255 - c))), l = Math.min(255, l + Math.ceil(.1 * (255 - l))), h = Math.min(255, h + Math.ceil(.1 * (255 - h))), u = a(n.relativeLuminance2(c, h, l), n.relativeLuminance2(i, o, s));
                        return (c << 24 | l << 16 | h << 8 | 255) >>> 0
                    }

                    e.ensureContrastRatio = function (e, r, o) {
                        var s = n.relativeLuminance(e >> 8), c = n.relativeLuminance(r >> 8);
                        if (a(s, c) < o) return c < s ? t(e, r, o) : i(e, r, o)
                    }, e.reduceLuminance = t, e.increaseLuminance = i, e.toChannels = function (e) {
                        return [e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e]
                    }, e.toColor = function (e, t, i) {
                        return {css: r.toCss(e, t, i), rgba: r.toRgba(e, t, i)}
                    }
                }(o = t.rgba || (t.rgba = {})), t.toPaddedHex = s, t.contrastRatio = a
            }, 7239: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.ColorContrastCache = void 0;
                var r = function () {
                    function e() {
                        this._color = {}, this._rgba = {}
                    }

                    return e.prototype.clear = function () {
                        this._color = {}, this._rgba = {}
                    }, e.prototype.setCss = function (e, t, r) {
                        this._rgba[e] || (this._rgba[e] = {}), this._rgba[e][t] = r
                    }, e.prototype.getCss = function (e, t) {
                        return this._rgba[e] ? this._rgba[e][t] : void 0
                    }, e.prototype.setColor = function (e, t, r) {
                        this._color[e] || (this._color[e] = {}), this._color[e][t] = r
                    }, e.prototype.getColor = function (e, t) {
                        return this._color[e] ? this._color[e][t] : void 0
                    }, e
                }();
                t.ColorContrastCache = r
            }, 5680: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.ColorManager = t.DEFAULT_ANSI_COLORS = void 0;
                var i = r(4774), n = r(7239), o = i.css.toColor("#ffffff"), s = i.css.toColor("#000000"),
                    a = i.css.toColor("#ffffff"), c = i.css.toColor("#000000"),
                    l = {css: "rgba(255, 255, 255, 0.3)", rgba: 4294967117};
                t.DEFAULT_ANSI_COLORS = Object.freeze(function () {
                    for (var e = [i.css.toColor("#2e3436"), i.css.toColor("#cc0000"), i.css.toColor("#4e9a06"), i.css.toColor("#c4a000"), i.css.toColor("#3465a4"), i.css.toColor("#75507b"), i.css.toColor("#06989a"), i.css.toColor("#d3d7cf"), i.css.toColor("#555753"), i.css.toColor("#ef2929"), i.css.toColor("#8ae234"), i.css.toColor("#fce94f"), i.css.toColor("#729fcf"), i.css.toColor("#ad7fa8"), i.css.toColor("#34e2e2"), i.css.toColor("#eeeeec")], t = [0, 95, 135, 175, 215, 255], r = 0; r < 216; r++) {
                        var n = t[r / 36 % 6 | 0], o = t[r / 6 % 6 | 0], s = t[r % 6];
                        e.push({css: i.channels.toCss(n, o, s), rgba: i.channels.toRgba(n, o, s)})
                    }
                    for (r = 0; r < 24; r++) {
                        var a = 8 + 10 * r;
                        e.push({css: i.channels.toCss(a, a, a), rgba: i.channels.toRgba(a, a, a)})
                    }
                    return e
                }());
                var h = function () {
                    function e(e, r) {
                        this.allowTransparency = r;
                        var h = e.createElement("canvas");
                        h.width = 1, h.height = 1;
                        var u = h.getContext("2d");
                        if (!u) throw new Error("Could not get rendering context");
                        this._ctx = u, this._ctx.globalCompositeOperation = "copy", this._litmusColor = this._ctx.createLinearGradient(0, 0, 1, 1), this._contrastCache = new n.ColorContrastCache, this.colors = {
                            foreground: o,
                            background: s,
                            cursor: a,
                            cursorAccent: c,
                            selectionTransparent: l,
                            selectionOpaque: i.color.blend(s, l),
                            ansi: t.DEFAULT_ANSI_COLORS.slice(),
                            contrastCache: this._contrastCache
                        }
                    }

                    return e.prototype.onOptionsChange = function (e) {
                        "minimumContrastRatio" === e && this._contrastCache.clear()
                    }, e.prototype.setTheme = function (e) {
                        void 0 === e && (e = {}), this.colors.foreground = this._parseColor(e.foreground, o), this.colors.background = this._parseColor(e.background, s), this.colors.cursor = this._parseColor(e.cursor, a, !0), this.colors.cursorAccent = this._parseColor(e.cursorAccent, c, !0), this.colors.selectionTransparent = this._parseColor(e.selection, l, !0), this.colors.selectionOpaque = i.color.blend(this.colors.background, this.colors.selectionTransparent), i.color.isOpaque(this.colors.selectionTransparent) && (this.colors.selectionTransparent = i.color.opacity(this.colors.selectionTransparent, .3)), this.colors.ansi[0] = this._parseColor(e.black, t.DEFAULT_ANSI_COLORS[0]), this.colors.ansi[1] = this._parseColor(e.red, t.DEFAULT_ANSI_COLORS[1]), this.colors.ansi[2] = this._parseColor(e.green, t.DEFAULT_ANSI_COLORS[2]), this.colors.ansi[3] = this._parseColor(e.yellow, t.DEFAULT_ANSI_COLORS[3]), this.colors.ansi[4] = this._parseColor(e.blue, t.DEFAULT_ANSI_COLORS[4]), this.colors.ansi[5] = this._parseColor(e.magenta, t.DEFAULT_ANSI_COLORS[5]), this.colors.ansi[6] = this._parseColor(e.cyan, t.DEFAULT_ANSI_COLORS[6]), this.colors.ansi[7] = this._parseColor(e.white, t.DEFAULT_ANSI_COLORS[7]), this.colors.ansi[8] = this._parseColor(e.brightBlack, t.DEFAULT_ANSI_COLORS[8]), this.colors.ansi[9] = this._parseColor(e.brightRed, t.DEFAULT_ANSI_COLORS[9]), this.colors.ansi[10] = this._parseColor(e.brightGreen, t.DEFAULT_ANSI_COLORS[10]), this.colors.ansi[11] = this._parseColor(e.brightYellow, t.DEFAULT_ANSI_COLORS[11]), this.colors.ansi[12] = this._parseColor(e.brightBlue, t.DEFAULT_ANSI_COLORS[12]), this.colors.ansi[13] = this._parseColor(e.brightMagenta, t.DEFAULT_ANSI_COLORS[13]), this.colors.ansi[14] = this._parseColor(e.brightCyan, t.DEFAULT_ANSI_COLORS[14]), this.colors.ansi[15] = this._parseColor(e.brightWhite, t.DEFAULT_ANSI_COLORS[15]), this._contrastCache.clear()
                    }, e.prototype._parseColor = function (e, t, r) {
                        if (void 0 === r && (r = this.allowTransparency), void 0 === e) return t;
                        if (this._ctx.fillStyle = this._litmusColor, this._ctx.fillStyle = e, "string" != typeof this._ctx.fillStyle) return console.warn("Color: " + e + " is invalid using fallback " + t.css), t;
                        this._ctx.fillRect(0, 0, 1, 1);
                        var n = this._ctx.getImageData(0, 0, 1, 1).data;
                        if (255 !== n[3]) {
                            if (!r) return console.warn("Color: " + e + " is using transparency, but allowTransparency is false. Using fallback " + t.css + "."), t;
                            var o = this._ctx.fillStyle.substring(5, this._ctx.fillStyle.length - 1).split(",").map((function (e) {
                                return Number(e)
                            })), s = o[0], a = o[1], c = o[2], l = o[3], h = Math.round(255 * l);
                            return {rgba: i.channels.toRgba(s, a, c, h), css: e}
                        }
                        return {css: this._ctx.fillStyle, rgba: i.channels.toRgba(n[0], n[1], n[2], n[3])}
                    }, e
                }();
                t.ColorManager = h
            }, 9631: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.removeElementFromParent = void 0, t.removeElementFromParent = function () {
                    for (var e, t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
                    for (var i = 0, n = t; i < n.length; i++) {
                        var o = n[i];
                        null === (e = null == o ? void 0 : o.parentElement) || void 0 === e || e.removeChild(o)
                    }
                }
            }, 3656: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.addDisposableDomListener = void 0, t.addDisposableDomListener = function (e, t, r, i) {
                    e.addEventListener(t, r, i);
                    var n = !1;
                    return {
                        dispose: function () {
                            n || (n = !0, e.removeEventListener(t, r, i))
                        }
                    }
                }
            }, 3551: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.MouseZone = t.Linkifier = void 0;
                var o = r(8460), s = r(2585), a = function () {
                    function e(e, t, r) {
                        this._bufferService = e, this._logService = t, this._unicodeService = r, this._linkMatchers = [], this._nextLinkMatcherId = 0, this._onShowLinkUnderline = new o.EventEmitter, this._onHideLinkUnderline = new o.EventEmitter, this._onLinkTooltip = new o.EventEmitter, this._rowsToLinkify = {
                            start: void 0,
                            end: void 0
                        }
                    }

                    return Object.defineProperty(e.prototype, "onShowLinkUnderline", {
                        get: function () {
                            return this._onShowLinkUnderline.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "onHideLinkUnderline", {
                        get: function () {
                            return this._onHideLinkUnderline.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "onLinkTooltip", {
                        get: function () {
                            return this._onLinkTooltip.event
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.attachToDom = function (e, t) {
                        this._element = e, this._mouseZoneManager = t
                    }, e.prototype.linkifyRows = function (t, r) {
                        var i = this;
                        this._mouseZoneManager && (void 0 === this._rowsToLinkify.start || void 0 === this._rowsToLinkify.end ? (this._rowsToLinkify.start = t, this._rowsToLinkify.end = r) : (this._rowsToLinkify.start = Math.min(this._rowsToLinkify.start, t), this._rowsToLinkify.end = Math.max(this._rowsToLinkify.end, r)), this._mouseZoneManager.clearAll(t, r), this._rowsTimeoutId && clearTimeout(this._rowsTimeoutId), this._rowsTimeoutId = setTimeout((function () {
                            return i._linkifyRows()
                        }), e._timeBeforeLatency))
                    }, e.prototype._linkifyRows = function () {
                        this._rowsTimeoutId = void 0;
                        var e = this._bufferService.buffer;
                        if (void 0 !== this._rowsToLinkify.start && void 0 !== this._rowsToLinkify.end) {
                            var t = e.ydisp + this._rowsToLinkify.start;
                            if (!(t >= e.lines.length)) {
                                for (var r = e.ydisp + Math.min(this._rowsToLinkify.end, this._bufferService.rows) + 1, i = Math.ceil(2e3 / this._bufferService.cols), n = this._bufferService.buffer.iterator(!1, t, r, i, i); n.hasNext();) for (var o = n.next(), s = 0; s < this._linkMatchers.length; s++) this._doLinkifyRow(o.range.first, o.content, this._linkMatchers[s]);
                                this._rowsToLinkify.start = void 0, this._rowsToLinkify.end = void 0
                            }
                        } else this._logService.debug("_rowToLinkify was unset before _linkifyRows was called")
                    }, e.prototype.registerLinkMatcher = function (e, t, r) {
                        if (void 0 === r && (r = {}), !t) throw new Error("handler must be defined");
                        var i = {
                            id: this._nextLinkMatcherId++,
                            regex: e,
                            handler: t,
                            matchIndex: r.matchIndex,
                            validationCallback: r.validationCallback,
                            hoverTooltipCallback: r.tooltipCallback,
                            hoverLeaveCallback: r.leaveCallback,
                            willLinkActivate: r.willLinkActivate,
                            priority: r.priority || 0
                        };
                        return this._addLinkMatcherToList(i), i.id
                    }, e.prototype._addLinkMatcherToList = function (e) {
                        if (0 !== this._linkMatchers.length) {
                            for (var t = this._linkMatchers.length - 1; t >= 0; t--) if (e.priority <= this._linkMatchers[t].priority) return void this._linkMatchers.splice(t + 1, 0, e);
                            this._linkMatchers.splice(0, 0, e)
                        } else this._linkMatchers.push(e)
                    }, e.prototype.deregisterLinkMatcher = function (e) {
                        for (var t = 0; t < this._linkMatchers.length; t++) if (this._linkMatchers[t].id === e) return this._linkMatchers.splice(t, 1), !0;
                        return !1
                    }, e.prototype._doLinkifyRow = function (e, t, r) {
                        for (var i, n = this, o = new RegExp(r.regex.source, (r.regex.flags || "") + "g"), s = -1, a = function () {
                            var a = i["number" != typeof r.matchIndex ? 0 : r.matchIndex];
                            if (!a) return c._logService.debug("match found without corresponding matchIndex", i, r), "break";
                            if (s = t.indexOf(a, s + 1), o.lastIndex = s + a.length, s < 0) return "break";
                            var l = c._bufferService.buffer.stringIndexToBufferIndex(e, s);
                            if (l[0] < 0) return "break";
                            var h = c._bufferService.buffer.lines.get(l[0]);
                            if (!h) return "break";
                            var u = h.getFg(l[1]), f = u ? u >> 9 & 511 : void 0;
                            r.validationCallback ? r.validationCallback(a, (function (e) {
                                n._rowsTimeoutId || e && n._addLink(l[1], l[0] - n._bufferService.buffer.ydisp, a, r, f)
                            })) : c._addLink(l[1], l[0] - c._bufferService.buffer.ydisp, a, r, f)
                        }, c = this; null !== (i = o.exec(t)) && "break" !== a();) ;
                    }, e.prototype._addLink = function (e, t, r, i, n) {
                        var o = this;
                        if (this._mouseZoneManager && this._element) {
                            var s = this._unicodeService.getStringCellWidth(r), a = e % this._bufferService.cols,
                                l = t + Math.floor(e / this._bufferService.cols),
                                h = (a + s) % this._bufferService.cols,
                                u = l + Math.floor((a + s) / this._bufferService.cols);
                            0 === h && (h = this._bufferService.cols, u--), this._mouseZoneManager.add(new c(a + 1, l + 1, h + 1, u + 1, (function (e) {
                                if (i.handler) return i.handler(e, r);
                                var t = window.open();
                                t ? (t.opener = null, t.location.href = r) : console.warn("Opening link blocked as opener could not be cleared")
                            }), (function () {
                                o._onShowLinkUnderline.fire(o._createLinkHoverEvent(a, l, h, u, n)), o._element.classList.add("xterm-cursor-pointer")
                            }), (function (e) {
                                o._onLinkTooltip.fire(o._createLinkHoverEvent(a, l, h, u, n)), i.hoverTooltipCallback && i.hoverTooltipCallback(e, r, {
                                    start: {
                                        x: a,
                                        y: l
                                    }, end: {x: h, y: u}
                                })
                            }), (function () {
                                o._onHideLinkUnderline.fire(o._createLinkHoverEvent(a, l, h, u, n)), o._element.classList.remove("xterm-cursor-pointer"), i.hoverLeaveCallback && i.hoverLeaveCallback()
                            }), (function (e) {
                                return !i.willLinkActivate || i.willLinkActivate(e, r)
                            })))
                        }
                    }, e.prototype._createLinkHoverEvent = function (e, t, r, i, n) {
                        return {x1: e, y1: t, x2: r, y2: i, cols: this._bufferService.cols, fg: n}
                    }, e._timeBeforeLatency = 200, e = i([n(0, s.IBufferService), n(1, s.ILogService), n(2, s.IUnicodeService)], e)
                }();
                t.Linkifier = a;
                var c = function (e, t, r, i, n, o, s, a, c) {
                    this.x1 = e, this.y1 = t, this.x2 = r, this.y2 = i, this.clickCallback = n, this.hoverCallback = o, this.tooltipCallback = s, this.leaveCallback = a, this.willLinkActivate = c
                };
                t.MouseZone = c
            }, 6465: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.Linkifier2 = void 0;
                var a = r(2585), c = r(8460), l = r(844), h = r(3656), u = function (e) {
                    function t(t) {
                        var r = e.call(this) || this;
                        return r._bufferService = t, r._linkProviders = [], r._linkCacheDisposables = [], r._isMouseOut = !0, r._activeLine = -1, r._onShowLinkUnderline = r.register(new c.EventEmitter), r._onHideLinkUnderline = r.register(new c.EventEmitter), r.register(l.getDisposeArrayDisposable(r._linkCacheDisposables)), r
                    }

                    return n(t, e), Object.defineProperty(t.prototype, "currentLink", {
                        get: function () {
                            return this._currentLink
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onShowLinkUnderline", {
                        get: function () {
                            return this._onShowLinkUnderline.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onHideLinkUnderline", {
                        get: function () {
                            return this._onHideLinkUnderline.event
                        }, enumerable: !1, configurable: !0
                    }), t.prototype.registerLinkProvider = function (e) {
                        var t = this;
                        return this._linkProviders.push(e), {
                            dispose: function () {
                                var r = t._linkProviders.indexOf(e);
                                -1 !== r && t._linkProviders.splice(r, 1)
                            }
                        }
                    }, t.prototype.attachToDom = function (e, t, r) {
                        var i = this;
                        this._element = e, this._mouseService = t, this._renderService = r, this.register(h.addDisposableDomListener(this._element, "mouseleave", (function () {
                            i._isMouseOut = !0, i._clearCurrentLink()
                        }))), this.register(h.addDisposableDomListener(this._element, "mousemove", this._onMouseMove.bind(this))), this.register(h.addDisposableDomListener(this._element, "click", this._onClick.bind(this)))
                    }, t.prototype._onMouseMove = function (e) {
                        if (this._lastMouseEvent = e, this._element && this._mouseService) {
                            var t = this._positionFromMouseEvent(e, this._element, this._mouseService);
                            if (t) {
                                this._isMouseOut = !1;
                                for (var r = e.composedPath(), i = 0; i < r.length; i++) {
                                    var n = r[i];
                                    if (n.classList.contains("xterm")) break;
                                    if (n.classList.contains("xterm-hover")) return
                                }
                                this._lastBufferCell && t.x === this._lastBufferCell.x && t.y === this._lastBufferCell.y || (this._onHover(t), this._lastBufferCell = t)
                            }
                        }
                    }, t.prototype._onHover = function (e) {
                        if (this._activeLine !== e.y) return this._clearCurrentLink(), void this._askForLink(e, !1);
                        this._currentLink && this._linkAtPosition(this._currentLink.link, e) || (this._clearCurrentLink(), this._askForLink(e, !0))
                    }, t.prototype._askForLink = function (e, t) {
                        var r, i = this;
                        this._activeProviderReplies && t || (null === (r = this._activeProviderReplies) || void 0 === r || r.forEach((function (e) {
                            null == e || e.forEach((function (e) {
                                e.link.dispose && e.link.dispose()
                            }))
                        })), this._activeProviderReplies = new Map, this._activeLine = e.y);
                        var n = !1;
                        this._linkProviders.forEach((function (r, o) {
                            var s;
                            t ? (null === (s = i._activeProviderReplies) || void 0 === s ? void 0 : s.get(o)) && (n = i._checkLinkProviderResult(o, e, n)) : r.provideLinks(e.y, (function (t) {
                                var r, s;
                                if (!i._isMouseOut) {
                                    var a = null == t ? void 0 : t.map((function (e) {
                                        return {link: e}
                                    }));
                                    null === (r = i._activeProviderReplies) || void 0 === r || r.set(o, a), n = i._checkLinkProviderResult(o, e, n), (null === (s = i._activeProviderReplies) || void 0 === s ? void 0 : s.size) === i._linkProviders.length && i._removeIntersectingLinks(e.y, i._activeProviderReplies)
                                }
                            }))
                        }))
                    }, t.prototype._removeIntersectingLinks = function (e, t) {
                        for (var r = new Set, i = 0; i < t.size; i++) {
                            var n = t.get(i);
                            if (n) for (var o = 0; o < n.length; o++) for (var s = n[o], a = s.link.range.start.y < e ? 0 : s.link.range.start.x, c = s.link.range.end.y > e ? this._bufferService.cols : s.link.range.end.x, l = a; l <= c; l++) {
                                if (r.has(l)) {
                                    n.splice(o--, 1);
                                    break
                                }
                                r.add(l)
                            }
                        }
                    }, t.prototype._checkLinkProviderResult = function (e, t, r) {
                        var i, n = this;
                        if (!this._activeProviderReplies) return r;
                        for (var o = this._activeProviderReplies.get(e), s = !1, a = 0; a < e; a++) this._activeProviderReplies.has(a) && !this._activeProviderReplies.get(a) || (s = !0);
                        if (!s && o) {
                            var c = o.find((function (e) {
                                return n._linkAtPosition(e.link, t)
                            }));
                            c && (r = !0, this._handleNewLink(c))
                        }
                        if (this._activeProviderReplies.size === this._linkProviders.length && !r) for (a = 0; a < this._activeProviderReplies.size; a++) {
                            var l = null === (i = this._activeProviderReplies.get(a)) || void 0 === i ? void 0 : i.find((function (e) {
                                return n._linkAtPosition(e.link, t)
                            }));
                            if (l) {
                                r = !0, this._handleNewLink(l);
                                break
                            }
                        }
                        return r
                    }, t.prototype._onClick = function (e) {
                        if (this._element && this._mouseService && this._currentLink) {
                            var t = this._positionFromMouseEvent(e, this._element, this._mouseService);
                            t && this._linkAtPosition(this._currentLink.link, t) && this._currentLink.link.activate(e, this._currentLink.link.text)
                        }
                    }, t.prototype._clearCurrentLink = function (e, t) {
                        this._element && this._currentLink && this._lastMouseEvent && (!e || !t || this._currentLink.link.range.start.y >= e && this._currentLink.link.range.end.y <= t) && (this._linkLeave(this._element, this._currentLink.link, this._lastMouseEvent), this._currentLink = void 0, l.disposeArray(this._linkCacheDisposables))
                    }, t.prototype._handleNewLink = function (e) {
                        var t = this;
                        if (this._element && this._lastMouseEvent && this._mouseService) {
                            var r = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
                            r && this._linkAtPosition(e.link, r) && (this._currentLink = e, this._currentLink.state = {
                                decorations: {
                                    underline: void 0 === e.link.decorations || e.link.decorations.underline,
                                    pointerCursor: void 0 === e.link.decorations || e.link.decorations.pointerCursor
                                }, isHovered: !0
                            }, this._linkHover(this._element, e.link, this._lastMouseEvent), e.link.decorations = {}, Object.defineProperties(e.link.decorations, {
                                pointerCursor: {
                                    get: function () {
                                        var e, r;
                                        return null === (r = null === (e = t._currentLink) || void 0 === e ? void 0 : e.state) || void 0 === r ? void 0 : r.decorations.pointerCursor
                                    }, set: function (e) {
                                        var r, i;
                                        (null === (r = t._currentLink) || void 0 === r ? void 0 : r.state) && t._currentLink.state.decorations.pointerCursor !== e && (t._currentLink.state.decorations.pointerCursor = e, t._currentLink.state.isHovered && (null === (i = t._element) || void 0 === i || i.classList.toggle("xterm-cursor-pointer", e)))
                                    }
                                }, underline: {
                                    get: function () {
                                        var e, r;
                                        return null === (r = null === (e = t._currentLink) || void 0 === e ? void 0 : e.state) || void 0 === r ? void 0 : r.decorations.underline
                                    }, set: function (r) {
                                        var i, n, o;
                                        (null === (i = t._currentLink) || void 0 === i ? void 0 : i.state) && (null === (o = null === (n = t._currentLink) || void 0 === n ? void 0 : n.state) || void 0 === o ? void 0 : o.decorations.underline) !== r && (t._currentLink.state.decorations.underline = r, t._currentLink.state.isHovered && t._fireUnderlineEvent(e.link, r))
                                    }
                                }
                            }), this._renderService && this._linkCacheDisposables.push(this._renderService.onRenderedBufferChange((function (e) {
                                var r = 0 === e.start ? 0 : e.start + 1 + t._bufferService.buffer.ydisp;
                                t._clearCurrentLink(r, e.end + 1 + t._bufferService.buffer.ydisp)
                            }))))
                        }
                    }, t.prototype._linkHover = function (e, t, r) {
                        var i;
                        (null === (i = this._currentLink) || void 0 === i ? void 0 : i.state) && (this._currentLink.state.isHovered = !0, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(t, !0), this._currentLink.state.decorations.pointerCursor && e.classList.add("xterm-cursor-pointer")), t.hover && t.hover(r, t.text)
                    }, t.prototype._fireUnderlineEvent = function (e, t) {
                        var r = e.range, i = this._bufferService.buffer.ydisp,
                            n = this._createLinkUnderlineEvent(r.start.x - 1, r.start.y - i - 1, r.end.x, r.end.y - i - 1, void 0);
                        (t ? this._onShowLinkUnderline : this._onHideLinkUnderline).fire(n)
                    }, t.prototype._linkLeave = function (e, t, r) {
                        var i;
                        (null === (i = this._currentLink) || void 0 === i ? void 0 : i.state) && (this._currentLink.state.isHovered = !1, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(t, !1), this._currentLink.state.decorations.pointerCursor && e.classList.remove("xterm-cursor-pointer")), t.leave && t.leave(r, t.text)
                    }, t.prototype._linkAtPosition = function (e, t) {
                        var r = e.range.start.y === e.range.end.y, i = e.range.start.y < t.y, n = e.range.end.y > t.y;
                        return (r && e.range.start.x <= t.x && e.range.end.x >= t.x || i && e.range.end.x >= t.x || n && e.range.start.x <= t.x || i && n) && e.range.start.y <= t.y && e.range.end.y >= t.y
                    }, t.prototype._positionFromMouseEvent = function (e, t, r) {
                        var i = r.getCoords(e, t, this._bufferService.cols, this._bufferService.rows);
                        if (i) return {x: i[0], y: i[1] + this._bufferService.buffer.ydisp}
                    }, t.prototype._createLinkUnderlineEvent = function (e, t, r, i, n) {
                        return {x1: e, y1: t, x2: r, y2: i, cols: this._bufferService.cols, fg: n}
                    }, o([s(0, a.IBufferService)], t)
                }(l.Disposable);
                t.Linkifier2 = u
            }, 9042: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.tooMuchOutput = t.promptLabel = void 0, t.promptLabel = "Terminal input", t.tooMuchOutput = "Too much output to announce, navigate to rows manually to read"
            }, 6954: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.MouseZoneManager = void 0;
                var a = r(844), c = r(3656), l = r(4725), h = r(2585), u = function (e) {
                    function t(t, r, i, n, o, s) {
                        var a = e.call(this) || this;
                        return a._element = t, a._screenElement = r, a._bufferService = i, a._mouseService = n, a._selectionService = o, a._optionsService = s, a._zones = [], a._areZonesActive = !1, a._lastHoverCoords = [void 0, void 0], a._initialSelectionLength = 0, a.register(c.addDisposableDomListener(a._element, "mousedown", (function (e) {
                            return a._onMouseDown(e)
                        }))), a._mouseMoveListener = function (e) {
                            return a._onMouseMove(e)
                        }, a._mouseLeaveListener = function (e) {
                            return a._onMouseLeave(e)
                        }, a._clickListener = function (e) {
                            return a._onClick(e)
                        }, a
                    }

                    return n(t, e), t.prototype.dispose = function () {
                        e.prototype.dispose.call(this), this._deactivate()
                    }, t.prototype.add = function (e) {
                        this._zones.push(e), 1 === this._zones.length && this._activate()
                    }, t.prototype.clearAll = function (e, t) {
                        if (0 !== this._zones.length) {
                            e && t || (e = 0, t = this._bufferService.rows - 1);
                            for (var r = 0; r < this._zones.length; r++) {
                                var i = this._zones[r];
                                (i.y1 > e && i.y1 <= t + 1 || i.y2 > e && i.y2 <= t + 1 || i.y1 < e && i.y2 > t + 1) && (this._currentZone && this._currentZone === i && (this._currentZone.leaveCallback(), this._currentZone = void 0), this._zones.splice(r--, 1))
                            }
                            0 === this._zones.length && this._deactivate()
                        }
                    }, t.prototype._activate = function () {
                        this._areZonesActive || (this._areZonesActive = !0, this._element.addEventListener("mousemove", this._mouseMoveListener), this._element.addEventListener("mouseleave", this._mouseLeaveListener), this._element.addEventListener("click", this._clickListener))
                    }, t.prototype._deactivate = function () {
                        this._areZonesActive && (this._areZonesActive = !1, this._element.removeEventListener("mousemove", this._mouseMoveListener), this._element.removeEventListener("mouseleave", this._mouseLeaveListener), this._element.removeEventListener("click", this._clickListener))
                    }, t.prototype._onMouseMove = function (e) {
                        this._lastHoverCoords[0] === e.pageX && this._lastHoverCoords[1] === e.pageY || (this._onHover(e), this._lastHoverCoords = [e.pageX, e.pageY])
                    }, t.prototype._onHover = function (e) {
                        var t = this, r = this._findZoneEventAt(e);
                        r !== this._currentZone && (this._currentZone && (this._currentZone.leaveCallback(), this._currentZone = void 0, this._tooltipTimeout && clearTimeout(this._tooltipTimeout)), r && (this._currentZone = r, r.hoverCallback && r.hoverCallback(e), this._tooltipTimeout = window.setTimeout((function () {
                            return t._onTooltip(e)
                        }), this._optionsService.options.linkTooltipHoverDuration)))
                    }, t.prototype._onTooltip = function (e) {
                        this._tooltipTimeout = void 0;
                        var t = this._findZoneEventAt(e);
                        null == t || t.tooltipCallback(e)
                    }, t.prototype._onMouseDown = function (e) {
                        if (this._initialSelectionLength = this._getSelectionLength(), this._areZonesActive) {
                            var t = this._findZoneEventAt(e);
                            (null == t ? void 0 : t.willLinkActivate(e)) && (e.preventDefault(), e.stopImmediatePropagation())
                        }
                    }, t.prototype._onMouseLeave = function (e) {
                        this._currentZone && (this._currentZone.leaveCallback(), this._currentZone = void 0, this._tooltipTimeout && clearTimeout(this._tooltipTimeout))
                    }, t.prototype._onClick = function (e) {
                        var t = this._findZoneEventAt(e), r = this._getSelectionLength();
                        t && r === this._initialSelectionLength && (t.clickCallback(e), e.preventDefault(), e.stopImmediatePropagation())
                    }, t.prototype._getSelectionLength = function () {
                        var e = this._selectionService.selectionText;
                        return e ? e.length : 0
                    }, t.prototype._findZoneEventAt = function (e) {
                        var t = this._mouseService.getCoords(e, this._screenElement, this._bufferService.cols, this._bufferService.rows);
                        if (t) for (var r = t[0], i = t[1], n = 0; n < this._zones.length; n++) {
                            var o = this._zones[n];
                            if (o.y1 === o.y2) {
                                if (i === o.y1 && r >= o.x1 && r < o.x2) return o
                            } else if (i === o.y1 && r >= o.x1 || i === o.y2 && r < o.x2 || i > o.y1 && i < o.y2) return o
                        }
                    }, o([s(2, h.IBufferService), s(3, l.IMouseService), s(4, l.ISelectionService), s(5, h.IOptionsService)], t)
                }(a.Disposable);
                t.MouseZoneManager = u
            }, 6193: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.RenderDebouncer = void 0;
                var r = function () {
                    function e(e) {
                        this._renderCallback = e
                    }

                    return e.prototype.dispose = function () {
                        this._animationFrame && (window.cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0)
                    }, e.prototype.refresh = function (e, t, r) {
                        var i = this;
                        this._rowCount = r, e = void 0 !== e ? e : 0, t = void 0 !== t ? t : this._rowCount - 1, this._rowStart = void 0 !== this._rowStart ? Math.min(this._rowStart, e) : e, this._rowEnd = void 0 !== this._rowEnd ? Math.max(this._rowEnd, t) : t, this._animationFrame || (this._animationFrame = window.requestAnimationFrame((function () {
                            return i._innerRefresh()
                        })))
                    }, e.prototype._innerRefresh = function () {
                        if (void 0 !== this._rowStart && void 0 !== this._rowEnd && void 0 !== this._rowCount) {
                            var e = Math.max(this._rowStart, 0), t = Math.min(this._rowEnd, this._rowCount - 1);
                            this._rowStart = void 0, this._rowEnd = void 0, this._animationFrame = void 0, this._renderCallback(e, t)
                        }
                    }, e
                }();
                t.RenderDebouncer = r
            }, 5596: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.ScreenDprMonitor = void 0;
                var o = function (e) {
                    function t() {
                        var t = null !== e && e.apply(this, arguments) || this;
                        return t._currentDevicePixelRatio = window.devicePixelRatio, t
                    }

                    return n(t, e), t.prototype.setListener = function (e) {
                        var t = this;
                        this._listener && this.clearListener(), this._listener = e, this._outerListener = function () {
                            t._listener && (t._listener(window.devicePixelRatio, t._currentDevicePixelRatio), t._updateDpr())
                        }, this._updateDpr()
                    }, t.prototype.dispose = function () {
                        e.prototype.dispose.call(this), this.clearListener()
                    }, t.prototype._updateDpr = function () {
                        var e;
                        this._outerListener && (null === (e = this._resolutionMediaMatchList) || void 0 === e || e.removeListener(this._outerListener), this._currentDevicePixelRatio = window.devicePixelRatio, this._resolutionMediaMatchList = window.matchMedia("screen and (resolution: " + window.devicePixelRatio + "dppx)"), this._resolutionMediaMatchList.addListener(this._outerListener))
                    }, t.prototype.clearListener = function () {
                        this._resolutionMediaMatchList && this._listener && this._outerListener && (this._resolutionMediaMatchList.removeListener(this._outerListener), this._resolutionMediaMatchList = void 0, this._listener = void 0, this._outerListener = void 0)
                    }, t
                }(r(844).Disposable);
                t.ScreenDprMonitor = o
            }, 3236: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.Terminal = void 0;
                var o = r(2950), s = r(1680), a = r(3614), c = r(2584), l = r(5435), h = r(3525), u = r(3551),
                    f = r(9312), _ = r(6114), d = r(3656), p = r(9042), v = r(357), g = r(6954), y = r(4567),
                    b = r(1296), S = r(7399), m = r(8460), C = r(8437), w = r(5680), E = r(3230), L = r(4725),
                    k = r(428), A = r(8934), R = r(6465), x = r(5114), T = r(8969), O = r(4774), D = r(4269),
                    P = "undefined" != typeof window ? window.document : null, M = function (e) {
                        function t(t) {
                            void 0 === t && (t = {});
                            var r = e.call(this, t) || this;
                            return r.browser = _, r._keyDownHandled = !1, r._onCursorMove = new m.EventEmitter, r._onKey = new m.EventEmitter, r._onRender = new m.EventEmitter, r._onSelectionChange = new m.EventEmitter, r._onTitleChange = new m.EventEmitter, r._onBell = new m.EventEmitter, r._onFocus = new m.EventEmitter, r._onBlur = new m.EventEmitter, r._onA11yCharEmitter = new m.EventEmitter, r._onA11yTabEmitter = new m.EventEmitter, r._setup(), r.linkifier = r._instantiationService.createInstance(u.Linkifier), r.linkifier2 = r.register(r._instantiationService.createInstance(R.Linkifier2)), r.register(r._inputHandler.onRequestBell((function () {
                                return r.bell()
                            }))), r.register(r._inputHandler.onRequestRefreshRows((function (e, t) {
                                return r.refresh(e, t)
                            }))), r.register(r._inputHandler.onRequestReset((function () {
                                return r.reset()
                            }))), r.register(r._inputHandler.onRequestWindowsOptionsReport((function (e) {
                                return r._reportWindowsOptions(e)
                            }))), r.register(r._inputHandler.onAnsiColorChange((function (e) {
                                return r._changeAnsiColor(e)
                            }))), r.register(m.forwardEvent(r._inputHandler.onCursorMove, r._onCursorMove)), r.register(m.forwardEvent(r._inputHandler.onTitleChange, r._onTitleChange)), r.register(m.forwardEvent(r._inputHandler.onA11yChar, r._onA11yCharEmitter)), r.register(m.forwardEvent(r._inputHandler.onA11yTab, r._onA11yTabEmitter)), r.register(r._bufferService.onResize((function (e) {
                                return r._afterResize(e.cols, e.rows)
                            }))), r
                        }

                        return n(t, e), Object.defineProperty(t.prototype, "options", {
                            get: function () {
                                return this.optionsService.options
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onCursorMove", {
                            get: function () {
                                return this._onCursorMove.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onKey", {
                            get: function () {
                                return this._onKey.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onRender", {
                            get: function () {
                                return this._onRender.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onSelectionChange", {
                            get: function () {
                                return this._onSelectionChange.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onTitleChange", {
                            get: function () {
                                return this._onTitleChange.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onBell", {
                            get: function () {
                                return this._onBell.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onFocus", {
                            get: function () {
                                return this._onFocus.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onBlur", {
                            get: function () {
                                return this._onBlur.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onA11yChar", {
                            get: function () {
                                return this._onA11yCharEmitter.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onA11yTab", {
                            get: function () {
                                return this._onA11yTabEmitter.event
                            }, enumerable: !1, configurable: !0
                        }), t.prototype._changeAnsiColor = function (e) {
                            var t, r;
                            if (this._colorManager) {
                                for (var i = 0, n = e.colors; i < n.length; i++) {
                                    var o = n[i], s = O.rgba.toColor(o.red, o.green, o.blue);
                                    this._colorManager.colors.ansi[o.colorIndex] = s
                                }
                                null === (t = this._renderService) || void 0 === t || t.setColors(this._colorManager.colors), null === (r = this.viewport) || void 0 === r || r.onThemeChange(this._colorManager.colors)
                            }
                        }, t.prototype.dispose = function () {
                            var t, r, i;
                            this._isDisposed || (e.prototype.dispose.call(this), null === (t = this._renderService) || void 0 === t || t.dispose(), this._customKeyEventHandler = void 0, this.write = function () {
                            }, null === (i = null === (r = this.element) || void 0 === r ? void 0 : r.parentNode) || void 0 === i || i.removeChild(this.element))
                        }, t.prototype._setup = function () {
                            e.prototype._setup.call(this), this._customKeyEventHandler = void 0
                        }, Object.defineProperty(t.prototype, "buffer", {
                            get: function () {
                                return this.buffers.active
                            }, enumerable: !1, configurable: !0
                        }), t.prototype.focus = function () {
                            this.textarea && this.textarea.focus({preventScroll: !0})
                        }, t.prototype._updateOptions = function (t) {
                            var r, i, n, o;
                            switch (e.prototype._updateOptions.call(this, t), t) {
                                case"fontFamily":
                                case"fontSize":
                                    null === (r = this._renderService) || void 0 === r || r.clear(), null === (i = this._charSizeService) || void 0 === i || i.measure();
                                    break;
                                case"cursorBlink":
                                case"cursorStyle":
                                    this.refresh(this.buffer.y, this.buffer.y);
                                    break;
                                case"drawBoldTextInBrightColors":
                                case"letterSpacing":
                                case"lineHeight":
                                case"fontWeight":
                                case"fontWeightBold":
                                case"minimumContrastRatio":
                                    this._renderService && (this._renderService.clear(), this._renderService.onResize(this.cols, this.rows), this.refresh(0, this.rows - 1));
                                    break;
                                case"rendererType":
                                    this._renderService && (this._renderService.setRenderer(this._createRenderer()), this._renderService.onResize(this.cols, this.rows));
                                    break;
                                case"scrollback":
                                    null === (n = this.viewport) || void 0 === n || n.syncScrollArea();
                                    break;
                                case"screenReaderMode":
                                    this.optionsService.options.screenReaderMode ? !this._accessibilityManager && this._renderService && (this._accessibilityManager = new y.AccessibilityManager(this, this._renderService)) : (null === (o = this._accessibilityManager) || void 0 === o || o.dispose(), this._accessibilityManager = void 0);
                                    break;
                                case"tabStopWidth":
                                    this.buffers.setupTabStops();
                                    break;
                                case"theme":
                                    this._setTheme(this.optionsService.options.theme)
                            }
                        }, t.prototype._onTextAreaFocus = function (e) {
                            this._coreService.decPrivateModes.sendFocus && this._coreService.triggerDataEvent(c.C0.ESC + "[I"), this.updateCursorStyle(e), this.element.classList.add("focus"), this._showCursor(), this._onFocus.fire()
                        }, t.prototype.blur = function () {
                            var e;
                            return null === (e = this.textarea) || void 0 === e ? void 0 : e.blur()
                        }, t.prototype._onTextAreaBlur = function () {
                            this.textarea.value = "", this.refresh(this.buffer.y, this.buffer.y), this._coreService.decPrivateModes.sendFocus && this._coreService.triggerDataEvent(c.C0.ESC + "[O"), this.element.classList.remove("focus"), this._onBlur.fire()
                        }, t.prototype._syncTextArea = function () {
                            if (this.textarea && this.buffer.isCursorInViewport && !this._compositionHelper.isComposing && this._renderService) {
                                var e = this.buffer.ybase + this.buffer.y, t = this.buffer.lines.get(e);
                                if (t) {
                                    var r = Math.min(this.buffer.x, this.cols - 1),
                                        i = this._renderService.dimensions.actualCellHeight, n = t.getWidth(r),
                                        o = this._renderService.dimensions.actualCellWidth * n,
                                        s = this.buffer.y * this._renderService.dimensions.actualCellHeight,
                                        a = r * this._renderService.dimensions.actualCellWidth;
                                    this.textarea.style.left = a + "px", this.textarea.style.top = s + "px", this.textarea.style.width = o + "px", this.textarea.style.height = i + "px", this.textarea.style.lineHeight = i + "px", this.textarea.style.zIndex = "-5"
                                }
                            }
                        }, t.prototype._initGlobal = function () {
                            var e = this;
                            this._bindKeys(), this.register(d.addDisposableDomListener(this.element, "copy", (function (t) {
                                e.hasSelection() && a.copyHandler(t, e._selectionService)
                            })));
                            var t = function (t) {
                                return a.handlePasteEvent(t, e.textarea, e._coreService)
                            };
                            this.register(d.addDisposableDomListener(this.textarea, "paste", t)), this.register(d.addDisposableDomListener(this.element, "paste", t)), _.isFirefox ? this.register(d.addDisposableDomListener(this.element, "mousedown", (function (t) {
                                2 === t.button && a.rightClickHandler(t, e.textarea, e.screenElement, e._selectionService, e.options.rightClickSelectsWord)
                            }))) : this.register(d.addDisposableDomListener(this.element, "contextmenu", (function (t) {
                                a.rightClickHandler(t, e.textarea, e.screenElement, e._selectionService, e.options.rightClickSelectsWord)
                            }))), _.isLinux && this.register(d.addDisposableDomListener(this.element, "auxclick", (function (t) {
                                1 === t.button && a.moveTextAreaUnderMouseCursor(t, e.textarea, e.screenElement)
                            })))
                        }, t.prototype._bindKeys = function () {
                            var e = this;
                            this.register(d.addDisposableDomListener(this.textarea, "keyup", (function (t) {
                                return e._keyUp(t)
                            }), !0)), this.register(d.addDisposableDomListener(this.textarea, "keydown", (function (t) {
                                return e._keyDown(t)
                            }), !0)), this.register(d.addDisposableDomListener(this.textarea, "keypress", (function (t) {
                                return e._keyPress(t)
                            }), !0)), this.register(d.addDisposableDomListener(this.textarea, "compositionstart", (function () {
                                return e._compositionHelper.compositionstart()
                            }))), this.register(d.addDisposableDomListener(this.textarea, "compositionupdate", (function (t) {
                                return e._compositionHelper.compositionupdate(t)
                            }))), this.register(d.addDisposableDomListener(this.textarea, "compositionend", (function () {
                                return e._compositionHelper.compositionend()
                            }))), this.register(this.onRender((function () {
                                return e._compositionHelper.updateCompositionElements()
                            }))), this.register(this.onRender((function (t) {
                                return e._queueLinkification(t.start, t.end)
                            })))
                        }, t.prototype.open = function (e) {
                            var t = this;
                            if (!e) throw new Error("Terminal requires a parent element.");
                            e.isConnected || this._logService.debug("Terminal.open was called on an element that was not attached to the DOM"), this._document = e.ownerDocument, this.element = this._document.createElement("div"), this.element.dir = "ltr", this.element.classList.add("terminal"), this.element.classList.add("xterm"), this.element.setAttribute("tabindex", "0"), this.element.setAttribute("role", "document"), e.appendChild(this.element);
                            var r = P.createDocumentFragment();
                            this._viewportElement = P.createElement("div"), this._viewportElement.classList.add("xterm-viewport"), r.appendChild(this._viewportElement), this._viewportScrollArea = P.createElement("div"), this._viewportScrollArea.classList.add("xterm-scroll-area"), this._viewportElement.appendChild(this._viewportScrollArea), this.screenElement = P.createElement("div"), this.screenElement.classList.add("xterm-screen"), this._helperContainer = P.createElement("div"), this._helperContainer.classList.add("xterm-helpers"), this.screenElement.appendChild(this._helperContainer), r.appendChild(this.screenElement), this.textarea = P.createElement("textarea"), this.textarea.classList.add("xterm-helper-textarea"), this.textarea.setAttribute("aria-label", p.promptLabel), this.textarea.setAttribute("aria-multiline", "false"), this.textarea.setAttribute("autocorrect", "off"), this.textarea.setAttribute("autocapitalize", "off"), this.textarea.setAttribute("spellcheck", "false"), this.textarea.tabIndex = 0, this.register(d.addDisposableDomListener(this.textarea, "focus", (function (e) {
                                return t._onTextAreaFocus(e)
                            }))), this.register(d.addDisposableDomListener(this.textarea, "blur", (function () {
                                return t._onTextAreaBlur()
                            }))), this._helperContainer.appendChild(this.textarea);
                            var i = this._instantiationService.createInstance(x.CoreBrowserService, this.textarea);
                            this._instantiationService.setService(L.ICoreBrowserService, i), this._charSizeService = this._instantiationService.createInstance(k.CharSizeService, this._document, this._helperContainer), this._instantiationService.setService(L.ICharSizeService, this._charSizeService), this._theme = this.options.theme || this._theme, this._colorManager = new w.ColorManager(P, this.options.allowTransparency), this.register(this.optionsService.onOptionChange((function (e) {
                                return t._colorManager.onOptionsChange(e)
                            }))), this._colorManager.setTheme(this._theme), this._characterJoinerService = this._instantiationService.createInstance(D.CharacterJoinerService), this._instantiationService.setService(L.ICharacterJoinerService, this._characterJoinerService);
                            var n = this._createRenderer();
                            this._renderService = this.register(this._instantiationService.createInstance(E.RenderService, n, this.rows, this.screenElement)), this._instantiationService.setService(L.IRenderService, this._renderService), this.register(this._renderService.onRenderedBufferChange((function (e) {
                                return t._onRender.fire(e)
                            }))), this.onResize((function (e) {
                                return t._renderService.resize(e.cols, e.rows)
                            })), this._compositionView = P.createElement("div"), this._compositionView.classList.add("composition-view"), this._compositionHelper = this._instantiationService.createInstance(o.CompositionHelper, this.textarea, this._compositionView), this._helperContainer.appendChild(this._compositionView), this.element.appendChild(r), this._soundService = this._instantiationService.createInstance(v.SoundService), this._instantiationService.setService(L.ISoundService, this._soundService), this._mouseService = this._instantiationService.createInstance(A.MouseService), this._instantiationService.setService(L.IMouseService, this._mouseService), this.viewport = this._instantiationService.createInstance(s.Viewport, (function (e) {
                                return t.scrollLines(e, !0, 1)
                            }), this._viewportElement, this._viewportScrollArea), this.viewport.onThemeChange(this._colorManager.colors), this.register(this._inputHandler.onRequestSyncScrollBar((function () {
                                return t.viewport.syncScrollArea()
                            }))), this.register(this.viewport), this.register(this.onCursorMove((function () {
                                t._renderService.onCursorMove(), t._syncTextArea()
                            }))), this.register(this.onResize((function () {
                                return t._renderService.onResize(t.cols, t.rows)
                            }))), this.register(this.onBlur((function () {
                                return t._renderService.onBlur()
                            }))), this.register(this.onFocus((function () {
                                return t._renderService.onFocus()
                            }))), this.register(this._renderService.onDimensionsChange((function () {
                                return t.viewport.syncScrollArea()
                            }))), this._selectionService = this.register(this._instantiationService.createInstance(f.SelectionService, this.element, this.screenElement, this.linkifier2)), this._instantiationService.setService(L.ISelectionService, this._selectionService), this.register(this._selectionService.onRequestScrollLines((function (e) {
                                return t.scrollLines(e.amount, e.suppressScrollEvent)
                            }))), this.register(this._selectionService.onSelectionChange((function () {
                                return t._onSelectionChange.fire()
                            }))), this.register(this._selectionService.onRequestRedraw((function (e) {
                                return t._renderService.onSelectionChanged(e.start, e.end, e.columnSelectMode)
                            }))), this.register(this._selectionService.onLinuxMouseSelection((function (e) {
                                t.textarea.value = e, t.textarea.focus(), t.textarea.select()
                            }))), this.register(this._onScroll.event((function (e) {
                                t.viewport.syncScrollArea(), t._selectionService.refresh()
                            }))), this.register(d.addDisposableDomListener(this._viewportElement, "scroll", (function () {
                                return t._selectionService.refresh()
                            }))), this._mouseZoneManager = this._instantiationService.createInstance(g.MouseZoneManager, this.element, this.screenElement), this.register(this._mouseZoneManager), this.register(this.onScroll((function () {
                                return t._mouseZoneManager.clearAll()
                            }))), this.linkifier.attachToDom(this.element, this._mouseZoneManager), this.linkifier2.attachToDom(this.element, this._mouseService, this._renderService), this.register(d.addDisposableDomListener(this.element, "mousedown", (function (e) {
                                return t._selectionService.onMouseDown(e)
                            }))), this._coreMouseService.areMouseEventsActive ? (this._selectionService.disable(), this.element.classList.add("enable-mouse-events")) : this._selectionService.enable(), this.options.screenReaderMode && (this._accessibilityManager = new y.AccessibilityManager(this, this._renderService)), this._charSizeService.measure(), this.refresh(0, this.rows - 1), this._initGlobal(), this.bindMouse()
                        }, t.prototype._createRenderer = function () {
                            switch (this.options.rendererType) {
                                case"canvas":
                                    return this._instantiationService.createInstance(h.Renderer, this._colorManager.colors, this.screenElement, this.linkifier, this.linkifier2);
                                case"dom":
                                    return this._instantiationService.createInstance(b.DomRenderer, this._colorManager.colors, this.element, this.screenElement, this._viewportElement, this.linkifier, this.linkifier2);
                                default:
                                    throw new Error('Unrecognized rendererType "' + this.options.rendererType + '"')
                            }
                        }, t.prototype._setTheme = function (e) {
                            var t, r, i;
                            this._theme = e, null === (t = this._colorManager) || void 0 === t || t.setTheme(e), null === (r = this._renderService) || void 0 === r || r.setColors(this._colorManager.colors), null === (i = this.viewport) || void 0 === i || i.onThemeChange(this._colorManager.colors)
                        }, t.prototype.bindMouse = function () {
                            var e = this, t = this, r = this.element;

                            function i(e) {
                                var r, i, n = t._mouseService.getRawByteCoords(e, t.screenElement, t.cols, t.rows);
                                if (!n) return !1;
                                switch (e.overrideType || e.type) {
                                    case"mousemove":
                                        i = 32, void 0 === e.buttons ? (r = 3, void 0 !== e.button && (r = e.button < 3 ? e.button : 3)) : r = 1 & e.buttons ? 0 : 4 & e.buttons ? 1 : 2 & e.buttons ? 2 : 3;
                                        break;
                                    case"mouseup":
                                        i = 0, r = e.button < 3 ? e.button : 3;
                                        break;
                                    case"mousedown":
                                        i = 1, r = e.button < 3 ? e.button : 3;
                                        break;
                                    case"wheel":
                                        0 !== e.deltaY && (i = e.deltaY < 0 ? 0 : 1), r = 4;
                                        break;
                                    default:
                                        return !1
                                }
                                return !(void 0 === i || void 0 === r || r > 4) && t._coreMouseService.triggerMouseEvent({
                                    col: n.x - 33,
                                    row: n.y - 33,
                                    button: r,
                                    action: i,
                                    ctrl: e.ctrlKey,
                                    alt: e.altKey,
                                    shift: e.shiftKey
                                })
                            }

                            var n = {mouseup: null, wheel: null, mousedrag: null, mousemove: null}, o = function (t) {
                                return i(t), t.buttons || (e._document.removeEventListener("mouseup", n.mouseup), n.mousedrag && e._document.removeEventListener("mousemove", n.mousedrag)), e.cancel(t)
                            }, s = function (t) {
                                return i(t), t.preventDefault(), e.cancel(t)
                            }, a = function (e) {
                                e.buttons && i(e)
                            }, l = function (e) {
                                e.buttons || i(e)
                            };
                            this.register(this._coreMouseService.onProtocolChange((function (t) {
                                t ? ("debug" === e.optionsService.options.logLevel && e._logService.debug("Binding to mouse events:", e._coreMouseService.explainEvents(t)), e.element.classList.add("enable-mouse-events"), e._selectionService.disable()) : (e._logService.debug("Unbinding from mouse events."), e.element.classList.remove("enable-mouse-events"), e._selectionService.enable()), 8 & t ? n.mousemove || (r.addEventListener("mousemove", l), n.mousemove = l) : (r.removeEventListener("mousemove", n.mousemove), n.mousemove = null), 16 & t ? n.wheel || (r.addEventListener("wheel", s, {passive: !1}), n.wheel = s) : (r.removeEventListener("wheel", n.wheel), n.wheel = null), 2 & t ? n.mouseup || (n.mouseup = o) : (e._document.removeEventListener("mouseup", n.mouseup), n.mouseup = null), 4 & t ? n.mousedrag || (n.mousedrag = a) : (e._document.removeEventListener("mousemove", n.mousedrag), n.mousedrag = null)
                            }))), this._coreMouseService.activeProtocol = this._coreMouseService.activeProtocol, this.register(d.addDisposableDomListener(r, "mousedown", (function (t) {
                                if (t.preventDefault(), e.focus(), e._coreMouseService.areMouseEventsActive && !e._selectionService.shouldForceSelection(t)) return i(t), n.mouseup && e._document.addEventListener("mouseup", n.mouseup), n.mousedrag && e._document.addEventListener("mousemove", n.mousedrag), e.cancel(t)
                            }))), this.register(d.addDisposableDomListener(r, "wheel", (function (t) {
                                if (n.wheel) ; else if (!e.buffer.hasScrollback) {
                                    var r = e.viewport.getLinesScrolled(t);
                                    if (0 === r) return;
                                    for (var i = c.C0.ESC + (e._coreService.decPrivateModes.applicationCursorKeys ? "O" : "[") + (t.deltaY < 0 ? "A" : "B"), o = "", s = 0; s < Math.abs(r); s++) o += i;
                                    e._coreService.triggerDataEvent(o, !0)
                                }
                            }), {passive: !0})), this.register(d.addDisposableDomListener(r, "wheel", (function (t) {
                                if (!n.wheel) return e.viewport.onWheel(t) ? void 0 : e.cancel(t)
                            }), {passive: !1})), this.register(d.addDisposableDomListener(r, "touchstart", (function (t) {
                                if (!e._coreMouseService.areMouseEventsActive) return e.viewport.onTouchStart(t), e.cancel(t)
                            }), {passive: !0})), this.register(d.addDisposableDomListener(r, "touchmove", (function (t) {
                                if (!e._coreMouseService.areMouseEventsActive) return e.viewport.onTouchMove(t) ? void 0 : e.cancel(t)
                            }), {passive: !1}))
                        }, t.prototype.refresh = function (e, t) {
                            var r;
                            null === (r = this._renderService) || void 0 === r || r.refreshRows(e, t)
                        }, t.prototype._queueLinkification = function (e, t) {
                            var r;
                            null === (r = this.linkifier) || void 0 === r || r.linkifyRows(e, t)
                        }, t.prototype.updateCursorStyle = function (e) {
                            var t;
                            (null === (t = this._selectionService) || void 0 === t ? void 0 : t.shouldColumnSelect(e)) ? this.element.classList.add("column-select") : this.element.classList.remove("column-select")
                        }, t.prototype._showCursor = function () {
                            this._coreService.isCursorInitialized || (this._coreService.isCursorInitialized = !0, this.refresh(this.buffer.y, this.buffer.y))
                        }, t.prototype.scrollLines = function (t, r, i) {
                            void 0 === i && (i = 0), e.prototype.scrollLines.call(this, t, r, i), this.refresh(0, this.rows - 1)
                        }, t.prototype.paste = function (e) {
                            a.paste(e, this.textarea, this._coreService)
                        }, t.prototype.attachCustomKeyEventHandler = function (e) {
                            this._customKeyEventHandler = e
                        }, t.prototype.registerLinkMatcher = function (e, t, r) {
                            var i = this.linkifier.registerLinkMatcher(e, t, r);
                            return this.refresh(0, this.rows - 1), i
                        }, t.prototype.deregisterLinkMatcher = function (e) {
                            this.linkifier.deregisterLinkMatcher(e) && this.refresh(0, this.rows - 1)
                        }, t.prototype.registerLinkProvider = function (e) {
                            return this.linkifier2.registerLinkProvider(e)
                        }, t.prototype.registerCharacterJoiner = function (e) {
                            if (!this._characterJoinerService) throw new Error("Terminal must be opened first");
                            var t = this._characterJoinerService.register(e);
                            return this.refresh(0, this.rows - 1), t
                        }, t.prototype.deregisterCharacterJoiner = function (e) {
                            if (!this._characterJoinerService) throw new Error("Terminal must be opened first");
                            this._characterJoinerService.deregister(e) && this.refresh(0, this.rows - 1)
                        }, Object.defineProperty(t.prototype, "markers", {
                            get: function () {
                                return this.buffer.markers
                            }, enumerable: !1, configurable: !0
                        }), t.prototype.addMarker = function (e) {
                            if (this.buffer === this.buffers.normal) return this.buffer.addMarker(this.buffer.ybase + this.buffer.y + e)
                        }, t.prototype.hasSelection = function () {
                            return !!this._selectionService && this._selectionService.hasSelection
                        }, t.prototype.select = function (e, t, r) {
                            this._selectionService.setSelection(e, t, r)
                        }, t.prototype.getSelection = function () {
                            return this._selectionService ? this._selectionService.selectionText : ""
                        }, t.prototype.getSelectionPosition = function () {
                            if (this._selectionService && this._selectionService.hasSelection) return {
                                startColumn: this._selectionService.selectionStart[0],
                                startRow: this._selectionService.selectionStart[1],
                                endColumn: this._selectionService.selectionEnd[0],
                                endRow: this._selectionService.selectionEnd[1]
                            }
                        }, t.prototype.clearSelection = function () {
                            var e;
                            null === (e = this._selectionService) || void 0 === e || e.clearSelection()
                        }, t.prototype.selectAll = function () {
                            var e;
                            null === (e = this._selectionService) || void 0 === e || e.selectAll()
                        }, t.prototype.selectLines = function (e, t) {
                            var r;
                            null === (r = this._selectionService) || void 0 === r || r.selectLines(e, t)
                        }, t.prototype._keyDown = function (e) {
                            if (this._keyDownHandled = !1, this._customKeyEventHandler && !1 === this._customKeyEventHandler(e)) return !1;
                            if (!this._compositionHelper.keydown(e)) return this.buffer.ybase !== this.buffer.ydisp && this._bufferService.scrollToBottom(), !1;
                            var t = S.evaluateKeyboardEvent(e, this._coreService.decPrivateModes.applicationCursorKeys, this.browser.isMac, this.options.macOptionIsMeta);
                            if (this.updateCursorStyle(e), 3 === t.type || 2 === t.type) {
                                var r = this.rows - 1;
                                return this.scrollLines(2 === t.type ? -r : r), this.cancel(e, !0)
                            }
                            return 1 === t.type && this.selectAll(), !!this._isThirdLevelShift(this.browser, e) || (t.cancel && this.cancel(e, !0), !t.key || (t.key !== c.C0.ETX && t.key !== c.C0.CR || (this.textarea.value = ""), this._onKey.fire({
                                key: t.key,
                                domEvent: e
                            }), this._showCursor(), this._coreService.triggerDataEvent(t.key, !0), this.optionsService.options.screenReaderMode ? void (this._keyDownHandled = !0) : this.cancel(e, !0)))
                        }, t.prototype._isThirdLevelShift = function (e, t) {
                            var r = e.isMac && !this.options.macOptionIsMeta && t.altKey && !t.ctrlKey && !t.metaKey || e.isWindows && t.altKey && t.ctrlKey && !t.metaKey;
                            return "keypress" === t.type ? r : r && (!t.keyCode || t.keyCode > 47)
                        }, t.prototype._keyUp = function (e) {
                            this._customKeyEventHandler && !1 === this._customKeyEventHandler(e) || (function (e) {
                                return 16 === e.keyCode || 17 === e.keyCode || 18 === e.keyCode
                            }(e) || this.focus(), this.updateCursorStyle(e))
                        }, t.prototype._keyPress = function (e) {
                            var t;
                            if (this._keyDownHandled) return !1;
                            if (this._customKeyEventHandler && !1 === this._customKeyEventHandler(e)) return !1;
                            if (this.cancel(e), e.charCode) t = e.charCode; else if (null === e.which || void 0 === e.which) t = e.keyCode; else {
                                if (0 === e.which || 0 === e.charCode) return !1;
                                t = e.which
                            }
                            return !(!t || (e.altKey || e.ctrlKey || e.metaKey) && !this._isThirdLevelShift(this.browser, e) || (t = String.fromCharCode(t), this._onKey.fire({
                                key: t,
                                domEvent: e
                            }), this._showCursor(), this._coreService.triggerDataEvent(t, !0), 0))
                        }, t.prototype.bell = function () {
                            var e;
                            this._soundBell() && (null === (e = this._soundService) || void 0 === e || e.playBellSound()), this._onBell.fire()
                        }, t.prototype.resize = function (t, r) {
                            t !== this.cols || r !== this.rows ? e.prototype.resize.call(this, t, r) : this._charSizeService && !this._charSizeService.hasValidSize && this._charSizeService.measure()
                        }, t.prototype._afterResize = function (e, t) {
                            var r, i;
                            null === (r = this._charSizeService) || void 0 === r || r.measure(), null === (i = this.viewport) || void 0 === i || i.syncScrollArea(!0)
                        }, t.prototype.clear = function () {
                            if (0 !== this.buffer.ybase || 0 !== this.buffer.y) {
                                this.buffer.lines.set(0, this.buffer.lines.get(this.buffer.ybase + this.buffer.y)), this.buffer.lines.length = 1, this.buffer.ydisp = 0, this.buffer.ybase = 0, this.buffer.y = 0;
                                for (var e = 1; e < this.rows; e++) this.buffer.lines.push(this.buffer.getBlankLine(C.DEFAULT_ATTR_DATA));
                                this.refresh(0, this.rows - 1), this._onScroll.fire({
                                    position: this.buffer.ydisp,
                                    source: 0
                                })
                            }
                        }, t.prototype.reset = function () {
                            var t, r;
                            this.options.rows = this.rows, this.options.cols = this.cols;
                            var i = this._customKeyEventHandler;
                            this._setup(), e.prototype.reset.call(this), null === (t = this._selectionService) || void 0 === t || t.reset(), this._customKeyEventHandler = i, this.refresh(0, this.rows - 1), null === (r = this.viewport) || void 0 === r || r.syncScrollArea()
                        }, t.prototype._reportWindowsOptions = function (e) {
                            if (this._renderService) switch (e) {
                                case l.WindowsOptionsReportType.GET_WIN_SIZE_PIXELS:
                                    var t = this._renderService.dimensions.scaledCanvasWidth.toFixed(0),
                                        r = this._renderService.dimensions.scaledCanvasHeight.toFixed(0);
                                    this._coreService.triggerDataEvent(c.C0.ESC + "[4;" + r + ";" + t + "t");
                                    break;
                                case l.WindowsOptionsReportType.GET_CELL_SIZE_PIXELS:
                                    var i = this._renderService.dimensions.scaledCellWidth.toFixed(0),
                                        n = this._renderService.dimensions.scaledCellHeight.toFixed(0);
                                    this._coreService.triggerDataEvent(c.C0.ESC + "[6;" + n + ";" + i + "t")
                            }
                        }, t.prototype.cancel = function (e, t) {
                            if (this.options.cancelEvents || t) return e.preventDefault(), e.stopPropagation(), !1
                        }, t.prototype._visualBell = function () {
                            return !1
                        }, t.prototype._soundBell = function () {
                            return "sound" === this.options.bellStyle
                        }, t
                    }(T.CoreTerminal);
                t.Terminal = M
            }, 1680: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.Viewport = void 0;
                var a = r(844), c = r(3656), l = r(4725), h = r(2585), u = function (e) {
                    function t(t, r, i, n, o, s, a) {
                        var l = e.call(this) || this;
                        return l._scrollLines = t, l._viewportElement = r, l._scrollArea = i, l._bufferService = n, l._optionsService = o, l._charSizeService = s, l._renderService = a, l.scrollBarWidth = 0, l._currentRowHeight = 0, l._lastRecordedBufferLength = 0, l._lastRecordedViewportHeight = 0, l._lastRecordedBufferHeight = 0, l._lastTouchY = 0, l._lastScrollTop = 0, l._wheelPartialScroll = 0, l._refreshAnimationFrame = null, l._ignoreNextScrollEvent = !1, l.scrollBarWidth = l._viewportElement.offsetWidth - l._scrollArea.offsetWidth || 15, l.register(c.addDisposableDomListener(l._viewportElement, "scroll", l._onScroll.bind(l))), setTimeout((function () {
                            return l.syncScrollArea()
                        }), 0), l
                    }

                    return n(t, e), t.prototype.onThemeChange = function (e) {
                        this._viewportElement.style.backgroundColor = e.background.css
                    }, t.prototype._refresh = function (e) {
                        var t = this;
                        if (e) return this._innerRefresh(), void (null !== this._refreshAnimationFrame && cancelAnimationFrame(this._refreshAnimationFrame));
                        null === this._refreshAnimationFrame && (this._refreshAnimationFrame = requestAnimationFrame((function () {
                            return t._innerRefresh()
                        })))
                    }, t.prototype._innerRefresh = function () {
                        if (this._charSizeService.height > 0) {
                            this._currentRowHeight = this._renderService.dimensions.scaledCellHeight / window.devicePixelRatio, this._lastRecordedViewportHeight = this._viewportElement.offsetHeight;
                            var e = Math.round(this._currentRowHeight * this._lastRecordedBufferLength) + (this._lastRecordedViewportHeight - this._renderService.dimensions.canvasHeight);
                            this._lastRecordedBufferHeight !== e && (this._lastRecordedBufferHeight = e, this._scrollArea.style.height = this._lastRecordedBufferHeight + "px")
                        }
                        var t = this._bufferService.buffer.ydisp * this._currentRowHeight;
                        this._viewportElement.scrollTop !== t && (this._ignoreNextScrollEvent = !0, this._viewportElement.scrollTop = t), this._refreshAnimationFrame = null
                    }, t.prototype.syncScrollArea = function (e) {
                        if (void 0 === e && (e = !1), this._lastRecordedBufferLength !== this._bufferService.buffer.lines.length) return this._lastRecordedBufferLength = this._bufferService.buffer.lines.length, void this._refresh(e);
                        if (this._lastRecordedViewportHeight === this._renderService.dimensions.canvasHeight) {
                            var t = this._bufferService.buffer.ydisp * this._currentRowHeight;
                            this._lastScrollTop === t && this._lastScrollTop === this._viewportElement.scrollTop && this._renderService.dimensions.scaledCellHeight / window.devicePixelRatio === this._currentRowHeight || this._refresh(e)
                        } else this._refresh(e)
                    }, t.prototype._onScroll = function (e) {
                        if (this._lastScrollTop = this._viewportElement.scrollTop, this._viewportElement.offsetParent) {
                            if (this._ignoreNextScrollEvent) return this._ignoreNextScrollEvent = !1, void this._scrollLines(0);
                            var t = Math.round(this._lastScrollTop / this._currentRowHeight) - this._bufferService.buffer.ydisp;
                            this._scrollLines(t)
                        }
                    }, t.prototype._bubbleScroll = function (e, t) {
                        var r = this._viewportElement.scrollTop + this._lastRecordedViewportHeight;
                        return !(t < 0 && 0 !== this._viewportElement.scrollTop || t > 0 && r < this._lastRecordedBufferHeight) || (e.cancelable && e.preventDefault(), !1)
                    }, t.prototype.onWheel = function (e) {
                        var t = this._getPixelsScrolled(e);
                        return 0 !== t && (this._viewportElement.scrollTop += t, this._bubbleScroll(e, t))
                    }, t.prototype._getPixelsScrolled = function (e) {
                        if (0 === e.deltaY) return 0;
                        var t = this._applyScrollModifier(e.deltaY, e);
                        return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? t *= this._currentRowHeight : e.deltaMode === WheelEvent.DOM_DELTA_PAGE && (t *= this._currentRowHeight * this._bufferService.rows), t
                    }, t.prototype.getLinesScrolled = function (e) {
                        if (0 === e.deltaY) return 0;
                        var t = this._applyScrollModifier(e.deltaY, e);
                        return e.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? (t /= this._currentRowHeight + 0, this._wheelPartialScroll += t, t = Math.floor(Math.abs(this._wheelPartialScroll)) * (this._wheelPartialScroll > 0 ? 1 : -1), this._wheelPartialScroll %= 1) : e.deltaMode === WheelEvent.DOM_DELTA_PAGE && (t *= this._bufferService.rows), t
                    }, t.prototype._applyScrollModifier = function (e, t) {
                        var r = this._optionsService.options.fastScrollModifier;
                        return "alt" === r && t.altKey || "ctrl" === r && t.ctrlKey || "shift" === r && t.shiftKey ? e * this._optionsService.options.fastScrollSensitivity * this._optionsService.options.scrollSensitivity : e * this._optionsService.options.scrollSensitivity
                    }, t.prototype.onTouchStart = function (e) {
                        this._lastTouchY = e.touches[0].pageY
                    }, t.prototype.onTouchMove = function (e) {
                        var t = this._lastTouchY - e.touches[0].pageY;
                        return this._lastTouchY = e.touches[0].pageY, 0 !== t && (this._viewportElement.scrollTop += t, this._bubbleScroll(e, t))
                    }, o([s(3, h.IBufferService), s(4, h.IOptionsService), s(5, l.ICharSizeService), s(6, l.IRenderService)], t)
                }(a.Disposable);
                t.Viewport = u
            }, 2950: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.CompositionHelper = void 0;
                var o = r(4725), s = r(2585), a = function () {
                    function e(e, t, r, i, n, o) {
                        this._textarea = e, this._compositionView = t, this._bufferService = r, this._optionsService = i, this._coreService = n, this._renderService = o, this._isComposing = !1, this._isSendingComposition = !1, this._compositionPosition = {
                            start: 0,
                            end: 0
                        }, this._dataAlreadySent = ""
                    }

                    return Object.defineProperty(e.prototype, "isComposing", {
                        get: function () {
                            return this._isComposing
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.compositionstart = function () {
                        this._isComposing = !0, this._compositionPosition.start = this._textarea.value.length, this._compositionView.textContent = "", this._dataAlreadySent = "", this._compositionView.classList.add("active")
                    }, e.prototype.compositionupdate = function (e) {
                        var t = this;
                        this._compositionView.textContent = e.data, this.updateCompositionElements(), setTimeout((function () {
                            t._compositionPosition.end = t._textarea.value.length
                        }), 0)
                    }, e.prototype.compositionend = function () {
                        this._finalizeComposition(!0)
                    }, e.prototype.keydown = function (e) {
                        if (this._isComposing || this._isSendingComposition) {
                            if (229 === e.keyCode) return !1;
                            if (16 === e.keyCode || 17 === e.keyCode || 18 === e.keyCode) return !1;
                            this._finalizeComposition(!1)
                        }
                        return 229 !== e.keyCode || (this._handleAnyTextareaChanges(), !1)
                    }, e.prototype._finalizeComposition = function (e) {
                        var t = this;
                        if (this._compositionView.classList.remove("active"), this._isComposing = !1, e) {
                            var r = {start: this._compositionPosition.start, end: this._compositionPosition.end};
                            this._isSendingComposition = !0, setTimeout((function () {
                                if (t._isSendingComposition) {
                                    t._isSendingComposition = !1;
                                    var e;
                                    r.start += t._dataAlreadySent.length, (e = t._isComposing ? t._textarea.value.substring(r.start, r.end) : t._textarea.value.substring(r.start)).length > 0 && t._coreService.triggerDataEvent(e, !0)
                                }
                            }), 0)
                        } else {
                            this._isSendingComposition = !1;
                            var i = this._textarea.value.substring(this._compositionPosition.start, this._compositionPosition.end);
                            this._coreService.triggerDataEvent(i, !0)
                        }
                    }, e.prototype._handleAnyTextareaChanges = function () {
                        var e = this, t = this._textarea.value;
                        setTimeout((function () {
                            if (!e._isComposing) {
                                var r = e._textarea.value.replace(t, "");
                                r.length > 0 && (e._dataAlreadySent = r, e._coreService.triggerDataEvent(r, !0))
                            }
                        }), 0)
                    }, e.prototype.updateCompositionElements = function (e) {
                        var t = this;
                        if (this._isComposing) {
                            if (this._bufferService.buffer.isCursorInViewport) {
                                var r = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1),
                                    i = this._renderService.dimensions.actualCellHeight,
                                    n = this._bufferService.buffer.y * this._renderService.dimensions.actualCellHeight,
                                    o = r * this._renderService.dimensions.actualCellWidth;
                                this._compositionView.style.left = o + "px", this._compositionView.style.top = n + "px", this._compositionView.style.height = i + "px", this._compositionView.style.lineHeight = i + "px", this._compositionView.style.fontFamily = this._optionsService.options.fontFamily, this._compositionView.style.fontSize = this._optionsService.options.fontSize + "px";
                                var s = this._compositionView.getBoundingClientRect();
                                this._textarea.style.left = o + "px", this._textarea.style.top = n + "px", this._textarea.style.width = Math.max(s.width, 1) + "px", this._textarea.style.height = Math.max(s.height, 1) + "px", this._textarea.style.lineHeight = s.height + "px"
                            }
                            e || setTimeout((function () {
                                return t.updateCompositionElements(!0)
                            }), 0)
                        }
                    }, i([n(2, s.IBufferService), n(3, s.IOptionsService), n(4, s.ICoreService), n(5, o.IRenderService)], e)
                }();
                t.CompositionHelper = a
            }, 9806: (e, t) => {
                function r(e, t) {
                    var r = t.getBoundingClientRect();
                    return [e.clientX - r.left, e.clientY - r.top]
                }

                Object.defineProperty(t, "__esModule", {value: !0}), t.getRawByteCoords = t.getCoords = t.getCoordsRelativeToElement = void 0, t.getCoordsRelativeToElement = r, t.getCoords = function (e, t, i, n, o, s, a, c) {
                    if (o) {
                        var l = r(e, t);
                        if (l) return l[0] = Math.ceil((l[0] + (c ? s / 2 : 0)) / s), l[1] = Math.ceil(l[1] / a), l[0] = Math.min(Math.max(l[0], 1), i + (c ? 1 : 0)), l[1] = Math.min(Math.max(l[1], 1), n), l
                    }
                }, t.getRawByteCoords = function (e) {
                    if (e) return {x: e[0] + 32, y: e[1] + 32}
                }
            }, 9504: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.moveToCellSequence = void 0;
                var i = r(2584);

                function n(e, t, r, i) {
                    var n = e - o(r, e), a = t - o(r, t);
                    return l(Math.abs(n - a) - function (e, t, r) {
                        for (var i = 0, n = e - o(r, e), a = t - o(r, t), c = 0; c < Math.abs(n - a); c++) {
                            var l = "A" === s(e, t) ? -1 : 1, h = r.buffer.lines.get(n + l * c);
                            h && h.isWrapped && i++
                        }
                        return i
                    }(e, t, r), c(s(e, t), i))
                }

                function o(e, t) {
                    for (var r = 0, i = e.buffer.lines.get(t), n = i && i.isWrapped; n && t >= 0 && t < e.rows;) r++, n = (i = e.buffer.lines.get(--t)) && i.isWrapped;
                    return r
                }

                function s(e, t) {
                    return e > t ? "A" : "B"
                }

                function a(e, t, r, i, n, o) {
                    for (var s = e, a = t, c = ""; s !== r || a !== i;) s += n ? 1 : -1, n && s > o.cols - 1 ? (c += o.buffer.translateBufferLineToString(a, !1, e, s), s = 0, e = 0, a++) : !n && s < 0 && (c += o.buffer.translateBufferLineToString(a, !1, 0, e + 1), e = s = o.cols - 1, a--);
                    return c + o.buffer.translateBufferLineToString(a, !1, e, s)
                }

                function c(e, t) {
                    var r = t ? "O" : "[";
                    return i.C0.ESC + r + e
                }

                function l(e, t) {
                    e = Math.floor(e);
                    for (var r = "", i = 0; i < e; i++) r += t;
                    return r
                }

                t.moveToCellSequence = function (e, t, r, i) {
                    var s, h = r.buffer.x, u = r.buffer.y;
                    if (!r.buffer.hasScrollback) return function (e, t, r, i, s, h) {
                        return 0 === n(t, i, s, h).length ? "" : l(a(e, t, e, t - o(s, t), !1, s).length, c("D", h))
                    }(h, u, 0, t, r, i) + n(u, t, r, i) + function (e, t, r, i, s, h) {
                        var u;
                        u = n(t, i, s, h).length > 0 ? i - o(s, i) : t;
                        var f = i, _ = function (e, t, r, i, s, a) {
                            var c;
                            return c = n(r, i, s, a).length > 0 ? i - o(s, i) : t, e < r && c <= i || e >= r && c < i ? "C" : "D"
                        }(e, t, r, i, s, h);
                        return l(a(e, u, r, f, "C" === _, s).length, c(_, h))
                    }(h, u, e, t, r, i);
                    if (u === t) return s = h > e ? "D" : "C", l(Math.abs(h - e), c(s, i));
                    s = u > t ? "D" : "C";
                    var f = Math.abs(u - t);
                    return l(function (e, t) {
                        return t.cols - e
                    }(u > t ? e : h, r) + (f - 1) * r.cols + 1 + ((u > t ? h : e) - 1), c(s, i))
                }
            }, 244: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.AddonManager = void 0;
                var r = function () {
                    function e() {
                        this._addons = []
                    }

                    return e.prototype.dispose = function () {
                        for (var e = this._addons.length - 1; e >= 0; e--) this._addons[e].instance.dispose()
                    }, e.prototype.loadAddon = function (e, t) {
                        var r = this, i = {instance: t, dispose: t.dispose, isDisposed: !1};
                        this._addons.push(i), t.dispose = function () {
                            return r._wrappedAddonDispose(i)
                        }, t.activate(e)
                    }, e.prototype._wrappedAddonDispose = function (e) {
                        if (!e.isDisposed) {
                            for (var t = -1, r = 0; r < this._addons.length; r++) if (this._addons[r] === e) {
                                t = r;
                                break
                            }
                            if (-1 === t) throw new Error("Could not dispose an addon that has not been loaded");
                            e.isDisposed = !0, e.dispose.apply(e.instance), this._addons.splice(t, 1)
                        }
                    }, e
                }();
                t.AddonManager = r
            }, 1546: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.BaseRenderLayer = void 0;
                var i = r(643), n = r(8803), o = r(1420), s = r(3734), a = r(1752), c = r(4774), l = r(9631),
                    h = function () {
                        function e(e, t, r, i, n, o, s, a) {
                            this._container = e, this._alpha = i, this._colors = n, this._rendererId = o, this._bufferService = s, this._optionsService = a, this._scaledCharWidth = 0, this._scaledCharHeight = 0, this._scaledCellWidth = 0, this._scaledCellHeight = 0, this._scaledCharLeft = 0, this._scaledCharTop = 0, this._currentGlyphIdentifier = {
                                chars: "",
                                code: 0,
                                bg: 0,
                                fg: 0,
                                bold: !1,
                                dim: !1,
                                italic: !1
                            }, this._canvas = document.createElement("canvas"), this._canvas.classList.add("xterm-" + t + "-layer"), this._canvas.style.zIndex = r.toString(), this._initCanvas(), this._container.appendChild(this._canvas)
                        }

                        return e.prototype.dispose = function () {
                            var e;
                            l.removeElementFromParent(this._canvas), null === (e = this._charAtlas) || void 0 === e || e.dispose()
                        }, e.prototype._initCanvas = function () {
                            this._ctx = a.throwIfFalsy(this._canvas.getContext("2d", {alpha: this._alpha})), this._alpha || this._clearAll()
                        }, e.prototype.onOptionsChanged = function () {
                        }, e.prototype.onBlur = function () {
                        }, e.prototype.onFocus = function () {
                        }, e.prototype.onCursorMove = function () {
                        }, e.prototype.onGridChanged = function (e, t) {
                        }, e.prototype.onSelectionChanged = function (e, t, r) {
                            void 0 === r && (r = !1)
                        }, e.prototype.setColors = function (e) {
                            this._refreshCharAtlas(e)
                        }, e.prototype._setTransparency = function (e) {
                            if (e !== this._alpha) {
                                var t = this._canvas;
                                this._alpha = e, this._canvas = this._canvas.cloneNode(), this._initCanvas(), this._container.replaceChild(this._canvas, t), this._refreshCharAtlas(this._colors), this.onGridChanged(0, this._bufferService.rows - 1)
                            }
                        }, e.prototype._refreshCharAtlas = function (e) {
                            this._scaledCharWidth <= 0 && this._scaledCharHeight <= 0 || (this._charAtlas = o.acquireCharAtlas(this._optionsService.options, this._rendererId, e, this._scaledCharWidth, this._scaledCharHeight), this._charAtlas.warmUp())
                        }, e.prototype.resize = function (e) {
                            this._scaledCellWidth = e.scaledCellWidth, this._scaledCellHeight = e.scaledCellHeight, this._scaledCharWidth = e.scaledCharWidth, this._scaledCharHeight = e.scaledCharHeight, this._scaledCharLeft = e.scaledCharLeft, this._scaledCharTop = e.scaledCharTop, this._canvas.width = e.scaledCanvasWidth, this._canvas.height = e.scaledCanvasHeight, this._canvas.style.width = e.canvasWidth + "px", this._canvas.style.height = e.canvasHeight + "px", this._alpha || this._clearAll(), this._refreshCharAtlas(this._colors)
                        }, e.prototype._fillCells = function (e, t, r, i) {
                            this._ctx.fillRect(e * this._scaledCellWidth, t * this._scaledCellHeight, r * this._scaledCellWidth, i * this._scaledCellHeight)
                        }, e.prototype._fillBottomLineAtCells = function (e, t, r) {
                            void 0 === r && (r = 1), this._ctx.fillRect(e * this._scaledCellWidth, (t + 1) * this._scaledCellHeight - window.devicePixelRatio - 1, r * this._scaledCellWidth, window.devicePixelRatio)
                        }, e.prototype._fillLeftLineAtCell = function (e, t, r) {
                            this._ctx.fillRect(e * this._scaledCellWidth, t * this._scaledCellHeight, window.devicePixelRatio * r, this._scaledCellHeight)
                        }, e.prototype._strokeRectAtCell = function (e, t, r, i) {
                            this._ctx.lineWidth = window.devicePixelRatio, this._ctx.strokeRect(e * this._scaledCellWidth + window.devicePixelRatio / 2, t * this._scaledCellHeight + window.devicePixelRatio / 2, r * this._scaledCellWidth - window.devicePixelRatio, i * this._scaledCellHeight - window.devicePixelRatio)
                        }, e.prototype._clearAll = function () {
                            this._alpha ? this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height) : (this._ctx.fillStyle = this._colors.background.css, this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height))
                        }, e.prototype._clearCells = function (e, t, r, i) {
                            this._alpha ? this._ctx.clearRect(e * this._scaledCellWidth, t * this._scaledCellHeight, r * this._scaledCellWidth, i * this._scaledCellHeight) : (this._ctx.fillStyle = this._colors.background.css, this._ctx.fillRect(e * this._scaledCellWidth, t * this._scaledCellHeight, r * this._scaledCellWidth, i * this._scaledCellHeight))
                        }, e.prototype._fillCharTrueColor = function (e, t, r) {
                            this._ctx.font = this._getFont(!1, !1), this._ctx.textBaseline = "ideographic", this._clipRow(r), this._ctx.fillText(e.getChars(), t * this._scaledCellWidth + this._scaledCharLeft, r * this._scaledCellHeight + this._scaledCharTop + this._scaledCharHeight)
                        }, e.prototype._drawChars = function (e, t, r) {
                            var o, s, a = this._getContrastColor(e);
                            a || e.isFgRGB() || e.isBgRGB() ? this._drawUncachedChars(e, t, r, a) : (e.isInverse() ? (o = e.isBgDefault() ? n.INVERTED_DEFAULT_COLOR : e.getBgColor(), s = e.isFgDefault() ? n.INVERTED_DEFAULT_COLOR : e.getFgColor()) : (s = e.isBgDefault() ? i.DEFAULT_COLOR : e.getBgColor(), o = e.isFgDefault() ? i.DEFAULT_COLOR : e.getFgColor()), o += this._optionsService.options.drawBoldTextInBrightColors && e.isBold() && o < 8 ? 8 : 0, this._currentGlyphIdentifier.chars = e.getChars() || i.WHITESPACE_CELL_CHAR, this._currentGlyphIdentifier.code = e.getCode() || i.WHITESPACE_CELL_CODE, this._currentGlyphIdentifier.bg = s, this._currentGlyphIdentifier.fg = o, this._currentGlyphIdentifier.bold = !!e.isBold(), this._currentGlyphIdentifier.dim = !!e.isDim(), this._currentGlyphIdentifier.italic = !!e.isItalic(), this._charAtlas && this._charAtlas.draw(this._ctx, this._currentGlyphIdentifier, t * this._scaledCellWidth + this._scaledCharLeft, r * this._scaledCellHeight + this._scaledCharTop) || this._drawUncachedChars(e, t, r))
                        }, e.prototype._drawUncachedChars = function (e, t, r, i) {
                            if (this._ctx.save(), this._ctx.font = this._getFont(!!e.isBold(), !!e.isItalic()), this._ctx.textBaseline = "ideographic", e.isInverse()) if (i) this._ctx.fillStyle = i.css; else if (e.isBgDefault()) this._ctx.fillStyle = c.color.opaque(this._colors.background).css; else if (e.isBgRGB()) this._ctx.fillStyle = "rgb(" + s.AttributeData.toColorRGB(e.getBgColor()).join(",") + ")"; else {
                                var o = e.getBgColor();
                                this._optionsService.options.drawBoldTextInBrightColors && e.isBold() && o < 8 && (o += 8), this._ctx.fillStyle = this._colors.ansi[o].css
                            } else if (i) this._ctx.fillStyle = i.css; else if (e.isFgDefault()) this._ctx.fillStyle = this._colors.foreground.css; else if (e.isFgRGB()) this._ctx.fillStyle = "rgb(" + s.AttributeData.toColorRGB(e.getFgColor()).join(",") + ")"; else {
                                var a = e.getFgColor();
                                this._optionsService.options.drawBoldTextInBrightColors && e.isBold() && a < 8 && (a += 8), this._ctx.fillStyle = this._colors.ansi[a].css
                            }
                            this._clipRow(r), e.isDim() && (this._ctx.globalAlpha = n.DIM_OPACITY), this._ctx.fillText(e.getChars(), t * this._scaledCellWidth + this._scaledCharLeft, r * this._scaledCellHeight + this._scaledCharTop + this._scaledCharHeight), this._ctx.restore()
                        }, e.prototype._clipRow = function (e) {
                            this._ctx.beginPath(), this._ctx.rect(0, e * this._scaledCellHeight, this._bufferService.cols * this._scaledCellWidth, this._scaledCellHeight), this._ctx.clip()
                        }, e.prototype._getFont = function (e, t) {
                            return (t ? "italic" : "") + " " + (e ? this._optionsService.options.fontWeightBold : this._optionsService.options.fontWeight) + " " + this._optionsService.options.fontSize * window.devicePixelRatio + "px " + this._optionsService.options.fontFamily
                        }, e.prototype._getContrastColor = function (e) {
                            if (1 !== this._optionsService.options.minimumContrastRatio) {
                                var t = this._colors.contrastCache.getColor(e.bg, e.fg);
                                if (void 0 !== t) return t || void 0;
                                var r = e.getFgColor(), i = e.getFgColorMode(), n = e.getBgColor(),
                                    o = e.getBgColorMode(), s = !!e.isInverse(), a = !!e.isInverse();
                                if (s) {
                                    var l = r;
                                    r = n, n = l;
                                    var h = i;
                                    i = o, o = h
                                }
                                var u = this._resolveBackgroundRgba(o, n, s),
                                    f = this._resolveForegroundRgba(i, r, s, a),
                                    _ = c.rgba.ensureContrastRatio(u, f, this._optionsService.options.minimumContrastRatio);
                                if (_) {
                                    var d = {
                                        css: c.channels.toCss(_ >> 24 & 255, _ >> 16 & 255, _ >> 8 & 255),
                                        rgba: _
                                    };
                                    return this._colors.contrastCache.setColor(e.bg, e.fg, d), d
                                }
                                this._colors.contrastCache.setColor(e.bg, e.fg, null)
                            }
                        }, e.prototype._resolveBackgroundRgba = function (e, t, r) {
                            switch (e) {
                                case 16777216:
                                case 33554432:
                                    return this._colors.ansi[t].rgba;
                                case 50331648:
                                    return t << 8;
                                case 0:
                                default:
                                    return r ? this._colors.foreground.rgba : this._colors.background.rgba
                            }
                        }, e.prototype._resolveForegroundRgba = function (e, t, r, i) {
                            switch (e) {
                                case 16777216:
                                case 33554432:
                                    return this._optionsService.options.drawBoldTextInBrightColors && i && t < 8 && (t += 8), this._colors.ansi[t].rgba;
                                case 50331648:
                                    return t << 8;
                                case 0:
                                default:
                                    return r ? this._colors.background.rgba : this._colors.foreground.rgba
                            }
                        }, e
                    }();
                t.BaseRenderLayer = h
            }, 2512: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.CursorRenderLayer = void 0;
                var a = r(1546), c = r(511), l = r(2585), h = r(4725), u = 600, f = function (e) {
                    function t(t, r, i, n, o, s, a, l, h) {
                        var u = e.call(this, t, "cursor", r, !0, i, n, s, a) || this;
                        return u._onRequestRedraw = o, u._coreService = l, u._coreBrowserService = h, u._cell = new c.CellData, u._state = {
                            x: 0,
                            y: 0,
                            isFocused: !1,
                            style: "",
                            width: 0
                        }, u._cursorRenderers = {
                            bar: u._renderBarCursor.bind(u),
                            block: u._renderBlockCursor.bind(u),
                            underline: u._renderUnderlineCursor.bind(u)
                        }, u
                    }

                    return n(t, e), t.prototype.resize = function (t) {
                        e.prototype.resize.call(this, t), this._state = {x: 0, y: 0, isFocused: !1, style: "", width: 0}
                    }, t.prototype.reset = function () {
                        this._clearCursor(), this._cursorBlinkStateManager && (this._cursorBlinkStateManager.dispose(), this._cursorBlinkStateManager = void 0, this.onOptionsChanged())
                    }, t.prototype.onBlur = function () {
                        this._cursorBlinkStateManager && this._cursorBlinkStateManager.pause(), this._onRequestRedraw.fire({
                            start: this._bufferService.buffer.y,
                            end: this._bufferService.buffer.y
                        })
                    }, t.prototype.onFocus = function () {
                        this._cursorBlinkStateManager ? this._cursorBlinkStateManager.resume() : this._onRequestRedraw.fire({
                            start: this._bufferService.buffer.y,
                            end: this._bufferService.buffer.y
                        })
                    }, t.prototype.onOptionsChanged = function () {
                        var e, t = this;
                        this._optionsService.options.cursorBlink ? this._cursorBlinkStateManager || (this._cursorBlinkStateManager = new _(this._coreBrowserService.isFocused, (function () {
                            t._render(!0)
                        }))) : (null === (e = this._cursorBlinkStateManager) || void 0 === e || e.dispose(), this._cursorBlinkStateManager = void 0), this._onRequestRedraw.fire({
                            start: this._bufferService.buffer.y,
                            end: this._bufferService.buffer.y
                        })
                    }, t.prototype.onCursorMove = function () {
                        this._cursorBlinkStateManager && this._cursorBlinkStateManager.restartBlinkAnimation()
                    }, t.prototype.onGridChanged = function (e, t) {
                        !this._cursorBlinkStateManager || this._cursorBlinkStateManager.isPaused ? this._render(!1) : this._cursorBlinkStateManager.restartBlinkAnimation()
                    }, t.prototype._render = function (e) {
                        if (this._coreService.isCursorInitialized && !this._coreService.isCursorHidden) {
                            var t = this._bufferService.buffer.ybase + this._bufferService.buffer.y,
                                r = t - this._bufferService.buffer.ydisp;
                            if (r < 0 || r >= this._bufferService.rows) this._clearCursor(); else {
                                var i = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1);
                                if (this._bufferService.buffer.lines.get(t).loadCell(i, this._cell), void 0 !== this._cell.content) {
                                    if (!this._coreBrowserService.isFocused) {
                                        this._clearCursor(), this._ctx.save(), this._ctx.fillStyle = this._colors.cursor.css;
                                        var n = this._optionsService.options.cursorStyle;
                                        return n && "block" !== n ? this._cursorRenderers[n](i, r, this._cell) : this._renderBlurCursor(i, r, this._cell), this._ctx.restore(), this._state.x = i, this._state.y = r, this._state.isFocused = !1, this._state.style = n, void (this._state.width = this._cell.getWidth())
                                    }
                                    if (!this._cursorBlinkStateManager || this._cursorBlinkStateManager.isCursorVisible) {
                                        if (this._state) {
                                            if (this._state.x === i && this._state.y === r && this._state.isFocused === this._coreBrowserService.isFocused && this._state.style === this._optionsService.options.cursorStyle && this._state.width === this._cell.getWidth()) return;
                                            this._clearCursor()
                                        }
                                        this._ctx.save(), this._cursorRenderers[this._optionsService.options.cursorStyle || "block"](i, r, this._cell), this._ctx.restore(), this._state.x = i, this._state.y = r, this._state.isFocused = !1, this._state.style = this._optionsService.options.cursorStyle, this._state.width = this._cell.getWidth()
                                    } else this._clearCursor()
                                }
                            }
                        } else this._clearCursor()
                    }, t.prototype._clearCursor = function () {
                        this._state && (this._clearCells(this._state.x, this._state.y, this._state.width, 1), this._state = {
                            x: 0,
                            y: 0,
                            isFocused: !1,
                            style: "",
                            width: 0
                        })
                    }, t.prototype._renderBarCursor = function (e, t, r) {
                        this._ctx.save(), this._ctx.fillStyle = this._colors.cursor.css, this._fillLeftLineAtCell(e, t, this._optionsService.options.cursorWidth), this._ctx.restore()
                    }, t.prototype._renderBlockCursor = function (e, t, r) {
                        this._ctx.save(), this._ctx.fillStyle = this._colors.cursor.css, this._fillCells(e, t, r.getWidth(), 1), this._ctx.fillStyle = this._colors.cursorAccent.css, this._fillCharTrueColor(r, e, t), this._ctx.restore()
                    }, t.prototype._renderUnderlineCursor = function (e, t, r) {
                        this._ctx.save(), this._ctx.fillStyle = this._colors.cursor.css, this._fillBottomLineAtCells(e, t), this._ctx.restore()
                    }, t.prototype._renderBlurCursor = function (e, t, r) {
                        this._ctx.save(), this._ctx.strokeStyle = this._colors.cursor.css, this._strokeRectAtCell(e, t, r.getWidth(), 1), this._ctx.restore()
                    }, o([s(5, l.IBufferService), s(6, l.IOptionsService), s(7, l.ICoreService), s(8, h.ICoreBrowserService)], t)
                }(a.BaseRenderLayer);
                t.CursorRenderLayer = f;
                var _ = function () {
                    function e(e, t) {
                        this._renderCallback = t, this.isCursorVisible = !0, e && this._restartInterval()
                    }

                    return Object.defineProperty(e.prototype, "isPaused", {
                        get: function () {
                            return !(this._blinkStartTimeout || this._blinkInterval)
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.dispose = function () {
                        this._blinkInterval && (window.clearInterval(this._blinkInterval), this._blinkInterval = void 0), this._blinkStartTimeout && (window.clearTimeout(this._blinkStartTimeout), this._blinkStartTimeout = void 0), this._animationFrame && (window.cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0)
                    }, e.prototype.restartBlinkAnimation = function () {
                        var e = this;
                        this.isPaused || (this._animationTimeRestarted = Date.now(), this.isCursorVisible = !0, this._animationFrame || (this._animationFrame = window.requestAnimationFrame((function () {
                            e._renderCallback(), e._animationFrame = void 0
                        }))))
                    }, e.prototype._restartInterval = function (e) {
                        var t = this;
                        void 0 === e && (e = u), this._blinkInterval && window.clearInterval(this._blinkInterval), this._blinkStartTimeout = window.setTimeout((function () {
                            if (t._animationTimeRestarted) {
                                var e = u - (Date.now() - t._animationTimeRestarted);
                                if (t._animationTimeRestarted = void 0, e > 0) return void t._restartInterval(e)
                            }
                            t.isCursorVisible = !1, t._animationFrame = window.requestAnimationFrame((function () {
                                t._renderCallback(), t._animationFrame = void 0
                            })), t._blinkInterval = window.setInterval((function () {
                                if (t._animationTimeRestarted) {
                                    var e = u - (Date.now() - t._animationTimeRestarted);
                                    return t._animationTimeRestarted = void 0, void t._restartInterval(e)
                                }
                                t.isCursorVisible = !t.isCursorVisible, t._animationFrame = window.requestAnimationFrame((function () {
                                    t._renderCallback(), t._animationFrame = void 0
                                }))
                            }), u)
                        }), e)
                    }, e.prototype.pause = function () {
                        this.isCursorVisible = !0, this._blinkInterval && (window.clearInterval(this._blinkInterval), this._blinkInterval = void 0), this._blinkStartTimeout && (window.clearTimeout(this._blinkStartTimeout), this._blinkStartTimeout = void 0), this._animationFrame && (window.cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0)
                    }, e.prototype.resume = function () {
                        this.pause(), this._animationTimeRestarted = void 0, this._restartInterval(), this.restartBlinkAnimation()
                    }, e
                }()
            }, 3700: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.GridCache = void 0;
                var r = function () {
                    function e() {
                        this.cache = []
                    }

                    return e.prototype.resize = function (e, t) {
                        for (var r = 0; r < e; r++) {
                            this.cache.length <= r && this.cache.push([]);
                            for (var i = this.cache[r].length; i < t; i++) this.cache[r].push(void 0);
                            this.cache[r].length = t
                        }
                        this.cache.length = e
                    }, e.prototype.clear = function () {
                        for (var e = 0; e < this.cache.length; e++) for (var t = 0; t < this.cache[e].length; t++) this.cache[e][t] = void 0
                    }, e
                }();
                t.GridCache = r
            }, 5098: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.LinkRenderLayer = void 0;
                var a = r(1546), c = r(8803), l = r(2040), h = r(2585), u = function (e) {
                    function t(t, r, i, n, o, s, a, c) {
                        var l = e.call(this, t, "link", r, !0, i, n, a, c) || this;
                        return o.onShowLinkUnderline((function (e) {
                            return l._onShowLinkUnderline(e)
                        })), o.onHideLinkUnderline((function (e) {
                            return l._onHideLinkUnderline(e)
                        })), s.onShowLinkUnderline((function (e) {
                            return l._onShowLinkUnderline(e)
                        })), s.onHideLinkUnderline((function (e) {
                            return l._onHideLinkUnderline(e)
                        })), l
                    }

                    return n(t, e), t.prototype.resize = function (t) {
                        e.prototype.resize.call(this, t), this._state = void 0
                    }, t.prototype.reset = function () {
                        this._clearCurrentLink()
                    }, t.prototype._clearCurrentLink = function () {
                        if (this._state) {
                            this._clearCells(this._state.x1, this._state.y1, this._state.cols - this._state.x1, 1);
                            var e = this._state.y2 - this._state.y1 - 1;
                            e > 0 && this._clearCells(0, this._state.y1 + 1, this._state.cols, e), this._clearCells(0, this._state.y2, this._state.x2, 1), this._state = void 0
                        }
                    }, t.prototype._onShowLinkUnderline = function (e) {
                        if (e.fg === c.INVERTED_DEFAULT_COLOR ? this._ctx.fillStyle = this._colors.background.css : e.fg && l.is256Color(e.fg) ? this._ctx.fillStyle = this._colors.ansi[e.fg].css : this._ctx.fillStyle = this._colors.foreground.css, e.y1 === e.y2) this._fillBottomLineAtCells(e.x1, e.y1, e.x2 - e.x1); else {
                            this._fillBottomLineAtCells(e.x1, e.y1, e.cols - e.x1);
                            for (var t = e.y1 + 1; t < e.y2; t++) this._fillBottomLineAtCells(0, t, e.cols);
                            this._fillBottomLineAtCells(0, e.y2, e.x2)
                        }
                        this._state = e
                    }, t.prototype._onHideLinkUnderline = function (e) {
                        this._clearCurrentLink()
                    }, o([s(6, h.IBufferService), s(7, h.IOptionsService)], t)
                }(a.BaseRenderLayer);
                t.LinkRenderLayer = u
            }, 3525: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.Renderer = void 0;
                var a = r(9596), c = r(4149), l = r(2512), h = r(5098), u = r(844), f = r(4725), _ = r(2585),
                    d = r(1420), p = r(8460), v = 1, g = function (e) {
                        function t(t, r, i, n, o, s, u, f) {
                            var _ = e.call(this) || this;
                            _._colors = t, _._screenElement = r, _._bufferService = s, _._charSizeService = u, _._optionsService = f, _._id = v++, _._onRequestRedraw = new p.EventEmitter;
                            var d = _._optionsService.options.allowTransparency;
                            return _._renderLayers = [o.createInstance(a.TextRenderLayer, _._screenElement, 0, _._colors, d, _._id), o.createInstance(c.SelectionRenderLayer, _._screenElement, 1, _._colors, _._id), o.createInstance(h.LinkRenderLayer, _._screenElement, 2, _._colors, _._id, i, n), o.createInstance(l.CursorRenderLayer, _._screenElement, 3, _._colors, _._id, _._onRequestRedraw)], _.dimensions = {
                                scaledCharWidth: 0,
                                scaledCharHeight: 0,
                                scaledCellWidth: 0,
                                scaledCellHeight: 0,
                                scaledCharLeft: 0,
                                scaledCharTop: 0,
                                scaledCanvasWidth: 0,
                                scaledCanvasHeight: 0,
                                canvasWidth: 0,
                                canvasHeight: 0,
                                actualCellWidth: 0,
                                actualCellHeight: 0
                            }, _._devicePixelRatio = window.devicePixelRatio, _._updateDimensions(), _.onOptionsChanged(), _
                        }

                        return n(t, e), Object.defineProperty(t.prototype, "onRequestRedraw", {
                            get: function () {
                                return this._onRequestRedraw.event
                            }, enumerable: !1, configurable: !0
                        }), t.prototype.dispose = function () {
                            for (var t = 0, r = this._renderLayers; t < r.length; t++) r[t].dispose();
                            e.prototype.dispose.call(this), d.removeTerminalFromCache(this._id)
                        }, t.prototype.onDevicePixelRatioChange = function () {
                            this._devicePixelRatio !== window.devicePixelRatio && (this._devicePixelRatio = window.devicePixelRatio, this.onResize(this._bufferService.cols, this._bufferService.rows))
                        }, t.prototype.setColors = function (e) {
                            this._colors = e;
                            for (var t = 0, r = this._renderLayers; t < r.length; t++) {
                                var i = r[t];
                                i.setColors(this._colors), i.reset()
                            }
                        }, t.prototype.onResize = function (e, t) {
                            this._updateDimensions();
                            for (var r = 0, i = this._renderLayers; r < i.length; r++) i[r].resize(this.dimensions);
                            this._screenElement.style.width = this.dimensions.canvasWidth + "px", this._screenElement.style.height = this.dimensions.canvasHeight + "px"
                        }, t.prototype.onCharSizeChanged = function () {
                            this.onResize(this._bufferService.cols, this._bufferService.rows)
                        }, t.prototype.onBlur = function () {
                            this._runOperation((function (e) {
                                return e.onBlur()
                            }))
                        }, t.prototype.onFocus = function () {
                            this._runOperation((function (e) {
                                return e.onFocus()
                            }))
                        }, t.prototype.onSelectionChanged = function (e, t, r) {
                            void 0 === r && (r = !1), this._runOperation((function (i) {
                                return i.onSelectionChanged(e, t, r)
                            }))
                        }, t.prototype.onCursorMove = function () {
                            this._runOperation((function (e) {
                                return e.onCursorMove()
                            }))
                        }, t.prototype.onOptionsChanged = function () {
                            this._runOperation((function (e) {
                                return e.onOptionsChanged()
                            }))
                        }, t.prototype.clear = function () {
                            this._runOperation((function (e) {
                                return e.reset()
                            }))
                        }, t.prototype._runOperation = function (e) {
                            for (var t = 0, r = this._renderLayers; t < r.length; t++) e(r[t])
                        }, t.prototype.renderRows = function (e, t) {
                            for (var r = 0, i = this._renderLayers; r < i.length; r++) i[r].onGridChanged(e, t)
                        }, t.prototype._updateDimensions = function () {
                            this._charSizeService.hasValidSize && (this.dimensions.scaledCharWidth = Math.floor(this._charSizeService.width * window.devicePixelRatio), this.dimensions.scaledCharHeight = Math.ceil(this._charSizeService.height * window.devicePixelRatio), this.dimensions.scaledCellHeight = Math.floor(this.dimensions.scaledCharHeight * this._optionsService.options.lineHeight), this.dimensions.scaledCharTop = 1 === this._optionsService.options.lineHeight ? 0 : Math.round((this.dimensions.scaledCellHeight - this.dimensions.scaledCharHeight) / 2), this.dimensions.scaledCellWidth = this.dimensions.scaledCharWidth + Math.round(this._optionsService.options.letterSpacing), this.dimensions.scaledCharLeft = Math.floor(this._optionsService.options.letterSpacing / 2), this.dimensions.scaledCanvasHeight = this._bufferService.rows * this.dimensions.scaledCellHeight, this.dimensions.scaledCanvasWidth = this._bufferService.cols * this.dimensions.scaledCellWidth, this.dimensions.canvasHeight = Math.round(this.dimensions.scaledCanvasHeight / window.devicePixelRatio), this.dimensions.canvasWidth = Math.round(this.dimensions.scaledCanvasWidth / window.devicePixelRatio), this.dimensions.actualCellHeight = this.dimensions.canvasHeight / this._bufferService.rows, this.dimensions.actualCellWidth = this.dimensions.canvasWidth / this._bufferService.cols)
                        }, o([s(4, _.IInstantiationService), s(5, _.IBufferService), s(6, f.ICharSizeService), s(7, _.IOptionsService)], t)
                    }(u.Disposable);
                t.Renderer = g
            }, 1752: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.throwIfFalsy = void 0, t.throwIfFalsy = function (e) {
                    if (!e) throw new Error("value must not be falsy");
                    return e
                }
            }, 4149: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.SelectionRenderLayer = void 0;
                var a = r(1546), c = r(2585), l = function (e) {
                    function t(t, r, i, n, o, s) {
                        var a = e.call(this, t, "selection", r, !0, i, n, o, s) || this;
                        return a._clearState(), a
                    }

                    return n(t, e), t.prototype._clearState = function () {
                        this._state = {start: void 0, end: void 0, columnSelectMode: void 0, ydisp: void 0}
                    }, t.prototype.resize = function (t) {
                        e.prototype.resize.call(this, t), this._clearState()
                    }, t.prototype.reset = function () {
                        this._state.start && this._state.end && (this._clearState(), this._clearAll())
                    }, t.prototype.onSelectionChanged = function (e, t, r) {
                        if (this._didStateChange(e, t, r, this._bufferService.buffer.ydisp)) if (this._clearAll(), e && t) {
                            var i = e[1] - this._bufferService.buffer.ydisp,
                                n = t[1] - this._bufferService.buffer.ydisp, o = Math.max(i, 0),
                                s = Math.min(n, this._bufferService.rows - 1);
                            if (o >= this._bufferService.rows || s < 0) this._state.ydisp = this._bufferService.buffer.ydisp; else {
                                if (this._ctx.fillStyle = this._colors.selectionTransparent.css, r) {
                                    var a = e[0], c = t[0] - a, l = s - o + 1;
                                    this._fillCells(a, o, c, l)
                                } else {
                                    a = i === o ? e[0] : 0;
                                    var h = o === n ? t[0] : this._bufferService.cols;
                                    this._fillCells(a, o, h - a, 1);
                                    var u = Math.max(s - o - 1, 0);
                                    if (this._fillCells(0, o + 1, this._bufferService.cols, u), o !== s) {
                                        var f = n === s ? t[0] : this._bufferService.cols;
                                        this._fillCells(0, s, f, 1)
                                    }
                                }
                                this._state.start = [e[0], e[1]], this._state.end = [t[0], t[1]], this._state.columnSelectMode = r, this._state.ydisp = this._bufferService.buffer.ydisp
                            }
                        } else this._clearState()
                    }, t.prototype._didStateChange = function (e, t, r, i) {
                        return !this._areCoordinatesEqual(e, this._state.start) || !this._areCoordinatesEqual(t, this._state.end) || r !== this._state.columnSelectMode || i !== this._state.ydisp
                    }, t.prototype._areCoordinatesEqual = function (e, t) {
                        return !(!e || !t) && e[0] === t[0] && e[1] === t[1]
                    }, o([s(4, c.IBufferService), s(5, c.IOptionsService)], t)
                }(a.BaseRenderLayer);
                t.SelectionRenderLayer = l
            }, 9596: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.TextRenderLayer = void 0;
                var a = r(3700), c = r(1546), l = r(3734), h = r(643), u = r(511), f = r(2585), _ = r(4725),
                    d = r(4269), p = function (e) {
                        function t(t, r, i, n, o, s, c, l) {
                            var h = e.call(this, t, "text", r, n, i, o, s, c) || this;
                            return h._characterJoinerService = l, h._characterWidth = 0, h._characterFont = "", h._characterOverlapCache = {}, h._workCell = new u.CellData, h._state = new a.GridCache, h
                        }

                        return n(t, e), t.prototype.resize = function (t) {
                            e.prototype.resize.call(this, t);
                            var r = this._getFont(!1, !1);
                            this._characterWidth === t.scaledCharWidth && this._characterFont === r || (this._characterWidth = t.scaledCharWidth, this._characterFont = r, this._characterOverlapCache = {}), this._state.clear(), this._state.resize(this._bufferService.cols, this._bufferService.rows)
                        }, t.prototype.reset = function () {
                            this._state.clear(), this._clearAll()
                        }, t.prototype._forEachCell = function (e, t, r) {
                            for (var i = e; i <= t; i++) for (var n = i + this._bufferService.buffer.ydisp, o = this._bufferService.buffer.lines.get(n), s = this._characterJoinerService.getJoinedCharacters(n), a = 0; a < this._bufferService.cols; a++) {
                                o.loadCell(a, this._workCell);
                                var c = this._workCell, l = !1, u = a;
                                if (0 !== c.getWidth()) {
                                    if (s.length > 0 && a === s[0][0]) {
                                        l = !0;
                                        var f = s.shift();
                                        c = new d.JoinedCellData(this._workCell, o.translateToString(!0, f[0], f[1]), f[1] - f[0]), u = f[1] - 1
                                    }
                                    !l && this._isOverlapping(c) && u < o.length - 1 && o.getCodePoint(u + 1) === h.NULL_CELL_CODE && (c.content &= -12582913, c.content |= 2 << 22), r(c, a, i), a = u
                                }
                            }
                        }, t.prototype._drawBackground = function (e, t) {
                            var r = this, i = this._ctx, n = this._bufferService.cols, o = 0, s = 0, a = null;
                            i.save(), this._forEachCell(e, t, (function (e, t, c) {
                                var h = null;
                                e.isInverse() ? h = e.isFgDefault() ? r._colors.foreground.css : e.isFgRGB() ? "rgb(" + l.AttributeData.toColorRGB(e.getFgColor()).join(",") + ")" : r._colors.ansi[e.getFgColor()].css : e.isBgRGB() ? h = "rgb(" + l.AttributeData.toColorRGB(e.getBgColor()).join(",") + ")" : e.isBgPalette() && (h = r._colors.ansi[e.getBgColor()].css), null === a && (o = t, s = c), c !== s ? (i.fillStyle = a || "", r._fillCells(o, s, n - o, 1), o = t, s = c) : a !== h && (i.fillStyle = a || "", r._fillCells(o, s, t - o, 1), o = t, s = c), a = h
                            })), null !== a && (i.fillStyle = a, this._fillCells(o, s, n - o, 1)), i.restore()
                        }, t.prototype._drawForeground = function (e, t) {
                            var r = this;
                            this._forEachCell(e, t, (function (e, t, i) {
                                if (!e.isInvisible() && (r._drawChars(e, t, i), e.isUnderline())) {
                                    if (r._ctx.save(), e.isInverse()) if (e.isBgDefault()) r._ctx.fillStyle = r._colors.background.css; else if (e.isBgRGB()) r._ctx.fillStyle = "rgb(" + l.AttributeData.toColorRGB(e.getBgColor()).join(",") + ")"; else {
                                        var n = e.getBgColor();
                                        r._optionsService.options.drawBoldTextInBrightColors && e.isBold() && n < 8 && (n += 8), r._ctx.fillStyle = r._colors.ansi[n].css
                                    } else if (e.isFgDefault()) r._ctx.fillStyle = r._colors.foreground.css; else if (e.isFgRGB()) r._ctx.fillStyle = "rgb(" + l.AttributeData.toColorRGB(e.getFgColor()).join(",") + ")"; else {
                                        var o = e.getFgColor();
                                        r._optionsService.options.drawBoldTextInBrightColors && e.isBold() && o < 8 && (o += 8), r._ctx.fillStyle = r._colors.ansi[o].css
                                    }
                                    r._fillBottomLineAtCells(t, i, e.getWidth()), r._ctx.restore()
                                }
                            }))
                        }, t.prototype.onGridChanged = function (e, t) {
                            0 !== this._state.cache.length && (this._charAtlas && this._charAtlas.beginFrame(), this._clearCells(0, e, this._bufferService.cols, t - e + 1), this._drawBackground(e, t), this._drawForeground(e, t))
                        }, t.prototype.onOptionsChanged = function () {
                            this._setTransparency(this._optionsService.options.allowTransparency)
                        }, t.prototype._isOverlapping = function (e) {
                            if (1 !== e.getWidth()) return !1;
                            if (e.getCode() < 256) return !1;
                            var t = e.getChars();
                            if (this._characterOverlapCache.hasOwnProperty(t)) return this._characterOverlapCache[t];
                            this._ctx.save(), this._ctx.font = this._characterFont;
                            var r = Math.floor(this._ctx.measureText(t).width) > this._characterWidth;
                            return this._ctx.restore(), this._characterOverlapCache[t] = r, r
                        }, o([s(5, f.IBufferService), s(6, f.IOptionsService), s(7, _.ICharacterJoinerService)], t)
                    }(c.BaseRenderLayer);
                t.TextRenderLayer = p
            }, 9616: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.BaseCharAtlas = void 0;
                var r = function () {
                    function e() {
                        this._didWarmUp = !1
                    }

                    return e.prototype.dispose = function () {
                    }, e.prototype.warmUp = function () {
                        this._didWarmUp || (this._doWarmUp(), this._didWarmUp = !0)
                    }, e.prototype._doWarmUp = function () {
                    }, e.prototype.beginFrame = function () {
                    }, e
                }();
                t.BaseCharAtlas = r
            }, 1420: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.removeTerminalFromCache = t.acquireCharAtlas = void 0;
                var i = r(2040), n = r(1906), o = [];
                t.acquireCharAtlas = function (e, t, r, s, a) {
                    for (var c = i.generateConfig(s, a, e, r), l = 0; l < o.length; l++) {
                        var h = (u = o[l]).ownedBy.indexOf(t);
                        if (h >= 0) {
                            if (i.configEquals(u.config, c)) return u.atlas;
                            1 === u.ownedBy.length ? (u.atlas.dispose(), o.splice(l, 1)) : u.ownedBy.splice(h, 1);
                            break
                        }
                    }
                    for (l = 0; l < o.length; l++) {
                        var u = o[l];
                        if (i.configEquals(u.config, c)) return u.ownedBy.push(t), u.atlas
                    }
                    var f = {atlas: new n.DynamicCharAtlas(document, c), config: c, ownedBy: [t]};
                    return o.push(f), f.atlas
                }, t.removeTerminalFromCache = function (e) {
                    for (var t = 0; t < o.length; t++) {
                        var r = o[t].ownedBy.indexOf(e);
                        if (-1 !== r) {
                            1 === o[t].ownedBy.length ? (o[t].atlas.dispose(), o.splice(t, 1)) : o[t].ownedBy.splice(r, 1);
                            break
                        }
                    }
                }
            }, 2040: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.is256Color = t.configEquals = t.generateConfig = void 0;
                var i = r(643);
                t.generateConfig = function (e, t, r, i) {
                    var n = {
                        foreground: i.foreground,
                        background: i.background,
                        cursor: void 0,
                        cursorAccent: void 0,
                        selection: void 0,
                        ansi: i.ansi
                    };
                    return {
                        devicePixelRatio: window.devicePixelRatio,
                        scaledCharWidth: e,
                        scaledCharHeight: t,
                        fontFamily: r.fontFamily,
                        fontSize: r.fontSize,
                        fontWeight: r.fontWeight,
                        fontWeightBold: r.fontWeightBold,
                        allowTransparency: r.allowTransparency,
                        colors: n
                    }
                }, t.configEquals = function (e, t) {
                    for (var r = 0; r < e.colors.ansi.length; r++) if (e.colors.ansi[r].rgba !== t.colors.ansi[r].rgba) return !1;
                    return e.devicePixelRatio === t.devicePixelRatio && e.fontFamily === t.fontFamily && e.fontSize === t.fontSize && e.fontWeight === t.fontWeight && e.fontWeightBold === t.fontWeightBold && e.allowTransparency === t.allowTransparency && e.scaledCharWidth === t.scaledCharWidth && e.scaledCharHeight === t.scaledCharHeight && e.colors.foreground === t.colors.foreground && e.colors.background === t.colors.background
                }, t.is256Color = function (e) {
                    return e < i.DEFAULT_COLOR
                }
            }, 8803: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.CHAR_ATLAS_CELL_SPACING = t.DIM_OPACITY = t.INVERTED_DEFAULT_COLOR = void 0, t.INVERTED_DEFAULT_COLOR = 257, t.DIM_OPACITY = .5, t.CHAR_ATLAS_CELL_SPACING = 1
            }, 1906: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.NoneCharAtlas = t.DynamicCharAtlas = t.getGlyphCacheKey = void 0;
                var o = r(8803), s = r(9616), a = r(5680), c = r(7001), l = r(6114), h = r(1752), u = r(4774),
                    f = {css: "rgba(0, 0, 0, 0)", rgba: 0};

                function _(e) {
                    return e.code << 21 | e.bg << 12 | e.fg << 3 | (e.bold ? 0 : 4) + (e.dim ? 0 : 2) + (e.italic ? 0 : 1)
                }

                t.getGlyphCacheKey = _;
                var d = function (e) {
                    function t(t, r) {
                        var i = e.call(this) || this;
                        i._config = r, i._drawToCacheCount = 0, i._glyphsWaitingOnBitmap = [], i._bitmapCommitTimeout = null, i._bitmap = null, i._cacheCanvas = t.createElement("canvas"), i._cacheCanvas.width = 1024, i._cacheCanvas.height = 1024, i._cacheCtx = h.throwIfFalsy(i._cacheCanvas.getContext("2d", {alpha: !0}));
                        var n = t.createElement("canvas");
                        n.width = i._config.scaledCharWidth, n.height = i._config.scaledCharHeight, i._tmpCtx = h.throwIfFalsy(n.getContext("2d", {alpha: i._config.allowTransparency})), i._width = Math.floor(1024 / i._config.scaledCharWidth), i._height = Math.floor(1024 / i._config.scaledCharHeight);
                        var o = i._width * i._height;
                        return i._cacheMap = new c.LRUMap(o), i._cacheMap.prealloc(o), i
                    }

                    return n(t, e), t.prototype.dispose = function () {
                        null !== this._bitmapCommitTimeout && (window.clearTimeout(this._bitmapCommitTimeout), this._bitmapCommitTimeout = null)
                    }, t.prototype.beginFrame = function () {
                        this._drawToCacheCount = 0
                    }, t.prototype.draw = function (e, t, r, i) {
                        if (32 === t.code) return !0;
                        if (!this._canCache(t)) return !1;
                        var n = _(t), o = this._cacheMap.get(n);
                        if (null != o) return this._drawFromCache(e, o, r, i), !0;
                        if (this._drawToCacheCount < 100) {
                            var s;
                            s = this._cacheMap.size < this._cacheMap.capacity ? this._cacheMap.size : this._cacheMap.peek().index;
                            var a = this._drawToCache(t, s);
                            return this._cacheMap.set(n, a), this._drawFromCache(e, a, r, i), !0
                        }
                        return !1
                    }, t.prototype._canCache = function (e) {
                        return e.code < 256
                    }, t.prototype._toCoordinateX = function (e) {
                        return e % this._width * this._config.scaledCharWidth
                    }, t.prototype._toCoordinateY = function (e) {
                        return Math.floor(e / this._width) * this._config.scaledCharHeight
                    }, t.prototype._drawFromCache = function (e, t, r, i) {
                        if (!t.isEmpty) {
                            var n = this._toCoordinateX(t.index), o = this._toCoordinateY(t.index);
                            e.drawImage(t.inBitmap ? this._bitmap : this._cacheCanvas, n, o, this._config.scaledCharWidth, this._config.scaledCharHeight, r, i, this._config.scaledCharWidth, this._config.scaledCharHeight)
                        }
                    }, t.prototype._getColorFromAnsiIndex = function (e) {
                        return e < this._config.colors.ansi.length ? this._config.colors.ansi[e] : a.DEFAULT_ANSI_COLORS[e]
                    }, t.prototype._getBackgroundColor = function (e) {
                        return this._config.allowTransparency ? f : e.bg === o.INVERTED_DEFAULT_COLOR ? this._config.colors.foreground : e.bg < 256 ? this._getColorFromAnsiIndex(e.bg) : this._config.colors.background
                    }, t.prototype._getForegroundColor = function (e) {
                        return e.fg === o.INVERTED_DEFAULT_COLOR ? u.color.opaque(this._config.colors.background) : e.fg < 256 ? this._getColorFromAnsiIndex(e.fg) : this._config.colors.foreground
                    }, t.prototype._drawToCache = function (e, t) {
                        this._drawToCacheCount++, this._tmpCtx.save();
                        var r = this._getBackgroundColor(e);
                        this._tmpCtx.globalCompositeOperation = "copy", this._tmpCtx.fillStyle = r.css, this._tmpCtx.fillRect(0, 0, this._config.scaledCharWidth, this._config.scaledCharHeight), this._tmpCtx.globalCompositeOperation = "source-over";
                        var i = e.bold ? this._config.fontWeightBold : this._config.fontWeight,
                            n = e.italic ? "italic" : "";
                        this._tmpCtx.font = n + " " + i + " " + this._config.fontSize * this._config.devicePixelRatio + "px " + this._config.fontFamily, this._tmpCtx.textBaseline = "ideographic", this._tmpCtx.fillStyle = this._getForegroundColor(e).css, e.dim && (this._tmpCtx.globalAlpha = o.DIM_OPACITY), this._tmpCtx.fillText(e.chars, 0, this._config.scaledCharHeight), this._tmpCtx.restore();
                        var s = this._tmpCtx.getImageData(0, 0, this._config.scaledCharWidth, this._config.scaledCharHeight),
                            a = !1;
                        this._config.allowTransparency || (a = function (e, t) {
                            for (var r = !0, i = t.rgba >>> 24, n = t.rgba >>> 16 & 255, o = t.rgba >>> 8 & 255, s = 0; s < e.data.length; s += 4) e.data[s] === i && e.data[s + 1] === n && e.data[s + 2] === o ? e.data[s + 3] = 0 : r = !1;
                            return r
                        }(s, r));
                        var c = this._toCoordinateX(t), l = this._toCoordinateY(t);
                        this._cacheCtx.putImageData(s, c, l);
                        var h = {index: t, isEmpty: a, inBitmap: !1};
                        return this._addGlyphToBitmap(h), h
                    }, t.prototype._addGlyphToBitmap = function (e) {
                        var t = this;
                        !("createImageBitmap" in window) || l.isFirefox || l.isSafari || (this._glyphsWaitingOnBitmap.push(e), null === this._bitmapCommitTimeout && (this._bitmapCommitTimeout = window.setTimeout((function () {
                            return t._generateBitmap()
                        }), 100)))
                    }, t.prototype._generateBitmap = function () {
                        var e = this, t = this._glyphsWaitingOnBitmap;
                        this._glyphsWaitingOnBitmap = [], window.createImageBitmap(this._cacheCanvas).then((function (r) {
                            e._bitmap = r;
                            for (var i = 0; i < t.length; i++) t[i].inBitmap = !0
                        })), this._bitmapCommitTimeout = null
                    }, t
                }(s.BaseCharAtlas);
                t.DynamicCharAtlas = d;
                var p = function (e) {
                    function t(t, r) {
                        return e.call(this) || this
                    }

                    return n(t, e), t.prototype.draw = function (e, t, r, i) {
                        return !1
                    }, t
                }(s.BaseCharAtlas);
                t.NoneCharAtlas = p
            }, 7001: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.LRUMap = void 0;
                var r = function () {
                    function e(e) {
                        this.capacity = e, this._map = {}, this._head = null, this._tail = null, this._nodePool = [], this.size = 0
                    }

                    return e.prototype._unlinkNode = function (e) {
                        var t = e.prev, r = e.next;
                        e === this._head && (this._head = r), e === this._tail && (this._tail = t), null !== t && (t.next = r), null !== r && (r.prev = t)
                    }, e.prototype._appendNode = function (e) {
                        var t = this._tail;
                        null !== t && (t.next = e), e.prev = t, e.next = null, this._tail = e, null === this._head && (this._head = e)
                    }, e.prototype.prealloc = function (e) {
                        for (var t = this._nodePool, r = 0; r < e; r++) t.push({
                            prev: null,
                            next: null,
                            key: null,
                            value: null
                        })
                    }, e.prototype.get = function (e) {
                        var t = this._map[e];
                        return void 0 !== t ? (this._unlinkNode(t), this._appendNode(t), t.value) : null
                    }, e.prototype.peekValue = function (e) {
                        var t = this._map[e];
                        return void 0 !== t ? t.value : null
                    }, e.prototype.peek = function () {
                        var e = this._head;
                        return null === e ? null : e.value
                    }, e.prototype.set = function (e, t) {
                        var r = this._map[e];
                        if (void 0 !== r) r = this._map[e], this._unlinkNode(r), r.value = t; else if (this.size >= this.capacity) r = this._head, this._unlinkNode(r), delete this._map[r.key], r.key = e, r.value = t, this._map[e] = r; else {
                            var i = this._nodePool;
                            i.length > 0 ? ((r = i.pop()).key = e, r.value = t) : r = {
                                prev: null,
                                next: null,
                                key: e,
                                value: t
                            }, this._map[e] = r, this.size++
                        }
                        this._appendNode(r)
                    }, e
                }();
                t.LRUMap = r
            }, 1296: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.DomRenderer = void 0;
                var a = r(3787), c = r(8803), l = r(844), h = r(4725), u = r(2585), f = r(8460), _ = r(4774),
                    d = r(9631), p = "xterm-dom-renderer-owner-", v = "xterm-fg-", g = "xterm-bg-", y = "xterm-focus",
                    b = 1, S = function (e) {
                        function t(t, r, i, n, o, s, c, l, h, u) {
                            var f = e.call(this) || this;
                            return f._colors = t, f._element = r, f._screenElement = i, f._viewportElement = n, f._linkifier = o, f._linkifier2 = s, f._charSizeService = l, f._optionsService = h, f._bufferService = u, f._terminalClass = b++, f._rowElements = [], f._rowContainer = document.createElement("div"), f._rowContainer.classList.add("xterm-rows"), f._rowContainer.style.lineHeight = "normal", f._rowContainer.setAttribute("aria-hidden", "true"), f._refreshRowElements(f._bufferService.cols, f._bufferService.rows), f._selectionContainer = document.createElement("div"), f._selectionContainer.classList.add("xterm-selection"), f._selectionContainer.setAttribute("aria-hidden", "true"), f.dimensions = {
                                scaledCharWidth: 0,
                                scaledCharHeight: 0,
                                scaledCellWidth: 0,
                                scaledCellHeight: 0,
                                scaledCharLeft: 0,
                                scaledCharTop: 0,
                                scaledCanvasWidth: 0,
                                scaledCanvasHeight: 0,
                                canvasWidth: 0,
                                canvasHeight: 0,
                                actualCellWidth: 0,
                                actualCellHeight: 0
                            }, f._updateDimensions(), f._injectCss(), f._rowFactory = c.createInstance(a.DomRendererRowFactory, document, f._colors), f._element.classList.add(p + f._terminalClass), f._screenElement.appendChild(f._rowContainer), f._screenElement.appendChild(f._selectionContainer), f._linkifier.onShowLinkUnderline((function (e) {
                                return f._onLinkHover(e)
                            })), f._linkifier.onHideLinkUnderline((function (e) {
                                return f._onLinkLeave(e)
                            })), f._linkifier2.onShowLinkUnderline((function (e) {
                                return f._onLinkHover(e)
                            })), f._linkifier2.onHideLinkUnderline((function (e) {
                                return f._onLinkLeave(e)
                            })), f
                        }

                        return n(t, e), Object.defineProperty(t.prototype, "onRequestRedraw", {
                            get: function () {
                                return (new f.EventEmitter).event
                            }, enumerable: !1, configurable: !0
                        }), t.prototype.dispose = function () {
                            this._element.classList.remove(p + this._terminalClass), d.removeElementFromParent(this._rowContainer, this._selectionContainer, this._themeStyleElement, this._dimensionsStyleElement), e.prototype.dispose.call(this)
                        }, t.prototype._updateDimensions = function () {
                            this.dimensions.scaledCharWidth = this._charSizeService.width * window.devicePixelRatio, this.dimensions.scaledCharHeight = Math.ceil(this._charSizeService.height * window.devicePixelRatio), this.dimensions.scaledCellWidth = this.dimensions.scaledCharWidth + Math.round(this._optionsService.options.letterSpacing), this.dimensions.scaledCellHeight = Math.floor(this.dimensions.scaledCharHeight * this._optionsService.options.lineHeight), this.dimensions.scaledCharLeft = 0, this.dimensions.scaledCharTop = 0, this.dimensions.scaledCanvasWidth = this.dimensions.scaledCellWidth * this._bufferService.cols, this.dimensions.scaledCanvasHeight = this.dimensions.scaledCellHeight * this._bufferService.rows, this.dimensions.canvasWidth = Math.round(this.dimensions.scaledCanvasWidth / window.devicePixelRatio), this.dimensions.canvasHeight = Math.round(this.dimensions.scaledCanvasHeight / window.devicePixelRatio), this.dimensions.actualCellWidth = this.dimensions.canvasWidth / this._bufferService.cols, this.dimensions.actualCellHeight = this.dimensions.canvasHeight / this._bufferService.rows;
                            for (var e = 0, t = this._rowElements; e < t.length; e++) {
                                var r = t[e];
                                r.style.width = this.dimensions.canvasWidth + "px", r.style.height = this.dimensions.actualCellHeight + "px", r.style.lineHeight = this.dimensions.actualCellHeight + "px", r.style.overflow = "hidden"
                            }
                            this._dimensionsStyleElement || (this._dimensionsStyleElement = document.createElement("style"), this._screenElement.appendChild(this._dimensionsStyleElement));
                            var i = this._terminalSelector + " .xterm-rows span { display: inline-block; height: 100%; vertical-align: top; width: " + this.dimensions.actualCellWidth + "px}";
                            this._dimensionsStyleElement.textContent = i, this._selectionContainer.style.height = this._viewportElement.style.height, this._screenElement.style.width = this.dimensions.canvasWidth + "px", this._screenElement.style.height = this.dimensions.canvasHeight + "px"
                        }, t.prototype.setColors = function (e) {
                            this._colors = e, this._injectCss()
                        }, t.prototype._injectCss = function () {
                            var e = this;
                            this._themeStyleElement || (this._themeStyleElement = document.createElement("style"), this._screenElement.appendChild(this._themeStyleElement));
                            var t = this._terminalSelector + " .xterm-rows { color: " + this._colors.foreground.css + "; font-family: " + this._optionsService.options.fontFamily + "; font-size: " + this._optionsService.options.fontSize + "px;}";
                            t += this._terminalSelector + " span:not(." + a.BOLD_CLASS + ") { font-weight: " + this._optionsService.options.fontWeight + ";}" + this._terminalSelector + " span." + a.BOLD_CLASS + " { font-weight: " + this._optionsService.options.fontWeightBold + ";}" + this._terminalSelector + " span." + a.ITALIC_CLASS + " { font-style: italic;}", t += "@keyframes blink_box_shadow_" + this._terminalClass + " { 50% {  box-shadow: none; }}", t += "@keyframes blink_block_" + this._terminalClass + " { 0% {  background-color: " + this._colors.cursor.css + ";  color: " + this._colors.cursorAccent.css + "; } 50% {  background-color: " + this._colors.cursorAccent.css + ";  color: " + this._colors.cursor.css + "; }}", t += this._terminalSelector + " .xterm-rows:not(.xterm-focus) ." + a.CURSOR_CLASS + "." + a.CURSOR_STYLE_BLOCK_CLASS + " { outline: 1px solid " + this._colors.cursor.css + "; outline-offset: -1px;}" + this._terminalSelector + " .xterm-rows.xterm-focus ." + a.CURSOR_CLASS + "." + a.CURSOR_BLINK_CLASS + ":not(." + a.CURSOR_STYLE_BLOCK_CLASS + ") { animation: blink_box_shadow_" + this._terminalClass + " 1s step-end infinite;}" + this._terminalSelector + " .xterm-rows.xterm-focus ." + a.CURSOR_CLASS + "." + a.CURSOR_BLINK_CLASS + "." + a.CURSOR_STYLE_BLOCK_CLASS + " { animation: blink_block_" + this._terminalClass + " 1s step-end infinite;}" + this._terminalSelector + " .xterm-rows.xterm-focus ." + a.CURSOR_CLASS + "." + a.CURSOR_STYLE_BLOCK_CLASS + " { background-color: " + this._colors.cursor.css + "; color: " + this._colors.cursorAccent.css + ";}" + this._terminalSelector + " .xterm-rows ." + a.CURSOR_CLASS + "." + a.CURSOR_STYLE_BAR_CLASS + " { box-shadow: " + this._optionsService.options.cursorWidth + "px 0 0 " + this._colors.cursor.css + " inset;}" + this._terminalSelector + " .xterm-rows ." + a.CURSOR_CLASS + "." + a.CURSOR_STYLE_UNDERLINE_CLASS + " { box-shadow: 0 -1px 0 " + this._colors.cursor.css + " inset;}", t += this._terminalSelector + " .xterm-selection { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}" + this._terminalSelector + " .xterm-selection div { position: absolute; background-color: " + this._colors.selectionTransparent.css + ";}", this._colors.ansi.forEach((function (r, i) {
                                t += e._terminalSelector + " ." + v + i + " { color: " + r.css + "; }" + e._terminalSelector + " ." + g + i + " { background-color: " + r.css + "; }"
                            })), t += this._terminalSelector + " ." + v + c.INVERTED_DEFAULT_COLOR + " { color: " + _.color.opaque(this._colors.background).css + "; }" + this._terminalSelector + " ." + g + c.INVERTED_DEFAULT_COLOR + " { background-color: " + this._colors.foreground.css + "; }", this._themeStyleElement.textContent = t
                        }, t.prototype.onDevicePixelRatioChange = function () {
                            this._updateDimensions()
                        }, t.prototype._refreshRowElements = function (e, t) {
                            for (var r = this._rowElements.length; r <= t; r++) {
                                var i = document.createElement("div");
                                this._rowContainer.appendChild(i), this._rowElements.push(i)
                            }
                            for (; this._rowElements.length > t;) this._rowContainer.removeChild(this._rowElements.pop())
                        }, t.prototype.onResize = function (e, t) {
                            this._refreshRowElements(e, t), this._updateDimensions()
                        }, t.prototype.onCharSizeChanged = function () {
                            this._updateDimensions()
                        }, t.prototype.onBlur = function () {
                            this._rowContainer.classList.remove(y)
                        }, t.prototype.onFocus = function () {
                            this._rowContainer.classList.add(y)
                        }, t.prototype.onSelectionChanged = function (e, t, r) {
                            for (; this._selectionContainer.children.length;) this._selectionContainer.removeChild(this._selectionContainer.children[0]);
                            if (e && t) {
                                var i = e[1] - this._bufferService.buffer.ydisp,
                                    n = t[1] - this._bufferService.buffer.ydisp, o = Math.max(i, 0),
                                    s = Math.min(n, this._bufferService.rows - 1);
                                if (!(o >= this._bufferService.rows || s < 0)) {
                                    var a = document.createDocumentFragment();
                                    if (r) a.appendChild(this._createSelectionElement(o, e[0], t[0], s - o + 1)); else {
                                        var c = i === o ? e[0] : 0, l = o === n ? t[0] : this._bufferService.cols;
                                        a.appendChild(this._createSelectionElement(o, c, l));
                                        var h = s - o - 1;
                                        if (a.appendChild(this._createSelectionElement(o + 1, 0, this._bufferService.cols, h)), o !== s) {
                                            var u = n === s ? t[0] : this._bufferService.cols;
                                            a.appendChild(this._createSelectionElement(s, 0, u))
                                        }
                                    }
                                    this._selectionContainer.appendChild(a)
                                }
                            }
                        }, t.prototype._createSelectionElement = function (e, t, r, i) {
                            void 0 === i && (i = 1);
                            var n = document.createElement("div");
                            return n.style.height = i * this.dimensions.actualCellHeight + "px", n.style.top = e * this.dimensions.actualCellHeight + "px", n.style.left = t * this.dimensions.actualCellWidth + "px", n.style.width = this.dimensions.actualCellWidth * (r - t) + "px", n
                        }, t.prototype.onCursorMove = function () {
                        }, t.prototype.onOptionsChanged = function () {
                            this._updateDimensions(), this._injectCss()
                        }, t.prototype.clear = function () {
                            for (var e = 0, t = this._rowElements; e < t.length; e++) t[e].innerText = ""
                        }, t.prototype.renderRows = function (e, t) {
                            for (var r = this._bufferService.buffer.ybase + this._bufferService.buffer.y, i = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1), n = this._optionsService.options.cursorBlink, o = e; o <= t; o++) {
                                var s = this._rowElements[o];
                                s.innerText = "";
                                var a = o + this._bufferService.buffer.ydisp, c = this._bufferService.buffer.lines.get(a),
                                    l = this._optionsService.options.cursorStyle;
                                s.appendChild(this._rowFactory.createRow(c, a, a === r, l, i, n, this.dimensions.actualCellWidth, this._bufferService.cols))
                            }
                        }, Object.defineProperty(t.prototype, "_terminalSelector", {
                            get: function () {
                                return "." + p + this._terminalClass
                            }, enumerable: !1, configurable: !0
                        }), t.prototype._onLinkHover = function (e) {
                            this._setCellUnderline(e.x1, e.x2, e.y1, e.y2, e.cols, !0)
                        }, t.prototype._onLinkLeave = function (e) {
                            this._setCellUnderline(e.x1, e.x2, e.y1, e.y2, e.cols, !1)
                        }, t.prototype._setCellUnderline = function (e, t, r, i, n, o) {
                            for (; e !== t || r !== i;) {
                                var s = this._rowElements[r];
                                if (!s) return;
                                var a = s.children[e];
                                a && (a.style.textDecoration = o ? "underline" : "none"), ++e >= n && (e = 0, r++)
                            }
                        }, o([s(6, u.IInstantiationService), s(7, h.ICharSizeService), s(8, u.IOptionsService), s(9, u.IBufferService)], t)
                    }(l.Disposable);
                t.DomRenderer = S
            }, 3787: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.DomRendererRowFactory = t.CURSOR_STYLE_UNDERLINE_CLASS = t.CURSOR_STYLE_BAR_CLASS = t.CURSOR_STYLE_BLOCK_CLASS = t.CURSOR_BLINK_CLASS = t.CURSOR_CLASS = t.UNDERLINE_CLASS = t.ITALIC_CLASS = t.DIM_CLASS = t.BOLD_CLASS = void 0;
                var o = r(8803), s = r(643), a = r(511), c = r(2585), l = r(4774), h = r(4725), u = r(4269);
                t.BOLD_CLASS = "xterm-bold", t.DIM_CLASS = "xterm-dim", t.ITALIC_CLASS = "xterm-italic", t.UNDERLINE_CLASS = "xterm-underline", t.CURSOR_CLASS = "xterm-cursor", t.CURSOR_BLINK_CLASS = "xterm-cursor-blink", t.CURSOR_STYLE_BLOCK_CLASS = "xterm-cursor-block", t.CURSOR_STYLE_BAR_CLASS = "xterm-cursor-bar", t.CURSOR_STYLE_UNDERLINE_CLASS = "xterm-cursor-underline";
                var f = function () {
                    function e(e, t, r, i) {
                        this._document = e, this._colors = t, this._characterJoinerService = r, this._optionsService = i, this._workCell = new a.CellData
                    }

                    return e.prototype.setColors = function (e) {
                        this._colors = e
                    }, e.prototype.createRow = function (e, r, i, n, a, c, h, f) {
                        for (var d = this._document.createDocumentFragment(), p = this._characterJoinerService.getJoinedCharacters(r), v = 0, g = Math.min(e.length, f) - 1; g >= 0; g--) if (e.loadCell(g, this._workCell).getCode() !== s.NULL_CELL_CODE || i && g === a) {
                            v = g + 1;
                            break
                        }
                        for (g = 0; g < v; g++) {
                            e.loadCell(g, this._workCell);
                            var y = this._workCell.getWidth();
                            if (0 !== y) {
                                var b = !1, S = g, m = this._workCell;
                                if (p.length > 0 && g === p[0][0]) {
                                    b = !0;
                                    var C = p.shift();
                                    m = new u.JoinedCellData(this._workCell, e.translateToString(!0, C[0], C[1]), C[1] - C[0]), S = C[1] - 1, y = m.getWidth()
                                }
                                var w = this._document.createElement("span");
                                if (y > 1 && (w.style.width = h * y + "px"), b && (w.style.display = "inline", a >= g && a <= S && (a = g)), i && g === a) switch (w.classList.add(t.CURSOR_CLASS), c && w.classList.add(t.CURSOR_BLINK_CLASS), n) {
                                    case"bar":
                                        w.classList.add(t.CURSOR_STYLE_BAR_CLASS);
                                        break;
                                    case"underline":
                                        w.classList.add(t.CURSOR_STYLE_UNDERLINE_CLASS);
                                        break;
                                    default:
                                        w.classList.add(t.CURSOR_STYLE_BLOCK_CLASS)
                                }
                                m.isBold() && w.classList.add(t.BOLD_CLASS), m.isItalic() && w.classList.add(t.ITALIC_CLASS), m.isDim() && w.classList.add(t.DIM_CLASS), m.isUnderline() && w.classList.add(t.UNDERLINE_CLASS), m.isInvisible() ? w.textContent = s.WHITESPACE_CELL_CHAR : w.textContent = m.getChars() || s.WHITESPACE_CELL_CHAR;
                                var E = m.getFgColor(), L = m.getFgColorMode(), k = m.getBgColor(),
                                    A = m.getBgColorMode(), R = !!m.isInverse();
                                if (R) {
                                    var x = E;
                                    E = k, k = x;
                                    var T = L;
                                    L = A, A = T
                                }
                                switch (L) {
                                    case 16777216:
                                    case 33554432:
                                        m.isBold() && E < 8 && this._optionsService.options.drawBoldTextInBrightColors && (E += 8), this._applyMinimumContrast(w, this._colors.background, this._colors.ansi[E]) || w.classList.add("xterm-fg-" + E);
                                        break;
                                    case 50331648:
                                        var O = l.rgba.toColor(E >> 16 & 255, E >> 8 & 255, 255 & E);
                                        this._applyMinimumContrast(w, this._colors.background, O) || this._addStyle(w, "color:#" + _(E.toString(16), "0", 6));
                                        break;
                                    case 0:
                                    default:
                                        this._applyMinimumContrast(w, this._colors.background, this._colors.foreground) || R && w.classList.add("xterm-fg-" + o.INVERTED_DEFAULT_COLOR)
                                }
                                switch (A) {
                                    case 16777216:
                                    case 33554432:
                                        w.classList.add("xterm-bg-" + k);
                                        break;
                                    case 50331648:
                                        this._addStyle(w, "background-color:#" + _(k.toString(16), "0", 6));
                                        break;
                                    case 0:
                                    default:
                                        R && w.classList.add("xterm-bg-" + o.INVERTED_DEFAULT_COLOR)
                                }
                                d.appendChild(w), g = S
                            }
                        }
                        return d
                    }, e.prototype._applyMinimumContrast = function (e, t, r) {
                        if (1 === this._optionsService.options.minimumContrastRatio) return !1;
                        var i = this._colors.contrastCache.getColor(this._workCell.bg, this._workCell.fg);
                        return void 0 === i && (i = l.color.ensureContrastRatio(t, r, this._optionsService.options.minimumContrastRatio), this._colors.contrastCache.setColor(this._workCell.bg, this._workCell.fg, null != i ? i : null)), !!i && (this._addStyle(e, "color:" + i.css), !0)
                    }, e.prototype._addStyle = function (e, t) {
                        e.setAttribute("style", "" + (e.getAttribute("style") || "") + t + ";")
                    }, i([n(2, h.ICharacterJoinerService), n(3, c.IOptionsService)], e)
                }();

                function _(e, t, r) {
                    for (; e.length < r;) e = t + e;
                    return e
                }

                t.DomRendererRowFactory = f
            }, 456: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.SelectionModel = void 0;
                var r = function () {
                    function e(e) {
                        this._bufferService = e, this.isSelectAllActive = !1, this.selectionStartLength = 0
                    }

                    return e.prototype.clearSelection = function () {
                        this.selectionStart = void 0, this.selectionEnd = void 0, this.isSelectAllActive = !1, this.selectionStartLength = 0
                    }, Object.defineProperty(e.prototype, "finalSelectionStart", {
                        get: function () {
                            return this.isSelectAllActive ? [0, 0] : this.selectionEnd && this.selectionStart && this.areSelectionValuesReversed() ? this.selectionEnd : this.selectionStart
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "finalSelectionEnd", {
                        get: function () {
                            if (this.isSelectAllActive) return [this._bufferService.cols, this._bufferService.buffer.ybase + this._bufferService.rows - 1];
                            if (this.selectionStart) {
                                if (!this.selectionEnd || this.areSelectionValuesReversed()) {
                                    var e = this.selectionStart[0] + this.selectionStartLength;
                                    return e > this._bufferService.cols ? [e % this._bufferService.cols, this.selectionStart[1] + Math.floor(e / this._bufferService.cols)] : [e, this.selectionStart[1]]
                                }
                                return this.selectionStartLength && this.selectionEnd[1] === this.selectionStart[1] ? [Math.max(this.selectionStart[0] + this.selectionStartLength, this.selectionEnd[0]), this.selectionEnd[1]] : this.selectionEnd
                            }
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.areSelectionValuesReversed = function () {
                        var e = this.selectionStart, t = this.selectionEnd;
                        return !(!e || !t) && (e[1] > t[1] || e[1] === t[1] && e[0] > t[0])
                    }, e.prototype.onTrim = function (e) {
                        return this.selectionStart && (this.selectionStart[1] -= e), this.selectionEnd && (this.selectionEnd[1] -= e), this.selectionEnd && this.selectionEnd[1] < 0 ? (this.clearSelection(), !0) : (this.selectionStart && this.selectionStart[1] < 0 && (this.selectionStart[1] = 0), !1)
                    }, e
                }();
                t.SelectionModel = r
            }, 428: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.CharSizeService = void 0;
                var o = r(2585), s = r(8460), a = function () {
                    function e(e, t, r) {
                        this._optionsService = r, this.width = 0, this.height = 0, this._onCharSizeChange = new s.EventEmitter, this._measureStrategy = new c(e, t, this._optionsService)
                    }

                    return Object.defineProperty(e.prototype, "hasValidSize", {
                        get: function () {
                            return this.width > 0 && this.height > 0
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "onCharSizeChange", {
                        get: function () {
                            return this._onCharSizeChange.event
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.measure = function () {
                        var e = this._measureStrategy.measure();
                        e.width === this.width && e.height === this.height || (this.width = e.width, this.height = e.height, this._onCharSizeChange.fire())
                    }, i([n(2, o.IOptionsService)], e)
                }();
                t.CharSizeService = a;
                var c = function () {
                    function e(e, t, r) {
                        this._document = e, this._parentElement = t, this._optionsService = r, this._result = {
                            width: 0,
                            height: 0
                        }, this._measureElement = this._document.createElement("span"), this._measureElement.classList.add("xterm-char-measure-element"), this._measureElement.textContent = "W", this._measureElement.setAttribute("aria-hidden", "true"), this._parentElement.appendChild(this._measureElement)
                    }

                    return e.prototype.measure = function () {
                        this._measureElement.style.fontFamily = this._optionsService.options.fontFamily, this._measureElement.style.fontSize = this._optionsService.options.fontSize + "px";
                        var e = this._measureElement.getBoundingClientRect();
                        return 0 !== e.width && 0 !== e.height && (this._result.width = e.width, this._result.height = Math.ceil(e.height)), this._result
                    }, e
                }()
            }, 4269: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.CharacterJoinerService = t.JoinedCellData = void 0;
                var a = r(3734), c = r(643), l = r(511), h = r(2585), u = function (e) {
                    function t(t, r, i) {
                        var n = e.call(this) || this;
                        return n.content = 0, n.combinedData = "", n.fg = t.fg, n.bg = t.bg, n.combinedData = r, n._width = i, n
                    }

                    return n(t, e), t.prototype.isCombined = function () {
                        return 2097152
                    }, t.prototype.getWidth = function () {
                        return this._width
                    }, t.prototype.getChars = function () {
                        return this.combinedData
                    }, t.prototype.getCode = function () {
                        return 2097151
                    }, t.prototype.setFromCharData = function (e) {
                        throw new Error("not implemented")
                    }, t.prototype.getAsCharData = function () {
                        return [this.fg, this.getChars(), this.getWidth(), this.getCode()]
                    }, t
                }(a.AttributeData);
                t.JoinedCellData = u;
                var f = function () {
                    function e(e) {
                        this._bufferService = e, this._characterJoiners = [], this._nextCharacterJoinerId = 0, this._workCell = new l.CellData
                    }

                    return e.prototype.register = function (e) {
                        var t = {id: this._nextCharacterJoinerId++, handler: e};
                        return this._characterJoiners.push(t), t.id
                    }, e.prototype.deregister = function (e) {
                        for (var t = 0; t < this._characterJoiners.length; t++) if (this._characterJoiners[t].id === e) return this._characterJoiners.splice(t, 1), !0;
                        return !1
                    }, e.prototype.getJoinedCharacters = function (e) {
                        if (0 === this._characterJoiners.length) return [];
                        var t = this._bufferService.buffer.lines.get(e);
                        if (!t || 0 === t.length) return [];
                        for (var r = [], i = t.translateToString(!0), n = 0, o = 0, s = 0, a = t.getFg(0), l = t.getBg(0), h = 0; h < t.getTrimmedLength(); h++) if (t.loadCell(h, this._workCell), 0 !== this._workCell.getWidth()) {
                            if (this._workCell.fg !== a || this._workCell.bg !== l) {
                                if (h - n > 1) for (var u = this._getJoinedRanges(i, s, o, t, n), f = 0; f < u.length; f++) r.push(u[f]);
                                n = h, s = o, a = this._workCell.fg, l = this._workCell.bg
                            }
                            o += this._workCell.getChars().length || c.WHITESPACE_CELL_CHAR.length
                        }
                        if (this._bufferService.cols - n > 1) for (u = this._getJoinedRanges(i, s, o, t, n), f = 0; f < u.length; f++) r.push(u[f]);
                        return r
                    }, e.prototype._getJoinedRanges = function (t, r, i, n, o) {
                        for (var s = t.substring(r, i), a = this._characterJoiners[0].handler(s), c = 1; c < this._characterJoiners.length; c++) for (var l = this._characterJoiners[c].handler(s), h = 0; h < l.length; h++) e._mergeRanges(a, l[h]);
                        return this._stringRangesToCellRanges(a, n, o), a
                    }, e.prototype._stringRangesToCellRanges = function (e, t, r) {
                        var i = 0, n = !1, o = 0, s = e[i];
                        if (s) {
                            for (var a = r; a < this._bufferService.cols; a++) {
                                var l = t.getWidth(a), h = t.getString(a).length || c.WHITESPACE_CELL_CHAR.length;
                                if (0 !== l) {
                                    if (!n && s[0] <= o && (s[0] = a, n = !0), s[1] <= o) {
                                        if (s[1] = a, !(s = e[++i])) break;
                                        s[0] <= o ? (s[0] = a, n = !0) : n = !1
                                    }
                                    o += h
                                }
                            }
                            s && (s[1] = this._bufferService.cols)
                        }
                    }, e._mergeRanges = function (e, t) {
                        for (var r = !1, i = 0; i < e.length; i++) {
                            var n = e[i];
                            if (r) {
                                if (t[1] <= n[0]) return e[i - 1][1] = t[1], e;
                                if (t[1] <= n[1]) return e[i - 1][1] = Math.max(t[1], n[1]), e.splice(i, 1), e;
                                e.splice(i, 1), i--
                            } else {
                                if (t[1] <= n[0]) return e.splice(i, 0, t), e;
                                if (t[1] <= n[1]) return n[0] = Math.min(t[0], n[0]), e;
                                t[0] < n[1] && (n[0] = Math.min(t[0], n[0]), r = !0)
                            }
                        }
                        return r ? e[e.length - 1][1] = t[1] : e.push(t), e
                    }, e = o([s(0, h.IBufferService)], e)
                }();
                t.CharacterJoinerService = f
            }, 5114: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.CoreBrowserService = void 0;
                var r = function () {
                    function e(e) {
                        this._textarea = e
                    }

                    return Object.defineProperty(e.prototype, "isFocused", {
                        get: function () {
                            return (this._textarea.getRootNode ? this._textarea.getRootNode() : document).activeElement === this._textarea && document.hasFocus()
                        }, enumerable: !1, configurable: !0
                    }), e
                }();
                t.CoreBrowserService = r
            }, 8934: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.MouseService = void 0;
                var o = r(4725), s = r(9806), a = function () {
                    function e(e, t) {
                        this._renderService = e, this._charSizeService = t
                    }

                    return e.prototype.getCoords = function (e, t, r, i, n) {
                        return s.getCoords(e, t, r, i, this._charSizeService.hasValidSize, this._renderService.dimensions.actualCellWidth, this._renderService.dimensions.actualCellHeight, n)
                    }, e.prototype.getRawByteCoords = function (e, t, r, i) {
                        var n = this.getCoords(e, t, r, i);
                        return s.getRawByteCoords(n)
                    }, i([n(0, o.IRenderService), n(1, o.ICharSizeService)], e)
                }();
                t.MouseService = a
            }, 3230: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.RenderService = void 0;
                var a = r(6193), c = r(8460), l = r(844), h = r(5596), u = r(3656), f = r(2585), _ = r(4725),
                    d = function (e) {
                        function t(t, r, i, n, o, s) {
                            var l = e.call(this) || this;
                            if (l._renderer = t, l._rowCount = r, l._charSizeService = o, l._isPaused = !1, l._needsFullRefresh = !1, l._isNextRenderRedrawOnly = !0, l._needsSelectionRefresh = !1, l._canvasWidth = 0, l._canvasHeight = 0, l._selectionState = {
                                start: void 0,
                                end: void 0,
                                columnSelectMode: !1
                            }, l._onDimensionsChange = new c.EventEmitter, l._onRender = new c.EventEmitter, l._onRefreshRequest = new c.EventEmitter, l.register({
                                dispose: function () {
                                    return l._renderer.dispose()
                                }
                            }), l._renderDebouncer = new a.RenderDebouncer((function (e, t) {
                                return l._renderRows(e, t)
                            })), l.register(l._renderDebouncer), l._screenDprMonitor = new h.ScreenDprMonitor, l._screenDprMonitor.setListener((function () {
                                return l.onDevicePixelRatioChange()
                            })), l.register(l._screenDprMonitor), l.register(s.onResize((function (e) {
                                return l._fullRefresh()
                            }))), l.register(n.onOptionChange((function () {
                                return l._renderer.onOptionsChanged()
                            }))), l.register(l._charSizeService.onCharSizeChange((function () {
                                return l.onCharSizeChanged()
                            }))), l._renderer.onRequestRedraw((function (e) {
                                return l.refreshRows(e.start, e.end, !0)
                            })), l.register(u.addDisposableDomListener(window, "resize", (function () {
                                return l.onDevicePixelRatioChange()
                            }))), "IntersectionObserver" in window) {
                                var f = new IntersectionObserver((function (e) {
                                    return l._onIntersectionChange(e[e.length - 1])
                                }), {threshold: 0});
                                f.observe(i), l.register({
                                    dispose: function () {
                                        return f.disconnect()
                                    }
                                })
                            }
                            return l
                        }

                        return n(t, e), Object.defineProperty(t.prototype, "onDimensionsChange", {
                            get: function () {
                                return this._onDimensionsChange.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onRenderedBufferChange", {
                            get: function () {
                                return this._onRender.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onRefreshRequest", {
                            get: function () {
                                return this._onRefreshRequest.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "dimensions", {
                            get: function () {
                                return this._renderer.dimensions
                            }, enumerable: !1, configurable: !0
                        }), t.prototype._onIntersectionChange = function (e) {
                            this._isPaused = void 0 === e.isIntersecting ? 0 === e.intersectionRatio : !e.isIntersecting, this._isPaused || this._charSizeService.hasValidSize || this._charSizeService.measure(), !this._isPaused && this._needsFullRefresh && (this.refreshRows(0, this._rowCount - 1), this._needsFullRefresh = !1)
                        }, t.prototype.refreshRows = function (e, t, r) {
                            void 0 === r && (r = !1), this._isPaused ? this._needsFullRefresh = !0 : (r || (this._isNextRenderRedrawOnly = !1), this._renderDebouncer.refresh(e, t, this._rowCount))
                        }, t.prototype._renderRows = function (e, t) {
                            this._renderer.renderRows(e, t), this._needsSelectionRefresh && (this._renderer.onSelectionChanged(this._selectionState.start, this._selectionState.end, this._selectionState.columnSelectMode), this._needsSelectionRefresh = !1), this._isNextRenderRedrawOnly || this._onRender.fire({
                                start: e,
                                end: t
                            }), this._isNextRenderRedrawOnly = !0
                        }, t.prototype.resize = function (e, t) {
                            this._rowCount = t, this._fireOnCanvasResize()
                        }, t.prototype.changeOptions = function () {
                            this._renderer.onOptionsChanged(), this.refreshRows(0, this._rowCount - 1), this._fireOnCanvasResize()
                        }, t.prototype._fireOnCanvasResize = function () {
                            this._renderer.dimensions.canvasWidth === this._canvasWidth && this._renderer.dimensions.canvasHeight === this._canvasHeight || this._onDimensionsChange.fire(this._renderer.dimensions)
                        }, t.prototype.dispose = function () {
                            e.prototype.dispose.call(this)
                        }, t.prototype.setRenderer = function (e) {
                            var t = this;
                            this._renderer.dispose(), this._renderer = e, this._renderer.onRequestRedraw((function (e) {
                                return t.refreshRows(e.start, e.end, !0)
                            })), this._needsSelectionRefresh = !0, this._fullRefresh()
                        }, t.prototype._fullRefresh = function () {
                            this._isPaused ? this._needsFullRefresh = !0 : this.refreshRows(0, this._rowCount - 1)
                        }, t.prototype.setColors = function (e) {
                            this._renderer.setColors(e), this._fullRefresh()
                        }, t.prototype.onDevicePixelRatioChange = function () {
                            this._charSizeService.measure(), this._renderer.onDevicePixelRatioChange(), this.refreshRows(0, this._rowCount - 1)
                        }, t.prototype.onResize = function (e, t) {
                            this._renderer.onResize(e, t), this._fullRefresh()
                        }, t.prototype.onCharSizeChanged = function () {
                            this._renderer.onCharSizeChanged()
                        }, t.prototype.onBlur = function () {
                            this._renderer.onBlur()
                        }, t.prototype.onFocus = function () {
                            this._renderer.onFocus()
                        }, t.prototype.onSelectionChanged = function (e, t, r) {
                            this._selectionState.start = e, this._selectionState.end = t, this._selectionState.columnSelectMode = r, this._renderer.onSelectionChanged(e, t, r)
                        }, t.prototype.onCursorMove = function () {
                            this._renderer.onCursorMove()
                        }, t.prototype.clear = function () {
                            this._renderer.clear()
                        }, o([s(3, f.IOptionsService), s(4, _.ICharSizeService), s(5, f.IBufferService)], t)
                    }(l.Disposable);
                t.RenderService = d
            }, 9312: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.SelectionService = void 0;
                var a = r(6114), c = r(456), l = r(511), h = r(8460), u = r(4725), f = r(2585), _ = r(9806),
                    d = r(9504), p = r(844), v = r(4841), g = String.fromCharCode(160), y = new RegExp(g, "g"),
                    b = function (e) {
                        function t(t, r, i, n, o, s, a, u) {
                            var f = e.call(this) || this;
                            return f._element = t, f._screenElement = r, f._linkifier = i, f._bufferService = n, f._coreService = o, f._mouseService = s, f._optionsService = a, f._renderService = u, f._dragScrollAmount = 0, f._enabled = !0, f._workCell = new l.CellData, f._mouseDownTimeStamp = 0, f._oldHasSelection = !1, f._oldSelectionStart = void 0, f._oldSelectionEnd = void 0, f._onLinuxMouseSelection = f.register(new h.EventEmitter), f._onRedrawRequest = f.register(new h.EventEmitter), f._onSelectionChange = f.register(new h.EventEmitter), f._onRequestScrollLines = f.register(new h.EventEmitter), f._mouseMoveListener = function (e) {
                                return f._onMouseMove(e)
                            }, f._mouseUpListener = function (e) {
                                return f._onMouseUp(e)
                            }, f._coreService.onUserInput((function () {
                                f.hasSelection && f.clearSelection()
                            })), f._trimListener = f._bufferService.buffer.lines.onTrim((function (e) {
                                return f._onTrim(e)
                            })), f.register(f._bufferService.buffers.onBufferActivate((function (e) {
                                return f._onBufferActivate(e)
                            }))), f.enable(), f._model = new c.SelectionModel(f._bufferService), f._activeSelectionMode = 0, f
                        }

                        return n(t, e), Object.defineProperty(t.prototype, "onLinuxMouseSelection", {
                            get: function () {
                                return this._onLinuxMouseSelection.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onRequestRedraw", {
                            get: function () {
                                return this._onRedrawRequest.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onSelectionChange", {
                            get: function () {
                                return this._onSelectionChange.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onRequestScrollLines", {
                            get: function () {
                                return this._onRequestScrollLines.event
                            }, enumerable: !1, configurable: !0
                        }), t.prototype.dispose = function () {
                            this._removeMouseDownListeners()
                        }, t.prototype.reset = function () {
                            this.clearSelection()
                        }, t.prototype.disable = function () {
                            this.clearSelection(), this._enabled = !1
                        }, t.prototype.enable = function () {
                            this._enabled = !0
                        }, Object.defineProperty(t.prototype, "selectionStart", {
                            get: function () {
                                return this._model.finalSelectionStart
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "selectionEnd", {
                            get: function () {
                                return this._model.finalSelectionEnd
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "hasSelection", {
                            get: function () {
                                var e = this._model.finalSelectionStart, t = this._model.finalSelectionEnd;
                                return !(!e || !t || e[0] === t[0] && e[1] === t[1])
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "selectionText", {
                            get: function () {
                                var e = this._model.finalSelectionStart, t = this._model.finalSelectionEnd;
                                if (!e || !t) return "";
                                var r = this._bufferService.buffer, i = [];
                                if (3 === this._activeSelectionMode) {
                                    if (e[0] === t[0]) return "";
                                    for (var n = e[1]; n <= t[1]; n++) {
                                        var o = r.translateBufferLineToString(n, !0, e[0], t[0]);
                                        i.push(o)
                                    }
                                } else {
                                    var s = e[1] === t[1] ? t[0] : void 0;
                                    for (i.push(r.translateBufferLineToString(e[1], !0, e[0], s)), n = e[1] + 1; n <= t[1] - 1; n++) {
                                        var c = r.lines.get(n);
                                        o = r.translateBufferLineToString(n, !0), c && c.isWrapped ? i[i.length - 1] += o : i.push(o)
                                    }
                                    e[1] !== t[1] && (c = r.lines.get(t[1]), o = r.translateBufferLineToString(t[1], !0, 0, t[0]), c && c.isWrapped ? i[i.length - 1] += o : i.push(o))
                                }
                                return i.map((function (e) {
                                    return e.replace(y, " ")
                                })).join(a.isWindows ? "\r\n" : "\n")
                            }, enumerable: !1, configurable: !0
                        }), t.prototype.clearSelection = function () {
                            this._model.clearSelection(), this._removeMouseDownListeners(), this.refresh(), this._onSelectionChange.fire()
                        }, t.prototype.refresh = function (e) {
                            var t = this;
                            this._refreshAnimationFrame || (this._refreshAnimationFrame = window.requestAnimationFrame((function () {
                                return t._refresh()
                            }))), a.isLinux && e && this.selectionText.length && this._onLinuxMouseSelection.fire(this.selectionText)
                        }, t.prototype._refresh = function () {
                            this._refreshAnimationFrame = void 0, this._onRedrawRequest.fire({
                                start: this._model.finalSelectionStart,
                                end: this._model.finalSelectionEnd,
                                columnSelectMode: 3 === this._activeSelectionMode
                            })
                        }, t.prototype._isClickInSelection = function (e) {
                            var t = this._getMouseBufferCoords(e), r = this._model.finalSelectionStart,
                                i = this._model.finalSelectionEnd;
                            return !!(r && i && t) && this._areCoordsInSelection(t, r, i)
                        }, t.prototype._areCoordsInSelection = function (e, t, r) {
                            return e[1] > t[1] && e[1] < r[1] || t[1] === r[1] && e[1] === t[1] && e[0] >= t[0] && e[0] < r[0] || t[1] < r[1] && e[1] === r[1] && e[0] < r[0] || t[1] < r[1] && e[1] === t[1] && e[0] >= t[0]
                        }, t.prototype._selectWordAtCursor = function (e, t) {
                            var r, i,
                                n = null === (i = null === (r = this._linkifier.currentLink) || void 0 === r ? void 0 : r.link) || void 0 === i ? void 0 : i.range;
                            if (n) return this._model.selectionStart = [n.start.x - 1, n.start.y - 1], this._model.selectionStartLength = v.getRangeLength(n, this._bufferService.cols), this._model.selectionEnd = void 0, !0;
                            var o = this._getMouseBufferCoords(e);
                            return !!o && (this._selectWordAt(o, t), this._model.selectionEnd = void 0, !0)
                        }, t.prototype.selectAll = function () {
                            this._model.isSelectAllActive = !0, this.refresh(), this._onSelectionChange.fire()
                        }, t.prototype.selectLines = function (e, t) {
                            this._model.clearSelection(), e = Math.max(e, 0), t = Math.min(t, this._bufferService.buffer.lines.length - 1), this._model.selectionStart = [0, e], this._model.selectionEnd = [this._bufferService.cols, t], this.refresh(), this._onSelectionChange.fire()
                        }, t.prototype._onTrim = function (e) {
                            this._model.onTrim(e) && this.refresh()
                        }, t.prototype._getMouseBufferCoords = function (e) {
                            var t = this._mouseService.getCoords(e, this._screenElement, this._bufferService.cols, this._bufferService.rows, !0);
                            if (t) return t[0]--, t[1]--, t[1] += this._bufferService.buffer.ydisp, t
                        }, t.prototype._getMouseEventScrollAmount = function (e) {
                            var t = _.getCoordsRelativeToElement(e, this._screenElement)[1],
                                r = this._renderService.dimensions.canvasHeight;
                            return t >= 0 && t <= r ? 0 : (t > r && (t -= r), t = Math.min(Math.max(t, -50), 50), (t /= 50) / Math.abs(t) + Math.round(14 * t))
                        }, t.prototype.shouldForceSelection = function (e) {
                            return a.isMac ? e.altKey && this._optionsService.options.macOptionClickForcesSelection : e.shiftKey
                        }, t.prototype.onMouseDown = function (e) {
                            if (this._mouseDownTimeStamp = e.timeStamp, (2 !== e.button || !this.hasSelection) && 0 === e.button) {
                                if (!this._enabled) {
                                    if (!this.shouldForceSelection(e)) return;
                                    e.stopPropagation()
                                }
                                e.preventDefault(), this._dragScrollAmount = 0, this._enabled && e.shiftKey ? this._onIncrementalClick(e) : 1 === e.detail ? this._onSingleClick(e) : 2 === e.detail ? this._onDoubleClick(e) : 3 === e.detail && this._onTripleClick(e), this._addMouseDownListeners(), this.refresh(!0)
                            }
                        }, t.prototype._addMouseDownListeners = function () {
                            var e = this;
                            this._screenElement.ownerDocument && (this._screenElement.ownerDocument.addEventListener("mousemove", this._mouseMoveListener), this._screenElement.ownerDocument.addEventListener("mouseup", this._mouseUpListener)), this._dragScrollIntervalTimer = window.setInterval((function () {
                                return e._dragScroll()
                            }), 50)
                        }, t.prototype._removeMouseDownListeners = function () {
                            this._screenElement.ownerDocument && (this._screenElement.ownerDocument.removeEventListener("mousemove", this._mouseMoveListener), this._screenElement.ownerDocument.removeEventListener("mouseup", this._mouseUpListener)), clearInterval(this._dragScrollIntervalTimer), this._dragScrollIntervalTimer = void 0
                        }, t.prototype._onIncrementalClick = function (e) {
                            this._model.selectionStart && (this._model.selectionEnd = this._getMouseBufferCoords(e))
                        }, t.prototype._onSingleClick = function (e) {
                            if (this._model.selectionStartLength = 0, this._model.isSelectAllActive = !1, this._activeSelectionMode = this.shouldColumnSelect(e) ? 3 : 0, this._model.selectionStart = this._getMouseBufferCoords(e), this._model.selectionStart) {
                                this._model.selectionEnd = void 0;
                                var t = this._bufferService.buffer.lines.get(this._model.selectionStart[1]);
                                t && t.length !== this._model.selectionStart[0] && 0 === t.hasWidth(this._model.selectionStart[0]) && this._model.selectionStart[0]++
                            }
                        }, t.prototype._onDoubleClick = function (e) {
                            this._selectWordAtCursor(e, !0) && (this._activeSelectionMode = 1)
                        }, t.prototype._onTripleClick = function (e) {
                            var t = this._getMouseBufferCoords(e);
                            t && (this._activeSelectionMode = 2, this._selectLineAt(t[1]))
                        }, t.prototype.shouldColumnSelect = function (e) {
                            return e.altKey && !(a.isMac && this._optionsService.options.macOptionClickForcesSelection)
                        }, t.prototype._onMouseMove = function (e) {
                            if (e.stopImmediatePropagation(), this._model.selectionStart) {
                                var t = this._model.selectionEnd ? [this._model.selectionEnd[0], this._model.selectionEnd[1]] : null;
                                if (this._model.selectionEnd = this._getMouseBufferCoords(e), this._model.selectionEnd) {
                                    2 === this._activeSelectionMode ? this._model.selectionEnd[1] < this._model.selectionStart[1] ? this._model.selectionEnd[0] = 0 : this._model.selectionEnd[0] = this._bufferService.cols : 1 === this._activeSelectionMode && this._selectToWordAt(this._model.selectionEnd), this._dragScrollAmount = this._getMouseEventScrollAmount(e), 3 !== this._activeSelectionMode && (this._dragScrollAmount > 0 ? this._model.selectionEnd[0] = this._bufferService.cols : this._dragScrollAmount < 0 && (this._model.selectionEnd[0] = 0));
                                    var r = this._bufferService.buffer;
                                    if (this._model.selectionEnd[1] < r.lines.length) {
                                        var i = r.lines.get(this._model.selectionEnd[1]);
                                        i && 0 === i.hasWidth(this._model.selectionEnd[0]) && this._model.selectionEnd[0]++
                                    }
                                    t && t[0] === this._model.selectionEnd[0] && t[1] === this._model.selectionEnd[1] || this.refresh(!0)
                                } else this.refresh(!0)
                            }
                        }, t.prototype._dragScroll = function () {
                            if (this._model.selectionEnd && this._model.selectionStart && this._dragScrollAmount) {
                                this._onRequestScrollLines.fire({
                                    amount: this._dragScrollAmount,
                                    suppressScrollEvent: !1
                                });
                                var e = this._bufferService.buffer;
                                this._dragScrollAmount > 0 ? (3 !== this._activeSelectionMode && (this._model.selectionEnd[0] = this._bufferService.cols), this._model.selectionEnd[1] = Math.min(e.ydisp + this._bufferService.rows, e.lines.length - 1)) : (3 !== this._activeSelectionMode && (this._model.selectionEnd[0] = 0), this._model.selectionEnd[1] = e.ydisp), this.refresh()
                            }
                        }, t.prototype._onMouseUp = function (e) {
                            var t = e.timeStamp - this._mouseDownTimeStamp;
                            if (this._removeMouseDownListeners(), this.selectionText.length <= 1 && t < 500 && e.altKey && this._optionsService.getOption("altClickMovesCursor")) {
                                if (this._bufferService.buffer.ybase === this._bufferService.buffer.ydisp) {
                                    var r = this._mouseService.getCoords(e, this._element, this._bufferService.cols, this._bufferService.rows, !1);
                                    if (r && void 0 !== r[0] && void 0 !== r[1]) {
                                        var i = d.moveToCellSequence(r[0] - 1, r[1] - 1, this._bufferService, this._coreService.decPrivateModes.applicationCursorKeys);
                                        this._coreService.triggerDataEvent(i, !0)
                                    }
                                }
                            } else this._fireEventIfSelectionChanged()
                        }, t.prototype._fireEventIfSelectionChanged = function () {
                            var e = this._model.finalSelectionStart, t = this._model.finalSelectionEnd,
                                r = !(!e || !t || e[0] === t[0] && e[1] === t[1]);
                            r ? e && t && (this._oldSelectionStart && this._oldSelectionEnd && e[0] === this._oldSelectionStart[0] && e[1] === this._oldSelectionStart[1] && t[0] === this._oldSelectionEnd[0] && t[1] === this._oldSelectionEnd[1] || this._fireOnSelectionChange(e, t, r)) : this._oldHasSelection && this._fireOnSelectionChange(e, t, r)
                        }, t.prototype._fireOnSelectionChange = function (e, t, r) {
                            this._oldSelectionStart = e, this._oldSelectionEnd = t, this._oldHasSelection = r, this._onSelectionChange.fire()
                        }, t.prototype._onBufferActivate = function (e) {
                            var t = this;
                            this.clearSelection(), this._trimListener.dispose(), this._trimListener = e.activeBuffer.lines.onTrim((function (e) {
                                return t._onTrim(e)
                            }))
                        }, t.prototype._convertViewportColToCharacterIndex = function (e, t) {
                            for (var r = t[0], i = 0; t[0] >= i; i++) {
                                var n = e.loadCell(i, this._workCell).getChars().length;
                                0 === this._workCell.getWidth() ? r-- : n > 1 && t[0] !== i && (r += n - 1)
                            }
                            return r
                        }, t.prototype.setSelection = function (e, t, r) {
                            this._model.clearSelection(), this._removeMouseDownListeners(), this._model.selectionStart = [e, t], this._model.selectionStartLength = r, this.refresh()
                        }, t.prototype.rightClickSelect = function (e) {
                            this._isClickInSelection(e) || (this._selectWordAtCursor(e, !1) && this.refresh(!0), this._fireEventIfSelectionChanged())
                        }, t.prototype._getWordAt = function (e, t, r, i) {
                            if (void 0 === r && (r = !0), void 0 === i && (i = !0), !(e[0] >= this._bufferService.cols)) {
                                var n = this._bufferService.buffer, o = n.lines.get(e[1]);
                                if (o) {
                                    var s = n.translateBufferLineToString(e[1], !1),
                                        a = this._convertViewportColToCharacterIndex(o, e), c = a, l = e[0] - a, h = 0,
                                        u = 0, f = 0, _ = 0;
                                    if (" " === s.charAt(a)) {
                                        for (; a > 0 && " " === s.charAt(a - 1);) a--;
                                        for (; c < s.length && " " === s.charAt(c + 1);) c++
                                    } else {
                                        var d = e[0], p = e[0];
                                        0 === o.getWidth(d) && (h++, d--), 2 === o.getWidth(p) && (u++, p++);
                                        var v = o.getString(p).length;
                                        for (v > 1 && (_ += v - 1, c += v - 1); d > 0 && a > 0 && !this._isCharWordSeparator(o.loadCell(d - 1, this._workCell));) {
                                            o.loadCell(d - 1, this._workCell);
                                            var g = this._workCell.getChars().length;
                                            0 === this._workCell.getWidth() ? (h++, d--) : g > 1 && (f += g - 1, a -= g - 1), a--, d--
                                        }
                                        for (; p < o.length && c + 1 < s.length && !this._isCharWordSeparator(o.loadCell(p + 1, this._workCell));) {
                                            o.loadCell(p + 1, this._workCell);
                                            var y = this._workCell.getChars().length;
                                            2 === this._workCell.getWidth() ? (u++, p++) : y > 1 && (_ += y - 1, c += y - 1), c++, p++
                                        }
                                    }
                                    c++;
                                    var b = a + l - h + f,
                                        S = Math.min(this._bufferService.cols, c - a + h + u - f - _);
                                    if (t || "" !== s.slice(a, c).trim()) {
                                        if (r && 0 === b && 32 !== o.getCodePoint(0)) {
                                            var m = n.lines.get(e[1] - 1);
                                            if (m && o.isWrapped && 32 !== m.getCodePoint(this._bufferService.cols - 1)) {
                                                var C = this._getWordAt([this._bufferService.cols - 1, e[1] - 1], !1, !0, !1);
                                                if (C) {
                                                    var w = this._bufferService.cols - C.start;
                                                    b -= w, S += w
                                                }
                                            }
                                        }
                                        if (i && b + S === this._bufferService.cols && 32 !== o.getCodePoint(this._bufferService.cols - 1)) {
                                            var E = n.lines.get(e[1] + 1);
                                            if (E && E.isWrapped && 32 !== E.getCodePoint(0)) {
                                                var L = this._getWordAt([0, e[1] + 1], !1, !1, !0);
                                                L && (S += L.length)
                                            }
                                        }
                                        return {start: b, length: S}
                                    }
                                }
                            }
                        }, t.prototype._selectWordAt = function (e, t) {
                            var r = this._getWordAt(e, t);
                            if (r) {
                                for (; r.start < 0;) r.start += this._bufferService.cols, e[1]--;
                                this._model.selectionStart = [r.start, e[1]], this._model.selectionStartLength = r.length
                            }
                        }, t.prototype._selectToWordAt = function (e) {
                            var t = this._getWordAt(e, !0);
                            if (t) {
                                for (var r = e[1]; t.start < 0;) t.start += this._bufferService.cols, r--;
                                if (!this._model.areSelectionValuesReversed()) for (; t.start + t.length > this._bufferService.cols;) t.length -= this._bufferService.cols, r++;
                                this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? t.start : t.start + t.length, r]
                            }
                        }, t.prototype._isCharWordSeparator = function (e) {
                            return 0 !== e.getWidth() && this._optionsService.options.wordSeparator.indexOf(e.getChars()) >= 0
                        }, t.prototype._selectLineAt = function (e) {
                            var t = this._bufferService.buffer.getWrappedRangeForLine(e);
                            this._model.selectionStart = [0, t.first], this._model.selectionEnd = [this._bufferService.cols, t.last], this._model.selectionStartLength = 0
                        }, o([s(3, f.IBufferService), s(4, f.ICoreService), s(5, u.IMouseService), s(6, f.IOptionsService), s(7, u.IRenderService)], t)
                    }(p.Disposable);
                t.SelectionService = b
            }, 4725: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.ICharacterJoinerService = t.ISoundService = t.ISelectionService = t.IRenderService = t.IMouseService = t.ICoreBrowserService = t.ICharSizeService = void 0;
                var i = r(8343);
                t.ICharSizeService = i.createDecorator("CharSizeService"), t.ICoreBrowserService = i.createDecorator("CoreBrowserService"), t.IMouseService = i.createDecorator("MouseService"), t.IRenderService = i.createDecorator("RenderService"), t.ISelectionService = i.createDecorator("SelectionService"), t.ISoundService = i.createDecorator("SoundService"), t.ICharacterJoinerService = i.createDecorator("CharacterJoinerService")
            }, 357: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.SoundService = void 0;
                var o = r(2585), s = function () {
                    function e(e) {
                        this._optionsService = e
                    }

                    return Object.defineProperty(e, "audioContext", {
                        get: function () {
                            if (!e._audioContext) {
                                var t = window.AudioContext || window.webkitAudioContext;
                                if (!t) return console.warn("Web Audio API is not supported by this browser. Consider upgrading to the latest version"), null;
                                e._audioContext = new t
                            }
                            return e._audioContext
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.playBellSound = function () {
                        var t = e.audioContext;
                        if (t) {
                            var r = t.createBufferSource();
                            t.decodeAudioData(this._base64ToArrayBuffer(this._removeMimeType(this._optionsService.options.bellSound)), (function (e) {
                                r.buffer = e, r.connect(t.destination), r.start(0)
                            }))
                        }
                    }, e.prototype._base64ToArrayBuffer = function (e) {
                        for (var t = window.atob(e), r = t.length, i = new Uint8Array(r), n = 0; n < r; n++) i[n] = t.charCodeAt(n);
                        return i.buffer
                    }, e.prototype._removeMimeType = function (e) {
                        return e.split(",")[1]
                    }, e = i([n(0, o.IOptionsService)], e)
                }();
                t.SoundService = s
            }, 6349: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.CircularList = void 0;
                var i = r(8460), n = function () {
                    function e(e) {
                        this._maxLength = e, this.onDeleteEmitter = new i.EventEmitter, this.onInsertEmitter = new i.EventEmitter, this.onTrimEmitter = new i.EventEmitter, this._array = new Array(this._maxLength), this._startIndex = 0, this._length = 0
                    }

                    return Object.defineProperty(e.prototype, "onDelete", {
                        get: function () {
                            return this.onDeleteEmitter.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "onInsert", {
                        get: function () {
                            return this.onInsertEmitter.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "onTrim", {
                        get: function () {
                            return this.onTrimEmitter.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "maxLength", {
                        get: function () {
                            return this._maxLength
                        }, set: function (e) {
                            if (this._maxLength !== e) {
                                for (var t = new Array(e), r = 0; r < Math.min(e, this.length); r++) t[r] = this._array[this._getCyclicIndex(r)];
                                this._array = t, this._maxLength = e, this._startIndex = 0
                            }
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "length", {
                        get: function () {
                            return this._length
                        }, set: function (e) {
                            if (e > this._length) for (var t = this._length; t < e; t++) this._array[t] = void 0;
                            this._length = e
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.get = function (e) {
                        return this._array[this._getCyclicIndex(e)]
                    }, e.prototype.set = function (e, t) {
                        this._array[this._getCyclicIndex(e)] = t
                    }, e.prototype.push = function (e) {
                        this._array[this._getCyclicIndex(this._length)] = e, this._length === this._maxLength ? (this._startIndex = ++this._startIndex % this._maxLength, this.onTrimEmitter.fire(1)) : this._length++
                    }, e.prototype.recycle = function () {
                        if (this._length !== this._maxLength) throw new Error("Can only recycle when the buffer is full");
                        return this._startIndex = ++this._startIndex % this._maxLength, this.onTrimEmitter.fire(1), this._array[this._getCyclicIndex(this._length - 1)]
                    }, Object.defineProperty(e.prototype, "isFull", {
                        get: function () {
                            return this._length === this._maxLength
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.pop = function () {
                        return this._array[this._getCyclicIndex(this._length-- - 1)]
                    }, e.prototype.splice = function (e, t) {
                        for (var r = [], i = 2; i < arguments.length; i++) r[i - 2] = arguments[i];
                        if (t) {
                            for (var n = e; n < this._length - t; n++) this._array[this._getCyclicIndex(n)] = this._array[this._getCyclicIndex(n + t)];
                            this._length -= t, this.onDeleteEmitter.fire({index: e, amount: t})
                        }
                        for (n = this._length - 1; n >= e; n--) this._array[this._getCyclicIndex(n + r.length)] = this._array[this._getCyclicIndex(n)];
                        for (n = 0; n < r.length; n++) this._array[this._getCyclicIndex(e + n)] = r[n];
                        if (r.length && this.onInsertEmitter.fire({
                            index: e,
                            amount: r.length
                        }), this._length + r.length > this._maxLength) {
                            var o = this._length + r.length - this._maxLength;
                            this._startIndex += o, this._length = this._maxLength, this.onTrimEmitter.fire(o)
                        } else this._length += r.length
                    }, e.prototype.trimStart = function (e) {
                        e > this._length && (e = this._length), this._startIndex += e, this._length -= e, this.onTrimEmitter.fire(e)
                    }, e.prototype.shiftElements = function (e, t, r) {
                        if (!(t <= 0)) {
                            if (e < 0 || e >= this._length) throw new Error("start argument out of range");
                            if (e + r < 0) throw new Error("Cannot shift elements in list beyond index 0");
                            if (r > 0) {
                                for (var i = t - 1; i >= 0; i--) this.set(e + i + r, this.get(e + i));
                                var n = e + t + r - this._length;
                                if (n > 0) for (this._length += n; this._length > this._maxLength;) this._length--, this._startIndex++, this.onTrimEmitter.fire(1)
                            } else for (i = 0; i < t; i++) this.set(e + i + r, this.get(e + i))
                        }
                    }, e.prototype._getCyclicIndex = function (e) {
                        return (this._startIndex + e) % this._maxLength
                    }, e
                }();
                t.CircularList = n
            }, 1439: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.clone = void 0, t.clone = function e(t, r) {
                    if (void 0 === r && (r = 5), "object" != typeof t) return t;
                    var i = Array.isArray(t) ? [] : {};
                    for (var n in t) i[n] = r <= 1 ? t[n] : t[n] && e(t[n], r - 1);
                    return i
                }
            }, 8969: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.CoreTerminal = void 0;
                var o = r(844), s = r(2585), a = r(4348), c = r(7866), l = r(744), h = r(7302), u = r(6975),
                    f = r(8460), _ = r(1753), d = r(3730), p = r(1480), v = r(7994), g = r(9282), y = r(5435),
                    b = r(5981), S = !1, m = function (e) {
                        function t(t) {
                            var r = e.call(this) || this;
                            return r._onBinary = new f.EventEmitter, r._onData = new f.EventEmitter, r._onLineFeed = new f.EventEmitter, r._onResize = new f.EventEmitter, r._onScroll = new f.EventEmitter, r._instantiationService = new a.InstantiationService, r.optionsService = new h.OptionsService(t), r._instantiationService.setService(s.IOptionsService, r.optionsService), r._bufferService = r.register(r._instantiationService.createInstance(l.BufferService)), r._instantiationService.setService(s.IBufferService, r._bufferService), r._logService = r._instantiationService.createInstance(c.LogService), r._instantiationService.setService(s.ILogService, r._logService), r._coreService = r.register(r._instantiationService.createInstance(u.CoreService, (function () {
                                return r.scrollToBottom()
                            }))), r._instantiationService.setService(s.ICoreService, r._coreService), r._coreMouseService = r._instantiationService.createInstance(_.CoreMouseService), r._instantiationService.setService(s.ICoreMouseService, r._coreMouseService), r._dirtyRowService = r._instantiationService.createInstance(d.DirtyRowService), r._instantiationService.setService(s.IDirtyRowService, r._dirtyRowService), r.unicodeService = r._instantiationService.createInstance(p.UnicodeService), r._instantiationService.setService(s.IUnicodeService, r.unicodeService), r._charsetService = r._instantiationService.createInstance(v.CharsetService), r._instantiationService.setService(s.ICharsetService, r._charsetService), r._inputHandler = new y.InputHandler(r._bufferService, r._charsetService, r._coreService, r._dirtyRowService, r._logService, r.optionsService, r._coreMouseService, r.unicodeService), r.register(f.forwardEvent(r._inputHandler.onLineFeed, r._onLineFeed)), r.register(r._inputHandler), r.register(f.forwardEvent(r._bufferService.onResize, r._onResize)), r.register(f.forwardEvent(r._coreService.onData, r._onData)), r.register(f.forwardEvent(r._coreService.onBinary, r._onBinary)), r.register(r.optionsService.onOptionChange((function (e) {
                                return r._updateOptions(e)
                            }))), r.register(r._bufferService.onScroll((function (e) {
                                r._onScroll.fire({
                                    position: r._bufferService.buffer.ydisp,
                                    source: 0
                                }), r._dirtyRowService.markRangeDirty(r._bufferService.buffer.scrollTop, r._bufferService.buffer.scrollBottom)
                            }))), r._writeBuffer = new b.WriteBuffer((function (e, t) {
                                return r._inputHandler.parse(e, t)
                            })), r
                        }

                        return n(t, e), Object.defineProperty(t.prototype, "onBinary", {
                            get: function () {
                                return this._onBinary.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onData", {
                            get: function () {
                                return this._onData.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onLineFeed", {
                            get: function () {
                                return this._onLineFeed.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onResize", {
                            get: function () {
                                return this._onResize.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onScroll", {
                            get: function () {
                                var e = this;
                                return this._onScrollApi || (this._onScrollApi = new f.EventEmitter, this.register(this._onScroll.event((function (t) {
                                    var r;
                                    null === (r = e._onScrollApi) || void 0 === r || r.fire(t.position)
                                })))), this._onScrollApi.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "cols", {
                            get: function () {
                                return this._bufferService.cols
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "rows", {
                            get: function () {
                                return this._bufferService.rows
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "buffers", {
                            get: function () {
                                return this._bufferService.buffers
                            }, enumerable: !1, configurable: !0
                        }), t.prototype.dispose = function () {
                            var t;
                            this._isDisposed || (e.prototype.dispose.call(this), null === (t = this._windowsMode) || void 0 === t || t.dispose(), this._windowsMode = void 0)
                        }, t.prototype.write = function (e, t) {
                            this._writeBuffer.write(e, t)
                        }, t.prototype.writeSync = function (e, t) {
                            this._logService.logLevel <= s.LogLevelEnum.WARN && !S && (this._logService.warn("writeSync is unreliable and will be removed soon."), S = !0), this._writeBuffer.writeSync(e, t)
                        }, t.prototype.resize = function (e, t) {
                            isNaN(e) || isNaN(t) || (e = Math.max(e, l.MINIMUM_COLS), t = Math.max(t, l.MINIMUM_ROWS), this._bufferService.resize(e, t))
                        }, t.prototype.scroll = function (e, t) {
                            void 0 === t && (t = !1), this._bufferService.scroll(e, t)
                        }, t.prototype.scrollLines = function (e, t, r) {
                            this._bufferService.scrollLines(e, t, r)
                        }, t.prototype.scrollPages = function (e) {
                            this._bufferService.scrollPages(e)
                        }, t.prototype.scrollToTop = function () {
                            this._bufferService.scrollToTop()
                        }, t.prototype.scrollToBottom = function () {
                            this._bufferService.scrollToBottom()
                        }, t.prototype.scrollToLine = function (e) {
                            this._bufferService.scrollToLine(e)
                        }, t.prototype.registerEscHandler = function (e, t) {
                            return this._inputHandler.registerEscHandler(e, t)
                        }, t.prototype.registerDcsHandler = function (e, t) {
                            return this._inputHandler.registerDcsHandler(e, t)
                        }, t.prototype.registerCsiHandler = function (e, t) {
                            return this._inputHandler.registerCsiHandler(e, t)
                        }, t.prototype.registerOscHandler = function (e, t) {
                            return this._inputHandler.registerOscHandler(e, t)
                        }, t.prototype._setup = function () {
                            this.optionsService.options.windowsMode && this._enableWindowsMode()
                        }, t.prototype.reset = function () {
                            this._inputHandler.reset(), this._bufferService.reset(), this._charsetService.reset(), this._coreService.reset(), this._coreMouseService.reset()
                        }, t.prototype._updateOptions = function (e) {
                            var t;
                            switch (e) {
                                case"scrollback":
                                    this.buffers.resize(this.cols, this.rows);
                                    break;
                                case"windowsMode":
                                    this.optionsService.options.windowsMode ? this._enableWindowsMode() : (null === (t = this._windowsMode) || void 0 === t || t.dispose(), this._windowsMode = void 0)
                            }
                        }, t.prototype._enableWindowsMode = function () {
                            var e = this;
                            if (!this._windowsMode) {
                                var t = [];
                                t.push(this.onLineFeed(g.updateWindowsModeWrappedState.bind(null, this._bufferService))), t.push(this.registerCsiHandler({final: "H"}, (function () {
                                    return g.updateWindowsModeWrappedState(e._bufferService), !1
                                }))), this._windowsMode = {
                                    dispose: function () {
                                        for (var e = 0, r = t; e < r.length; e++) r[e].dispose()
                                    }
                                }
                            }
                        }, t
                    }(o.Disposable);
                t.CoreTerminal = m
            }, 8460: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.forwardEvent = t.EventEmitter = void 0;
                var r = function () {
                    function e() {
                        this._listeners = [], this._disposed = !1
                    }

                    return Object.defineProperty(e.prototype, "event", {
                        get: function () {
                            var e = this;
                            return this._event || (this._event = function (t) {
                                return e._listeners.push(t), {
                                    dispose: function () {
                                        if (!e._disposed) for (var r = 0; r < e._listeners.length; r++) if (e._listeners[r] === t) return void e._listeners.splice(r, 1)
                                    }
                                }
                            }), this._event
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.fire = function (e, t) {
                        for (var r = [], i = 0; i < this._listeners.length; i++) r.push(this._listeners[i]);
                        for (i = 0; i < r.length; i++) r[i].call(void 0, e, t)
                    }, e.prototype.dispose = function () {
                        this._listeners && (this._listeners.length = 0), this._disposed = !0
                    }, e
                }();
                t.EventEmitter = r, t.forwardEvent = function (e, t) {
                    return e((function (e) {
                        return t.fire(e)
                    }))
                }
            }, 5435: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.InputHandler = t.WindowsOptionsReportType = void 0;
                var o, s = r(2584), a = r(7116), c = r(2015), l = r(844), h = r(8273), u = r(482), f = r(8437),
                    _ = r(8460), d = r(643), p = r(511), v = r(3734), g = r(2585), y = r(6242), b = r(6351),
                    S = {"(": 0, ")": 1, "*": 2, "+": 3, "-": 1, ".": 2}, m = 131072;

                function C(e, t) {
                    if (e > 24) return t.setWinLines || !1;
                    switch (e) {
                        case 1:
                            return !!t.restoreWin;
                        case 2:
                            return !!t.minimizeWin;
                        case 3:
                            return !!t.setWinPosition;
                        case 4:
                            return !!t.setWinSizePixels;
                        case 5:
                            return !!t.raiseWin;
                        case 6:
                            return !!t.lowerWin;
                        case 7:
                            return !!t.refreshWin;
                        case 8:
                            return !!t.setWinSizeChars;
                        case 9:
                            return !!t.maximizeWin;
                        case 10:
                            return !!t.fullscreenWin;
                        case 11:
                            return !!t.getWinState;
                        case 13:
                            return !!t.getWinPosition;
                        case 14:
                            return !!t.getWinSizePixels;
                        case 15:
                            return !!t.getScreenSizePixels;
                        case 16:
                            return !!t.getCellSizePixels;
                        case 18:
                            return !!t.getWinSizeChars;
                        case 19:
                            return !!t.getScreenSizeChars;
                        case 20:
                            return !!t.getIconTitle;
                        case 21:
                            return !!t.getWinTitle;
                        case 22:
                            return !!t.pushTitle;
                        case 23:
                            return !!t.popTitle;
                        case 24:
                            return !!t.setWinLines
                    }
                    return !1
                }

                !function (e) {
                    e[e.GET_WIN_SIZE_PIXELS = 0] = "GET_WIN_SIZE_PIXELS", e[e.GET_CELL_SIZE_PIXELS = 1] = "GET_CELL_SIZE_PIXELS"
                }(o = t.WindowsOptionsReportType || (t.WindowsOptionsReportType = {}));
                var w = function () {
                    function e(e, t, r, i) {
                        this._bufferService = e, this._coreService = t, this._logService = r, this._optionsService = i, this._data = new Uint32Array(0)
                    }

                    return e.prototype.hook = function (e) {
                        this._data = new Uint32Array(0)
                    }, e.prototype.put = function (e, t, r) {
                        this._data = h.concat(this._data, e.subarray(t, r))
                    }, e.prototype.unhook = function (e) {
                        if (!e) return this._data = new Uint32Array(0), !0;
                        var t = u.utf32ToString(this._data);
                        switch (this._data = new Uint32Array(0), t) {
                            case'"q':
                                this._coreService.triggerDataEvent(s.C0.ESC + 'P1$r0"q' + s.C0.ESC + "\\");
                                break;
                            case'"p':
                                this._coreService.triggerDataEvent(s.C0.ESC + 'P1$r61;1"p' + s.C0.ESC + "\\");
                                break;
                            case"r":
                                var r = this._bufferService.buffer.scrollTop + 1 + ";" + (this._bufferService.buffer.scrollBottom + 1) + "r";
                                this._coreService.triggerDataEvent(s.C0.ESC + "P1$r" + r + s.C0.ESC + "\\");
                                break;
                            case"m":
                                this._coreService.triggerDataEvent(s.C0.ESC + "P1$r0m" + s.C0.ESC + "\\");
                                break;
                            case" q":
                                var i = {block: 2, underline: 4, bar: 6}[this._optionsService.options.cursorStyle];
                                i -= this._optionsService.options.cursorBlink ? 1 : 0, this._coreService.triggerDataEvent(s.C0.ESC + "P1$r" + i + " q" + s.C0.ESC + "\\");
                                break;
                            default:
                                this._logService.debug("Unknown DCS $q %s", t), this._coreService.triggerDataEvent(s.C0.ESC + "P0$r" + s.C0.ESC + "\\")
                        }
                        return !0
                    }, e
                }(), E = function (e) {
                    function t(t, r, i, n, o, l, h, d, v) {
                        void 0 === v && (v = new c.EscapeSequenceParser);
                        var g = e.call(this) || this;
                        g._bufferService = t, g._charsetService = r, g._coreService = i, g._dirtyRowService = n, g._logService = o, g._optionsService = l, g._coreMouseService = h, g._unicodeService = d, g._parser = v, g._parseBuffer = new Uint32Array(4096), g._stringDecoder = new u.StringToUtf32, g._utf8Decoder = new u.Utf8ToUtf32, g._workCell = new p.CellData, g._windowTitle = "", g._iconName = "", g._windowTitleStack = [], g._iconNameStack = [], g._curAttrData = f.DEFAULT_ATTR_DATA.clone(), g._eraseAttrDataInternal = f.DEFAULT_ATTR_DATA.clone(), g._onRequestBell = new _.EventEmitter, g._onRequestRefreshRows = new _.EventEmitter, g._onRequestReset = new _.EventEmitter, g._onRequestSyncScrollBar = new _.EventEmitter, g._onRequestWindowsOptionsReport = new _.EventEmitter, g._onA11yChar = new _.EventEmitter, g._onA11yTab = new _.EventEmitter, g._onCursorMove = new _.EventEmitter, g._onLineFeed = new _.EventEmitter, g._onScroll = new _.EventEmitter, g._onTitleChange = new _.EventEmitter, g._onAnsiColorChange = new _.EventEmitter, g._parseStack = {
                            paused: !1,
                            cursorStartX: 0,
                            cursorStartY: 0,
                            decodedLength: 0,
                            position: 0
                        }, g.register(g._parser), g._parser.setCsiHandlerFallback((function (e, t) {
                            g._logService.debug("Unknown CSI code: ", {
                                identifier: g._parser.identToString(e),
                                params: t.toArray()
                            })
                        })), g._parser.setEscHandlerFallback((function (e) {
                            g._logService.debug("Unknown ESC code: ", {identifier: g._parser.identToString(e)})
                        })), g._parser.setExecuteHandlerFallback((function (e) {
                            g._logService.debug("Unknown EXECUTE code: ", {code: e})
                        })), g._parser.setOscHandlerFallback((function (e, t, r) {
                            g._logService.debug("Unknown OSC code: ", {identifier: e, action: t, data: r})
                        })), g._parser.setDcsHandlerFallback((function (e, t, r) {
                            "HOOK" === t && (r = r.toArray()), g._logService.debug("Unknown DCS code: ", {
                                identifier: g._parser.identToString(e),
                                action: t,
                                payload: r
                            })
                        })), g._parser.setPrintHandler((function (e, t, r) {
                            return g.print(e, t, r)
                        })), g._parser.registerCsiHandler({final: "@"}, (function (e) {
                            return g.insertChars(e)
                        })), g._parser.registerCsiHandler({intermediates: " ", final: "@"}, (function (e) {
                            return g.scrollLeft(e)
                        })), g._parser.registerCsiHandler({final: "A"}, (function (e) {
                            return g.cursorUp(e)
                        })), g._parser.registerCsiHandler({intermediates: " ", final: "A"}, (function (e) {
                            return g.scrollRight(e)
                        })), g._parser.registerCsiHandler({final: "B"}, (function (e) {
                            return g.cursorDown(e)
                        })), g._parser.registerCsiHandler({final: "C"}, (function (e) {
                            return g.cursorForward(e)
                        })), g._parser.registerCsiHandler({final: "D"}, (function (e) {
                            return g.cursorBackward(e)
                        })), g._parser.registerCsiHandler({final: "E"}, (function (e) {
                            return g.cursorNextLine(e)
                        })), g._parser.registerCsiHandler({final: "F"}, (function (e) {
                            return g.cursorPrecedingLine(e)
                        })), g._parser.registerCsiHandler({final: "G"}, (function (e) {
                            return g.cursorCharAbsolute(e)
                        })), g._parser.registerCsiHandler({final: "H"}, (function (e) {
                            return g.cursorPosition(e)
                        })), g._parser.registerCsiHandler({final: "I"}, (function (e) {
                            return g.cursorForwardTab(e)
                        })), g._parser.registerCsiHandler({final: "J"}, (function (e) {
                            return g.eraseInDisplay(e)
                        })), g._parser.registerCsiHandler({prefix: "?", final: "J"}, (function (e) {
                            return g.eraseInDisplay(e)
                        })), g._parser.registerCsiHandler({final: "K"}, (function (e) {
                            return g.eraseInLine(e)
                        })), g._parser.registerCsiHandler({prefix: "?", final: "K"}, (function (e) {
                            return g.eraseInLine(e)
                        })), g._parser.registerCsiHandler({final: "L"}, (function (e) {
                            return g.insertLines(e)
                        })), g._parser.registerCsiHandler({final: "M"}, (function (e) {
                            return g.deleteLines(e)
                        })), g._parser.registerCsiHandler({final: "P"}, (function (e) {
                            return g.deleteChars(e)
                        })), g._parser.registerCsiHandler({final: "S"}, (function (e) {
                            return g.scrollUp(e)
                        })), g._parser.registerCsiHandler({final: "T"}, (function (e) {
                            return g.scrollDown(e)
                        })), g._parser.registerCsiHandler({final: "X"}, (function (e) {
                            return g.eraseChars(e)
                        })), g._parser.registerCsiHandler({final: "Z"}, (function (e) {
                            return g.cursorBackwardTab(e)
                        })), g._parser.registerCsiHandler({final: "`"}, (function (e) {
                            return g.charPosAbsolute(e)
                        })), g._parser.registerCsiHandler({final: "a"}, (function (e) {
                            return g.hPositionRelative(e)
                        })), g._parser.registerCsiHandler({final: "b"}, (function (e) {
                            return g.repeatPrecedingCharacter(e)
                        })), g._parser.registerCsiHandler({final: "c"}, (function (e) {
                            return g.sendDeviceAttributesPrimary(e)
                        })), g._parser.registerCsiHandler({prefix: ">", final: "c"}, (function (e) {
                            return g.sendDeviceAttributesSecondary(e)
                        })), g._parser.registerCsiHandler({final: "d"}, (function (e) {
                            return g.linePosAbsolute(e)
                        })), g._parser.registerCsiHandler({final: "e"}, (function (e) {
                            return g.vPositionRelative(e)
                        })), g._parser.registerCsiHandler({final: "f"}, (function (e) {
                            return g.hVPosition(e)
                        })), g._parser.registerCsiHandler({final: "g"}, (function (e) {
                            return g.tabClear(e)
                        })), g._parser.registerCsiHandler({final: "h"}, (function (e) {
                            return g.setMode(e)
                        })), g._parser.registerCsiHandler({prefix: "?", final: "h"}, (function (e) {
                            return g.setModePrivate(e)
                        })), g._parser.registerCsiHandler({final: "l"}, (function (e) {
                            return g.resetMode(e)
                        })), g._parser.registerCsiHandler({prefix: "?", final: "l"}, (function (e) {
                            return g.resetModePrivate(e)
                        })), g._parser.registerCsiHandler({final: "m"}, (function (e) {
                            return g.charAttributes(e)
                        })), g._parser.registerCsiHandler({final: "n"}, (function (e) {
                            return g.deviceStatus(e)
                        })), g._parser.registerCsiHandler({prefix: "?", final: "n"}, (function (e) {
                            return g.deviceStatusPrivate(e)
                        })), g._parser.registerCsiHandler({intermediates: "!", final: "p"}, (function (e) {
                            return g.softReset(e)
                        })), g._parser.registerCsiHandler({intermediates: " ", final: "q"}, (function (e) {
                            return g.setCursorStyle(e)
                        })), g._parser.registerCsiHandler({final: "r"}, (function (e) {
                            return g.setScrollRegion(e)
                        })), g._parser.registerCsiHandler({final: "s"}, (function (e) {
                            return g.saveCursor(e)
                        })), g._parser.registerCsiHandler({final: "t"}, (function (e) {
                            return g.windowOptions(e)
                        })), g._parser.registerCsiHandler({final: "u"}, (function (e) {
                            return g.restoreCursor(e)
                        })), g._parser.registerCsiHandler({intermediates: "'", final: "}"}, (function (e) {
                            return g.insertColumns(e)
                        })), g._parser.registerCsiHandler({intermediates: "'", final: "~"}, (function (e) {
                            return g.deleteColumns(e)
                        })), g._parser.setExecuteHandler(s.C0.BEL, (function () {
                            return g.bell()
                        })), g._parser.setExecuteHandler(s.C0.LF, (function () {
                            return g.lineFeed()
                        })), g._parser.setExecuteHandler(s.C0.VT, (function () {
                            return g.lineFeed()
                        })), g._parser.setExecuteHandler(s.C0.FF, (function () {
                            return g.lineFeed()
                        })), g._parser.setExecuteHandler(s.C0.CR, (function () {
                            return g.carriageReturn()
                        })), g._parser.setExecuteHandler(s.C0.BS, (function () {
                            return g.backspace()
                        })), g._parser.setExecuteHandler(s.C0.HT, (function () {
                            return g.tab()
                        })), g._parser.setExecuteHandler(s.C0.SO, (function () {
                            return g.shiftOut()
                        })), g._parser.setExecuteHandler(s.C0.SI, (function () {
                            return g.shiftIn()
                        })), g._parser.setExecuteHandler(s.C1.IND, (function () {
                            return g.index()
                        })), g._parser.setExecuteHandler(s.C1.NEL, (function () {
                            return g.nextLine()
                        })), g._parser.setExecuteHandler(s.C1.HTS, (function () {
                            return g.tabSet()
                        })), g._parser.registerOscHandler(0, new y.OscHandler((function (e) {
                            return g.setTitle(e), g.setIconName(e), !0
                        }))), g._parser.registerOscHandler(1, new y.OscHandler((function (e) {
                            return g.setIconName(e)
                        }))), g._parser.registerOscHandler(2, new y.OscHandler((function (e) {
                            return g.setTitle(e)
                        }))),g._parser.registerOscHandler(4, new y.OscHandler((function (e) {
                            return g.setAnsiColor(e)
                        }))),g._parser.registerEscHandler({final: "7"}, (function () {
                            return g.saveCursor()
                        })),g._parser.registerEscHandler({final: "8"}, (function () {
                            return g.restoreCursor()
                        })),g._parser.registerEscHandler({final: "D"}, (function () {
                            return g.index()
                        })),g._parser.registerEscHandler({final: "E"}, (function () {
                            return g.nextLine()
                        })),g._parser.registerEscHandler({final: "H"}, (function () {
                            return g.tabSet()
                        })),g._parser.registerEscHandler({final: "M"}, (function () {
                            return g.reverseIndex()
                        })),g._parser.registerEscHandler({final: "="}, (function () {
                            return g.keypadApplicationMode()
                        })),g._parser.registerEscHandler({final: ">"}, (function () {
                            return g.keypadNumericMode()
                        })),g._parser.registerEscHandler({final: "c"}, (function () {
                            return g.fullReset()
                        })),g._parser.registerEscHandler({final: "n"}, (function () {
                            return g.setgLevel(2)
                        })),g._parser.registerEscHandler({final: "o"}, (function () {
                            return g.setgLevel(3)
                        })),g._parser.registerEscHandler({final: "|"}, (function () {
                            return g.setgLevel(3)
                        })),g._parser.registerEscHandler({final: "}"}, (function () {
                            return g.setgLevel(2)
                        })),g._parser.registerEscHandler({final: "~"}, (function () {
                            return g.setgLevel(1)
                        })),g._parser.registerEscHandler({intermediates: "%", final: "@"}, (function () {
                            return g.selectDefaultCharset()
                        })),g._parser.registerEscHandler({intermediates: "%", final: "G"}, (function () {
                            return g.selectDefaultCharset()
                        }));
                        var b = function (e) {
                            S._parser.registerEscHandler({intermediates: "(", final: e}, (function () {
                                return g.selectCharset("(" + e)
                            })), S._parser.registerEscHandler({intermediates: ")", final: e}, (function () {
                                return g.selectCharset(")" + e)
                            })), S._parser.registerEscHandler({intermediates: "*", final: e}, (function () {
                                return g.selectCharset("*" + e)
                            })), S._parser.registerEscHandler({intermediates: "+", final: e}, (function () {
                                return g.selectCharset("+" + e)
                            })), S._parser.registerEscHandler({intermediates: "-", final: e}, (function () {
                                return g.selectCharset("-" + e)
                            })), S._parser.registerEscHandler({intermediates: ".", final: e}, (function () {
                                return g.selectCharset("." + e)
                            })), S._parser.registerEscHandler({intermediates: "/", final: e}, (function () {
                                return g.selectCharset("/" + e)
                            }))
                        }, S = this;
                        for (var m in a.CHARSETS) b(m);
                        return g._parser.registerEscHandler({intermediates: "#", final: "8"}, (function () {
                            return g.screenAlignmentPattern()
                        })), g._parser.setErrorHandler((function (e) {
                            return g._logService.error("Parsing error: ", e), e
                        })), g._parser.registerDcsHandler({
                            intermediates: "$",
                            final: "q"
                        }, new w(g._bufferService, g._coreService, g._logService, g._optionsService)), g
                    }

                    return n(t, e), Object.defineProperty(t.prototype, "onRequestBell", {
                        get: function () {
                            return this._onRequestBell.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onRequestRefreshRows", {
                        get: function () {
                            return this._onRequestRefreshRows.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onRequestReset", {
                        get: function () {
                            return this._onRequestReset.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onRequestSyncScrollBar", {
                        get: function () {
                            return this._onRequestSyncScrollBar.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onRequestWindowsOptionsReport", {
                        get: function () {
                            return this._onRequestWindowsOptionsReport.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onA11yChar", {
                        get: function () {
                            return this._onA11yChar.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onA11yTab", {
                        get: function () {
                            return this._onA11yTab.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onCursorMove", {
                        get: function () {
                            return this._onCursorMove.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onLineFeed", {
                        get: function () {
                            return this._onLineFeed.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onScroll", {
                        get: function () {
                            return this._onScroll.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onTitleChange", {
                        get: function () {
                            return this._onTitleChange.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onAnsiColorChange", {
                        get: function () {
                            return this._onAnsiColorChange.event
                        }, enumerable: !1, configurable: !0
                    }), t.prototype.dispose = function () {
                        e.prototype.dispose.call(this)
                    }, t.prototype._preserveStack = function (e, t, r, i) {
                        this._parseStack.paused = !0, this._parseStack.cursorStartX = e, this._parseStack.cursorStartY = t, this._parseStack.decodedLength = r, this._parseStack.position = i
                    }, t.prototype._logSlowResolvingAsync = function (e) {
                        this._logService.logLevel <= g.LogLevelEnum.WARN && Promise.race([e, new Promise((function (e, t) {
                            return setTimeout((function () {
                                return t("#SLOW_TIMEOUT")
                            }), 5e3)
                        }))]).catch((function (e) {
                            if ("#SLOW_TIMEOUT" !== e) throw e;
                            console.warn("async parser handler taking longer than 5000 ms")
                        }))
                    }, t.prototype.parse = function (e, t) {
                        var r, i = this._bufferService.buffer, n = i.x, o = i.y, s = 0, a = this._parseStack.paused;
                        if (a) {
                            if (r = this._parser.parse(this._parseBuffer, this._parseStack.decodedLength, t)) return this._logSlowResolvingAsync(r), r;
                            n = this._parseStack.cursorStartX, o = this._parseStack.cursorStartY, this._parseStack.paused = !1, e.length > m && (s = this._parseStack.position + m)
                        }
                        if (this._logService.debug("parsing data", e), this._parseBuffer.length < e.length && this._parseBuffer.length < m && (this._parseBuffer = new Uint32Array(Math.min(e.length, m))), a || this._dirtyRowService.clearRange(), e.length > m) for (var c = s; c < e.length; c += m) {
                            var l = c + m < e.length ? c + m : e.length,
                                h = "string" == typeof e ? this._stringDecoder.decode(e.substring(c, l), this._parseBuffer) : this._utf8Decoder.decode(e.subarray(c, l), this._parseBuffer);
                            if (r = this._parser.parse(this._parseBuffer, h)) return this._preserveStack(n, o, h, c), this._logSlowResolvingAsync(r), r
                        } else if (!a && (h = "string" == typeof e ? this._stringDecoder.decode(e, this._parseBuffer) : this._utf8Decoder.decode(e, this._parseBuffer), r = this._parser.parse(this._parseBuffer, h))) return this._preserveStack(n, o, h, 0), this._logSlowResolvingAsync(r), r;
                        (i = this._bufferService.buffer).x === n && i.y === o || this._onCursorMove.fire(), this._onRequestRefreshRows.fire(this._dirtyRowService.start, this._dirtyRowService.end)
                    }, t.prototype.print = function (e, t, r) {
                        var i, n, o = this._bufferService.buffer, s = this._charsetService.charset,
                            a = this._optionsService.options.screenReaderMode, c = this._bufferService.cols,
                            l = this._coreService.decPrivateModes.wraparound, h = this._coreService.modes.insertMode,
                            f = this._curAttrData, _ = o.lines.get(o.ybase + o.y);
                        this._dirtyRowService.markDirty(o.y), o.x && r - t > 0 && 2 === _.getWidth(o.x - 1) && _.setCellFromCodePoint(o.x - 1, 0, 1, f.fg, f.bg, f.extended);
                        for (var p = t; p < r; ++p) {
                            if (i = e[p], n = this._unicodeService.wcwidth(i), i < 127 && s) {
                                var v = s[String.fromCharCode(i)];
                                v && (i = v.charCodeAt(0))
                            }
                            if (a && this._onA11yChar.fire(u.stringFromCodePoint(i)), n || !o.x) {
                                if (o.x + n - 1 >= c) if (l) {
                                    for (; o.x < c;) _.setCellFromCodePoint(o.x++, 0, 1, f.fg, f.bg, f.extended);
                                    o.x = 0, o.y++, o.y === o.scrollBottom + 1 ? (o.y--, this._bufferService.scroll(this._eraseAttrData(), !0)) : (o.y >= this._bufferService.rows && (o.y = this._bufferService.rows - 1), o.lines.get(o.ybase + o.y).isWrapped = !0), _ = o.lines.get(o.ybase + o.y)
                                } else if (o.x = c - 1, 2 === n) continue;
                                if (h && (_.insertCells(o.x, n, o.getNullCell(f), f), 2 === _.getWidth(c - 1) && _.setCellFromCodePoint(c - 1, d.NULL_CELL_CODE, d.NULL_CELL_WIDTH, f.fg, f.bg, f.extended)), _.setCellFromCodePoint(o.x++, i, n, f.fg, f.bg, f.extended), n > 0) for (; --n;) _.setCellFromCodePoint(o.x++, 0, 0, f.fg, f.bg, f.extended)
                            } else _.getWidth(o.x - 1) ? _.addCodepointToCell(o.x - 1, i) : _.addCodepointToCell(o.x - 2, i)
                        }
                        r - t > 0 && (_.loadCell(o.x - 1, this._workCell), 2 === this._workCell.getWidth() || this._workCell.getCode() > 65535 ? this._parser.precedingCodepoint = 0 : this._workCell.isCombined() ? this._parser.precedingCodepoint = this._workCell.getChars().charCodeAt(0) : this._parser.precedingCodepoint = this._workCell.content), o.x < c && r - t > 0 && 0 === _.getWidth(o.x) && !_.hasContent(o.x) && _.setCellFromCodePoint(o.x, 0, 1, f.fg, f.bg, f.extended), this._dirtyRowService.markDirty(o.y)
                    }, t.prototype.registerCsiHandler = function (e, t) {
                        var r = this;
                        return "t" !== e.final || e.prefix || e.intermediates ? this._parser.registerCsiHandler(e, t) : this._parser.registerCsiHandler(e, (function (e) {
                            return !C(e.params[0], r._optionsService.options.windowOptions) || t(e)
                        }))
                    }, t.prototype.registerDcsHandler = function (e, t) {
                        return this._parser.registerDcsHandler(e, new b.DcsHandler(t))
                    }, t.prototype.registerEscHandler = function (e, t) {
                        return this._parser.registerEscHandler(e, t)
                    }, t.prototype.registerOscHandler = function (e, t) {
                        return this._parser.registerOscHandler(e, new y.OscHandler(t))
                    }, t.prototype.bell = function () {
                        return this._onRequestBell.fire(), !0
                    }, t.prototype.lineFeed = function () {
                        var e = this._bufferService.buffer;
                        return this._dirtyRowService.markDirty(e.y), this._optionsService.options.convertEol && (e.x = 0), e.y++, e.y === e.scrollBottom + 1 ? (e.y--, this._bufferService.scroll(this._eraseAttrData())) : e.y >= this._bufferService.rows && (e.y = this._bufferService.rows - 1), e.x >= this._bufferService.cols && e.x--, this._dirtyRowService.markDirty(e.y), this._onLineFeed.fire(), !0
                    }, t.prototype.carriageReturn = function () {
                        return this._bufferService.buffer.x = 0, !0
                    }, t.prototype.backspace = function () {
                        var e, t = this._bufferService.buffer;
                        if (!this._coreService.decPrivateModes.reverseWraparound) return this._restrictCursor(), t.x > 0 && t.x--, !0;
                        if (this._restrictCursor(this._bufferService.cols), t.x > 0) t.x--; else if (0 === t.x && t.y > t.scrollTop && t.y <= t.scrollBottom && (null === (e = t.lines.get(t.ybase + t.y)) || void 0 === e ? void 0 : e.isWrapped)) {
                            t.lines.get(t.ybase + t.y).isWrapped = !1, t.y--, t.x = this._bufferService.cols - 1;
                            var r = t.lines.get(t.ybase + t.y);
                            r.hasWidth(t.x) && !r.hasContent(t.x) && t.x--
                        }
                        return this._restrictCursor(), !0
                    }, t.prototype.tab = function () {
                        if (this._bufferService.buffer.x >= this._bufferService.cols) return !0;
                        var e = this._bufferService.buffer.x;
                        return this._bufferService.buffer.x = this._bufferService.buffer.nextStop(), this._optionsService.options.screenReaderMode && this._onA11yTab.fire(this._bufferService.buffer.x - e), !0
                    }, t.prototype.shiftOut = function () {
                        return this._charsetService.setgLevel(1), !0
                    }, t.prototype.shiftIn = function () {
                        return this._charsetService.setgLevel(0), !0
                    }, t.prototype._restrictCursor = function (e) {
                        void 0 === e && (e = this._bufferService.cols - 1), this._bufferService.buffer.x = Math.min(e, Math.max(0, this._bufferService.buffer.x)), this._bufferService.buffer.y = this._coreService.decPrivateModes.origin ? Math.min(this._bufferService.buffer.scrollBottom, Math.max(this._bufferService.buffer.scrollTop, this._bufferService.buffer.y)) : Math.min(this._bufferService.rows - 1, Math.max(0, this._bufferService.buffer.y)), this._dirtyRowService.markDirty(this._bufferService.buffer.y)
                    }, t.prototype._setCursor = function (e, t) {
                        this._dirtyRowService.markDirty(this._bufferService.buffer.y), this._coreService.decPrivateModes.origin ? (this._bufferService.buffer.x = e, this._bufferService.buffer.y = this._bufferService.buffer.scrollTop + t) : (this._bufferService.buffer.x = e, this._bufferService.buffer.y = t), this._restrictCursor(), this._dirtyRowService.markDirty(this._bufferService.buffer.y)
                    }, t.prototype._moveCursor = function (e, t) {
                        this._restrictCursor(), this._setCursor(this._bufferService.buffer.x + e, this._bufferService.buffer.y + t)
                    }, t.prototype.cursorUp = function (e) {
                        var t = this._bufferService.buffer.y - this._bufferService.buffer.scrollTop;
                        return t >= 0 ? this._moveCursor(0, -Math.min(t, e.params[0] || 1)) : this._moveCursor(0, -(e.params[0] || 1)), !0
                    }, t.prototype.cursorDown = function (e) {
                        var t = this._bufferService.buffer.scrollBottom - this._bufferService.buffer.y;
                        return t >= 0 ? this._moveCursor(0, Math.min(t, e.params[0] || 1)) : this._moveCursor(0, e.params[0] || 1), !0
                    }, t.prototype.cursorForward = function (e) {
                        return this._moveCursor(e.params[0] || 1, 0), !0
                    }, t.prototype.cursorBackward = function (e) {
                        return this._moveCursor(-(e.params[0] || 1), 0), !0
                    }, t.prototype.cursorNextLine = function (e) {
                        return this.cursorDown(e), this._bufferService.buffer.x = 0, !0
                    }, t.prototype.cursorPrecedingLine = function (e) {
                        return this.cursorUp(e), this._bufferService.buffer.x = 0, !0
                    }, t.prototype.cursorCharAbsolute = function (e) {
                        return this._setCursor((e.params[0] || 1) - 1, this._bufferService.buffer.y), !0
                    }, t.prototype.cursorPosition = function (e) {
                        return this._setCursor(e.length >= 2 ? (e.params[1] || 1) - 1 : 0, (e.params[0] || 1) - 1), !0
                    }, t.prototype.charPosAbsolute = function (e) {
                        return this._setCursor((e.params[0] || 1) - 1, this._bufferService.buffer.y), !0
                    }, t.prototype.hPositionRelative = function (e) {
                        return this._moveCursor(e.params[0] || 1, 0), !0
                    }, t.prototype.linePosAbsolute = function (e) {
                        return this._setCursor(this._bufferService.buffer.x, (e.params[0] || 1) - 1), !0
                    }, t.prototype.vPositionRelative = function (e) {
                        return this._moveCursor(0, e.params[0] || 1), !0
                    }, t.prototype.hVPosition = function (e) {
                        return this.cursorPosition(e), !0
                    }, t.prototype.tabClear = function (e) {
                        var t = e.params[0];
                        return 0 === t ? delete this._bufferService.buffer.tabs[this._bufferService.buffer.x] : 3 === t && (this._bufferService.buffer.tabs = {}), !0
                    }, t.prototype.cursorForwardTab = function (e) {
                        if (this._bufferService.buffer.x >= this._bufferService.cols) return !0;
                        for (var t = e.params[0] || 1; t--;) this._bufferService.buffer.x = this._bufferService.buffer.nextStop();
                        return !0
                    }, t.prototype.cursorBackwardTab = function (e) {
                        if (this._bufferService.buffer.x >= this._bufferService.cols) return !0;
                        for (var t = e.params[0] || 1, r = this._bufferService.buffer; t--;) r.x = r.prevStop();
                        return !0
                    }, t.prototype._eraseInBufferLine = function (e, t, r, i) {
                        void 0 === i && (i = !1);
                        var n = this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase + e);
                        n.replaceCells(t, r, this._bufferService.buffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), i && (n.isWrapped = !1)
                    }, t.prototype._resetBufferLine = function (e) {
                        var t = this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase + e);
                        t.fill(this._bufferService.buffer.getNullCell(this._eraseAttrData())), t.isWrapped = !1
                    }, t.prototype.eraseInDisplay = function (e) {
                        var t;
                        switch (this._restrictCursor(this._bufferService.cols), e.params[0]) {
                            case 0:
                                for (t = this._bufferService.buffer.y, this._dirtyRowService.markDirty(t), this._eraseInBufferLine(t++, this._bufferService.buffer.x, this._bufferService.cols, 0 === this._bufferService.buffer.x); t < this._bufferService.rows; t++) this._resetBufferLine(t);
                                this._dirtyRowService.markDirty(t);
                                break;
                            case 1:
                                for (t = this._bufferService.buffer.y, this._dirtyRowService.markDirty(t), this._eraseInBufferLine(t, 0, this._bufferService.buffer.x + 1, !0), this._bufferService.buffer.x + 1 >= this._bufferService.cols && (this._bufferService.buffer.lines.get(t + 1).isWrapped = !1); t--;) this._resetBufferLine(t);
                                this._dirtyRowService.markDirty(0);
                                break;
                            case 2:
                                for (t = this._bufferService.rows, this._dirtyRowService.markDirty(t - 1); t--;) this._resetBufferLine(t);
                                this._dirtyRowService.markDirty(0);
                                break;
                            case 3:
                                var r = this._bufferService.buffer.lines.length - this._bufferService.rows;
                                r > 0 && (this._bufferService.buffer.lines.trimStart(r), this._bufferService.buffer.ybase = Math.max(this._bufferService.buffer.ybase - r, 0), this._bufferService.buffer.ydisp = Math.max(this._bufferService.buffer.ydisp - r, 0), this._onScroll.fire(0))
                        }
                        return !0
                    }, t.prototype.eraseInLine = function (e) {
                        switch (this._restrictCursor(this._bufferService.cols), e.params[0]) {
                            case 0:
                                this._eraseInBufferLine(this._bufferService.buffer.y, this._bufferService.buffer.x, this._bufferService.cols);
                                break;
                            case 1:
                                this._eraseInBufferLine(this._bufferService.buffer.y, 0, this._bufferService.buffer.x + 1);
                                break;
                            case 2:
                                this._eraseInBufferLine(this._bufferService.buffer.y, 0, this._bufferService.cols)
                        }
                        return this._dirtyRowService.markDirty(this._bufferService.buffer.y), !0
                    }, t.prototype.insertLines = function (e) {
                        this._restrictCursor();
                        var t = e.params[0] || 1, r = this._bufferService.buffer;
                        if (r.y > r.scrollBottom || r.y < r.scrollTop) return !0;
                        for (var i = r.ybase + r.y, n = this._bufferService.rows - 1 - r.scrollBottom, o = this._bufferService.rows - 1 + r.ybase - n + 1; t--;) r.lines.splice(o - 1, 1), r.lines.splice(i, 0, r.getBlankLine(this._eraseAttrData()));
                        return this._dirtyRowService.markRangeDirty(r.y, r.scrollBottom), r.x = 0, !0
                    }, t.prototype.deleteLines = function (e) {
                        this._restrictCursor();
                        var t = e.params[0] || 1, r = this._bufferService.buffer;
                        if (r.y > r.scrollBottom || r.y < r.scrollTop) return !0;
                        var i, n = r.ybase + r.y;
                        for (i = this._bufferService.rows - 1 - r.scrollBottom, i = this._bufferService.rows - 1 + r.ybase - i; t--;) r.lines.splice(n, 1), r.lines.splice(i, 0, r.getBlankLine(this._eraseAttrData()));
                        return this._dirtyRowService.markRangeDirty(r.y, r.scrollBottom), r.x = 0, !0
                    }, t.prototype.insertChars = function (e) {
                        this._restrictCursor();
                        var t = this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase + this._bufferService.buffer.y);
                        return t && (t.insertCells(this._bufferService.buffer.x, e.params[0] || 1, this._bufferService.buffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowService.markDirty(this._bufferService.buffer.y)), !0
                    }, t.prototype.deleteChars = function (e) {
                        this._restrictCursor();
                        var t = this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase + this._bufferService.buffer.y);
                        return t && (t.deleteCells(this._bufferService.buffer.x, e.params[0] || 1, this._bufferService.buffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowService.markDirty(this._bufferService.buffer.y)), !0
                    }, t.prototype.scrollUp = function (e) {
                        for (var t = e.params[0] || 1, r = this._bufferService.buffer; t--;) r.lines.splice(r.ybase + r.scrollTop, 1), r.lines.splice(r.ybase + r.scrollBottom, 0, r.getBlankLine(this._eraseAttrData()));
                        return this._dirtyRowService.markRangeDirty(r.scrollTop, r.scrollBottom), !0
                    }, t.prototype.scrollDown = function (e) {
                        for (var t = e.params[0] || 1, r = this._bufferService.buffer; t--;) r.lines.splice(r.ybase + r.scrollBottom, 1), r.lines.splice(r.ybase + r.scrollTop, 0, r.getBlankLine(f.DEFAULT_ATTR_DATA));
                        return this._dirtyRowService.markRangeDirty(r.scrollTop, r.scrollBottom), !0
                    }, t.prototype.scrollLeft = function (e) {
                        var t = this._bufferService.buffer;
                        if (t.y > t.scrollBottom || t.y < t.scrollTop) return !0;
                        for (var r = e.params[0] || 1, i = t.scrollTop; i <= t.scrollBottom; ++i) {
                            var n = t.lines.get(t.ybase + i);
                            n.deleteCells(0, r, t.getNullCell(this._eraseAttrData()), this._eraseAttrData()), n.isWrapped = !1
                        }
                        return this._dirtyRowService.markRangeDirty(t.scrollTop, t.scrollBottom), !0
                    }, t.prototype.scrollRight = function (e) {
                        var t = this._bufferService.buffer;
                        if (t.y > t.scrollBottom || t.y < t.scrollTop) return !0;
                        for (var r = e.params[0] || 1, i = t.scrollTop; i <= t.scrollBottom; ++i) {
                            var n = t.lines.get(t.ybase + i);
                            n.insertCells(0, r, t.getNullCell(this._eraseAttrData()), this._eraseAttrData()), n.isWrapped = !1
                        }
                        return this._dirtyRowService.markRangeDirty(t.scrollTop, t.scrollBottom), !0
                    }, t.prototype.insertColumns = function (e) {
                        var t = this._bufferService.buffer;
                        if (t.y > t.scrollBottom || t.y < t.scrollTop) return !0;
                        for (var r = e.params[0] || 1, i = t.scrollTop; i <= t.scrollBottom; ++i) {
                            var n = this._bufferService.buffer.lines.get(t.ybase + i);
                            n.insertCells(t.x, r, t.getNullCell(this._eraseAttrData()), this._eraseAttrData()), n.isWrapped = !1
                        }
                        return this._dirtyRowService.markRangeDirty(t.scrollTop, t.scrollBottom), !0
                    }, t.prototype.deleteColumns = function (e) {
                        var t = this._bufferService.buffer;
                        if (t.y > t.scrollBottom || t.y < t.scrollTop) return !0;
                        for (var r = e.params[0] || 1, i = t.scrollTop; i <= t.scrollBottom; ++i) {
                            var n = t.lines.get(t.ybase + i);
                            n.deleteCells(t.x, r, t.getNullCell(this._eraseAttrData()), this._eraseAttrData()), n.isWrapped = !1
                        }
                        return this._dirtyRowService.markRangeDirty(t.scrollTop, t.scrollBottom), !0
                    }, t.prototype.eraseChars = function (e) {
                        this._restrictCursor();
                        var t = this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase + this._bufferService.buffer.y);
                        return t && (t.replaceCells(this._bufferService.buffer.x, this._bufferService.buffer.x + (e.params[0] || 1), this._bufferService.buffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowService.markDirty(this._bufferService.buffer.y)), !0
                    }, t.prototype.repeatPrecedingCharacter = function (e) {
                        if (!this._parser.precedingCodepoint) return !0;
                        for (var t = e.params[0] || 1, r = new Uint32Array(t), i = 0; i < t; ++i) r[i] = this._parser.precedingCodepoint;
                        return this.print(r, 0, r.length), !0
                    }, t.prototype.sendDeviceAttributesPrimary = function (e) {
                        return e.params[0] > 0 || (this._is("xterm") || this._is("rxvt-unicode") || this._is("screen") ? this._coreService.triggerDataEvent(s.C0.ESC + "[?1;2c") : this._is("linux") && this._coreService.triggerDataEvent(s.C0.ESC + "[?6c")), !0
                    }, t.prototype.sendDeviceAttributesSecondary = function (e) {
                        return e.params[0] > 0 || (this._is("xterm") ? this._coreService.triggerDataEvent(s.C0.ESC + "[>0;276;0c") : this._is("rxvt-unicode") ? this._coreService.triggerDataEvent(s.C0.ESC + "[>85;95;0c") : this._is("linux") ? this._coreService.triggerDataEvent(e.params[0] + "c") : this._is("screen") && this._coreService.triggerDataEvent(s.C0.ESC + "[>83;40003;0c")), !0
                    }, t.prototype._is = function (e) {
                        return 0 === (this._optionsService.options.termName + "").indexOf(e)
                    }, t.prototype.setMode = function (e) {
                        for (var t = 0; t < e.length; t++) switch (e.params[t]) {
                            case 4:
                                this._coreService.modes.insertMode = !0
                        }
                        return !0
                    }, t.prototype.setModePrivate = function (e) {
                        for (var t = 0; t < e.length; t++) switch (e.params[t]) {
                            case 1:
                                this._coreService.decPrivateModes.applicationCursorKeys = !0;
                                break;
                            case 2:
                                this._charsetService.setgCharset(0, a.DEFAULT_CHARSET), this._charsetService.setgCharset(1, a.DEFAULT_CHARSET), this._charsetService.setgCharset(2, a.DEFAULT_CHARSET), this._charsetService.setgCharset(3, a.DEFAULT_CHARSET);
                                break;
                            case 3:
                                this._optionsService.options.windowOptions.setWinLines && (this._bufferService.resize(132, this._bufferService.rows), this._onRequestReset.fire());
                                break;
                            case 6:
                                this._coreService.decPrivateModes.origin = !0, this._setCursor(0, 0);
                                break;
                            case 7:
                                this._coreService.decPrivateModes.wraparound = !0;
                                break;
                            case 12:
                                break;
                            case 45:
                                this._coreService.decPrivateModes.reverseWraparound = !0;
                                break;
                            case 66:
                                this._logService.debug("Serial port requested application keypad."), this._coreService.decPrivateModes.applicationKeypad = !0, this._onRequestSyncScrollBar.fire();
                                break;
                            case 9:
                                this._coreMouseService.activeProtocol = "X10";
                                break;
                            case 1e3:
                                this._coreMouseService.activeProtocol = "VT200";
                                break;
                            case 1002:
                                this._coreMouseService.activeProtocol = "DRAG";
                                break;
                            case 1003:
                                this._coreMouseService.activeProtocol = "ANY";
                                break;
                            case 1004:
                                this._coreService.decPrivateModes.sendFocus = !0;
                                break;
                            case 1005:
                                this._logService.debug("DECSET 1005 not supported (see #2507)");
                                break;
                            case 1006:
                                this._coreMouseService.activeEncoding = "SGR";
                                break;
                            case 1015:
                                this._logService.debug("DECSET 1015 not supported (see #2507)");
                                break;
                            case 25:
                                this._coreService.isCursorHidden = !1;
                                break;
                            case 1048:
                                this.saveCursor();
                                break;
                            case 1049:
                                this.saveCursor();
                            case 47:
                            case 1047:
                                this._bufferService.buffers.activateAltBuffer(this._eraseAttrData()), this._coreService.isCursorInitialized = !0, this._onRequestRefreshRows.fire(0, this._bufferService.rows - 1), this._onRequestSyncScrollBar.fire();
                                break;
                            case 2004:
                                this._coreService.decPrivateModes.bracketedPasteMode = !0
                        }
                        return !0
                    }, t.prototype.resetMode = function (e) {
                        for (var t = 0; t < e.length; t++) switch (e.params[t]) {
                            case 4:
                                this._coreService.modes.insertMode = !1
                        }
                        return !0
                    }, t.prototype.resetModePrivate = function (e) {
                        for (var t = 0; t < e.length; t++) switch (e.params[t]) {
                            case 1:
                                this._coreService.decPrivateModes.applicationCursorKeys = !1;
                                break;
                            case 3:
                                this._optionsService.options.windowOptions.setWinLines && (this._bufferService.resize(80, this._bufferService.rows), this._onRequestReset.fire());
                                break;
                            case 6:
                                this._coreService.decPrivateModes.origin = !1, this._setCursor(0, 0);
                                break;
                            case 7:
                                this._coreService.decPrivateModes.wraparound = !1;
                                break;
                            case 12:
                                break;
                            case 45:
                                this._coreService.decPrivateModes.reverseWraparound = !1;
                                break;
                            case 66:
                                this._logService.debug("Switching back to normal keypad."), this._coreService.decPrivateModes.applicationKeypad = !1, this._onRequestSyncScrollBar.fire();
                                break;
                            case 9:
                            case 1e3:
                            case 1002:
                            case 1003:
                                this._coreMouseService.activeProtocol = "NONE";
                                break;
                            case 1004:
                                this._coreService.decPrivateModes.sendFocus = !1;
                                break;
                            case 1005:
                                this._logService.debug("DECRST 1005 not supported (see #2507)");
                                break;
                            case 1006:
                                this._coreMouseService.activeEncoding = "DEFAULT";
                                break;
                            case 1015:
                                this._logService.debug("DECRST 1015 not supported (see #2507)");
                                break;
                            case 25:
                                this._coreService.isCursorHidden = !0;
                                break;
                            case 1048:
                                this.restoreCursor();
                                break;
                            case 1049:
                            case 47:
                            case 1047:
                                this._bufferService.buffers.activateNormalBuffer(), 1049 === e.params[t] && this.restoreCursor(), this._coreService.isCursorInitialized = !0, this._onRequestRefreshRows.fire(0, this._bufferService.rows - 1), this._onRequestSyncScrollBar.fire();
                                break;
                            case 2004:
                                this._coreService.decPrivateModes.bracketedPasteMode = !1
                        }
                        return !0
                    }, t.prototype._updateAttrColor = function (e, t, r, i, n) {
                        return 2 === t ? (e |= 50331648, e &= -16777216, e |= v.AttributeData.fromColorRGB([r, i, n])) : 5 === t && (e &= -50331904, e |= 33554432 | 255 & r), e
                    }, t.prototype._extractColor = function (e, t, r) {
                        var i = [0, 0, -1, 0, 0, 0], n = 0, o = 0;
                        do {
                            if (i[o + n] = e.params[t + o], e.hasSubParams(t + o)) {
                                var s = e.getSubParams(t + o), a = 0;
                                do {
                                    5 === i[1] && (n = 1), i[o + a + 1 + n] = s[a]
                                } while (++a < s.length && a + o + 1 + n < i.length);
                                break
                            }
                            if (5 === i[1] && o + n >= 2 || 2 === i[1] && o + n >= 5) break;
                            i[1] && (n = 1)
                        } while (++o + t < e.length && o + n < i.length);
                        for (a = 2; a < i.length; ++a) -1 === i[a] && (i[a] = 0);
                        switch (i[0]) {
                            case 38:
                                r.fg = this._updateAttrColor(r.fg, i[1], i[3], i[4], i[5]);
                                break;
                            case 48:
                                r.bg = this._updateAttrColor(r.bg, i[1], i[3], i[4], i[5]);
                                break;
                            case 58:
                                r.extended = r.extended.clone(), r.extended.underlineColor = this._updateAttrColor(r.extended.underlineColor, i[1], i[3], i[4], i[5])
                        }
                        return o
                    }, t.prototype._processUnderline = function (e, t) {
                        t.extended = t.extended.clone(), (!~e || e > 5) && (e = 1), t.extended.underlineStyle = e, t.fg |= 268435456, 0 === e && (t.fg &= -268435457), t.updateExtended()
                    }, t.prototype.charAttributes = function (e) {
                        if (1 === e.length && 0 === e.params[0]) return this._curAttrData.fg = f.DEFAULT_ATTR_DATA.fg, this._curAttrData.bg = f.DEFAULT_ATTR_DATA.bg, !0;
                        for (var t, r = e.length, i = this._curAttrData, n = 0; n < r; n++) (t = e.params[n]) >= 30 && t <= 37 ? (i.fg &= -50331904, i.fg |= 16777216 | t - 30) : t >= 40 && t <= 47 ? (i.bg &= -50331904, i.bg |= 16777216 | t - 40) : t >= 90 && t <= 97 ? (i.fg &= -50331904, i.fg |= 16777224 | t - 90) : t >= 100 && t <= 107 ? (i.bg &= -50331904, i.bg |= 16777224 | t - 100) : 0 === t ? (i.fg = f.DEFAULT_ATTR_DATA.fg, i.bg = f.DEFAULT_ATTR_DATA.bg) : 1 === t ? i.fg |= 134217728 : 3 === t ? i.bg |= 67108864 : 4 === t ? (i.fg |= 268435456, this._processUnderline(e.hasSubParams(n) ? e.getSubParams(n)[0] : 1, i)) : 5 === t ? i.fg |= 536870912 : 7 === t ? i.fg |= 67108864 : 8 === t ? i.fg |= 1073741824 : 2 === t ? i.bg |= 134217728 : 21 === t ? this._processUnderline(2, i) : 22 === t ? (i.fg &= -134217729, i.bg &= -134217729) : 23 === t ? i.bg &= -67108865 : 24 === t ? i.fg &= -268435457 : 25 === t ? i.fg &= -536870913 : 27 === t ? i.fg &= -67108865 : 28 === t ? i.fg &= -1073741825 : 39 === t ? (i.fg &= -67108864, i.fg |= 16777215 & f.DEFAULT_ATTR_DATA.fg) : 49 === t ? (i.bg &= -67108864, i.bg |= 16777215 & f.DEFAULT_ATTR_DATA.bg) : 38 === t || 48 === t || 58 === t ? n += this._extractColor(e, n, i) : 59 === t ? (i.extended = i.extended.clone(), i.extended.underlineColor = -1, i.updateExtended()) : 100 === t ? (i.fg &= -67108864, i.fg |= 16777215 & f.DEFAULT_ATTR_DATA.fg, i.bg &= -67108864, i.bg |= 16777215 & f.DEFAULT_ATTR_DATA.bg) : this._logService.debug("Unknown SGR attribute: %d.", t);
                        return !0
                    }, t.prototype.deviceStatus = function (e) {
                        switch (e.params[0]) {
                            case 5:
                                this._coreService.triggerDataEvent(s.C0.ESC + "[0n");
                                break;
                            case 6:
                                var t = this._bufferService.buffer.y + 1, r = this._bufferService.buffer.x + 1;
                                this._coreService.triggerDataEvent(s.C0.ESC + "[" + t + ";" + r + "R")
                        }
                        return !0
                    }, t.prototype.deviceStatusPrivate = function (e) {
                        switch (e.params[0]) {
                            case 6:
                                var t = this._bufferService.buffer.y + 1, r = this._bufferService.buffer.x + 1;
                                this._coreService.triggerDataEvent(s.C0.ESC + "[?" + t + ";" + r + "R")
                        }
                        return !0
                    }, t.prototype.softReset = function (e) {
                        return this._coreService.isCursorHidden = !1, this._onRequestSyncScrollBar.fire(), this._bufferService.buffer.scrollTop = 0, this._bufferService.buffer.scrollBottom = this._bufferService.rows - 1, this._curAttrData = f.DEFAULT_ATTR_DATA.clone(), this._coreService.reset(), this._charsetService.reset(), this._bufferService.buffer.savedX = 0, this._bufferService.buffer.savedY = this._bufferService.buffer.ybase, this._bufferService.buffer.savedCurAttrData.fg = this._curAttrData.fg, this._bufferService.buffer.savedCurAttrData.bg = this._curAttrData.bg, this._bufferService.buffer.savedCharset = this._charsetService.charset, this._coreService.decPrivateModes.origin = !1, !0
                    }, t.prototype.setCursorStyle = function (e) {
                        var t = e.params[0] || 1;
                        switch (t) {
                            case 1:
                            case 2:
                                this._optionsService.options.cursorStyle = "block";
                                break;
                            case 3:
                            case 4:
                                this._optionsService.options.cursorStyle = "underline";
                                break;
                            case 5:
                            case 6:
                                this._optionsService.options.cursorStyle = "bar"
                        }
                        var r = t % 2 == 1;
                        return this._optionsService.options.cursorBlink = r, !0
                    }, t.prototype.setScrollRegion = function (e) {
                        var t, r = e.params[0] || 1;
                        return (e.length < 2 || (t = e.params[1]) > this._bufferService.rows || 0 === t) && (t = this._bufferService.rows), t > r && (this._bufferService.buffer.scrollTop = r - 1, this._bufferService.buffer.scrollBottom = t - 1, this._setCursor(0, 0)), !0
                    }, t.prototype.windowOptions = function (e) {
                        if (!C(e.params[0], this._optionsService.options.windowOptions)) return !0;
                        var t = e.length > 1 ? e.params[1] : 0;
                        switch (e.params[0]) {
                            case 14:
                                2 !== t && this._onRequestWindowsOptionsReport.fire(o.GET_WIN_SIZE_PIXELS);
                                break;
                            case 16:
                                this._onRequestWindowsOptionsReport.fire(o.GET_CELL_SIZE_PIXELS);
                                break;
                            case 18:
                                this._bufferService && this._coreService.triggerDataEvent(s.C0.ESC + "[8;" + this._bufferService.rows + ";" + this._bufferService.cols + "t");
                                break;
                            case 22:
                                0 !== t && 2 !== t || (this._windowTitleStack.push(this._windowTitle), this._windowTitleStack.length > 10 && this._windowTitleStack.shift()), 0 !== t && 1 !== t || (this._iconNameStack.push(this._iconName), this._iconNameStack.length > 10 && this._iconNameStack.shift());
                                break;
                            case 23:
                                0 !== t && 2 !== t || this._windowTitleStack.length && this.setTitle(this._windowTitleStack.pop()), 0 !== t && 1 !== t || this._iconNameStack.length && this.setIconName(this._iconNameStack.pop())
                        }
                        return !0
                    }, t.prototype.saveCursor = function (e) {
                        return this._bufferService.buffer.savedX = this._bufferService.buffer.x, this._bufferService.buffer.savedY = this._bufferService.buffer.ybase + this._bufferService.buffer.y, this._bufferService.buffer.savedCurAttrData.fg = this._curAttrData.fg, this._bufferService.buffer.savedCurAttrData.bg = this._curAttrData.bg, this._bufferService.buffer.savedCharset = this._charsetService.charset, !0
                    }, t.prototype.restoreCursor = function (e) {
                        return this._bufferService.buffer.x = this._bufferService.buffer.savedX || 0, this._bufferService.buffer.y = Math.max(this._bufferService.buffer.savedY - this._bufferService.buffer.ybase, 0), this._curAttrData.fg = this._bufferService.buffer.savedCurAttrData.fg, this._curAttrData.bg = this._bufferService.buffer.savedCurAttrData.bg, this._charsetService.charset = this._savedCharset, this._bufferService.buffer.savedCharset && (this._charsetService.charset = this._bufferService.buffer.savedCharset), this._restrictCursor(), !0
                    }, t.prototype.setTitle = function (e) {
                        return this._windowTitle = e, this._onTitleChange.fire(e), !0
                    }, t.prototype.setIconName = function (e) {
                        return this._iconName = e, !0
                    }, t.prototype._parseAnsiColorChange = function (e) {
                        for (var t, r = {colors: []}, i = /(\d+);rgb:([\da-f]{2})\/([\da-f]{2})\/([\da-f]{2})/gi; null !== (t = i.exec(e));) r.colors.push({
                            colorIndex: parseInt(t[1]),
                            red: parseInt(t[2], 16),
                            green: parseInt(t[3], 16),
                            blue: parseInt(t[4], 16)
                        });
                        return 0 === r.colors.length ? null : r
                    }, t.prototype.setAnsiColor = function (e) {
                        var t = this._parseAnsiColorChange(e);
                        return t ? this._onAnsiColorChange.fire(t) : this._logService.warn("Expected format <num>;rgb:<rr>/<gg>/<bb> but got data: " + e), !0
                    }, t.prototype.nextLine = function () {
                        return this._bufferService.buffer.x = 0, this.index(), !0
                    }, t.prototype.keypadApplicationMode = function () {
                        return this._logService.debug("Serial port requested application keypad."), this._coreService.decPrivateModes.applicationKeypad = !0, this._onRequestSyncScrollBar.fire(), !0
                    }, t.prototype.keypadNumericMode = function () {
                        return this._logService.debug("Switching back to normal keypad."), this._coreService.decPrivateModes.applicationKeypad = !1, this._onRequestSyncScrollBar.fire(), !0
                    }, t.prototype.selectDefaultCharset = function () {
                        return this._charsetService.setgLevel(0), this._charsetService.setgCharset(0, a.DEFAULT_CHARSET), !0
                    }, t.prototype.selectCharset = function (e) {
                        return 2 !== e.length ? (this.selectDefaultCharset(), !0) : ("/" === e[0] || this._charsetService.setgCharset(S[e[0]], a.CHARSETS[e[1]] || a.DEFAULT_CHARSET), !0)
                    }, t.prototype.index = function () {
                        this._restrictCursor();
                        var e = this._bufferService.buffer;
                        return this._bufferService.buffer.y++, e.y === e.scrollBottom + 1 ? (e.y--, this._bufferService.scroll(this._eraseAttrData())) : e.y >= this._bufferService.rows && (e.y = this._bufferService.rows - 1), this._restrictCursor(), !0
                    }, t.prototype.tabSet = function () {
                        return this._bufferService.buffer.tabs[this._bufferService.buffer.x] = !0, !0
                    }, t.prototype.reverseIndex = function () {
                        this._restrictCursor();
                        var e = this._bufferService.buffer;
                        if (e.y === e.scrollTop) {
                            var t = e.scrollBottom - e.scrollTop;
                            e.lines.shiftElements(e.ybase + e.y, t, 1), e.lines.set(e.ybase + e.y, e.getBlankLine(this._eraseAttrData())), this._dirtyRowService.markRangeDirty(e.scrollTop, e.scrollBottom)
                        } else e.y--, this._restrictCursor();
                        return !0
                    }, t.prototype.fullReset = function () {
                        return this._parser.reset(), this._onRequestReset.fire(), !0
                    }, t.prototype.reset = function () {
                        this._curAttrData = f.DEFAULT_ATTR_DATA.clone(), this._eraseAttrDataInternal = f.DEFAULT_ATTR_DATA.clone()
                    }, t.prototype._eraseAttrData = function () {
                        return this._eraseAttrDataInternal.bg &= -67108864, this._eraseAttrDataInternal.bg |= 67108863 & this._curAttrData.bg, this._eraseAttrDataInternal
                    }, t.prototype.setgLevel = function (e) {
                        return this._charsetService.setgLevel(e), !0
                    }, t.prototype.screenAlignmentPattern = function () {
                        var e = new p.CellData;
                        e.content = 1 << 22 | "E".charCodeAt(0), e.fg = this._curAttrData.fg, e.bg = this._curAttrData.bg;
                        var t = this._bufferService.buffer;
                        this._setCursor(0, 0);
                        for (var r = 0; r < this._bufferService.rows; ++r) {
                            var i = t.ybase + t.y + r, n = t.lines.get(i);
                            n && (n.fill(e), n.isWrapped = !1)
                        }
                        return this._dirtyRowService.markAllDirty(), this._setCursor(0, 0), !0
                    }, t
                }(l.Disposable);
                t.InputHandler = E
            }, 844: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.getDisposeArrayDisposable = t.disposeArray = t.Disposable = void 0;
                var r = function () {
                    function e() {
                        this._disposables = [], this._isDisposed = !1
                    }

                    return e.prototype.dispose = function () {
                        this._isDisposed = !0;
                        for (var e = 0, t = this._disposables; e < t.length; e++) t[e].dispose();
                        this._disposables.length = 0
                    }, e.prototype.register = function (e) {
                        return this._disposables.push(e), e
                    }, e.prototype.unregister = function (e) {
                        var t = this._disposables.indexOf(e);
                        -1 !== t && this._disposables.splice(t, 1)
                    }, e
                }();

                function i(e) {
                    for (var t = 0, r = e; t < r.length; t++) r[t].dispose();
                    e.length = 0
                }

                t.Disposable = r, t.disposeArray = i, t.getDisposeArrayDisposable = function (e) {
                    return {
                        dispose: function () {
                            return i(e)
                        }
                    }
                }
            }, 6114: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.isLinux = t.isWindows = t.isIphone = t.isIpad = t.isMac = t.isSafari = t.isFirefox = void 0;
                var r = "undefined" == typeof navigator, i = r ? "node" : navigator.userAgent,
                    n = r ? "node" : navigator.platform;
                t.isFirefox = i.includes("Firefox"), t.isSafari = /^((?!chrome|android).)*safari/i.test(i), t.isMac = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].includes(n), t.isIpad = "iPad" === n, t.isIphone = "iPhone" === n, t.isWindows = ["Windows", "Win16", "Win32", "WinCE"].includes(n), t.isLinux = n.indexOf("Linux") >= 0
            }, 8273: (e, t) => {
                function r(e, t, r, i) {
                    if (void 0 === r && (r = 0), void 0 === i && (i = e.length), r >= e.length) return e;
                    r = (e.length + r) % e.length, i = i >= e.length ? e.length : (e.length + i) % e.length;
                    for (var n = r; n < i; ++n) e[n] = t;
                    return e
                }

                Object.defineProperty(t, "__esModule", {value: !0}), t.concat = t.fillFallback = t.fill = void 0, t.fill = function (e, t, i, n) {
                    return e.fill ? e.fill(t, i, n) : r(e, t, i, n)
                }, t.fillFallback = r, t.concat = function (e, t) {
                    var r = new e.constructor(e.length + t.length);
                    return r.set(e), r.set(t, e.length), r
                }
            }, 9282: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.updateWindowsModeWrappedState = void 0;
                var i = r(643);
                t.updateWindowsModeWrappedState = function (e) {
                    var t = e.buffer.lines.get(e.buffer.ybase + e.buffer.y - 1),
                        r = null == t ? void 0 : t.get(e.cols - 1), n = e.buffer.lines.get(e.buffer.ybase + e.buffer.y);
                    n && r && (n.isWrapped = r[i.CHAR_DATA_CODE_INDEX] !== i.NULL_CELL_CODE && r[i.CHAR_DATA_CODE_INDEX] !== i.WHITESPACE_CELL_CODE)
                }
            }, 3734: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.ExtendedAttrs = t.AttributeData = void 0;
                var r = function () {
                    function e() {
                        this.fg = 0, this.bg = 0, this.extended = new i
                    }

                    return e.toColorRGB = function (e) {
                        return [e >>> 16 & 255, e >>> 8 & 255, 255 & e]
                    }, e.fromColorRGB = function (e) {
                        return (255 & e[0]) << 16 | (255 & e[1]) << 8 | 255 & e[2]
                    }, e.prototype.clone = function () {
                        var t = new e;
                        return t.fg = this.fg, t.bg = this.bg, t.extended = this.extended.clone(), t
                    }, e.prototype.isInverse = function () {
                        return 67108864 & this.fg
                    }, e.prototype.isBold = function () {
                        return 134217728 & this.fg
                    }, e.prototype.isUnderline = function () {
                        return 268435456 & this.fg
                    }, e.prototype.isBlink = function () {
                        return 536870912 & this.fg
                    }, e.prototype.isInvisible = function () {
                        return 1073741824 & this.fg
                    }, e.prototype.isItalic = function () {
                        return 67108864 & this.bg
                    }, e.prototype.isDim = function () {
                        return 134217728 & this.bg
                    }, e.prototype.getFgColorMode = function () {
                        return 50331648 & this.fg
                    }, e.prototype.getBgColorMode = function () {
                        return 50331648 & this.bg
                    }, e.prototype.isFgRGB = function () {
                        return 50331648 == (50331648 & this.fg)
                    }, e.prototype.isBgRGB = function () {
                        return 50331648 == (50331648 & this.bg)
                    }, e.prototype.isFgPalette = function () {
                        return 16777216 == (50331648 & this.fg) || 33554432 == (50331648 & this.fg)
                    }, e.prototype.isBgPalette = function () {
                        return 16777216 == (50331648 & this.bg) || 33554432 == (50331648 & this.bg)
                    }, e.prototype.isFgDefault = function () {
                        return 0 == (50331648 & this.fg)
                    }, e.prototype.isBgDefault = function () {
                        return 0 == (50331648 & this.bg)
                    }, e.prototype.isAttributeDefault = function () {
                        return 0 === this.fg && 0 === this.bg
                    }, e.prototype.getFgColor = function () {
                        switch (50331648 & this.fg) {
                            case 16777216:
                            case 33554432:
                                return 255 & this.fg;
                            case 50331648:
                                return 16777215 & this.fg;
                            default:
                                return -1
                        }
                    }, e.prototype.getBgColor = function () {
                        switch (50331648 & this.bg) {
                            case 16777216:
                            case 33554432:
                                return 255 & this.bg;
                            case 50331648:
                                return 16777215 & this.bg;
                            default:
                                return -1
                        }
                    }, e.prototype.hasExtendedAttrs = function () {
                        return 268435456 & this.bg
                    }, e.prototype.updateExtended = function () {
                        this.extended.isEmpty() ? this.bg &= -268435457 : this.bg |= 268435456
                    }, e.prototype.getUnderlineColor = function () {
                        if (268435456 & this.bg && ~this.extended.underlineColor) switch (50331648 & this.extended.underlineColor) {
                            case 16777216:
                            case 33554432:
                                return 255 & this.extended.underlineColor;
                            case 50331648:
                                return 16777215 & this.extended.underlineColor;
                            default:
                                return this.getFgColor()
                        }
                        return this.getFgColor()
                    }, e.prototype.getUnderlineColorMode = function () {
                        return 268435456 & this.bg && ~this.extended.underlineColor ? 50331648 & this.extended.underlineColor : this.getFgColorMode()
                    }, e.prototype.isUnderlineColorRGB = function () {
                        return 268435456 & this.bg && ~this.extended.underlineColor ? 50331648 == (50331648 & this.extended.underlineColor) : this.isFgRGB()
                    }, e.prototype.isUnderlineColorPalette = function () {
                        return 268435456 & this.bg && ~this.extended.underlineColor ? 16777216 == (50331648 & this.extended.underlineColor) || 33554432 == (50331648 & this.extended.underlineColor) : this.isFgPalette()
                    }, e.prototype.isUnderlineColorDefault = function () {
                        return 268435456 & this.bg && ~this.extended.underlineColor ? 0 == (50331648 & this.extended.underlineColor) : this.isFgDefault()
                    }, e.prototype.getUnderlineStyle = function () {
                        return 268435456 & this.fg ? 268435456 & this.bg ? this.extended.underlineStyle : 1 : 0
                    }, e
                }();
                t.AttributeData = r;
                var i = function () {
                    function e(e, t) {
                        void 0 === e && (e = 0), void 0 === t && (t = -1), this.underlineStyle = e, this.underlineColor = t
                    }

                    return e.prototype.clone = function () {
                        return new e(this.underlineStyle, this.underlineColor)
                    }, e.prototype.isEmpty = function () {
                        return 0 === this.underlineStyle
                    }, e
                }();
                t.ExtendedAttrs = i
            }, 9092: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.BufferStringIterator = t.Buffer = t.MAX_BUFFER_SIZE = void 0;
                var i = r(6349), n = r(8437), o = r(511), s = r(643), a = r(4634), c = r(4863), l = r(7116),
                    h = r(3734);
                t.MAX_BUFFER_SIZE = 4294967295;
                var u = function () {
                    function e(e, t, r) {
                        this._hasScrollback = e, this._optionsService = t, this._bufferService = r, this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.savedY = 0, this.savedX = 0, this.savedCurAttrData = n.DEFAULT_ATTR_DATA.clone(), this.savedCharset = l.DEFAULT_CHARSET, this.markers = [], this._nullCell = o.CellData.fromCharData([0, s.NULL_CELL_CHAR, s.NULL_CELL_WIDTH, s.NULL_CELL_CODE]), this._whitespaceCell = o.CellData.fromCharData([0, s.WHITESPACE_CELL_CHAR, s.WHITESPACE_CELL_WIDTH, s.WHITESPACE_CELL_CODE]), this._cols = this._bufferService.cols, this._rows = this._bufferService.rows, this.lines = new i.CircularList(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops()
                    }

                    return e.prototype.getNullCell = function (e) {
                        return e ? (this._nullCell.fg = e.fg, this._nullCell.bg = e.bg, this._nullCell.extended = e.extended) : (this._nullCell.fg = 0, this._nullCell.bg = 0, this._nullCell.extended = new h.ExtendedAttrs), this._nullCell
                    }, e.prototype.getWhitespaceCell = function (e) {
                        return e ? (this._whitespaceCell.fg = e.fg, this._whitespaceCell.bg = e.bg, this._whitespaceCell.extended = e.extended) : (this._whitespaceCell.fg = 0, this._whitespaceCell.bg = 0, this._whitespaceCell.extended = new h.ExtendedAttrs), this._whitespaceCell
                    }, e.prototype.getBlankLine = function (e, t) {
                        return new n.BufferLine(this._bufferService.cols, this.getNullCell(e), t)
                    }, Object.defineProperty(e.prototype, "hasScrollback", {
                        get: function () {
                            return this._hasScrollback && this.lines.maxLength > this._rows
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "isCursorInViewport", {
                        get: function () {
                            var e = this.ybase + this.y - this.ydisp;
                            return e >= 0 && e < this._rows
                        }, enumerable: !1, configurable: !0
                    }), e.prototype._getCorrectBufferLength = function (e) {
                        if (!this._hasScrollback) return e;
                        var r = e + this._optionsService.options.scrollback;
                        return r > t.MAX_BUFFER_SIZE ? t.MAX_BUFFER_SIZE : r
                    }, e.prototype.fillViewportRows = function (e) {
                        if (0 === this.lines.length) {
                            void 0 === e && (e = n.DEFAULT_ATTR_DATA);
                            for (var t = this._rows; t--;) this.lines.push(this.getBlankLine(e))
                        }
                    }, e.prototype.clear = function () {
                        this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.lines = new i.CircularList(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops()
                    }, e.prototype.resize = function (e, t) {
                        var r = this.getNullCell(n.DEFAULT_ATTR_DATA), i = this._getCorrectBufferLength(t);
                        if (i > this.lines.maxLength && (this.lines.maxLength = i), this.lines.length > 0) {
                            if (this._cols < e) for (var o = 0; o < this.lines.length; o++) this.lines.get(o).resize(e, r);
                            var s = 0;
                            if (this._rows < t) for (var a = this._rows; a < t; a++) this.lines.length < t + this.ybase && (this._optionsService.options.windowsMode ? this.lines.push(new n.BufferLine(e, r)) : this.ybase > 0 && this.lines.length <= this.ybase + this.y + s + 1 ? (this.ybase--, s++, this.ydisp > 0 && this.ydisp--) : this.lines.push(new n.BufferLine(e, r))); else for (a = this._rows; a > t; a--) this.lines.length > t + this.ybase && (this.lines.length > this.ybase + this.y + 1 ? this.lines.pop() : (this.ybase++, this.ydisp++));
                            if (i < this.lines.maxLength) {
                                var c = this.lines.length - i;
                                c > 0 && (this.lines.trimStart(c), this.ybase = Math.max(this.ybase - c, 0), this.ydisp = Math.max(this.ydisp - c, 0), this.savedY = Math.max(this.savedY - c, 0)), this.lines.maxLength = i
                            }
                            this.x = Math.min(this.x, e - 1), this.y = Math.min(this.y, t - 1), s && (this.y += s), this.savedX = Math.min(this.savedX, e - 1), this.scrollTop = 0
                        }
                        if (this.scrollBottom = t - 1, this._isReflowEnabled && (this._reflow(e, t), this._cols > e)) for (o = 0; o < this.lines.length; o++) this.lines.get(o).resize(e, r);
                        this._cols = e, this._rows = t
                    }, Object.defineProperty(e.prototype, "_isReflowEnabled", {
                        get: function () {
                            return this._hasScrollback && !this._optionsService.options.windowsMode
                        }, enumerable: !1, configurable: !0
                    }), e.prototype._reflow = function (e, t) {
                        this._cols !== e && (e > this._cols ? this._reflowLarger(e, t) : this._reflowSmaller(e, t))
                    }, e.prototype._reflowLarger = function (e, t) {
                        var r = a.reflowLargerGetLinesToRemove(this.lines, this._cols, e, this.ybase + this.y, this.getNullCell(n.DEFAULT_ATTR_DATA));
                        if (r.length > 0) {
                            var i = a.reflowLargerCreateNewLayout(this.lines, r);
                            a.reflowLargerApplyNewLayout(this.lines, i.layout), this._reflowLargerAdjustViewport(e, t, i.countRemoved)
                        }
                    }, e.prototype._reflowLargerAdjustViewport = function (e, t, r) {
                        for (var i = this.getNullCell(n.DEFAULT_ATTR_DATA), o = r; o-- > 0;) 0 === this.ybase ? (this.y > 0 && this.y--, this.lines.length < t && this.lines.push(new n.BufferLine(e, i))) : (this.ydisp === this.ybase && this.ydisp--, this.ybase--);
                        this.savedY = Math.max(this.savedY - r, 0)
                    }, e.prototype._reflowSmaller = function (e, t) {
                        for (var r = this.getNullCell(n.DEFAULT_ATTR_DATA), i = [], o = 0, s = this.lines.length - 1; s >= 0; s--) {
                            var c = this.lines.get(s);
                            if (!(!c || !c.isWrapped && c.getTrimmedLength() <= e)) {
                                for (var l = [c]; c.isWrapped && s > 0;) c = this.lines.get(--s), l.unshift(c);
                                var h = this.ybase + this.y;
                                if (!(h >= s && h < s + l.length)) {
                                    var u, f = l[l.length - 1].getTrimmedLength(),
                                        _ = a.reflowSmallerGetNewLineLengths(l, this._cols, e), d = _.length - l.length;
                                    u = 0 === this.ybase && this.y !== this.lines.length - 1 ? Math.max(0, this.y - this.lines.maxLength + d) : Math.max(0, this.lines.length - this.lines.maxLength + d);
                                    for (var p = [], v = 0; v < d; v++) {
                                        var g = this.getBlankLine(n.DEFAULT_ATTR_DATA, !0);
                                        p.push(g)
                                    }
                                    p.length > 0 && (i.push({
                                        start: s + l.length + o,
                                        newLines: p
                                    }), o += p.length), l.push.apply(l, p);
                                    var y = _.length - 1, b = _[y];
                                    0 === b && (b = _[--y]);
                                    for (var S = l.length - d - 1, m = f; S >= 0;) {
                                        var C = Math.min(m, b);
                                        if (l[y].copyCellsFrom(l[S], m - C, b - C, C, !0), 0 == (b -= C) && (b = _[--y]), 0 == (m -= C)) {
                                            S--;
                                            var w = Math.max(S, 0);
                                            m = a.getWrappedLineTrimmedLength(l, w, this._cols)
                                        }
                                    }
                                    for (v = 0; v < l.length; v++) _[v] < e && l[v].setCell(_[v], r);
                                    for (var E = d - u; E-- > 0;) 0 === this.ybase ? this.y < t - 1 ? (this.y++, this.lines.pop()) : (this.ybase++, this.ydisp++) : this.ybase < Math.min(this.lines.maxLength, this.lines.length + o) - t && (this.ybase === this.ydisp && this.ydisp++, this.ybase++);
                                    this.savedY = Math.min(this.savedY + d, this.ybase + t - 1)
                                }
                            }
                        }
                        if (i.length > 0) {
                            var L = [], k = [];
                            for (v = 0; v < this.lines.length; v++) k.push(this.lines.get(v));
                            var A = this.lines.length, R = A - 1, x = 0, T = i[x];
                            this.lines.length = Math.min(this.lines.maxLength, this.lines.length + o);
                            var O = 0;
                            for (v = Math.min(this.lines.maxLength - 1, A + o - 1); v >= 0; v--) if (T && T.start > R + O) {
                                for (var D = T.newLines.length - 1; D >= 0; D--) this.lines.set(v--, T.newLines[D]);
                                v++, L.push({
                                    index: R + 1,
                                    amount: T.newLines.length
                                }), O += T.newLines.length, T = i[++x]
                            } else this.lines.set(v, k[R--]);
                            var P = 0;
                            for (v = L.length - 1; v >= 0; v--) L[v].index += P, this.lines.onInsertEmitter.fire(L[v]), P += L[v].amount;
                            var M = Math.max(0, A + o - this.lines.maxLength);
                            M > 0 && this.lines.onTrimEmitter.fire(M)
                        }
                    }, e.prototype.stringIndexToBufferIndex = function (e, t, r) {
                        for (void 0 === r && (r = !1); t;) {
                            var i = this.lines.get(e);
                            if (!i) return [-1, -1];
                            for (var n = r ? i.getTrimmedLength() : i.length, o = 0; o < n; ++o) if (i.get(o)[s.CHAR_DATA_WIDTH_INDEX] && (t -= i.get(o)[s.CHAR_DATA_CHAR_INDEX].length || 1), t < 0) return [e, o];
                            e++
                        }
                        return [e, 0]
                    }, e.prototype.translateBufferLineToString = function (e, t, r, i) {
                        void 0 === r && (r = 0);
                        var n = this.lines.get(e);
                        return n ? n.translateToString(t, r, i) : ""
                    }, e.prototype.getWrappedRangeForLine = function (e) {
                        for (var t = e, r = e; t > 0 && this.lines.get(t).isWrapped;) t--;
                        for (; r + 1 < this.lines.length && this.lines.get(r + 1).isWrapped;) r++;
                        return {first: t, last: r}
                    }, e.prototype.setupTabStops = function (e) {
                        for (null != e ? this.tabs[e] || (e = this.prevStop(e)) : (this.tabs = {}, e = 0); e < this._cols; e += this._optionsService.options.tabStopWidth) this.tabs[e] = !0
                    }, e.prototype.prevStop = function (e) {
                        for (null == e && (e = this.x); !this.tabs[--e] && e > 0;) ;
                        return e >= this._cols ? this._cols - 1 : e < 0 ? 0 : e
                    }, e.prototype.nextStop = function (e) {
                        for (null == e && (e = this.x); !this.tabs[++e] && e < this._cols;) ;
                        return e >= this._cols ? this._cols - 1 : e < 0 ? 0 : e
                    }, e.prototype.addMarker = function (e) {
                        var t = this, r = new c.Marker(e);
                        return this.markers.push(r), r.register(this.lines.onTrim((function (e) {
                            r.line -= e, r.line < 0 && r.dispose()
                        }))), r.register(this.lines.onInsert((function (e) {
                            r.line >= e.index && (r.line += e.amount)
                        }))), r.register(this.lines.onDelete((function (e) {
                            r.line >= e.index && r.line < e.index + e.amount && r.dispose(), r.line > e.index && (r.line -= e.amount)
                        }))), r.register(r.onDispose((function () {
                            return t._removeMarker(r)
                        }))), r
                    }, e.prototype._removeMarker = function (e) {
                        this.markers.splice(this.markers.indexOf(e), 1)
                    }, e.prototype.iterator = function (e, t, r, i, n) {
                        return new f(this, e, t, r, i, n)
                    }, e
                }();
                t.Buffer = u;
                var f = function () {
                    function e(e, t, r, i, n, o) {
                        void 0 === r && (r = 0), void 0 === i && (i = e.lines.length), void 0 === n && (n = 0), void 0 === o && (o = 0), this._buffer = e, this._trimRight = t, this._startIndex = r, this._endIndex = i, this._startOverscan = n, this._endOverscan = o, this._startIndex < 0 && (this._startIndex = 0), this._endIndex > this._buffer.lines.length && (this._endIndex = this._buffer.lines.length), this._current = this._startIndex
                    }

                    return e.prototype.hasNext = function () {
                        return this._current < this._endIndex
                    }, e.prototype.next = function () {
                        var e = this._buffer.getWrappedRangeForLine(this._current);
                        e.first < this._startIndex - this._startOverscan && (e.first = this._startIndex - this._startOverscan), e.last > this._endIndex + this._endOverscan && (e.last = this._endIndex + this._endOverscan), e.first = Math.max(e.first, 0), e.last = Math.min(e.last, this._buffer.lines.length);
                        for (var t = "", r = e.first; r <= e.last; ++r) t += this._buffer.translateBufferLineToString(r, this._trimRight);
                        return this._current = e.last + 1, {range: e, content: t}
                    }, e
                }();
                t.BufferStringIterator = f
            }, 8437: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.BufferLine = t.DEFAULT_ATTR_DATA = void 0;
                var i = r(482), n = r(643), o = r(511), s = r(3734);
                t.DEFAULT_ATTR_DATA = Object.freeze(new s.AttributeData);
                var a = function () {
                    function e(e, t, r) {
                        void 0 === r && (r = !1), this.isWrapped = r, this._combined = {}, this._extendedAttrs = {}, this._data = new Uint32Array(3 * e);
                        for (var i = t || o.CellData.fromCharData([0, n.NULL_CELL_CHAR, n.NULL_CELL_WIDTH, n.NULL_CELL_CODE]), s = 0; s < e; ++s) this.setCell(s, i);
                        this.length = e
                    }

                    return e.prototype.get = function (e) {
                        var t = this._data[3 * e + 0], r = 2097151 & t;
                        return [this._data[3 * e + 1], 2097152 & t ? this._combined[e] : r ? i.stringFromCodePoint(r) : "", t >> 22, 2097152 & t ? this._combined[e].charCodeAt(this._combined[e].length - 1) : r]
                    }, e.prototype.set = function (e, t) {
                        this._data[3 * e + 1] = t[n.CHAR_DATA_ATTR_INDEX], t[n.CHAR_DATA_CHAR_INDEX].length > 1 ? (this._combined[e] = t[1], this._data[3 * e + 0] = 2097152 | e | t[n.CHAR_DATA_WIDTH_INDEX] << 22) : this._data[3 * e + 0] = t[n.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | t[n.CHAR_DATA_WIDTH_INDEX] << 22
                    }, e.prototype.getWidth = function (e) {
                        return this._data[3 * e + 0] >> 22
                    }, e.prototype.hasWidth = function (e) {
                        return 12582912 & this._data[3 * e + 0]
                    }, e.prototype.getFg = function (e) {
                        return this._data[3 * e + 1]
                    }, e.prototype.getBg = function (e) {
                        return this._data[3 * e + 2]
                    }, e.prototype.hasContent = function (e) {
                        return 4194303 & this._data[3 * e + 0]
                    }, e.prototype.getCodePoint = function (e) {
                        var t = this._data[3 * e + 0];
                        return 2097152 & t ? this._combined[e].charCodeAt(this._combined[e].length - 1) : 2097151 & t
                    }, e.prototype.isCombined = function (e) {
                        return 2097152 & this._data[3 * e + 0]
                    }, e.prototype.getString = function (e) {
                        var t = this._data[3 * e + 0];
                        return 2097152 & t ? this._combined[e] : 2097151 & t ? i.stringFromCodePoint(2097151 & t) : ""
                    }, e.prototype.loadCell = function (e, t) {
                        var r = 3 * e;
                        return t.content = this._data[r + 0], t.fg = this._data[r + 1], t.bg = this._data[r + 2], 2097152 & t.content && (t.combinedData = this._combined[e]), 268435456 & t.bg && (t.extended = this._extendedAttrs[e]), t
                    }, e.prototype.setCell = function (e, t) {
                        2097152 & t.content && (this._combined[e] = t.combinedData), 268435456 & t.bg && (this._extendedAttrs[e] = t.extended), this._data[3 * e + 0] = t.content, this._data[3 * e + 1] = t.fg, this._data[3 * e + 2] = t.bg
                    }, e.prototype.setCellFromCodePoint = function (e, t, r, i, n, o) {
                        268435456 & n && (this._extendedAttrs[e] = o), this._data[3 * e + 0] = t | r << 22, this._data[3 * e + 1] = i, this._data[3 * e + 2] = n
                    }, e.prototype.addCodepointToCell = function (e, t) {
                        var r = this._data[3 * e + 0];
                        2097152 & r ? this._combined[e] += i.stringFromCodePoint(t) : (2097151 & r ? (this._combined[e] = i.stringFromCodePoint(2097151 & r) + i.stringFromCodePoint(t), r &= -2097152, r |= 2097152) : r = t | 1 << 22, this._data[3 * e + 0] = r)
                    }, e.prototype.insertCells = function (e, t, r, i) {
                        if ((e %= this.length) && 2 === this.getWidth(e - 1) && this.setCellFromCodePoint(e - 1, 0, 1, (null == i ? void 0 : i.fg) || 0, (null == i ? void 0 : i.bg) || 0, (null == i ? void 0 : i.extended) || new s.ExtendedAttrs), t < this.length - e) {
                            for (var n = new o.CellData, a = this.length - e - t - 1; a >= 0; --a) this.setCell(e + t + a, this.loadCell(e + a, n));
                            for (a = 0; a < t; ++a) this.setCell(e + a, r)
                        } else for (a = e; a < this.length; ++a) this.setCell(a, r);
                        2 === this.getWidth(this.length - 1) && this.setCellFromCodePoint(this.length - 1, 0, 1, (null == i ? void 0 : i.fg) || 0, (null == i ? void 0 : i.bg) || 0, (null == i ? void 0 : i.extended) || new s.ExtendedAttrs)
                    }, e.prototype.deleteCells = function (e, t, r, i) {
                        if (e %= this.length, t < this.length - e) {
                            for (var n = new o.CellData, a = 0; a < this.length - e - t; ++a) this.setCell(e + a, this.loadCell(e + t + a, n));
                            for (a = this.length - t; a < this.length; ++a) this.setCell(a, r)
                        } else for (a = e; a < this.length; ++a) this.setCell(a, r);
                        e && 2 === this.getWidth(e - 1) && this.setCellFromCodePoint(e - 1, 0, 1, (null == i ? void 0 : i.fg) || 0, (null == i ? void 0 : i.bg) || 0, (null == i ? void 0 : i.extended) || new s.ExtendedAttrs), 0 !== this.getWidth(e) || this.hasContent(e) || this.setCellFromCodePoint(e, 0, 1, (null == i ? void 0 : i.fg) || 0, (null == i ? void 0 : i.bg) || 0, (null == i ? void 0 : i.extended) || new s.ExtendedAttrs)
                    }, e.prototype.replaceCells = function (e, t, r, i) {
                        for (e && 2 === this.getWidth(e - 1) && this.setCellFromCodePoint(e - 1, 0, 1, (null == i ? void 0 : i.fg) || 0, (null == i ? void 0 : i.bg) || 0, (null == i ? void 0 : i.extended) || new s.ExtendedAttrs), t < this.length && 2 === this.getWidth(t - 1) && this.setCellFromCodePoint(t, 0, 1, (null == i ? void 0 : i.fg) || 0, (null == i ? void 0 : i.bg) || 0, (null == i ? void 0 : i.extended) || new s.ExtendedAttrs); e < t && e < this.length;) this.setCell(e++, r)
                    }, e.prototype.resize = function (e, t) {
                        if (e !== this.length) {
                            if (e > this.length) {
                                var r = new Uint32Array(3 * e);
                                this.length && (3 * e < this._data.length ? r.set(this._data.subarray(0, 3 * e)) : r.set(this._data)), this._data = r;
                                for (var i = this.length; i < e; ++i) this.setCell(i, t)
                            } else if (e) {
                                (r = new Uint32Array(3 * e)).set(this._data.subarray(0, 3 * e)), this._data = r;
                                var n = Object.keys(this._combined);
                                for (i = 0; i < n.length; i++) {
                                    var o = parseInt(n[i], 10);
                                    o >= e && delete this._combined[o]
                                }
                            } else this._data = new Uint32Array(0), this._combined = {};
                            this.length = e
                        }
                    }, e.prototype.fill = function (e) {
                        this._combined = {}, this._extendedAttrs = {};
                        for (var t = 0; t < this.length; ++t) this.setCell(t, e)
                    }, e.prototype.copyFrom = function (e) {
                        for (var t in this.length !== e.length ? this._data = new Uint32Array(e._data) : this._data.set(e._data), this.length = e.length, this._combined = {}, e._combined) this._combined[t] = e._combined[t];
                        for (var t in this._extendedAttrs = {}, e._extendedAttrs) this._extendedAttrs[t] = e._extendedAttrs[t];
                        this.isWrapped = e.isWrapped
                    }, e.prototype.clone = function () {
                        var t = new e(0);
                        for (var r in t._data = new Uint32Array(this._data), t.length = this.length, this._combined) t._combined[r] = this._combined[r];
                        for (var r in this._extendedAttrs) t._extendedAttrs[r] = this._extendedAttrs[r];
                        return t.isWrapped = this.isWrapped, t
                    }, e.prototype.getTrimmedLength = function () {
                        for (var e = this.length - 1; e >= 0; --e) if (4194303 & this._data[3 * e + 0]) return e + (this._data[3 * e + 0] >> 22);
                        return 0
                    }, e.prototype.copyCellsFrom = function (e, t, r, i, n) {
                        var o = e._data;
                        if (n) for (var s = i - 1; s >= 0; s--) for (var a = 0; a < 3; a++) this._data[3 * (r + s) + a] = o[3 * (t + s) + a]; else for (s = 0; s < i; s++) for (a = 0; a < 3; a++) this._data[3 * (r + s) + a] = o[3 * (t + s) + a];
                        var c = Object.keys(e._combined);
                        for (a = 0; a < c.length; a++) {
                            var l = parseInt(c[a], 10);
                            l >= t && (this._combined[l - t + r] = e._combined[l])
                        }
                    }, e.prototype.translateToString = function (e, t, r) {
                        void 0 === e && (e = !1), void 0 === t && (t = 0), void 0 === r && (r = this.length), e && (r = Math.min(r, this.getTrimmedLength()));
                        for (var o = ""; t < r;) {
                            var s = this._data[3 * t + 0], a = 2097151 & s;
                            o += 2097152 & s ? this._combined[t] : a ? i.stringFromCodePoint(a) : n.WHITESPACE_CELL_CHAR, t += s >> 22 || 1
                        }
                        return o
                    }, e
                }();
                t.BufferLine = a
            }, 4841: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.getRangeLength = void 0, t.getRangeLength = function (e, t) {
                    if (e.start.y > e.end.y) throw new Error("Buffer range end (" + e.end.x + ", " + e.end.y + ") cannot be before start (" + e.start.x + ", " + e.start.y + ")");
                    return t * (e.end.y - e.start.y) + (e.end.x - e.start.x + 1)
                }
            }, 4634: (e, t) => {
                function r(e, t, r) {
                    if (t === e.length - 1) return e[t].getTrimmedLength();
                    var i = !e[t].hasContent(r - 1) && 1 === e[t].getWidth(r - 1), n = 2 === e[t + 1].getWidth(0);
                    return i && n ? r - 1 : r
                }

                Object.defineProperty(t, "__esModule", {value: !0}), t.getWrappedLineTrimmedLength = t.reflowSmallerGetNewLineLengths = t.reflowLargerApplyNewLayout = t.reflowLargerCreateNewLayout = t.reflowLargerGetLinesToRemove = void 0, t.reflowLargerGetLinesToRemove = function (e, t, i, n, o) {
                    for (var s = [], a = 0; a < e.length - 1; a++) {
                        var c = a, l = e.get(++c);
                        if (l.isWrapped) {
                            for (var h = [e.get(a)]; c < e.length && l.isWrapped;) h.push(l), l = e.get(++c);
                            if (n >= a && n < c) a += h.length - 1; else {
                                for (var u = 0, f = r(h, u, t), _ = 1, d = 0; _ < h.length;) {
                                    var p = r(h, _, t), v = p - d, g = i - f, y = Math.min(v, g);
                                    h[u].copyCellsFrom(h[_], d, f, y, !1), (f += y) === i && (u++, f = 0), (d += y) === p && (_++, d = 0), 0 === f && 0 !== u && 2 === h[u - 1].getWidth(i - 1) && (h[u].copyCellsFrom(h[u - 1], i - 1, f++, 1, !1), h[u - 1].setCell(i - 1, o))
                                }
                                h[u].replaceCells(f, i, o);
                                for (var b = 0, S = h.length - 1; S > 0 && (S > u || 0 === h[S].getTrimmedLength()); S--) b++;
                                b > 0 && (s.push(a + h.length - b), s.push(b)), a += h.length - 1
                            }
                        }
                    }
                    return s
                }, t.reflowLargerCreateNewLayout = function (e, t) {
                    for (var r = [], i = 0, n = t[i], o = 0, s = 0; s < e.length; s++) if (n === s) {
                        var a = t[++i];
                        e.onDeleteEmitter.fire({index: s - o, amount: a}), s += a - 1, o += a, n = t[++i]
                    } else r.push(s);
                    return {layout: r, countRemoved: o}
                }, t.reflowLargerApplyNewLayout = function (e, t) {
                    for (var r = [], i = 0; i < t.length; i++) r.push(e.get(t[i]));
                    for (i = 0; i < r.length; i++) e.set(i, r[i]);
                    e.length = t.length
                }, t.reflowSmallerGetNewLineLengths = function (e, t, i) {
                    for (var n = [], o = e.map((function (i, n) {
                        return r(e, n, t)
                    })).reduce((function (e, t) {
                        return e + t
                    })), s = 0, a = 0, c = 0; c < o;) {
                        if (o - c < i) {
                            n.push(o - c);
                            break
                        }
                        s += i;
                        var l = r(e, a, t);
                        s > l && (s -= l, a++);
                        var h = 2 === e[a].getWidth(s - 1);
                        h && s--;
                        var u = h ? i - 1 : i;
                        n.push(u), c += u
                    }
                    return n
                }, t.getWrappedLineTrimmedLength = r
            }, 5295: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.BufferSet = void 0;
                var o = r(9092), s = r(8460), a = function (e) {
                    function t(t, r) {
                        var i = e.call(this) || this;
                        return i._optionsService = t, i._bufferService = r, i._onBufferActivate = i.register(new s.EventEmitter), i.reset(), i
                    }

                    return n(t, e), Object.defineProperty(t.prototype, "onBufferActivate", {
                        get: function () {
                            return this._onBufferActivate.event
                        }, enumerable: !1, configurable: !0
                    }), t.prototype.reset = function () {
                        this._normal = new o.Buffer(!0, this._optionsService, this._bufferService), this._normal.fillViewportRows(), this._alt = new o.Buffer(!1, this._optionsService, this._bufferService), this._activeBuffer = this._normal, this.setupTabStops()
                    }, Object.defineProperty(t.prototype, "alt", {
                        get: function () {
                            return this._alt
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "active", {
                        get: function () {
                            return this._activeBuffer
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "normal", {
                        get: function () {
                            return this._normal
                        }, enumerable: !1, configurable: !0
                    }), t.prototype.activateNormalBuffer = function () {
                        this._activeBuffer !== this._normal && (this._normal.x = this._alt.x, this._normal.y = this._alt.y, this._alt.clear(), this._activeBuffer = this._normal, this._onBufferActivate.fire({
                            activeBuffer: this._normal,
                            inactiveBuffer: this._alt
                        }))
                    }, t.prototype.activateAltBuffer = function (e) {
                        this._activeBuffer !== this._alt && (this._alt.fillViewportRows(e), this._alt.x = this._normal.x, this._alt.y = this._normal.y, this._activeBuffer = this._alt, this._onBufferActivate.fire({
                            activeBuffer: this._alt,
                            inactiveBuffer: this._normal
                        }))
                    }, t.prototype.resize = function (e, t) {
                        this._normal.resize(e, t), this._alt.resize(e, t)
                    }, t.prototype.setupTabStops = function (e) {
                        this._normal.setupTabStops(e), this._alt.setupTabStops(e)
                    }, t
                }(r(844).Disposable);
                t.BufferSet = a
            }, 511: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.CellData = void 0;
                var o = r(482), s = r(643), a = r(3734), c = function (e) {
                    function t() {
                        var t = null !== e && e.apply(this, arguments) || this;
                        return t.content = 0, t.fg = 0, t.bg = 0, t.extended = new a.ExtendedAttrs, t.combinedData = "", t
                    }

                    return n(t, e), t.fromCharData = function (e) {
                        var r = new t;
                        return r.setFromCharData(e), r
                    }, t.prototype.isCombined = function () {
                        return 2097152 & this.content
                    }, t.prototype.getWidth = function () {
                        return this.content >> 22
                    }, t.prototype.getChars = function () {
                        return 2097152 & this.content ? this.combinedData : 2097151 & this.content ? o.stringFromCodePoint(2097151 & this.content) : ""
                    }, t.prototype.getCode = function () {
                        return this.isCombined() ? this.combinedData.charCodeAt(this.combinedData.length - 1) : 2097151 & this.content
                    }, t.prototype.setFromCharData = function (e) {
                        this.fg = e[s.CHAR_DATA_ATTR_INDEX], this.bg = 0;
                        var t = !1;
                        if (e[s.CHAR_DATA_CHAR_INDEX].length > 2) t = !0; else if (2 === e[s.CHAR_DATA_CHAR_INDEX].length) {
                            var r = e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(0);
                            if (55296 <= r && r <= 56319) {
                                var i = e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(1);
                                56320 <= i && i <= 57343 ? this.content = 1024 * (r - 55296) + i - 56320 + 65536 | e[s.CHAR_DATA_WIDTH_INDEX] << 22 : t = !0
                            } else t = !0
                        } else this.content = e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | e[s.CHAR_DATA_WIDTH_INDEX] << 22;
                        t && (this.combinedData = e[s.CHAR_DATA_CHAR_INDEX], this.content = 2097152 | e[s.CHAR_DATA_WIDTH_INDEX] << 22)
                    }, t.prototype.getAsCharData = function () {
                        return [this.fg, this.getChars(), this.getWidth(), this.getCode()]
                    }, t
                }(a.AttributeData);
                t.CellData = c
            }, 643: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.WHITESPACE_CELL_CODE = t.WHITESPACE_CELL_WIDTH = t.WHITESPACE_CELL_CHAR = t.NULL_CELL_CODE = t.NULL_CELL_WIDTH = t.NULL_CELL_CHAR = t.CHAR_DATA_CODE_INDEX = t.CHAR_DATA_WIDTH_INDEX = t.CHAR_DATA_CHAR_INDEX = t.CHAR_DATA_ATTR_INDEX = t.DEFAULT_ATTR = t.DEFAULT_COLOR = void 0, t.DEFAULT_COLOR = 256, t.DEFAULT_ATTR = 256 | t.DEFAULT_COLOR << 9, t.CHAR_DATA_ATTR_INDEX = 0, t.CHAR_DATA_CHAR_INDEX = 1, t.CHAR_DATA_WIDTH_INDEX = 2, t.CHAR_DATA_CODE_INDEX = 3, t.NULL_CELL_CHAR = "", t.NULL_CELL_WIDTH = 1, t.NULL_CELL_CODE = 0, t.WHITESPACE_CELL_CHAR = " ", t.WHITESPACE_CELL_WIDTH = 1, t.WHITESPACE_CELL_CODE = 32
            }, 4863: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.Marker = void 0;
                var o = r(8460), s = function (e) {
                    function t(r) {
                        var i = e.call(this) || this;
                        return i.line = r, i._id = t._nextId++, i.isDisposed = !1, i._onDispose = new o.EventEmitter, i
                    }

                    return n(t, e), Object.defineProperty(t.prototype, "id", {
                        get: function () {
                            return this._id
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(t.prototype, "onDispose", {
                        get: function () {
                            return this._onDispose.event
                        }, enumerable: !1, configurable: !0
                    }), t.prototype.dispose = function () {
                        this.isDisposed || (this.isDisposed = !0, this.line = -1, this._onDispose.fire(), e.prototype.dispose.call(this))
                    }, t._nextId = 1, t
                }(r(844).Disposable);
                t.Marker = s
            }, 7116: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.DEFAULT_CHARSET = t.CHARSETS = void 0, t.CHARSETS = {}, t.DEFAULT_CHARSET = t.CHARSETS.B, t.CHARSETS[0] = {
                    "`": "◆",
                    a: "▒",
                    b: "␉",
                    c: "␌",
                    d: "␍",
                    e: "␊",
                    f: "°",
                    g: "±",
                    h: "␤",
                    i: "␋",
                    j: "┘",
                    k: "┐",
                    l: "┌",
                    m: "└",
                    n: "┼",
                    o: "⎺",
                    p: "⎻",
                    q: "─",
                    r: "⎼",
                    s: "⎽",
                    t: "├",
                    u: "┤",
                    v: "┴",
                    w: "┬",
                    x: "│",
                    y: "≤",
                    z: "≥",
                    "{": "π",
                    "|": "≠",
                    "}": "£",
                    "~": "·"
                }, t.CHARSETS.A = {"#": "£"}, t.CHARSETS.B = void 0, t.CHARSETS[4] = {
                    "#": "£",
                    "@": "¾",
                    "[": "ij",
                    "\\": "½",
                    "]": "|",
                    "{": "¨",
                    "|": "f",
                    "}": "¼",
                    "~": "´"
                }, t.CHARSETS.C = t.CHARSETS[5] = {
                    "[": "Ä",
                    "\\": "Ö",
                    "]": "Å",
                    "^": "Ü",
                    "`": "é",
                    "{": "ä",
                    "|": "ö",
                    "}": "å",
                    "~": "ü"
                }, t.CHARSETS.R = {
                    "#": "£",
                    "@": "à",
                    "[": "°",
                    "\\": "ç",
                    "]": "§",
                    "{": "é",
                    "|": "ù",
                    "}": "è",
                    "~": "¨"
                }, t.CHARSETS.Q = {
                    "@": "à",
                    "[": "â",
                    "\\": "ç",
                    "]": "ê",
                    "^": "î",
                    "`": "ô",
                    "{": "é",
                    "|": "ù",
                    "}": "è",
                    "~": "û"
                }, t.CHARSETS.K = {
                    "@": "§",
                    "[": "Ä",
                    "\\": "Ö",
                    "]": "Ü",
                    "{": "ä",
                    "|": "ö",
                    "}": "ü",
                    "~": "ß"
                }, t.CHARSETS.Y = {
                    "#": "£",
                    "@": "§",
                    "[": "°",
                    "\\": "ç",
                    "]": "é",
                    "`": "ù",
                    "{": "à",
                    "|": "ò",
                    "}": "è",
                    "~": "ì"
                }, t.CHARSETS.E = t.CHARSETS[6] = {
                    "@": "Ä",
                    "[": "Æ",
                    "\\": "Ø",
                    "]": "Å",
                    "^": "Ü",
                    "`": "ä",
                    "{": "æ",
                    "|": "ø",
                    "}": "å",
                    "~": "ü"
                }, t.CHARSETS.Z = {
                    "#": "£",
                    "@": "§",
                    "[": "¡",
                    "\\": "Ñ",
                    "]": "¿",
                    "{": "°",
                    "|": "ñ",
                    "}": "ç"
                }, t.CHARSETS.H = t.CHARSETS[7] = {
                    "@": "É",
                    "[": "Ä",
                    "\\": "Ö",
                    "]": "Å",
                    "^": "Ü",
                    "`": "é",
                    "{": "ä",
                    "|": "ö",
                    "}": "å",
                    "~": "ü"
                }, t.CHARSETS["="] = {
                    "#": "ù",
                    "@": "à",
                    "[": "é",
                    "\\": "ç",
                    "]": "ê",
                    "^": "î",
                    _: "è",
                    "`": "ô",
                    "{": "ä",
                    "|": "ö",
                    "}": "ü",
                    "~": "û"
                }
            }, 2584: (e, t) => {
                var r, i;
                Object.defineProperty(t, "__esModule", {value: !0}), t.C1 = t.C0 = void 0, (i = t.C0 || (t.C0 = {})).NUL = "\0", i.SOH = "", i.STX = "", i.ETX = "", i.EOT = "", i.ENQ = "", i.ACK = "", i.BEL = "", i.BS = "\b", i.HT = "\t", i.LF = "\n", i.VT = "\v", i.FF = "\f", i.CR = "\r", i.SO = "", i.SI = "", i.DLE = "", i.DC1 = "", i.DC2 = "", i.DC3 = "", i.DC4 = "", i.NAK = "", i.SYN = "", i.ETB = "", i.CAN = "", i.EM = "", i.SUB = "", i.ESC = "", i.FS = "", i.GS = "", i.RS = "", i.US = "", i.SP = " ", i.DEL = "", (r = t.C1 || (t.C1 = {})).PAD = "", r.HOP = "", r.BPH = "", r.NBH = "", r.IND = "", r.NEL = "", r.SSA = "", r.ESA = "", r.HTS = "", r.HTJ = "", r.VTS = "", r.PLD = "", r.PLU = "", r.RI = "", r.SS2 = "", r.SS3 = "", r.DCS = "", r.PU1 = "", r.PU2 = "", r.STS = "", r.CCH = "", r.MW = "", r.SPA = "", r.EPA = "", r.SOS = "", r.SGCI = "", r.SCI = "", r.CSI = "", r.ST = "", r.OSC = "", r.PM = "", r.APC = ""
            }, 7399: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.evaluateKeyboardEvent = void 0;
                var i = r(2584), n = {
                    48: ["0", ")"],
                    49: ["1", "!"],
                    50: ["2", "@"],
                    51: ["3", "#"],
                    52: ["4", "$"],
                    53: ["5", "%"],
                    54: ["6", "^"],
                    55: ["7", "&"],
                    56: ["8", "*"],
                    57: ["9", "("],
                    186: [";", ":"],
                    187: ["=", "+"],
                    188: [",", "<"],
                    189: ["-", "_"],
                    190: [".", ">"],
                    191: ["/", "?"],
                    192: ["`", "~"],
                    219: ["[", "{"],
                    220: ["\\", "|"],
                    221: ["]", "}"],
                    222: ["'", '"']
                };
                t.evaluateKeyboardEvent = function (e, t, r, o) {
                    var s = {type: 0, cancel: !1, key: void 0},
                        a = (e.shiftKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.ctrlKey ? 4 : 0) | (e.metaKey ? 8 : 0);
                    switch (e.keyCode) {
                        case 0:
                            "UIKeyInputUpArrow" === e.key ? s.key = t ? i.C0.ESC + "OA" : i.C0.ESC + "[A" : "UIKeyInputLeftArrow" === e.key ? s.key = t ? i.C0.ESC + "OD" : i.C0.ESC + "[D" : "UIKeyInputRightArrow" === e.key ? s.key = t ? i.C0.ESC + "OC" : i.C0.ESC + "[C" : "UIKeyInputDownArrow" === e.key && (s.key = t ? i.C0.ESC + "OB" : i.C0.ESC + "[B");
                            break;
                        case 8:
                            if (e.shiftKey) {
                                s.key = i.C0.BS;
                                break
                            }
                            if (e.altKey) {
                                s.key = i.C0.ESC + i.C0.DEL;
                                break
                            }
                            s.key = i.C0.DEL;
                            break;
                        case 9:
                            if (e.shiftKey) {
                                s.key = i.C0.ESC + "[Z";
                                break
                            }
                            s.key = i.C0.HT, s.cancel = !0;
                            break;
                        case 13:
                            s.key = e.altKey ? i.C0.ESC + i.C0.CR : i.C0.CR, s.cancel = !0;
                            break;
                        case 27:
                            s.key = i.C0.ESC, e.altKey && (s.key = i.C0.ESC + i.C0.ESC), s.cancel = !0;
                            break;
                        case 37:
                            if (e.metaKey) break;
                            a ? (s.key = i.C0.ESC + "[1;" + (a + 1) + "D", s.key === i.C0.ESC + "[1;3D" && (s.key = i.C0.ESC + (r ? "b" : "[1;5D"))) : s.key = t ? i.C0.ESC + "OD" : i.C0.ESC + "[D";
                            break;
                        case 39:
                            if (e.metaKey) break;
                            a ? (s.key = i.C0.ESC + "[1;" + (a + 1) + "C", s.key === i.C0.ESC + "[1;3C" && (s.key = i.C0.ESC + (r ? "f" : "[1;5C"))) : s.key = t ? i.C0.ESC + "OC" : i.C0.ESC + "[C";
                            break;
                        case 38:
                            if (e.metaKey) break;
                            a ? (s.key = i.C0.ESC + "[1;" + (a + 1) + "A", r || s.key !== i.C0.ESC + "[1;3A" || (s.key = i.C0.ESC + "[1;5A")) : s.key = t ? i.C0.ESC + "OA" : i.C0.ESC + "[A";
                            break;
                        case 40:
                            if (e.metaKey) break;
                            a ? (s.key = i.C0.ESC + "[1;" + (a + 1) + "B", r || s.key !== i.C0.ESC + "[1;3B" || (s.key = i.C0.ESC + "[1;5B")) : s.key = t ? i.C0.ESC + "OB" : i.C0.ESC + "[B";
                            break;
                        case 45:
                            e.shiftKey || e.ctrlKey || (s.key = i.C0.ESC + "[2~");
                            break;
                        case 46:
                            s.key = a ? i.C0.ESC + "[3;" + (a + 1) + "~" : i.C0.ESC + "[3~";
                            break;
                        case 36:
                            s.key = a ? i.C0.ESC + "[1;" + (a + 1) + "H" : t ? i.C0.ESC + "OH" : i.C0.ESC + "[H";
                            break;
                        case 35:
                            s.key = a ? i.C0.ESC + "[1;" + (a + 1) + "F" : t ? i.C0.ESC + "OF" : i.C0.ESC + "[F";
                            break;
                        case 33:
                            e.shiftKey ? s.type = 2 : s.key = i.C0.ESC + "[5~";
                            break;
                        case 34:
                            e.shiftKey ? s.type = 3 : s.key = i.C0.ESC + "[6~";
                            break;
                        case 112:
                            s.key = a ? i.C0.ESC + "[1;" + (a + 1) + "P" : i.C0.ESC + "OP";
                            break;
                        case 113:
                            s.key = a ? i.C0.ESC + "[1;" + (a + 1) + "Q" : i.C0.ESC + "OQ";
                            break;
                        case 114:
                            s.key = a ? i.C0.ESC + "[1;" + (a + 1) + "R" : i.C0.ESC + "OR";
                            break;
                        case 115:
                            s.key = a ? i.C0.ESC + "[1;" + (a + 1) + "S" : i.C0.ESC + "OS";
                            break;
                        case 116:
                            s.key = a ? i.C0.ESC + "[15;" + (a + 1) + "~" : i.C0.ESC + "[15~";
                            break;
                        case 117:
                            s.key = a ? i.C0.ESC + "[17;" + (a + 1) + "~" : i.C0.ESC + "[17~";
                            break;
                        case 118:
                            s.key = a ? i.C0.ESC + "[18;" + (a + 1) + "~" : i.C0.ESC + "[18~";
                            break;
                        case 119:
                            s.key = a ? i.C0.ESC + "[19;" + (a + 1) + "~" : i.C0.ESC + "[19~";
                            break;
                        case 120:
                            s.key = a ? i.C0.ESC + "[20;" + (a + 1) + "~" : i.C0.ESC + "[20~";
                            break;
                        case 121:
                            s.key = a ? i.C0.ESC + "[21;" + (a + 1) + "~" : i.C0.ESC + "[21~";
                            break;
                        case 122:
                            s.key = a ? i.C0.ESC + "[23;" + (a + 1) + "~" : i.C0.ESC + "[23~";
                            break;
                        case 123:
                            s.key = a ? i.C0.ESC + "[24;" + (a + 1) + "~" : i.C0.ESC + "[24~";
                            break;
                        default:
                            if (!e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) if (r && !o || !e.altKey || e.metaKey) !r || e.altKey || e.ctrlKey || e.shiftKey || !e.metaKey ? e.key && !e.ctrlKey && !e.altKey && !e.metaKey && e.keyCode >= 48 && 1 === e.key.length ? s.key = e.key : e.key && e.ctrlKey && "_" === e.key && (s.key = i.C0.US) : 65 === e.keyCode && (s.type = 1); else {
                                var c = n[e.keyCode], l = c && c[e.shiftKey ? 1 : 0];
                                if (l) s.key = i.C0.ESC + l; else if (e.keyCode >= 65 && e.keyCode <= 90) {
                                    var h = e.ctrlKey ? e.keyCode - 64 : e.keyCode + 32;
                                    s.key = i.C0.ESC + String.fromCharCode(h)
                                }
                            } else e.keyCode >= 65 && e.keyCode <= 90 ? s.key = String.fromCharCode(e.keyCode - 64) : 32 === e.keyCode ? s.key = i.C0.NUL : e.keyCode >= 51 && e.keyCode <= 55 ? s.key = String.fromCharCode(e.keyCode - 51 + 27) : 56 === e.keyCode ? s.key = i.C0.DEL : 219 === e.keyCode ? s.key = i.C0.ESC : 220 === e.keyCode ? s.key = i.C0.FS : 221 === e.keyCode && (s.key = i.C0.GS)
                    }
                    return s
                }
            }, 482: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.Utf8ToUtf32 = t.StringToUtf32 = t.utf32ToString = t.stringFromCodePoint = void 0, t.stringFromCodePoint = function (e) {
                    return e > 65535 ? (e -= 65536, String.fromCharCode(55296 + (e >> 10)) + String.fromCharCode(e % 1024 + 56320)) : String.fromCharCode(e)
                }, t.utf32ToString = function (e, t, r) {
                    void 0 === t && (t = 0), void 0 === r && (r = e.length);
                    for (var i = "", n = t; n < r; ++n) {
                        var o = e[n];
                        o > 65535 ? (o -= 65536, i += String.fromCharCode(55296 + (o >> 10)) + String.fromCharCode(o % 1024 + 56320)) : i += String.fromCharCode(o)
                    }
                    return i
                };
                var r = function () {
                    function e() {
                        this._interim = 0
                    }

                    return e.prototype.clear = function () {
                        this._interim = 0
                    }, e.prototype.decode = function (e, t) {
                        var r = e.length;
                        if (!r) return 0;
                        var i = 0, n = 0;
                        this._interim && (56320 <= (a = e.charCodeAt(n++)) && a <= 57343 ? t[i++] = 1024 * (this._interim - 55296) + a - 56320 + 65536 : (t[i++] = this._interim, t[i++] = a), this._interim = 0);
                        for (var o = n; o < r; ++o) {
                            var s = e.charCodeAt(o);
                            if (55296 <= s && s <= 56319) {
                                if (++o >= r) return this._interim = s, i;
                                var a;
                                56320 <= (a = e.charCodeAt(o)) && a <= 57343 ? t[i++] = 1024 * (s - 55296) + a - 56320 + 65536 : (t[i++] = s, t[i++] = a)
                            } else 65279 !== s && (t[i++] = s)
                        }
                        return i
                    }, e
                }();
                t.StringToUtf32 = r;
                var i = function () {
                    function e() {
                        this.interim = new Uint8Array(3)
                    }

                    return e.prototype.clear = function () {
                        this.interim.fill(0)
                    }, e.prototype.decode = function (e, t) {
                        var r = e.length;
                        if (!r) return 0;
                        var i, n, o, s, a = 0, c = 0, l = 0;
                        if (this.interim[0]) {
                            var h = !1, u = this.interim[0];
                            u &= 192 == (224 & u) ? 31 : 224 == (240 & u) ? 15 : 7;
                            for (var f = 0, _ = void 0; (_ = 63 & this.interim[++f]) && f < 4;) u <<= 6, u |= _;
                            for (var d = 192 == (224 & this.interim[0]) ? 2 : 224 == (240 & this.interim[0]) ? 3 : 4, p = d - f; l < p;) {
                                if (l >= r) return 0;
                                if (128 != (192 & (_ = e[l++]))) {
                                    l--, h = !0;
                                    break
                                }
                                this.interim[f++] = _, u <<= 6, u |= 63 & _
                            }
                            h || (2 === d ? u < 128 ? l-- : t[a++] = u : 3 === d ? u < 2048 || u >= 55296 && u <= 57343 || 65279 === u || (t[a++] = u) : u < 65536 || u > 1114111 || (t[a++] = u)), this.interim.fill(0)
                        }
                        for (var v = r - 4, g = l; g < r;) {
                            for (; !(!(g < v) || 128 & (i = e[g]) || 128 & (n = e[g + 1]) || 128 & (o = e[g + 2]) || 128 & (s = e[g + 3]));) t[a++] = i, t[a++] = n, t[a++] = o, t[a++] = s, g += 4;
                            if ((i = e[g++]) < 128) t[a++] = i; else if (192 == (224 & i)) {
                                if (g >= r) return this.interim[0] = i, a;
                                if (128 != (192 & (n = e[g++]))) {
                                    g--;
                                    continue
                                }
                                if ((c = (31 & i) << 6 | 63 & n) < 128) {
                                    g--;
                                    continue
                                }
                                t[a++] = c
                            } else if (224 == (240 & i)) {
                                if (g >= r) return this.interim[0] = i, a;
                                if (128 != (192 & (n = e[g++]))) {
                                    g--;
                                    continue
                                }
                                if (g >= r) return this.interim[0] = i, this.interim[1] = n, a;
                                if (128 != (192 & (o = e[g++]))) {
                                    g--;
                                    continue
                                }
                                if ((c = (15 & i) << 12 | (63 & n) << 6 | 63 & o) < 2048 || c >= 55296 && c <= 57343 || 65279 === c) continue;
                                t[a++] = c
                            } else if (240 == (248 & i)) {
                                if (g >= r) return this.interim[0] = i, a;
                                if (128 != (192 & (n = e[g++]))) {
                                    g--;
                                    continue
                                }
                                if (g >= r) return this.interim[0] = i, this.interim[1] = n, a;
                                if (128 != (192 & (o = e[g++]))) {
                                    g--;
                                    continue
                                }
                                if (g >= r) return this.interim[0] = i, this.interim[1] = n, this.interim[2] = o, a;
                                if (128 != (192 & (s = e[g++]))) {
                                    g--;
                                    continue
                                }
                                if ((c = (7 & i) << 18 | (63 & n) << 12 | (63 & o) << 6 | 63 & s) < 65536 || c > 1114111) continue;
                                t[a++] = c
                            }
                        }
                        return a
                    }, e
                }();
                t.Utf8ToUtf32 = i
            }, 225: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.UnicodeV6 = void 0;
                var i, n = r(8273),
                    o = [[768, 879], [1155, 1158], [1160, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1536, 1539], [1552, 1557], [1611, 1630], [1648, 1648], [1750, 1764], [1767, 1768], [1770, 1773], [1807, 1807], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2305, 2306], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2388], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2672, 2673], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2883], [2893, 2893], [2902, 2902], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3395], [3405, 3405], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3984, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4146], [4150, 4151], [4153, 4153], [4184, 4185], [4448, 4607], [4959, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7616, 7626], [7678, 7679], [8203, 8207], [8234, 8238], [8288, 8291], [8298, 8303], [8400, 8431], [12330, 12335], [12441, 12442], [43014, 43014], [43019, 43019], [43045, 43046], [64286, 64286], [65024, 65039], [65056, 65059], [65279, 65279], [65529, 65531]],
                    s = [[68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [119143, 119145], [119155, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]],
                    a = function () {
                        function e() {
                            if (this.version = "6", !i) {
                                i = new Uint8Array(65536), n.fill(i, 1), i[0] = 0, n.fill(i, 0, 1, 32), n.fill(i, 0, 127, 160), n.fill(i, 2, 4352, 4448), i[9001] = 2, i[9002] = 2, n.fill(i, 2, 11904, 42192), i[12351] = 1, n.fill(i, 2, 44032, 55204), n.fill(i, 2, 63744, 64256), n.fill(i, 2, 65040, 65050), n.fill(i, 2, 65072, 65136), n.fill(i, 2, 65280, 65377), n.fill(i, 2, 65504, 65511);
                                for (var e = 0; e < o.length; ++e) n.fill(i, 0, o[e][0], o[e][1] + 1)
                            }
                        }

                        return e.prototype.wcwidth = function (e) {
                            return e < 32 ? 0 : e < 127 ? 1 : e < 65536 ? i[e] : function (e, t) {
                                var r, i = 0, n = t.length - 1;
                                if (e < t[0][0] || e > t[n][1]) return !1;
                                for (; n >= i;) if (e > t[r = i + n >> 1][1]) i = r + 1; else {
                                    if (!(e < t[r][0])) return !0;
                                    n = r - 1
                                }
                                return !1
                            }(e, s) ? 0 : e >= 131072 && e <= 196605 || e >= 196608 && e <= 262141 ? 2 : 1
                        }, e
                    }();
                t.UnicodeV6 = a
            }, 5981: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.WriteBuffer = void 0;
                var r = "undefined" == typeof queueMicrotask ? function (e) {
                    Promise.resolve().then(e)
                } : queueMicrotask, i = function () {
                    function e(e) {
                        this._action = e, this._writeBuffer = [], this._callbacks = [], this._pendingData = 0, this._bufferOffset = 0, this._isSyncWriting = !1, this._syncCalls = 0
                    }

                    return e.prototype.writeSync = function (e, t) {
                        if (void 0 !== t && this._syncCalls > t) this._syncCalls = 0; else if (this._pendingData += e.length, this._writeBuffer.push(e), this._callbacks.push(void 0), this._syncCalls++, !this._isSyncWriting) {
                            var r;
                            for (this._isSyncWriting = !0; r = this._writeBuffer.shift();) {
                                this._action(r);
                                var i = this._callbacks.shift();
                                i && i()
                            }
                            this._pendingData = 0, this._bufferOffset = 2147483647, this._isSyncWriting = !1, this._syncCalls = 0
                        }
                    }, e.prototype.write = function (e, t) {
                        var r = this;
                        if (this._pendingData > 5e7) throw new Error("write data discarded, use flow control to avoid losing data");
                        this._writeBuffer.length || (this._bufferOffset = 0, setTimeout((function () {
                            return r._innerWrite()
                        }))), this._pendingData += e.length, this._writeBuffer.push(e), this._callbacks.push(t)
                    }, e.prototype._innerWrite = function (e, t) {
                        var i = this;
                        void 0 === e && (e = 0), void 0 === t && (t = !0);
                        for (var n = e || Date.now(); this._writeBuffer.length > this._bufferOffset;) {
                            var o = this._writeBuffer[this._bufferOffset], s = this._action(o, t);
                            if (s) return void s.catch((function (e) {
                                return r((function () {
                                    throw e
                                })), Promise.resolve(!1)
                            })).then((function (e) {
                                return Date.now() - n >= 12 ? setTimeout((function () {
                                    return i._innerWrite(0, e)
                                })) : i._innerWrite(n, e)
                            }));
                            var a = this._callbacks[this._bufferOffset];
                            if (a && a(), this._bufferOffset++, this._pendingData -= o.length, Date.now() - n >= 12) break
                        }
                        this._writeBuffer.length > this._bufferOffset ? (this._bufferOffset > 50 && (this._writeBuffer = this._writeBuffer.slice(this._bufferOffset), this._callbacks = this._callbacks.slice(this._bufferOffset), this._bufferOffset = 0), setTimeout((function () {
                            return i._innerWrite()
                        }))) : (this._writeBuffer.length = 0, this._callbacks.length = 0, this._pendingData = 0, this._bufferOffset = 0)
                    }, e
                }();
                t.WriteBuffer = i
            }, 5770: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.PAYLOAD_LIMIT = void 0, t.PAYLOAD_LIMIT = 1e7
            }, 6351: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.DcsHandler = t.DcsParser = void 0;
                var i = r(482), n = r(8742), o = r(5770), s = [], a = function () {
                    function e() {
                        this._handlers = Object.create(null), this._active = s, this._ident = 0, this._handlerFb = function () {
                        }, this._stack = {paused: !1, loopPosition: 0, fallThrough: !1}
                    }

                    return e.prototype.dispose = function () {
                        this._handlers = Object.create(null), this._handlerFb = function () {
                        }, this._active = s
                    }, e.prototype.registerHandler = function (e, t) {
                        void 0 === this._handlers[e] && (this._handlers[e] = []);
                        var r = this._handlers[e];
                        return r.push(t), {
                            dispose: function () {
                                var e = r.indexOf(t);
                                -1 !== e && r.splice(e, 1)
                            }
                        }
                    }, e.prototype.clearHandler = function (e) {
                        this._handlers[e] && delete this._handlers[e]
                    }, e.prototype.setHandlerFallback = function (e) {
                        this._handlerFb = e
                    }, e.prototype.reset = function () {
                        if (this._active.length) for (var e = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; e >= 0; --e) this._active[e].unhook(!1);
                        this._stack.paused = !1, this._active = s, this._ident = 0
                    }, e.prototype.hook = function (e, t) {
                        if (this.reset(), this._ident = e, this._active = this._handlers[e] || s, this._active.length) for (var r = this._active.length - 1; r >= 0; r--) this._active[r].hook(t); else this._handlerFb(this._ident, "HOOK", t)
                    }, e.prototype.put = function (e, t, r) {
                        if (this._active.length) for (var n = this._active.length - 1; n >= 0; n--) this._active[n].put(e, t, r); else this._handlerFb(this._ident, "PUT", i.utf32ToString(e, t, r))
                    }, e.prototype.unhook = function (e, t) {
                        if (void 0 === t && (t = !0), this._active.length) {
                            var r = !1, i = this._active.length - 1, n = !1;
                            if (this._stack.paused && (i = this._stack.loopPosition - 1, r = t, n = this._stack.fallThrough, this._stack.paused = !1), !n && !1 === r) {
                                for (; i >= 0 && !0 !== (r = this._active[i].unhook(e)); i--) if (r instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = i, this._stack.fallThrough = !1, r;
                                i--
                            }
                            for (; i >= 0; i--) if ((r = this._active[i].unhook(!1)) instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = i, this._stack.fallThrough = !0, r
                        } else this._handlerFb(this._ident, "UNHOOK", e);
                        this._active = s, this._ident = 0
                    }, e
                }();
                t.DcsParser = a;
                var c = new n.Params;
                c.addParam(0);
                var l = function () {
                    function e(e) {
                        this._handler = e, this._data = "", this._params = c, this._hitLimit = !1
                    }

                    return e.prototype.hook = function (e) {
                        this._params = e.length > 1 || e.params[0] ? e.clone() : c, this._data = "", this._hitLimit = !1
                    }, e.prototype.put = function (e, t, r) {
                        this._hitLimit || (this._data += i.utf32ToString(e, t, r), this._data.length > o.PAYLOAD_LIMIT && (this._data = "", this._hitLimit = !0))
                    }, e.prototype.unhook = function (e) {
                        var t = this, r = !1;
                        if (this._hitLimit) r = !1; else if (e && (r = this._handler(this._data, this._params)) instanceof Promise) return r.then((function (e) {
                            return t._params = c, t._data = "", t._hitLimit = !1, e
                        }));
                        return this._params = c, this._data = "", this._hitLimit = !1, r
                    }, e
                }();
                t.DcsHandler = l
            }, 2015: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                });
                Object.defineProperty(t, "__esModule", {value: !0}), t.EscapeSequenceParser = t.VT500_TRANSITION_TABLE = t.TransitionTable = void 0;
                var o = r(844), s = r(8273), a = r(8742), c = r(6242), l = r(6351), h = function () {
                    function e(e) {
                        this.table = new Uint8Array(e)
                    }

                    return e.prototype.setDefault = function (e, t) {
                        s.fill(this.table, e << 4 | t)
                    }, e.prototype.add = function (e, t, r, i) {
                        this.table[t << 8 | e] = r << 4 | i
                    }, e.prototype.addMany = function (e, t, r, i) {
                        for (var n = 0; n < e.length; n++) this.table[t << 8 | e[n]] = r << 4 | i
                    }, e
                }();
                t.TransitionTable = h;
                var u = 160;
                t.VT500_TRANSITION_TABLE = function () {
                    var e = new h(4095), t = Array.apply(null, Array(256)).map((function (e, t) {
                        return t
                    })), r = function (e, r) {
                        return t.slice(e, r)
                    }, i = r(32, 127), n = r(0, 24);
                    n.push(25), n.push.apply(n, r(28, 32));
                    var o, s = r(0, 14);
                    for (o in e.setDefault(1, 0), e.addMany(i, 0, 2, 0), s) e.addMany([24, 26, 153, 154], o, 3, 0), e.addMany(r(128, 144), o, 3, 0), e.addMany(r(144, 152), o, 3, 0), e.add(156, o, 0, 0), e.add(27, o, 11, 1), e.add(157, o, 4, 8), e.addMany([152, 158, 159], o, 0, 7), e.add(155, o, 11, 3), e.add(144, o, 11, 9);
                    return e.addMany(n, 0, 3, 0), e.addMany(n, 1, 3, 1), e.add(127, 1, 0, 1), e.addMany(n, 8, 0, 8), e.addMany(n, 3, 3, 3), e.add(127, 3, 0, 3), e.addMany(n, 4, 3, 4), e.add(127, 4, 0, 4), e.addMany(n, 6, 3, 6), e.addMany(n, 5, 3, 5), e.add(127, 5, 0, 5), e.addMany(n, 2, 3, 2), e.add(127, 2, 0, 2), e.add(93, 1, 4, 8), e.addMany(i, 8, 5, 8), e.add(127, 8, 5, 8), e.addMany([156, 27, 24, 26, 7], 8, 6, 0), e.addMany(r(28, 32), 8, 0, 8), e.addMany([88, 94, 95], 1, 0, 7), e.addMany(i, 7, 0, 7), e.addMany(n, 7, 0, 7), e.add(156, 7, 0, 0), e.add(127, 7, 0, 7), e.add(91, 1, 11, 3), e.addMany(r(64, 127), 3, 7, 0), e.addMany(r(48, 60), 3, 8, 4), e.addMany([60, 61, 62, 63], 3, 9, 4), e.addMany(r(48, 60), 4, 8, 4), e.addMany(r(64, 127), 4, 7, 0), e.addMany([60, 61, 62, 63], 4, 0, 6), e.addMany(r(32, 64), 6, 0, 6), e.add(127, 6, 0, 6), e.addMany(r(64, 127), 6, 0, 0), e.addMany(r(32, 48), 3, 9, 5), e.addMany(r(32, 48), 5, 9, 5), e.addMany(r(48, 64), 5, 0, 6), e.addMany(r(64, 127), 5, 7, 0), e.addMany(r(32, 48), 4, 9, 5), e.addMany(r(32, 48), 1, 9, 2), e.addMany(r(32, 48), 2, 9, 2), e.addMany(r(48, 127), 2, 10, 0), e.addMany(r(48, 80), 1, 10, 0), e.addMany(r(81, 88), 1, 10, 0), e.addMany([89, 90, 92], 1, 10, 0), e.addMany(r(96, 127), 1, 10, 0), e.add(80, 1, 11, 9), e.addMany(n, 9, 0, 9), e.add(127, 9, 0, 9), e.addMany(r(28, 32), 9, 0, 9), e.addMany(r(32, 48), 9, 9, 12), e.addMany(r(48, 60), 9, 8, 10), e.addMany([60, 61, 62, 63], 9, 9, 10), e.addMany(n, 11, 0, 11), e.addMany(r(32, 128), 11, 0, 11), e.addMany(r(28, 32), 11, 0, 11), e.addMany(n, 10, 0, 10), e.add(127, 10, 0, 10), e.addMany(r(28, 32), 10, 0, 10), e.addMany(r(48, 60), 10, 8, 10), e.addMany([60, 61, 62, 63], 10, 0, 11), e.addMany(r(32, 48), 10, 9, 12), e.addMany(n, 12, 0, 12), e.add(127, 12, 0, 12), e.addMany(r(28, 32), 12, 0, 12), e.addMany(r(32, 48), 12, 9, 12), e.addMany(r(48, 64), 12, 0, 11), e.addMany(r(64, 127), 12, 12, 13), e.addMany(r(64, 127), 10, 12, 13), e.addMany(r(64, 127), 9, 12, 13), e.addMany(n, 13, 13, 13), e.addMany(i, 13, 13, 13), e.add(127, 13, 0, 13), e.addMany([27, 156, 24, 26], 13, 14, 0), e.add(u, 0, 2, 0), e.add(u, 8, 5, 8), e.add(u, 6, 0, 6), e.add(u, 11, 0, 11), e.add(u, 13, 13, 13), e
                }();
                var f = function (e) {
                    function r(r) {
                        void 0 === r && (r = t.VT500_TRANSITION_TABLE);
                        var i = e.call(this) || this;
                        return i._transitions = r, i._parseStack = {
                            state: 0,
                            handlers: [],
                            handlerPos: 0,
                            transition: 0,
                            chunkPos: 0
                        }, i.initialState = 0, i.currentState = i.initialState, i._params = new a.Params, i._params.addParam(0), i._collect = 0, i.precedingCodepoint = 0, i._printHandlerFb = function (e, t, r) {
                        }, i._executeHandlerFb = function (e) {
                        }, i._csiHandlerFb = function (e, t) {
                        }, i._escHandlerFb = function (e) {
                        }, i._errorHandlerFb = function (e) {
                            return e
                        }, i._printHandler = i._printHandlerFb, i._executeHandlers = Object.create(null), i._csiHandlers = Object.create(null), i._escHandlers = Object.create(null), i._oscParser = new c.OscParser, i._dcsParser = new l.DcsParser, i._errorHandler = i._errorHandlerFb, i.registerEscHandler({final: "\\"}, (function () {
                            return !0
                        })), i
                    }

                    return n(r, e), r.prototype._identifier = function (e, t) {
                        void 0 === t && (t = [64, 126]);
                        var r = 0;
                        if (e.prefix) {
                            if (e.prefix.length > 1) throw new Error("only one byte as prefix supported");
                            if ((r = e.prefix.charCodeAt(0)) && 60 > r || r > 63) throw new Error("prefix must be in range 0x3c .. 0x3f")
                        }
                        if (e.intermediates) {
                            if (e.intermediates.length > 2) throw new Error("only two bytes as intermediates are supported");
                            for (var i = 0; i < e.intermediates.length; ++i) {
                                var n = e.intermediates.charCodeAt(i);
                                if (32 > n || n > 47) throw new Error("intermediate must be in range 0x20 .. 0x2f");
                                r <<= 8, r |= n
                            }
                        }
                        if (1 !== e.final.length) throw new Error("final must be a single byte");
                        var o = e.final.charCodeAt(0);
                        if (t[0] > o || o > t[1]) throw new Error("final must be in range " + t[0] + " .. " + t[1]);
                        return (r <<= 8) | o
                    }, r.prototype.identToString = function (e) {
                        for (var t = []; e;) t.push(String.fromCharCode(255 & e)), e >>= 8;
                        return t.reverse().join("")
                    }, r.prototype.dispose = function () {
                        this._csiHandlers = Object.create(null), this._executeHandlers = Object.create(null), this._escHandlers = Object.create(null), this._oscParser.dispose(), this._dcsParser.dispose()
                    }, r.prototype.setPrintHandler = function (e) {
                        this._printHandler = e
                    }, r.prototype.clearPrintHandler = function () {
                        this._printHandler = this._printHandlerFb
                    }, r.prototype.registerEscHandler = function (e, t) {
                        var r = this._identifier(e, [48, 126]);
                        void 0 === this._escHandlers[r] && (this._escHandlers[r] = []);
                        var i = this._escHandlers[r];
                        return i.push(t), {
                            dispose: function () {
                                var e = i.indexOf(t);
                                -1 !== e && i.splice(e, 1)
                            }
                        }
                    }, r.prototype.clearEscHandler = function (e) {
                        this._escHandlers[this._identifier(e, [48, 126])] && delete this._escHandlers[this._identifier(e, [48, 126])]
                    }, r.prototype.setEscHandlerFallback = function (e) {
                        this._escHandlerFb = e
                    }, r.prototype.setExecuteHandler = function (e, t) {
                        this._executeHandlers[e.charCodeAt(0)] = t
                    }, r.prototype.clearExecuteHandler = function (e) {
                        this._executeHandlers[e.charCodeAt(0)] && delete this._executeHandlers[e.charCodeAt(0)]
                    }, r.prototype.setExecuteHandlerFallback = function (e) {
                        this._executeHandlerFb = e
                    }, r.prototype.registerCsiHandler = function (e, t) {
                        var r = this._identifier(e);
                        void 0 === this._csiHandlers[r] && (this._csiHandlers[r] = []);
                        var i = this._csiHandlers[r];
                        return i.push(t), {
                            dispose: function () {
                                var e = i.indexOf(t);
                                -1 !== e && i.splice(e, 1)
                            }
                        }
                    }, r.prototype.clearCsiHandler = function (e) {
                        this._csiHandlers[this._identifier(e)] && delete this._csiHandlers[this._identifier(e)]
                    }, r.prototype.setCsiHandlerFallback = function (e) {
                        this._csiHandlerFb = e
                    }, r.prototype.registerDcsHandler = function (e, t) {
                        return this._dcsParser.registerHandler(this._identifier(e), t)
                    }, r.prototype.clearDcsHandler = function (e) {
                        this._dcsParser.clearHandler(this._identifier(e))
                    }, r.prototype.setDcsHandlerFallback = function (e) {
                        this._dcsParser.setHandlerFallback(e)
                    }, r.prototype.registerOscHandler = function (e, t) {
                        return this._oscParser.registerHandler(e, t)
                    }, r.prototype.clearOscHandler = function (e) {
                        this._oscParser.clearHandler(e)
                    }, r.prototype.setOscHandlerFallback = function (e) {
                        this._oscParser.setHandlerFallback(e)
                    }, r.prototype.setErrorHandler = function (e) {
                        this._errorHandler = e
                    }, r.prototype.clearErrorHandler = function () {
                        this._errorHandler = this._errorHandlerFb
                    }, r.prototype.reset = function () {
                        this.currentState = this.initialState, this._oscParser.reset(), this._dcsParser.reset(), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0, 0 !== this._parseStack.state && (this._parseStack.state = 2, this._parseStack.handlers = [])
                    }, r.prototype._preserveStack = function (e, t, r, i, n) {
                        this._parseStack.state = e, this._parseStack.handlers = t, this._parseStack.handlerPos = r, this._parseStack.transition = i, this._parseStack.chunkPos = n
                    }, r.prototype.parse = function (e, t, r) {
                        var i, n = 0, o = 0, s = 0;
                        if (this._parseStack.state) if (2 === this._parseStack.state) this._parseStack.state = 0, s = this._parseStack.chunkPos + 1; else {
                            if (void 0 === r || 1 === this._parseStack.state) throw this._parseStack.state = 1, new Error("improper continuation due to previous async handler, giving up parsing");
                            var a = this._parseStack.handlers, c = this._parseStack.handlerPos - 1;
                            switch (this._parseStack.state) {
                                case 3:
                                    if (!1 === r && c > -1) for (; c >= 0 && !0 !== (i = a[c](this._params)); c--) if (i instanceof Promise) return this._parseStack.handlerPos = c, i;
                                    this._parseStack.handlers = [];
                                    break;
                                case 4:
                                    if (!1 === r && c > -1) for (; c >= 0 && !0 !== (i = a[c]()); c--) if (i instanceof Promise) return this._parseStack.handlerPos = c, i;
                                    this._parseStack.handlers = [];
                                    break;
                                case 6:
                                    if (n = e[this._parseStack.chunkPos], i = this._dcsParser.unhook(24 !== n && 26 !== n, r)) return i;
                                    27 === n && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
                                    break;
                                case 5:
                                    if (n = e[this._parseStack.chunkPos], i = this._oscParser.end(24 !== n && 26 !== n, r)) return i;
                                    27 === n && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0
                            }
                            this._parseStack.state = 0, s = this._parseStack.chunkPos + 1, this.precedingCodepoint = 0, this.currentState = 15 & this._parseStack.transition
                        }
                        for (var l = s; l < t; ++l) {
                            switch (n = e[l], (o = this._transitions.table[this.currentState << 8 | (n < 160 ? n : u)]) >> 4) {
                                case 2:
                                    for (var h = l + 1; ; ++h) {
                                        if (h >= t || (n = e[h]) < 32 || n > 126 && n < u) {
                                            this._printHandler(e, l, h), l = h - 1;
                                            break
                                        }
                                        if (++h >= t || (n = e[h]) < 32 || n > 126 && n < u) {
                                            this._printHandler(e, l, h), l = h - 1;
                                            break
                                        }
                                        if (++h >= t || (n = e[h]) < 32 || n > 126 && n < u) {
                                            this._printHandler(e, l, h), l = h - 1;
                                            break
                                        }
                                        if (++h >= t || (n = e[h]) < 32 || n > 126 && n < u) {
                                            this._printHandler(e, l, h), l = h - 1;
                                            break
                                        }
                                    }
                                    break;
                                case 3:
                                    this._executeHandlers[n] ? this._executeHandlers[n]() : this._executeHandlerFb(n), this.precedingCodepoint = 0;
                                    break;
                                case 0:
                                    break;
                                case 1:
                                    if (this._errorHandler({
                                        position: l,
                                        code: n,
                                        currentState: this.currentState,
                                        collect: this._collect,
                                        params: this._params,
                                        abort: !1
                                    }).abort) return;
                                    break;
                                case 7:
                                    for (var f = (a = this._csiHandlers[this._collect << 8 | n]) ? a.length - 1 : -1; f >= 0 && !0 !== (i = a[f](this._params)); f--) if (i instanceof Promise) return this._preserveStack(3, a, f, o, l), i;
                                    f < 0 && this._csiHandlerFb(this._collect << 8 | n, this._params), this.precedingCodepoint = 0;
                                    break;
                                case 8:
                                    do {
                                        switch (n) {
                                            case 59:
                                                this._params.addParam(0);
                                                break;
                                            case 58:
                                                this._params.addSubParam(-1);
                                                break;
                                            default:
                                                this._params.addDigit(n - 48)
                                        }
                                    } while (++l < t && (n = e[l]) > 47 && n < 60);
                                    l--;
                                    break;
                                case 9:
                                    this._collect <<= 8, this._collect |= n;
                                    break;
                                case 10:
                                    for (var _ = this._escHandlers[this._collect << 8 | n], d = _ ? _.length - 1 : -1; d >= 0 && !0 !== (i = _[d]()); d--) if (i instanceof Promise) return this._preserveStack(4, _, d, o, l), i;
                                    d < 0 && this._escHandlerFb(this._collect << 8 | n), this.precedingCodepoint = 0;
                                    break;
                                case 11:
                                    this._params.reset(), this._params.addParam(0), this._collect = 0;
                                    break;
                                case 12:
                                    this._dcsParser.hook(this._collect << 8 | n, this._params);
                                    break;
                                case 13:
                                    for (var p = l + 1; ; ++p) if (p >= t || 24 === (n = e[p]) || 26 === n || 27 === n || n > 127 && n < u) {
                                        this._dcsParser.put(e, l, p), l = p - 1;
                                        break
                                    }
                                    break;
                                case 14:
                                    if (i = this._dcsParser.unhook(24 !== n && 26 !== n)) return this._preserveStack(6, [], 0, o, l), i;
                                    27 === n && (o |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0;
                                    break;
                                case 4:
                                    this._oscParser.start();
                                    break;
                                case 5:
                                    for (var v = l + 1; ; v++) if (v >= t || (n = e[v]) < 32 || n > 127 && n < u) {
                                        this._oscParser.put(e, l, v), l = v - 1;
                                        break
                                    }
                                    break;
                                case 6:
                                    if (i = this._oscParser.end(24 !== n && 26 !== n)) return this._preserveStack(5, [], 0, o, l), i;
                                    27 === n && (o |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0
                            }
                            this.currentState = 15 & o
                        }
                    }, r
                }(o.Disposable);
                t.EscapeSequenceParser = f
            }, 6242: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.OscHandler = t.OscParser = void 0;
                var i = r(5770), n = r(482), o = [], s = function () {
                    function e() {
                        this._state = 0, this._active = o, this._id = -1, this._handlers = Object.create(null), this._handlerFb = function () {
                        }, this._stack = {paused: !1, loopPosition: 0, fallThrough: !1}
                    }

                    return e.prototype.registerHandler = function (e, t) {
                        void 0 === this._handlers[e] && (this._handlers[e] = []);
                        var r = this._handlers[e];
                        return r.push(t), {
                            dispose: function () {
                                var e = r.indexOf(t);
                                -1 !== e && r.splice(e, 1)
                            }
                        }
                    }, e.prototype.clearHandler = function (e) {
                        this._handlers[e] && delete this._handlers[e]
                    }, e.prototype.setHandlerFallback = function (e) {
                        this._handlerFb = e
                    }, e.prototype.dispose = function () {
                        this._handlers = Object.create(null), this._handlerFb = function () {
                        }, this._active = o
                    }, e.prototype.reset = function () {
                        if (2 === this._state) for (var e = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; e >= 0; --e) this._active[e].end(!1);
                        this._stack.paused = !1, this._active = o, this._id = -1, this._state = 0
                    }, e.prototype._start = function () {
                        if (this._active = this._handlers[this._id] || o, this._active.length) for (var e = this._active.length - 1; e >= 0; e--) this._active[e].start(); else this._handlerFb(this._id, "START")
                    }, e.prototype._put = function (e, t, r) {
                        if (this._active.length) for (var i = this._active.length - 1; i >= 0; i--) this._active[i].put(e, t, r); else this._handlerFb(this._id, "PUT", n.utf32ToString(e, t, r))
                    }, e.prototype.start = function () {
                        this.reset(), this._state = 1
                    }, e.prototype.put = function (e, t, r) {
                        if (3 !== this._state) {
                            if (1 === this._state) for (; t < r;) {
                                var i = e[t++];
                                if (59 === i) {
                                    this._state = 2, this._start();
                                    break
                                }
                                if (i < 48 || 57 < i) return void (this._state = 3);
                                -1 === this._id && (this._id = 0), this._id = 10 * this._id + i - 48
                            }
                            2 === this._state && r - t > 0 && this._put(e, t, r)
                        }
                    }, e.prototype.end = function (e, t) {
                        if (void 0 === t && (t = !0), 0 !== this._state) {
                            if (3 !== this._state) if (1 === this._state && this._start(), this._active.length) {
                                var r = !1, i = this._active.length - 1, n = !1;
                                if (this._stack.paused && (i = this._stack.loopPosition - 1, r = t, n = this._stack.fallThrough, this._stack.paused = !1), !n && !1 === r) {
                                    for (; i >= 0 && !0 !== (r = this._active[i].end(e)); i--) if (r instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = i, this._stack.fallThrough = !1, r;
                                    i--
                                }
                                for (; i >= 0; i--) if ((r = this._active[i].end(!1)) instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = i, this._stack.fallThrough = !0, r
                            } else this._handlerFb(this._id, "END", e);
                            this._active = o, this._id = -1, this._state = 0
                        }
                    }, e
                }();
                t.OscParser = s;
                var a = function () {
                    function e(e) {
                        this._handler = e, this._data = "", this._hitLimit = !1
                    }

                    return e.prototype.start = function () {
                        this._data = "", this._hitLimit = !1
                    }, e.prototype.put = function (e, t, r) {
                        this._hitLimit || (this._data += n.utf32ToString(e, t, r), this._data.length > i.PAYLOAD_LIMIT && (this._data = "", this._hitLimit = !0))
                    }, e.prototype.end = function (e) {
                        var t = this, r = !1;
                        if (this._hitLimit) r = !1; else if (e && (r = this._handler(this._data)) instanceof Promise) return r.then((function (e) {
                            return t._data = "", t._hitLimit = !1, e
                        }));
                        return this._data = "", this._hitLimit = !1, r
                    }, e
                }();
                t.OscHandler = a
            }, 8742: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.Params = void 0;
                var r = 2147483647, i = function () {
                    function e(e, t) {
                        if (void 0 === e && (e = 32), void 0 === t && (t = 32), this.maxLength = e, this.maxSubParamsLength = t, t > 256) throw new Error("maxSubParamsLength must not be greater than 256");
                        this.params = new Int32Array(e), this.length = 0, this._subParams = new Int32Array(t), this._subParamsLength = 0, this._subParamsIdx = new Uint16Array(e), this._rejectDigits = !1, this._rejectSubDigits = !1, this._digitIsSub = !1
                    }

                    return e.fromArray = function (t) {
                        var r = new e;
                        if (!t.length) return r;
                        for (var i = t[0] instanceof Array ? 1 : 0; i < t.length; ++i) {
                            var n = t[i];
                            if (n instanceof Array) for (var o = 0; o < n.length; ++o) r.addSubParam(n[o]); else r.addParam(n)
                        }
                        return r
                    }, e.prototype.clone = function () {
                        var t = new e(this.maxLength, this.maxSubParamsLength);
                        return t.params.set(this.params), t.length = this.length, t._subParams.set(this._subParams), t._subParamsLength = this._subParamsLength, t._subParamsIdx.set(this._subParamsIdx), t._rejectDigits = this._rejectDigits, t._rejectSubDigits = this._rejectSubDigits, t._digitIsSub = this._digitIsSub, t
                    }, e.prototype.toArray = function () {
                        for (var e = [], t = 0; t < this.length; ++t) {
                            e.push(this.params[t]);
                            var r = this._subParamsIdx[t] >> 8, i = 255 & this._subParamsIdx[t];
                            i - r > 0 && e.push(Array.prototype.slice.call(this._subParams, r, i))
                        }
                        return e
                    }, e.prototype.reset = function () {
                        this.length = 0, this._subParamsLength = 0, this._rejectDigits = !1, this._rejectSubDigits = !1, this._digitIsSub = !1
                    }, e.prototype.addParam = function (e) {
                        if (this._digitIsSub = !1, this.length >= this.maxLength) this._rejectDigits = !0; else {
                            if (e < -1) throw new Error("values lesser than -1 are not allowed");
                            this._subParamsIdx[this.length] = this._subParamsLength << 8 | this._subParamsLength, this.params[this.length++] = e > r ? r : e
                        }
                    }, e.prototype.addSubParam = function (e) {
                        if (this._digitIsSub = !0, this.length) if (this._rejectDigits || this._subParamsLength >= this.maxSubParamsLength) this._rejectSubDigits = !0; else {
                            if (e < -1) throw new Error("values lesser than -1 are not allowed");
                            this._subParams[this._subParamsLength++] = e > r ? r : e, this._subParamsIdx[this.length - 1]++
                        }
                    }, e.prototype.hasSubParams = function (e) {
                        return (255 & this._subParamsIdx[e]) - (this._subParamsIdx[e] >> 8) > 0
                    }, e.prototype.getSubParams = function (e) {
                        var t = this._subParamsIdx[e] >> 8, r = 255 & this._subParamsIdx[e];
                        return r - t > 0 ? this._subParams.subarray(t, r) : null
                    }, e.prototype.getSubParamsAll = function () {
                        for (var e = {}, t = 0; t < this.length; ++t) {
                            var r = this._subParamsIdx[t] >> 8, i = 255 & this._subParamsIdx[t];
                            i - r > 0 && (e[t] = this._subParams.slice(r, i))
                        }
                        return e
                    }, e.prototype.addDigit = function (e) {
                        var t;
                        if (!(this._rejectDigits || !(t = this._digitIsSub ? this._subParamsLength : this.length) || this._digitIsSub && this._rejectSubDigits)) {
                            var i = this._digitIsSub ? this._subParams : this.params, n = i[t - 1];
                            i[t - 1] = ~n ? Math.min(10 * n + e, r) : e
                        }
                    }, e
                }();
                t.Params = i
            }, 744: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.BufferService = t.MINIMUM_ROWS = t.MINIMUM_COLS = void 0;
                var a = r(2585), c = r(5295), l = r(8460), h = r(844);
                t.MINIMUM_COLS = 2, t.MINIMUM_ROWS = 1;
                var u = function (e) {
                    function r(r) {
                        var i = e.call(this) || this;
                        return i._optionsService = r, i.isUserScrolling = !1, i._onResize = new l.EventEmitter, i._onScroll = new l.EventEmitter, i.cols = Math.max(r.options.cols, t.MINIMUM_COLS), i.rows = Math.max(r.options.rows, t.MINIMUM_ROWS), i.buffers = new c.BufferSet(r, i), i
                    }

                    return n(r, e), Object.defineProperty(r.prototype, "onResize", {
                        get: function () {
                            return this._onResize.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(r.prototype, "onScroll", {
                        get: function () {
                            return this._onScroll.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(r.prototype, "buffer", {
                        get: function () {
                            return this.buffers.active
                        }, enumerable: !1, configurable: !0
                    }), r.prototype.dispose = function () {
                        e.prototype.dispose.call(this), this.buffers.dispose()
                    }, r.prototype.resize = function (e, t) {
                        this.cols = e, this.rows = t, this.buffers.resize(e, t), this.buffers.setupTabStops(this.cols), this._onResize.fire({
                            cols: e,
                            rows: t
                        })
                    }, r.prototype.reset = function () {
                        this.buffers.reset(), this.isUserScrolling = !1
                    }, r.prototype.scroll = function (e, t) {
                        void 0 === t && (t = !1);
                        var r, i = this.buffer;
                        (r = this._cachedBlankLine) && r.length === this.cols && r.getFg(0) === e.fg && r.getBg(0) === e.bg || (r = i.getBlankLine(e, t), this._cachedBlankLine = r), r.isWrapped = t;
                        var n = i.ybase + i.scrollTop, o = i.ybase + i.scrollBottom;
                        if (0 === i.scrollTop) {
                            var s = i.lines.isFull;
                            o === i.lines.length - 1 ? s ? i.lines.recycle().copyFrom(r) : i.lines.push(r.clone()) : i.lines.splice(o + 1, 0, r.clone()), s ? this.isUserScrolling && (i.ydisp = Math.max(i.ydisp - 1, 0)) : (i.ybase++, this.isUserScrolling || i.ydisp++)
                        } else {
                            var a = o - n + 1;
                            i.lines.shiftElements(n + 1, a - 1, -1), i.lines.set(o, r.clone())
                        }
                        this.isUserScrolling || (i.ydisp = i.ybase), this._onScroll.fire(i.ydisp)
                    }, r.prototype.scrollLines = function (e, t, r) {
                        var i = this.buffer;
                        if (e < 0) {
                            if (0 === i.ydisp) return;
                            this.isUserScrolling = !0
                        } else e + i.ydisp >= i.ybase && (this.isUserScrolling = !1);
                        var n = i.ydisp;
                        i.ydisp = Math.max(Math.min(i.ydisp + e, i.ybase), 0), n !== i.ydisp && (t || this._onScroll.fire(i.ydisp))
                    }, r.prototype.scrollPages = function (e) {
                        this.scrollLines(e * (this.rows - 1))
                    }, r.prototype.scrollToTop = function () {
                        this.scrollLines(-this.buffer.ydisp)
                    }, r.prototype.scrollToBottom = function () {
                        this.scrollLines(this.buffer.ybase - this.buffer.ydisp)
                    }, r.prototype.scrollToLine = function (e) {
                        var t = e - this.buffer.ydisp;
                        0 !== t && this.scrollLines(t)
                    }, o([s(0, a.IOptionsService)], r)
                }(h.Disposable);
                t.BufferService = u
            }, 7994: (e, t) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.CharsetService = void 0;
                var r = function () {
                    function e() {
                        this.glevel = 0, this._charsets = []
                    }

                    return e.prototype.reset = function () {
                        this.charset = void 0, this._charsets = [], this.glevel = 0
                    }, e.prototype.setgLevel = function (e) {
                        this.glevel = e, this.charset = this._charsets[e]
                    }, e.prototype.setgCharset = function (e, t) {
                        this._charsets[e] = t, this.glevel === e && (this.charset = t)
                    }, e
                }();
                t.CharsetService = r
            }, 1753: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.CoreMouseService = void 0;
                var o = r(2585), s = r(8460), a = {
                    NONE: {
                        events: 0, restrict: function () {
                            return !1
                        }
                    }, X10: {
                        events: 1, restrict: function (e) {
                            return 4 !== e.button && 1 === e.action && (e.ctrl = !1, e.alt = !1, e.shift = !1, !0)
                        }
                    }, VT200: {
                        events: 19, restrict: function (e) {
                            return 32 !== e.action
                        }
                    }, DRAG: {
                        events: 23, restrict: function (e) {
                            return 32 !== e.action || 3 !== e.button
                        }
                    }, ANY: {
                        events: 31, restrict: function (e) {
                            return !0
                        }
                    }
                };

                function c(e, t) {
                    var r = (e.ctrl ? 16 : 0) | (e.shift ? 4 : 0) | (e.alt ? 8 : 0);
                    return 4 === e.button ? (r |= 64, r |= e.action) : (r |= 3 & e.button, 4 & e.button && (r |= 64), 8 & e.button && (r |= 128), 32 === e.action ? r |= 32 : 0 !== e.action || t || (r |= 3)), r
                }

                var l = String.fromCharCode, h = {
                    DEFAULT: function (e) {
                        var t = [c(e, !1) + 32, e.col + 32, e.row + 32];
                        return t[0] > 255 || t[1] > 255 || t[2] > 255 ? "" : "[M" + l(t[0]) + l(t[1]) + l(t[2])
                    }, SGR: function (e) {
                        var t = 0 === e.action && 4 !== e.button ? "m" : "M";
                        return "[<" + c(e, !0) + ";" + e.col + ";" + e.row + t
                    }
                }, u = function () {
                    function e(e, t) {
                        this._bufferService = e, this._coreService = t, this._protocols = {}, this._encodings = {}, this._activeProtocol = "", this._activeEncoding = "", this._onProtocolChange = new s.EventEmitter, this._lastEvent = null;
                        for (var r = 0, i = Object.keys(a); r < i.length; r++) {
                            var n = i[r];
                            this.addProtocol(n, a[n])
                        }
                        for (var o = 0, c = Object.keys(h); o < c.length; o++) {
                            var l = c[o];
                            this.addEncoding(l, h[l])
                        }
                        this.reset()
                    }

                    return e.prototype.addProtocol = function (e, t) {
                        this._protocols[e] = t
                    }, e.prototype.addEncoding = function (e, t) {
                        this._encodings[e] = t
                    }, Object.defineProperty(e.prototype, "activeProtocol", {
                        get: function () {
                            return this._activeProtocol
                        }, set: function (e) {
                            if (!this._protocols[e]) throw new Error('unknown protocol "' + e + '"');
                            this._activeProtocol = e, this._onProtocolChange.fire(this._protocols[e].events)
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "areMouseEventsActive", {
                        get: function () {
                            return 0 !== this._protocols[this._activeProtocol].events
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "activeEncoding", {
                        get: function () {
                            return this._activeEncoding
                        }, set: function (e) {
                            if (!this._encodings[e]) throw new Error('unknown encoding "' + e + '"');
                            this._activeEncoding = e
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.reset = function () {
                        this.activeProtocol = "NONE", this.activeEncoding = "DEFAULT", this._lastEvent = null
                    }, Object.defineProperty(e.prototype, "onProtocolChange", {
                        get: function () {
                            return this._onProtocolChange.event
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.triggerMouseEvent = function (e) {
                        if (e.col < 0 || e.col >= this._bufferService.cols || e.row < 0 || e.row >= this._bufferService.rows) return !1;
                        if (4 === e.button && 32 === e.action) return !1;
                        if (3 === e.button && 32 !== e.action) return !1;
                        if (4 !== e.button && (2 === e.action || 3 === e.action)) return !1;
                        if (e.col++, e.row++, 32 === e.action && this._lastEvent && this._compareEvents(this._lastEvent, e)) return !1;
                        if (!this._protocols[this._activeProtocol].restrict(e)) return !1;
                        var t = this._encodings[this._activeEncoding](e);
                        return t && ("DEFAULT" === this._activeEncoding ? this._coreService.triggerBinaryEvent(t) : this._coreService.triggerDataEvent(t, !0)), this._lastEvent = e, !0
                    }, e.prototype.explainEvents = function (e) {
                        return {down: !!(1 & e), up: !!(2 & e), drag: !!(4 & e), move: !!(8 & e), wheel: !!(16 & e)}
                    }, e.prototype._compareEvents = function (e, t) {
                        return e.col === t.col && e.row === t.row && e.button === t.button && e.action === t.action && e.ctrl === t.ctrl && e.alt === t.alt && e.shift === t.shift
                    }, i([n(0, o.IBufferService), n(1, o.ICoreService)], e)
                }();
                t.CoreMouseService = u
            }, 6975: function (e, t, r) {
                var i, n = this && this.__extends || (i = function (e, t) {
                    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                        e.__proto__ = t
                    } || function (e, t) {
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    })(e, t)
                }, function (e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

                    function r() {
                        this.constructor = e
                    }

                    i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
                }), o = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, s = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.CoreService = void 0;
                var a = r(2585), c = r(8460), l = r(1439), h = r(844), u = Object.freeze({insertMode: !1}),
                    f = Object.freeze({
                        applicationCursorKeys: !1,
                        applicationKeypad: !1,
                        bracketedPasteMode: !1,
                        origin: !1,
                        reverseWraparound: !1,
                        sendFocus: !1,
                        wraparound: !0
                    }), _ = function (e) {
                        function t(t, r, i, n) {
                            var o = e.call(this) || this;
                            return o._bufferService = r, o._logService = i, o._optionsService = n, o.isCursorInitialized = !1, o.isCursorHidden = !1, o._onData = o.register(new c.EventEmitter), o._onUserInput = o.register(new c.EventEmitter), o._onBinary = o.register(new c.EventEmitter), o._scrollToBottom = t, o.register({
                                dispose: function () {
                                    return o._scrollToBottom = void 0
                                }
                            }), o.modes = l.clone(u), o.decPrivateModes = l.clone(f), o
                        }

                        return n(t, e), Object.defineProperty(t.prototype, "onData", {
                            get: function () {
                                return this._onData.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onUserInput", {
                            get: function () {
                                return this._onUserInput.event
                            }, enumerable: !1, configurable: !0
                        }), Object.defineProperty(t.prototype, "onBinary", {
                            get: function () {
                                return this._onBinary.event
                            }, enumerable: !1, configurable: !0
                        }), t.prototype.reset = function () {
                            this.modes = l.clone(u), this.decPrivateModes = l.clone(f)
                        }, t.prototype.triggerDataEvent = function (e, t) {
                            if (void 0 === t && (t = !1), !this._optionsService.options.disableStdin) {
                                var r = this._bufferService.buffer;
                                r.ybase !== r.ydisp && this._scrollToBottom(), t && this._onUserInput.fire(), this._logService.debug('sending data "' + e + '"', (function () {
                                    return e.split("").map((function (e) {
                                        return e.charCodeAt(0)
                                    }))
                                })), this._onData.fire(e)
                            }
                        }, t.prototype.triggerBinaryEvent = function (e) {
                            this._optionsService.options.disableStdin || (this._logService.debug('sending binary "' + e + '"', (function () {
                                return e.split("").map((function (e) {
                                    return e.charCodeAt(0)
                                }))
                            })), this._onBinary.fire(e))
                        }, o([s(1, a.IBufferService), s(2, a.ILogService), s(3, a.IOptionsService)], t)
                    }(h.Disposable);
                t.CoreService = _
            }, 3730: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.DirtyRowService = void 0;
                var o = r(2585), s = function () {
                    function e(e) {
                        this._bufferService = e, this.clearRange()
                    }

                    return Object.defineProperty(e.prototype, "start", {
                        get: function () {
                            return this._start
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "end", {
                        get: function () {
                            return this._end
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.clearRange = function () {
                        this._start = this._bufferService.buffer.y, this._end = this._bufferService.buffer.y
                    }, e.prototype.markDirty = function (e) {
                        e < this._start ? this._start = e : e > this._end && (this._end = e)
                    }, e.prototype.markRangeDirty = function (e, t) {
                        if (e > t) {
                            var r = e;
                            e = t, t = r
                        }
                        e < this._start && (this._start = e), t > this._end && (this._end = t)
                    }, e.prototype.markAllDirty = function () {
                        this.markRangeDirty(0, this._bufferService.rows - 1)
                    }, i([n(0, o.IBufferService)], e)
                }();
                t.DirtyRowService = s
            }, 4348: function (e, t, r) {
                var i = this && this.__spreadArray || function (e, t) {
                    for (var r = 0, i = t.length, n = e.length; r < i; r++, n++) e[n] = t[r];
                    return e
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.InstantiationService = t.ServiceCollection = void 0;
                var n = r(2585), o = r(8343), s = function () {
                    function e() {
                        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                        this._entries = new Map;
                        for (var r = 0, i = e; r < i.length; r++) {
                            var n = i[r], o = n[0], s = n[1];
                            this.set(o, s)
                        }
                    }

                    return e.prototype.set = function (e, t) {
                        var r = this._entries.get(e);
                        return this._entries.set(e, t), r
                    }, e.prototype.forEach = function (e) {
                        this._entries.forEach((function (t, r) {
                            return e(r, t)
                        }))
                    }, e.prototype.has = function (e) {
                        return this._entries.has(e)
                    }, e.prototype.get = function (e) {
                        return this._entries.get(e)
                    }, e
                }();
                t.ServiceCollection = s;
                var a = function () {
                    function e() {
                        this._services = new s, this._services.set(n.IInstantiationService, this)
                    }

                    return e.prototype.setService = function (e, t) {
                        this._services.set(e, t)
                    }, e.prototype.getService = function (e) {
                        return this._services.get(e)
                    }, e.prototype.createInstance = function (e) {
                        for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
                        for (var n = o.getServiceDependencies(e).sort((function (e, t) {
                            return e.index - t.index
                        })), s = [], a = 0, c = n; a < c.length; a++) {
                            var l = c[a], h = this._services.get(l.id);
                            if (!h) throw new Error("[createInstance] " + e.name + " depends on UNKNOWN service " + l.id + ".");
                            s.push(h)
                        }
                        var u = n.length > 0 ? n[0].index : t.length;
                        if (t.length !== u) throw new Error("[createInstance] First service dependency of " + e.name + " at position " + (u + 1) + " conflicts with " + t.length + " static arguments");
                        return new (e.bind.apply(e, i([void 0], i(i([], t), s))))
                    }, e
                }();
                t.InstantiationService = a
            }, 7866: function (e, t, r) {
                var i = this && this.__decorate || function (e, t, r, i) {
                    var n, o = arguments.length,
                        s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, r, s) : n(t, r)) || s);
                    return o > 3 && s && Object.defineProperty(t, r, s), s
                }, n = this && this.__param || function (e, t) {
                    return function (r, i) {
                        t(r, i, e)
                    }
                }, o = this && this.__spreadArray || function (e, t) {
                    for (var r = 0, i = t.length, n = e.length; r < i; r++, n++) e[n] = t[r];
                    return e
                };
                Object.defineProperty(t, "__esModule", {value: !0}), t.LogService = void 0;
                var s = r(2585), a = {
                    debug: s.LogLevelEnum.DEBUG,
                    info: s.LogLevelEnum.INFO,
                    warn: s.LogLevelEnum.WARN,
                    error: s.LogLevelEnum.ERROR,
                    off: s.LogLevelEnum.OFF
                }, c = function () {
                    function e(e) {
                        var t = this;
                        this._optionsService = e, this.logLevel = s.LogLevelEnum.OFF, this._updateLogLevel(), this._optionsService.onOptionChange((function (e) {
                            "logLevel" === e && t._updateLogLevel()
                        }))
                    }

                    return e.prototype._updateLogLevel = function () {
                        this.logLevel = a[this._optionsService.options.logLevel]
                    }, e.prototype._evalLazyOptionalParams = function (e) {
                        for (var t = 0; t < e.length; t++) "function" == typeof e[t] && (e[t] = e[t]())
                    }, e.prototype._log = function (e, t, r) {
                        this._evalLazyOptionalParams(r), e.call.apply(e, o([console, "xterm.js: " + t], r))
                    }, e.prototype.debug = function (e) {
                        for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
                        this.logLevel <= s.LogLevelEnum.DEBUG && this._log(console.log, e, t)
                    }, e.prototype.info = function (e) {
                        for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
                        this.logLevel <= s.LogLevelEnum.INFO && this._log(console.info, e, t)
                    }, e.prototype.warn = function (e) {
                        for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
                        this.logLevel <= s.LogLevelEnum.WARN && this._log(console.warn, e, t)
                    }, e.prototype.error = function (e) {
                        for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
                        this.logLevel <= s.LogLevelEnum.ERROR && this._log(console.error, e, t)
                    }, i([n(0, s.IOptionsService)], e)
                }();
                t.LogService = c
            }, 7302: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.OptionsService = t.DEFAULT_OPTIONS = t.DEFAULT_BELL_SOUND = void 0;
                var i = r(8460), n = r(6114), o = r(1439);
                t.DEFAULT_BELL_SOUND = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjMyLjEwNAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTRUoAWgBgkOAGbZHBgG1OF6zM82DWbZaUmMBptgQhGjsyYqc9ae9XFz280948NMBWInljyzsNRFLPWdnZGWrddDsjK1unuSrVN9jJsK8KuQtQCtMBjCEtImISdNKJOopIpBFpNSMbIHCSRpRR5iakjTiyzLhchUUBwCgyKiweBv/7UsQbg8isVNoMPMjAAAA0gAAABEVFGmgqK////9bP/6XCykxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", t.DEFAULT_OPTIONS = Object.freeze({
                    cols: 80,
                    rows: 24,
                    cursorBlink: !1,
                    cursorStyle: "block",
                    cursorWidth: 1,
                    bellSound: t.DEFAULT_BELL_SOUND,
                    bellStyle: "none",
                    drawBoldTextInBrightColors: !0,
                    fastScrollModifier: "alt",
                    fastScrollSensitivity: 5,
                    fontFamily: "courier-new, courier, monospace",
                    fontSize: 15,
                    fontWeight: "normal",
                    fontWeightBold: "bold",
                    lineHeight: 1,
                    linkTooltipHoverDuration: 500,
                    letterSpacing: 0,
                    logLevel: "info",
                    scrollback: 1e3,
                    scrollSensitivity: 1,
                    screenReaderMode: !1,
                    macOptionIsMeta: !1,
                    macOptionClickForcesSelection: !1,
                    minimumContrastRatio: 1,
                    disableStdin: !1,
                    allowProposedApi: !0,
                    allowTransparency: !1,
                    tabStopWidth: 8,
                    theme: {},
                    rightClickSelectsWord: n.isMac,
                    rendererType: "canvas",
                    windowOptions: {},
                    windowsMode: !1,
                    wordSeparator: " ()[]{}',\"`",
                    altClickMovesCursor: !0,
                    convertEol: !1,
                    termName: "xterm",
                    cancelEvents: !1
                });
                var s = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
                    a = ["cols", "rows"], c = function () {
                        function e(e) {
                            this._onOptionChange = new i.EventEmitter, this.options = o.clone(t.DEFAULT_OPTIONS);
                            for (var r = 0, n = Object.keys(e); r < n.length; r++) {
                                var s = n[r];
                                if (s in this.options) try {
                                    var a = e[s];
                                    this.options[s] = this._sanitizeAndValidateOption(s, a)
                                } catch (e) {
                                    console.error(e)
                                }
                            }
                        }

                        return Object.defineProperty(e.prototype, "onOptionChange", {
                            get: function () {
                                return this._onOptionChange.event
                            }, enumerable: !1, configurable: !0
                        }), e.prototype.setOption = function (e, r) {
                            if (!(e in t.DEFAULT_OPTIONS)) throw new Error('No option with key "' + e + '"');
                            if (a.includes(e)) throw new Error('Option "' + e + '" can only be set in the constructor');
                            this.options[e] !== r && (r = this._sanitizeAndValidateOption(e, r), this.options[e] !== r && (this.options[e] = r, this._onOptionChange.fire(e)))
                        }, e.prototype._sanitizeAndValidateOption = function (e, r) {
                            switch (e) {
                                case"bellStyle":
                                case"cursorStyle":
                                case"rendererType":
                                case"wordSeparator":
                                    r || (r = t.DEFAULT_OPTIONS[e]);
                                    break;
                                case"fontWeight":
                                case"fontWeightBold":
                                    if ("number" == typeof r && 1 <= r && r <= 1e3) break;
                                    r = s.includes(r) ? r : t.DEFAULT_OPTIONS[e];
                                    break;
                                case"cursorWidth":
                                    r = Math.floor(r);
                                case"lineHeight":
                                case"tabStopWidth":
                                    if (r < 1) throw new Error(e + " cannot be less than 1, value: " + r);
                                    break;
                                case"minimumContrastRatio":
                                    r = Math.max(1, Math.min(21, Math.round(10 * r) / 10));
                                    break;
                                case"scrollback":
                                    if ((r = Math.min(r, 4294967295)) < 0) throw new Error(e + " cannot be less than 0, value: " + r);
                                    break;
                                case"fastScrollSensitivity":
                                case"scrollSensitivity":
                                    if (r <= 0) throw new Error(e + " cannot be less than or equal to 0, value: " + r)
                            }
                            return r
                        }, e.prototype.getOption = function (e) {
                            if (!(e in t.DEFAULT_OPTIONS)) throw new Error('No option with key "' + e + '"');
                            return this.options[e]
                        }, e
                    }();
                t.OptionsService = c
            }, 8343: (e, t) => {
                function r(e, t, r) {
                    t.di$target === t ? t.di$dependencies.push({id: e, index: r}) : (t.di$dependencies = [{
                        id: e,
                        index: r
                    }], t.di$target = t)
                }

                Object.defineProperty(t, "__esModule", {value: !0}), t.createDecorator = t.getServiceDependencies = t.serviceRegistry = void 0, t.serviceRegistry = new Map, t.getServiceDependencies = function (e) {
                    return e.di$dependencies || []
                }, t.createDecorator = function (e) {
                    if (t.serviceRegistry.has(e)) return t.serviceRegistry.get(e);
                    var i = function (e, t, n) {
                        if (3 !== arguments.length) throw new Error("@IServiceName-decorator can only be used to decorate a parameter");
                        r(i, e, n)
                    };
                    return i.toString = function () {
                        return e
                    }, t.serviceRegistry.set(e, i), i
                }
            }, 2585: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.IUnicodeService = t.LogLevelEnum = t.IOptionsService = t.ILogService = t.IInstantiationService = t.IDirtyRowService = t.ICharsetService = t.ICoreService = t.ICoreMouseService = t.IBufferService = void 0;
                var i, n = r(8343);
                t.IBufferService = n.createDecorator("BufferService"), t.ICoreMouseService = n.createDecorator("CoreMouseService"), t.ICoreService = n.createDecorator("CoreService"), t.ICharsetService = n.createDecorator("CharsetService"), t.IDirtyRowService = n.createDecorator("DirtyRowService"), t.IInstantiationService = n.createDecorator("InstantiationService"), t.ILogService = n.createDecorator("LogService"), t.IOptionsService = n.createDecorator("OptionsService"), (i = t.LogLevelEnum || (t.LogLevelEnum = {}))[i.DEBUG = 0] = "DEBUG", i[i.INFO = 1] = "INFO", i[i.WARN = 2] = "WARN", i[i.ERROR = 3] = "ERROR", i[i.OFF = 4] = "OFF", t.IUnicodeService = n.createDecorator("UnicodeService")
            }, 1480: (e, t, r) => {
                Object.defineProperty(t, "__esModule", {value: !0}), t.UnicodeService = void 0;
                var i = r(8460), n = r(225), o = function () {
                    function e() {
                        this._providers = Object.create(null), this._active = "", this._onChange = new i.EventEmitter;
                        var e = new n.UnicodeV6;
                        this.register(e), this._active = e.version, this._activeProvider = e
                    }

                    return Object.defineProperty(e.prototype, "onChange", {
                        get: function () {
                            return this._onChange.event
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "versions", {
                        get: function () {
                            return Object.keys(this._providers)
                        }, enumerable: !1, configurable: !0
                    }), Object.defineProperty(e.prototype, "activeVersion", {
                        get: function () {
                            return this._active
                        }, set: function (e) {
                            if (!this._providers[e]) throw new Error('unknown Unicode version "' + e + '"');
                            this._active = e, this._activeProvider = this._providers[e], this._onChange.fire(e)
                        }, enumerable: !1, configurable: !0
                    }), e.prototype.register = function (e) {
                        this._providers[e.version] = e
                    }, e.prototype.wcwidth = function (e) {
                        return this._activeProvider.wcwidth(e)
                    }, e.prototype.getStringCellWidth = function (e) {
                        for (var t = 0, r = e.length, i = 0; i < r; ++i) {
                            var n = e.charCodeAt(i);
                            if (55296 <= n && n <= 56319) {
                                if (++i >= r) return t + this.wcwidth(n);
                                var o = e.charCodeAt(i);
                                56320 <= o && o <= 57343 ? n = 1024 * (n - 55296) + o - 56320 + 65536 : t += this.wcwidth(o)
                            }
                            t += this.wcwidth(n)
                        }
                        return t
                    }, e
                }();
                t.UnicodeService = o
            }
        }, t = {};

        function r(i) {
            var n = t[i];
            if (void 0 !== n) return n.exports;
            var o = t[i] = {exports: {}};
            return e[i].call(o.exports, o, o.exports, r), o.exports
        }

        var i = {};
        return (() => {
            var e = i;
            Object.defineProperty(e, "__esModule", {value: !0}), e.Terminal = void 0;
            var t = r(511), n = r(3236), o = r(9042), s = r(8460), a = r(244), c = function () {
                function e(e) {
                    this._core = new n.Terminal(e), this._addonManager = new a.AddonManager
                }

                return e.prototype._checkProposedApi = function () {
                    if (!this._core.optionsService.options.allowProposedApi) throw new Error("You must set the allowProposedApi option to true to use proposed API")
                }, Object.defineProperty(e.prototype, "onCursorMove", {
                    get: function () {
                        return this._core.onCursorMove
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onLineFeed", {
                    get: function () {
                        return this._core.onLineFeed
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onSelectionChange", {
                    get: function () {
                        return this._core.onSelectionChange
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onData", {
                    get: function () {
                        return this._core.onData
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onBinary", {
                    get: function () {
                        return this._core.onBinary
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onTitleChange", {
                    get: function () {
                        return this._core.onTitleChange
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onBell", {
                    get: function () {
                        return this._core.onBell
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onScroll", {
                    get: function () {
                        return this._core.onScroll
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onKey", {
                    get: function () {
                        return this._core.onKey
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onRender", {
                    get: function () {
                        return this._core.onRender
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "onResize", {
                    get: function () {
                        return this._core.onResize
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "element", {
                    get: function () {
                        return this._core.element
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "parser", {
                    get: function () {
                        return this._checkProposedApi(), this._parser || (this._parser = new f(this._core)), this._parser
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "unicode", {
                    get: function () {
                        return this._checkProposedApi(), new _(this._core)
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "textarea", {
                    get: function () {
                        return this._core.textarea
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "rows", {
                    get: function () {
                        return this._core.rows
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "cols", {
                    get: function () {
                        return this._core.cols
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "buffer", {
                    get: function () {
                        return this._checkProposedApi(), this._buffer || (this._buffer = new h(this._core)), this._buffer
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "markers", {
                    get: function () {
                        return this._checkProposedApi(), this._core.markers
                    }, enumerable: !1, configurable: !0
                }), e.prototype.blur = function () {
                    this._core.blur()
                }, e.prototype.focus = function () {
                    this._core.focus()
                }, e.prototype.resize = function (e, t) {
                    this._verifyIntegers(e, t), this._core.resize(e, t)
                }, e.prototype.open = function (e) {
                    this._core.open(e)
                }, e.prototype.attachCustomKeyEventHandler = function (e) {
                    this._core.attachCustomKeyEventHandler(e)
                }, e.prototype.registerLinkMatcher = function (e, t, r) {
                    return this._checkProposedApi(), this._core.registerLinkMatcher(e, t, r)
                }, e.prototype.deregisterLinkMatcher = function (e) {
                    this._checkProposedApi(), this._core.deregisterLinkMatcher(e)
                }, e.prototype.registerLinkProvider = function (e) {
                    return this._checkProposedApi(), this._core.registerLinkProvider(e)
                }, e.prototype.registerCharacterJoiner = function (e) {
                    return this._checkProposedApi(), this._core.registerCharacterJoiner(e)
                }, e.prototype.deregisterCharacterJoiner = function (e) {
                    this._checkProposedApi(), this._core.deregisterCharacterJoiner(e)
                }, e.prototype.registerMarker = function (e) {
                    return this._checkProposedApi(), this._verifyIntegers(e), this._core.addMarker(e)
                }, e.prototype.addMarker = function (e) {
                    return this.registerMarker(e)
                }, e.prototype.hasSelection = function () {
                    return this._core.hasSelection()
                }, e.prototype.select = function (e, t, r) {
                    this._verifyIntegers(e, t, r), this._core.select(e, t, r)
                }, e.prototype.getSelection = function () {
                    return this._core.getSelection()
                }, e.prototype.getSelectionPosition = function () {
                    return this._core.getSelectionPosition()
                }, e.prototype.clearSelection = function () {
                    this._core.clearSelection()
                }, e.prototype.selectAll = function () {
                    this._core.selectAll()
                }, e.prototype.selectLines = function (e, t) {
                    this._verifyIntegers(e, t), this._core.selectLines(e, t)
                }, e.prototype.dispose = function () {
                    this._addonManager.dispose(), this._core.dispose()
                }, e.prototype.scrollLines = function (e) {
                    this._verifyIntegers(e), this._core.scrollLines(e)
                }, e.prototype.scrollPages = function (e) {
                    this._verifyIntegers(e), this._core.scrollPages(e)
                }, e.prototype.scrollToTop = function () {
                    this._core.scrollToTop()
                }, e.prototype.scrollToBottom = function () {
                    this._core.scrollToBottom()
                }, e.prototype.scrollToLine = function (e) {
                    this._verifyIntegers(e), this._core.scrollToLine(e)
                }, e.prototype.clear = function () {
                    this._core.clear()
                }, e.prototype.write = function (e, t) {
                    this._core.write(e, t)
                }, e.prototype.writeUtf8 = function (e, t) {
                    this._core.write(e, t)
                }, e.prototype.writeln = function (e, t) {
                    this._core.write(e), this._core.write("\r\n", t)
                }, e.prototype.paste = function (e) {
                    this._core.paste(e)
                }, e.prototype.getOption = function (e) {
                    return this._core.optionsService.getOption(e)
                }, e.prototype.setOption = function (e, t) {
                    this._core.optionsService.setOption(e, t)
                }, e.prototype.refresh = function (e, t) {
                    this._verifyIntegers(e, t), this._core.refresh(e, t)
                }, e.prototype.reset = function () {
                    this._core.reset()
                }, e.prototype.loadAddon = function (e) {
                    return this._addonManager.loadAddon(this, e)
                }, Object.defineProperty(e, "strings", {
                    get: function () {
                        return o
                    }, enumerable: !1, configurable: !0
                }), e.prototype._verifyIntegers = function () {
                    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                    for (var r = 0, i = e; r < i.length; r++) {
                        var n = i[r];
                        if (n === 1 / 0 || isNaN(n) || n % 1 != 0) throw new Error("This API only accepts integers")
                    }
                }, e
            }();
            e.Terminal = c;
            var l = function () {
                function e(e, t) {
                    this._buffer = e, this.type = t
                }

                return e.prototype.init = function (e) {
                    return this._buffer = e, this
                }, Object.defineProperty(e.prototype, "cursorY", {
                    get: function () {
                        return this._buffer.y
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "cursorX", {
                    get: function () {
                        return this._buffer.x
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "viewportY", {
                    get: function () {
                        return this._buffer.ydisp
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "baseY", {
                    get: function () {
                        return this._buffer.ybase
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "length", {
                    get: function () {
                        return this._buffer.lines.length
                    }, enumerable: !1, configurable: !0
                }), e.prototype.getLine = function (e) {
                    var t = this._buffer.lines.get(e);
                    if (t) return new u(t)
                }, e.prototype.getNullCell = function () {
                    return new t.CellData
                }, e
            }(), h = function () {
                function e(e) {
                    var t = this;
                    this._core = e, this._onBufferChange = new s.EventEmitter, this._normal = new l(this._core.buffers.normal, "normal"), this._alternate = new l(this._core.buffers.alt, "alternate"), this._core.buffers.onBufferActivate((function () {
                        return t._onBufferChange.fire(t.active)
                    }))
                }

                return Object.defineProperty(e.prototype, "onBufferChange", {
                    get: function () {
                        return this._onBufferChange.event
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "active", {
                    get: function () {
                        if (this._core.buffers.active === this._core.buffers.normal) return this.normal;
                        if (this._core.buffers.active === this._core.buffers.alt) return this.alternate;
                        throw new Error("Active buffer is neither normal nor alternate")
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "normal", {
                    get: function () {
                        return this._normal.init(this._core.buffers.normal)
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "alternate", {
                    get: function () {
                        return this._alternate.init(this._core.buffers.alt)
                    }, enumerable: !1, configurable: !0
                }), e
            }(), u = function () {
                function e(e) {
                    this._line = e
                }

                return Object.defineProperty(e.prototype, "isWrapped", {
                    get: function () {
                        return this._line.isWrapped
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "length", {
                    get: function () {
                        return this._line.length
                    }, enumerable: !1, configurable: !0
                }), e.prototype.getCell = function (e, r) {
                    if (!(e < 0 || e >= this._line.length)) return r ? (this._line.loadCell(e, r), r) : this._line.loadCell(e, new t.CellData)
                }, e.prototype.translateToString = function (e, t, r) {
                    return this._line.translateToString(e, t, r)
                }, e
            }(), f = function () {
                function e(e) {
                    this._core = e
                }

                return e.prototype.registerCsiHandler = function (e, t) {
                    return this._core.registerCsiHandler(e, (function (e) {
                        return t(e.toArray())
                    }))
                }, e.prototype.addCsiHandler = function (e, t) {
                    return this.registerCsiHandler(e, t)
                }, e.prototype.registerDcsHandler = function (e, t) {
                    return this._core.registerDcsHandler(e, (function (e, r) {
                        return t(e, r.toArray())
                    }))
                }, e.prototype.addDcsHandler = function (e, t) {
                    return this.registerDcsHandler(e, t)
                }, e.prototype.registerEscHandler = function (e, t) {
                    return this._core.registerEscHandler(e, t)
                }, e.prototype.addEscHandler = function (e, t) {
                    return this.registerEscHandler(e, t)
                }, e.prototype.registerOscHandler = function (e, t) {
                    return this._core.registerOscHandler(e, t)
                }, e.prototype.addOscHandler = function (e, t) {
                    return this.registerOscHandler(e, t)
                }, e
            }(), _ = function () {
                function e(e) {
                    this._core = e
                }

                return e.prototype.register = function (e) {
                    this._core.unicodeService.register(e)
                }, Object.defineProperty(e.prototype, "versions", {
                    get: function () {
                        return this._core.unicodeService.versions
                    }, enumerable: !1, configurable: !0
                }), Object.defineProperty(e.prototype, "activeVersion", {
                    get: function () {
                        return this._core.unicodeService.activeVersion
                    }, set: function (e) {
                        this._core.unicodeService.activeVersion = e
                    }, enumerable: !1, configurable: !0
                }), e
            }()
        })(), i
    })()
}));
//# sourceMappingURL=xterm.js.map