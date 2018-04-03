#!/bin/bash
# insta485db

# Stop on errors
set -e

# Sanity check command line options
usage() {
  echo "Usage: $0 (create[New]|destroy|reset[New]|dump[New])"
}

if [ $# -ne 1 ]; then
  usage
  exit 1
fi

# Parse argument.  $1 is the first argument
case $1 in
  "create")
    sqlite3 vcan.sqlite3 < schema.sql
    sqlite3 vcan.sqlite3 < data.sql
    ;;
  "createNew")
    sqlite3 vcan.sqlite3 < schemaNew.sql
    sqlite3 vcan.sqlite3 < dataNew.sql
    ;;

  "destroy")
    rm -rf vcan.sqlite3
    ;;

  "reset")
    rm -rf vcan.sqlite3
    sqlite3 vcan.sqlite3 < schema.sql
    sqlite3 vcan.sqlite3 < data.sql
    ;;

  "resetNew")
    rm -rf vcan.sqlite3
    sqlite3 vcan.sqlite3 < schemaNew.sql
    sqlite3 vcan.sqlite3 < dataNew.sql
    ;;

  "dump")
    sqlite3 -batch -line vcan.sqlite3 'SELECT * FROM folders'
    sqlite3 -batch -line vcan.sqlite3 'SELECT * FROM applications'
    ;;

  "dumpNew")
    sqlite3 -batch -line vcan.sqlite3 'SELECT * FROM folders'
    sqlite3 -batch -line vcan.sqlite3 'SELECT * FROM applications'
    sqlite3 -batch -line vcan.sqlite3 'SELECT * FROM filed'
    ;;

  *)
    usage
    exit 1
    ;;
esac
