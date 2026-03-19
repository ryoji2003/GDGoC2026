"""
会話サービスモジュール
LangChain + Gemini を使ってシナリオ別のロールプレイ会話を管理する
"""

from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage

from core.config import settings

# シナリオ別システムプロンプト定義
SCENARIO_PROMPTS: dict[str, str] = {
    "上司への報告": (
        "あなたは厳格だが公正な上司です。部下からの業務報告を受けています。"
        "報告の内容に応じて、適切な質問やフィードバックを日本語で返してください。"
        "敬語の使い方が不自然な場合は、さりげなく指摘してください。"
        "会話は自然で現実的なビジネスシーンを想定してください。"
    ),
    "初対面の人との雑談": (
        "あなたは社交的で親しみやすい人です。今日初めて会った人と雑談しています。"
        "相手の話に興味を持ち、質問を交えながら自然な会話を日本語で続けてください。"
        "フレンドリーだが礼儀正しいトーンを維持してください。"
    ),
    "友達への誘い断り方": (
        "あなたは仲の良い友達です。相手から何かに誘われています。"
        "誘いを断られる側として、相手がうまく断れているかを確認しながら会話を日本語で続けてください。"
        "相手の断り方が不自然だったり失礼に聞こえる場合は、感情的に反応してください。"
    ),
    "デートの誘い方": (
        "あなたは相手が好意を持っている人です。相手からデートに誘われようとしています。"
        "自然な会話の流れの中で、相手がうまくデートに誘えるかを見守ってください。"
        "会話は日本語で、現実的な恋愛シーンを想定してください。"
        "誘い方が不自然だったり唐突すぎる場合は、少し戸惑った反応をしてください。"
    ),
    "コンビニ店員との会話": (
        "あなたはコンビニエンスストアの店員です。レジで接客をしています。"
        "お客さんとの自然なやり取りを日本語でシミュレートしてください。"
        "「温めますか？」「袋はご入用ですか？」などのよくある接客フレーズを使ってください。"
        "お客さんの要望に適切に応じてください。"
    ),
    "グループでの自己紹介": (
        "あなたはグループの進行役です。新しいメンバーが自己紹介をしようとしています。"
        "自己紹介が終わったら、グループのメンバーとして質問や歓迎のコメントを日本語で返してください。"
        "自己紹介が短すぎたり情報が少ない場合は、もう少し詳しく聞いてください。"
    ),
}

# セッションIDをキーとしたメモリ管理用辞書
_session_memories: dict[str, ConversationBufferMemory] = {}
# セッションIDをキーとしたシナリオ名管理用辞書
_session_scenarios: dict[str, str] = {}


def _get_or_create_memory(session_id: str) -> ConversationBufferMemory:
    """
    セッションIDに対応するメモリを取得する
    存在しない場合は新規作成する
    """
    if session_id not in _session_memories:
        _session_memories[session_id] = ConversationBufferMemory(
            return_messages=True,
            memory_key="history"
        )
    return _session_memories[session_id]


async def chat(session_id: str, scenario_name: str, user_message: str) -> str:
    """
    ユーザーメッセージを受け取り、シナリオに応じたAI返答を生成する

    Args:
        session_id: セッションを識別するID
        scenario_name: 練習するシナリオ名
        user_message: ユーザーが送信したメッセージ

    Returns:
        AIからの返答テキスト

    Raises:
        ValueError: 指定されたシナリオが存在しない場合
    """
    # シナリオの存在確認
    if scenario_name not in SCENARIO_PROMPTS:
        raise ValueError(f"シナリオ '{scenario_name}' は存在しません。利用可能なシナリオ: {list(SCENARIO_PROMPTS.keys())}")

    # セッションのシナリオを記録
    _session_scenarios[session_id] = scenario_name

    # Geminiモデルの初期化
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite-preview",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.7,
    )

    # メモリの取得または作成
    memory = _get_or_create_memory(session_id)

    # システムプロンプトを取得
    system_prompt = SCENARIO_PROMPTS[scenario_name]

    # 会話履歴を取得
    history = memory.chat_memory.messages

    # メッセージリストを構築（システムプロンプト + 履歴 + 新しいユーザーメッセージ）
    messages = [SystemMessage(content=system_prompt)]
    messages.extend(history)
    messages.append(HumanMessage(content=user_message))

    # AIに問い合わせ（非同期）
    response = await llm.ainvoke(messages)
    ai_reply = response.content

    # メモリに会話を保存
    memory.chat_memory.add_user_message(user_message)
    memory.chat_memory.add_ai_message(ai_reply)

    return ai_reply


async def end_session(session_id: str) -> list[dict]:
    """
    セッションを終了し、会話履歴を返す

    Args:
        session_id: 終了するセッションID

    Returns:
        会話履歴のリスト（各要素は {"role": str, "content": str} 形式）
    """
    history: list[dict] = []

    if session_id in _session_memories:
        memory = _session_memories[session_id]

        # メッセージを辞書形式に変換
        for message in memory.chat_memory.messages:
            role = "user" if message.type == "human" else "assistant"
            history.append({"role": role, "content": message.content})

        # セッションデータを削除
        del _session_memories[session_id]

    # シナリオ情報も削除
    if session_id in _session_scenarios:
        del _session_scenarios[session_id]

    return history


def get_available_scenarios() -> list[str]:
    """利用可能なシナリオ名の一覧を返す"""
    return list(SCENARIO_PROMPTS.keys())
