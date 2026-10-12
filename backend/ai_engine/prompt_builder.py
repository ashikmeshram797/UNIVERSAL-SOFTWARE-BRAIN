import re

from ai_engine.language_detector import detect_language


def build_prompt(user_prompt: str) -> str:

    if not user_prompt:
        return ""

    # ============================================================
    # LANGUAGE DETECTION
    # ============================================================

    language = detect_language(user_prompt) or "General"
    prompt_lower = user_prompt.lower()

    # ============================================================
    # PROJECT DETECTION
    # ============================================================

    project_keywords = [
        r"\bproject\b",
        r"\bapplication\b",
        r"\bapp\b",
        r"\bwebsite\b",
        r"\bweb\s*app\b",
        r"\bportal\b",
        r"\bdashboard\b",
        r"\bcrud\b",
        r"\bapi\b",
        r"\bbackend\b",
        r"\bfrontend\b",
        r"\bfull[\s-]*stack\b",
        r"\bmern\b",
        r"\bmanagement\s*system\b",
        r"\berp\b",
        r"\bcms\b",
        r"\becommerce\b",
        r"\be-commerce\b",
        r"\bchat\s*app\b",
        r"\bclone\b",
        r"\bauthentication\b",
        r"\blogin\b",
        r"\bsignup\b",
        r"\bsign\s*up\b",
        r"\bspring\b",
        r"\bspring\s*boot\b",
        r"\breact\b",
        r"\breactjs\b",
        r"\bangular\b",
        r"\bvue\b",
        r"\bdjango\b",
        r"\bflask\b",
        r"\blaravel\b",
        r"\bexpress\b",
        r"\bnode\b",
        r"\bnext\b",
        r"\bflutter\b",
        r"\breact\s*native\b"
    ]

    continue_keywords = [
        "continue",
        "resume",
        "continue this file",
        "complete remaining",
        "where you stopped",
        "continue from where you stopped"
    ]

    is_project = any(
        re.search(pattern, prompt_lower)
        for pattern in project_keywords
    )

    is_continue = any(
        word in prompt_lower
        for word in continue_keywords
    )

    # ============================================================
    # LANGUAGE / FRAMEWORK RULES
    # ============================================================

    rules_map = {

        # ========================================================
        # PYTHON
        # ========================================================

        "Python": """
- Use Python 3.
- Follow PEP8.
- Use clear functions and readable variable names.
- Keep modules separated logically.
- Include requirements.txt for projects.
- Use a proper entry point such as main.py when appropriate.
- Do not create unnecessary files.
""",

        # ========================================================
        # FLASK
        # ========================================================

        "Flask": """
- Use Python 3 and Flask.
- Create a proper Flask application structure.
- Include requirements.txt.
- Use app.py or an appropriate application entry point.
- Separate routes, services and database logic when required.
- Use environment variables for secrets and configuration.
- Never hardcode passwords, API keys or database credentials.
""",

        # ========================================================
        # DJANGO
        # ========================================================

        "Django": """
- Use Python 3 and Django.
- Generate a complete Django project.
- Include manage.py.
- Include settings, urls and required application files.
- Use Django models, views and URLs properly.
- Include requirements.txt.
- Use templates/static directories when required.
- Do not hardcode secrets.
""",

        # ========================================================
        # FASTAPI
        # ========================================================

        "FastAPI": """
- Use Python 3 and FastAPI.
- Create a runnable FastAPI application.
- Use app/main.py or main.py as appropriate.
- Include requirements.txt.
- Use Pydantic models for request/response validation.
- Separate routers when the project requires multiple endpoints.
""",

        # ========================================================
        # JAVA
        # ========================================================

        "Java": """
- Use Java 8 or higher.
- Follow OOP principles.
- Use clean package structure.
- Include all required imports.
- Use meaningful class and method names.
- For simple programs generate the minimum required files.
""",

        # ========================================================
        # SPRING BOOT
        # ========================================================

        "Java Spring Boot": """
- Use Java 17 or higher unless the user specifies another version.
- Use Spring Boot.
- Use Maven.
- Generate a complete runnable Spring Boot project.
- Include pom.xml.
- Include the main @SpringBootApplication class.
- Use standard package structure.
- Use Controller, Service, Repository and Entity layers when required.
- Use DTOs when useful.
- Use @RestController for REST APIs.
- Use application.properties or application.yml for configuration.
- If PostgreSQL/MySQL is requested, include the appropriate database dependency and configuration structure.
- Never hardcode database passwords.
- Include exception handling when required.
- The project must be runnable using Maven.
""",

        # ========================================================
        # JAVASCRIPT
        # ========================================================

        "JavaScript": """
- Use modern JavaScript ES6+.
- Use modular and readable code.
- Use meaningful variable and function names.
- Avoid unnecessary dependencies.
- For Node projects include package.json.
""",

        # ========================================================
        # TYPESCRIPT
        # ========================================================

        "TypeScript": """
- Use modern TypeScript.
- Use strict typing where appropriate.
- Avoid unnecessary any types.
- Use interfaces/types for structured data.
- Use modular architecture.
- Include package.json and tsconfig.json when required.
""",

        # ========================================================
        # REACT
        # ========================================================

        "React": """
- Use React with Vite.
- Generate a complete runnable React project.
- Use functional components.
- Use React Hooks where required.
- Use reusable components.
- Use src/main.jsx or src/main.tsx as the entry point.
- Use src/App.jsx or src/App.tsx.
- Put reusable components inside src/components/.
- Include package.json.
- Include index.html.
- Include required configuration files.
- The project must be runnable using:
  npm install
  npm run dev
- Do not create README.md.
- Do not create documentation.
""",

        # ========================================================
        # REACT NATIVE
        # ========================================================

        "React Native": """
- Use React Native.
- Use functional components and Hooks.
- Use reusable components.
- Include package.json.
- Include the appropriate React Native entry files.
- Keep the project structure clean.
- Do not create README.md unless explicitly requested.
""",

        # ========================================================
        # NEXT.JS
        # ========================================================

        "Next.js": """
- Use Next.js.
- Prefer App Router.
- Use React Server Components where appropriate.
- Include package.json.
- Include required Next.js configuration.
- Use app/ directory when appropriate.
- Include layout and page files when required.
- The project must be runnable with npm install and npm run dev.
- Do not create README.md.
""",

        # ========================================================
        # ANGULAR
        # ========================================================

        "Angular": """
- Use Angular.
- Use components, services and routing where required.
- Include package.json.
- Include angular.json.
- Include tsconfig configuration.
- Generate a complete runnable Angular project.
- Use TypeScript.
- Use modular component architecture.
- The project must be runnable using npm install and ng serve.
""",

        # ========================================================
        # VUE
        # ========================================================

        "Vue": """
- Use Vue 3.
- Prefer Composition API.
- Use Single File Components.
- Include package.json.
- Include index.html.
- Include src/main.js or src/main.ts.
- Include src/App.vue.
- Use reusable components when required.
- The project must run using npm install and npm run dev.
""",

        # ========================================================
        # NODE.JS
        # ========================================================

        "Node.js": """
- Use Node.js.
- Use modern JavaScript.
- Include package.json.
- Use a clear server entry point such as server.js or app.js.
- Use Express when HTTP API functionality is required.
- Separate routes, controllers and services when appropriate.
- Use environment variables for secrets.
""",

        # ========================================================
        # EXPRESS
        # ========================================================

        "Express": """
- Use Node.js with Express.
- Include package.json.
- Create a runnable Express server.
- Use routes and middleware.
- Separate controllers/services when useful.
- Include an appropriate entry file.
- Use environment variables for configuration.
""",

        # ========================================================
        # C
        # ========================================================

        "C": """
- Use standard C.
- Follow ANSI C conventions.
- Include required headers.
- Keep functions simple and readable.
- Use proper memory management.
- For projects include appropriate source and header files.
""",

        # ========================================================
        # C++
        # ========================================================

        "C++": """
- Use C++17 or newer.
- Use STL where appropriate.
- Follow modern C++ practices.
- Separate headers and implementation files when required.
- Include a clear main entry point.
""",

        # ========================================================
        # C#
        # ========================================================

        "C#": """
- Use modern C#.
- Follow .NET conventions.
- Use OOP principles.
- Include the appropriate .csproj file for projects.
- Use Program.cs as the entry point where appropriate.
- Keep classes modular and readable.
""",

        # ========================================================
        # PHP
        # ========================================================

        "PHP": """
- Use modern PHP.
- Follow PSR-style conventions.
- Use secure coding practices.
- Use prepared statements for database queries.
- Include composer.json when dependencies are required.
- Keep application structure modular.
""",

        # ========================================================
        # LARAVEL
        # ========================================================

        "Laravel": """
- Use Laravel.
- Follow MVC architecture.
- Use routes, controllers, models and migrations.
- Include composer.json.
- Use .env configuration.
- Never hardcode credentials.
- Generate the required Laravel project structure.
""",

        # ========================================================
        # SQL
        # ========================================================

        "SQL": """
- Use standard SQL unless a database engine is specified.
- Use proper constraints.
- Use primary keys and foreign keys where required.
- Use readable and optimized queries.
- Avoid unnecessary duplicate queries.
""",

        # ========================================================
        # HTML
        # ========================================================

        "HTML": """
- Use HTML5.
- Use semantic HTML elements.
- Include a complete <!DOCTYPE html> document when generating a page.
- Use accessible labels and form elements.
- Link CSS and JavaScript files correctly when those files are requested.
- Generate JavaScript only when the user explicitly requests JavaScript or behavior that requires it.
- Never display, log, or expose passwords or other credentials.
- Do not claim a login form authenticates users unless an authentication backend is requested and implemented.
- For requested HTML/CSS/JavaScript projects, generate separate files.
- Do not create README.md.
""",

        # ========================================================
        # CSS
        # ========================================================

        "CSS": """
- Use modern CSS.
- Use responsive layouts.
- Prefer Flexbox and Grid where appropriate.
- Keep selectors readable.
- Avoid unnecessary inline styles.
""",

        # ========================================================
        # TAILWIND CSS
        # ========================================================

        "Tailwind CSS": """
- Use Tailwind CSS.
- Use responsive utility classes.
- Keep components reusable.
- Include the required Tailwind configuration for a project.
- Include package.json when required.
""",

        # ========================================================
        # BOOTSTRAP
        # ========================================================

        "Bootstrap": """
- Use Bootstrap 5.
- Use responsive Bootstrap components.
- Use semantic HTML.
- Avoid unnecessary custom CSS.
""",

        # ========================================================
        # FLUTTER
        # ========================================================

        "Flutter": """
- Use Flutter and Dart.
- Use Material Design where appropriate.
- Use StatefulWidget and StatelessWidget correctly.
- Use reusable widgets.
- Include pubspec.yaml.
- Include lib/main.dart.
- Use clean widget structure.
- The project must be runnable using flutter pub get and flutter run.
""",

        # ========================================================
        # DART
        # ========================================================

        "Dart": """
- Use modern Dart.
- Enable null safety.
- Use clear classes and functions.
- Keep code modular.
- Include pubspec.yaml when creating a project.
""",

        # ========================================================
        # KOTLIN
        # ========================================================

        "Kotlin": """
- Use modern Kotlin.
- Follow Kotlin coding conventions.
- Use null safety.
- Use clean architecture where appropriate.
- For Android projects include Gradle configuration and required Android files.
""",

        # ========================================================
        # SWIFT
        # ========================================================

        "Swift": """
- Use modern Swift.
- Follow Swift conventions.
- Prefer SwiftUI when building UI applications.
- Use reusable Views.
- Keep code modular.
""",

        # ========================================================
        # GO
        # ========================================================

        "Go": """
- Use modern Go.
- Follow standard Go formatting.
- Use packages properly.
- Include go.mod for projects.
- Use a clear main package and main function.
- Keep packages modular.
""",

        # ========================================================
        # RUST
        # ========================================================

        "Rust": """
- Use modern stable Rust.
- Follow Rust ownership and borrowing rules.
- Use safe Rust.
- Include Cargo.toml for projects.
- Use src/main.rs for binary applications.
- Keep modules organized.
"""
    }

    # ============================================================
    # FIND LANGUAGE RULES
    # ============================================================

    rules_key = language

    if language == "Python":
        framework_patterns = {
            "Flask": r"\bflask\b",
            "Django": r"\bdjango\b",
            "FastAPI": r"\bfastapi\b",
        }

        for framework, pattern in framework_patterns.items():
            if re.search(pattern, prompt_lower):
                rules_key = framework
                break

    extra_rules = rules_map.get(rules_key, "")

    # ============================================================
    # SPECIAL HTML/CSS/JS PROJECT RULE
    # ============================================================

    if language == "HTML" and is_project:

        extra_rules += """
- For HTML/CSS requests, create index.html and styles.css.
- Create script.js only when the user explicitly requests JavaScript or interactive behavior.
- Link styles.css from index.html.
- Link script.js from index.html only when script.js is generated.
- Never display, log, or expose passwords or other credentials.
- Do not claim frontend-only login forms perform real authentication.
"""

    # ============================================================
    # PROJECT PROMPT
    # ============================================================

    if is_project:

        prompt_type = """
Generate a COMPLETE runnable project.

Return ALL required source and configuration files.

Use EXACTLY this format:

FILE: filename.ext
<complete file content>

FILE: another_file.ext
<complete file content>

Rules:

- Every file MUST start with FILE: filename.
- Generate complete file contents.
- Do not skip required configuration files.
- Do not generate placeholder files.
- Do not generate empty files.
- Do not explain anything.
- Do not repeat the user request.
- Do not generate another task.
- Do not generate examples after the project.
- Do not generate markdown code fences.
- Do not generate <think> tags.
- Do not generate README.md.
- Do not generate LICENSE.
- Do not generate CONTRIBUTING.md.
- Do not generate documentation unless explicitly requested.
- Do not generate unrelated files.
- Stop immediately after the final required file.
"""

    else:

        prompt_type = """
Generate ONLY ONE source file.

Rules:

- Return ONLY executable source code.
- Generate exactly ONE program/file.
- Do not generate another program.
- Do not generate another task.
- Do not repeat the user request.
- Do not explain anything.
- Do not generate documentation.
- Do not generate README.md.
- Do not generate markdown code fences.
- Do not generate <think> tags.
- Do not print labels such as Code:, Response:, Answer: or Explanation:.
- Start directly with source code.
- Stop immediately when the source file is complete.
"""

    # ============================================================
    # CONTINUATION
    # ============================================================

    if is_continue:

        prompt_type += """
CONTINUATION RULES:

- Continue ONLY the existing code.
- Do NOT restart the file.
- Do NOT generate a new project.
- Do NOT repeat previously generated code.
- Continue exactly from where the previous output stopped.
"""

    # ============================================================
    # FINAL PROMPT
    # ============================================================

    prompt = f"""
You are an expert Software Engineer and Code Generation Agent.

Target Programming Language/Framework:
{language}

STRICT GLOBAL RULES:

- Generate ONLY source code and required project configuration files.
- No explanation.
- No conversational text.
- No markdown code fences.
- Never output <think>...</think>.
- Never output README.md unless explicitly requested.
- Never output unrelated documentation.
- Never repeat the user's request.
- Start directly with the requested code/project files.

PROJECT / FILE FORMAT:

{prompt_type}

LANGUAGE / FRAMEWORK GUIDELINES:

{extra_rules}

USER TASK:

{user_prompt}
"""

    return prompt.strip()