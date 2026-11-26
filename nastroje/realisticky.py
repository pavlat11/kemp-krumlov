"""Úprava realistické textury mapy kempu, aby víc připomínala leteckou fotku:
   tráva s fotografickou strukturou a odstíny, štěrk se zrnem, asfalt, tmavší voda,
   jemné zrno a barevné ladění celé scény. Používá nastroje/mapa3d-export.py."""
import numpy as np
from PIL import Image, ImageFilter

def _sum(h, w, oktavy, seed):
    """vícevrstvý šum 0..1 (velké skvrny + jemná zrnitost)"""
    r = np.random.default_rng(seed); out = np.zeros((h, w), np.float32); tot = 0
    for d, wt in oktavy:
        sh, sw = max(2, h // d), max(2, w // d)
        z = Image.fromarray((r.random((sh, sw)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        out += np.asarray(z, np.float32) / 255 * wt; tot += wt
    return out / tot

def _maska(m, r=2):
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), np.float32) / 255

def realisticky(im, seed=7):
    im = im.convert('RGB'); w, h = im.size
    a = np.asarray(im, np.float32) / 255
    hsv = np.asarray(im.convert('HSV'), np.float32) / 255
    H, S, V = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]
    tr = _maska(((H > 65) & (H < 165) & (S > .22) & (V > .25)).astype(np.float32))
    st = _maska(((H > 15) & (H < 55) & (S > .06) & (S < .42) & (V > .62)).astype(np.float32))
    asf = _maska(((S < .1) & (V > .35) & (V < .82)).astype(np.float32))
    vo = _maska(((H > 170) & (H < 215) & (S > .18)).astype(np.float32))
    st_ = _maska((((H < 28) | (H > 335)) & (S > .32) & (V > .25)).astype(np.float32), 1)
    km = _maska(((H > 70) & (H < 170) & (S > .25) & (V < .58)).astype(np.float32), 1)
    velky = _sum(h, w, [(160, 3), (60, 2), (20, 1)], seed)
    stred = _sum(h, w, [(12, 2), (5, 1)], seed + 1)
    jemny = _sum(h, w, [(2, 2), (1, 1)], seed + 2)
    # tráva: světlejší a tmavší plochy, vyšlapaná a vyschlá místa, struktura stébel
    sk = (velky - .5) * 2
    tf = a * (0.86 + 0.30 * velky[..., None] + 0.14 * (stred[..., None] - .5) + 0.10 * (jemny[..., None] - .5))
    suche = np.clip((sk - .25) * 1.6, 0, 1)[..., None] * .38
    tf = tf * (1 - suche) + np.array([.62, .6, .38]) * suche * (0.8 + .4 * stred[..., None])
    tf = tf * np.array([.84, .9, .72])
    # štěrk a cesty: zrno a drobné kamínky
    kam = (jemny > .78).astype(np.float32) * .10 - (jemny < .2).astype(np.float32) * .08
    sf = a * (0.92 + 0.10 * stred[..., None] + kam[..., None]) * np.array([1.0, .98, .94])
    # asfalt a střechy bez barvy: jemná zrnitost
    af = a * (0.95 + 0.08 * (jemny[..., None] - .5) + 0.05 * (velky[..., None] - .5))
    # voda: tmavší, hlubší, s lehkým vlněním
    vf = a * np.array([.78, .86, .9]) * (0.92 + 0.10 * stred[..., None])
    # střechy: řady tašek a nerovnoměrné vyblednutí
    yy = np.arange(h, dtype=np.float32)[:, None]
    tasky = 0.93 + 0.07 * (np.sin(yy * 2 * np.pi / 4.2) > -.3)
    rf = a * (tasky[..., None] * (0.9 + 0.16 * stred[..., None])) * np.array([.96, .9, .86])
    # koruny stromů: shluky listí, světlejší a tmavší místa
    listi = _sum(h, w, [(7, 2), (3, 1)], seed + 3)
    kf = a * (0.72 + 0.6 * listi[..., None]) * np.array([.95, 1.0, .9])
    o = a.copy()
    for m, f in [(asf, af), (st, sf), (tr, tf), (vo, vf), (st_, rf), (km, kf)]:
        o = o * (1 - m[..., None]) + f * m[..., None]
    # celkové ladění jako fotka: méně sytosti, teplejší světla, chladnější stíny, zrno
    l = (o * np.array([.299, .587, .114])).sum(-1, keepdims=True)
    o = l + (o - l) * .76
    o = o + (np.array([.03, .015, -.02]) * l) + (np.array([-.015, 0, .02]) * (1 - l)) * .5
    o = np.clip(o, 0, 1)
    # ostré vektorové hrany změkčit jako u fotky, pak zrno a doostření
    out = Image.fromarray((o * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.9))
    o = np.asarray(out, np.float32) / 255 + (jemny[..., None] - .5) * .045
    out = Image.fromarray((np.clip(o, 0, 1) * 255).astype(np.uint8))
    return out.filter(ImageFilter.UnsharpMask(radius=2, percent=45, threshold=3))

if __name__ == '__main__':
    import sys
    realisticky(Image.open(sys.argv[1])).save(sys.argv[2])
