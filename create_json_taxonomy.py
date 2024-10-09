import pandas as pd 

df = pd.read_excel('fungal_keys.xlsx')

import requests
import json
import time


# Constants
API_URL_BASE = "https://api.inaturalist.org/v1/taxa"
TAXON_ID = 47170  # ID for Fungi in iNaturalist 48340
RATE_LIMIT_DELAY = 1  # Delay between API calls to avoid exceeding rate limits

# Helper function to fetch taxa from the iNaturalist API
def fetch_taxa(rank, parent_id):
    params = {
        'rank': rank,
        'ancestor_id': parent_id,
        'per_page': 200
    }

    API_URL = API_URL_BASE + f'?taxon_id={parent_id}&rank={rank}'

    response = requests.get(API_URL)

    if response.status_code == 200:
        return response.json()['results']
    else:
        print(f"Failed to fetch {rank}: {response.status_code}")
        return []


# Function to recursively fetch and build the taxonomic structure
def build_taxonomic_hierarchy(parent_id, rank):
    taxa = fetch_taxa(rank, parent_id)
    time.sleep(RATE_LIMIT_DELAY)  # Respect rate limits

    
    hierarchy = []
    
    for taxon in taxa:
        print(taxon['name'])
        taxon_df = df.loc[df['inat_taxon'] == taxon['name']]
        # if length of filtered df to taxon name is 0, make an empty taxon data
        if len(taxon_df) == 0: # this used to be taxon == 0, and keys had the fields but equal to null
            taxon_data = {
                "latinName": taxon['name'],
                "commonName": taxon['preferred_common_name'] if 'preferred_common_name' in taxon else None,
                "taxon_id": taxon['id'],
                "keys": []
            }
        else:

            key_list = []

            for _, row in taxon_df.iterrows():
                    key_list.append({
                        "title": row['title'],
                        "locale": row['locale'],
                        "authors": [author.strip() for author in row['authors'].split(';')],
                        "url": row['url']  # Use the corresponding URL
                    })

            taxon_data = {
                "latinName": taxon['name'],
                "commonName": taxon['preferred_common_name'] if 'preferred_common_name' in taxon else None,
                "taxon_id": taxon['id'],
                "keys": key_list
            }
                # if its not empty, for loop through the keys and fill out
        
        # Fetch lower ranks if applicable
        if rank == "phylum":
            taxon_data["class"] = build_taxonomic_hierarchy(taxon['id'], "class")
        elif rank == "class":
            taxon_data["order"] = build_taxonomic_hierarchy(taxon['id'], "order")
        elif rank == "order":
            taxon_data["family"] = build_taxonomic_hierarchy(taxon['id'], "family")
        elif rank == "family":
            taxon_data["genus"] = build_taxonomic_hierarchy(taxon['id'], "genus")
        
        hierarchy.append(taxon_data)
    
    return hierarchy



key_list = []
taxon_df = df.loc[df['inat_taxon'] == 'Fungi']

for _, row in taxon_df.iterrows():
        key_list.append({
            "title": row['title'],
            "locale": row['locale'],
            "authors": [author.strip() for author in row['authors'].split(';')],
            "url": row['url']  # Use the corresponding URL
        })


# Build the JSON structure for kingdom Fungi WORKING ORIGINAL #### THIS NEEDS TO BE FIXED ASAP
# You need to put a taxon ID, and then the next lowest taxon with it, so phylum for fungi
fungi_data = {
    "kingdom": {
        "latinName": taxon['name'],
        "commonName": taxon['preferred_common_name'] if 'preferred_common_name' in taxon else None,
        "taxon_id": taxon['id'],
        "keys": key_list
        "phylum": build_taxonomic_hierarchy(TAXON_ID, "phylum")
    }
}

# TAXON_ID = 118249# for testing only

# fungi_data = {
#     "kingdom": {
#         "latinName": "Fungi",
#         "commonName": "Fungi",
#         "keys": [
#             {
#                 "title": "Introduction to the Fungi Kingdom",
#                 "authors": ["John Doe", "Jane Smith"],  # Placeholder
#                 "url": "https://example.com/fungi-kingdom"
#             }
#         ],
#         "phylum": build_taxonomic_hierarchy(TAXON_ID, "genus")
#     }
# }


# Write the JSON data to a file
with open('fungi_taxonomyTESTING.json', 'w') as json_file:
    json.dump(fungi_data, json_file, indent=4)

print("Fungi taxonomy JSON file created successfully.")
