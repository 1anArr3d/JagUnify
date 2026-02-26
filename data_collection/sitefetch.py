import requests
import xml.etree.ElementTree as ET

sitemap_url = "https://www.tamusa.edu/sitemap.xml"

try:
    response = requests.get(sitemap_url)
    root = ET.fromstring(response.content)
    
    # Extract all <loc> tags (these are the URLs)
    urls = [loc.text for loc in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    
    print(f"Total pages found in sitemap: {len(urls)}")
    
    # Save them to a text file to look through
    with open("tamusa_main_urls.txt", "w") as f:
        for url in urls:
            f.write(url + "\n")
            
    print("All URLs saved to tamusa_main_urls.txt")
except Exception as e:
    print(f"Could not find XML sitemap: {e}")