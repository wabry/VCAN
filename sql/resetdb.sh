#!/bin/bash
rm -rf vcan.sqlite3
sqlite3 vcan.sqlite3 < schema.sql
sqlite3 vcan.sqlite3 < data.sql
