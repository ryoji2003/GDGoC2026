"""
評価サービスモジュール
LangChain + Gemini を使って会話ログを分析・評価する
"""

import json
import re

from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.output_parser import StrOutputParser

from core.config import settings

# 会話評価用プロンプトテンプレート
EVALUATION_PROMPT_TEMPLATE = """
あなたは日本語コミュニケーションの専門家です。
以下の会話ログを分析し、ユーザー（human）の会話スキルを評価してください。

## 会話ログ
{conversation_log}

## 評価指示
以下の4つの観点でユーザーの発言を0〜100点で評価してください：
1. **clarity（明瞭さ）**: 伝えたいことが明確で分かりやすいか
2. **keigo（敬語）**: 場面に応じた適切な敬語や言葉遣いができているか
3. **tempo（テンポ）**: 会話のテンポやリズムが自然か、返答が適切な長さか
4. **empathy（共感）**: 相手への共感や思いやりが感じられるか

## 出力形式
必ず以下のJSON形式で出力してください。JSON以外のテキストは含めないでください：

{{
  "total_score": <総合スコア 0-100>,
  "scores": {{
    "clarity": <0-100>,
    "keigo": <0-100>,
    "tempo": <0-100>,
    "empathy": <0-100>
  }},
  "good_points": [
    "<良かった点1>",
    "<良かった点2>"
  ],
  "improvements": [
    "<改善点1>",
    "<改善点2>"
  ],
  "best_response": "<最も良かったユーザーの返答をそのまま引用>"
}}
"""


async def analyze_conversation(history: list[dict]) -> dict:
    """
    会話履歴を受け取り、Geminiで分析して評価結果を返す

    Args:
        history: 会話履歴（各要素は {"role": str, "content": str} 形式）

    Returns:
        評価結果のdict（total_score, scores, good_points, improvements, best_response）

    Raises:
        ValueError: 会話履歴が空の場合
        RuntimeError: JSON解析に失敗した場合
    """
    if not history:
        raise ValueError("会話履歴が空です。評価するには最低1件の会話が必要です。")

    # 会話ログを読みやすい形式にフォーマット
    conversation_log = _format_conversation_log(history)

    # Geminiモデルの初期化
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite-preview",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.3,  # 評価は一貫性を重視するため低めに設定
    )

    # プロンプトテンプレートの作成
    prompt = PromptTemplate(
        input_variables=["conversation_log"],
        template=EVALUATION_PROMPT_TEMPLATE,
    )

    # LangChain パイプライン構文でチェーンを構築
    chain = prompt | llm | StrOutputParser()

    # 非同期で評価を実行
    result_text = await chain.ainvoke({"conversation_log": conversation_log})

    # JSON文字列を抽出してパース
    evaluation_dict = _parse_evaluation_json(result_text)

    return evaluation_dict


def _format_conversation_log(history: list[dict]) -> str:
    """
    会話履歴を読みやすいテキスト形式に変換する

    Args:
        history: 会話履歴リスト

    Returns:
        フォーマットされた会話ログ文字列
    """
    lines = []
    for entry in history:
        role = entry.get("role", "unknown")
        content = entry.get("content", "")

        # ロール名を日本語に変換
        if role == "user" or role == "human":
            role_label = "ユーザー"
        elif role == "assistant" or role == "ai":
            role_label = "AI"
        else:
            role_label = role

        lines.append(f"{role_label}: {content}")

    return "\n".join(lines)


def _parse_evaluation_json(text: str) -> dict:
    """
    AIの出力テキストからJSON部分を抽出してパースする

    Args:
        text: AIが生成したテキスト

    Returns:
        パースされた評価結果dict

    Raises:
        RuntimeError: JSONのパースに失敗した場合
    """
    # コードブロック（```json ... ```）を除去
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip()
    cleaned = re.sub(r"```\s*$", "", cleaned).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        # JSON部分だけを抽出して再試行
        json_match = re.search(r"\{[\s\S]*\}", cleaned)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass

        raise RuntimeError(f"評価結果のJSON解析に失敗しました: {e}\n受信テキスト: {text[:500]}")
