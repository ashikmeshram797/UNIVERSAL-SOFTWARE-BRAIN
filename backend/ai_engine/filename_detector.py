import re


def detect_filename(code: str, language: str) -> str:

    lang = str(language).lower().strip() if language else ""
    code_str = code or ""

    # ----------------------------
    # Java
    # ----------------------------
    if "java" in lang:

        # Search for 'public class ClassName'
        match = re.search(
            r'public\s+class\s+([A-Za-z0-9_]+)',
            code_str
        )

        if match:
            return f"{match.group(1)}.java"

        # Fallback to any 'class ClassName'
        match_any = re.search(
            r'class\s+([A-Za-z0-9_]+)',
            code_str
        )

        if match_any:
            return f"{match_any.group(1)}.java"

        return "Main.java"

    # ----------------------------
    # C#
    # ----------------------------
    elif "c#" in lang or "csharp" in lang:

        match = re.search(
            r'class\s+([A-Za-z0-9_]+)',
            code_str
        )

        if match:
            return f"{match.group(1)}.cs"

        return "Program.cs"

    # ----------------------------
    # Python
    # ----------------------------
    elif "python" in lang or "py" == lang:
        return "main.py"

    # ----------------------------
    # C++
    # ----------------------------
    elif "c++" in lang or "cpp" in lang:
        return "main.cpp"

    # ----------------------------
    # C
    # ----------------------------
    elif lang == "c":
        return "main.c"

    # ----------------------------
    # TypeScript
    # ----------------------------
    elif "typescript" in lang or "ts" == lang:
        if "react" in lang:
            return "App.tsx"
        return "index.ts"

    # ----------------------------
    # React / JavaScript
    # ----------------------------
    elif "react" in lang:
        return "App.jsx"

    elif "javascript" in lang or "js" in lang:
        return "index.js"

    # ----------------------------
    # Next.js
    # ----------------------------
    elif "next" in lang:
        return "page.jsx"

    # ----------------------------
    # Vue
    # ----------------------------
    elif "vue" in lang:
        return "App.vue"

    # ----------------------------
    # Angular
    # ----------------------------
    elif "angular" in lang:
        return "app.component.ts"

    # ----------------------------
    # Node / Express
    # ----------------------------
    elif "node" in lang or "express" in lang:
        return "server.js"

    # ----------------------------
    # PHP
    # ----------------------------
    elif "php" in lang:
        return "index.php"

    # ----------------------------
    # HTML
    # ----------------------------
    elif "html" in lang:
        return "index.html"

    # ----------------------------
    # CSS
    # ----------------------------
    elif "css" in lang:
        return "style.css"

    # ----------------------------
    # SQL
    # ----------------------------
    elif "sql" in lang:
        return "database.sql"

    # ----------------------------
    # Flutter / Dart
    # ----------------------------
    elif "flutter" in lang or "dart" in lang:
        return "main.dart"

    # ----------------------------
    # Kotlin
    # ----------------------------
    elif "kotlin" in lang or "kt" in lang:
        return "Main.kt"

    # ----------------------------
    # Swift
    # ----------------------------
    elif "swift" in lang:
        return "main.swift"

    # ----------------------------
    # Go
    # ----------------------------
    elif "go" in lang or "golang" in lang:
        return "main.go"

    # ----------------------------
    # Rust
    # ----------------------------
    elif "rust" in lang:
        return "main.rs"

    return "main.txt"