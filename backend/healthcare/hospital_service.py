import requests
from math import radians, sin, cos, sqrt, atan2


# =========================================================
# OVERPASS SERVERS
# =========================================================

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

USER_AGENT = (
    "UniversalSoftwareBrain/1.0 "
    "(healthcare hospital finder)"
)


# =========================================================
# DISTANCE CALCULATION
# =========================================================

def calculate_distance(lat1, lon1, lat2, lon2):

    earth_radius = 6371.0

    lat1 = radians(float(lat1))
    lon1 = radians(float(lon1))

    lat2 = radians(float(lat2))
    lon2 = radians(float(lon2))

    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1

    a = (
        sin(delta_lat / 2) ** 2
        +
        cos(lat1)
        * cos(lat2)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return earth_radius * c


# =========================================================
# HOSPITAL FILTER
# =========================================================

def is_hospital(tags, name):

    name_lower = name.lower().strip()

    excluded_keywords = [
        "optical",
        "opticals",
        "optics",
        "doctor",
        "dr.",
        "dr ",
        "clinic",
        "pharmacy",
        "chemist",
        "laboratory",
        "diagnostic centre",
        "diagnostic center",
        "pathology"
    ]

    for keyword in excluded_keywords:
        if keyword in name_lower:
            return False

    # Explicit OSM hospital tags

    if tags.get("amenity") == "hospital":
        return True

    if tags.get("healthcare") == "hospital":
        return True

    # Hospital related names

    hospital_keywords = [
        "hospital",
        "medical college",
        "medical centre",
        "medical center",
        "nursing home",
        "maternity home",
        "critical care",
        "multispeciality",
        "multi speciality",
        "research institute",
        "health centre",
        "health center"
    ]

    for keyword in hospital_keywords:

        if keyword in name_lower:
            return True

    return False


# =========================================================
# NORMALIZE NAME
# =========================================================

def normalize_name(name):

    return (
        name.lower()
        .replace("&", "and")
        .replace("-", " ")
        .replace(",", " ")
        .replace(".", " ")
        .strip()
    )


# =========================================================
# BUILD QUERY
# =========================================================

def build_hospital_query(latitude, longitude, radius):

    return f"""
    [out:json][timeout:15];

    (
        nwr["amenity"="hospital"]
        (around:{radius},{latitude},{longitude});

        nwr["healthcare"="hospital"]
        (around:{radius},{latitude},{longitude});
    );

    out center tags;
    """


# =========================================================
# REQUEST OVERPASS
# =========================================================

def request_overpass(latitude, longitude, radius):

    query = build_hospital_query(
        latitude,
        longitude,
        radius
    )

    headers = {
        "User-Agent": USER_AGENT
    }

    last_error = None

    for overpass_url in OVERPASS_URLS:

        try:

            print("=" * 60)
            print("TRYING OVERPASS SERVER:")
            print(overpass_url)
            print("RADIUS:", radius)
            print("=" * 60)

            response = requests.post(
                overpass_url,
                data=query,
                headers=headers,
                timeout=25
            )

            response.raise_for_status()

            data = response.json()

            print("=" * 60)
            print("OVERPASS SUCCESS")
            print(overpass_url)
            print("=" * 60)

            return data

        except requests.RequestException as e:

            last_error = e

            print("=" * 60)
            print("OVERPASS ERROR")
            print(overpass_url)
            print(repr(e))
            print("=" * 60)

    raise RuntimeError(
        f"All Overpass servers failed: {last_error}"
    )


# =========================================================
# SEARCH HOSPITALS
# =========================================================

def search_hospitals(
    latitude,
    longitude,
    radius=5000
):

    latitude = float(latitude)
    longitude = float(longitude)

    # -----------------------------------------------------
    # Radius strategy
    # -----------------------------------------------------

    # First requested radius
    # If no results, automatically expand.

    search_radii = []

    if radius <= 5000:

        search_radii = [
            radius,
            10000,
            20000
        ]

    elif radius <= 10000:

        search_radii = [
            radius,
            20000
        ]

    else:

        search_radii = [
            radius
        ]

    last_error = None

    data = None
    successful_radius = radius

    # -----------------------------------------------------
    # Try different radius values
    # -----------------------------------------------------

    for current_radius in search_radii:

        try:

            print("=" * 60)
            print("HOSPITAL SEARCH RADIUS")
            print(current_radius, "meters")
            print("=" * 60)

            data = request_overpass(
                latitude,
                longitude,
                current_radius
            )

            successful_radius = current_radius

            if data.get("elements"):

                break

        except Exception as e:

            last_error = e

            print(
                "SEARCH RADIUS FAILED:",
                current_radius,
                repr(e)
            )

    # -----------------------------------------------------
    # All requests failed
    # -----------------------------------------------------

    if data is None:

        raise RuntimeError(
            f"Hospital search failed: {last_error}"
        )

    # -----------------------------------------------------
    # Process hospitals
    # -----------------------------------------------------

    hospitals = []

    seen_names = set()

    for element in data.get("elements", []):

        tags = element.get("tags", {})

        name = tags.get("name", "").strip()

        if not name:
            continue

        # -------------------------------------------------
        # Hospital filter
        # -------------------------------------------------

        if not is_hospital(tags, name):
            continue

        # -------------------------------------------------
        # Duplicate detection
        # -------------------------------------------------

        normalized_name = normalize_name(name)

        if normalized_name in seen_names:
            continue

        seen_names.add(normalized_name)

        # -------------------------------------------------
        # Coordinates
        # -------------------------------------------------

        if element["type"] == "node":

            hospital_lat = element.get("lat")
            hospital_lon = element.get("lon")

        else:

            center = element.get("center", {})

            hospital_lat = center.get("lat")
            hospital_lon = center.get("lon")

        if hospital_lat is None or hospital_lon is None:
            continue

        # -------------------------------------------------
        # Distance
        # -------------------------------------------------

        distance = calculate_distance(
            latitude,
            longitude,
            hospital_lat,
            hospital_lon
        )

        # -------------------------------------------------
        # Hospital object
        # -------------------------------------------------

        hospital = {

            "id": element.get("id"),

            "name": name,

            "latitude": hospital_lat,

            "longitude": hospital_lon,

            "distance_km": round(
                distance,
                2
            ),

            "address": (
                tags.get("addr:full")
                or tags.get("addr:street")
                or ""
            ),

            "phone": (
                tags.get("phone")
                or tags.get("contact:phone")
                or ""
            ),

            "website": (
                tags.get("website")
                or tags.get("contact:website")
                or ""
            ),

            "emergency": (
                tags.get("emergency")
                or ""
            ),

            "operator": (
                tags.get("operator")
                or ""
            )
        }

        hospitals.append(hospital)

    # -----------------------------------------------------
    # Sort nearest first
    # -----------------------------------------------------

    hospitals.sort(
        key=lambda x: x["distance_km"]
    )

    # -----------------------------------------------------
    # Return nearest 20
    # -----------------------------------------------------

    hospitals = hospitals[:20]

    print("=" * 60)
    print("HOSPITAL SEARCH COMPLETED")
    print("SEARCH RADIUS:", successful_radius)
    print("HOSPITAL COUNT:", len(hospitals))
    print("=" * 60)

    return hospitals