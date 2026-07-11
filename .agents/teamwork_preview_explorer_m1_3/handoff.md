# Handoff Report: Milestone 1 - Fetch & Update HTML

## 1. Observation
- `index.html` resides at `c:\Users\G4\OneDrive\Desktop\MEOOWWW\index.html`.
- The target HTML container is `<div class="project-showcase">` (lines 178-263).
- Each project in `index.html` is represented by an `<article class="project-card reveal" data-delay="...">` element.
- The `project-card` styling requires specific classes (e.g., `.project-card--reversed` for every even item) and cycling gradient backgrounds (e.g., `linear-gradient(135deg, #667eea, #764ba2)`).
- GitHub API is not viable due to rate-limiting and unauthenticated CLI, so web scraping of `https://github.com/SCHANDER2?tab=repositories` is required as per `ORIGINAL_REQUEST.md`.

## 2. Logic Chain
- To accurately retrieve the user's public repositories without relying on the GitHub API, we must fetch and parse the HTML of the repositories tab.
- Using `requests` and `beautifulsoup4` provides a robust way to extract repository names, links, descriptions, and tags (languages/topics) from the GitHub DOM (`<div id="user-repositories-list">`).
- To maintain the exact aesthetic of the portfolio, the extracted data must be injected into the existing HTML structure.
- The Python script can be used to generate the exact HTML string for all repositories, mapping them to the expected template with alternating `--reversed` classes, incrementing `data-delay` values, and sequentially assigned gradient styles.
- A regular expression replacement (`re.sub`) with `re.DOTALL` allows us to securely replace the placeholder projects inside `.project-showcase` while leaving the rest of `index.html` untouched.

## 3. Caveats
- The script depends on external Python packages (`requests`, `beautifulsoup4`) which must be installed by the implementer.
- It is assumed that GitHub's DOM structure (`id="user-repositories-list"`, `itemprop="owns"`, etc.) is standard and consistent for the public profile view.
- The HTML replacement relies on the `</div> </div> </section>` sequence closing the `work` section; if other sections have this exact closing sequence inside the showcase, the regex would break, but our inspection confirms no such nesting exists.

## 4. Conclusion
The most reliable method to fulfill Milestone 1 is to execute a custom Python script that performs the web scraping, structures the output into the required HTML format, and overwrites the contents of the `.project-showcase` block in `index.html`. The implementer agent should create and run this script.

## 5. Verification Method
1. Install requirements: `pip install requests beautifulsoup4`
2. Run the provided Python script.
3. Open `index.html` in a browser and verify that the "Selected Projects" section displays the actual public repositories from SCHANDER2, preserving all animations and styling (gradients, tags, reversed layouts).

---

## Execution Plan & Script Logic

The Implementer should create a script (e.g., `update_portfolio.py`) with the following logic and execute it. 

### Prerequisites
Run `pip install requests beautifulsoup4` in the terminal before running the script.

### Script (`update_portfolio.py`)
```python
import os
import re
import requests
from bs4 import BeautifulSoup

github_url = "https://github.com/SCHANDER2?tab=repositories"
index_html_path = r"c:\Users\G4\OneDrive\Desktop\MEOOWWW\index.html"

# Predefined gradients to cycle through for the visual blocks
gradients = [
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #4facfe, #00f2fe)",
    "linear-gradient(135deg, #30cfd0, #330867)"
]

def fetch_repositories():
    print(f"Fetching data from {github_url}...")
    response = requests.get(github_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    repos = []
    repo_list = soup.find(id='user-repositories-list')
    if not repo_list:
        print("Error: Could not find user-repositories-list on the page.")
        return []
    
    for li in repo_list.find_all('li', itemprop='owns'):
        a_tag = li.find('a', itemprop='name codeRepository')
        if not a_tag:
            continue
            
        name = a_tag.text.strip()
        link = "https://github.com" + a_tag['href']
        
        desc_p = li.find('p', itemprop='description')
        desc = desc_p.text.strip() if desc_p else "GitHub Repository"
        
        tags = []
        lang_span = li.find('span', itemprop='programmingLanguage')
        if lang_span:
            tags.append(lang_span.text.strip())
            
        for topic in li.find_all('a', attrs={'data-octo-click': 'topic_click'}):
            tags.append(topic.text.strip())
            
        repos.append({
            'name': name,
            'link': link,
            'desc': desc,
            'tags': tags
        })
    return repos

def generate_html(repos):
    cards_html = []
    for i, repo in enumerate(repos):
        index_num = i + 1
        index_str = f"{index_num:02d}"
        
        # Every even card gets the reversed class
        reversed_class = " project-card--reversed" if index_num % 2 == 0 else ""
        delay = i * 0.1
        gradient = gradients[i % len(gradients)]
        
        # Build tags HTML
        if repo['tags']:
            tags_str = "\n                ".join(f'<span class="tag">{tag}</span>' for tag in repo['tags'])
            tags_html = f"""<div class="project-tags">
                {tags_str}
              </div>"""
        else:
            tags_html = f"""<div class="project-tags">
                <span class="tag">GitHub</span>
              </div>"""
        
        card = f"""          <!-- Project {index_num} — {repo['name']} -->
          <article class="project-card{reversed_class} reveal" data-delay="{delay:.1f}">
            <div class="project-visual" style="background: {gradient};">
              <span class="project-index">{index_str}</span>
            </div>
            <div class="project-content">
              {tags_html}
              <h3 class="project-title">{repo['name']}</h3>
              <p class="project-role">GitHub Repository</p>
              <p class="project-desc">{repo['desc']}</p>
              <a href="{repo['link']}" class="project-link" aria-label="View {repo['name']} repository" target="_blank" rel="noopener noreferrer">
                <span>View Project</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </article>"""
        cards_html.append(card)
        
    return "\n\n".join(cards_html)

def update_index_html(new_content):
    print(f"Reading {index_html_path}...")
    with open(index_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Match the project-showcase div and replace its content
    pattern = re.compile(r'(<div class="project-showcase">)(.*?)([\r\n\s]*</div>[\r\n\s]*</div>[\r\n\s]*</section>)', re.DOTALL)
    
    if pattern.search(content):
        # We use a lambda to avoid backslash parsing issues with the replacement string
        new_html = pattern.sub(lambda m: m.group(1) + '\n\n' + new_content + '\n' + m.group(3), content)
        
        with open(index_html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("Success: index.html updated successfully with new GitHub projects.")
    else:
        print("Error: Could not find the .project-showcase insertion markers in index.html.")

if __name__ == "__main__":
    repos = fetch_repositories()
    print(f"Found {len(repos)} public repositories.")
    if repos:
        html_content = generate_html(repos)
        update_index_html(html_content)
    else:
        print("No repositories found or an error occurred during fetching.")
```
