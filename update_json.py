import pandas as pd
import json

# Load sheet
sheet_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQywAaJL-pZ0ioeHBVe8gpVO5UjrSBw2BA8fOIq-60OMOVESSRdH07u28EH-UotFGiSFbcqnosmH58G/pub?gid=0&single=true&output=csv"
df = pd.read_csv(sheet_url)
df.fillna('', inplace=True)

# Load existing JSON
with open('fungi_taxonomy.json', 'r') as f:
    taxonomy_data = json.load(f)

# Build key object from row
def build_key(row):
    return {
        "title": row['title'] or None,
        "locale": row['locale'] or None,
        "authors": [a.strip() for a in row['authors'].split(';')] if row['authors'] else None,
        "url": row['url'] or None,
        "language": row['language'] or None,
        "type": row['type'] or None,
        "country_code": row['country_code'] or None
    }

# Recursive search function
def find_and_update_taxon(node, target_name, key_data):
    if isinstance(node, dict):
        if node.get("latinName") == target_name:
            if "keys" not in node:
                node["keys"] = []
            node["keys"].append(key_data)
            return True  # Found and updated

        # Recursively search nested taxonomic levels
        for key in ['kingdom', 'phylum', 'class', 'order', 'family', 'genus']:
            if key in node and isinstance(node[key], list):
                for child in node[key]:
                    if find_and_update_taxon(child, target_name, key_data):
                        return True
    return False

# Update the tree with Google Sheet data
for _, row in df.iterrows():
    taxon_name = row['inat_taxon']
    key_data = build_key(row)
    print(key_data)
    found = find_and_update_taxon(taxonomy_data['life'], taxon_name, key_data)

    if not found:
        print(f"⚠️ Warning: Taxon '{taxon_name}' not found in JSON.")

# Save updated JSON
with open('fungi_taxonomy_updated.json', 'w') as f:
    json.dump(taxonomy_data, f, indent=4)

print("✅ JSON successfully updated with sheet data.")
