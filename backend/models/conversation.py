"""
会話エンドポイント用 Pydantic モデル定義
"""

from pydantic import BaseModel


class MessageRequest(BaseModel):
    """チャットメッセージ送信リクエスト"""
    # セッションを識別するID
    session_id: str
    # 練習するシナリオ名
    scenario_name: str
    # ユーザーが送信したメッセージ
    message: str


class MessageResponse(BaseModel):
    """チャットメッセージ応答"""
    # AIからの返答
    reply: str


class EndSessionRequest(BaseModel):
    """セッション終了リクエスト"""
    # 終了するセッションID
    session_id: str


class EndSessionResponse(BaseModel):
    """セッション終了応答（会話履歴を返す）"""
    # 会話履歴リスト（各要素は {"role": str, "content": str} 形式）
    history: list[dict]
