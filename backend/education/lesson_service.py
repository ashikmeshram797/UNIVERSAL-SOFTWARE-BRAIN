import time

from .ai_service import client, MODELS


def generate_lesson_plan(
    subject,
    topic,
    grade,
    duration,
    objectives
):
    if not subject:
        raise ValueError("Subject is required.")

    if not topic:
        raise ValueError("Topic is required.")

    if not grade:
        raise ValueError("Grade is required.")

    if not duration:
        raise ValueError("Duration is required.")

    if not objectives:
        raise ValueError("Learning objectives are required.")

    prompt = f"""
You are an expert AI lesson planner.

Create a structured lesson plan using ONLY the information
provided in the student's request.

LESSON DETAILS:

Subject:
{subject}

Topic:
{topic}

Grade / Class:
{grade}

Duration:
{duration}

Learning Objectives:
{objectives}

Create a clear, practical and student-friendly lesson plan.

IMPORTANT OUTPUT FORMAT:

Return ONLY the lesson plan.

Use EXACTLY these five section headings:

## Learning Objectives

## Introduction

## Main Content

## Practice & Activity

## Conclusion

For every section:
- Use concise bullet points.
- Start every bullet point with "- ".
- Do not create additional sections.
- Keep the content appropriate for the given grade.
- Respect the requested duration.
- Do not add unrelated topics.

MATHEMATICAL FORMULA RULES:

If the topic contains mathematics, ALWAYS use LaTeX
notation for mathematical formulas.

For inline formulas use:

$ax^2 + bx + c = 0$

For important formulas that should appear separately use:

$$
x = \\frac{{-b \\pm \\sqrt{{b^2 - 4ac}}}}{{2a}}
$$

Examples:

- Standard form: $ax^2 + bx + c = 0$

- Discriminant: $D = b^2 - 4ac$

- Quadratic formula:
$$
x = \\frac{{-b \\pm \\sqrt{{b^2 - 4ac}}}}{{2a}}
$$

Do NOT write mathematical formulas inside code blocks.

Do NOT use plain text such as:
x = (-b ± √(b² - 4ac)) / 2a

Instead use proper LaTeX notation.

SECTION REQUIREMENTS:

Learning Objectives:
- List the important learning outcomes.
- Keep them measurable and suitable for the grade.

Introduction:
- Include a short introduction activity.
- Connect the topic with a simple real-life example where appropriate.
- Include approximate teaching time.

Main Content:
- Explain the important concepts step by step.
- Include correct mathematical formulas where applicable.
- Include examples where appropriate.
- Include approximate teaching time.

Practice & Activity:
- Include classroom activities.
- Include practice questions or tasks where useful.
- Include approximate teaching time.

Conclusion:
- Include recap points.
- Include a short assessment or exit activity.
- Include approximate teaching time.

Make the lesson plan practical for classroom teaching.

Do not include:
- "Here is your lesson plan"
- "Sure"
- "Certainly"
- Any introductory or closing message outside the lesson plan.

LESSON PLAN:
"""

    last_error = None

    for model_name in MODELS:

        for attempt in range(3):

            try:

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )

                result = getattr(response, "text", None)

                if result and result.strip():
                    return result.strip()

                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            except Exception as e:

                last_error = e

                print(
                    f"LESSON PLANNER ERROR | "
                    f"model={model_name} | "
                    f"attempt={attempt + 1} | "
                    f"error={repr(e)}"
                )

                if attempt < 2:
                    time.sleep(2)

    raise RuntimeError(
        f"Failed to generate lesson plan: {repr(last_error)}"
    )