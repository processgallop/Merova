"""
Render Merova product scenes.
  python render.py <scene|all> [scene ...] --out DIR
Environment: SAMPLES, RES_X, RES_Y, EXPOSURE.
"""
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
import studio  # noqa: E402
import products  # noqa: E402

args = sys.argv[1:]
out = "renders"
if "--out" in args:
    i = args.index("--out")
    out = args[i + 1]
    args = args[:i] + args[i + 2:]
os.makedirs(out, exist_ok=True)
names = list(products.SCENES) if args == ["all"] else args
for name in names:
    if name not in products.SCENES:
        print("unknown scene", name)
        continue
    fn, cam = products.SCENES[name]
    t = time.time()
    res = cam.pop("_res", None)
    studio.reset()
    if res and not os.environ.get("RES_LOCK"):
        studio.bpy.context.scene.render.resolution_x, studio.bpy.context.scene.render.resolution_y = res
    studio.studio(**(cam.pop("_studio", {}) if "_studio" in cam else {}))
    fn()
    studio.camera(**cam)
    studio.render(os.path.join(out, name + ".png"))
    print(f"rendered {name} in {time.time() - t:.0f}s", flush=True)
