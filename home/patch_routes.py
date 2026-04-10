import os, glob, re

mapping = {
    '>Home<': 'index.html',
    '>Missions<': 'missions.html',
    '>Job<': 'jobs.html',
    '>Jobs<': 'jobs.html',
    '>Challenge Friends<': 'social.html',
    '>Friends<': 'social.html',
    '>Social<': 'social.html',
    '>Stats<': 'stats.html',
    '>Progress<': 'stats.html',
    '>Leaderboard<': 'stats.html'
}

html_files = glob.glob('*.html')
for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    def replacer(match):
        a_tag = match.group(0)
        for key, val in mapping.items():
            if key.upper() in a_tag.upper():
                return re.sub(r'href=[\'"][^\'"]*[\'"]', f'href="{val}"', a_tag)
        return a_tag

    new_content = re.sub(r'<a[^>]+>.*?</a>', replacer, content, flags=re.DOTALL)
    
    with open(f, 'w') as file:
        file.write(new_content)
