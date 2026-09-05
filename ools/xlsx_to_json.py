import argparse
import json
import re
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = ROOT / "ipma_data.xlsx"
OUT_BOOKS = ROOT / "data" / "books.json"
OUT_VERIFY = ROOT / "data" / "verify.json"

BOOK_REQUIRED = [
    "id", "title", "subtitle", "series", "category", "format", "edition", "version",
    "publish_date", "publisher", "cover", "summary", "toc", "verification_code_example"
]

BOOK_OPTIONAL = [
    "isbn", "language", "author", "authors", "author_ids", "keywords", "status",
    "featured", "new_release", "ebook_url", "preview_url", "purchase_url",
    "download_policy", "rights", "updated_at"
]

VERIFY_REQUIRED = [
    "code", "status", "title", "edition", "version", "publish_date", "publisher",
    "series", "book_url", "notes"
]

TRUE_VALUES = {"1", "true", "yes", "y", "예", "네", "추천", "신간"}
FALSE_VALUES = {"0", "false", "no", "n", "아니오", "아니요", ""}


def today_kst_str():
    return datetime.now(ZoneInfo("Asia/Seoul")).strftime("%Y-%m-%d")


def read_sheet(xlsx: Path, name: str) -> pd.DataFrame:
    if not xlsx.exists():
        raise FileNotFoundError(f"엑셀 파일이 없습니다: {xlsx}")
    df = pd.read_excel(xlsx, sheet_name=name, dtype=str).fillna("")
    df.columns = [str(c).strip() for c in df.columns]
    for c in df.columns:
        df[c] = df[c].astype(str).map(lambda x: x.strip())
    return df


def ensure_columns(df: pd.DataFrame, required, sheet_name: str):
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"[{sheet_name}] 시트에 컬럼이 누락됐습니다: {missing}")


def text(r, key, default=""):
    if key not in r.index:
        return default
    value = str(r[key]).strip()
    return value if value else default


def lines_to_list(value: str):
    if not value:
        return []
    # 줄바꿈, 세미콜론, | 를 목록 구분자로 허용
    parts = re.split(r"[\n;|]+", str(value))
    return [x.strip() for x in parts if x.strip()]


def parse_bool(value: str):
    v = str(value or "").strip().lower()
    if v in TRUE_VALUES:
        return True
    if v in FALSE_VALUES:
        return False
    raise ValueError(f"불리언 값은 true/false, yes/no, 1/0 형태로 입력해 주세요: {value}")


def normalize_isbn(value: str):
    raw = str(value or "").strip()
    if not raw:
        return ""
    compact = re.sub(r"[^0-9Xx]", "", raw).upper()
    if len(compact) not in (10, 13):
        raise ValueError(f"ISBN 길이가 올바르지 않습니다: {raw}")
    if len(compact) == 10 and not re.fullmatch(r"\d{9}[\dX]", compact):
        raise ValueError(f"ISBN-10 형식이 올바르지 않습니다: {raw}")
    if len(compact) == 13 and not compact.isdigit():
        raise ValueError(f"ISBN-13 형식이 올바르지 않습니다: {raw}")
    return compact


def valid_isbn_checksum(isbn: str):
    if not isbn:
        return True
    if len(isbn) == 10:
        nums = [10 if c == "X" else int(c) for c in isbn]
        return sum((10 - i) * n for i, n in enumerate(nums)) % 11 == 0
    nums = [int(c) for c in isbn]
    total = sum(n if i % 2 == 0 else n * 3 for i, n in enumerate(nums[:-1]))
    check = (10 - (total % 10)) % 10
    return check == nums[-1]


def validate_date(value: str, label: str, allow_tbd=True):
    v = str(value or "").strip()
    if not v:
        return ""
    if allow_tbd and v.upper() == "TBD":
        return "TBD"
    try:
        datetime.strptime(v, "%Y-%m-%d")
    except ValueError as e:
        raise ValueError(f"{label}은 YYYY-MM-DD 형식이어야 합니다: {v}") from e
    return v


def clean_url(value: str, label: str):
    v = str(value or "").strip()
    if not v:
        return ""
    if v.startswith(("https://", "http://", "../", "../../", "./", "/")):
        return v
    raise ValueError(f"{label} 경로/URL 형식을 확인해 주세요: {v}")


def build_book_record(r):
    book_id = text(r, "id")
    title = text(r, "title")
    if not book_id or not title:
        raise ValueError("books 시트의 각 등록 행에는 id와 title이 반드시 필요합니다.")

    isbn = normalize_isbn(text(r, "isbn"))
    if isbn and not valid_isbn_checksum(isbn):
        raise ValueError(f"ISBN 체크섬이 일치하지 않습니다: {text(r, 'isbn')}")

    publish_date = validate_date(text(r, "publish_date"), f"{book_id}.publish_date")
    updated_at = validate_date(text(r, "updated_at"), f"{book_id}.updated_at", allow_tbd=False)

    record = {
        "id": book_id,
        "title": title,
        "subtitle": text(r, "subtitle"),
        "series": text(r, "series"),
        "category": text(r, "category"),
        "format": text(r, "format"),
        "edition": text(r, "edition"),
        "version": text(r, "version"),
        "publish_date": publish_date,
        "publisher": text(r, "publisher", "IPMA Publishing"),
        "cover": text(r, "cover", "../assets/images/placeholders/cover-default.jpg"),
        "summary": text(r, "summary"),
        "toc": lines_to_list(text(r, "toc")),
        "verification_code_example": text(r, "verification_code_example")
    }

    optional_values = {
        "isbn": isbn,
        "language": text(r, "language"),
        "author": text(r, "author"),
        "authors": lines_to_list(text(r, "authors")),
        "author_ids": lines_to_list(text(r, "author_ids")),
        "keywords": lines_to_list(text(r, "keywords")),
        "status": text(r, "status"),
        "featured": parse_bool(text(r, "featured")) if "featured" in r.index else False,
        "new_release": parse_bool(text(r, "new_release")) if "new_release" in r.index else False,
        "ebook_url": clean_url(text(r, "ebook_url"), f"{book_id}.ebook_url"),
        "preview_url": clean_url(text(r, "preview_url"), f"{book_id}.preview_url"),
        "purchase_url": clean_url(text(r, "purchase_url"), f"{book_id}.purchase_url"),
        "download_policy": text(r, "download_policy"),
        "rights": text(r, "rights"),
        "updated_at": updated_at,
    }

    # 실제 값이 있는 선택 필드만 JSON에 기록한다.
    # featured/new_release는 true일 때만 기록해 기존 데이터와의 호환성을 유지한다.
    for key, value in optional_values.items():
        if isinstance(value, bool):
            if value:
                record[key] = value
        elif isinstance(value, list):
            if value:
                record[key] = value
        elif value:
            record[key] = value

    return record


def make_books_json(df: pd.DataFrame):
    ensure_columns(df, BOOK_REQUIRED, "books")

    books = []
    seen_ids = set()
    seen_isbns = set()

    for idx, r in df.iterrows():
        if not text(r, "id") and not text(r, "title"):
            continue
        try:
            record = build_book_record(r)
        except ValueError as e:
            raise ValueError(f"books 시트 {idx + 2}행: {e}") from e

        if record["id"] in seen_ids:
            raise ValueError(f"books 시트에 중복 id가 있습니다: {record['id']}")
        seen_ids.add(record["id"])

        isbn = record.get("isbn", "")
        if isbn:
            if isbn in seen_isbns:
                raise ValueError(f"books 시트에 중복 ISBN이 있습니다: {isbn}")
            seen_isbns.add(isbn)

        books.append(record)

    return {"updated": today_kst_str(), "books": books}


def make_verify_json(df: pd.DataFrame):
    ensure_columns(df, VERIFY_REQUIRED, "verify")

    recs = []
    seen_codes = set()
    for idx, r in df.iterrows():
        code = text(r, "code")
        if not code:
            continue
        if code in seen_codes:
            raise ValueError(f"verify 시트에 중복 코드가 있습니다: {code}")
        seen_codes.add(code)

        try:
            publish_date = validate_date(text(r, "publish_date"), f"verify.{code}.publish_date")
        except ValueError as e:
            raise ValueError(f"verify 시트 {idx + 2}행: {e}") from e

        recs.append({
            "code": code,
            "status": text(r, "status", "valid"),
            "title": text(r, "title"),
            "edition": text(r, "edition"),
            "version": text(r, "version"),
            "publish_date": publish_date,
            "publisher": text(r, "publisher", "IPMA Publishing"),
            "series": text(r, "series"),
            "book_url": text(r, "book_url"),
            "notes": text(r, "notes")
        })

    return {"updated": today_kst_str(), "records": recs}


def write_json(path: Path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="IPMA Publishing Excel → JSON 변환/검증")
    parser.add_argument("--xlsx", default=str(DEFAULT_XLSX), help="입력 엑셀 파일 경로")
    parser.add_argument("--check", action="store_true", help="검증만 하고 JSON 파일은 변경하지 않음")
    args = parser.parse_args()

    xlsx = Path(args.xlsx).expanduser().resolve()
    books_df = read_sheet(xlsx, "books")
    verify_df = read_sheet(xlsx, "verify")

    books_payload = make_books_json(books_df)
    verify_payload = make_verify_json(verify_df)

    print(f"✅ 검증 완료: 도서 {len(books_payload['books'])}권 / 정본 {len(verify_payload['records'])}건")

    if args.check:
        print("ℹ️ --check 모드: 기존 JSON 파일을 변경하지 않았습니다.")
        return

    write_json(OUT_BOOKS, books_payload)
    write_json(OUT_VERIFY, verify_payload)
    print(f"✅ 생성 완료: {OUT_BOOKS}")
    print(f"✅ 생성 완료: {OUT_VERIFY}")


if __name__ == "__main__":
    main()
