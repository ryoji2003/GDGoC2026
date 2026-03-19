"""
練習履歴エンドポイント用 Pydantic モデル定義
"""

from datetime import datetime

from pydantic import BaseModel


class RecordScores(BaseModel):
    """履歴に保存するスコア情報"""
    # 明瞭さ
    clarity: int
    # 敬語の使い方
    keigo: int
    # テンポ
    tempo: int
    # 共感度
    empathy: int


class RecordFeedback(BaseModel):
    """履歴に保存するフィードバック情報"""
    # 良かった点
    good_points: list[str]
    # 改善点
    improvements: list[str]
    # 最も良かった返答
    best_response: str


class SaveRecordRequest(BaseModel):
    """練習履歴保存リクエスト"""
    # ユーザーID（Firebase Authentication の UID）
    user_id: str
    # 練習したシナリオ名
    scenario_name: str
    # スコア情報
    scores: RecordScores
    # フィードバック情報
    feedback: RecordFeedback
    # 練習日時（省略時は現在時刻を使用）
    created_at: datetime | None = None


class SaveRecordResponse(BaseModel):
    """練習履歴保存応答"""
    # 保存したドキュメントのID
    record_id: str
    # 保存成功メッセージ
    message: str


class RecordItem(BaseModel):
    """履歴一覧の個別アイテム"""
    # ドキュメントID
    record_id: str
    # ユーザーID
    user_id: str
    # シナリオ名
    scenario_name: str
    # スコア
    scores: RecordScores
    # フィードバック
    feedback: RecordFeedback
    # 作成日時
    created_at: datetime


class GetRecordsResponse(BaseModel):
    """練習履歴一覧応答"""
    # 履歴リスト
    records: list[RecordItem]
