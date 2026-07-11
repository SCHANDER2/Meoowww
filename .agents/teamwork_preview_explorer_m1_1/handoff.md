# Handoff Report: Milestone 1 - Fetch & Update HTML

## Observation
- `index.html` (lines 177-263) contains a `<div class="project-showcase">` block.
- Inside this block, there are `<article class="project-card ...">` tags representing placeholder projects.
- The `project-card`s have alternating classes (`project-card--reversed` on even indices), incrementing `data-delay` values (0, 0.1, 0.2, 0.3), and cycling background gradients.
- Since we are in `CODE_ONLY` mode, direct inspection of the live GitHub page wasn't possible. However, the standard `https://github.com/USERNAME?tab=repositories` layout utilizes `itemprop="owns"` for each repository list item, `itemprop="name codeRepository"` for the repo link, and `itemprop="description"` for the description. Topics use the `topic-tag` class.

## Logic Chain
1. To fetch the data without external JS frameworks, a Python script utilizing `urllib` and `BeautifulSoup` is ideal.
2. The script needs to fetch the raw HTML from `https://github.com/SCHANDER2?tab=repositories`.
3. It must iterate over `li[itemprop="owns"]` to extract the repo name, link, description, and tags (topics or programming language).
4. Using the extracted data, the script should dynamically generate HTML blocks that exactly mirror the structure, classes, and alternating styles (gradients, `project-card--reversed`) of the existing `.project-card` templates.
5. To inject this back into `index.html`, we can use a non-greedy regex replacing everything between `<div class="project-showcase">` and its matching closing `</div>` structure, which ends exactly before `<!-- 6. ABOUT SECTION -->`.

## Caveats
- The script relies on GitHub's current HTML structure (`itemprop="owns"`, etc.). If GitHub changes its layout, the scraping logic may need adjustments.
- The script uses `BeautifulSoup` which requires the `beautifulsoup4` pip package to be installed on the implementer's or user's environment.
- The script is hardcoded to extract up to 3 tags to maintain the visual consistency of the original UI.

## Conclusion
We will fulfill this milestone by running a standalone Python script that performs the fetch, parse, HTML generation, and file replacement automatically. The Implementer agent should create and execute this script. 

### Execution Plan
1. Create a Python script (`update_repos.py`) with the logic provided below in the project root `c:\Users\G4\OneDrive\Desktop\MEOOWWW\`.
2. Ensure `beautifulsoup4` is installed (`pip install beautifulsoup4`).
3. Run the script.
4. Verify `index.html` has been successfully updated with the user's repositories.

### Script Logic

```python
import urllib.request
from bs4 import BeautifulSoup
import re
import os

def fetch_repos():
    url = "https://github.com/SCHANDER2?tab=repositories"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    repos = []
    for li in soup.find_all('li', itemprop='owns'):
        a_tag = li.find('a', itemprop='name codeRepository')
        if not a_tag:
            continue
        
        name = a_tag.text.strip()
        link = "https://github.com" + a_tag['href']
        
        p_desc = li.find('p', itemprop='description')
        desc = p_desc.text.strip() if p_desc else "No description provided."
        
        tags = [a.text.strip() for a in li.find_all('a', class_=re.compile(r'topic-tag'))]
        if not tags:
            lang_span = li.find('span', itemprop='programmingLanguage')
            if lang_span:
                tags.append(lang_span.text.strip())
        if not tags:
            tags = ["GitHub"]
            
        repos.append({
            'name': name,
            'link': link,
            'desc': desc,
            'tags': tags[:3]  # Max 3 tags for UI consistency
        })
    return repos

def generate_html(repos):
    gradients = [
        "linear-gradient(135deg, #667eea, #764ba2)",
        "linear-gradient(135deg, #f093fb, #f5576c)",
        "linear-gradient(135deg, #4facfe, #00f2fe)",
        "linear-gradient(135deg, #30cfd0, #330867)"
    ]
    
    html_parts = []
    for i, repo in enumerate(repos):
        index_str = f"{i+1:02d}"
        gradient = gradients[i % len(gradients)]
        delay_str = "0" if i == 0 else f"{i * 0.1:.1f}"
        reversed_class = " project-card--reversed" if i % 2 == 1 else ""
        
        tags_html = "\n                ".join(f'<span class="tag">{{tag}}</span>' for tag in repo['tags'])
        
        card = f"""
          <!-- Project {i+1} — {repo['name']} -->
          <article class="project-card{reversed_class} reveal" data-delay="{delay_str}">
            <div class="project-visual" style="background: {gradient};">
              <span class="project-index">{index_str}</span>
            </div>
            <div class="project-content">
              <div class="project-tags">
                {tags_html}
              </div>
              <h3 class="project-title">{repo['name']}</h3>
              <p class="project-role">GitHub Repository</p>
              <p class="project-desc">{repo['desc']}</p>
              <a href="{repo['link']}" class="project-link" aria-label="View {repo['name']} repository" target="_blank" rel="noopener noreferrer">
                <span>View Repository</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </article>"""
        html_parts.append(card)
    return "\n".join(html_parts)

def update_index_html(generated_html):
    path = r"c:\Users\G4\OneDrive\Desktop\MEOOWWW\index.html"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace the contents of .project-showcase up to the closing section tags
    pattern = re.compile(r'(<div class="project-showcase">).*?(        </div>\s*</div>\s*</section>)', re.DOTALL)
    new_content = pattern.sub(r'\1\n' + generated_html + r'\n\2', content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated index.html with GitHub repositories.")

if __name__ == "__main__":
    print("Fetching repositories...")
    repos = fetch_repos()
    print(f"Found {len(repos)} repositories.")
    html = generate_html(repos)
    update_index_html(html)
```

## Verification Method
1. Run `python update_repos.py` in the workspace root.
2. Inspect `c:\Users\G4\OneDrive\Desktop\MEOOWWW\index.html` to confirm `.project-showcase` contains the newly fetched `.project-card` articles instead of the placeholders.
3. Open `index.html` in a web browser to ensure the CSS styling and layouts are fully intact and functionally correct.
