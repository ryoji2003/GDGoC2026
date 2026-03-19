"""
シナリオデータ シードスクリプト
Firestoreにシナリオのサンプルデータを投入する初回起動時スクリプト

使用方法:
    cd backend
    python scripts/seed_scenarios.py
"""

import os
import sys

# プロジェクトルートをパスに追加（backend/ ディレクトリから実行することを想定）
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

# .env ファイルの読み込み
load_dotenv()

from core.firebase import get_firestore_client

# Firestoreのコレクション名
SCENARIOS_COLLECTION = "scenarios"

# シードデータ：6つのシナリオ
SEED_SCENARIOS = [
    {
        "name": "上司への報告",
        "description": (
            "職場で上司に業務報告をするシナリオです。"
            "報告・連絡・相談（ほうれんそう）の練習や、"
            "ビジネス敬語の習得に最適です。"
        ),
        "difficulty": "中級",
        "category": "work",
        "example_topics": [
            "プロジェクトの進捗報告",
            "トラブル発生時の報告",
            "完了報告",
        ],
    },
    {
        "name": "初対面の人との雑談",
        "description": (
            "パーティーや懇親会などで初めて会う人と会話するシナリオです。"
            "自己紹介から始まり、共通の話題を見つけて会話を広げる練習ができます。"
        ),
        "difficulty": "初級",
        "category": "first",
        "example_topics": [
            "自己紹介",
            "仕事や趣味について",
            "出身地や学校について",
        ],
    },
    {
        "name": "友達への誘い断り方",
        "description": (
            "友人からの誘いを角が立たないように断るシナリオです。"
            "相手の気持ちを傷つけずに断る表現や、代替案の提示方法を練習できます。"
        ),
        "difficulty": "初級",
        "category": "friend",
        "example_topics": [
            "飲み会の断り方",
            "週末のお出かけの断り方",
            "手伝いを断る",
        ],
    },
    {
        "name": "デートの誘い方",
        "description": (
            "気になる相手をデートに誘うシナリオです。"
            "自然な会話の流れでデートに誘う練習や、"
            "断られた場合の返し方なども学べます。"
        ),
        "difficulty": "上級",
        "category": "romance",
        "example_topics": [
            "カフェに誘う",
            "映画に誘う",
            "ご飯に誘う",
        ],
    },
    {
        "name": "コンビニ店員との会話",
        "description": (
            "コンビニエンスストアでの接客会話のシナリオです。"
            "日常的なやり取りや、困ったときの丁寧な表現方法を練習できます。"
        ),
        "difficulty": "初級",
        "category": "daily",
        "example_topics": [
            "商品の場所を聞く",
            "レジでのやり取り",
            "温め・袋のお断り",
        ],
    },
    {
        "name": "グループでの自己紹介",
        "description": (
            "新しいグループや組織に参加した際の自己紹介シナリオです。"
            "印象に残る自己紹介の仕方や、場の雰囲気に合わせた話し方を練習できます。"
        ),
        "difficulty": "初級",
        "category": "first",
        "example_topics": [
            "職場での初日の挨拶",
            "サークルやクラブへの参加",
            "オンラインミーティングでの自己紹介",
        ],
    },
]


def seed_scenarios() -> None:
    """Firestoreにシナリオデータを投入する"""
    print("Firestoreへのシナリオデータ投入を開始します...")

    db = get_firestore_client()
    collection_ref = db.collection(SCENARIOS_COLLECTION)

    # 既存のデータ件数を確認
    existing_docs = list(collection_ref.limit(1).stream())
    if existing_docs:
        print(f"シナリオデータは既に存在します。上書き投入しますか？ (y/N): ", end="")
        answer = input().strip().lower()
        if answer != "y":
            print("シード処理をキャンセルしました。")
            return

    # 各シナリオをFirestoreに保存
    for i, scenario in enumerate(SEED_SCENARIOS, 1):
        # シナリオ名をドキュメントIDとして使用（重複防止）
        doc_id = scenario["name"].replace(" ", "_").replace("　", "_")
        doc_ref = collection_ref.document(doc_id)
        doc_ref.set(scenario)
        print(f"  [{i}/{len(SEED_SCENARIOS)}] シナリオを保存しました: {scenario['name']}")

    print(f"\n完了！{len(SEED_SCENARIOS)}件のシナリオデータを投入しました。")


if __name__ == "__main__":
    seed_scenarios()
