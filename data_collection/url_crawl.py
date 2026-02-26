import asyncio
import os
import re
from crawl4ai import AsyncWebCrawler

def slugify(url):
    """Turns a URL into a safe filename."""
    name = url.replace("https://", "").replace("www.", "").replace("catalog.", "")
    name = re.sub(r'[^a-zA-Z0-9]', '_', name)
    return name[:100]  # Keep filename length reasonable

async def scrape_list(file_path, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    if not os.path.exists(file_path):
        print(f"Skipping {file_path}: File not found.")
        return

    with open(file_path, "r") as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"\n Starting {file_path} | {len(urls)} URLs")

    async with AsyncWebCrawler(verbose=False) as crawler:
        for i in range(0, len(urls), 5):
            batch = urls[i:i + 5]
            results = await crawler.arun_many(batch)

            for result in results:
                if result.success:
                    file_name = f"{slugify(result.url)}.md"
                    file_path_out = os.path.join(output_folder, file_name)

                    # Add the Source URL at the very top for the bot to see
                    final_content = f"--- SOURCE: {result.url} ---\n\n" + result.markdown
                    
                    with open(file_path_out, "w", encoding="utf-8") as f:
                        f.write(final_content)
                else:
                    pass

            print(f" Progress: {min(i + 5, len(urls))}/{len(urls)}")

async def main():
    # Define the three brains
    tasks = [
        scrape_list("final_catalog_for_scrape.txt", "tamusa_data/catalog"),
        scrape_list("final_main_site_for_scrape.txt", "tamusa_data/main_site"),
        scrape_list("course_scrape_list.txt", "tamusa_data/courses")
    ]
    
    for task in tasks:
        await task

if __name__ == "__main__":
    asyncio.run(main())