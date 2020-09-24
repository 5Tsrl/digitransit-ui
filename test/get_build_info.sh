#/bin/bash
set -e

echo "export const COMMIT_ID = \"`git rev-parse HEAD`\";\nexport const BUILD_TIME = \"`date '+%Y-%m-%d %H:%M'`\";" 
