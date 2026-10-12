import re

def detect_language(prompt):
    prompt = prompt.lower()

    
    if re.search(r'\breact native\b', prompt):
        return "React Native"
    
    if re.search(r'\bspring boot\b', prompt):
        return "Java Spring Boot"

    if (
        re.search(r'\bhtml\b', prompt)
        and re.search(r'\bcss\b', prompt)
        and re.search(
            r'\b(?:do not|don\'t|dont|without|no|never)\s+'
            r'(?:(?:generate|use|include|write)\s+)?'
            r'(?:any\s+)?javascript\b',
            prompt
        )
    ):
        return "HTML"

    # ----------------------------
    # Python
    # ----------------------------
    if re.search(r'\b(python|flask|django|fastapi|pandas|numpy)\b', prompt):
        return "Python"

    # ----------------------------
    # Java
    # ----------------------------
    elif re.search(r'\b(java|spring|maven|hibernate|jpa)\b', prompt):
        return "Java Spring Boot"

    # ----------------------------
    # React
    # ----------------------------
    elif re.search(r'\b(react|reactjs|react\.js|vite)\b', prompt):
        return "React"

    # ----------------------------
    # Next.js
    # ----------------------------
    elif re.search(r'\b(next|nextjs|next\.js)\b', prompt):
        return "Next.js"

    # ----------------------------
    # Angular / Vue
    # ----------------------------
    elif re.search(r'\bangular\b', prompt):
        return "Angular"

    elif re.search(r'\b(vue|vuejs|vue\.js)\b', prompt):
        return "Vue"

    # ----------------------------
    # Node.js / Express
    # ----------------------------
    elif re.search(r'\b(node|nodejs|node\.js)\b', prompt):
        return "Node.js"

    elif re.search(r'\bexpress\b', prompt):
        return "Express"

    # ----------------------------
    # TypeScript
    # ----------------------------
    elif re.search(r'\b(typescript|ts)\b', prompt):
        return "TypeScript"

    # ----------------------------
    # JavaScript
    # ----------------------------
    elif re.search(r'\b(javascript|js)\b', prompt):
        return "JavaScript"

    # ----------------------------
    # C / C++ / C#
    # ----------------------------
    elif "c++" in prompt or re.search(r'\bcpp\b', prompt):
        return "C++"

    elif "c#" in prompt or re.search(r'\b(csharp|\.net|dotnet)\b', prompt):
        return "C#"

    elif re.search(r'\bc\b', prompt) or "language c" in prompt:
        return "C"

    # ----------------------------
    # PHP / Go / Rust
    # ----------------------------
    elif re.search(r'\b(php|laravel)\b', prompt):
        return "PHP"

    elif re.search(r'\b(golang|go)\b', prompt) or "go language" in prompt:
        return "Go"

    elif re.search(r'\brust\b', prompt):
        return "Rust"

    # ----------------------------
    # Mobile (Kotlin / Swift / Flutter / Dart)
    # ----------------------------
    elif re.search(r'\bkotlin\b', prompt):
        return "Kotlin"

    elif re.search(r'\bswift\b', prompt):
        return "Swift"

    elif re.search(r'\bflutter\b', prompt):
        return "Flutter"

    elif re.search(r'\bdart\b', prompt):
        return "Dart"

    # ----------------------------
    # SQL / Web Fundamentals
    # ----------------------------
    elif re.search(r'\b(sql|mysql|postgres|postgresql|sqlite|database)\b', prompt):
        return "SQL"

    elif re.search(r'\bhtml\b', prompt):
        return "HTML"

    elif re.search(r'\bcss\b', prompt):
        return "CSS"

    elif re.search(r'\btailwind\b', prompt):
        return "Tailwind CSS"

    elif re.search(r'\bbootstrap\b', prompt):
        return "Bootstrap"

    # ----------------------------
    # Default
    # ----------------------------
    return "General Programming"