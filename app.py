import os
import json
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv

# Load các biến môi trường từ file .env
load_dotenv()

app = Flask(__name__)

# Khởi tạo Gemini Client
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/')
def index():
    # Render file HTML chính của bạn từ thư mục templates/
    return render_template('index.html')

@app.route('/api/search', methods=['GET'])
def ai_search():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({"error": "Vui lòng nhập tên dự án"}), 400

    # Dùng Prompt Engineering để ép AI trả về đúng chuẩn JSON mà Frontend cần
    prompt = f"""
    You are an expert Web3 Airdrop Researcher. Analyze the crypto project/ecosystem "{query}".
    Respond EXACTLY in the following JSON format. Do not use Markdown block tags (like ```json). Just return the raw JSON object.
    Find real data for backers and social links. If you don't have exact URLs, provide a Google Search URL.
    {{
      "name": "Official Project Name",
      "chain": "Blockchain network",
      "logo": "First 1 to 2 letters",
      "status": "live", "soon", "rumor", or "ended",
      "desc": "Short, professional 2-sentence description of the project.",
      "raise": "Funds raised (e.g. $45M) or TVL",
      "backers": ["Backer 1", "Backer 2"],
      "socials": {{"twitter": "url", "website": "url", "discord": "url"}},
      "worth_farming": "A concise 2-sentence analysis on whether it is worth farming right now and why.",
      "airdrop_chance": "Estimated probability of an airdrop (e.g. 85%)",
      "est": "Estimated airdrop value (e.g. $500-$2000)",
      "diff": integer from 1 to 3,
      "tasks": ["Actionable task 1", "Actionable task 2", "Actionable task 3"],
      "potential": "high", "med", or "low",
      "type": "airdrop"
    }}
    """

    try:
        # Gọi Gemini API (sử dụng model gemini-2.5-flash)
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        
        result_text = response.text.strip()
        
        # Dọn dẹp kết quả phòng trường hợp AI tự bọc Markdown
        if result_text.startswith("```json"):
            result_text = result_text[7:-3]
        elif result_text.startswith("```"):
            result_text = result_text[3:-3]
            
        data = json.loads(result_text)
        return jsonify(data)
        
    except json.JSONDecodeError:
        return jsonify({"error": "Lỗi phân tích dữ liệu từ AI."}), 500
    except Exception as e:
        print(f"Error connecting to AI: {e}")
        return jsonify({"error": "Không thể kết nối đến AI. Hãy kiểm tra lại kết nối mạng hoặc API Key."}), 500

if __name__ == '__main__':
    # Chạy server ở port 5000
    app.run(debug=True, port=5000)
