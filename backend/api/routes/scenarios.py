"""
シナリオルーター
Firestoreからシナリオ情報を取得するエンドポイントを提供する
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.firebase import get_firestore_client

# ルーターの初期化
router = APIRouter()

# Firestoreのコレクション名
SCENARIOS_COLLECTION = "scenarios"


class ScenarioItem(BaseModel):
    """シナリオの個別アイテム"""
    # シナリオID（Firestoreドキュメントのid）
    scenario_id: str
    # シナリオ名
    name: str
    # シナリオの説明文
    description: str
    # 難易度（例: "初級", "中級", "上級"）
    difficulty: str
    # シナリオのカテゴリ（例: "ビジネス", "日常", "恋愛"）
    category: str


class GetScenariosResponse(BaseModel):
    """シナリオ一覧レスポンス"""
    # シナリオリスト
    scenarios: list[ScenarioItem]


@router.get("/", response_model=GetScenariosResponse)
async def get_scenarios() -> GetScenariosResponse:
    """
    Firestoreからシナリオ一覧を取得する
    シナリオが登録されていない場合は空リストを返す
    """
    try:
        db = get_firestore_client()

        # シナリオコレクションから全件取得
        docs = db.collection(SCENARIOS_COLLECTION).stream()

        scenarios: list[ScenarioItem] = []
        for doc in docs:
            data = doc.to_dict()
            scenario = ScenarioItem(
                scenario_id=doc.id,
                name=data.get("name", ""),
                description=data.get("description", ""),
                difficulty=data.get("difficulty", "初級"),
                category=data.get("category", "その他"),
            )
            scenarios.append(scenario)

        return GetScenariosResponse(scenarios=scenarios)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"シナリオ一覧の取得中にエラーが発生しました: {str(e)}")
