"""
評価ルーター
会話履歴を分析して評価結果を返すエンドポイントを提供する
"""

from fastapi import APIRouter, HTTPException

from models.evaluation import AnalyzeRequest, AnalyzeResponse
import services.evaluation_service as evaluation_service

# ルーターの初期化
router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_conversation(request: AnalyzeRequest) -> AnalyzeResponse:
    """
    会話履歴を分析し、コミュニケーションスキルの評価結果を返す

    - **history**: 分析対象の会話履歴
      - 各要素: {"role": "user" | "assistant", "content": "メッセージ内容"}
    """
    try:
        # 評価サービスで会話を分析
        evaluation_dict = await evaluation_service.analyze_conversation(
            history=request.history
        )

        # レスポンスモデルに変換して返す
        return AnalyzeResponse(**evaluation_dict)

    except ValueError as e:
        # 入力値が不正な場合は400エラーを返す
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        # JSON解析エラーなどは422エラーを返す
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"評価処理中にエラーが発生しました: {str(e)}")
