import os
import requests
from urllib.parse import quote


# ============================================================
# Wikipedia
# ============================================================

def search_wikipedia(topic, limit=3):
    """
    Search Wikipedia for the given lesson topic.
    """

    if not topic:
        return []

    try:
        url = "https://en.wikipedia.org/w/api.php"

        params = {
            "action": "query",
            "format": "json",
            "list": "search",
            "srsearch": topic,
            "srlimit": limit,
            "utf8": 1
        }

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        resources = []

        for item in data.get("query", {}).get("search", []):
            title = item.get("title", "")

            if not title:
                continue

            resources.append({
                "type": "wikipedia",
                "title": title,
                "description": clean_html(
                    item.get("snippet", "")
                ),
                "url": (
                    "https://en.wikipedia.org/wiki/"
                    + quote(title.replace(" ", "_"))
                )
            })

        return resources

    except Exception as e:
        print(f"WIKIPEDIA RESOURCE ERROR: {repr(e)}")
        return []


# ============================================================
# Google Books
# ============================================================

def search_google_books(topic, limit=3):
    """
    Search Google Books for the lesson topic.
    """

    if not topic:
        return []

    try:
        url = "https://www.googleapis.com/books/v1/volumes"

        params = {
            "q": topic,
            "maxResults": limit,
            "printType": "books"
        }

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        resources = []

        for item in data.get("items", []):
            info = item.get("volumeInfo", {})

            title = info.get("title")

            if not title:
                continue

            authors = info.get(
                "authors",
                []
            )

            resources.append({
                "type": "google_books",
                "title": title,
                "description": info.get(
                    "description",
                    "Related educational book."
                )[:300],
                "author": ", ".join(authors),
                "thumbnail": info.get(
                    "imageLinks",
                    {}
                ).get("thumbnail"),
                "url": info.get(
                    "infoLink",
                    f"https://books.google.com/books?q={quote(topic)}"
                )
            })

        return resources

    except Exception as e:
        print(f"GOOGLE BOOKS RESOURCE ERROR: {repr(e)}")
        return []


# ============================================================
# YouTube
# ============================================================

def search_youtube(topic, limit=3):
    """
    Search YouTube educational videos.
    Requires YOUTUBE_API_KEY in .env
    """

    api_key = os.getenv("YOUTUBE_API_KEY")

    if not api_key:
        print("YOUTUBE_API_KEY is not configured.")
        return []

    if not topic:
        return []

    try:
        url = "https://www.googleapis.com/youtube/v3/search"

        params = {
            "part": "snippet",
            "q": f"{topic} educational",
            "type": "video",
            "maxResults": limit,
            "order": "relevance",
            "safeSearch": "strict",
            "relevanceLanguage": "en",
            "regionCode": "IN",
            "key": api_key
        }

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        resources = []

        for item in data.get("items", []):
            video_id = item.get(
                "id",
                {}
            ).get("videoId")

            snippet = item.get(
                "snippet",
                {}
            )

            if not video_id:
                continue

            resources.append({
                "type": "youtube",
                "title": snippet.get(
                    "title",
                    "Educational Video"
                ),
                "description": snippet.get(
                    "description",
                    ""
                )[:300],
                "channel": snippet.get(
                    "channelTitle",
                    ""
                ),
                "thumbnail": snippet.get(
                    "thumbnails",
                    {}
                ).get(
                    "medium",
                    {}
                ).get("url"),
                "url": (
                    f"https://www.youtube.com/watch?v={video_id}"
                )
            })

        return resources

    except Exception as e:
        print(f"YOUTUBE RESOURCE ERROR: {repr(e)}")
        return []


# ============================================================
# Educational Websites
# ============================================================

def get_educational_sites(topic):
    """
    Return trusted educational resources
    related to the lesson topic.
    """

    if not topic:
        return []

    encoded_topic = quote(topic)

    return [
        {
            "type": "educational_site",
            "title": f"Khan Academy — {topic}",
            "description": (
                f"Educational lessons, explanations "
                f"and practice resources related to {topic}."
            ),
            "url": (
                f"https://www.khanacademy.org/search?page_search_query="
                f"{encoded_topic}"
            )
        },
        {
            "type": "educational_site",
            "title": f"Britannica — {topic}",
            "description": (
                f"Reference and educational information "
                f"related to {topic}."
            ),
            "url": (
                f"https://www.britannica.com/search?query="
                f"{encoded_topic}"
            )
        },
        {
            "type": "educational_site",
            "title": f"CK-12 — {topic}",
            "description": (
                f"Interactive educational material "
                f"and learning resources related to {topic}."
            ),
            "url": (
                f"https://www.ck12.org/search/?q="
                f"{encoded_topic}"
            )
        }
    ]


# ============================================================
# Combined Resources
# ============================================================

def get_lesson_resources(
    subject,
    topic,
    grade=""
):
    """
    Fetch all resources for a lesson.
    """

    if not topic:
        raise ValueError("Topic is required.")

    wikipedia = search_wikipedia(
        topic,
        limit=3
    )

    books = search_google_books(
        topic,
        limit=3
    )

    youtube = search_youtube(
        f"{subject} {topic} {grade}",
        limit=3
    )

    educational_sites = get_educational_sites(
        topic
    )

    return {
        "wikipedia": wikipedia,
        "google_books": books,
        "youtube": youtube,
        "educational_sites": educational_sites
    }


# ============================================================
# Utility
# ============================================================

def clean_html(text):
    """
    Remove simple HTML tags returned by Wikipedia.
    """

    if not text:
        return ""

    import re

    return re.sub(
        r"<[^>]+>",
        "",
        text
    )