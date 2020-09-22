import requests,json,time
import threading
import datetime
from datetime import datetime
import requests,re,os,json
import time
from bs4 import BeautifulSoup
import numpy as np
import keras
import sys
import shutil
from requests import Session
import PIL.Image as Image
import win32clipboard,win32con
import io
from bidWebsiteOperation import bidWebsiteOperation
from clipboardController import clipboradAction

class bidbuy(clipboradAction,bidWebsiteOperation):
    def __init__(self,maxPrice,main_url,auid,refreshPriceTimer):
        self.bid_model=keras.models.load_model('model/bid_model.h5')
        self.maxPrice = maxPrice
        self.main_url = main_url
        self.auid = auid
        self.refreshPriceTimer = refreshPriceTimer
        self.nowPrice = self.bid_price(self.auid)
        t = threading.Thread(target = self.refreshPrice)
        # 執行更新價格的執行緒
        t.start()
        pass
    def refreshPrice(self):
        while True:
            self.nowPrice = self.bid_price(self.auid)
            time.sleep(float(self.refreshPriceTimer))

    def main(self):
        while True:
            if int(self.nowPrice) >= int(self.maxPrice):
                print ('超過最高投標金額')
                break
            try:
                ReadClipResult = self.ReadClipboard()
                if ReadClipResult == "OK":
                    X = self.processPic_bid('img.jpeg')
                    predicted = ''.join([self.characters[(np.argmax(p))] for p in self.bid_model.predict(X)])
                    print(predicted)
                    self.copy_toClipboard(predicted)
                time.sleep(0.01)
            except:
                pass

main_url='https://shwoo.gov.taipei/shwoo'

diffTime = time.time()-(int(json.loads(requests.post(main_url+'/product/product00/websocket', data={'message':'{"no":4}'}).json())['serverTime'])/1000)

if diffTime > 0:
    print ('結果為正 表示測試的電腦比惜物網"快" %s 秒' % diffTime)
else:
    print ('結果為正 表示測試的電腦比惜物網"慢" %s 秒' % diffTime)
print("請校正您的按鍵精靈啟動時間")


account  = "a0937"#input('02.帳　　號:　') 
auid = "496293"#input('01.投標物件: ')

WebsiteOperation = bidWebsiteOperation(main_url,auid)
WebsiteOperation.check_first_bidder(account)
price_now = WebsiteOperation.bid_price()
maxPrice  = input('02.目前價格$%s，最高投標金額: '% price_now)
refreshPriceTimer  = input('03.價格更新速度/秒: ')
_bidbuy = bidbuy(maxPrice,main_url,auid,refreshPriceTimer)
_bidbuy.main()
