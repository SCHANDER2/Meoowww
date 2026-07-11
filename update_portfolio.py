import urllib.request
import re
import os

def fetch_repositories():
    url = "https://github.com/SCHANDER2?tab=repositories"
    print(f"Fetching {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching: {e}")
        return []
        
    # Extract the user-repositories-list div
    repo_list_match = re.search(r'<div id="user-repositories-list">(.*?)</ul>', html, re.DOTALL)
    if not repo_list_match:
        print("Could not find user-repositories-list.")
        return []
        
    repo_html = repo_list_match.group(1)
    
    repos = []
    # Find all li elements with itemprop="owns"
    li_matches = re.finditer(r'<li[^>]*itemprop="owns"[^>]*>(.*?)</li>', repo_html, re.DOTALL)
    
    for li_match in li_matches:
        li_content = li_match.group(1)
        
        # Extract name and link
        a_match = re.search(r'<a[^>]*itemprop="name codeRepository"[^>]*href="([^"]+)"[^>]*>([^<]+)</a>', li_content)
        if not a_match:
            continue
            
        link = "https://github.com" + a_match.group(1)
        name = a_match.group(2).strip()
        
        # Extract description
        desc_match = re.search(r'<p[^>]*itemprop="description"[^>]*>(.*?)</p>', li_content, re.DOTALL)
        desc = desc_match.group(1).strip() if desc_match else "GitHub Repository"
        
        # Extract tags
        tags = []
        lang_match = re.search(r'<span[^>]*itemprop="programmingLanguage"[^>]*>([^<]+)</span>', li_content)
        if lang_match:
            tags.append(lang_match.group(1).strip())
            
        topic_matches = re.finditer(r'<a[^>]*data-octo-click="topic_click"[^>]*>([^<]+)</a>', li_content)
        for t_match in topic_matches:
            tags.append(t_match.group(1).strip())
            
        repos.append({
            'name': name,
            'link': link,
            'desc': desc,
            'tags': tags
        })
        
    return repos

gradients = [
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #4facfe, #00f2fe)",
    "linear-gradient(135deg, #30cfd0, #330867)"
]

def generate_html(repos):
    cards_html = []
    for i, repo in enumerate(repos):
        index_num = i + 1
        index_str = f"{index_num:02d}"
        
        reversed_class = " project-card--reversed" if index_num % 2 == 0 else ""
        delay = i * 0.1
        gradient = gradients[i % len(gradients)]
        
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
    index_path = r"c:\Users\G4\OneDrive\Desktop\MEOOWWW\index.html"
    print(f"Reading {index_path}...")
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    pattern = re.compile(r'(<div class="project-showcase">)(.*?)([\r\n\s]*</div>[\r\n\s]*</div>[\r\n\s]*</section>)', re.DOTALL)
    
    if pattern.search(content):
        new_html = pattern.sub(lambda m: m.group(1) + '\n\n' + new_content + '\n' + m.group(3), content)
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("Success: index.html updated successfully with new GitHub projects.")
    else:
        print("Error: Could not find the .project-showcase insertion markers in index.html.")

if __name__ == "__main__":
    repos = fetch_repositories()
    print(f"Found {len(repos)} repositories.")
    if repos:
        html_content = generate_html(repos)
        update_index_html(html_content)
    else:
        print("No repositories found or an error occurred during fetching.")
