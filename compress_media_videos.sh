#!/usr/bin/env bash
set -u

ROOT="public/media"
FAILED_COUNT_FILE=""
cleanup() { [ -n "$FAILED_COUNT_FILE" ] && [ -f "$FAILED_COUNT_FILE" ] && rm -f "$FAILED_COUNT_FILE"; }
trap cleanup EXIT
FAILED_COUNT_FILE=$(mktemp) || exit 1
echo 0 > "$FAILED_COUNT_FILE"

fail_inc() { printf '%s' "$(($(cat "$FAILED_COUNT_FILE") + 1))" > "$FAILED_COUNT_FILE"; }

while IFS= read -r -d '' file; do
  [ -z "$file" ] && continue
  echo ""
  echo "---- Processing: $file"
  if [ ! -f "$file" ]; then
    echo "   SKIP: missing file"
    fail_inc
    continue
  fi
  SIZE_BEFORE=$(stat -f '%z' "$file" 2>/dev/null) || SIZE_BEFORE=0
  echo "   Before: $SIZE_BEFORE bytes"

  dir=$(dirname "$file")
  base=$(basename "$file")
  ext="${base##*.}"
  tmp="$dir/.compress_tmp_$$_$base"

  movflags=""
  case "$base" in
    *.mov|*.MOV|*.mp4|*.MP4) movflags="-movflags +faststart";;
  esac

  if ffmpeg -nostdin -y -i "$file" \
    -c:v libx264 -crf 24 -preset medium \
    -vf "scale='min(1920,iw)':-2" \
    -an \
    $movflags \
    "$tmp" 2>/dev/null; then
    if [ -f "$tmp" ]; then
      SIZE_AFTER=$(stat -f '%z' "$tmp" 2>/dev/null) || SIZE_AFTER=0
      echo "   After:  $SIZE_AFTER bytes"
      mv -f "$tmp" "$file"
      echo "   OK: replaced"
    else
      echo "   FAIL: temp file missing"
      rm -f "$tmp"
      fail_inc
    fi
  else
    echo "   FAIL: ffmpeg failed"
    rm -f "$tmp"
    fail_inc
  fi
done < <(find "$ROOT" -type f \( -iname "*.mov" -o -iname "*.mp4" -o -iname "*.webm" \) -print0)

echo ""
echo "Total failures: $(cat "$FAILED_COUNT_FILE")"
echo ""
echo "--- Verification: files over 90M under public/media ---"
find public/media -type f -size +90M -print
