#!/bin/bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout FinShark.key -out FinShark.crt
# 產生無密碼的 pfx 檔案
# openssl pkcs12 -export -out FinShark.pfx -inkey FinShark.key -in FinShark.crt
# 產生有密碼的 pfx 檔案
openssl pkcs12 -export -out FinShark.pfx -inkey FinShark.key -in FinShark.crt -passout pass:Testing123!