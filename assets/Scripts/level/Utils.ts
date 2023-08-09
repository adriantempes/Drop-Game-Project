
function t(e, t) {
    return (Math.random() * (t - e) | 0) + e
}

function n(e, n?) {
    return e[t(0, e.length)]
}

function _ArrayRandom(lst) {

    for (let n = 0; n < lst.length; ++n) {
        var o = lst.length * Math.random() | 0;
        if (n != o) {
            let t = [lst[o], lst[n]];
            lst[n] = t[0];
            lst[o] = t[1];
        }
    }
    return lst;
}

export default class Utils {

    static MakeArrayRandom = _ArrayRandom;

    static numberOfOccurencesInArr(e) {
        return e.reduce(function (e, t) {
            return t in e ? e[t + ""]++ : e[t + ""] = 1, e
        }, {})
    }

    static posOfOccurencesInArr(e) {
        return e.reduce(function (e, t, n) {
            return t in e ? e[t + ""].push(n) : e[t + ""] = [n], e
        }, {})
    }

    static swapTwoInArr(e, t, n) {
        var o;
        return o = [n[t], n[e]], n[e] = o[0], n[t] = o[1], n
    }

    static clamp(e, t, n) {
        return e > n ? n : e < t ? t : e
    }

    static lerp(e, t, n) {
        return t + (n - t) * e
    }

    static Mod(e, t) {
        for (; e < 0;) {
            e += t;
        }
        return e % t
    }

    static randomInt = t;

    static randomRange(e, t) {
        return Math.random() * (t - e) + e
    }

    static randomInArr = n;

    static randomTwoInArr(e) {
        return _ArrayRandom(e).slice(0, 2)
    }


    static isInRange(e, t, n) {
        return e >= t && e <= n
    }

    static setColorMatrix(t, n) {
        var o = Utils.HexToRGB(n);
        return t[0] = o.r / 255, t[6] = o.g / 255, t[12] = o.b / 255, t
    }

    static newColorMatrix(t) {
        var n = Utils.HexToRGB(t);
        return [n.r / 255, 0, 0, 0, 0, 0, n.g / 255, 0, 0, 0, 0, 0, n.b / 255, 0, 0, 0, 0, 0, 1, 0]
    }

    /**
     * 颜色转换
     * @param nHex
     */
    static HexToRGB(nHex) {
        return {
            b: 255 & nHex,
            g: nHex >> 8 & 255,
            r: nHex >> 16 & 255
        }
    }

    static pad(e, t) {
        return (Array(t).join("0") + e).slice(-t)
    }

    static arrayToSet(e) {
        var t = [];
        for (let n = 0; n < e.length; ++n)
            t.includes(e[n]) || t.push(e[n]);
        return t
    }

    static getMaxInArray(e) {
        for (var t = NaN, n = 0; n < e.length; ++n) (isNaN(t) || e[n] > t) && (t = e[n]);
        return t
    }

    private static safeLoadRes(url: string, type: typeof cc.Asset, completeCallback: (resource: any) => void) {
        let self = this;
        cc.loader.loadRes(url, type, (err, res) => {
            if (err) {
                cc.log(url + err)
                setTimeout(() => {
                    self.safeLoadRes(url, type, completeCallback)
                }, 0.5)
            } else {
                if (completeCallback) {
                    completeCallback(res);
                }
            }
        });
    }

    static LoadPrefab(pfbPath): Promise<cc.Prefab> {
        return new Promise(function (c, e) {
            Utils.safeLoadRes(pfbPath, cc.Prefab, (pfbNode) => {
                c(pfbNode);
            });
        })
    }

    static getOrLoadPrefab(e) {
        return new Promise(function (t) {
            var n = cc.loader.getRes(e);
            n ? t(n) : cc.loader.loadRes(e, cc.Asset, function (e, n) {
                t(n)
            })
        })
    }

    /**获取子弹图片 */
    static LoadGetBullet(sPlantName): Promise<cc.Texture2D> {
        let sBullet = "Bullet/" + sPlantName + "_ZiDan"
        return new Promise((c, e) => {
            var bulletRes = cc.loader.getRes(sBullet);
            if (bulletRes) {
                c(bulletRes)
            } else {
                cc.loader.loadRes(sBullet, cc.Texture2D, (e, bulletRes) => {
                    if (e) {
                        console.log("sPlantName errorr = ", sPlantName);
                    } else {
                        c(bulletRes)
                    }

                })
            }
        })
    }

    static randomItemsFromArray(e, t) {
        return _ArrayRandom(t.concat()).slice(0, e)
    }

    static deepClone(e) {
        return JSON.parse(JSON.stringify(e))
    }

    static Wait(nWaitTime, callback?) {
        return new Promise<void>((c, e) => {
            setTimeout(() => {
                callback && callback();
                c()
            }, nWaitTime)
        })
    }


    static callLater(e, t) {
        void 0 === t && (t = 0), setTimeout(e, t)
    }

    static removeByValue(e, t) {
        for (var n = 0; n < e.length; n++)
            if (e[n] == t) {
                e.splice(n, 1);
                break
            }
    };


    static formatHMS(e) {
        if (!(e < 0)) return [Math.floor(e / 3600) + "", Math.floor(e % 3600 / 60) + "", Math.floor(e % 60) + ""].map(function (e) {
            return e.length < 2 ? "0" + e : e
        }).join(":")
    }

    static FormatMS(nTime) {
        if (!(nTime < 0)) {
            return [Math.floor(nTime % 3600 / 60) + "", Math.floor(nTime % 3600 % 60) + ""].map(
                function (nTime) {
                    return nTime.length < 2 ? "0" + nTime : nTime
                }
            ).join(":")
        }
    }

    static getOrLoadTexture(e, t) {
        var n = cc.loader.getRes(e);
        n ? t(n) : cc.loader.loadRes(e, cc.Asset, void 0, function (e, n) {
            t(n)
        })
    }
}