from PIL import Image

images = ["nh-opt1.png", "nh-opt2.png", "nh-opt3.png", "nh-opt6.png", "new_heights_logo.png"]
opened_images = [Image.open(img).convert("RGBA") for img in images]

# Create a blank canvas
canvas_width = 800
canvas_height = 800
canvas = Image.new("RGBA", (canvas_width, canvas_height), (255, 255, 255, 255))

# Resize and paste
for i, img in enumerate(opened_images[:4]):
    img = img.resize((300, 300))
    x = (i % 2) * 400 + 50
    y = (i // 2) * 400 + 50
    canvas.paste(img, (x, y), img)

logo = opened_images[4]
logo.thumbnail((200, 200))
canvas.paste(logo, (300, 350), logo)

canvas.save("reference_grid.png")
print("Saved reference_grid.png")
