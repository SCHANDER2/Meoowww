import urllib.request
import re

url = "https://github.com/SCHANDER2?tab=repositories"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        with open("github_test.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("Success")
except Exception as e:
    print(e)
