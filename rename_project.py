import os

files_to_update = [
    "VAAYU_CORE_SPEC.md",
    "backend/main.py",
    "extension/package.json",
    "extension/src/popup.tsx",
    "extension/src/contents/explainPanel.tsx",
    "extension/src/contents/redBanner.tsx",
    "extension/src/contents/detector.ts"
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}, does not exist.")
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace Vaayu -> XPOSE
    content = content.replace("Vaayu", "XPOSE")
    content = content.replace("vaayu", "xpose")
    content = content.replace("VAAYU", "XPOSE")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Updated {file_path}")

# Rename the spec file
if os.path.exists("VAAYU_CORE_SPEC.md"):
    os.rename("VAAYU_CORE_SPEC.md", "XPOSE_CORE_SPEC.md")
    print("Renamed VAAYU_CORE_SPEC.md to XPOSE_CORE_SPEC.md")
