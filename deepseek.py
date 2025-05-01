import requests
import json

api_key = "sk-or-v1-ㅇㅇㅇ"
model = "deepseek/deepseek-prover-v2:free"

response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": "쿠버네티스의 개념 설명"
            }
        ]
    })
)

print(response.json())
