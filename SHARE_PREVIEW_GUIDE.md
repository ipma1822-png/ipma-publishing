# IPMA Publishing 공유 미리보기 운영 기준

Updated: 2026-09-05

## 1. 목적

카카오톡, SNS, 메신저 등에서 IPMA Publishing 도서 링크를 공유할 때 제목·ISBN·발행일이 안정적으로 보이도록 정적 공유 페이지를 운영한다.

GitHub Pages의 `catalog/official/?isbn=...` 상세페이지는 브라우저에서 JavaScript로 도서별 제목과 설명을 채운다. 일부 SNS 미리보기 수집기는 이 JavaScript 결과를 읽지 않으므로, 공유가 중요한 도서는 별도의 정적 HTML 공유 페이지를 둔다.

## 2. 공유 페이지 구조

권장 경로:

`share/<slug>/index.html`

각 공유 페이지의 HTML에는 처음부터 다음 값을 넣는다.

- `<title>`: `<도서명> | IPMA Publishing`
- `meta description`: 도서명, ISBN, 발행일, 공식 출판정보
- `og:type`: `book`
- `og:title`: 도서명
- `og:description`: ISBN, 발행일, 공식 출판정보
- `og:url`: 해당 공유 페이지의 절대 URL
- `canonical`: 실제 공식 상세페이지 URL
- `twitter:card`: 이미지가 없을 때 `summary`
- 본문 또는 refresh: 실제 `catalog/official/?isbn=...` 상세페이지로 연결

## 3. 공유 경로 매니페스트

공유 페이지 목록은 `data/share-pages.json`에서 관리한다.

키는 ISBN이고 값은 사이트 루트 기준 공유 페이지 경로다.

새 공유 페이지를 만들 때는 상세페이지 JavaScript를 직접 수정하지 않고 `data/share-pages.json`에 경로를 추가한다. `assets/js/official-publication.js`가 이 매니페스트를 읽어 공유 버튼과 링크 복사 버튼에 자동 적용한다.

## 4. 대표 이미지 규칙

실제 승인된 이미지가 없으면 `og:image`를 넣지 않는다. 1바이트 placeholder, 임시 이미지, 미확정 표지는 SNS 공유 이미지로 사용하지 않는다.

승인 이미지가 준비되면 다음 순서를 권장한다.

1. 도서별 실제 표지 또는 승인된 공유용 이미지
2. 도서별 이미지가 없으면 IPMA Publishing 공식 공유 기본 이미지
3. 둘 다 없으면 이미지 없는 `summary` 공유

권장 경로:

- 도서별 공유 이미지: `assets/images/covers/<isbn>.webp`
- 출판사 기본 공유 이미지: `assets/images/publishing/share-default.webp`

`og:image`는 반드시 절대 URL을 사용한다.

예:

`https://ipma1822-png.github.io/ipma-publishing/assets/images/covers/979-11-24175-59-0.webp`

이미지가 확인된 경우에만 `twitter:card`를 `summary_large_image`로 변경한다.

## 5. 현재 정적 공유 페이지

- DOUBLE CROSS — ISBN `979-11-24175-59-0`
- 경찰무도의 본질과 미래 — ISBN `979-11-24175-54-5`
- ACTS MISSION ALLIANCE — ISBN `979-11-24175-60-6`

## 6. 확장 원칙

185권 전체에 정적 페이지를 한 번에 수작업으로 만들 필요는 없다. 우선 공유 빈도가 높은 대표작, 신간, 실제 전자책 이용 가능 도서부터 추가한다.

새 페이지 생성 시 출판 데이터의 사실값은 반드시 `data/official-publications.csv`를 기준으로 하며 제목, ISBN, 발행일을 임의 생성하거나 수정하지 않는다.

## 7. 홈페이지 OG/Favicon 원칙

실제 승인된 홈페이지 OG 이미지와 favicon이 준비되기 전에는 깨진 placeholder 파일을 참조하지 않는다. 현재 홈페이지는 텍스트 기반 OG 메타정보와 canonical URL만 제공한다.

이미지 제작 완료 후 다음 자산을 연결할 수 있다.

- `assets/images/publishing/share-default.webp`
- 승인된 favicon 파일

연결 전 실제 파일 존재 여부와 이미지 크기/형식을 확인한다.
