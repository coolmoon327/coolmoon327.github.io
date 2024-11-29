import os

# 获取文件中的IP地址
def get_stored_ip(filename="host.txt"):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            return file.read().strip()
    return None

# 生成 index.html 文件
def generate_html(ip, filename="ori_index.html"):
    # 读取 host.txt 中的 IP 地址
    with open("host.txt", "r") as f:
        ip_address = f.read().strip()

    # 读取你的 HTML 文件
    with open(filename, "r", encoding="utf-8") as f:
        html_content = f.read()

    # 替换网址
    updated_html_content = html_content.replace("coolmoon.dynv6.net", ip_address)

    # 将更新后的内容写回 HTML 文件
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(updated_html_content)

    print("网址替换完成！")

if __name__ == "__main__":
    ip = get_stored_ip()
    generate_html(ip)