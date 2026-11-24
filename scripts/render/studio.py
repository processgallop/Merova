"""
Merova product render studio (Blender / bpy).

Builds a consistent photographic studio — seamless warm backdrop, large soft
key light, fill and rim — plus physically based packaging materials and
parametric primitives. Products are composed in products.py.

These are original renders for product presentation. They depict packaging
formats, not Merova's factory, staff or clients.
"""
import math
import os
import random

import bpy
import bmesh
from mathutils import Vector

RED = (0.835, 0.169, 0.118)       # Merova red #d52b1e (sRGB)
CHARCOAL = (0.271, 0.251, 0.251)  # #454040
CLOUD = (1.0, 0.98, 0.953)        # #fffaf3

TEX_DIR = os.path.join(os.path.dirname(__file__), "_tex")
os.makedirs(TEX_DIR, exist_ok=True)


def srgb_to_lin(c):
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


def hexc(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


# ---------------------------------------------------------------- scene ----

def reset(seed=7):
    random.seed(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scn = bpy.context.scene
    scn.render.engine = "CYCLES"
    scn.cycles.device = "CPU"
    scn.cycles.samples = int(os.environ.get("SAMPLES", "96"))
    scn.cycles.use_adaptive_sampling = True
    scn.cycles.adaptive_threshold = 0.02
    scn.cycles.use_denoising = True
    scn.cycles.max_bounces = 8
    scn.cycles.transmission_bounces = 8
    scn.cycles.transparent_max_bounces = 8
    scn.render.film_transparent = False
    # Khronos PBR Neutral keeps printed brand colours (Merova red) accurate.
    try:
        scn.view_settings.view_transform = "Khronos PBR Neutral"
    except TypeError:
        scn.view_settings.view_transform = "Standard"
    scn.view_settings.exposure = float(os.environ.get("EXPOSURE", "-0.75"))
    scn.render.resolution_x = int(os.environ.get("RES_X", "2000"))
    scn.render.resolution_y = int(os.environ.get("RES_Y", "1500"))
    scn.render.resolution_percentage = 100
    scn.render.image_settings.file_format = "PNG"
    world = bpy.data.worlds.new("World")
    scn.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (*srgb_to_lin(hexc("#eeebe6")), 1)
    bg.inputs[1].default_value = 0.18
    return scn


def studio(backdrop="#d9d3cb", key=1100, fill=170, rim=520, floor_size=14):
    """Seamless cyclorama and three soft lights."""
    # cyclorama: floor + curved wall
    bm = bmesh.new()
    segs = 24
    radius = 3.0
    pts = []
    for i in range(segs + 1):
        a = (math.pi / 2) * i / segs
        pts.append((0, -radius * math.sin(a) + 0, radius - radius * math.cos(a)))
    profile = [(0, floor_size / 2, 0)] + [(0, -p[1] * 1 - 0 - 0, p[2]) for p in []]
    # build profile along Y: floor from +y to 0, then curve up at back (negative y)
    prof = [(0.0, floor_size * 0.5, 0.0), (0.0, 0.0, 0.0)]
    for i in range(1, segs + 1):
        a = (math.pi / 2) * i / segs
        prof.append((0.0, -radius * math.sin(a), radius * (1 - math.cos(a))))
    prof.append((0.0, -radius, radius + 8))
    verts_l = [bm.verts.new((-floor_size / 2, y, z)) for (_, y, z) in prof]
    verts_r = [bm.verts.new((floor_size / 2, y, z)) for (_, y, z) in prof]
    for i in range(len(prof) - 1):
        bm.faces.new((verts_l[i], verts_r[i], verts_r[i + 1], verts_l[i + 1]))
    me = bpy.data.meshes.new("cyc")
    bm.to_mesh(me)
    bm.free()
    cyc = bpy.data.objects.new("cyc", me)
    bpy.context.collection.objects.link(cyc)
    cyc.location = (0, -0.6, 0)
    for p in me.polygons:
        p.use_smooth = True
    cyc.data.materials.append(mat_plain("backdrop", backdrop, rough=0.85))

    area("key", (-3.2, 3.0, 4.2), size=3.2, energy=key, color="#fffaf4")
    area("fill", (4.0, 2.5, 2.0), size=4.0, energy=fill, color="#f4f7ff")
    area("rim", (1.5, -3.5, 4.5), size=2.5, energy=rim, color="#ffffff")
    area("top", (0, 0.5, 6), size=4.0, energy=key * 0.35, color="#fffaf3")
    return cyc


def area(name, loc, size=2.0, energy=500, color="#ffffff"):
    ld = bpy.data.lights.new(name, "AREA")
    ld.shape = "DISK"
    ld.size = size
    ld.energy = energy
    ld.color = srgb_to_lin(hexc(color))
    ob = bpy.data.objects.new(name, ld)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    look_at(ob, (0, 0, 0.3))
    return ob


def look_at(ob, target):
    d = Vector(target) - ob.location
    ob.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def camera(loc=(0, 5.2, 2.4), target=(0, 0, 0.45), lens=70, dof=None):
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    cam = bpy.data.objects.new("cam", cd)
    bpy.context.collection.objects.link(cam)
    cam.location = loc
    look_at(cam, target)
    if dof:
        cd.dof.use_dof = True
        cd.dof.focus_distance = (Vector(loc) - Vector(target)).length
        cd.dof.aperture_fstop = dof
    bpy.context.scene.camera = cam
    return cam


def render(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


# ------------------------------------------------------------- materials ----

def _bsdf(m):
    return m.node_tree.nodes["Principled BSDF"]


def new_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m


def mat_plain(name, color, rough=0.6, metallic=0.0, spec=0.5, coat=0.0):
    m = new_mat(name)
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = (*srgb_to_lin(hexc(color) if isinstance(color, str) else color), 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metallic
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
    return m


def _noise_bump(m, scale=180.0, strength=0.08, detail=6.0):
    nt = m.node_tree
    b = _bsdf(m)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = scale
    nz.inputs["Detail"].default_value = detail
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    bump.inputs["Distance"].default_value = 0.002
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return nz


def mat_kraft(name="kraft", color="#b98c5c", rough=0.78):
    """Kraft liner with fibre mottling and micro bump."""
    m = new_mat(name)
    nt = m.node_tree
    b = _bsdf(m)
    b.inputs["Roughness"].default_value = rough
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 22.0
    nz.inputs["Detail"].default_value = 8.0
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    base = hexc(color)
    dark = tuple(max(0, c * 0.86) for c in base)
    light = tuple(min(1, c * 1.06) for c in base)
    ramp.color_ramp.elements[0].color = (*srgb_to_lin(dark), 1)
    ramp.color_ramp.elements[1].color = (*srgb_to_lin(light), 1)
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    _noise_bump(m, scale=260, strength=0.12)
    return m


def mat_flute(name="flute", color="#a87a4c", bands=1, rows=1):
    """Cut-edge material: liner lines and fluted waves (stacked for multi-wall)."""
    m = new_mat(name)
    nt = m.node_tree
    b = _bsdf(m)
    b.inputs["Roughness"].default_value = 0.9
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "X"
    wave.inputs["Scale"].default_value = 160.0
    wave.inputs["Distortion"].default_value = 0.0
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    base = hexc(color)
    ramp.color_ramp.elements[0].color = (*srgb_to_lin(tuple(c * 0.55 for c in base)), 1)
    ramp.color_ramp.elements[1].color = (*srgb_to_lin(base), 1)
    ramp.color_ramp.elements[0].position = 0.35
    nt.links.new(tc.outputs["Object"], wave.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    return m


def mat_board(name="board", color="#f6f2ea", rough=0.55, coat=0.15):
    m = mat_plain(name, color, rough=rough, coat=coat)
    _noise_bump(m, scale=400, strength=0.03)
    return m


def mat_image(name, path, rough=0.45, coat=0.2, metallic=0.0, alpha=False):
    """Printed artwork applied with the object's UV map."""
    m = new_mat(name)
    nt = m.node_tree
    b = _bsdf(m)
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(path)
    tex.interpolation = "Cubic"
    nt.links.new(tex.outputs["Color"], b.inputs["Base Color"])
    if alpha:
        nt.links.new(tex.outputs["Alpha"], b.inputs["Alpha"])
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metallic
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
    _noise_bump(m, scale=380, strength=0.025)
    return m


def mat_film(name="film", tint="#eef4f6", rough=0.06, ior=1.47, density=0.0):
    """Clear polymer film: thin transmissive dielectric with slight tint."""
    m = new_mat(name)
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = (*srgb_to_lin(hexc(tint)), 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["IOR"].default_value = ior
    b.inputs["Transmission Weight"].default_value = 1.0
    return m


def mat_metal_film(name="metfilm", color="#c9ced3", rough=0.18):
    return mat_plain(name, color, rough=rough, metallic=1.0)


def mat_food(name, color, rough=0.55, sss=0.0):
    m = mat_plain(name, color, rough=rough)
    b = _bsdf(m)
    if sss:
        b.inputs["Subsurface Weight"].default_value = sss
        b.inputs["Subsurface Radius"].default_value = (0.05, 0.03, 0.02)
    _noise_bump(m, scale=60, strength=0.25)
    return m


# --------------------------------------------------------------- textures ---

def make_texture(fname, w, h, draw):
    """Create an artwork PNG with Pillow. draw(img, ImageDraw) paints it."""
    from PIL import Image, ImageDraw
    path = os.path.join(TEX_DIR, fname)
    if os.path.exists(path) and not os.environ.get("RETEX"):
        return path
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw(img, ImageDraw.Draw(img))
    img.save(path)
    return path


GLYPH_SVG_PATH = None  # glyph is drawn from a polygon approximation baked by bake_glyph()


def glyph_points(scale=1.0, ox=0.0, oy=0.0):
    """Sampled outline of the Merova glyph (from the original SVG path) for printing on mockups."""
    import json
    pts = json.load(open(os.path.join(os.path.dirname(__file__), "glyph_points.json")))
    minx = min(p[0] for p in pts); maxx = max(p[0] for p in pts)
    miny = min(p[1] for p in pts); maxy = max(p[1] for p in pts)
    w = maxx - minx
    return [((x - minx) / w * scale + ox, (y - miny) / w * scale + oy) for x, y in pts], (maxy - miny) / w * scale


# ------------------------------------------------------------- primitives ---

def link(ob):
    bpy.context.collection.objects.link(ob)
    return ob


def mesh_obj(name, bm, mats=(), smooth=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    link(ob)
    for m in mats:
        me.materials.append(m)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    return ob


def bevel(ob, width=0.006, segments=3, angle=40):
    mod = ob.modifiers.new("bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(angle)
    mod.harden_normals = False
    return mod


def solidify(ob, t, offset=-1, rim_mat=None):
    mod = ob.modifiers.new("solid", "SOLIDIFY")
    mod.thickness = t
    mod.offset = offset
    mod.use_even_offset = True
    if rim_mat is not None:
        mod.material_offset_rim = rim_mat
    return mod


def shade_smooth(ob):
    for p in ob.data.polygons:
        p.use_smooth = True


def cube(name, size, loc=(0, 0, 0), mat=None, bev=0.006, rot=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]; v.co.y *= size[1]; v.co.z *= size[2]
    ob = mesh_obj(name, bm, [mat] if mat else [])
    ob.location = loc
    ob.rotation_euler = rot
    if bev:
        bevel(ob, bev)
    return ob


def box_uv_cube(name, w, d, h, mat, loc=(0, 0, 0), bev=0.004, rot=(0, 0, 0)):
    """Cube with a cross-layout UV unwrap (for printed cartons): artwork texture layout
    [top | front | side] rows: row0 = front (w x h), row1 = side (d x h), top (w x d)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= w; v.co.y *= d; v.co.z *= h
    uv = bm.loops.layers.uv.new()
    for f in bm.faces:
        n = f.normal
        for l in f.loops:
            x, y, z = l.vert.co
            if abs(n.z) > 0.5:   # top/bottom → right third
                u = 2 / 3 + (x / w + 0.5) / 3; vv = (y / d + 0.5)
            elif abs(n.y) > 0.5:  # front/back → left third
                u = (x / w + 0.5) / 3 * (1 if n.y > 0 else 1); vv = (z / h + 0.5)
                if n.y < 0:
                    u = (0.5 - x / w) / 3
            else:                 # sides → middle third
                u = 1 / 3 + ((y / d + 0.5) if n.x < 0 else (0.5 - y / d)) / 3; vv = (z / h + 0.5)
            l[uv].uv = (u, vv)
    ob = mesh_obj(name, bm, [mat])
    ob.location = loc
    ob.rotation_euler = rot
    if bev:
        bevel(ob, bev)
    return ob


def open_box(name, w, d, h, t, outer_mat, edge_mat, flap=0.62, flap_open=(1.95, 2.05, 1.85, 2.15), loc=(0, 0, 0), rot_z=0.0, flaps=True):
    """Open corrugated box with wall thickness, cut-edge material and four flaps."""
    parts = []
    bm = bmesh.new()
    # walls + floor as a thin open box mesh, solidified inward
    hw, hd = w / 2, d / 2
    v = [bm.verts.new(p) for p in [(-hw, -hd, 0), (hw, -hd, 0), (hw, hd, 0), (-hw, hd, 0),
                                   (-hw, -hd, h), (hw, -hd, h), (hw, hd, h), (-hw, hd, h)]]
    bm.faces.new((v[0], v[3], v[2], v[1]))  # floor (normal down)
    bm.faces.new((v[0], v[1], v[5], v[4]))
    bm.faces.new((v[1], v[2], v[6], v[5]))
    bm.faces.new((v[2], v[3], v[7], v[6]))
    bm.faces.new((v[3], v[0], v[4], v[7]))
    body = mesh_obj(name + "_body", bm, [outer_mat, edge_mat])
    solidify(body, t, offset=-1, rim_mat=1)
    bevel(body, t * 0.25, 2, 30)
    parts.append(body)
    if flaps:
        # flaps hinge on each top edge, rotate outward
        specs = [  # (hinge center, length dir, width, axis, sign)
            ((0, hd, h), w, d * flap, "X", 1),
            ((0, -hd, h), w, d * flap, "X", -1),
            ((hw, 0, h), d, w * flap * 0.92, "Y", 1),
            ((-hw, 0, h), d, w * flap * 0.92, "Y", -1),
        ]
        for i, (c, length, depth, axis, sign) in enumerate(specs):
            bm = bmesh.new()
            if axis == "X":
                pts = [(-length / 2, 0, 0), (length / 2, 0, 0), (length / 2, sign * depth, 0), (-length / 2, sign * depth, 0)]
            else:
                pts = [(0, -length / 2, 0), (sign * depth, -length / 2, 0), (sign * depth, length / 2, 0), (0, length / 2, 0)]
            vs = [bm.verts.new(p) for p in pts]
            bm.faces.new(vs)
            fl = mesh_obj(f"{name}_flap{i}", bm, [outer_mat, edge_mat])
            solidify(fl, t, offset=0, rim_mat=1)
            bevel(fl, t * 0.25, 2, 30)
            fl.location = c
            # flap_open ~2.0 → tip raised ~40° above horizontal, opening outward
            ang = math.radians(40 + (flap_open[i] - 2.0) * 60)
            if axis == "X":
                fl.rotation_euler = (sign * ang, 0, 0)
            else:
                fl.rotation_euler = (0, -sign * ang, 0)
            parts.append(fl)
    root = bpy.data.objects.new(name, None)
    link(root)
    for p in parts:
        p.parent = root
    root.location = loc
    root.rotation_euler = (0, 0, rot_z)
    return root


def closed_box(name, w, d, h, mat, edge_mat=None, loc=(0, 0, 0), rot_z=0.0, tape=None, seam=True):
    """Closed RSC box: body with bevels; a centre seam groove and optional tape strip."""
    body = cube(name, (w, d, h), (0, 0, h / 2), mat, bev=0.008)
    parts = [body]
    if seam:
        s = cube(name + "_seam", (w * 0.004, d * 1.002, 0.0015), (0, 0, h + 0.0003), mat_plain("seam", "#6e5134", 0.9), bev=0)
        parts.append(s)
    if tape:
        tp = cube(name + "_tape", (w * 0.18, d * 1.004, 0.0012), (0, 0, h + 0.0009), tape, bev=0)
        tp2 = cube(name + "_tape2", (w * 0.18, 0.0012, h * 0.28), (0, d / 2 + 0.0008, h - h * 0.14), tape, bev=0)
        parts += [tp, tp2]
    root = bpy.data.objects.new(name + "_root", None)
    link(root)
    for p in parts:
        p.parent = root
    root.location = loc
    root.rotation_euler = (0, 0, rot_z)
    return root


def lathe(name, profile, mats, segments=96, loc=(0, 0, 0), smooth=True, uv=True):
    """Revolve a (r, z) profile around Z. UV: u = angle, v = profile length fraction."""
    bm = bmesh.new()
    uvl = bm.loops.layers.uv.new() if uv else None
    rings = []
    for i in range(segments):
        a = 2 * math.pi * i / segments
        rings.append([bm.verts.new((r * math.cos(a), r * math.sin(a), z)) for r, z in profile])
    # cumulative profile length for v
    L = [0.0]
    for i in range(1, len(profile)):
        L.append(L[-1] + math.dist(profile[i], profile[i - 1]))
    tot = L[-1] or 1
    for i in range(segments):
        j = (i + 1) % segments
        for k in range(len(profile) - 1):
            f = bm.faces.new((rings[i][k], rings[j][k], rings[j][k + 1], rings[i][k + 1]))
            if uv:
                u0, u1 = 1 - i / segments, 1 - (i + 1) / segments
                for l, (uu, vv) in zip(f.loops, [(u0, L[k] / tot), (u1, L[k] / tot), (u1, L[k + 1] / tot), (u0, L[k + 1] / tot)]):
                    l[uvl].uv = (uu, vv)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = mesh_obj(name, bm, mats, smooth=smooth)
    ob.location = loc
    return ob


def cylinder(name, r, h, mat, loc=(0, 0, 0), segs=96, rot=(0, 0, 0), bev=0.003):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r, radius2=r, depth=h)
    ob = mesh_obj(name, bm, [mat])
    ob.location = loc
    ob.rotation_euler = rot
    shade_smooth(ob)
    if bev:
        bevel(ob, bev, 3, 50)
    return ob


def sphere(name, r, mat, loc=(0, 0, 0), scale=(1, 1, 1), sub=3):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=r)
    ob = mesh_obj(name, bm, [mat], smooth=True)
    ob.location = loc
    ob.scale = scale
    return ob


def displace(ob, strength=0.01, scale=0.6, tex_type="CLOUDS"):
    tex = bpy.data.textures.new(ob.name + "_tx", tex_type)
    tex.noise_scale = scale
    m = ob.modifiers.new("disp", "DISPLACE")
    m.texture = tex
    m.strength = strength
    return m


def popcorn(n, center, radius, height, mat_a, mat_b, seed=3):
    """Popped kernels: clusters of 3-5 displaced lobes with a golden hull, piled in a dome."""
    random.seed(seed)
    out = []
    hull = mat_food("hull", "#c98a3c", rough=0.45)
    for i in range(n):
        a = random.random() * 2 * math.pi
        rr = radius * math.sqrt(random.random())
        dome = height * max(0.0, 1 - (rr / radius) ** 2) ** 0.8
        z = center[2] + random.random() * dome
        s = random.uniform(0.026, 0.04)
        c = (center[0] + rr * math.cos(a), center[1] + rr * math.sin(a), z)
        for k in range(random.randint(3, 5)):
            off = (random.uniform(-1, 1) * s * 0.8, random.uniform(-1, 1) * s * 0.8, random.uniform(-1, 1) * s * 0.7)
            ob = sphere(f"pop{i}_{k}", s * random.uniform(0.55, 0.85), mat_a if random.random() > 0.2 else mat_b,
                        (c[0] + off[0], c[1] + off[1], c[2] + off[2]),
                        scale=(random.uniform(0.8, 1.3), random.uniform(0.8, 1.2), random.uniform(0.7, 1.1)), sub=2)
            displace(ob, strength=s * 0.55, scale=s * 1.2)
            out.append(ob)
        if random.random() > 0.5:
            sphere(f"hull{i}", s * 0.32, hull, (c[0], c[1], c[2] - s * 0.4), scale=(1.2, 0.8, 0.5), sub=1)
    return out


def mat_roll(name="rollfilm", tint="#dfe9ec", milky=0.0, rough=0.12):
    """Wound film seen in bulk: glossy, slightly milky, translucent at the edges."""
    m = new_mat(name)
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = (*srgb_to_lin(hexc(tint)), 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["IOR"].default_value = 1.12
    b.inputs["Transmission Weight"].default_value = 1.0 - milky
    if milky:
        b.inputs["Subsurface Weight"].default_value = milky
        b.inputs["Subsurface Radius"].default_value = (0.3, 0.3, 0.3)
    b.inputs["Coat Weight"].default_value = 0.6
    b.inputs["Coat Roughness"].default_value = 0.03
    # concentric winding rings on the end faces
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "RINGS"
    wave.inputs["Scale"].default_value = 18.0
    wave.inputs["Distortion"].default_value = 0.4
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.08
    nt.links.new(tc.outputs["Object"], wave.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m


def film_roll(name, r_out, r_core, length, film_mat, core_mat, loc=(0, 0, 0), axis="Z", tail=None):
    """Wound film roll: one solid wound body (with inner bore) on a cardboard core."""
    body = lathe(f"{name}_body", [(r_core * 1.02, -length / 2), (r_out * 0.985, -length / 2), (r_out, -length / 2 + 0.006),
                                   (r_out, length / 2 - 0.006), (r_out * 0.985, length / 2), (r_core * 1.02, length / 2), (r_core * 1.02, -length / 2)],
                 [film_mat])
    core = lathe(f"{name}_core", [(r_core * 0.8, -length / 2 - 0.008), (r_core, -length / 2 - 0.008), (r_core, length / 2 + 0.008),
                                   (r_core * 0.8, length / 2 + 0.008), (r_core * 0.8, -length / 2 - 0.008)], [core_mat])
    root = bpy.data.objects.new(name, None)
    link(root)
    body.parent = root
    core.parent = root
    root.location = loc
    if axis == "X":
        root.rotation_euler = (0, math.pi / 2, 0)
    elif axis == "Y":
        root.rotation_euler = (math.pi / 2, 0, 0)
    return root


def sheet(name, w, d, mat, loc=(0, 0, 0), rot=(0, 0, 0), t=0.0015, subdiv=0):
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=max(1, subdiv), y_segments=max(1, subdiv), size=0.5)
    for v in bm.verts:
        v.co.x *= w; v.co.y *= d
    uv = bm.loops.layers.uv.new()
    for f in bm.faces:
        for l in f.loops:
            l[uv].uv = (l.vert.co.x / w + 0.5, l.vert.co.y / d + 0.5)
    ob = mesh_obj(name, bm, [mat])
    ob.location = loc
    ob.rotation_euler = rot
    if t:
        solidify(ob, t, 0)
    return ob
