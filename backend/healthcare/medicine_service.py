import os
import requests


# =========================================================
# OPENFDA CONFIGURATION
# =========================================================

OPENFDA_URL = "https://api.fda.gov/drug/label.json"


# =========================================================
# HELPER FUNCTION
# =========================================================

def get_first(data, key):
    """
    Get the first value from an OpenFDA field.
    OpenFDA usually returns these fields as lists.
    """

    value = data.get(key, [])

    if isinstance(value, list) and value:
        return value[0]

    return ""


# =========================================================
# MEDICINE INFORMATION
# =========================================================

def get_medicine_info(medicine):

    if not medicine:
        return None

    medicine = str(medicine).strip()

    if not medicine:
        return None

    # Optional API key.
    # Development can work without it if the endpoint allows it.
    api_key = os.getenv("OPENFDA_API_KEY")

    # -----------------------------------------------------
    # Multiple search strategies
    # -----------------------------------------------------

    searches = [

        # Generic medicine name
        f'openfda.generic_name:"{medicine}"',

        # Brand name
        f'openfda.brand_name:"{medicine}"',

        # Active ingredient
        f'active_ingredient:"{medicine}"'
    ]

    # -----------------------------------------------------
    # Try each search
    # -----------------------------------------------------

    for search_query in searches:

        params = {
            "search": search_query,
            "limit": 1
        }

        # Add API key only if available
        if api_key:
            params["api_key"] = api_key

        try:

            print("=" * 60)
            print("MEDICINE SEARCH")
            print("Medicine:", medicine)
            print("Query:", search_query)
            print("=" * 60)

            response = requests.get(
                OPENFDA_URL,
                params=params,
                timeout=10
            )

            print("OpenFDA Status:", response.status_code)

            # -------------------------------------------------
            # No result for this search
            # -------------------------------------------------

            if response.status_code == 404:

                print("No result for:", search_query)

                continue

            # -------------------------------------------------
            # Raise HTTP errors
            # -------------------------------------------------

            response.raise_for_status()

            # -------------------------------------------------
            # Convert response to JSON
            # -------------------------------------------------

            data = response.json()

            results = data.get("results", [])

            # -------------------------------------------------
            # If no results, try next search
            # -------------------------------------------------

            if not results:

                print("No medicine found for:", search_query)

                continue

            # -------------------------------------------------
            # First medicine result
            # -------------------------------------------------

            drug = results[0]

            openfda = drug.get("openfda", {})

            # -------------------------------------------------
            # Create clean response
            # -------------------------------------------------

            medicine_info = {

                "name": (
                    get_first(
                        openfda,
                        "brand_name"
                    )
                    or medicine
                ),

                "generic_name": get_first(
                    openfda,
                    "generic_name"
                ),

                "manufacturer": get_first(
                    openfda,
                    "manufacturer_name"
                ),

                "purpose": get_first(
                    drug,
                    "purpose"
                ),

                "indications": get_first(
                    drug,
                    "indications_and_usage"
                ),

                "warnings": get_first(
                    drug,
                    "warnings"
                ),

                "adverse_reactions": get_first(
                    drug,
                    "adverse_reactions"
                ),

                "contraindications": get_first(
                    drug,
                    "contraindications"
                ),

                "dosage": get_first(
                    drug,
                    "dosage_and_administration"
                )
            }

            print("=" * 60)
            print("MEDICINE FOUND")
            print(medicine_info)
            print("=" * 60)

            return medicine_info

        except requests.RequestException as e:

            print("=" * 60)
            print("OPENFDA REQUEST ERROR")
            print(repr(e))
            print("=" * 60)

            # Try the next search strategy
            continue

        except ValueError as e:

            print("=" * 60)
            print("OPENFDA JSON ERROR")
            print(repr(e))
            print("=" * 60)

            continue

    # ---------------------------------------------------------
    # Nothing found
    # ---------------------------------------------------------

    print("=" * 60)
    print("MEDICINE NOT FOUND:", medicine)
    print("=" * 60)

    return None