# IPMA Publishing — 실제 출판 데이터 이관 가이드

Updated: 2026-09-05

## 목적

이 문서는 과거 교재·전자책·출판물의 **실제 원본 정보**를 IPMA Publishing 디지털 라이브러리로 안전하게 이관하기 위한 기준입니다.

가장 중요한 원칙은 하나입니다.

> **ISBN, 발행일, 저자, 출판·저작 정보를 추정하거나 임의 생성하지 않는다. 원본 자료에서 확인된 값만 등록한다.**

## 우선 확보할 원본 정보

도서별로 가능한 범위에서 다음 자료를 확보합니다.

- 교재명 / 정식 서명
- ISBN
- 발행일
- 출판 / 발행처
- 저작권자
- 저자 / 편저 / 감수
- 판(Edition) / 개정 여부
- 언어
- 표지 이미지
- 목차
- 책 소개
- 기존 PDF 또는 eBook 파일 존재 여부
- 판매 / 배포 경로

원본 자료가 여러 개일 경우 우선순위는 다음과 같습니다.

1. ISBN 발급·등록 원본 자료
2. 실제 출간된 책의 판권지
3. 출판계약서 / 저작권 관련 공식 문서
4. 발행 당시 보관된 공식 목록·대장
5. 기타 보조 자료

## books 시트 필수 컬럼

기존 시스템과 호환을 위해 아래 컬럼은 유지합니다.

`id, title, subtitle, series, category, format, edition, version, publish_date, publisher, cover, summary, toc, verification_code_example`

`id`와 `title`은 실제 등록 행에서 반드시 필요합니다. 나머지 값은 원본 확인 전까지 공란으로 둘 수 있습니다.

## 확장 컬럼

PHASE 3~4에서 추가한 디지털 라이브러리 기능을 위해 아래 선택 컬럼을 사용할 수 있습니다.

- `isbn`: ISBN-10 또는 ISBN-13. 하이픈 포함 입력 가능하며 변환 시 숫자형으로 정규화됩니다.
- `language`: 예) ko, en, zh 또는 Korean, English, Chinese
- `author`: 대표 저자 1명
- `authors`: 복수 저자. 줄바꿈, `;`, `|`로 구분 가능
- `author_ids`: 저자 데이터 연결용 ID 목록
- `keywords`: 검색용 핵심어
- `status`: published, forthcoming, draft 등
- `featured`: 추천도서 여부
- `new_release`: 신간 여부
- `ebook_url`: 전자책 접근 주소
- `preview_url`: 미리보기 주소
- `purchase_url`: 구매 / 이용 주소
- `download_policy`: 다운로드 / 열람 정책
- `rights`: 저작권·이용권 안내
- `updated_at`: 최종 데이터 갱신일

선택 컬럼에 값이 없으면 JSON에 억지로 빈 필드를 만들지 않습니다.

## 날짜 기준

공식 발행일은 `YYYY-MM-DD` 형식으로 입력합니다.

정확한 날짜를 모르면 임의로 월/일을 만들지 않습니다. 원본 자료 확인 전에는 공란 또는 기존 시스템이 사용하던 `TBD` 상태를 유지합니다.

## ISBN 검증

새 변환 도구는 다음을 검사합니다.

- ISBN-10 / ISBN-13 길이
- 허용 문자
- 체크섬
- 동일 ISBN 중복 등록

따라서 원본에 오타가 있는 경우 JSON을 생성하기 전에 오류를 알려줍니다.

ISBN이 확인되지 않은 도서는 **ISBN을 생성하거나 비슷한 번호를 넣지 말고 공란으로 유지합니다.**

## 정본 Verification 연결

`verification_code_example`은 실제 Verification 레코드가 준비된 경우에만 등록합니다.

정본 코드는 ISBN과 같은 값이 아닙니다. IPMA Publishing 내부 정본 확인용 코드이며, 실제 발행본·판·버전과 연결해 관리합니다.

## 안전한 변환 순서

먼저 검증만 수행합니다.

```bash
python ools/xlsx_to_json.py --check
```

이 명령은 엑셀 내용을 검사하지만 기존 `data/books.json`, `data/verify.json`은 변경하지 않습니다.

검증이 모두 통과한 후에만 실제 변환합니다.

```bash
python ools/xlsx_to_json.py
```

다른 위치의 엑셀 파일을 사용할 때는 다음처럼 지정할 수 있습니다.

```bash
python ools/xlsx_to_json.py --xlsx /path/to/ipma_data.xlsx --check
```

## 원본 자료가 도착했을 때의 작업 절차

1. 원본 자료에서 도서별 사실정보 추출
2. 중복 도서 / 개정판 여부 확인
3. ISBN 체크
4. 발행일·출판·저작권자 교차 확인
5. `books` 시트 입력
6. 필요 시 `verify` 시트 입력
7. `--check` 검증
8. 오류 수정
9. JSON 생성
10. 디지털 라이브러리 / 도서 상세 / Verification 회귀시험
11. GitHub `main` 반영

## 기존 샘플 데이터에 대한 주의

현재 저장소의 일부 도서 데이터는 기존 사이트 구축 당시 사용된 샘플·운영 데이터일 수 있습니다. 과거 실제 출판물의 공식 기록으로 자동 간주하지 않습니다.

실제 원본 자료가 확보되면 해당 자료를 기준으로 별도 대조한 후 유지·수정·교체 여부를 결정합니다.
