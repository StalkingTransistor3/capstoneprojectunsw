#! /bin/usr/env python3
import socket
import sys

host = socket.gethostname()
ip = socket.gethostbyname(host)

if sys.platform.startswith('linux') or sys.platform.startswith('darwin'):
    frontend = open('frontend/.env', '+w')
    backend = open('backend/.env', '+w')
elif sys.platform.startswith('win32'):
    frontend = open('frontend/.env', '+wb')
    backend = open('backend/.env', '+wb')

backend.write(f"PORT=3000\n")
backend.write(f"MONGO_URI='mongodb://127.0.0.1:27017/spyce'\n")
backend.write(f"SECRET='SPYCY_IS_WRONG_SPELLING'\n")
backend.write(f"EMAIL_VERIFY=1\n")
backend.write(f"DOMAIN='http://{ip}:3001'\n")
backend.write(f"EMAIL_HOOK='https://hooks.zapier.com/hooks/catch/15820316/3mqtab9/'\n")
frontend.write(f"REACT_APP_BASE_URL='http://{ip}:3001'\n")

backend.close()
frontend.close()