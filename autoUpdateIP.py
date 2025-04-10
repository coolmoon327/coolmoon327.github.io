import requests
import re
import subprocess
import time
from generateFiles import generate_html, get_stored_ip

success=True

# 请求网页并解析IP地址
def get_ip_from_website():
    url = "https://ip111.cn/"
    response = requests.get(url)
    if response.status_code == 200:
        # 使用正则匹配包含“中国”字样的一行，并提取IP地址
        match = re.search(r"(\d+\.\d+\.\d+\.\d+)\s+中国", response.text)
        if match:
            return match.group(1)  # 返回IP地址
    return None

# 保存新的IP到文件
def save_ip_to_file(ip, filename="host.txt"):
    with open(filename, 'w') as file:
        file.write(ip)

# 执行Git操作：git add, commit, push
def git_commit_and_push():
    try:
        # 执行 git 操作
        subprocess.run(["git", "add", "host.txt", "index.html"], check=True)
        subprocess.run(["git", "commit", "-m", "update IP"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("Git 操作成功！")
        success=True
    except subprocess.CalledProcessError as e:
        print(f"Git 操作失败: {e}")
        success=False

def main():
    # 获取当前 IP
    current_ip = get_ip_from_website()
    if current_ip:
        print(f"当前获取到的IP: {current_ip}")
        
        # 获取文件中的 IP
        stored_ip = get_stored_ip()
        print(f"之前存储的IP: {stored_ip}")

        # 如果 IP 更新，保存并执行 Git 操作
        if current_ip != stored_ip:
            print("IP 地址已更新！")
            save_ip_to_file(current_ip)
            generate_html(current_ip)
            git_commit_and_push()
        else:
            print("IP 地址未更新，无需提交。")
        
        if not success:
            print("上次提交有问题，重新提交。")
            git_commit_and_push()
    else:
        print("未能获取到有效的 IP 地址。")

if __name__ == "__main__":
    while True:
        try:
            main()
        except Exception as e:
            print(f"发生错误: {e}，但继续执行")
        time.sleep(600)
