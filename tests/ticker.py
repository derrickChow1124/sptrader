import cffi
import os
import sys
import time
import threading
import argparse

location = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, location)
sys.path.insert(0, os.path.join(location, "..", "sptrader"))

import sptrader
import config
import cffi_to_py

parser = argparse.ArgumentParser(description="Generate ticker.")
parser.add_argument('--outfile')
args, instruments = parser.parse_known_args()

print(args, instruments)
cv = threading.Condition()
login = config.logininfo
sp = sptrader.SPTrader()

sp.set_login_info(login['host'],
                  8080,
                  login['license'],
                  login['app_id'],
                  login['user_id'],
                  "test1")


@sp.ffi.callback("ApiTickerUpdateAddr")
def ticker_action(data):
    print(sp.cdata_to_py(data[0]))


@sp.ffi.callback("LoginReplyAddr")
def login_actions(ret_code, ret_msg):
    print("login %d '%s" % (ret_code, sp.ffi.string(ret_msg)))
    print(login['user_id'].encode("utf-8"))
    if ret_code != 0:
        return
    print (instruments)

@sp.ffi.callback("ConnectedReplyAddr")
def connected_reply_func(host_type, con_status):
    print("connected", host_type, con_status)
    if host_type == 83 and con_status == 2:
        sp.register_ticker_update(ticker_action)
        for i in instruments:
            sp.subscribe_ticker(i, 1)

sp.register_login_reply(login_actions)
sp.register_connecting_reply(connected_reply_func)
print(sp.login())
input("Press any key to exit")
sp.logout()
