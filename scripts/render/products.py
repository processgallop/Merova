"""
Product scenes for Merova renders. Each function builds one composition.
Run: .venv/bin/python scripts/render/render.py <name ...|all> <outdir>
"""
import math
import random

import bpy
from studio import *  # noqa: F401,F403
from studio import _bsdf

SCENES = {}


def scene(name, **cam):
    def deco(fn):
        SCENES[name] = (fn, cam)
        return fn
    return deco


# ------------------------------------------------------------ artwork ------

def art_stripes(name, colors=("#d52b1e", "#fffaf3"), n=10, w=2048, h=1024, band=None, glyph=True, vertical=True):
    """Alternating stripes (classic concession print) with an optional cream band carrying the Merova mark."""
    def draw(img, d):
        stripe = w / n
        for i in range(n):
            d.rectangle([i * stripe, 0, (i + 1) * stripe, h], fill=colors[i % 2])
        if band:
            y0, y1 = int(h * band[0]), int(h * band[1])
            d.rectangle([0, y0, w, y1], fill="#fffaf3")
            if glyph:
                bh = y1 - y0
                for k in range(2):
                    _draw_glyph(d, w * (k + 0.5) / 2 - bh * 0.7, y0 + bh * 0.24, bh * 1.4, "#d52b1e")
    return make_texture(name + ".png", w, h, draw)


def _draw_glyph(d, x, y, width, color):
    pts, _ = glyph_points(width, x, y)
    d.polygon(pts, fill=color)


def art_band(name, base="#fffaf3", band="#d52b1e", band_pos=(0.55, 0.78), w=2048, h=1024, glyph_on="band", stripe2=None):
    def draw(img, d):
        d.rectangle([0, 0, w, h], fill=base)
        y0, y1 = int(h * band_pos[0]), int(h * band_pos[1])
        d.rectangle([0, y0, w, y1], fill=band)
        if stripe2:
            d.rectangle([0, int(h * stripe2[0]), w, int(h * stripe2[1])], fill=band)
        bh = y1 - y0
        col = "#fffaf3" if glyph_on == "band" else "#d52b1e"
        for k in range(3):
            if glyph_on == "band":
                _draw_glyph(d, w * (k + 0.5) / 3 - bh * 0.85, y0 + bh * 0.2, bh * 1.7, col)
            else:
                _draw_glyph(d, w * (k + 0.5) / 3 - h * 0.12, h * 0.18, h * 0.24, col)
    return make_texture(name + ".png", w, h, draw)


def art_carton(name, front="#fffaf3", accent="#d52b1e", style="band", w=3072, h=1024):
    """Carton net texture: [front | side | top] thirds."""
    def draw(img, d):
        d.rectangle([0, 0, w, h], fill=front)
        third = w // 3
        if style == "band":
            for i in range(2):
                x0 = i * third
                d.rectangle([x0, int(h * 0.62), x0 + third, int(h * 0.80)], fill=accent)
                _draw_glyph(d, x0 + third * 0.18, h * 0.16, third * 0.42, accent)
                d.rectangle([x0 + third * 0.18, h * 0.42, x0 + third * 0.7, h * 0.45], fill="#454040")
                d.rectangle([x0 + third * 0.18, h * 0.48, x0 + third * 0.55, h * 0.505], fill="#8a8483")
        elif style == "block":
            for i in range(2):
                x0 = i * third
                d.rectangle([x0, int(h * 0.0), x0 + third, int(h * 0.38)], fill=accent)
                _draw_glyph(d, x0 + third * 0.2, h * 0.09, third * 0.4, "#fffaf3")
                d.rectangle([x0 + third * 0.18, h * 0.56, x0 + third * 0.75, h * 0.59], fill="#454040")
                d.rectangle([x0 + third * 0.18, h * 0.63, x0 + third * 0.5, h * 0.655], fill="#8a8483")
        elif style == "pharma":
            for i in range(2):
                x0 = i * third
                d.rectangle([x0, int(h * 0.0), x0 + int(third * 0.1), h], fill=accent)
                d.rectangle([x0 + third * 0.2, h * 0.2, x0 + third * 0.8, h * 0.25], fill="#454040")
                d.rectangle([x0 + third * 0.2, h * 0.3, x0 + third * 0.6, h * 0.33], fill="#8a8483")
                d.rectangle([x0 + third * 0.2, h * 0.36, x0 + third * 0.66, h * 0.39], fill="#8a8483")
                d.rectangle([x0 + third * 0.2, h * 0.78, x0 + third * 0.5, h * 0.84], fill="#e9e4dd")
        # top panel
        d.rectangle([2 * third, 0, w, h], fill=front)
        _draw_glyph(d, 2 * third + third * 0.3, h * 0.38, third * 0.4, accent)
    return make_texture(name + ".png", w, h, draw)


# ------------------------------------------------------- corrugated --------

def _ply_box(ply):
    kraft = mat_kraft("kraft")
    flute = mat_flute("flute", bands=ply)
    t = {3: 0.012, 5: 0.022, 7: 0.032}[ply]
    open_box("box", 1.3, 0.95, 0.85, t, kraft, flute, loc=(0.05, 0, 0), rot_z=math.radians(-24))
    closed_box("box2", 1.15, 0.85, 0.62, kraft, loc=(-1.25, -0.55, 0), rot_z=math.radians(12),
               tape=mat_plain("tape", "#c79a68", 0.35, coat=0.6))


@scene("box-3ply", loc=(0.3, 5.6, 2.9), target=(-0.35, -0.2, 0.42), lens=60)
def s_box3():
    _ply_box(3)


@scene("box-5ply", loc=(2.3, 4.3, 3.0), target=(-0.45, -0.1, 0.55), lens=56)
def s_box5():
    # Double wall: a closer view onto the open box so the thicker board edge reads.
    kraft = mat_kraft("kraft", color="#b3864f")
    flute = mat_flute("flute", bands=5)
    open_box("box", 1.4, 1.05, 0.95, 0.024, kraft, flute, loc=(0.05, 0, 0), rot_z=math.radians(-18))
    closed_box("box2", 1.25, 0.9, 0.7, kraft, loc=(-1.35, -0.2, 0), rot_z=math.radians(8),
               tape=mat_plain("tape", "#c79a68", 0.35, coat=0.6))


@scene("box-7ply", loc=(0.6, 6.4, 2.4), target=(-0.3, -0.2, 0.85), lens=55)
def s_box7():
    # Triple wall: a large heavy-format box beside a stacked pair of sealed cartons.
    kraft = mat_kraft("kraft", color="#a87a46", rough=0.82)
    flute = mat_flute("flute", bands=7)
    open_box("box", 1.75, 1.3, 1.2, 0.034, kraft, flute, flap=0.72, loc=(0.25, 0, 0), rot_z=math.radians(-28))
    tape = mat_plain("tape", "#c79a68", 0.35, coat=0.6)
    closed_box("box2", 1.3, 1.0, 0.8, kraft, loc=(-1.55, -0.45, 0), rot_z=math.radians(6), tape=tape)
    closed_box("box3", 1.1, 0.85, 0.62, kraft, loc=(-1.5, -0.42, 0.8), rot_z=math.radians(-4), tape=tape)


# ----------------------------------------------------------- foodservice ---

def _popcorn_mats():
    return (mat_food("pop_a", "#fbf1d8", rough=0.7, sss=0.2), mat_food("pop_b", "#efd28f", rough=0.6, sss=0.2))


@scene("popcorn-tub", loc=(0, 4.6, 2.2), target=(0, 0, 0.62), lens=65)
def s_popcorn_tub():
    tex = art_stripes("tub", n=16, band=(0.38, 0.66))
    paper = mat_image("tubprint", tex, rough=0.42, coat=0.3)
    inner = mat_board("tubinner", "#f3eadb", rough=0.6, coat=0)
    rt, rb, h = 0.62, 0.43, 1.25
    # outer wall, rolled rim and inner wall
    lathe("tub", [(rb, 0.0), (rt, h)], [paper])
    lathe("tub_in", [(rt * 0.985, h), (rb * 0.985, 0.012)], [inner])
    lathe("tub_rim", [(rt * 0.985, h), (rt * 1.02, h + 0.012), (rt * 1.03, h - 0.004), (rt * 1.0, h - 0.02)], [inner])
    lathe("tub_base", [(0, 0.012), (rb * 0.985, 0.012)], [inner])
    a, b = _popcorn_mats()
    popcorn(260, (0, 0, h - 0.05), rt * 0.95, 0.42, a, b, seed=5)
    for i in range(10):  # a few spilled kernels
        ang = random.uniform(0.3, 2.4)
        r = random.uniform(0.75, 1.2)
        sphere(f"spill{i}", 0.03, a, (r * math.cos(ang), r * math.sin(ang), 0.025), scale=(1.1, 1, 0.8), sub=2)


# -------------------------------------------------------------- flexible ---

@scene("film-roll-clear", loc=(0.2, 4.4, 2.1), target=(0, 0, 0.45), lens=62)
def s_bopp():
    film = mat_roll("bopp", "#d6e2e6", milky=0.35, rough=0.16)
    sheetm = mat_film("boppsheet", "#f2f7f8", rough=0.03, ior=1.2)
    core = mat_kraft("core", "#a77b4f")
    film_roll("roll", 0.42, 0.11, 1.45, film, core, loc=(0.1, 0.1, 0.42), axis="X")
    sheet("tail", 1.38, 1.1, sheetm, loc=(0.1, 0.85, 0.003), t=0.0008)
    film_roll("roll2", 0.3, 0.1, 1.1, film, core, loc=(-1.0, -0.65, 0.55), axis="Z")


# =================================================================== helpers

def cup(name, rt, rb, h, outer, inner, loc=(0, 0, 0), rim=True):
    """Paper cup / tub: tapered wall, rolled rim, inner wall and base."""
    x, y, z = loc
    parts = [lathe(name, [(rb, 0.0), (rt, h)], [outer], loc=loc),
             lathe(name + "_in", [(rt * 0.986, h), (rb * 0.986, 0.01)], [inner], loc=loc),
             lathe(name + "_base", [(0, 0.01), (rb * 0.986, 0.01)], [inner], loc=loc)]
    if rim:
        parts.append(lathe(name + "_rim", [(rt * 0.986, h), (rt * 1.012, h + 0.009), (rt * 1.022, h - 0.004), (rt * 0.995, h - 0.016)], [inner], loc=loc))
    return parts


def lid_hot(name, r, loc):
    m = mat_plain(name + "m", "#f4f2ee", rough=0.32, coat=0.4)
    return lathe(name, [(0, 0.05), (r * 0.62, 0.05), (r * 0.7, 0.03), (r * 0.94, 0.028), (r * 1.03, 0.012), (r * 1.04, -0.012), (r * 0.99, -0.014)], [m], loc=loc)


def lid_dome(name, r, loc, straw=True):
    m = mat_film(name + "m", "#f3f7f8", rough=0.04, ior=1.3)
    parts = [lathe(name, [(0, r * 0.62), (r * 0.5, r * 0.55), (r * 0.9, r * 0.25), (r * 1.0, 0.01), (r * 1.04, -0.01)], [m], loc=loc)]
    solidify(parts[0], 0.004, 0)
    if straw:
        s = cylinder(name + "_straw", 0.022, 1.0, mat_plain("straw", "#d52b1e", 0.35, coat=0.4), (loc[0] + r * 0.12, loc[1], loc[2] + 0.35), rot=(0, math.radians(8), 0))
        parts.append(s)
    return parts


def tray_box(name, w, d, h, outer, inner, t=0.006, loc=(0, 0, 0), rot_z=0.0, taper=0.0):
    """Open tray (no flaps)."""
    import bmesh as _bm
    bm = _bm.new()
    hw, hd = w / 2, d / 2
    tw, td = hw + taper, hd + taper
    v = [bm.verts.new(p) for p in [(-hw, -hd, 0), (hw, -hd, 0), (hw, hd, 0), (-hw, hd, 0),
                                   (-tw, -td, h), (tw, -td, h), (tw, td, h), (-tw, td, h)]]
    bm.faces.new((v[0], v[3], v[2], v[1]))
    bm.faces.new((v[0], v[1], v[5], v[4]))
    bm.faces.new((v[1], v[2], v[6], v[5]))
    bm.faces.new((v[2], v[3], v[7], v[6]))
    bm.faces.new((v[3], v[0], v[4], v[7]))
    uv = bm.loops.layers.uv.new()
    for f in bm.faces:
        for l in f.loops:
            co = l.vert.co
            l[uv].uv = ((co.x / (2 * tw) + 0.5 + co.y / (2 * td) + 0.5) / 2, co.z / max(h, 1e-6))
    ob = mesh_obj(name, bm, [outer, inner])
    solidify(ob, t, -1)
    bevel(ob, t * 0.4, 2, 30)
    ob.location = loc
    ob.rotation_euler = (0, 0, rot_z)
    return ob


def chips(n, center, spread, mat, seed=4, z0=0.0, zr=0.08):
    random.seed(seed)
    import bmesh as _bm
    for i in range(n):
        bm = _bm.new()
        k = random.uniform(0.07, 0.1)
        a = bm.verts.new((0, k, 0)); b = bm.verts.new((-k * 0.9, -k * 0.6, 0)); c = bm.verts.new((k * 0.9, -k * 0.6, 0))
        bm.faces.new((a, b, c))
        ob = mesh_obj(f"chip{i}", bm, [mat])
        solidify(ob, 0.006, 0)
        sub = ob.modifiers.new("sub", "SUBSURF"); sub.levels = 2
        displace(ob, 0.012, 0.08)
        ob.location = (center[0] + random.uniform(-1, 1) * spread[0], center[1] + random.uniform(-1, 1) * spread[1], center[2] + z0 + random.random() * zr)
        ob.rotation_euler = (random.uniform(-0.6, 0.6), random.uniform(-0.6, 0.6), random.random() * 6.28)


def fries(n, center, spread, height, mat, seed=6):
    random.seed(seed)
    for i in range(n):
        L = height * random.uniform(0.75, 1.15)
        ob = cube(f"fry{i}", (0.032, 0.032, L), (center[0] + random.uniform(-1, 1) * spread[0], center[1] + random.uniform(-1, 1) * spread[1], center[2] + L / 2), mat, bev=0.008)
        ob.rotation_euler = (random.uniform(-0.18, 0.18), random.uniform(-0.18, 0.18), random.random() * 3)
        displace(ob, 0.004, 0.05)


def pouch(name, w, h, mat, loc, rot=(0, 0, 0), thick=0.05, zip_mat=None):
    """Flat pillow pouch: thin rounded slab, optional zip track."""
    ob = cube(name, (w, thick, h), loc, mat, bev=thick * 0.48)
    ob.modifiers["bevel"].segments = 6
    ob.rotation_euler = rot
    sub = ob.modifiers.new("sub", "SUBSURF"); sub.levels = 2
    shade_smooth(ob)
    if zip_mat:
        z = cube(name + "_zip", (w * 0.96, thick * 1.05, 0.012), (0, 0, h * 0.36), zip_mat, bev=0.003)
        z.parent = ob
    return ob


def hinge_lid(name, w, d, h, theta_deg, mat, rot_z=0.0, t=0.01, loc=(0, 0, 0)):
    """Lid hinged on the back edge (y = -d/2) of a w x d box of height h, opened by theta from closed."""
    pivot = bpy.data.objects.new(name + "_pivot", None)
    link(pivot)
    pivot.location = loc
    pivot.rotation_euler = (0, 0, rot_z)
    th = math.radians(theta_deg)
    lid = sheet(name, w, d, mat, t=t)
    lid.parent = pivot
    lid.location = (0, -d / 2 + (d / 2) * math.cos(th), h + (d / 2) * math.sin(th))
    lid.rotation_euler = (th, 0, 0)
    return lid


def red():
    return mat_plain("red", "#d52b1e", rough=0.42, coat=0.25)


def cream():
    return mat_board("cream", "#f7f2ea", rough=0.5, coat=0.2)


def bun_burger(loc, s=1.0):
    x, y, z = loc
    bun = mat_food("bun", "#c98a45", rough=0.45)
    sphere("bun_top", 0.28 * s, bun, (x, y, z + 0.17 * s), scale=(1, 1, 0.55))
    cylinder("patty", 0.27 * s, 0.07 * s, mat_food("patty", "#5a3220", rough=0.8), (x, y, z + 0.1 * s), bev=0.02)
    cylinder("cheese", 0.285 * s, 0.012 * s, mat_food("cheese", "#f0b42a", rough=0.35), (x, y, z + 0.14 * s), bev=0.003)
    cylinder("lettuce", 0.3 * s, 0.02 * s, mat_food("lettuce", "#6f9a3a", rough=0.5), (x, y, z + 0.06 * s), bev=0.008)
    cylinder("bun_bot", 0.27 * s, 0.07 * s, bun, (x, y, z + 0.02 * s), bev=0.03)


# ================================================================ corrugated

@scene("die-cut-box", loc=(0.4, 5.0, 3.0), target=(0, 0, 0.3), lens=60)
def s_diecut():
    kraft, flute = mat_kraft("kraft"), mat_flute("flute")
    tray_box("base", 1.5, 1.1, 0.42, kraft, kraft, t=0.01, rot_z=math.radians(-18))
    hinge_lid("lid", 1.5, 1.1, 0.42, 110, kraft, rot_z=math.radians(-18))
    ins = tray_box("insert", 1.3, 0.9, 0.2, cream(), cream(), t=0.008, loc=(0, 0, 0.05), rot_z=math.radians(-18))
    closed_box("ref", 0.9, 0.7, 0.32, kraft, loc=(-1.35, 0.35, 0), rot_z=math.radians(28))


@scene("heavy-duty", loc=(2.2, 5.6, 3.4), target=(0, 0, 0.75), lens=55)
def s_heavy():
    kraft = mat_kraft("kraft", "#b08356")
    pal = mat_plain("pallet", "#c4a27a", rough=0.85)
    for i, x in enumerate((-0.75, 0, 0.75)):
        cube(f"slat{i}", (0.18, 1.7, 0.1), (x, 0, 0.05), pal, bev=0.01)
    cube("deck", (1.75, 1.7, 0.04), (0, 0, 0.12), pal, bev=0.005)
    strap = mat_plain("strap", "#d52b1e", 0.4, coat=0.3)
    for ix, x in enumerate((-0.43, 0.43)):
        for iy, y in enumerate((-0.42, 0.42)):
            for iz in range(2):
                closed_box(f"b{ix}{iy}{iz}", 0.84, 0.82, 0.62, kraft, loc=(x, y, 0.14 + iz * 0.63), tape=mat_plain("tape", "#c79a68", 0.35, coat=0.6))
    cube("strap1", (1.74, 0.04, 0.01), (0, 0, 1.405), strap, bev=0)
    cube("strap2", (0.012, 1.68, 1.26), (0, 0, 0.77), strap, bev=0).scale = (1, 1, 1)
    cube("strap2f", (0.04, 0.012, 1.27), (0, 0.85, 0.775), strap, bev=0)


@scene("export-carton", loc=(1.6, 5.2, 2.6), target=(0, 0, 0.55), lens=60)
def s_export():
    kraft = mat_kraft("kraft", "#b6895a")

    def draw(img, d):
        W, H = img.size
        d.rectangle([0, 0, W, H], fill=(0, 0, 0, 0))
        # handling marks: this-way-up arrows, keep dry umbrella outline, generic panel lines
        for k in range(2):
            x0 = 70 + k * 140
            d.polygon([(x0, 120), (x0 + 40, 60), (x0 + 80, 120), (x0 + 55, 120), (x0 + 55, 200), (x0 + 25, 200), (x0 + 25, 120)], fill=(40, 34, 30, 230))
        d.rectangle([60, 220, 340, 230], fill=(40, 34, 30, 230))
        for i in range(4):
            d.rectangle([60, 300 + i * 46, 60 + [360, 260, 300, 220][i], 318 + i * 46], fill=(40, 34, 30, 200))
        d.rectangle([60, 520, 520, 600], outline=(213, 43, 30, 255), width=8)
    from PIL import Image
    path = make_texture("export_marks.png", 1024, 1024, lambda img, d: draw(img, d))
    marks = mat_image("marks", path, rough=0.8, coat=0, alpha=True)
    marks.blend_method = "HASHED" if hasattr(marks, "blend_method") else None
    closed_box("big", 1.2, 1.0, 1.05, kraft, loc=(0.1, 0, 0), rot_z=math.radians(-22), tape=mat_plain("tape", "#c79a68", 0.35, coat=0.6))
    m = sheet("mk", 0.8, 0.8, marks, t=0)
    m.parent = bpy.data.objects["big_root"]
    m.location = (-0.1, 0.501, 0.55)
    m.rotation_euler = (math.radians(90), 0, 0)
    closed_box("small", 0.8, 0.7, 0.6, kraft, loc=(-1.15, -0.45, 0), rot_z=math.radians(18), tape=mat_plain("tape2", "#c79a68", 0.35, coat=0.6))


@scene("ecommerce-mailer", loc=(0.2, 4.8, 3.3), target=(0, 0, 0.25), lens=60)
def s_mailer():
    tex = art_band("mailer_in", base="#f7f2ea", band="#d52b1e", band_pos=(0.0, 0.3), glyph_on="base")
    white = mat_board("mwhite", "#f6f2ea")
    printed = mat_image("mprint", tex, rough=0.5, coat=0.15)
    tray_box("mbase", 1.4, 1.0, 0.36, white, printed, t=0.01, rot_z=math.radians(-15))
    hinge_lid("mlid", 1.4, 1.0, 0.36, 105, printed, rot_z=math.radians(-15))
    tissue = mat_plain("tissue", "#d52b1e", rough=0.6)
    cube("tissue", (1.2, 0.8, 0.04), (0, 0, 0.3), tissue, bev=0.02, rot=(0, 0, math.radians(-15)))
    box_uv_cube("prod", 0.5, 0.35, 0.18, mat_image("prodart", art_carton("mailer_prod", style="block"), rough=0.4), (0.1, 0.05, 0.41), rot=(0, 0, math.radians(-25)))


@scene("tray", loc=(0.4, 4.6, 3.2), target=(0, 0, 0.25), lens=60)
def s_tray():
    kraft = mat_kraft("kraft")
    tray_box("tray", 1.5, 1.0, 0.28, kraft, kraft, t=0.012, rot_z=math.radians(-12))
    can = mat_plain("can", "#c9ccd0", rough=0.22, metallic=1.0)
    lab = mat_image("canlab", art_stripes("canlab", n=2, band=(0.3, 0.7)), rough=0.35, coat=0.3)
    for i in range(4):
        for j in range(3):
            x = -0.52 + i * 0.35; y = -0.3 + j * 0.31
            xr = x * math.cos(math.radians(-12)) - y * math.sin(math.radians(-12))
            yr = x * math.sin(math.radians(-12)) + y * math.cos(math.radians(-12))
            lathe(f"can{i}{j}", [(0, 0.02), (0.14, 0.02), (0.15, 0.06), (0.15, 0.52), (0.13, 0.57), (0, 0.57)], [lab], loc=(xr, yr, 0.012))


@scene("partitions", loc=(0.4, 4.4, 3.6), target=(0, 0, 0.35), lens=55)
def s_part():
    kraft, flute = mat_kraft("kraft"), mat_flute("flute")
    open_box("pb", 1.3, 1.0, 0.75, 0.012, kraft, flute, rot_z=math.radians(-20))
    root = bpy.data.objects["pb"]
    part = mat_kraft("part", "#c39566")
    for i in range(1, 4):
        p = cube(f"px{i}", (0.008, 0.97, 0.72), (-0.65 + i * 0.325, 0, 0.37), part, bev=0)
        p.parent = root
    for j in range(1, 3):
        p = cube(f"py{j}", (1.27, 0.008, 0.72), (0, -0.5 + j * 0.333, 0.37), part, bev=0)
        p.parent = root
    glass = mat_film("glass", "#7a5a2a", rough=0.05, ior=1.5)
    for i in range(4):
        for j in range(3):
            if (i + j) % 3 == 0:
                continue
            x = -0.49 + i * 0.325; y = -0.333 + j * 0.333
            b = lathe(f"bottle{i}{j}", [(0, 0), (0.1, 0), (0.11, 0.02), (0.11, 0.5), (0.06, 0.62), (0.04, 0.72), (0.04, 0.8), (0, 0.8)], [glass])
            b.parent = root
            b.location = (x, y, 0.015)


@scene("display-unit", loc=(0.6, 6.2, 2.6), target=(0, 0, 1.1), lens=55)
def s_display():
    tex = art_band("fsdu", base="#d52b1e", band="#fffaf3", band_pos=(0.86, 0.93), glyph_on="base")
    redm = mat_image("fsduart", tex, rough=0.45, coat=0.2)
    white = cream()
    body = box_uv_cube("fsdu", 0.9, 0.6, 2.0, redm, (0, -0.1, 1.0))
    head = box_uv_cube("head", 1.0, 0.1, 0.5, mat_image("headart", art_carton("fsdu_head", style="block"), rough=0.4), (0, 0.22, 2.2))
    prod = mat_image("pprod", art_carton("fsdu_prod", style="band"), rough=0.4)
    for k in range(3):
        z = 0.25 + k * 0.6
        cube(f"shelf{k}", (0.86, 0.6, 0.02), (0, 0.22, z), white, bev=0.004)
        for n in range(4):
            box_uv_cube(f"p{k}{n}", 0.18, 0.12, 0.3, prod, (-0.3 + n * 0.2, 0.36, z + 0.16))


# ================================================================== paperboard

@scene("mono-carton", loc=(0.3, 4.4, 1.9), target=(0, 0, 0.55), lens=70)
def s_mono():
    art = mat_image("mono", art_carton("mono", style="band"), rough=0.35, coat=0.35)
    box_uv_cube("c1", 0.42, 0.42, 1.2, art, (-0.35, 0.1, 0.6), rot=(0, 0, math.radians(-28)))
    box_uv_cube("c2", 0.42, 0.42, 1.2, art, (0.45, -0.25, 0.6), rot=(0, 0, math.radians(18)))
    glass = mat_film("amber", "#8a5524", rough=0.04, ior=1.5)
    lathe("bottle", [(0, 0), (0.16, 0), (0.17, 0.03), (0.17, 0.62), (0.08, 0.78), (0.06, 0.9), (0, 0.9)], [glass], loc=(0.25, 0.65, 0))
    cylinder("cap", 0.075, 0.1, mat_plain("capm", "#f4f1ea", 0.4), (0.25, 0.65, 0.94))


@scene("pharma-carton", loc=(0.2, 4.0, 2.4), target=(0, 0, 0.2), lens=70)
def s_pharma():
    art = mat_image("ph", art_carton("pharma", style="pharma", front="#ffffff"), rough=0.4, coat=0.3)
    box_uv_cube("p1", 1.1, 0.42, 0.28, art, (0, 0.1, 0.14), rot=(0, 0, math.radians(-12)))
    box_uv_cube("p2", 1.1, 0.42, 0.28, art, (-0.2, -0.25, 0.14), rot=(0, 0, math.radians(-12)))
    box_uv_cube("p3", 1.1, 0.42, 0.28, art, (-0.1, -0.08, 0.42), rot=(0, 0, math.radians(-8)))
    foil = mat_metal_film("foil", "#d5d9dd", rough=0.25)
    bl = cube("blister", (0.9, 0.38, 0.006), (0.55, 0.75, 0.003), foil, bev=0.002, rot=(0, 0, math.radians(15)))
    dome = mat_film("dome", "#f5f8fa", rough=0.05, ior=1.35)
    pill = mat_plain("pill", "#f4f1ea", 0.5)
    for i in range(5):
        for j in range(2):
            x = -0.34 + i * 0.17; y = -0.09 + j * 0.18
            s = sphere(f"d{i}{j}", 0.06, dome, (x, y, 0.006), scale=(1, 0.8, 0.45))
            s.parent = bl
            p = sphere(f"pl{i}{j}", 0.045, pill, (x, y, 0.012), scale=(1, 0.75, 0.35))
            p.parent = bl


@scene("food-carton", loc=(0.3, 4.6, 2.0), target=(0, 0, 0.6), lens=65)
def s_foodcarton():
    art = mat_image("fc", art_carton("food", style="block"), rough=0.35, coat=0.35)
    box_uv_cube("f1", 0.85, 0.32, 1.25, art, (-0.3, 0, 0.625), rot=(0, 0, math.radians(-20)))
    box_uv_cube("f2", 0.85, 0.32, 1.25, art, (0.65, -0.35, 0.625), rot=(0, 0, math.radians(12)))
    cookie = mat_food("cookie", "#c48a48", 0.6)
    for i in range(4):
        c = cylinder(f"ck{i}", 0.13, 0.03, cookie, (-0.2 + i * 0.22, 0.85, 0.015 + (i % 2) * 0.03), bev=0.012)
        displace(c, 0.008, 0.05)


@scene("window-carton", loc=(0.2, 4.4, 2.6), target=(0, 0, 0.3), lens=65)
def s_window():
    import bmesh as _bm
    art = mat_image("wc", art_carton("window", style="band"), rough=0.35, coat=0.3)
    box_uv_cube("w", 1.3, 0.9, 0.5, art, (0, 0, 0.25), rot=(0, 0, math.radians(-10)))
    win = mat_film("win", "#f4f8f9", rough=0.02, ior=1.2)
    # window: dark cut-out with film and visible contents
    hole = cube("hole", (0.8, 0.5, 0.004), (0, 0, 0.251), mat_plain("inside", "#e6dccd", 0.9), bev=0)
    hole.parent = bpy.data.objects["w"]
    film = cube("film", (0.82, 0.52, 0.002), (0, 0, 0.335), win, bev=0)
    film.parent = bpy.data.objects["w"]
    mac = [mat_food("m1", "#e3b7c4", 0.55), mat_food("m2", "#f0d58c", 0.55), mat_food("m3", "#c9dcae", 0.55)]
    for i in range(6):
        c = cylinder(f"mac{i}", 0.08, 0.07, mac[i % 3], (-0.3 + i * 0.12, 0, 0.29), bev=0.03, rot=(math.radians(90), 0, 0))
        c.parent = bpy.data.objects["w"]


@scene("sleeve", loc=(0.3, 4.5, 2.6), target=(0, 0, 0.2), lens=65)
def s_sleeve():
    tray_box("tr", 1.4, 0.95, 0.3, cream(), cream(), t=0.008, rot_z=math.radians(-12))
    sl = box_uv_cube("sl", 0.55, 1.0, 0.33, mat_image("slv", art_carton("sleeve", style="block"), rough=0.4, coat=0.3), (0.05, 0, 0.165), rot=(0, 0, math.radians(-12)))


@scene("gift-box", loc=(0.4, 4.8, 2.7), target=(0, 0, 0.4), lens=62)
def s_gift():
    redb = mat_plain("giftred", "#c8281c", rough=0.38, coat=0.5)
    cube("base", (1.05, 1.05, 0.55), (0, 0, 0.275), redb, bev=0.008, rot=(0, 0, math.radians(-20)))
    cube("lid", (1.08, 1.08, 0.18), (0, 0, 0.56), redb, bev=0.008, rot=(0, 0, math.radians(-20)))
    rib = mat_plain("ribbon", "#fffaf3", rough=0.3, coat=0.6)
    cube("rib1", (1.1, 0.09, 0.745), (0, 0, 0.373), rib, bev=0.002, rot=(0, 0, math.radians(-20)))
    cube("rib2", (0.09, 1.1, 0.745), (0, 0, 0.373), rib, bev=0.002, rot=(0, 0, math.radians(-20)))
    cube("small", (0.6, 0.6, 0.36), (-1.0, 0.55, 0.18), cream(), bev=0.006, rot=(0, 0, math.radians(15)))


@scene("rigid-box", loc=(0.0, 5.0, 3.0), target=(-0.35, -0.4, 0.2), lens=55)
def s_rigid():
    blk = mat_plain("blk", "#2c2828", rough=0.55, coat=0.2)
    tray_box("base", 1.3, 0.95, 0.38, blk, mat_plain("lining", "#f3ece2", 0.7), t=0.03, rot_z=math.radians(-14))
    cube("insert", (1.18, 0.83, 0.12), (0, 0, 0.2), mat_plain("foamin", "#ece4d8", 0.8), bev=0.01, rot=(0, 0, math.radians(-14)))
    lid = tray_box("lid", 1.34, 0.99, 0.2, blk, blk, t=0.03)
    lid.rotation_euler = (math.radians(180), 0, math.radians(8))
    lid.location = (-0.75, -0.95, 0.2)


@scene("paper-bag", loc=(0.5, 5.0, 2.2), target=(0, 0, 0.75), lens=60)
def s_bag():
    kraft = mat_kraft("bagk", "#b98c5c", rough=0.85)
    body = cube("bag", (0.9, 0.42, 1.2), (0, 0, 0.6), kraft, bev=0.004, rot=(0, 0, math.radians(-15)))
    band = cube("band", (0.905, 0.425, 0.22), (0, 0, 0.42), red(), bev=0.003, rot=(0, 0, math.radians(-15)))
    # rope handles
    import bmesh as _bm
    for k, yoff in enumerate((0.16, -0.16)):
        cu = bpy.data.curves.new(f"h{k}", "CURVE"); cu.dimensions = "3D"
        sp = cu.splines.new("BEZIER"); sp.bezier_points.add(2)
        pts = [(-0.2, yoff, 1.18), (0, yoff, 1.5), (0.2, yoff, 1.18)]
        for bp, p in zip(sp.bezier_points, pts):
            bp.co = p; bp.handle_left_type = bp.handle_right_type = "AUTO"
        cu.bevel_depth = 0.012
        ob = link(bpy.data.objects.new(f"handle{k}", cu))
        ob.data.materials.append(mat_plain("rope", "#7d5a38", 0.8))
        ob.rotation_euler = (0, 0, math.radians(-15))


# ================================================================ foodservice

@scene("popcorn-cone", loc=(0.2, 4.0, 1.6), target=(0, 0, 0.75), lens=70)
def s_cone():
    tex = art_stripes("cone", n=14)
    paper = mat_image("conep", tex, rough=0.45, coat=0.25)
    lathe("cone", [(0.0, 0.0), (0.36, 1.25)], [paper], loc=(0, 0, 0.12))
    a, b = _popcorn_mats()
    popcorn(90, (0, 0, 1.3), 0.33, 0.28, a, b, seed=9)
    stand = mat_plain("stand", "#efe9e0", 0.5)
    cylinder("standb", 0.2, 0.12, stand, (0, 0, 0.06), bev=0.02)
    lathe("cone2", [(0.0, 0.0), (0.36, 1.25)], [paper], loc=(-0.85, -0.4, 0.12)).rotation_euler = (0, 0, 0)
    cylinder("stand2", 0.2, 0.12, stand, (-0.85, -0.4, 0.06), bev=0.02)
    popcorn(70, (-0.85, -0.4, 1.3), 0.33, 0.25, a, b, seed=11)


@scene("nachos-tray", loc=(0.3, 3.6, 2.6), target=(0, 0, 0.15), lens=62)
def s_nachos():
    white = mat_board("nw", "#f7f3ec", rough=0.45, coat=0.3)
    printed = mat_image("np", art_band("nachos", base="#fffaf3", band="#d52b1e", band_pos=(0.15, 0.6), glyph_on="band"), rough=0.4, coat=0.3)
    tray_box("tray", 1.5, 0.9, 0.16, printed, white, t=0.008, rot_z=math.radians(-12), taper=0.04)
    well = lathe("well", [(0.0, 0.02), (0.2, 0.02), (0.24, 0.17)], [white], loc=(0.48, 0.1, 0))
    cheese = mat_food("dip", "#f2b63a", rough=0.25, sss=0.3)
    cylinder("dip", 0.21, 0.04, cheese, (0.48, 0.1, 0.13), bev=0.02)
    chip = mat_food("chip", "#e8b85a", rough=0.5)
    chips(28, (-0.25, -0.05, 0.05), (0.42, 0.3), chip, z0=0.0, zr=0.16)


@scene("fries-carton", loc=(0.3, 4.0, 1.7), target=(0, 0, 0.6), lens=70)
def s_fries():
    tex = art_band("fries", base="#d52b1e", band="#fffaf3", band_pos=(0.32, 0.55), glyph_on="band")
    printed = mat_image("frp", tex, rough=0.4, coat=0.3)
    tray_box("scoop", 0.55, 0.28, 0.85, printed, mat_board("frin", "#f5efe5"), t=0.008, taper=0.12)
    fry = mat_food("fry", "#f0c055", rough=0.55)
    fries(55, (0, 0, 0.25), (0.25, 0.13), 0.95, fry)
    tray_box("scoop2", 0.55, 0.28, 0.85, printed, mat_board("frin2", "#f5efe5"), t=0.008, taper=0.12, loc=(-0.95, -0.5, 0), rot_z=0.3)
    fries(45, (-0.95, -0.5, 0.25), (0.25, 0.13), 0.9, fry, seed=8)


@scene("burger-box", loc=(0.3, 4.2, 2.6), target=(0, 0, 0.25), lens=62)
def s_burger():
    printed = mat_image("bb", art_band("burger", base="#fffaf3", band="#d52b1e", band_pos=(0.2, 0.45), glyph_on="band"), rough=0.4, coat=0.3)
    inner = mat_board("bbi", "#f4eee4")
    tray_box("bot", 1.0, 1.0, 0.32, printed, inner, t=0.01, rot_z=math.radians(-15), taper=0.04)
    lid = tray_box("lid", 1.0, 1.0, 0.32, printed, inner, t=0.01, taper=0.04)
    lid.rotation_euler = (math.radians(180 - 70), 0, math.radians(-15))
    lid.location = (-0.14, -0.52, 0.34)
    bun_burger((0, 0, 0.02), 1.0)


@scene("food-tray", loc=(0.3, 4.0, 2.8), target=(0, 0, 0.12), lens=62)
def s_foodtray():
    kraft = mat_kraft("ftk", "#b78a5a", rough=0.7)
    tray_box("t1", 1.4, 0.75, 0.15, kraft, kraft, t=0.008, rot_z=math.radians(-10), taper=0.05)
    snack = mat_food("samosa", "#d39a4a", rough=0.6)
    for i in range(4):
        s = sphere(f"sn{i}", 0.13, snack, (-0.45 + i * 0.3, 0.0, 0.12), scale=(1.2, 0.9, 0.6), sub=3)
        displace(s, 0.02, 0.1)
    tray_box("t2", 1.1, 0.6, 0.13, kraft, kraft, t=0.008, loc=(-0.55, -0.85, 0), rot_z=math.radians(12), taper=0.05)


@scene("ice-cream-cup", loc=(0.2, 3.6, 1.6), target=(0, 0, 0.45), lens=72)
def s_icecream():
    tex = art_band("icecup", base="#fffaf3", band="#d52b1e", band_pos=(0.25, 0.7), glyph_on="band")
    printed = mat_image("ic", tex, rough=0.35, coat=0.4)
    cup("ic1", 0.42, 0.3, 0.55, printed, mat_board("ici", "#f6efe4"))
    cream_ = mat_food("icecream", "#f4d6dc", rough=0.45, sss=0.3)
    s = sphere("scoop", 0.27, cream_, (0, 0, 0.6), scale=(1, 1, 0.8), sub=4)
    displace(s, 0.03, 0.2)
    cup("ic2", 0.42, 0.3, 0.55, printed, mat_board("ici2", "#f6efe4"), loc=(-0.95, -0.45, 0))
    cylinder("lid2", 0.44, 0.03, mat_plain("lidp", "#fffaf3", 0.4), (-0.95, -0.45, 0.565), bev=0.01)


@scene("beverage-cups", loc=(0.3, 4.4, 1.9), target=(0, 0, 0.6), lens=65)
def s_cups():
    hot = mat_image("hot", art_band("hotcup", base="#d52b1e", band="#fffaf3", band_pos=(0.4, 0.62), glyph_on="band"), rough=0.4, coat=0.3)
    inner = mat_board("cupin", "#f6efe4")
    cup("hot", 0.33, 0.24, 1.0, hot, inner, loc=(-0.35, 0.05, 0))
    lid_hot("hotlid", 0.335, (-0.35, 0.05, 1.0))
    cold = mat_image("cold", art_band("coldcup", base="#fffaf3", band="#d52b1e", band_pos=(0.3, 0.55), glyph_on="band"), rough=0.35, coat=0.35)
    cup("cold", 0.36, 0.25, 1.15, cold, inner, loc=(0.5, -0.35, 0), rim=True)
    lid_dome("coldlid", 0.365, (0.5, -0.35, 1.15))


@scene("cup-sleeve", loc=(0.2, 3.8, 1.7), target=(0, 0, 0.55), lens=70)
def s_sleeve_cup():
    white = mat_image("w", art_band("cupw", base="#fffaf3", band="#fffaf3", band_pos=(0.0, 0.01)), rough=0.4, coat=0.3)
    inner = mat_board("cupin", "#f6efe4")
    cup("c", 0.33, 0.24, 1.0, white, inner)
    lid_hot("l", 0.335, (0, 0, 1.0))
    sl = mat_image("sl", art_band("sleeveart", base="#b98c5c", band="#d52b1e", band_pos=(0.35, 0.65), glyph_on="band"), rough=0.75)
    lathe("sleeve", [(0.24 + 0.09 * 0.28 + 0.012, 0.28), (0.24 + 0.09 * 0.72 + 0.012, 0.72)], [sl])
    displace(bpy.data.objects["sleeve"], 0.002, 0.01)


@scene("pizza-box", loc=(0.3, 4.4, 3.3), target=(0, 0, 0.1), lens=58)
def s_pizza():
    kraft, flute = mat_kraft("pk"), mat_flute("pf")
    tray_box("pbase", 1.5, 1.5, 0.14, kraft, mat_kraft("pin", "#c49a6c"), t=0.01, rot_z=math.radians(-12))
    hinge_lid("plid", 1.5, 1.5, 0.14, 100, kraft, rot_z=math.radians(-12))
    crust = mat_food("crust", "#d49a52", 0.6)
    cylinder("crust", 0.62, 0.05, crust, (0, 0, 0.04), bev=0.025)
    cylinder("sauce", 0.56, 0.02, mat_food("sauce", "#b8361d", 0.4), (0, 0, 0.065), bev=0.005)
    cylinder("cheese", 0.53, 0.015, mat_food("mozz", "#f2cf72", 0.35, sss=0.2), (0, 0, 0.078), bev=0.005)
    random.seed(2)
    pep = mat_food("pep", "#9c2a1a", 0.45)
    for i in range(12):
        a = random.random() * 6.28; r = random.uniform(0.1, 0.45)
        cylinder(f"pep{i}", 0.07, 0.012, pep, (r * math.cos(a), r * math.sin(a), 0.09), bev=0.004)


@scene("sandwich-box", loc=(0.4, 4.0, 1.6), target=(0, 0, 0.32), lens=66)
def s_sandwich():
    import bmesh as _bm
    for k, (ox, oy, rz) in enumerate(((0.25, 0.1, -22), (-0.75, -0.45, 14))):
        bm = _bm.new()
        tri = [(-0.5, 0.0), (0.5, 0.0), (0.12, 0.66)]  # (x, z)
        dep = 0.42
        f0 = [bm.verts.new((x, -dep / 2, z)) for x, z in tri]
        f1 = [bm.verts.new((x, dep / 2, z)) for x, z in tri]
        bm.faces.new(f0); bm.faces.new(f1[::-1])
        for i in range(3):
            j = (i + 1) % 3
            bm.faces.new((f0[i], f0[j], f1[j], f1[i]))
        bmesh_fix = _bm.ops.recalc_face_normals(bm, faces=bm.faces)
        ob = mesh_obj(f"wedge{k}", bm, [cream()])
        bevel(ob, 0.008)
        ob.location = (ox, oy, 0)
        ob.rotation_euler = (0, 0, math.radians(rz))
        # window on the front triangular face showing the sandwich cross-section
        brd = mat_food(f"bread{k}", "#e9c78e", 0.7)
        fill = mat_food(f"fill{k}", "#77a148", 0.5)
        tom = mat_food(f"tom{k}", "#c8402a", 0.45)
        for n, (mat, z0, z1) in enumerate(((brd, 0.06, 0.2), (fill, 0.2, 0.25), (tom, 0.25, 0.29), (brd, 0.29, 0.43))):
            c = cube(f"layer{k}{n}", (0.62 * (1 - z0), 0.004, z1 - z0), (0.0 + 0.06 * z0, dep / 2 + 0.004, (z0 + z1) / 2), mat, bev=0)
            c.parent = ob
        w = cube(f"win{k}", (0.66, 0.002, 0.42), (0.02, dep / 2 + 0.008, 0.25), mat_film(f"wf{k}", "#f2f7f8", 0.02, 1.2), bev=0)
        w.parent = ob
        lab = cube(f"lab{k}", (0.22, dep + 0.004, 0.06), (-0.33, 0, 0.08), red(), bev=0)
        lab.parent = ob


@scene("bakery-box", loc=(0.3, 4.6, 2.9), target=(0, 0, 0.3), lens=62)
def s_bakery():
    art = mat_image("bk", art_carton("bakery", style="band"), rough=0.4, coat=0.25)
    box_uv_cube("bk", 1.25, 1.0, 0.55, art, (0, 0, 0.275), rot=(0, 0, math.radians(-14)))
    hole = cube("hole", (0.8, 0.6, 0.004), (0, 0, 0.276), mat_plain("inside", "#e6dccd", 0.9), bev=0)
    hole.parent = bpy.data.objects["bk"]
    film = cube("film", (0.82, 0.62, 0.002), (0, 0, 0.37), mat_film("bf", "#f4f8f9", 0.02, 1.2), bev=0)
    film.parent = bpy.data.objects["bk"]
    pastry = mat_food("pastry", "#cf8f45", 0.5)
    for i in range(3):
        for j in range(2):
            p = sphere(f"cr{i}{j}", 0.11, pastry, (-0.25 + i * 0.25, -0.13 + j * 0.26, 0.31), scale=(1.3, 0.9, 0.5))
            displace(p, 0.02, 0.1)
            p.parent = bpy.data.objects["bk"]


@scene("takeaway-box", loc=(0.3, 4.2, 1.9), target=(0, 0, 0.55), lens=66)
def s_takeaway():
    art = mat_image("tk", art_band("takeaway", base="#fffaf3", band="#d52b1e", band_pos=(0.35, 0.58), glyph_on="band"), rough=0.4, coat=0.25)
    pail = tray_box("pail", 0.62, 0.62, 0.85, art, mat_board("tki", "#f4eee4"), t=0.008, taper=0.12, rot_z=math.radians(-25))
    for k, sgn in enumerate((1, -1)):
        flap = sheet(f"tf{k}", 0.86, 0.42, art, t=0.008)
        flap.location = (0, sgn * 0.37 * 1.0, 0.85)
        flap.rotation_euler = (math.radians(sgn * 35), 0, 0)
        flap.parent = pail
    cu = bpy.data.curves.new("wire", "CURVE"); cu.dimensions = "3D"
    sp = cu.splines.new("BEZIER"); sp.bezier_points.add(2)
    for bp, p in zip(sp.bezier_points, [(-0.42, 0, 0.6), (0, 0, 1.35), (0.42, 0, 0.6)]):
        bp.co = p; bp.handle_left_type = bp.handle_right_type = "AUTO"
    cu.bevel_depth = 0.007
    w = link(bpy.data.objects.new("wire", cu))
    w.data.materials.append(mat_plain("wirem", "#b9bcc0", 0.3, metallic=1))
    w.parent = pail


@scene("qsr-range", loc=(0.2, 6.2, 2.6), target=(0, 0, 0.55), lens=55)
def s_qsr():
    inner = mat_board("in", "#f5efe5")
    hot = mat_image("hot", art_band("hotcup", base="#d52b1e", band="#fffaf3", band_pos=(0.4, 0.62), glyph_on="band"), rough=0.4, coat=0.3)
    cup("hot", 0.33, 0.24, 1.0, hot, inner, loc=(1.05, -0.2, 0))
    lid_hot("hl", 0.335, (1.05, -0.2, 1.0))
    fr = mat_image("frp", art_band("fries", base="#d52b1e", band="#fffaf3", band_pos=(0.32, 0.55), glyph_on="band"), rough=0.4, coat=0.3)
    tray_box("scoop", 0.55, 0.28, 0.85, fr, inner, t=0.008, taper=0.12, loc=(0.1, 0.25, 0))
    fries(50, (0.1, 0.25, 0.25), (0.25, 0.13), 0.95, mat_food("fry", "#f0c055", 0.55))
    bb = mat_image("bb", art_band("burger", base="#fffaf3", band="#d52b1e", band_pos=(0.2, 0.45), glyph_on="band"), rough=0.4, coat=0.3)
    tray_box("bbox", 0.95, 0.95, 0.3, bb, inner, t=0.01, taper=0.04, loc=(-0.95, -0.15, 0), rot_z=0.35)
    lid = tray_box("blid", 0.95, 0.95, 0.3, bb, inner, t=0.01, taper=0.04)
    lid.rotation_euler = (math.radians(180), 0, 0.35)
    lid.location = (-0.95, -0.15, 0.62)
    tub = mat_image("tub", art_stripes("tub", n=16, band=(0.38, 0.66)), rough=0.42, coat=0.3)
    cup("tub", 0.45, 0.32, 0.9, tub, inner, loc=(-0.15, -0.85, 0))
    a, b = _popcorn_mats()
    popcorn(120, (-0.15, -0.85, 0.86), 0.42, 0.3, a, b)


# ================================================================== flexible

def _roll_scene(tint, milky, name, rough=0.16, centre_fold=False, second=True, sheet_tint=None):
    film = mat_roll(name, tint, milky=milky, rough=rough)
    core = mat_kraft("core", "#a77b4f")
    film_roll("roll", 0.42, 0.11, 1.45, film, core, loc=(0.1, 0.1, 0.42), axis="X")
    sheet("tail", 1.38, 1.1, mat_film(name + "s", sheet_tint or tint, rough=0.05, ior=1.2), loc=(0.1, 0.85, 0.003), t=0.0008)
    if centre_fold:
        cube("fold", (1.38, 0.02, 0.003), (0.1, 0.85, 0.006), mat_film("foldline", "#e8f0f2", 0.1, 1.3), bev=0)
    if second:
        film_roll("roll2", 0.3, 0.1, 1.1, film, core, loc=(-1.0, -0.65, 0.55), axis="Z")


CAM_ROLL = dict(loc=(0.2, 4.4, 2.1), target=(0, 0, 0.45), lens=62)


@scene("film-roll-white", **CAM_ROLL)
def s_ldpe():
    _roll_scene("#eef0ee", 0.7, "ldpe", rough=0.3)


@scene("film-roll-pof", **CAM_ROLL)
def s_pof():
    _roll_scene("#e2ecef", 0.15, "pof", rough=0.06, centre_fold=True)


@scene("film-roll-green", **CAM_ROLL)
def s_compshrink():
    _roll_scene("#cfe0c4", 0.45, "comp", rough=0.2, sheet_tint="#e3eedb")


@scene("laminate-roll", **CAM_ROLL)
def s_laminate():
    tex = art_band("laminate", base="#d52b1e", band="#fffaf3", band_pos=(0.4, 0.6), glyph_on="band")
    printed = mat_image("lam", tex, rough=0.25, coat=0.6)
    core = mat_kraft("core", "#a77b4f")
    film_roll("roll", 0.42, 0.11, 1.45, printed, core, loc=(0.1, 0.1, 0.42), axis="X")
    sheet("tail", 1.38, 1.1, printed, loc=(0.1, 0.85, 0.003), t=0.0008)
    for i in range(3):
        pouch(f"sachet{i}", 0.38, 0.5, printed, (-1.05 + i * 0.12, -0.6 + i * 0.05, 0.03 + i * 0.012), rot=(math.radians(90), 0, 0.2 + i * 0.25), thick=0.025)


@scene("barrier-film", **CAM_ROLL)
def s_barrier():
    met = mat_metal_film("met", "#c7ccd1", rough=0.32)
    core = mat_kraft("core", "#a77b4f")
    film_roll("roll", 0.42, 0.11, 1.45, met, core, loc=(0.1, 0.1, 0.42), axis="X")
    sheet("tail", 1.38, 1.1, met, loc=(0.1, 0.85, 0.003), t=0.0008)
    film_roll("roll2", 0.3, 0.1, 1.1, mat_roll("clr", "#dbe6ea", 0.3, 0.12), core, loc=(-1.0, -0.65, 0.55), axis="Z")


def _dispenser(film_tint, accent):
    art = mat_image("disp", art_carton("disp_" + accent.strip("#"), style="block", accent=accent), rough=0.4, coat=0.3)
    box_uv_cube("dbox", 1.6, 0.38, 0.38, art, (0, 0, 0.19), rot=(0, 0, math.radians(-8)))
    film = mat_film("cl", film_tint, rough=0.05, ior=1.25)
    s = sheet("pull", 1.45, 0.9, film, t=0.0008, subdiv=8)
    s.location = (0.0, 0.62, 0.17)
    s.rotation_euler = (math.radians(22), 0, math.radians(-8))
    roll = mat_roll("rl", film_tint, milky=0.3, rough=0.12)
    film_roll("spare", 0.16, 0.06, 1.4, roll, mat_kraft("core", "#a77b4f"), loc=(-0.15, -0.65, 0.16), axis="X")


@scene("cling-roll", loc=(0.3, 4.4, 2.2), target=(0, 0, 0.2), lens=58)
def s_cling():
    _dispenser("#eef4f6", "#d52b1e")


@scene("cling-roll-green", loc=(0.3, 4.4, 2.2), target=(0, 0, 0.2), lens=58)
def s_cling_green():
    _dispenser("#e1ecd8", "#4f7a46")


@scene("ldpe-pouch", loc=(0.2, 3.4, 2.9), target=(0, 0, 0.05), lens=62)
def s_ldpe_pouch():
    film = mat_film("lp", "#f1f6f7", rough=0.12, ior=1.3)
    zipm = mat_plain("zip", "#d52b1e", 0.4)
    contents = [mat_plain("part1", "#9aa1a8", 0.3, metallic=1), mat_board("card", "#f4efe6")]
    for i in range(4):
        p = pouch(f"p{i}", 0.62, 0.85, film, (-0.5 + i * 0.36, 0.0 - i * 0.1, 0.03 + i * 0.006), rot=(math.radians(90), 0, math.radians(-12 + i * 9)), thick=0.03, zip_mat=zipm)
    cube("bolt", (0.25, 0.06, 0.06), (-0.5, 0, 0.05), contents[0], bev=0.02)
    cylinder("washer", 0.07, 0.015, contents[0], (0.25, -0.2, 0.06), bev=0.004)


@scene("compostable-bag", loc=(0.2, 3.8, 2.6), target=(0, 0, 0.1), lens=62)
def s_comp_bag():
    green = mat_film("cb", "#9fbf8f", rough=0.35, ior=1.3)
    b = _bsdf(green)
    b.inputs["Transmission Weight"].default_value = 0.55
    for i in range(6):
        p = pouch(f"bag{i}", 1.1, 1.4, green, (0.0, 0.0, 0.015 + i * 0.012), rot=(math.radians(90), 0, math.radians(-10 + i * 2.5)), thick=0.01)
    fl = pouch("top", 1.1, 1.4, green, (-0.25, 0.75, 0.11), rot=(math.radians(90), 0, math.radians(18)), thick=0.01)
    lab = cube("leaf", (0.22, 0.004, 0.22), (0, -0.007, 0.3), mat_plain("lbl", "#fffaf3", 0.5), bev=0)
    lab.parent = fl


# ===================================================================== heroes

@scene("hero", loc=(1.9, 7.0, 2.5), target=(1.9, 0, 0.62), lens=46, _res=(2400, 1350))
def s_hero():
    """All five verticals in one composition for the homepage hero."""
    kraft, flute = mat_kraft("kraft"), mat_flute("flute")
    open_box("hb", 1.25, 0.95, 0.85, 0.016, kraft, flute, loc=(-2.05, -0.3, 0), rot_z=math.radians(-18))
    closed_box("hb2", 1.1, 0.85, 0.7, kraft, loc=(-2.55, -1.35, 0), rot_z=math.radians(10), tape=mat_plain("tape", "#c79a68", 0.35, coat=0.6))
    closed_box("hb3", 1.1, 0.85, 0.6, kraft, loc=(-2.55, -1.35, 0.7), rot_z=math.radians(4), tape=mat_plain("tape2", "#c79a68", 0.35, coat=0.6))
    art = mat_image("mono", art_carton("mono", style="band"), rough=0.35, coat=0.35)
    box_uv_cube("c1", 0.42, 0.42, 1.2, art, (-0.85, 0.35, 0.6), rot=(0, 0, math.radians(-24)))
    box_uv_cube("c2", 0.85, 0.32, 1.25, mat_image("fc", art_carton("food", style="block"), rough=0.35, coat=0.35), (-0.3, -0.45, 0.625), rot=(0, 0, math.radians(8)))
    inner = mat_board("in", "#f5efe5")
    tub = mat_image("tub", art_stripes("tub", n=16, band=(0.38, 0.66)), rough=0.42, coat=0.3)
    cup("tub", 0.5, 0.36, 1.05, tub, inner, loc=(0.55, 0.25, 0))
    a, b = _popcorn_mats()
    popcorn(170, (0.55, 0.25, 1.0), 0.47, 0.34, a, b)
    hot = mat_image("hot", art_band("hotcup", base="#d52b1e", band="#fffaf3", band_pos=(0.4, 0.62), glyph_on="band"), rough=0.4, coat=0.3)
    cup("hot", 0.3, 0.22, 0.92, hot, inner, loc=(1.35, 0.75, 0))
    lid_hot("hl", 0.305, (1.35, 0.75, 0.92))
    film = mat_roll("bopp", "#d6e2e6", milky=0.35, rough=0.16)
    core = mat_kraft("core", "#a77b4f")
    film_roll("roll", 0.38, 0.1, 1.3, film, core, loc=(2.25, -0.1, 0.38), axis="X")
    film_roll("roll2", 0.28, 0.09, 1.0, film, core, loc=(2.55, -1.15, 0.5), axis="Z")
    lam = mat_image("lam", art_band("laminate", base="#d52b1e", band="#fffaf3", band_pos=(0.4, 0.6), glyph_on="band"), rough=0.25, coat=0.6)
    for i in range(3):
        pouch(f"sachet{i}", 0.36, 0.48, lam, (1.2 + i * 0.13, -0.85 + i * 0.05, 0.03 + i * 0.012), rot=(math.radians(90), 0, 0.2 + i * 0.25), thick=0.025)
