#!/bin/bash
# insta485db

# Stop on errors
set -e

# Sanity check command line options
usage() {
  echo "Usage: $0 (create|destroy|reset|dump|test1)"
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

  "destroy")
    rm -rf vcan.sqlite3
    ;;

  "reset")
    rm -rf vcan.sqlite3
    sqlite3 vcan.sqlite3 < schema.sql
    sqlite3 vcan.sqlite3 < data.sql
    ;;

  "dump")
    sqlite3 -batch -line vcan.sqlite3 'SELECT * FROM folders'
    sqlite3 -batch -line vcan.sqlite3 'SELECT * FROM applications'
    sqlite3 -batch -line vcan.sqlite3 'SELECT * FROM filed'
    ;;

  "test1")
    rm -rf vcan.sqlite3
    sqlite3 vcan.sqlite3 < schema.sql
    sqlite3 vcan.sqlite3 < test1.sql
  ;;

  *)
    usage
    exit 1
    ;;
esac
