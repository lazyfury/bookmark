from bs4 import BeautifulSoup
from openai import OpenAI
import requests
import datetime
import json

html_file = "./bookmarks_2025_4_23.html"


openai_client = OpenAI(
    api_key="sk-XMKy0xxxx3nZ7vuaILoF",
    base_url="https://api.openai.com/v1",
)

def extra_link_attr(html_content):
    """
    Extracts the href attributes from all <a> tags in the given HTML content.

    Args:
        html_content (str): The HTML content to parse.

    Returns:
        list: A list of href attributes from <a> tags.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    links = soup.find_all('a')
    return [{
        'href': link.get('href'),
        'text': link.get_text(strip=True),
        'icon': link.get('icon'),
    } for link in links if link.get('href') is not None]
    
def write_markdown(links, output_file):
    """
    Writes the extracted links to a markdown file.

    Args:
        links (list): The list of links to write.
        output_file (str): The path to the output markdown file.
    """
    with open(output_file, 'w', encoding='utf-8') as file:
        for link in links:
            file.write(f"[{link['text']}]({link['href']})\n")

def write_json(links, output_file):
    """
    Writes the extracted links to a JSON file.

    Args:
        links (list): The list of links to write.
        output_file (str): The path to the output JSON file.
    """
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(links, file, ensure_ascii=False, indent=4)

def ai_completion(prompt):
    """
    Generates a completion using OpenAI's API.

    Args:
        prompt (str): The prompt to send to the API.

    Returns:
        str: The generated text from the API.
    """
    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        n=3,
        stop=None,
        temperature=0.3,
        stream=False,
    )
    return response.choices[0].message.content.strip()

def ai_taged_href(link):
    """
    Tags the href with 'ai' if it contains 'ai' in the URL.

    Args:
        link (str): The URL to tag.

    Returns:
        str: The tagged URL.
    """
    categories = ['编程', '电商','其他','游戏','游戏开发','学习','生活','社交','工具','影视','音乐','小说','动漫','设计','摄影','美食']
    categories_str = ','.join(categories)

    tags = ai_completion(f"tags:\n \
                         根据给定的内容在{categories_str}中查找对应的一级标签，并适当的添加细分类目 \
                         注意：！！！！1.如果没有找到对应的标签，返回空 2.不需要额外问候和其他内容回复,3.如果你认识域名，域名优先级最高\
                         \
                         返回示例：[编程,前端,数据库,nextjs]\
                         content：{link['text'] } {link['href']} \n\n ")
    
    tags = tags.replace('[','').replace(']','').split(',')
    tags = [tag.strip() for tag in tags if tag.strip()]  # Remove empty strings

    link['tags'] = tags
    return link

if __name__ == "__main__":
    with open(html_file, 'r', encoding='utf-8') as file:
        html_content = file.read()
    
    links = extra_link_attr(html_content)

    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    output_file = f"output_{date_str}.json"

    
    for i,link in enumerate(links):
        try:
            link = ai_taged_href(link)
            print(link['text'] + " " + link['href'] + " " + link['tags'])
        except Exception as e:
            print(f"Error processing link {link['href']}: {e}")

    write_json(links, output_file)
    print("All links processed.")


    
