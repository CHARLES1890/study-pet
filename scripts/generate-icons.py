from PIL import Image, ImageDraw, ImageFont
import os

out_dir = '../src-tauri/icons'
os.makedirs(out_dir, exist_ok=True)

sizes = [32, 128, 256]

def make_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Background circle
    margin = size // 16
    draw.ellipse([margin, margin, size - margin, size - margin], fill=(108, 155, 207, 255))
    # Draw a simple cat-like face using circles
    eye_r = max(2, size // 16)
    draw.ellipse([size*0.32 - eye_r, size*0.38 - eye_r, size*0.32 + eye_r, size*0.38 + eye_r], fill=(255, 255, 255, 230))
    draw.ellipse([size*0.68 - eye_r, size*0.38 - eye_r, size*0.68 + eye_r, size*0.38 + eye_r], fill=(255, 255, 255, 230))
    nose_r = max(2, size // 20)
    draw.ellipse([size*0.5 - nose_r, size*0.52 - nose_r, size*0.5 + nose_r, size*0.52 + nose_r], fill=(255, 220, 220, 230))
    return img

for s in sizes:
    img = make_icon(s)
    if s == 256:
        img.save(os.path.join(out_dir, '128x128@2x.png'))
    elif s == 128:
        img.save(os.path.join(out_dir, '128x128.png'))
    elif s == 32:
        img.save(os.path.join(out_dir, '32x32.png'))

# ICO
make_icon(256).save(os.path.join(out_dir, 'icon.ico'), format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])

# ICNS (macOS) - Pillow doesn't support ICNS, create a 512 PNG and copy as placeholder
make_icon(512).save(os.path.join(out_dir, 'icon.icns'))

print('Icons generated.')
