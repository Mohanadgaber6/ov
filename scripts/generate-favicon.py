import base64
from PIL import Image

# Read logo-web-trimmed.png
with open('attached_assets/logo-web-trimmed.png', 'rb') as f:
    b64_data = base64.b64encode(f.read()).decode('ascii')

svg_content = f'''<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="36" fill="#031730"/>
  <image href="data:image/png;base64,{b64_data}" x="15" y="30" width="150" height="120" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''

with open('artifacts/ov-office-site/public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

# Also generate favicon.png and favicon.ico
im = Image.open('attached_assets/logo-web-trimmed.png').convert('RGBA')

# Create a 180x180 canvas with rounded dark navy background
canvas = Image.new('RGBA', (180, 180), (3, 23, 48, 255))
# Scale logo to fit inside
im.thumbnail((150, 120), Image.Resampling.LANCZOS)
offset_x = (180 - im.width) // 2
offset_y = (180 - im.height) // 2
canvas.paste(im, (offset_x, offset_y), im)

canvas.save('artifacts/ov-office-site/public/favicon.png')
canvas.resize((32, 32), Image.Resampling.LANCZOS).save('artifacts/ov-office-site/public/favicon.ico')

print('Favicons generated successfully!')
