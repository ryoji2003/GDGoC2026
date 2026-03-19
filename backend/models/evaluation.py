"""
評価エンドポイント用 Pydantic モデル定義
"""

from pydantic import BaseModel


class EvaluationScores(BaseModel):
    """各評価項目のスコア（0〜100）"""
    # 明瞭さ：伝えたいことが明確かどうか
    clarity: int
    # 敬語の使い方の適切さ
    keigo: int
    # 会話のテンポ・リズム
    tempo: int
    # 相手への共感・思いやり
    empathy: int


class EvaluationResult(BaseModel):
    """会話評価の総合結果"""
    # 総合スコア（0〜100）
    total_score: int
    # 各項目のスコア
    scores: EvaluationScores
    # 良かった点のリスト
    good_points: list[str]
    # 改善点のリスト
    improvements: list[str]
    # 最も良かった返答例
    best_response: str


class AnalyzeRequest(BaseModel):
    """会話分析リクエスト"""
    # 分析対象の会話履歴（各要素は {"role": str, "content": str} 形式）
    history: list[dict]


class AnalyzeResponse(BaseModel):
    """会話分析応答"""
    # 総合スコア
    total_score: int
    # 各項目のスコア
    scores: EvaluationScores
    # 良かった点
    good_points: list[str]
    # 改善点
    improvements: list[str]
    # 最も良かった返答
    best_response: str
