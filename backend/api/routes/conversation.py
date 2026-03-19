"""
会話ルーター
ユーザーとAIのロールプレイ会話を管理するエンドポイントを提供する
"""

from fastapi import APIRouter, HTTPException

from models.conversation import (
    MessageRequest,
    MessageResponse,
    EndSessionRequest,
    EndSessionResponse,
)
import services.conversation_service as conversation_service

# ルーターの初期化
router = APIRouter()


@router.post("/message", response_model=MessageResponse)
async def send_message(request: MessageRequest) -> MessageResponse:
    """
    ユーザーメッセージを送信し、AIからの返答を取得する

    - **session_id**: セッションを識別するID
    - **scenario_name**: 練習するシナリオ名
    - **message**: ユーザーが送信したメッセージ
    """
    try:
        reply = await conversation_service.chat(
            session_id=request.session_id,
            scenario_name=request.scenario_name,
            user_message=request.message,
        )
        return MessageResponse(reply=reply)

    except ValueError as e:
        # シナリオが存在しない場合は400エラーを返す
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # その他のエラーは500エラーとして返す
        raise HTTPException(status_code=500, detail=f"会話処理中にエラーが発生しました: {str(e)}")


@router.post("/end", response_model=EndSessionResponse)
async def end_session(request: EndSessionRequest) -> EndSessionResponse:
    """
    セッションを終了し、会話履歴を取得する

    - **session_id**: 終了するセッションID
    """
    try:
        history = await conversation_service.end_session(session_id=request.session_id)
        return EndSessionResponse(history=history)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"セッション終了処理中にエラーが発生しました: {str(e)}")
